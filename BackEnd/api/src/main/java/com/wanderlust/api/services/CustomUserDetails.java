package com.wanderlust.api.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.Role;

public class CustomUserDetails implements UserDetails {
    private String username;
    private String password;
    private List<GrantedAuthority> authorities;
    private String userId;

    public CustomUserDetails(User user) {
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.userId = user.getUserId();
        this.authorities = new ArrayList<>();

        // Add the user's role to the authorities
        if (user.getRole() != null) {
            // **THAY ĐỔI TẠI ĐÂY:**
            // user.getRole() giờ là một đối tượng (ví dụ: enum)
            // Chúng ta dùng .name() để lấy tên của nó (ví dụ: "ADMIN")
            String role = user.getRole().name();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role)); // Thêm "ROLE_" vào trước vai trò
        }
    }

    // Implement other methods from UserDetails interface
    public String getUserId() {
        return userId;
    }


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