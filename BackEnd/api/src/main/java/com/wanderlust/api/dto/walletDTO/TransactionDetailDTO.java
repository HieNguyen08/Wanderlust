package  com.wanderlust.api.dto.walletDTO;

import lombok.Data;
import java.math.BigDecimal;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.TransactionStatus;
import java.time.LocalDateTime;

@Data
public class TransactionDetailDTO {
    private String transactionId;
    private String walletId;
    private String userId;
    
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private TransactionStatus status;
    
    // Chi tiết
    private String bookingId; 
    private String paymentMethod;
    private String paymentGatewayRef;
    
    private String serviceName;
    private String vendorName;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private LocalDateTime failedAt;
}