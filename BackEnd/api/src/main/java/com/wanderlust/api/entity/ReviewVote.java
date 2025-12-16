package com.wanderlust.api.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "review_vote")
@CompoundIndexes({
    @CompoundIndex(name = "review_user_unique", def = "{ 'reviewId': 1, 'userId': 1 }", unique = true)
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewVote {
    @Id
    private String id;
    private String reviewId;
    private String userId;
    private VoteType voteType; // HELPFUL hoặc NOT_HELPFUL

    public enum VoteType {
        HELPFUL,
        NOT_HELPFUL
    }
}
