package com.wanderlust.api.configure;

import com.wanderlust.api.services.JwtService; // Giả sử bạn có file này
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Dịch vụ xử lý JWT (từ file OAuth2LoginSuccessHandler của bạn)
    private final JwtService jwtService; 
    // Dịch vụ tìm user (chính là UserService của bạn vì nó implement UserDetailsService)
    private final UserDetailsService userDetailsService; 

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Nếu không có header "Authorization" hoặc không bắt đầu bằng "Bearer ", bỏ qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Lấy phần token (bỏ "Bearer ")
        jwt = authHeader.substring(7);

        try {
            // 3. Giải mã token để lấy email (bạn cần đảm bảo JwtService có hàm này)
            userEmail = jwtService.extractUsername(jwt); 
        } catch (Exception e) {
            // Token lỗi/hết hạn
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Nếu có email và user chưa được xác thực trong context
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Tải thông tin User từ DB
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Kiểm tra token có hợp lệ không
            // (Bạn cần đảm bảo JwtService có hàm này)
            if (jwtService.isTokenValid(jwt, userDetails)) { 
                // Tạo một đối tượng xác thực
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Không cần credentials vì đã dùng token
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // 6. Lưu thông tin xác thực vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Chuyển request cho filter tiếp theo
        filterChain.doFilter(request, response);
    }
}