package com.wanderlust.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "travelguides")
public class TravelGuide {
    
    @Id
    private String id;
    
    private String title;
    
    private String destination; // Điểm đến (e.g., "Paris, France", "Tokyo, Japan")
    
    private String country; // Quốc gia (e.g., "Nhật Bản", "Pháp", "Việt Nam")
    
    private String continent; // Châu lục (e.g., "Asia", "Europe", "North America")
    
    private String category; // "culture", "food", "adventure", "shopping", "nightlife"
    
    private String description; // Mô tả ngắn
    
    private String content; // Nội dung đầy đủ (HTML/Markdown)
    
    private String readTime; // Thời gian đọc (e.g., "8 phút đọc")
    
    private String coverImage; // URL ảnh bìa
    
    private List<String> images; // Danh sách ảnh
    
    private String authorId; // ID của người viết (admin/vendor)
    
    private String authorName;
    
    private List<String> tags; // ["budget travel", "solo travel", "family friendly"]
    
    private Integer views; // Số lượt xem
    
    private Integer likes; // Số lượt thích
    
    private Integer duration; // Thời gian đọc (phút)
    
    private String type; // Loại bài viết: "destination", "blog", "region", "attraction"
    
    private String difficulty; // "easy", "moderate", "challenging"
    
    private List<Attraction> attractions; // Các điểm tham quan
    
    private List<Tip> tips; // Các tips hữu ích
    
    private Boolean published; // Đã xuất bản chưa
    
    private Boolean featured; // Nổi bật
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Tip {
        private String title;
        private String content;
        private String icon; // Icon name
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Attraction {
        private String name;
        private String image;
        private String description;
    }
}
