package com.wanderlust.api.dto.visa;

import lombok.Data;

@Data
public class VisaApplicationCreateDTO {
    private String visaArticleId;
    private String fullName;
    private String passportNumber;
    private String nationality;
    private String email;
    private String phoneNumber;
}
