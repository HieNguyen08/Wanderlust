package com.wanderlust.api.configure;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor // Sử dụng constructor injection
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    
    // === CÁC DỊCH VỤ ĐƯỢC THÊM VÀO ===
    private final JwtAuthenticationFilter jwtAuthFilter; // 1. Tiêm Filter mới tạo
    private final UserDetailsService userDetailsService; // 2. Tiêm UserDetailsService (là UserService)
    private final PasswordEncoder passwordEncoder;     // 3. Tiêm PasswordEncoder (từ AppConfig)

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    // Các đường dẫn công khai, không cần token
                    auth.requestMatchers("/api/auth/**").permitAll();
                    auth.requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll();
                    
                    // Tất cả các request khác đều phải được xác thực (cần token)
                    auth.anyRequest().authenticated();
                })
                // === THAY ĐỔI QUAN TRỌNG ===
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 4. Tắt session
                .authenticationProvider(authenticationProvider()) // 5. Thêm provider để biết cách lấy user
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // 6. Thêm Filter JWT vào chuỗi
                // === GIỮ NGUYÊN OAUTH2 ===
                .oauth2Login(oauth2 -> {
                    oauth2.successHandler(oAuth2LoginSuccessHandler);
                })
                .build();
    }

    // 7. Bean này "dạy" Spring cách lấy User từ DB
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Dùng UserService
        authProvider.setPasswordEncoder(passwordEncoder); // Dùng BCrypt
        return authProvider;
    }

    // 8. Cập nhật bean AuthenticationManager (cách làm chuẩn)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // (Xóa bean authManager(HttpSecurity http) cũ nếu có)

    // Bean CORS của bạn đã đúng, giữ nguyên
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        return urlBasedCorsConfigurationSource;
    }
}
