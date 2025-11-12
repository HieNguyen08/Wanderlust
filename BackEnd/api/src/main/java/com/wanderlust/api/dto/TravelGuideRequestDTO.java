package com.wanderlust.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class TravelGuideRequestDTO {
    private String title;
    private String destination;
    private String country;
    private String continent;
    private String category; // "culture", "food", "adventure", "shopping", "nightlife"
    private String description;
    private String content; // HTML/Markdown content
    private String readTime;
    private String coverImage;
    private List<String> images;
    private String authorId;
    private String authorName;
    private List<String> tags;
    private Integer duration; // Reading time in minutes
    private String type; // "destination", "blog", "region", "attraction"
    private String difficulty; // "easy", "moderate", "challenging"
    private List<AttractionDTO> attractions;
    private List<TipDTO> tips;
    private Boolean published;
    private Boolean featured;
}
