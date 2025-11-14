package  com.wanderlust.api.repository;

import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends MongoRepository<WalletTransaction, String> {

    Page<WalletTransaction> findByUserId(String userId, Pageable pageable);
    
    Page<WalletTransaction> findByUserIdAndType(String userId, TransactionType type, Pageable pageable);
    
    Page<WalletTransaction> findByUserIdAndStatus(String userId, TransactionStatus status, Pageable pageable);
    
    List<WalletTransaction> findByBookingId(String bookingId);
    
    Page<WalletTransaction> findByStatus(TransactionStatus status, Pageable pageable);
    
    Page<WalletTransaction> findByTypeAndStatus(TransactionType type, TransactionStatus status, Pageable pageable);

    @Query("{ 'userId': ?0, 'type': ?1, 'status': 'COMPLETED' }")
    List<WalletTransaction> findCompletedByUserIdAndType(String userId, TransactionType type);
    
    Page<WalletTransaction> findByUserIdAndTypeAndStatus(String userId, TransactionType type, TransactionStatus status, Pageable pageable);
}