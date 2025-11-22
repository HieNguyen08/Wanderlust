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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.api.entity.User;
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


    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) oAuth2AuthenticationToken.getPrincipal();
        Map<String, Object> attributes = defaultOAuth2User.getAttributes();
        String email = attributes.getOrDefault("email", "").toString();
        String name = attributes.getOrDefault("name", "").toString();
        String avatarUrl = "";

        String provider = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId();

        if ("google".equals(provider)) {
            avatarUrl = attributes.getOrDefault("picture", "").toString();
        } else if ("facebook".equals(provider)) {
            avatarUrl = resolveFacebookAvatar(attributes);
        }
        
        if (email.isEmpty()) {
            // Nếu không có email, không thể tiếp tục
            String redirectUrl = frontendUrl + "/login?error=EmailNotFound";
            response.sendRedirect(redirectUrl);
            return;
        }

        // **THAY ĐỔI: Logic TÌM HOẶC TẠO (FIND OR CREATE)**
        Optional<User> optionalUser = userService.findByEmail(email);
        User user;

        if (optionalUser.isPresent()) {
            // 1. Nếu tìm thấy: Sử dụng người dùng hiện có
            user = optionalUser.get();
            // Cập nhật avatar nếu có giá trị mới hợp lệ
            if (avatarUrl != null && !avatarUrl.isBlank() && !avatarUrl.equals(user.getAvatar())) {
                user.setAvatar(avatarUrl);
                userService.update(user); // Cập nhật lại avatar
            } else if ((avatarUrl == null || avatarUrl.isBlank()) && user.getAvatar() != null) {
                avatarUrl = user.getAvatar();
            }
        } else {
            // 2. Nếu không tìm thấy: Tạo người dùng mới
            user = userService.createOauthUser(email, name, avatarUrl);
        }

        CustomOAuth2User oauth2User = new CustomOAuth2User(user, attributes);
        Authentication newAuthentication = new OAuth2AuthenticationToken(
            oauth2User,
            oauth2User.getAuthorities(),
            oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
        );
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);
        
        String jwtToken = jwtService.generateToken(user);
        String username = String.format("%s %s", user.getFirstName(), user.getLastName()).trim();
        
        String encodedJwtToken = URLEncoder.encode(jwtToken, StandardCharsets.UTF_8.toString());
        String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8.toString());
        if ((avatarUrl == null || avatarUrl.isBlank()) && user.getAvatar() != null) {
            avatarUrl = user.getAvatar();
        }

        String encodedAvatarUrl = URLEncoder.encode(avatarUrl, StandardCharsets.UTF_8.toString());
        
        String redirectUrl = frontendUrl + "/login-success?token=" + encodedJwtToken + "&username=" + encodedUsername + "&avatar=" + encodedAvatarUrl;        
        response.sendRedirect(redirectUrl);
    }

    private String resolveFacebookAvatar(Map<String, Object> attributes) {
        if (attributes == null || attributes.isEmpty()) {
            return buildGraphApiAvatar(attributes);
        }
        
        log.info("Facebook attributes: {}", attributes);
        
        try {
            // Facebook trả về picture.data.url theo cấu trúc Graph API
            Object pictureObj = attributes.get("picture");
            
            if (pictureObj instanceof Map<?, ?> pictureMap) {
                String url = extractFromPictureMap(pictureMap);
                if (url != null && !url.isBlank()) {
                    log.info("Successfully extracted Facebook avatar URL: {}", url);
                    return url;
                }
            }
            
            // Nếu picture là String (URL trực tiếp)
            if (pictureObj instanceof String pictureStr && !pictureStr.isBlank()) {
                if (pictureStr.startsWith("http")) {
                    log.info("Facebook avatar URL (direct string): {}", pictureStr);
                    return pictureStr;
                }
                // Thử parse nếu là JSON string
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> pictureMap = OBJECT_MAPPER.readValue(pictureStr, Map.class);
                    String url = extractFromPictureMap(pictureMap);
                    if (url != null && !url.isBlank()) {
                        return url;
                    }
                } catch (JsonProcessingException e) {
                    log.warn("Failed to parse picture string as JSON: {}", pictureStr);
                }
            }
        } catch (Exception e) {
            log.error("Unexpected error while resolving Facebook avatar", e);
        }
        
        // Fallback: Sử dụng Graph API với ID
        String fallbackUrl = buildGraphApiAvatar(attributes);
        log.info("Using fallback Graph API URL: {}", fallbackUrl);
        return fallbackUrl;
    }

    private String extractFromPictureMap(Map<?, ?> pictureMap) {
        if (pictureMap == null || pictureMap.isEmpty()) {
            return "";
        }
        
        // Cấu trúc chuẩn: picture.data.url
        Object dataObj = pictureMap.get("data");
        if (dataObj instanceof Map<?, ?> dataMap) {
            Object urlObj = dataMap.get("url");
            if (urlObj != null && !urlObj.toString().isBlank()) {
                String url = urlObj.toString();
                
                // Kiểm tra is_silhouette - nếu là ảnh mặc định thì có thể bỏ qua
                Object isSilhouette = dataMap.get("is_silhouette");
                if (isSilhouette instanceof Boolean && (Boolean) isSilhouette) {
                    log.info("Facebook avatar is silhouette (default image), URL: {}", url);
                    // Vẫn trả về URL, frontend có thể quyết định hiển thị hay không
                }
                
                return url;
            }
        }
        
        // Fallback: Nếu url nằm trực tiếp trong pictureMap (một số trường hợp đặc biệt)
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