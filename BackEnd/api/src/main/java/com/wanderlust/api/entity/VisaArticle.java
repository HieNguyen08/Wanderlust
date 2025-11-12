package com.wanderlust.api.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "visa_articles")
@Data
public class VisaArticle {
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("country")
    private String country;
    
    @Field("flag")
    private String flag;
    
    @Field("continent")
    private String continent;
    
    @Field("excerpt")
    private String excerpt;
    
    @Field("image")
    private String image;
    
    @Field("readTime")
    private String readTime;
    
    @Field("category")
    private String category;
    
    @Field("processingTime")
    private String processingTime;
    
    @Field("popular")
    private Boolean popular;
    
    @Field("fee")
    private Double fee;
    
    @Field("validity")
    private String validity;
    
    @Field("requirements")
    private List<String> requirements;
    
    @Field("steps")
    private List<VisaStep> steps;
    
    @Field("tips")
    private List<String> tips;
    
    @Field("faqs")
    private List<VisaFaq> faqs;
    
    @Field("createdAt")
    private String createdAt;
    
    @Field("updatedAt")
    private String updatedAt;
    
    // Nested classes
    @Data
    public static class VisaStep {
        private Integer stepNumber;
        private String title;
        private String description;
        private List<String> documents;
    }
    
    @Data
    public static class VisaFaq {
        private String question;
        private String answer;
    }
}
