package com.wanderlust.api.services;

import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.repository.ReviewCommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ReviewCommentService implements BaseServices<ReviewComment> {

    private final ReviewCommentRepository reviewCommentRepository;

    // Get all review comments
    public List<ReviewComment> findAll() {
        return reviewCommentRepository.findAll();
    }

    // Add a review comment
    public ReviewComment create(ReviewComment reviewComment) {
        return reviewCommentRepository.insert(reviewComment);
    }

    // Update an existing review comment
    public ReviewComment update(ReviewComment reviewComment) {
        ReviewComment updatedReviewComment = reviewCommentRepository.findById(reviewComment.getNum_of_rating_ID())
                .orElseThrow(() -> new RuntimeException("ReviewComment not found with id " + reviewComment.getNum_of_rating_ID()));

        if (reviewComment.getComment() != null) updatedReviewComment.setComment(reviewComment.getComment());
        if (reviewComment.getRatings() != null) updatedReviewComment.setRatings(reviewComment.getRatings());

        return reviewCommentRepository.save(updatedReviewComment);
    }

    // Delete a review comment by ID
    public void delete(String id) {
        if (reviewCommentRepository.findById(id).isPresent()) {
            reviewCommentRepository.deleteById(id);
        } else {
            throw new RuntimeException("ReviewComment not found with id " + id);
        }
    }

    // Delete all review comments
    public void deleteAll() {
        reviewCommentRepository.deleteAll();
    }

    // Get a specific review comment by id
    public ReviewComment findByID(String id) {
        return reviewCommentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReviewComment not found with id " + id));
    }
}