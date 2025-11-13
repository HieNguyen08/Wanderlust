package com.wanderlust.api.controller;

import com.wanderlust.api.entity.UserVoucher;
import com.wanderlust.api.service.UserVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user-vouchers")
@CrossOrigin(origins = "*")
public class UserVoucherController {

    @Autowired
    private UserVoucherService userVoucherService;

    /**
     * Helper method để lấy userId từ JWT token
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }
        return authentication.getName(); // userId từ JWT
    }

    /**
     * Lưu voucher vào ví
     * POST /api/v1/user-vouchers/save
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveVoucherToWallet(@RequestBody Map<String, String> request) {
        try {
            String userId = getCurrentUserId();
            String voucherCode = request.get("voucherCode");
            
            if (voucherCode == null || voucherCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập mã voucher!"));
            }
            
            UserVoucher savedVoucher = userVoucherService.saveVoucherToWallet(userId, voucherCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã lưu voucher vào ví thành công!");
            response.put("voucher", savedVoucher);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    /**
     * Lấy tất cả voucher của user
     * GET /api/v1/user-vouchers
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUserVouchers() {
        try {
            String userId = getCurrentUserId();
            List<Map<String, Object>> vouchers = userVoucherService.getUserVouchers(userId);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy voucher khả dụng
     * GET /api/v1/user-vouchers/available
     */
    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableVouchers() {
        try {
            String userId = getCurrentUserId();
            List<Map<String, Object>> vouchers = userVoucherService.getAvailableVouchers(userId);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy voucher đã sử dụng
     * GET /api/v1/user-vouchers/used
     */
    @GetMapping("/used")
    public ResponseEntity<List<Map<String, Object>>> getUsedVouchers() {
        try {
            String userId = getCurrentUserId();
            List<Map<String, Object>> vouchers = userVoucherService.getUsedVouchers(userId);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy thống kê voucher
     * GET /api/v1/user-vouchers/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getVoucherStatistics() {
        try {
            String userId = getCurrentUserId();
            Map<String, Object> stats = userVoucherService.getVoucherStatistics(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Validate voucher trước khi sử dụng
     * POST /api/v1/user-vouchers/validate
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateVoucher(@RequestBody Map<String, Object> request) {
        try {
            String userId = getCurrentUserId();
            String voucherCode = (String) request.get("voucherCode");
            String category = (String) request.get("category");
            Double orderAmount = Double.valueOf(request.get("orderAmount").toString());
            
            Map<String, Object> result = userVoucherService.validateVoucherForUse(userId, voucherCode, category, orderAmount);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Đánh dấu voucher đã sử dụng
     * POST /api/v1/user-vouchers/use
     */
    @PostMapping("/use")
    public ResponseEntity<?> useVoucher(@RequestBody Map<String, Object> request) {
        try {
            String userId = getCurrentUserId();
            String voucherCode = (String) request.get("voucherCode");
            String orderId = (String) request.get("orderId");
            Double discountAmount = Double.valueOf(request.get("discountAmount").toString());
            
            UserVoucher updatedVoucher = userVoucherService.markVoucherAsUsed(userId, voucherCode, orderId, discountAmount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã sử dụng voucher thành công!");
            response.put("voucher", updatedVoucher);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    /**
     * Xóa voucher khỏi ví
     * DELETE /api/v1/user-vouchers/{voucherCode}
     */
    @DeleteMapping("/{voucherCode}")
    public ResponseEntity<?> deleteVoucher(@PathVariable String voucherCode) {
        try {
            String userId = getCurrentUserId();
            userVoucherService.deleteVoucher(userId, voucherCode);
            
            return ResponseEntity.ok(Map.of("message", "Đã xóa voucher khỏi ví!"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
}
