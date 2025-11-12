package com.wanderlust.api.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TravelGuideResponseDTO {
    private String id;
    private String title;
    private String destination;
    private String country;
    private String continent;
    private String category;
    private String description;
    private String content;
    private String readTime;
    private String coverImage;
    private List<String> images;
    private String authorId;
    private String authorName;
    private List<String> tags;
    private Integer views;
    private Integer likes;
    private Integer duration;
    private String type;
    private String difficulty;
    private List<AttractionDTO> attractions;
    private List<TipDTO> tips;
    private Boolean published;
    private Boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
