package com.wanderlust.api.configure;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.repository.TravelGuideRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

// @Component - Tạm thời disable để tránh lỗi MongoDB
public class TravelGuideDataSeeder implements CommandLineRunner {

    private final TravelGuideRepository travelGuideRepository;

    public TravelGuideDataSeeder(TravelGuideRepository travelGuideRepository) {
        this.travelGuideRepository = travelGuideRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Chỉ seed data nếu collection rỗng
        if (travelGuideRepository.count() == 0) {
            System.out.println("🌱 Seeding Travel Guide data...");
            
            try {
                ObjectMapper mapper = new ObjectMapper();
                mapper.registerModule(new JavaTimeModule());
                
                // Đọc file JSON từ resources hoặc đường dẫn tuyệt đối
                InputStream inputStream = new ClassPathResource("data/travelguide.json").getInputStream();
                
                List<TravelGuide> guides = mapper.readValue(inputStream, new TypeReference<List<TravelGuide>>() {});
                
                // Set timestamps cho mỗi guide
                LocalDateTime now = LocalDateTime.now();
                guides.forEach(guide -> {
                    if (guide.getCreatedAt() == null) {
                        guide.setCreatedAt(now);
                    }
                    if (guide.getUpdatedAt() == null) {
                        guide.setUpdatedAt(now);
                    }
                    if (guide.getViews() == null) {
                        guide.setViews(0);
                    }
                    if (guide.getLikes() == null) {
                        guide.setLikes(0);
                    }
                });
                
                travelGuideRepository.saveAll(guides);
                System.out.println("✅ Successfully seeded " + guides.size() + " travel guides!");
                
            } catch (Exception e) {
                System.err.println("❌ Error seeding travel guide data: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("ℹ️ Travel Guide collection already has data. Skipping seed.");
        }
    }
}
