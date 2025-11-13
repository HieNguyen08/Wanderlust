package com.wanderlust.api.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.repository.TravelGuideRepository;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.VisaArticleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    
    private final TravelGuideRepository travelGuideRepository;
    private final PromotionRepository promotionRepository;
    private final VisaArticleRepository visaArticleRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(
            TravelGuideRepository travelGuideRepository,
            PromotionRepository promotionRepository,
            VisaArticleRepository visaArticleRepository,
            ObjectMapper objectMapper) {
        this.travelGuideRepository = travelGuideRepository;
        this.promotionRepository = promotionRepository;
        this.visaArticleRepository = visaArticleRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data seeding...");
        
        // Seed Travel Guides
        seedTravelGuides();
        
        // Seed Promotions
        seedPromotions();
        
        // Seed Visa Articles
        seedVisaArticles();
    }

    private void seedTravelGuides() {
        try {
            // Kiểm tra xem đã có data chưa - KHÔNG XÓA data cũ
            long count = travelGuideRepository.count();
            
            if (count > 0) {
                logger.info("Database already has {} travel guides. Skipping seed.", count);
                return;
            }

            logger.info("No existing travel guides found. Starting seed...");

            // Đọc file JSON từ resources
            ClassPathResource resource = new ClassPathResource("data/travelguide.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<TravelGuide>
            List<TravelGuide> travelGuides = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<TravelGuide>>() {}
            );

            // Lưu vào database
            List<TravelGuide> savedGuides = travelGuideRepository.saveAll(travelGuides);

            logger.info("Successfully seeded {} travel guides to database!", savedGuides.size());

        } catch (Exception e) {
            logger.error("Error seeding travel guides: {}", e.getMessage(), e);
        }
    }

    private void seedPromotions() {
        try {
            // Kiểm tra xem đã có data chưa - KHÔNG XÓA data cũ
            long count = promotionRepository.count();
            
            if (count > 0) {
                logger.info("Database already has {} promotions. Skipping seed.", count);
                return;
            }

            logger.info("No existing promotions found. Starting seed...");

            // Đọc file JSON từ resources
            ClassPathResource resource = new ClassPathResource("data/promotions.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<Promotion>
            List<Promotion> promotions = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<Promotion>>() {}
            );

            // Lưu vào database
            List<Promotion> savedPromotions = promotionRepository.saveAll(promotions);

            logger.info("Successfully seeded {} promotions to database!", savedPromotions.size());

        } catch (Exception e) {
            logger.error("Error seeding promotions: {}", e.getMessage(), e);
        }
    }

    private void seedVisaArticles() {
        try {
            // Kiểm tra xem đã có data chưa - KHÔNG XÓA data cũ
            long count = visaArticleRepository.count();
            
            if (count > 0) {
                logger.info("Database already has {} visa articles. Skipping seed.", count);
                return;
            }

            logger.info("No existing visa articles found. Starting seed...");

            // Đọc file JSON từ resources
            ClassPathResource resource = new ClassPathResource("data/visa-articles.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<VisaArticle>
            List<VisaArticle> visaArticles = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<VisaArticle>>() {}
            );

            // Lưu vào database
            List<VisaArticle> savedArticles = visaArticleRepository.saveAll(visaArticles);

            logger.info("Successfully seeded {} visa articles to database!", savedArticles.size());

        } catch (Exception e) {
            logger.error("Error seeding visa articles: {}", e.getMessage(), e);
        }
    }
}
