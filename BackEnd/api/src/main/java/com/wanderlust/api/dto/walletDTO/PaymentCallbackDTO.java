package  com.wanderlust.api.dto.walletDTO;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentCallbackDTO {
    // Các trường này phụ thuộc vào tài liệu của cổng thanh toán
    // Đây chỉ là ví dụ
    private String orderId;       // Mã giao dịch của hệ thống mình
    private String paymentCode;   // Mã giao dịch của cổng thanh toán
    private BigDecimal amount;
    private String status;        // "00" (thành công), "01" (thất bại), v.v.
    private String signature;     // Chữ ký để xác thực
    private long timestamp;
}