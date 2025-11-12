package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.services.ActivityService;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Activity>> getAllActivities() {
        List<Activity> allActivities = activityService.findAll();
        return new ResponseEntity<>(allActivities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Activity> getActivityById(@PathVariable String id) {
        Activity activity = activityService.findByID(id);
        return new ResponseEntity<>(activity, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Activity> addActivity(@RequestBody Activity activity) {
        Activity newActivity = activityService.create(activity);
        return new ResponseEntity<>(newActivity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isActivityOwner(authentication, #id))")
    public ResponseEntity<Activity> updateActivity(@PathVariable String id, @RequestBody Activity updatedActivity) {
        updatedActivity.setId(id);
        Activity updatedEntity = activityService.update(updatedActivity);
        return new ResponseEntity<>(updatedEntity, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isActivityOwner(authentication, #id))")
    public ResponseEntity<String> deleteActivity(@PathVariable String id) {
        activityService.delete(id);
        return new ResponseEntity<>("Activity has been deleted successfully!", HttpStatus.OK);
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> deleteAllActivities() {
        activityService.deleteAll();
        return new ResponseEntity<>("All activities have been deleted successfully!", HttpStatus.OK);
    }
}