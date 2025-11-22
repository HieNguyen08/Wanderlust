package com.wanderlust.api.dto.visa;

import lombok.Data;

@Data
public class VisaApplicationStatusDTO {
    private String status; // APPROVED, REJECTED
    private String notes;
}
