package com.wanderlust.api.controller;

import com.wanderlust.api.entity.ReviewComment; // Use the ReviewComment entity directly
import com.wanderlust.api.services.ReviewCommentService; // Assuming you have a ReviewCommentService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/review-comments")
public class ReviewCommentController {

    private final ReviewCommentService reviewCommentService;

    @Autowired
    public ReviewCommentController(ReviewCommentService reviewCommentService) {
        this.reviewCommentService = reviewCommentService;
    }

    // Get all review comments
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReviewComment>> getAllReviewComments() {
        List<ReviewComment> allComments = reviewCommentService.findAll();
        return new ResponseEntity<>(allComments, HttpStatus.OK);
    }

    // Add a review comment
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewComment> addReviewComment(@RequestBody ReviewComment reviewComment) {
        ReviewComment newComment = reviewCommentService.create(reviewComment);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    // Update an existing review comment
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') and @webSecurity.isReviewCommentOwner(authentication, #id)")
    public ResponseEntity<?> updateReviewComment(@PathVariable String id, @RequestBody ReviewComment updatedComment) {
        updatedComment.setNum_of_rating_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            ReviewComment resultComment = reviewCommentService.update(updatedComment);
            return new ResponseEntity<>(resultComment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a review comment by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @webSecurity.isReviewCommentOwner(authentication, #id))")
    public ResponseEntity<String> deleteReviewComment(@PathVariable String id) {
        try {
            reviewCommentService.delete(id);
            return new ResponseEntity<>("Review comment has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all review comments
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllReviewComments() {
        reviewCommentService.deleteAll();
        return new ResponseEntity<>("All review comments have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific review comment by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getReviewCommentById(@PathVariable String id) {
        try {
            ReviewComment comment = reviewCommentService.findByID(id);
            return new ResponseEntity<>(comment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}