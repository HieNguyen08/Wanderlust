package com.wanderlust.api.configure;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.JwtService;
import com.wanderlust.api.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;
    User user;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    String jwtToken = null;
    String username = null;
    String avatarUrl = null;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) oAuth2AuthenticationToken.getPrincipal();
        Map<String, Object> attributes = defaultOAuth2User.getAttributes();
        String email = attributes.getOrDefault("email", "").toString();
        String name = attributes.getOrDefault("name", "").toString();
        if("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            avatarUrl = attributes.getOrDefault("picture", "").toString();
            Optional<User> optionalUser = userService.findByEmail(email);
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
                username = user.getFirstName() + user.getLastName();
            } else {
                String redirectUrl = frontendUrl + "/login?error=UserNotFound";
                response.sendRedirect(redirectUrl);
                return;
            }
        }
        if("facebook".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            Optional<User> optionalUser = userService.findByEmail(email);
                    
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
                username = user.getFirstName() + user.getLastName();
            } else {
                String redirectUrl = frontendUrl + "/login?error=UserNotFound";
                response.sendRedirect(redirectUrl);
                return;
            }
        }
        CustomOAuth2User oauth2User = new CustomOAuth2User(user, attributes);
        Authentication newAuthentication = new OAuth2AuthenticationToken(
            oauth2User,
            oauth2User.getAuthorities(),
            oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
        );
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);
        jwtToken = jwtService.generateToken(user);
        String encodedJwtToken = URLEncoder.encode(jwtToken, StandardCharsets.UTF_8.toString());
        String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8.toString());
        String encodedAvatarUrl = URLEncoder.encode(avatarUrl, StandardCharsets.UTF_8.toString());
        String redirectUrl = frontendUrl + "/login-success?token=" + encodedJwtToken + "&username=" + encodedUsername + "&avatar=" + encodedAvatarUrl;        
        response.sendRedirect(redirectUrl);
    }
}