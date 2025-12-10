package com.wanderlust.api.configure;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.types.Gender;
import com.wanderlust.api.entity.types.MembershipLevel;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.entity.types.WalletStatus;
import com.wanderlust.api.repository.UserRepository;
import com.wanderlust.api.repository.WalletRepository;

import lombok.RequiredArgsConstructor;

/**
 * DataInitializer - Component tự động chạy khi backend khởi động
 * Đảm bảo tài khoản ADMIN luôn tồn tại trong database
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    // Thông tin tài khoản admin mặc định
    private static final String ADMIN_EMAIL = "admin123@gmail.com";
    private static final String ADMIN_RAW_PASSWORD = "Admin@123"; // Mật khẩu gốc
    private static final String ADMIN_USER_ID = "6933449352d16736c044ad44";
    private static final String ADMIN_WALLET_ID = "6933449352d16736c044ad45";

    @Override
    public void run(String... args) throws Exception {
        initializeAdminAccount();
    }

    /**
     * Kiểm tra và tạo tài khoản admin nếu chưa tồn tại
     */
    private void initializeAdminAccount() {
        try {
            // Kiểm tra xem đã có tài khoản admin chưa
            boolean adminExists = userRepository.findByEmail(ADMIN_EMAIL).isPresent();

            if (!adminExists) {
                System.out.println("🔧 Không tìm thấy tài khoản ADMIN. Đang tạo tài khoản admin mặc định...");
                createDefaultAdminAccount();
                System.out.println("✅ Đã tạo thành công tài khoản ADMIN và ví tương ứng!");
            } else {
                System.out.println("✅ Tài khoản ADMIN đã tồn tại. Bỏ qua khởi tạo.");
                
                // Kiểm tra và tạo ví nếu admin chưa có ví
                User admin = userRepository.findByEmail(ADMIN_EMAIL).get();
                if (!walletRepository.findByUserId(admin.getUserId()).isPresent()) {
                    System.out.println("🔧 Tài khoản ADMIN chưa có ví. Đang tạo ví...");
                    createWalletForAdmin(admin.getUserId());
                    System.out.println("✅ Đã tạo ví cho tài khoản ADMIN!");
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi khởi tạo tài khoản ADMIN: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Tạo tài khoản admin mặc định với thông tin cố định
     */
    private void createDefaultAdminAccount() {
        // Tạo User admin
        User admin = User.builder()
                .userId(ADMIN_USER_ID)
                .firstName("Trị Viên Admin")
                .lastName("Quản")
                .gender(Gender.OTHER)
                .email(ADMIN_EMAIL)
                .mobile("0906482890")
                .password(passwordEncoder.encode(ADMIN_RAW_PASSWORD))
                .role(Role.ADMIN)
                .dateOfBirth(LocalDate.of(2025, 12, 4)) // 2025-12-03T17:00:00Z UTC+7
                .address("220/2/25 TL19 Khu phố 3C")
                .city("Thành phố Hồ Chí Minh")
                .country("VN")
                .membershipLevel(MembershipLevel.BRONZE)
                .loyaltyPoints(0)
                .totalTrips(0)
                .totalReviews(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isBlocked(false)
                .build();

        // Lưu admin user
        User savedAdmin = userRepository.save(admin);

        // Tạo ví cho admin
        createWalletForAdmin(savedAdmin.getUserId());
    }

    /**
     * Tạo ví cho tài khoản admin
     */
    private void createWalletForAdmin(String userId) {
        Wallet adminWallet = Wallet.builder()
                .walletId(ADMIN_WALLET_ID)
                .userId(userId)
                .balance(BigDecimal.ZERO)
                .currency("VND")
                .totalTopUp(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .totalRefund(BigDecimal.ZERO)
                .status(WalletStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        walletRepository.save(adminWallet);
    }
}
