package com.wanderlust.api.configure;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
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
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                
                // === PHÂN QUYỀN HTTP REQUEST (Chiến lược "Default-Deny") ===
                .authorizeHttpRequests(auth -> {
                    
                    // 1. CÁC ENDPOINT LUÔN PUBLIC (Không cần token)
                    //-----------------------------------------------------
                    
                    // A. Xác thực (Đăng nhập, Đăng ký, OAuth)
                    auth.requestMatchers("/api/auth/**").permitAll();
                    auth.requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll();
                    
                    // B. Webhooks & Callbacks (Từ hệ thống bên ngoài)
                    auth.requestMatchers(HttpMethod.POST, "/api/payments/callback/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/v1/wallet/topup/callback").permitAll();

                    // C. Tracking quảng cáo (Public)
                    auth.requestMatchers(HttpMethod.POST, "/api/advertisements/*/track-impression").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/advertisements/*/track-click").permitAll();

                    // D. API GET Public (Cho phép khách xem/tìm kiếm)
                    auth.requestMatchers(HttpMethod.GET,
                        "/api/activities", "/api/activities/**",
                        "/api/car-rentals", "/api/car-rentals/**",
                        "/api/flights", "/api/flights/**",
                        "/api/hotels", "/api/hotels/**",
                        "/api/locations", "/api/locations/**",
                        "/api/promotions", "/api/promotions/**",
                        "/api/reviews", "/api/reviews/{id}", // Cho xem list & chi tiết
                        "/api/rooms/{id}", "/api/rooms/{id}/availability", // Cho xem chi tiết phòng
                        "/api/travelguides", "/api/travelguides/**",
                        "/api/visa-articles", "/api/visa-articles/**"
                    ).permitAll();
                    
                    //-----------------------------------------------------
                    // 2. TẤT CẢ CÁC REQUEST KHÁC
                    //-----------------------------------------------------
                    // Bất kỳ request nào còn lại (bao gồm GET /api/v1/wallet, GET /api/v1/users/me,
                    // GET /api/admin/**, POST /api/bookings, v.v.)
                    // đều BẮT BUỘC phải được xác thực (có token).
                    auth.anyRequest().authenticated();
                })
                // ==========================================================
                
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        // Trả về 401 thay vì redirect sang trang login
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler)
                        .loginPage("/oauth2/authorization/google") // Ngăn trang login mặc định
                )
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}