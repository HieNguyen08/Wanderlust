package com.wanderlust.api.services;

import com.wanderlust.api.dto.visa.VisaApplicationCreateDTO;
import com.wanderlust.api.dto.visa.VisaApplicationDTO;
import com.wanderlust.api.dto.visa.VisaApplicationStatusDTO;
import com.wanderlust.api.entity.VisaApplication;
import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.repository.VisaApplicationRepository;
import com.wanderlust.api.repository.VisaArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisaApplicationService {

    private final VisaApplicationRepository visaApplicationRepository;
    private final VisaArticleRepository visaArticleRepository;

    public VisaApplicationDTO createApplication(VisaApplicationCreateDTO createDTO, String userId) {
        VisaApplication application = VisaApplication.builder()
                .userId(userId)
                .visaArticleId(createDTO.getVisaArticleId())
                .fullName(createDTO.getFullName())
                .passportNumber(createDTO.getPassportNumber())
                .nationality(createDTO.getNationality())
                .email(createDTO.getEmail())
                .phoneNumber(createDTO.getPhoneNumber())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        VisaApplication saved = visaApplicationRepository.save(application);
        return mapToDTO(saved);
    }

    public List<VisaApplicationDTO> getMyApplications(String userId) {
        return visaApplicationRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public VisaApplicationDTO getApplicationById(String id) {
        VisaApplication application = visaApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visa Application not found"));
        return mapToDTO(application);
    }

    public VisaApplicationDTO updateStatus(String id, VisaApplicationStatusDTO statusDTO) {
        VisaApplication application = visaApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visa Application not found"));

        application.setStatus(statusDTO.getStatus());
        application.setNotes(statusDTO.getNotes());
        application.setUpdatedAt(LocalDateTime.now());

        VisaApplication saved = visaApplicationRepository.save(application);
        return mapToDTO(saved);
    }

    private VisaApplicationDTO mapToDTO(VisaApplication application) {
        VisaApplicationDTO dto = new VisaApplicationDTO();
        dto.setId(application.getId());
        dto.setUserId(application.getUserId());
        dto.setVisaArticleId(application.getVisaArticleId());
        dto.setFullName(application.getFullName());
        dto.setPassportNumber(application.getPassportNumber());
        dto.setNationality(application.getNationality());
        dto.setEmail(application.getEmail());
        dto.setPhoneNumber(application.getPhoneNumber());
        dto.setStatus(application.getStatus());
        dto.setNotes(application.getNotes());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());

        // Fetch VisaArticle details
        visaArticleRepository.findById(application.getVisaArticleId()).ifPresent(article -> {
            dto.setVisaCountry(article.getCountry());
            dto.setVisaTitle(article.getTitle());
        });

        return dto;
    }
}
