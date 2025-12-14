package com.wanderlust.api.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityStatus;
import com.wanderlust.api.entity.types.ApprovalStatus;
import com.wanderlust.api.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ActivityStatusScheduler {

    private final ActivityRepository activityRepository;

    // Runs every 5 minutes to keep activity status in sync with time/capacity
    @Scheduled(fixedDelayString = "PT5M")
    public void updateStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Activity> activities = activityRepository.findAll();

        for (Activity activity : activities) {
            // Only maintain approved activities; skip rejected to avoid churn
            if (activity.getApprovalStatus() != ApprovalStatus.APPROVED) {
                continue;
            }

            ActivityStatus computed = computeStatus(activity, now);
            if (computed != null && computed != activity.getStatus()) {
                activity.setStatus(computed);
                activityRepository.save(activity);
            }
        }
    }

    private ActivityStatus computeStatus(Activity activity, LocalDateTime now) {
        ActivityStatus current = activity.getStatus();

        // Respect manual/terminal states
        if (current == ActivityStatus.REJECTED || current == ActivityStatus.PAUSED) {
            return current;
        }

        // Completed when end time has passed
        if (activity.getEndDateTime() != null && now.isAfter(activity.getEndDateTime())) {
            return ActivityStatus.COMPLETED;
        }

        // Auto-close window before start time
        if (activity.getStartDateTime() != null && activity.getAutoCloseBeforeMinutes() != null) {
            LocalDateTime closeAt = activity.getStartDateTime().minusMinutes(activity.getAutoCloseBeforeMinutes());
            if (now.isAfter(closeAt)) {
                return ActivityStatus.CLOSED;
            }
        }

        // Full when capacity reached
        Integer cap = activity.getCapacityMax() != null ? activity.getCapacityMax() : activity.getMaxParticipants();
        if (cap != null && activity.getCurrentBookings() != null && activity.getCurrentBookings() >= cap) {
            return ActivityStatus.FULL;
        }

        // If approved but still pending, activate
        if (current == ActivityStatus.PENDING_REVIEW || current == null) {
            return ActivityStatus.ACTIVE;
        }

        // Re-open if previously full but capacity freed before close window
        if (current == ActivityStatus.FULL && cap != null
                && (activity.getCurrentBookings() == null || activity.getCurrentBookings() < cap)) {
            return ActivityStatus.ACTIVE;
        }

        return current;
    }
}
