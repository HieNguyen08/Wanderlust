package com.wanderlust.api.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho request tạo Stripe Payment Session
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripePaymentRequest {
    
    private String bookingId;
    private String userId;
    private Long amount; // Số tiền (đã ở đơn vị nhỏ nhất: VND không có decimal, USD x100)
    private String currency; // "vnd", "usd"
    private String productName; // Tên sản phẩm/dịch vụ
    private String description; // Mô tả
    
    // Thông tin khách hàng (optional)
    private String customerEmail;
    private String customerName;
    
    // Metadata tùy chỉnh
    private String metadata;
}
