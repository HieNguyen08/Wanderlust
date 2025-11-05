package com.wanderlust.api.services;

import com.wanderlust.api.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final String SECRET_KEY = "604538caeed352290a70c4f8bdb88c8d3fe19f8273ccaab07fe4cf86052c5875";
    private final long EXPIRATION_TIME = 1000 * 60 * 60;

    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
 

    public String generateToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        
        // **THAY ĐỔI: Thêm Role và Gender vào claims**
        // Chúng ta dùng .name() để lưu trữ chuỗi ("USER", "MALE"...)
        if (user.getRole() != null) {
            claims.put("role", user.getRole().name());
        }
        if (user.getGender() != null) {
            claims.put("gender", user.getGender().name());
        }
        // ---------------------------------------------

        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("avatar", user.getAvatar());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
}