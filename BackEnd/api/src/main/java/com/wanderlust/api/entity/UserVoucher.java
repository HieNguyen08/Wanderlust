package com.wanderlust.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "user_vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVoucher {
    
    @Id
    private String id;
    
    @Field("user_id")
    private String userId;
    
    @Field("promotion_id")
    private String promotionId;
    
    @Field("voucher_code")
    private String voucherCode;
    
    @Field("status")
    private String status; // AVAILABLE, USED, EXPIRED
    
    @Field("saved_at")
    private LocalDateTime savedAt;
    
    @Field("used_at")
    private LocalDateTime usedAt;
    
    @Field("order_id")
    private String orderId; // ID đơn hàng đã sử dụng voucher này
    
    @Field("discount_amount")
    private Double discountAmount; // Số tiền đã tiết kiệm khi sử dụng
    
    @Field("notes")
    private String notes;
}
