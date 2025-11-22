package com.wanderlust.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "visa_applications")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisaApplication {
    @Id
    private String id;
    
    private String userId;
    private String visaArticleId;
    
    private String fullName;
    private String passportNumber;
    private String nationality;
    private String email;
    private String phoneNumber;
    
    private String status; // PENDING, APPROVED, REJECTED
    private String notes; // Admin notes
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
