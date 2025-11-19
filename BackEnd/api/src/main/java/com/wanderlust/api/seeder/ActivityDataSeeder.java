package com.wanderlust.api.seeder;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ActivityDifficulty;
import com.wanderlust.api.entity.types.ActivityStatus;
import com.wanderlust.api.repository.ActivityRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class ActivityDataSeeder {

    private final ActivityRepository activityRepository;

    public ActivityDataSeeder(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public void seed() {
        // Re-seed if we have fewer activities than expected (e.g. only the initial 3)
        if (activityRepository.count() < 8) {
            activityRepository.deleteAll();
            
            List<Activity> activities = new ArrayList<>();

            // Activity 1: Ha Long Bay Cruise
            Activity activity1 = new Activity();
            activity1.setName("Ha Long Bay Luxury Day Cruise");
            activity1.setSlug("ha-long-bay-luxury-day-cruise");
            activity1.setCategory(ActivityCategory.TOUR);
            activity1.setType("Cruise");
            activity1.setDescription("Experience the beauty of Ha Long Bay on a luxury cruise. Visit Titop Island, Sung Sot Cave, and enjoy a delicious seafood lunch.");
            activity1.setHighlights(Arrays.asList("Visit Sung Sot Cave", "Swimming at Titop Island", "Seafood Lunch", "Kayaking"));
            activity1.setIncluded(Arrays.asList("Lunch", "Entrance fees", "Guide", "Kayaking"));
            activity1.setNotIncluded(Arrays.asList("Drinks", "Tips"));
            activity1.setDuration("6 hours");
            activity1.setMinParticipants(1);
            activity1.setMaxParticipants(50);
            activity1.setDifficulty(ActivityDifficulty.EASY);
            activity1.setAgeRestriction("All ages");
            activity1.setLanguages(Arrays.asList("English", "Vietnamese"));
            activity1.setMeetingPoint("Tuan Chau Marina");
            
            List<Activity.ActivityImage> images1 = new ArrayList<>();
            images1.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop", "Ha Long Bay"));
            images1.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop", "Cruise Ship"));
            activity1.setImages(images1);

            activity1.setPrice(new BigDecimal("1200000"));
            activity1.setOriginalPrice(new BigDecimal("1500000"));
            activity1.setCancellationPolicy("Free cancellation up to 24 hours before start");
            activity1.setStatus(ActivityStatus.ACTIVE);
            activity1.setFeatured(true);
            activity1.setAverageRating(new BigDecimal("4.8"));
            activity1.setTotalReviews(125);
            activity1.setTotalBooked(500);
            activity1.setCreatedAt(LocalDateTime.now());
            activity1.setUpdatedAt(LocalDateTime.now());
            activities.add(activity1);

            // Activity 2: Hoi An Cooking Class
            Activity activity2 = new Activity();
            activity2.setName("Hoi An Market Tour & Cooking Class");
            activity2.setSlug("hoi-an-market-tour-cooking-class");
            activity2.setCategory(ActivityCategory.CULTURE);
            activity2.setType("Workshop");
            activity2.setDescription("Visit the local market to buy fresh ingredients and learn how to cook traditional Vietnamese dishes with a local chef.");
            activity2.setHighlights(Arrays.asList("Market Tour", "Basket Boat Ride", "Cooking Class", "Lunch"));
            activity2.setIncluded(Arrays.asList("Ingredients", "Lunch", "Recipe book"));
            activity2.setNotIncluded(Arrays.asList("Hotel pickup"));
            activity2.setDuration("4 hours");
            activity2.setMinParticipants(2);
            activity2.setMaxParticipants(10);
            activity2.setDifficulty(ActivityDifficulty.EASY);
            activity2.setAgeRestriction("5+");
            activity2.setLanguages(Arrays.asList("English"));
            activity2.setMeetingPoint("Hoi An Central Market");

            List<Activity.ActivityImage> images2 = new ArrayList<>();
            images2.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop", "Cooking Class"));
            activity2.setImages(images2);

            activity2.setPrice(new BigDecimal("750000"));
            activity2.setOriginalPrice(new BigDecimal("900000"));
            activity2.setCancellationPolicy("Free cancellation up to 24 hours before start");
            activity2.setStatus(ActivityStatus.ACTIVE);
            activity2.setFeatured(true);
            activity2.setAverageRating(new BigDecimal("4.9"));
            activity2.setTotalReviews(89);
            activity2.setTotalBooked(320);
            activity2.setCreatedAt(LocalDateTime.now());
            activity2.setUpdatedAt(LocalDateTime.now());
            activities.add(activity2);

             // Activity 3: Sapa Trekking
            Activity activity3 = new Activity();
            activity3.setName("Sapa Trekking 2 Days 1 Night");
            activity3.setSlug("sapa-trekking-2-days-1-night");
            activity3.setCategory(ActivityCategory.ADVENTURE);
            activity3.setType("Trekking");
            activity3.setDescription("Trek through the beautiful rice terraces of Sapa, visit local ethnic minority villages, and stay in a homestay.");
            activity3.setHighlights(Arrays.asList("Rice Terraces", "Cat Cat Village", "Homestay experience", "Waterfall"));
            activity3.setIncluded(Arrays.asList("Homestay", "Meals", "Guide", "Transport from Hanoi"));
            activity3.setNotIncluded(Arrays.asList("Personal expenses"));
            activity3.setDuration("2 days");
            activity3.setMinParticipants(2);
            activity3.setMaxParticipants(15);
            activity3.setDifficulty(ActivityDifficulty.MODERATE);
            activity3.setAgeRestriction("12+");
            activity3.setLanguages(Arrays.asList("English", "Vietnamese"));
            activity3.setMeetingPoint("Sapa Church");

            List<Activity.ActivityImage> images3 = new ArrayList<>();
            images3.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1565622636336-4c241267759e?q=80&w=2070&auto=format&fit=crop", "Sapa Rice Fields"));
            activity3.setImages(images3);

            activity3.setPrice(new BigDecimal("2500000"));
            activity3.setOriginalPrice(new BigDecimal("3000000"));
            activity3.setCancellationPolicy("Free cancellation up to 48 hours before start");
            activity3.setStatus(ActivityStatus.ACTIVE);
            activity3.setFeatured(false);
            activity3.setAverageRating(new BigDecimal("4.7"));
            activity3.setTotalReviews(210);
            activity3.setTotalBooked(600);
            activity3.setCreatedAt(LocalDateTime.now());
            activity3.setUpdatedAt(LocalDateTime.now());
            activities.add(activity3);

            // Activity 4: Sun World Ba Na Hills
            Activity activity4 = new Activity();
            activity4.setName("Sun World Ba Na Hills Ticket");
            activity4.setSlug("sun-world-ba-na-hills-ticket");
            activity4.setCategory(ActivityCategory.ATTRACTION);
            activity4.setType("Theme Park");
            activity4.setDescription("Explore the Golden Bridge, French Village, and exciting games at Fantasy Park in Ba Na Hills.");
            activity4.setHighlights(Arrays.asList("Golden Bridge", "French Village", "Cable Car Ride", "Fantasy Park"));
            activity4.setIncluded(Arrays.asList("Cable car ticket", "Entrance fees", "Buffet Lunch (optional)"));
            activity4.setNotIncluded(Arrays.asList("Wax Museum fee"));
            activity4.setDuration("1 day");
            activity4.setMinParticipants(1);
            activity4.setMaxParticipants(100);
            activity4.setDifficulty(ActivityDifficulty.EASY);
            activity4.setAgeRestriction("All ages");
            activity4.setLanguages(Arrays.asList("English", "Vietnamese", "Korean"));
            activity4.setMeetingPoint("Ba Na Hills Entrance");

            List<Activity.ActivityImage> images4 = new ArrayList<>();
            images4.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1565060169308-45e9b4a925d4?q=80&w=2070&auto=format&fit=crop", "Golden Bridge"));
            images4.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2070&auto=format&fit=crop", "Ba Na Hills"));
            activity4.setImages(images4);

            activity4.setPrice(new BigDecimal("850000"));
            activity4.setOriginalPrice(new BigDecimal("900000"));
            activity4.setCancellationPolicy("Non-refundable");
            activity4.setStatus(ActivityStatus.ACTIVE);
            activity4.setFeatured(true);
            activity4.setAverageRating(new BigDecimal("4.6"));
            activity4.setTotalReviews(340);
            activity4.setTotalBooked(1200);
            activity4.setCreatedAt(LocalDateTime.now());
            activity4.setUpdatedAt(LocalDateTime.now());
            activities.add(activity4);

            // Activity 5: Saigon Street Food
            Activity activity5 = new Activity();
            activity5.setName("Saigon Street Food by Motorbike");
            activity5.setSlug("saigon-street-food-motorbike");
            activity5.setCategory(ActivityCategory.FOOD);
            activity5.setType("Food Tour");
            activity5.setDescription("Taste the best street food of Saigon while riding on the back of a motorbike with a local student guide.");
            activity5.setHighlights(Arrays.asList("Banh Mi", "Vietnamese Pancake", "Seafood", "Motorbike ride"));
            activity5.setIncluded(Arrays.asList("All food and drinks", "Motorbike & Helmet", "Guide", "Insurance"));
            activity5.setNotIncluded(Arrays.asList("Tips"));
            activity5.setDuration("4 hours");
            activity5.setMinParticipants(1);
            activity5.setMaxParticipants(10);
            activity5.setDifficulty(ActivityDifficulty.EASY);
            activity5.setAgeRestriction("6+");
            activity5.setLanguages(Arrays.asList("English"));
            activity5.setMeetingPoint("District 1 Hotel Pickup");

            List<Activity.ActivityImage> images5 = new ArrayList<>();
            images5.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", "Street Food"));
            activity5.setImages(images5);

            activity5.setPrice(new BigDecimal("600000"));
            activity5.setOriginalPrice(new BigDecimal("750000"));
            activity5.setCancellationPolicy("Free cancellation up to 24 hours");
            activity5.setStatus(ActivityStatus.ACTIVE);
            activity5.setFeatured(false);
            activity5.setAverageRating(new BigDecimal("4.9"));
            activity5.setTotalReviews(560);
            activity5.setTotalBooked(890);
            activity5.setCreatedAt(LocalDateTime.now());
            activity5.setUpdatedAt(LocalDateTime.now());
            activities.add(activity5);

            // Activity 6: Herbal Spa
            Activity activity6 = new Activity();
            activity6.setName("Luxury Herbal Spa Experience");
            activity6.setSlug("luxury-herbal-spa-experience");
            activity6.setCategory(ActivityCategory.RELAXATION);
            activity6.setType("Spa & Wellness");
            activity6.setDescription("Relax and rejuvenate with traditional Vietnamese herbal treatments and massage therapies.");
            activity6.setHighlights(Arrays.asList("Full body massage", "Herbal bath", "Facial treatment", "Tea and snacks"));
            activity6.setIncluded(Arrays.asList("Treatment", "Tea", "Snacks"));
            activity6.setNotIncluded(Arrays.asList("Tips"));
            activity6.setDuration("90 minutes");
            activity6.setMinParticipants(1);
            activity6.setMaxParticipants(4);
            activity6.setDifficulty(ActivityDifficulty.EASY);
            activity6.setAgeRestriction("16+");
            activity6.setLanguages(Arrays.asList("English", "Vietnamese", "Korean", "Chinese"));
            activity6.setMeetingPoint("Herbal Spa Da Nang");

            List<Activity.ActivityImage> images6 = new ArrayList<>();
            images6.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop", "Spa Massage"));
            activity6.setImages(images6);

            activity6.setPrice(new BigDecimal("450000"));
            activity6.setOriginalPrice(new BigDecimal("600000"));
            activity6.setCancellationPolicy("Free cancellation up to 12 hours");
            activity6.setStatus(ActivityStatus.ACTIVE);
            activity6.setFeatured(false);
            activity6.setAverageRating(new BigDecimal("4.8"));
            activity6.setTotalReviews(150);
            activity6.setTotalBooked(400);
            activity6.setCreatedAt(LocalDateTime.now());
            activity6.setUpdatedAt(LocalDateTime.now());
            activities.add(activity6);

            // Activity 7: Teh Dar Show
            Activity activity7 = new Activity();
            activity7.setName("Teh Dar Show at Saigon Opera House");
            activity7.setSlug("teh-dar-show-saigon");
            activity7.setCategory(ActivityCategory.ENTERTAINMENT);
            activity7.setType("Cultural Show");
            activity7.setDescription("Witness the vibrant culture of Vietnamese highlands through bamboo circus, acrobatics, and live music.");
            activity7.setHighlights(Arrays.asList("Bamboo Circus", "Live Music", "Cultural Storytelling", "Opera House Architecture"));
            activity7.setIncluded(Arrays.asList("Show Ticket"));
            activity7.setNotIncluded(Arrays.asList("Drinks", "Transfer"));
            activity7.setDuration("1 hour");
            activity7.setMinParticipants(1);
            activity7.setMaxParticipants(200);
            activity7.setDifficulty(ActivityDifficulty.EASY);
            activity7.setAgeRestriction("5+");
            activity7.setLanguages(Arrays.asList("Non-verbal"));
            activity7.setMeetingPoint("Saigon Opera House");

            List<Activity.ActivityImage> images7 = new ArrayList<>();
            images7.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1514525253440-b393452e3720?q=80&w=2070&auto=format&fit=crop", "Cultural Show"));
            activity7.setImages(images7);

            activity7.setPrice(new BigDecimal("700000"));
            activity7.setOriginalPrice(new BigDecimal("700000"));
            activity7.setCancellationPolicy("Non-refundable");
            activity7.setStatus(ActivityStatus.ACTIVE);
            activity7.setFeatured(true);
            activity7.setAverageRating(new BigDecimal("4.7"));
            activity7.setTotalReviews(230);
            activity7.setTotalBooked(1500);
            activity7.setCreatedAt(LocalDateTime.now());
            activity7.setUpdatedAt(LocalDateTime.now());
            activities.add(activity7);

            // Activity 8: Mekong Delta
            Activity activity8 = new Activity();
            activity8.setName("Mekong Delta Small Group Tour");
            activity8.setSlug("mekong-delta-small-group");
            activity8.setCategory(ActivityCategory.TOUR);
            activity8.setType("Day Trip");
            activity8.setDescription("Explore the maze of waterways in the Mekong Delta, visit local workshops, and enjoy a rowing boat trip.");
            activity8.setHighlights(Arrays.asList("Rowing boat", "Coconut candy workshop", "Honey tea", "Traditional music"));
            activity8.setIncluded(Arrays.asList("Transport", "Lunch", "Boat trip", "Guide", "Entrance fees"));
            activity8.setNotIncluded(Arrays.asList("Drinks", "Tips"));
            activity8.setDuration("9 hours");
            activity8.setMinParticipants(2);
            activity8.setMaxParticipants(12);
            activity8.setDifficulty(ActivityDifficulty.EASY);
            activity8.setAgeRestriction("All ages");
            activity8.setLanguages(Arrays.asList("English"));
            activity8.setMeetingPoint("District 1 Hotel Pickup");

            List<Activity.ActivityImage> images8 = new ArrayList<>();
            images8.add(new Activity.ActivityImage("https://images.unsplash.com/photo-1558618006-438434632726?q=80&w=2070&auto=format&fit=crop", "Mekong Delta"));
            activity8.setImages(images8);

            activity8.setPrice(new BigDecimal("950000"));
            activity8.setOriginalPrice(new BigDecimal("1200000"));
            activity8.setCancellationPolicy("Free cancellation up to 24 hours");
            activity8.setStatus(ActivityStatus.ACTIVE);
            activity8.setFeatured(true);
            activity8.setAverageRating(new BigDecimal("4.5"));
            activity8.setTotalReviews(410);
            activity8.setTotalBooked(950);
            activity8.setCreatedAt(LocalDateTime.now());
            activity8.setUpdatedAt(LocalDateTime.now());
            activities.add(activity8);

            activityRepository.saveAll(activities);
            System.out.println("Seeded " + activities.size() + " activities.");
        }
    }
}
