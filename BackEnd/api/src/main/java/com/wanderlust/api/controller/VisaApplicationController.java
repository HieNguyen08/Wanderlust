package com.wanderlust.api.controller;

import com.wanderlust.api.dto.visa.VisaApplicationCreateDTO;
import com.wanderlust.api.dto.visa.VisaApplicationDTO;
import com.wanderlust.api.dto.visa.VisaApplicationStatusDTO;
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.VisaApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visa-applications")
@RequiredArgsConstructor
public class VisaApplicationController {

    private final VisaApplicationService visaApplicationService;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserID();
        } else {
            return authentication.getName();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VisaApplicationDTO> createApplication(@RequestBody VisaApplicationCreateDTO createDTO) {
        String userId = getCurrentUserId();
        VisaApplicationDTO created = visaApplicationService.createApplication(createDTO, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<VisaApplicationDTO>> getMyApplications() {
        String userId = getCurrentUserId();
        List<VisaApplicationDTO> applications = visaApplicationService.getMyApplications(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<VisaApplicationDTO> getApplicationById(@PathVariable String id) {
        // Note: In a real app, we should check if the user owns this application or is
        // admin
        VisaApplicationDTO application = visaApplicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VisaApplicationDTO> updateStatus(
            @PathVariable String id,
            @RequestBody VisaApplicationStatusDTO statusDTO) {
        VisaApplicationDTO updated = visaApplicationService.updateStatus(id, statusDTO);
        return ResponseEntity.ok(updated);
    }
}
