package com.wanderlust.api.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.wanderlust.api.entity.User;

public class CustomUserDetails implements UserDetails {
    private String username;
    private String password;
    private List<GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.authorities = new ArrayList<>();

        // Add the user's role to the authorities
        if (user.getRole() != null) {
            // Assuming user.getRole() returns a string like "ADMIN" or "USER"
            String role = user.getRole().toUpperCase(); // Chuyển đổi thành chữ hoa để đảm bảo tính nhất quán
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role)); // Thêm "ROLE_" vào trước vai trò
        }
    }

    // Implement other methods from UserDetails interface
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Implement your logic here
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Implement your logic here
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Implement your logic here
    }

    @Override
    public boolean isEnabled() {
        return true; // Implement your logic here
    }
}