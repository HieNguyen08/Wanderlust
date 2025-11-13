package com.wanderlust.api.service;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.entity.UserVoucher;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.UserVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserVoucherService {

    @Autowired
    private UserVoucherRepository userVoucherRepository;
    
    @Autowired
    private PromotionRepository promotionRepository;

    /**
     * Lưu voucher vào ví của user
     * Validate: voucher phải tồn tại, còn hiệu lực, chưa lưu trước đó
     */
    public UserVoucher saveVoucherToWallet(String userId, String voucherCode) {
        // Check xem đã lưu chưa
        if (userVoucherRepository.existsByUserIdAndVoucherCode(userId, voucherCode)) {
            throw new RuntimeException("Bạn đã lưu voucher này rồi!");
        }
        
        // Tìm promotion theo code
        Optional<Promotion> promotionOpt = promotionRepository.findByCode(voucherCode);
        if (promotionOpt.isEmpty()) {
            throw new RuntimeException("Mã voucher không tồn tại!");
        }
        
        Promotion promotion = promotionOpt.get();
        
        // Check voucher còn hiệu lực không
        LocalDate today = LocalDate.now();
        if (promotion.getStartDate().isAfter(today)) {
            throw new RuntimeException("Voucher chưa có hiệu lực!");
        }
        if (promotion.getEndDate().isBefore(today)) {
            throw new RuntimeException("Voucher đã hết hạn!");
        }
        
        // Check số lượng (nếu có giới hạn)
        if (promotion.getTotalUsesLimit() != null && promotion.getUsedCount() >= promotion.getTotalUsesLimit()) {
            throw new RuntimeException("Voucher đã hết lượt sử dụng!");
        }
        
        // Tạo UserVoucher mới
        UserVoucher userVoucher = new UserVoucher();
        userVoucher.setUserId(userId);
        userVoucher.setPromotionId(promotion.getId());
        userVoucher.setVoucherCode(voucherCode);
        userVoucher.setStatus("AVAILABLE");
        userVoucher.setSavedAt(LocalDateTime.now());
        
        return userVoucherRepository.save(userVoucher);
    }

    /**
     * Lấy tất cả voucher của user
     */
    public List<Map<String, Object>> getUserVouchers(String userId) {
        List<UserVoucher> vouchers = userVoucherRepository.findByUserId(userId);
        return enrichVouchersWithPromotionData(vouchers);
    }

    /**
     * Lấy voucher khả dụng của user với thông tin promotion
     */
    public List<Map<String, Object>> getAvailableVouchers(String userId) {
        List<UserVoucher> vouchers = userVoucherRepository.findAvailableVouchersByUserId(userId);
        return enrichVouchersWithPromotionData(vouchers);
    }

    /**
     * Lấy voucher đã sử dụng của user với thông tin promotion
     */
    public List<Map<String, Object>> getUsedVouchers(String userId) {
        List<UserVoucher> vouchers = userVoucherRepository.findUsedVouchersByUserId(userId);
        return enrichVouchersWithPromotionData(vouchers);
    }
    
    /**
     * Enrich vouchers with promotion data
     */
    private List<Map<String, Object>> enrichVouchersWithPromotionData(List<UserVoucher> vouchers) {
        return vouchers.stream().map(voucher -> {
            Map<String, Object> enrichedVoucher = new HashMap<>();
            
            // Copy voucher data
            enrichedVoucher.put("id", voucher.getId());
            enrichedVoucher.put("voucherCode", voucher.getVoucherCode());
            enrichedVoucher.put("status", voucher.getStatus());
            enrichedVoucher.put("savedAt", voucher.getSavedAt());
            enrichedVoucher.put("usedAt", voucher.getUsedAt());
            enrichedVoucher.put("orderId", voucher.getOrderId());
            enrichedVoucher.put("discountAmount", voucher.getDiscountAmount());
            
            // Get promotion data
            Optional<Promotion> promotionOpt = promotionRepository.findByCode(voucher.getVoucherCode());
            if (promotionOpt.isPresent()) {
                Promotion promotion = promotionOpt.get();
                enrichedVoucher.put("promotion", promotion);
                enrichedVoucher.put("code", promotion.getCode());
                enrichedVoucher.put("title", promotion.getTitle());
                enrichedVoucher.put("description", promotion.getDescription());
                enrichedVoucher.put("type", promotion.getType());
                enrichedVoucher.put("value", promotion.getValue());
                enrichedVoucher.put("maxDiscount", promotion.getMaxDiscount());
                enrichedVoucher.put("minSpend", promotion.getMinSpend());
                enrichedVoucher.put("startDate", promotion.getStartDate());
                enrichedVoucher.put("endDate", promotion.getEndDate());
                enrichedVoucher.put("category", promotion.getCategory());
                enrichedVoucher.put("image", promotion.getImage());
                enrichedVoucher.put("conditions", promotion.getConditions());
            }
            
            return enrichedVoucher;
        }).collect(Collectors.toList());
    }

    /**
     * Đánh dấu voucher đã sử dụng
     */
    public UserVoucher markVoucherAsUsed(String userId, String voucherCode, String orderId, Double discountAmount) {
        Optional<UserVoucher> voucherOpt = userVoucherRepository.findByUserIdAndVoucherCode(userId, voucherCode);
        
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Voucher không tồn tại trong ví của bạn!");
        }
        
        UserVoucher voucher = voucherOpt.get();
        
        if (!"AVAILABLE".equals(voucher.getStatus())) {
            throw new RuntimeException("Voucher không khả dụng!");
        }
        
        // Cập nhật status
        voucher.setStatus("USED");
        voucher.setUsedAt(LocalDateTime.now());
        voucher.setOrderId(orderId);
        voucher.setDiscountAmount(discountAmount);
        
        return userVoucherRepository.save(voucher);
    }

    /**
     * Xóa voucher khỏi ví
     */
    public void deleteVoucher(String userId, String voucherCode) {
        Optional<UserVoucher> voucherOpt = userVoucherRepository.findByUserIdAndVoucherCode(userId, voucherCode);
        
        if (voucherOpt.isPresent()) {
            userVoucherRepository.delete(voucherOpt.get());
        } else {
            throw new RuntimeException("Voucher không tồn tại trong ví của bạn!");
        }
    }

    /**
     * Lấy thống kê voucher của user
     */
    public Map<String, Object> getVoucherStatistics(String userId) {
        List<UserVoucher> availableVouchers = userVoucherRepository.findAvailableVouchersByUserId(userId);
        List<UserVoucher> usedVouchers = userVoucherRepository.findUsedVouchersByUserId(userId);
        
        // Tính tổng tiết kiệm
        double totalSavings = usedVouchers.stream()
            .filter(v -> v.getDiscountAmount() != null)
            .mapToDouble(UserVoucher::getDiscountAmount)
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("availableCount", availableVouchers.size());
        stats.put("usedCount", usedVouchers.size());
        stats.put("totalSavings", totalSavings);
        
        return stats;
    }

    /**
     * Validate voucher trước khi sử dụng
     */
    public Map<String, Object> validateVoucherForUse(String userId, String voucherCode, String category, Double orderAmount) {
        Map<String, Object> result = new HashMap<>();
        
        // Check xem user có voucher này không
        Optional<UserVoucher> userVoucherOpt = userVoucherRepository.findByUserIdAndVoucherCode(userId, voucherCode);
        if (userVoucherOpt.isEmpty()) {
            result.put("valid", false);
            result.put("message", "Bạn chưa lưu voucher này vào ví!");
            return result;
        }
        
        UserVoucher userVoucher = userVoucherOpt.get();
        
        // Check status
        if (!"AVAILABLE".equals(userVoucher.getStatus())) {
            result.put("valid", false);
            result.put("message", "Voucher đã được sử dụng hoặc hết hạn!");
            return result;
        }
        
        // Lấy thông tin promotion
        Optional<Promotion> promotionOpt = promotionRepository.findById(userVoucher.getPromotionId());
        if (promotionOpt.isEmpty()) {
            result.put("valid", false);
            result.put("message", "Voucher không hợp lệ!");
            return result;
        }
        
        Promotion promotion = promotionOpt.get();
        
        // Validate promotion
        LocalDate today = LocalDate.now();
        if (promotion.getStartDate().isAfter(today) || promotion.getEndDate().isBefore(today)) {
            result.put("valid", false);
            result.put("message", "Voucher đã hết hạn hoặc chưa có hiệu lực!");
            return result;
        }
        
        // Check category
        if (!"all".equals(promotion.getCategory()) && !category.equals(promotion.getCategory())) {
            result.put("valid", false);
            result.put("message", "Voucher không áp dụng cho dịch vụ này!");
            return result;
        }
        
        // Check minimum order
        if (promotion.getMinSpend() != null && orderAmount < promotion.getMinSpend()) {
            result.put("valid", false);
            result.put("message", String.format("Đơn hàng tối thiểu %,.0f VNĐ", promotion.getMinSpend()));
            return result;
        }
        
        // Tính discount
        double discountAmount = 0;
        if ("PERCENTAGE".equals(promotion.getType())) {
            discountAmount = orderAmount * (promotion.getValue() / 100.0);
            if (promotion.getMaxDiscount() != null && discountAmount > promotion.getMaxDiscount()) {
                discountAmount = promotion.getMaxDiscount();
            }
        } else {
            discountAmount = promotion.getValue();
        }
        
        result.put("valid", true);
        result.put("message", "Voucher hợp lệ!");
        result.put("discountAmount", discountAmount);
        result.put("promotion", promotion);
        
        return result;
    }
}
