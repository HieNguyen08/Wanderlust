package com.wanderlust.api.configure;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.AuthProvider;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.JwtService;
import com.wanderlust.api.services.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    private static final String FACEBOOK_GRAPH_PICTURE_URL = "https://graph.facebook.com/%s/picture?type=large";
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final int COOKIE_EXPIRY_SECONDS = 300;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) oAuth2AuthenticationToken.getPrincipal();
        Map<String, Object> attributes = defaultOAuth2User.getAttributes();

        String registrationId = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId();
        AuthProvider authProvider;
        try {
            authProvider = AuthProvider.valueOf(registrationId.toUpperCase());
        } catch (IllegalArgumentException ex) {
            log.warn("Unsupported OAuth2 provider: {}", registrationId);
            response.sendRedirect(frontendUrl + "/login?error=UnsupportedProvider");
            return;
        }

        String email = attributes.getOrDefault("email", "").toString();

        if (AuthProvider.GOOGLE.equals(authProvider)) {
            Object verifiedObj = attributes.get("email_verified");
            boolean isVerified = false;
            if (verifiedObj instanceof Boolean boolVal) {
                isVerified = boolVal;
            } else if (verifiedObj != null) {
                isVerified = Boolean.parseBoolean(verifiedObj.toString());
            }

            if (!isVerified) {
                log.warn("User tried to login with unverified Google email: {}", email);
                response.sendRedirect(frontendUrl + "/login?error=EmailNotVerifiedFromProvider");
                return;
            }
        }

        if (email.isEmpty()) {
            response.sendRedirect(frontendUrl + "/login?error=EmailNotFound");
            return;
        }

        String name = attributes.getOrDefault("name", "").toString();
        String providerId = attributes.getOrDefault("sub", attributes.getOrDefault("id", "")).toString();
        String avatarUrl = "";

        if (AuthProvider.GOOGLE.equals(authProvider)) {
            avatarUrl = attributes.getOrDefault("picture", "").toString();
        } else if (AuthProvider.FACEBOOK.equals(authProvider)) {
            avatarUrl = resolveFacebookAvatar(attributes);
        }

        Optional<User> optionalUser = userService.findByEmail(email);
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();

            if (user.getProvider() == AuthProvider.LOCAL && authProvider != AuthProvider.LOCAL) {
                String redirectUrl = frontendUrl + "/login-success?error=merge_required"
                        + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                        + "&provider=" + URLEncoder.encode(registrationId, StandardCharsets.UTF_8)
                        + "&avatar=" + URLEncoder.encode(avatarUrl == null ? "" : avatarUrl, StandardCharsets.UTF_8);
                response.sendRedirect(redirectUrl);
                return;
            }

            boolean needUpdate = false;

            if (avatarUrl != null && !avatarUrl.isBlank() && !avatarUrl.equals(user.getAvatar())) {
                user.setAvatar(avatarUrl);
                needUpdate = true;
            } else if ((avatarUrl == null || avatarUrl.isBlank()) && user.getAvatar() != null) {
                avatarUrl = user.getAvatar();
            }

            if (user.getProvider() == null) {
                user.setProvider(authProvider);
                needUpdate = true;
            }

            if (user.getProviderId() == null && providerId != null && !providerId.isBlank()) {
                user.setProviderId(providerId);
                needUpdate = true;
            }

            if (needUpdate) {
                userService.update(user);
            }
        } else {
            user = userService.createOauthUser(email, name, avatarUrl, authProvider, providerId);
        }

        CustomOAuth2User oauth2User = new CustomOAuth2User(user, attributes);
        Authentication newAuthentication = new OAuth2AuthenticationToken(
            oauth2User,
            oauth2User.getAuthorities(),
            registrationId
        );
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);

        String jwtToken = jwtService.generateToken(user);

        // Set cookie with appropriate SameSite/Secure depending on environment
        boolean secureRequest = request.isSecure();
        String sameSite = secureRequest ? "None" : "Lax"; // None requires Secure; Lax works for local http

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", jwtToken)
            .path("/")
            .maxAge(COOKIE_EXPIRY_SECONDS)
            .httpOnly(false) // frontend reads then stores
            .secure(secureRequest)
            .sameSite(sameSite)
            .build();
        response.addHeader("Set-Cookie", accessTokenCookie.toString());

        // Always include token on URL as a fallback (dev-friendly, avoids cookie/SameSite issues)
        String username = String.format("%s %s", user.getFirstName(), user.getLastName()).trim();
        String redirectUrl = frontendUrl + "/login-success"
            + "?token=" + URLEncoder.encode(jwtToken, StandardCharsets.UTF_8)
            + "&username=" + URLEncoder.encode(username, StandardCharsets.UTF_8)
            + "&avatar=" + URLEncoder.encode(avatarUrl == null ? "" : avatarUrl, StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }

    private String resolveFacebookAvatar(Map<String, Object> attributes) {
        if (attributes == null || attributes.isEmpty()) {
            return buildGraphApiAvatar(attributes);
        }

        try {
            Object pictureObj = attributes.get("picture");

            if (pictureObj instanceof Map<?, ?> pictureMap) {
                String url = extractFromPictureMap(pictureMap);
                if (url != null && !url.isBlank()) {
                    return url;
                }
            }

            if (pictureObj instanceof String pictureStr && !pictureStr.isBlank()) {
                if (pictureStr.startsWith("http")) {
                    return pictureStr;
                }
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> pictureMap = OBJECT_MAPPER.readValue(pictureStr, Map.class);
                    String url = extractFromPictureMap(pictureMap);
                    if (url != null && !url.isBlank()) {
                        return url;
                    }
                } catch (JsonProcessingException e) {
                    log.warn("Failed to parse picture string as JSON");
                }
            }
        } catch (Exception e) {
            log.error("Unexpected error while resolving Facebook avatar", e);
        }

        return buildGraphApiAvatar(attributes);
    }

    private String extractFromPictureMap(Map<?, ?> pictureMap) {
        if (pictureMap == null || pictureMap.isEmpty()) {
            return "";
        }

        Object dataObj = pictureMap.get("data");
        if (dataObj instanceof Map<?, ?> dataMap) {
            Object urlObj = dataMap.get("url");
            if (urlObj != null && !urlObj.toString().isBlank()) {
                return urlObj.toString();
            }
        }

        Object urlObj = pictureMap.get("url");
        if (urlObj != null && !urlObj.toString().isBlank()) {
            return urlObj.toString();
        }

        return "";
    }

    private String buildGraphApiAvatar(Map<String, Object> attributes) {
        if (attributes != null && attributes.containsKey("id")) {
            String facebookId = String.valueOf(attributes.get("id"));
            return String.format(FACEBOOK_GRAPH_PICTURE_URL, facebookId);
        }
        return "";
    }
}