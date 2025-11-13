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
            // Facebook trả về avatar trong cấu trúc data.url
            if (attributes.containsKey("picture")) {
                Map<String, Object> pictureObj = (Map<String, Object>) attributes.get("picture");
                if (pictureObj.containsKey("data")) {
                    Map<String, Object> dataObj = (Map<String, Object>) pictureObj.get("data");
                    if (dataObj.containsKey("url")) {
                        avatarUrl = (String) dataObj.get("url");
                    }
                }
            }
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
            // (Tùy chọn: Cập nhật avatar nếu avatar mới khác avatar cũ)
            if (avatarUrl != null && user.getAvatar() == null ) {
                user.setAvatar(avatarUrl);
                userService.update(user); // Cập nhật lại avatar
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
        String encodedAvatarUrl = URLEncoder.encode(avatarUrl, StandardCharsets.UTF_8.toString());
        
        String redirectUrl = frontendUrl + "/login-success?token=" + encodedJwtToken + "&username=" + encodedUsername + "&avatar=" + encodedAvatarUrl;        
        response.sendRedirect(redirectUrl);
    }
}