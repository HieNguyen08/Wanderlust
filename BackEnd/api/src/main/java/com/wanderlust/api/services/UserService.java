package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.entity.types.WalletStatus;
import com.wanderlust.api.repository.UserRepository;
import com.wanderlust.api.repository.WalletRepository;

@Service
public class UserService implements BaseServices<User> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;
    
    public UserService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      @Lazy WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.walletRepository = walletRepository;
    }

    // Get all users
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // Add a user (Dùng bởi Admin Controller)
    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
        
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        user.setCreatedAt(LocalDateTime.now());
        user.setIsBlocked(false);
        if (user.getMembershipLevel() == null) user.setMembershipLevel(com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        if (user.getLoyaltyPoints() == null) user.setLoyaltyPoints(0);
        if (user.getTotalTrips() == null) user.setTotalTrips(0);
        if (user.getTotalReviews() == null) user.setTotalReviews(0);


        return userRepository.insert(user);
    }

    // Update an existing user
    public User update(User user) {
        User updatedUser  = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User  not found with id " + user.getUserId()));

        if (user.getFirstName() != null) updatedUser .setFirstName(user.getFirstName());
        if (user.getLastName() != null) updatedUser .setLastName(user.getLastName());
        if (user.getAvatar() != null) updatedUser .setAvatar(user.getAvatar());
        if (user.getGender() != null) updatedUser .setGender(user.getGender()); 
        if (user.getEmail() != null) updatedUser .setEmail(user.getEmail());
        if (user.getMobile() != null) updatedUser .setMobile(user.getMobile());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            updatedUser.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
            updatedUser.setPasswordChangeAt(LocalDateTime.now()); // **Ghi lại thời gian**
        }
        // **BẢO VỆ ROLE ADMIN: Chỉ cho phép đổi giữa USER và VENDOR**
        if (user.getRole() != null) {
            // Không cho phép đổi sang ADMIN
            if (user.getRole() == Role.ADMIN) {
                throw new RuntimeException("Không thể thay đổi role thành ADMIN. Role ADMIN được bảo vệ.");
            }
            // Không cho phép đổi role nếu user hiện tại đang là ADMIN
            if (updatedUser.getRole() == Role.ADMIN) {
                throw new RuntimeException("Không thể thay đổi role của tài khoản ADMIN.");
            }
            // Chỉ cho phép đổi giữa USER và VENDOR
            if (user.getRole() == Role.USER || user.getRole() == Role.VENDOR) {
                updatedUser.setRole(user.getRole());
            }
        }
        if (user.getAddress() != null) updatedUser .setAddress(user.getAddress());
        if (user.getIsBlocked() != null) updatedUser .setIsBlocked(user.getIsBlocked());
        
        if (user.getDateOfBirth() != null) updatedUser.setDateOfBirth(user.getDateOfBirth());
        if (user.getCity() != null) updatedUser.setCity(user.getCity());
        if (user.getCountry() != null) updatedUser.setCountry(user.getCountry());
        if (user.getPassportNumber() != null) updatedUser.setPassportNumber(user.getPassportNumber());
        if (user.getPassportExpiryDate() != null) updatedUser.setPassportExpiryDate(user.getPassportExpiryDate());
        if (user.getMembershipLevel() != null) updatedUser.setMembershipLevel(user.getMembershipLevel());
		if (user.getLoyaltyPoints() != null) updatedUser.setLoyaltyPoints(user.getLoyaltyPoints());
		if (user.getTotalTrips() != null) updatedUser.setTotalTrips(user.getTotalTrips());
		if (user.getTotalReviews() != null) updatedUser.setTotalReviews(user.getTotalReviews());
        if (user.getVendorRequestStatus() != null) updatedUser.setVendorRequestStatus(user.getVendorRequestStatus());

        updatedUser.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(updatedUser );
    }

    // Delete a user by ID
    public void delete(String id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User  not found with id " + id);
        }
    }

    // Delete all users
    public void deleteAll() {
        userRepository.deleteAll();
    }

    // Get a specific user by id
    public User findByID(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User  not found with id " + id));
    }


    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        user.setIsBlocked(false);
        user.setCreatedAt(LocalDateTime.now());
        if (user.getMembershipLevel() == null) user.setMembershipLevel(com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        if (user.getLoyaltyPoints() == null) user.setLoyaltyPoints(0);
        if (user.getTotalTrips() == null) user.setTotalTrips(0);
        if (user.getTotalReviews() == null) user.setTotalReviews(0);
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOptional = findByEmail(email);
        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {
            User user = userOptional.get();
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            return userOptional;
        }
        return Optional.empty();
    }

        // **PHƯƠNG THỨC MỚI: Tạo người dùng OAuth2 (Google/Facebook)**
    public User createOauthUser(String email, String name, String avatarUrl) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setAvatar(avatarUrl);
        
        String[] names = name.split(" ", 2);
        newUser.setFirstName(names[0]);
        if (names.length > 1) {
            newUser.setLastName(names[1]);
        } else {
            newUser.setLastName(""); // Hoặc để null tùy logic
        }

        newUser.setRole(Role.USER); // **Mặc định là USER**
        newUser.setIsBlocked(false); // **Mặc định là không khóa**
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setMembershipLevel(com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        newUser.setLoyaltyPoints(0);
        newUser.setTotalTrips(0);
        newUser.setTotalReviews(0);

        User savedUser = userRepository.insert(newUser);
        
        // **TỰ ĐỘNG TẠO WALLET CHO USER MỚI**
        try {
            Wallet newWallet = Wallet.builder()
                    .userId(savedUser.getUserId())
                    .balance(BigDecimal.ZERO)
                    .currency("VND")
                    .totalTopUp(BigDecimal.ZERO)
                    .totalSpent(BigDecimal.ZERO)
                    .totalRefund(BigDecimal.ZERO)
                    .status(WalletStatus.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            walletRepository.save(newWallet);
            System.out.println("✅ Created wallet for new OAuth user: " + savedUser.getUserId());
        } catch (Exception e) {
            System.err.println("❌ Failed to create wallet for new OAuth user: " + savedUser.getUserId());
            e.printStackTrace();
        }
        
        return savedUser;
    }

}