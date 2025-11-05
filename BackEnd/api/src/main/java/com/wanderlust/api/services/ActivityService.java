package com.wanderlust.api.services;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.repository.ActivityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.wanderlust.api.services.CustomUserDetails;


import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ActivityService implements BaseServices<Activity> {
    private final ActivityRepository activityRepository;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserId();
        } else {
            throw new RuntimeException("Unexpected principal type: " + principal.getClass().getName());
        }
    }

    // Get all activities
    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    // Add a new activity
    public Activity create(Activity activity) {
        String ownerId = getCurrentUserId();
        activity.setUserId(ownerId);

        return activityRepository.insert(activity);
    }

    // Update an existing activity
    public Activity update(Activity activity) {
        Activity updatedActivity = activityRepository.findById(activity.getId())
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + activity.getId()));

        if (activity.getName() != null) {
            updatedActivity.setName(activity.getName());
        }
        if (activity.getDescription() != null) {
            updatedActivity.setDescription(activity.getDescription());
        }
        if (activity.getPrice() != 0.0) {
            updatedActivity.setPrice(activity.getPrice());
        }
        if (activity.getStartDate() != null) {
            updatedActivity.setStartDate(activity.getStartDate());
        }
        if (activity.getMax_Participants() != null) {
            updatedActivity.setMax_Participants(activity.getMax_Participants());
        }

        return activityRepository.save(updatedActivity);
    }

    // Delete an activity by ID
    public void delete(String id) {
        if (activityRepository.findById(id).isPresent()) {
            activityRepository.deleteById(id);
        } else {
            throw new RuntimeException("Activity not found with id " + id);
        }
    }

    // Delete all activities
    public void deleteAll() {
        activityRepository.deleteAll();
    }

    // Get a specific activity by ID
    public Activity findByID(String id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
    }
}