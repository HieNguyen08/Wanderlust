package com.wanderlust.api.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho response từ Stripe Payment Session
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripePaymentResponse {
    
    private String sessionId; // Stripe Session ID
    private String sessionUrl; // URL để redirect khách hàng đến trang thanh toán Stripe
    private String status; // "created", "pending", "complete"
    private String transactionId; // Internal transaction ID của hệ thống
    private Long amount;
    private String currency;
}
