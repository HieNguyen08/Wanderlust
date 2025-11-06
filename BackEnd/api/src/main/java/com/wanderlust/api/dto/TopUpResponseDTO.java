package com.wanderlust.api.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class TopUpResponseDTO {
    private String transactionId; // Mã giao dịch của hệ thống mình
    private String paymentUrl;    // URL để redirect người dùng đến cổng thanh toán
    private String paymentId;     // Mã giao dịch của bên thứ 3 (nếu có)
}