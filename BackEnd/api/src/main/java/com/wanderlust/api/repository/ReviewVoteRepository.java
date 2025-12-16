package com.wanderlust.api.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.wanderlust.api.entity.ReviewVote;

@Repository
public interface ReviewVoteRepository extends MongoRepository<ReviewVote, String> {
    Optional<ReviewVote> findByReviewIdAndUserId(String reviewId, String userId);
}
