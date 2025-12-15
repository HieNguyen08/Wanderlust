package com.wanderlust.api.seeder;

import java.io.InputStream;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.FlightSeat;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Location;
import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.FlightRepository;
import com.wanderlust.api.repository.FlightSeatRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.LocationRepository;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.RoomRepository;
import com.wanderlust.api.repository.TravelGuideRepository;
import com.wanderlust.api.repository.VisaArticleRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final TravelGuideRepository travelGuideRepository;
    private final PromotionRepository promotionRepository;
    private final VisaArticleRepository visaArticleRepository;
    private final FlightRepository flightRepository;
    private final FlightSeatRepository flightSeatRepository;
    private final LocationRepository locationRepository;
    private final HotelRepository hotelRepository;
    private final CarRentalRepository carRentalRepository;
    private final ActivityRepository activityRepository;
    private final RoomRepository roomRepository;
    private final ObjectMapper objectMapper;
    private final MongoClient mongoClient;

    public DataSeeder(
            TravelGuideRepository travelGuideRepository,
            PromotionRepository promotionRepository,
            VisaArticleRepository visaArticleRepository,
            FlightRepository flightRepository,
            FlightSeatRepository flightSeatRepository,
            LocationRepository locationRepository,
            HotelRepository hotelRepository,
            CarRentalRepository carRentalRepository,
            ActivityRepository activityRepository,
            RoomRepository roomRepository,
            ObjectMapper objectMapper,
            MongoClient mongoClient) {
        this.travelGuideRepository = travelGuideRepository;
        this.promotionRepository = promotionRepository;
        this.visaArticleRepository = visaArticleRepository;
        this.flightRepository = flightRepository;
        this.flightSeatRepository = flightSeatRepository;
        this.locationRepository = locationRepository;
        this.hotelRepository = hotelRepository;
        this.carRentalRepository = carRentalRepository;
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
        this.objectMapper = objectMapper;
        this.mongoClient = mongoClient;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("🌱 Starting data seeding...");

        if (!isMongoReachable()) {
            logger.warn("Skipping data seeding because MongoDB is not reachable at configured host/port.");
            return;
        }

        // Seed Locations first (needed as foreign keys)
        seedLocations();

        // Seed Travel Guides (from JSON file)
        seedTravelGuides();

        // Seed Promotions (from JSON file)
        // seedPromotions();

        // Seed Visa Articles (from JSON file)
        seedVisaArticles();

        // Seed Flights (from JSON file)
        seedFlights();

        // Seed Flight Seats (from JSON file)
        seedFlightSeats();

        // Seed Hotels (from JSON file) - must be before rooms
        // seedHotels();

        // Seed Rooms (from JSON file) - requires hotels
        // seedRooms();

        // Seed Car Rentals (from JSON file)
        // seedCarRentals();

        // Seed Activities (from JSON file)
        // seedActivities();

        logger.info("✅ Data seeding completed successfully!");
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
            ClassPathResource resource = new ClassPathResource("data/travel_guides.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<TravelGuide>
            List<TravelGuide> travelGuides = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<TravelGuide>>() {
                    });

            // Lưu vào database
            List<TravelGuide> savedGuides = travelGuideRepository.saveAll(travelGuides);

            logger.info("Successfully seeded {} travel guides to database!", savedGuides.size());

        } catch (Exception e) {
            logger.error("Error seeding travel guides: {}", e.getMessage(), e);
        }
    }

    // private void seedPromotions() {
    //     try {
    //         long existingCount = promotionRepository.count();

    //         if (existingCount > 0) {
    //             logger.info("Database already has {} promotions. Skipping seed.", existingCount);
    //             return;
    //         }

    //         logger.info("No existing promotions found. Starting seed...");

    //         // Đọc file JSON từ resources
    //         ClassPathResource resource = new ClassPathResource("data/promotions-new.json");
    //         InputStream inputStream = resource.getInputStream();

    //         // Parse JSON thành List<Promotion>
    //         List<Promotion> promotions = objectMapper.readValue(
    //                 inputStream,
    //                 new TypeReference<List<Promotion>>() {
    //                 });

    //         // Lưu vào database
    //         List<Promotion> savedPromotions = promotionRepository.saveAll(promotions);

    //         logger.info("Successfully seeded {} promotions to database!", savedPromotions.size());

    //     } catch (Exception e) {
    //         logger.error("Error seeding promotions: {}", e.getMessage());
    //     }
    // }

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
                    new TypeReference<List<VisaArticle>>() {
                    });

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
                    new TypeReference<List<Flight>>() {
                    });

            // Lưu vào database
            List<Flight> savedFlights = flightRepository.saveAll(flights);

            logger.info("Successfully seeded {} flights to database!", savedFlights.size());

        } catch (Exception e) {
            logger.error("Error seeding flights: {}", e.getMessage(), e);
        }
    }

    private void seedFlightSeats() {
        try {
            long count = flightSeatRepository.count();

            if (count > 0) {
                logger.info("Database already has {} flight seats. Skipping seed.", count);
                return;
            }

            logger.info("No existing flight seats found. Starting seed...");

            // Đọc file JSON từ resources
            ClassPathResource resource = new ClassPathResource("data/flightseat.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<FlightSeat>
            List<FlightSeat> flightSeats = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<FlightSeat>>() {
                    });

            // Lưu vào database
            List<FlightSeat> savedSeats = flightSeatRepository.saveAll(flightSeats);

            logger.info("Successfully seeded {} flight seats to database!", savedSeats.size());

        } catch (Exception e) {
            logger.error("Error seeding flight seats: {}", e.getMessage(), e);
        }
    }

    private void seedLocations() {
        try {
            long count = locationRepository.count();

            if (count > 0) {
                logger.info("Database already has {} locations. Skipping seed.", count);
                return;
            }

            logger.info("No existing locations found. Starting seed...");

            // Đọc file JSON từ resources
            ClassPathResource resource = new ClassPathResource("data/locations.json");
            InputStream inputStream = resource.getInputStream();

            // Parse JSON thành List<Location>
            List<Location> locations = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<Location>>() {
                    });

            // Lưu vào database
            List<Location> savedLocations = locationRepository.saveAll(locations);

            logger.info("Successfully seeded {} locations to database!", savedLocations.size());

        } catch (Exception e) {
            logger.error("Error seeding locations: {}", e.getMessage(), e);
        }
    }

    // private void seedHotels() {
    //     try {
    //         long count = hotelRepository.count();

    //         if (count > 0) {
    //             logger.info("Database already has {} hotels. Skipping seed.", count);
    //             return;
    //         }

    //         logger.info("No existing hotels found. Starting seed...");

    //         // Đọc file JSON từ resources
    //         ClassPathResource resource = new ClassPathResource("data/hotels.json");
    //         InputStream inputStream = resource.getInputStream();

    //         // Parse JSON thành List<Hotel>
    //         List<Hotel> hotels = objectMapper.readValue(
    //                 inputStream,
    //                 new TypeReference<List<Hotel>>() {
    //                 });

    //         // Lưu vào database
    //         List<Hotel> savedHotels = hotelRepository.saveAll(hotels);

    //         logger.info("Successfully seeded {} hotels to database!", savedHotels.size());

    //     } catch (Exception e) {
    //         logger.error("Error seeding hotels: {}", e.getMessage(), e);
    //     }
    // }

    // private void seedCarRentals() {
    //     try {
    //         long count = carRentalRepository.count();

    //         if (count > 0) {
    //             logger.info("Database already has {} car rentals. Skipping seed.", count);
    //             return;
    //         }

    //         logger.info("No existing car rentals found. Starting seed...");

    //         // Đọc file JSON từ resources
    //         ClassPathResource resource = new ClassPathResource("data/car_rentals.json");
    //         InputStream inputStream = resource.getInputStream();

    //         // Parse JSON thành List<CarRental>
    //         List<CarRental> carRentals = objectMapper.readValue(
    //                 inputStream,
    //                 new TypeReference<List<CarRental>>() {
    //                 });

    //         // Lưu vào database
    //         List<CarRental> savedCarRentals = carRentalRepository.saveAll(carRentals);

    //         logger.info("Successfully seeded {} car rentals to database!", savedCarRentals.size());

    //     } catch (Exception e) {
    //         logger.error("Error seeding car rentals: {}", e.getMessage(), e);
    //     }
    // }

    // private void seedActivities() {
    //     try {
    //         long count = activityRepository.count();

    //         if (count > 0) {
    //             logger.info("Database already has {} activities. Skipping seed.", count);
    //             return;
    //         }

    //         logger.info("No existing activities found. Starting seed...");

    //         // Đọc file JSON từ resources
    //         ClassPathResource resource = new ClassPathResource("data/activities.json");
    //         InputStream inputStream = resource.getInputStream();

    //         // Parse JSON thành List<Activity>
    //         List<Activity> activities = objectMapper.readValue(
    //                 inputStream,
    //                 new TypeReference<List<Activity>>() {
    //                 });

    //         // Lưu vào database
    //         List<Activity> savedActivities = activityRepository.saveAll(activities);

    //         logger.info("Successfully seeded {} activities to database!", savedActivities.size());

    //     } catch (Exception e) {
    //         logger.error("Error seeding activities: {}", e.getMessage(), e);
    //     }
    // }

    // private void seedRooms() {
    //     try {
    //         long count = roomRepository.count();

    //         if (count > 0) {
    //             logger.info("Database already has {} rooms. Skipping seed.", count);
    //             return;
    //         }

    //         logger.info("No existing rooms found. Starting seed...");

    //         // Đọc file JSON từ resources
    //         ClassPathResource resource = new ClassPathResource("data/rooms.json");
    //         InputStream inputStream = resource.getInputStream();

    //         // Parse JSON thành List<Room>
    //         List<Room> rooms = objectMapper.readValue(
    //                 inputStream,
    //                 new TypeReference<List<Room>>() {
    //                 });

    //         // Lưu vào database
    //         List<Room> savedRooms = roomRepository.saveAll(rooms);

    //         logger.info("Successfully seeded {} rooms to database!", savedRooms.size());

    //     } catch (Exception e) {
    //         logger.error("Error seeding rooms: {}", e.getMessage(), e);
    //     }
    // }

    private boolean isMongoReachable() {
        try {
            mongoClient.getDatabase("admin").runCommand(new org.bson.Document("ping", 1));
            return true;
        } catch (MongoException ex) {
            logger.error("MongoDB connection check failed: {}", ex.getMessage());
            return false;
        }
    }
}
