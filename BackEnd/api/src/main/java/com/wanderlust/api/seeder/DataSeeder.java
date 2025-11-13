package com.wanderlust.api.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.repository.TravelGuideRepository;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.VisaArticleRepository;
import com.wanderlust.api.repository.FlightRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    
    private final TravelGuideRepository travelGuideRepository;
    private final PromotionRepository promotionRepository;
    private final VisaArticleRepository visaArticleRepository;
    private final FlightRepository flightRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(
            TravelGuideRepository travelGuideRepository,
            PromotionRepository promotionRepository,
            VisaArticleRepository visaArticleRepository,
            FlightRepository flightRepository,
            ObjectMapper objectMapper) {
        this.travelGuideRepository = travelGuideRepository;
        this.promotionRepository = promotionRepository;
        this.visaArticleRepository = visaArticleRepository;
        this.flightRepository = flightRepository;
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
        
        // Seed Flights
        seedFlights();
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
            long existingCount = promotionRepository.count();
            
            logger.info("Current promotions in database: {}", existingCount);

            // Đọc file JSON mới với nhiều voucher đa dạng
            ClassPathResource resource = new ClassPathResource("data/promotions-new.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<Promotion>
            List<Promotion> newPromotions = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<Promotion>>() {}
            );

            // Xóa và update những voucher có category sai (uppercase → lowercase)
            String[] codesToUpdate = {"FLIGHT50K", "HOTEL15", "ACTIVITY20", "CARRENTAL25", 
                                      "TOUR200K", "INTFLIGHT10", "LUXURY5STAR", "GROUPDEAL"};
            for (String code : codesToUpdate) {
                Optional<Promotion> existingPromotion = promotionRepository.findByCode(code);
                if (existingPromotion.isPresent()) {
                    promotionRepository.delete(existingPromotion.get());
                    logger.info("Deleted old promotion with wrong category: {}", code);
                }
            }

            // Chỉ thêm những voucher chưa tồn tại (dựa vào code)
            int addedCount = 0;
            for (Promotion promotion : newPromotions) {
                if (!promotionRepository.existsByCode(promotion.getCode())) {
                    promotionRepository.save(promotion);
                    addedCount++;
                    logger.info("Added new promotion: {}", promotion.getCode());
                } else {
                    logger.info("Promotion {} already exists, skipping.", promotion.getCode());
                }
            }

            logger.info("Successfully added {} new promotions to database! Total: {}", 
                addedCount, promotionRepository.count());

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

    private void seedFlights() {
        try {
            long count = flightRepository.count();
            
            if (count > 0) {
                logger.info("Database already has {} flights. Skipping seed.", count);
                return;
            }

            logger.info("No existing flights found. Starting seed...");

            // Đọc file JSON từ resources
            ClassPathResource resource = new ClassPathResource("data/flights.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<Flight>
            List<Flight> flights = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<Flight>>() {}
            );

            // Lưu vào database
            List<Flight> savedFlights = flightRepository.saveAll(flights);

            logger.info("Successfully seeded {} flights to database!", savedFlights.size());

        } catch (Exception e) {
            logger.error("Error seeding flights: {}", e.getMessage(), e);
        }
    }
}
