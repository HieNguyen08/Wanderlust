package com.wanderlust.api.dto.visa;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VisaApplicationDTO {
    private String id;
    private String userId;
    private String visaArticleId;
    private String visaCountry; // From VisaArticle
    private String visaTitle;   // From VisaArticle
    
    private String fullName;
    private String passportNumber;
    private String nationality;
    private String email;
    private String phoneNumber;
    
    private String status;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
