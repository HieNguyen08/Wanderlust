package com.wanderlust.api.seeder;

import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.HotelType;
import com.wanderlust.api.entity.types.HotelStatusType;
import com.wanderlust.api.entity.types.RoomType;
import com.wanderlust.api.entity.types.RoomStatusType;
import com.wanderlust.api.entity.types.CancellationPolicyType;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class HotelDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(HotelDataSeeder.class);

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public HotelDataSeeder(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    public void seedHotels() {
        try {
            long hotelCount = hotelRepository.count();
            long roomCount = roomRepository.count();

            // Always reseed to update room data with new options structure
            if (hotelCount > 0 || roomCount > 0) {
                logger.info("Deleting existing {} hotels and {} rooms to reseed with new structure...", hotelCount,
                        roomCount);
                roomRepository.deleteAll();
                hotelRepository.deleteAll();
            }

            logger.info("Starting hotel and room seed...");

            List<Hotel> hotels = generateSampleHotels();
            List<Hotel> savedHotels = hotelRepository.saveAll(hotels);

            logger.info("Successfully seeded {} hotels across multiple locations to database!", savedHotels.size());

            // Seed rooms for each hotel
            List<Room> allRooms = new ArrayList<>();
            for (Hotel hotel : savedHotels) {
                List<Room> rooms = generateSampleRooms(hotel.getHotelID());
                allRooms.addAll(rooms);
            }

            List<Room> savedRooms = roomRepository.saveAll(allRooms);
            logger.info("Successfully seeded {} rooms to database!", savedRooms.size());

        } catch (Exception e) {
            logger.error("Error seeding hotels: {}", e.getMessage(), e);
        }
    }

    private List<Hotel> generateSampleHotels() {
        List<Hotel> hotels = new ArrayList<>();

        // Hotel 1: Vinpearl Resort & Spa Đà Nẵng
        Hotel hotel1 = new Hotel();
        hotel1.setHotelID(null); // Auto-generate
        hotel1.setVendorId("vendor001");
        hotel1.setLocationId("location_danang");
        hotel1.setName("Vinpearl Resort & Spa Đà Nẵng");
        hotel1.setSlug("vinpearl-resort-spa-da-nang");
        hotel1.setHotel_Type(HotelType.RESORT);
        hotel1.setStarRating(5);
        hotel1.setAddress("Phạm Văn Đồng, Sơn Trà, Đà Nẵng");
        hotel1.setLatitude(new BigDecimal("16.0544"));
        hotel1.setLongitude(new BigDecimal("108.2522"));
        hotel1.setDescription(
                "Vinpearl Resort & Spa Đà Nẵng là lựa chọn hoàn hảo cho kỳ nghỉ của bạn. Với vị trí thuận lợi ngay trên bãi biển Mỹ Khê, bạn có thể tận hưởng khung cảnh biển tuyệt đẹp. Resort cung cấp đầy đủ các tiện nghi hiện đại bao gồm hồ bơi ngoài trời, spa cao cấp, nhà hàng buffet quốc tế, và các hoạt động giải trí phong phú.");
        hotel1.setShortDescription("Resort 5 sao sang trọng ngay trên bãi biển Mỹ Khê");
        hotel1.setPhone("0236 3847 333");
        hotel1.setEmail("reservation.danang@vinpearl.com");
        hotel1.setWebsite("https://vinpearl.com/vi/vinpearl-resort-spa-da-nang");

        hotel1.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Lobby chính", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080",
                        "Phòng cao cấp", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Hồ bơi ngoài trời", 3)));

        hotel1.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa & Massage", "Nhà hàng", "Phòng tập gym",
                "Bãi biển riêng", "Chỗ đậu xe miễn phí"));

        Hotel.HotelPolicies policies1 = new Hotel.HotelPolicies();
        policies1.setCancellation("Miễn phí hủy phòng trước 24h");
        policies1.setPets(false);
        policies1.setSmoking(false);
        hotel1.setPolicies(policies1);

        hotel1.setStatus(HotelStatusType.ACTIVE);
        hotel1.setFeatured(true);
        hotel1.setVerified(true);
        hotel1.setAverageRating(new BigDecimal("4.8"));
        hotel1.setTotalReviews(342);
        hotel1.setTotalRooms(250);
        hotel1.setLowestPrice(new BigDecimal("2500000"));

        hotels.add(hotel1);

        // Hotel 2: Premier Village Danang Resort
        Hotel hotel2 = new Hotel();
        hotel2.setHotelID(null);
        hotel2.setVendorId("vendor002");
        hotel2.setLocationId("location_danang");
        hotel2.setName("Premier Village Danang Resort");
        hotel2.setSlug("premier-village-danang-resort");
        hotel2.setHotel_Type(HotelType.RESORT);
        hotel2.setStarRating(5);
        hotel2.setAddress("99 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng");
        hotel2.setLatitude(new BigDecimal("16.0397"));
        hotel2.setLongitude(new BigDecimal("108.2525"));
        hotel2.setDescription(
                "Premier Village Danang Resort mang đến trải nghiệm nghỉ dưỡng đẳng cấp với các biệt thự sang trọng. Mỗi biệt thự đều có hồ bơi riêng và tầm nhìn ra biển tuyệt đẹp. Resort cung cấp dịch vụ 5 sao với đội ngũ nhân viên chuyên nghiệp, nhiệt tình.");
        hotel2.setShortDescription("Biệt thự cao cấp với hồ bơi riêng");
        hotel2.setPhone("0236 3919 999");
        hotel2.setEmail("info@premiervillage-danang.com");
        hotel2.setWebsite("https://www.premiervillage-danang.com");

        hotel2.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080",
                        "Biệt thự view biển", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1759223607861-f0ef3e617739?w=1080",
                        "Phòng tắm sang trọng", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080",
                        "Khu vực tiếp khách", 3)));

        hotel2.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi riêng", "Bếp riêng", "Chỗ đậu xe", "Nhà hàng",
                "Dịch vụ phòng 24h", "Xe đưa đón sân bay"));

        Hotel.HotelPolicies policies2 = new Hotel.HotelPolicies();
        policies2.setCancellation("Miễn phí hủy phòng trước 48h");
        policies2.setPets(true);
        policies2.setSmoking(false);
        hotel2.setPolicies(policies2);

        hotel2.setStatus(HotelStatusType.ACTIVE);
        hotel2.setFeatured(true);
        hotel2.setVerified(true);
        hotel2.setAverageRating(new BigDecimal("4.9"));
        hotel2.setTotalReviews(218);
        hotel2.setTotalRooms(100);
        hotel2.setLowestPrice(new BigDecimal("3200000"));

        hotels.add(hotel2);

        // Hotel 3: Novotel Danang Premier Han River
        Hotel hotel3 = new Hotel();
        hotel3.setHotelID(null);
        hotel3.setVendorId("vendor003");
        hotel3.setLocationId("location_danang");
        hotel3.setName("Novotel Danang Premier Han River");
        hotel3.setSlug("novotel-danang-premier-han-river");
        hotel3.setHotel_Type(HotelType.HOTEL);
        hotel3.setStarRating(4);
        hotel3.setAddress("36 Bạch Đằng, Hải Châu, Đà Nẵng");
        hotel3.setLatitude(new BigDecimal("16.0678"));
        hotel3.setLongitude(new BigDecimal("108.2229"));
        hotel3.setDescription(
                "Novotel Danang Premier Han River tọa lạc ngay bên bờ sông Hàn, mang đến tầm nhìn tuyệt đẹp ra sông và thành phố. Khách sạn cung cấp các tiện nghi hiện đại, phù hợp cho cả khách du lịch và công tác. Vị trí thuận lợi giúp bạn dễ dàng di chuyển đến các điểm tham quan nổi tiếng.");
        hotel3.setShortDescription("Khách sạn 4 sao view sông Hàn");
        hotel3.setPhone("0236 3929 999");
        hotel3.setEmail("h7648@accor.com");
        hotel3.setWebsite("https://novoteldanangpremier.com");

        hotel3.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?w=1080",
                        "Phòng Superior", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1639998734107-2c65ced46538?w=1080",
                        "Khu vực lobby", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1614568112072-770f89361490?w=1080",
                        "View sông Hàn", 3)));

        hotel3.setAmenities(
                Arrays.asList("Wifi miễn phí", "Hồ bơi", "Phòng tập gym", "Nhà hàng", "Quầy bar", "Dịch vụ giặt ủi"));

        Hotel.HotelPolicies policies3 = new Hotel.HotelPolicies();
        policies3.setCancellation("Miễn phí hủy phòng trước 24h");
        policies3.setPets(false);
        policies3.setSmoking(false);
        hotel3.setPolicies(policies3);

        hotel3.setStatus(HotelStatusType.ACTIVE);
        hotel3.setFeatured(false);
        hotel3.setVerified(true);
        hotel3.setAverageRating(new BigDecimal("4.2"));
        hotel3.setTotalReviews(156);
        hotel3.setTotalRooms(323);
        hotel3.setLowestPrice(new BigDecimal("1800000"));

        hotels.add(hotel3);

        // Hotel 4: Fusion Suites Danang Beach
        Hotel hotel4 = new Hotel();
        hotel4.setHotelID(null);
        hotel4.setVendorId("vendor001");
        hotel4.setLocationId("location_danang");
        hotel4.setName("Fusion Suites Danang Beach");
        hotel4.setSlug("fusion-suites-danang-beach");
        hotel4.setHotel_Type(HotelType.HOTEL);
        hotel4.setStarRating(4);
        hotel4.setAddress("Võ Nguyên Giáp, Sơn Trà, Đà Nẵng");
        hotel4.setLatitude(new BigDecimal("16.0422"));
        hotel4.setLongitude(new BigDecimal("108.2503"));
        hotel4.setDescription(
                "Fusion Suites Danang Beach nổi tiếng với dịch vụ all-inclusive độc đáo, bao gồm bữa sáng, spa không giới hạn và các hoạt động thể thao. Khách sạn có vị trí đắc địa ngay trên bãi biển Mỹ Khê, cung cấp không gian nghỉ dưỡng yên tĩnh và thoải mái.");
        hotel4.setShortDescription("All-inclusive resort với spa miễn phí");
        hotel4.setPhone("0236 3938 888");
        hotel4.setEmail("reservations.danangbeach@fusionsuitesresorts.com");
        hotel4.setWebsite("https://www.fusionsuitesresorts.com/danangbeach");

        hotel4.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=1080",
                        "Suite sang trọng", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080", "Khu spa",
                        2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Bãi biển riêng", 3)));

        hotel4.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa miễn phí", "Bữa sáng buffet",
                "Dịch vụ giặt ủi", "Yoga buổi sáng"));

        Hotel.HotelPolicies policies4 = new Hotel.HotelPolicies();
        policies4.setCancellation("Miễn phí hủy phòng trước 72h");
        policies4.setPets(false);
        policies4.setSmoking(false);
        hotel4.setPolicies(policies4);

        hotel4.setStatus(HotelStatusType.ACTIVE);
        hotel4.setFeatured(true);
        hotel4.setVerified(true);
        hotel4.setAverageRating(new BigDecimal("4.7"));
        hotel4.setTotalReviews(289);
        hotel4.setTotalRooms(198);
        hotel4.setLowestPrice(new BigDecimal("2100000"));

        hotels.add(hotel4);

        // Hotel 5: Grand Mercure Danang
        Hotel hotel5 = new Hotel();
        hotel5.setHotelID(null);
        hotel5.setVendorId("vendor004");
        hotel5.setLocationId("location_danang");
        hotel5.setName("Grand Mercure Danang");
        hotel5.setSlug("grand-mercure-danang");
        hotel5.setHotel_Type(HotelType.HOTEL);
        hotel5.setStarRating(5);
        hotel5.setAddress("Lô A1, Đường Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng");
        hotel5.setLatitude(new BigDecimal("16.0158"));
        hotel5.setLongitude(new BigDecimal("108.2614"));
        hotel5.setDescription(
                "Grand Mercure Danang là khách sạn 5 sao hiện đại, kết hợp giữa phong cách quốc tế và nét văn hóa Việt Nam. Khách sạn cung cấp đầy đủ tiện nghi cao cấp, phù hợp cho cả gia đình và khách công tác. Đội ngũ nhân viên chuyên nghiệp luôn sẵn sàng phục vụ 24/7.");
        hotel5.setShortDescription("Khách sạn 5 sao phong cách hiện đại");
        hotel5.setPhone("0236 3979 777");
        hotel5.setEmail("h9707@accor.com");
        hotel5.setWebsite("https://grandmercuredanang.com");

        hotel5.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1614568112072-770f89361490?w=1080",
                        "Tòa nhà chính", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080",
                        "Phòng Deluxe", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Hồ bơi rooftop", 3)));

        hotel5.setAmenities(
                Arrays.asList("Wifi miễn phí", "Hồ bơi", "Nhà hàng", "Quầy bar", "Spa", "Phòng tập gym", "Phòng họp"));

        Hotel.HotelPolicies policies5 = new Hotel.HotelPolicies();
        policies5.setCancellation("Miễn phí hủy phòng trước 24h");
        policies5.setPets(false);
        policies5.setSmoking(false);
        hotel5.setPolicies(policies5);

        hotel5.setStatus(HotelStatusType.ACTIVE);
        hotel5.setFeatured(true);
        hotel5.setVerified(true);
        hotel5.setAverageRating(new BigDecimal("4.5"));
        hotel5.setTotalReviews(203);
        hotel5.setTotalRooms(280);
        hotel5.setLowestPrice(new BigDecimal("2800000"));

        hotels.add(hotel5);

        // Hotel 6: InterContinental Danang Sun Peninsula Resort
        Hotel hotel6 = new Hotel();
        hotel6.setHotelID(null);
        hotel6.setVendorId("vendor005");
        hotel6.setLocationId("location_danang");
        hotel6.setName("InterContinental Danang Sun Peninsula Resort");
        hotel6.setSlug("intercontinental-danang-sun-peninsula");
        hotel6.setHotel_Type(HotelType.RESORT);
        hotel6.setStarRating(5);
        hotel6.setAddress("Bãi Bắc, Sơn Trà, Đà Nẵng");
        hotel6.setLatitude(new BigDecimal("16.1053"));
        hotel6.setLongitude(new BigDecimal("108.2694"));
        hotel6.setDescription(
                "InterContinental Danang Sun Peninsula Resort là resort xa hoa nhất Đà Nẵng, được thiết kế bởi kiến trúc sư nổi tiếng Bill Bensley. Tọa lạc trên bán đảo Sơn Trà, resort mang đến trải nghiệm nghỉ dưỡng đẳng cấp thế giới với tầm nhìn 360 độ ra biển và núi.");
        hotel6.setShortDescription("Resort 5 sao đẳng cấp thế giới trên bán đảo Sơn Trà");
        hotel6.setPhone("0236 3938 888");
        hotel6.setEmail("danang@ihg.com");
        hotel6.setWebsite("https://www.intercontinentaldanang.com");

        hotel6.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Hồ bơi vô cực", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Villa cao cấp", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080",
                        "Nhà hàng ven biển", 3)));

        hotel6.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi vô cực", "Spa cao cấp", "5 nhà hàng & quầy bar",
                "Phòng tập gym", "Trung tâm thể dục", "Xe đưa đón miễn phí", "Kids club"));

        Hotel.HotelPolicies policies6 = new Hotel.HotelPolicies();
        policies6.setCancellation("Miễn phí hủy phòng trước 48h");
        policies6.setPets(false);
        policies6.setSmoking(false);
        hotel6.setPolicies(policies6);

        hotel6.setStatus(HotelStatusType.ACTIVE);
        hotel6.setFeatured(true);
        hotel6.setVerified(true);
        hotel6.setAverageRating(new BigDecimal("4.9"));
        hotel6.setTotalReviews(567);
        hotel6.setTotalRooms(201);
        hotel6.setLowestPrice(new BigDecimal("4500000"));

        hotels.add(hotel6);

        // ========== HÀ NỘI (location_hanoi) - 6 hotels ==========

        // Hotel 7: JW Marriott Hotel Hanoi
        Hotel hotel7 = new Hotel();
        hotel7.setHotelID(null);
        hotel7.setVendorId("vendor006");
        hotel7.setLocationId("location_hanoi");
        hotel7.setName("JW Marriott Hotel Hanoi");
        hotel7.setSlug("jw-marriott-hanoi");
        hotel7.setHotel_Type(HotelType.HOTEL);
        hotel7.setStarRating(5);
        hotel7.setAddress("8 Đỗ Đức Dục, Mễ Trì, Nam Từ Liêm, Hà Nội");
        hotel7.setLatitude(new BigDecimal("21.0278"));
        hotel7.setLongitude(new BigDecimal("105.7819"));
        hotel7.setDescription(
                "JW Marriott Hotel Hanoi là khách sạn 5 sao quốc tế hàng đầu tại Hà Nội, kết hợp sang trọng hiện đại với nét văn hóa Việt Nam. Khách sạn có vị trí thuận lợi gần sân bay Nội Bài, phù hợp cho khách công tác và du lịch.");
        hotel7.setShortDescription("Khách sạn 5 sao quốc tế tại trung tâm Hà Nội");
        hotel7.setPhone("024 3833 5588");
        hotel7.setEmail("reservation.hanoi@marriott.com");
        hotel7.setWebsite("https://www.marriott.com/hanoi");

        hotel7.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1614568112072-770f89361490?w=1080",
                        "Lobby sang trọng", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080",
                        "Phòng Executive", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Hồ bơi trong nhà", 3)));
        hotel7.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi trong nhà", "Spa", "3 nhà hàng", "Phòng tập gym",
                "Dịch vụ xe đưa đón sân bay"));
        Hotel.HotelPolicies policies7 = new Hotel.HotelPolicies();
        policies7.setCancellation("Miễn phí hủy phòng trước 24h");
        policies7.setPets(false);
        policies7.setSmoking(false);
        hotel7.setPolicies(policies7);
        hotel7.setStatus(HotelStatusType.ACTIVE);
        hotel7.setFeatured(true);
        hotel7.setVerified(true);
        hotel7.setAverageRating(new BigDecimal("4.7"));
        hotel7.setTotalReviews(412);
        hotel7.setTotalRooms(450);
        hotel7.setLowestPrice(new BigDecimal("3500000"));
        hotels.add(hotel7);

        // Hotel 8: Sofitel Legend Metropole Hanoi
        Hotel hotel8 = new Hotel();
        hotel8.setHotelID(null);
        hotel8.setVendorId("vendor007");
        hotel8.setLocationId("location_hanoi");
        hotel8.setName("Sofitel Legend Metropole Hanoi");
        hotel8.setSlug("sofitel-metropole-hanoi");
        hotel8.setHotel_Type(HotelType.HOTEL);
        hotel8.setStarRating(5);
        hotel8.setAddress("15 Ngô Quyền, Hoàn Kiếm, Hà Nội");
        hotel8.setLatitude(new BigDecimal("21.0231"));
        hotel8.setLongitude(new BigDecimal("105.8544"));
        hotel8.setDescription(
                "Sofitel Legend Metropole Hanoi là khách sạn lịch sử 5 sao, được xây dựng từ năm 1901 với kiến trúc thuộc địa Pháp. Nơi đây từng đón tiếp nhiều chính khách và nghệ sĩ nổi tiếng thế giới.");
        hotel8.setShortDescription("Khách sạn lịch sử 5 sao từ năm 1901");
        hotel8.setPhone("024 3826 6919");
        hotel8.setEmail("h0551@sofitel.com");
        hotel8.setWebsite("https://www.sofitel-legend-metropole-hanoi.com");

        hotel8.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080",
                        "Kiến trúc cổ điển", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?w=1080",
                        "Phòng Historic Wing", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080",
                        "Hồ bơi sân vườn", 3)));
        hotel8.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi ngoài trời", "Spa Lâm Châu", "Nhà hàng Le Beaulieu",
                "Quầy bar Bamboo", "Dịch vụ butler"));
        Hotel.HotelPolicies policies8 = new Hotel.HotelPolicies();
        policies8.setCancellation("Miễn phí hủy phòng trước 48h");
        policies8.setPets(true);
        policies8.setSmoking(false);
        hotel8.setPolicies(policies8);
        hotel8.setStatus(HotelStatusType.ACTIVE);
        hotel8.setFeatured(true);
        hotel8.setVerified(true);
        hotel8.setAverageRating(new BigDecimal("4.9"));
        hotel8.setTotalReviews(678);
        hotel8.setTotalRooms(364);
        hotel8.setLowestPrice(new BigDecimal("4200000"));
        hotels.add(hotel8);

        // Hotel 9: Lotte Hotel Hanoi
        Hotel hotel9 = new Hotel();
        hotel9.setHotelID(null);
        hotel9.setVendorId("vendor008");
        hotel9.setLocationId("location_hanoi");
        hotel9.setName("Lotte Hotel Hanoi");
        hotel9.setSlug("lotte-hotel-hanoi");
        hotel9.setHotel_Type(HotelType.HOTEL);
        hotel9.setStarRating(5);
        hotel9.setAddress("54 Liễu Giai, Ba Đình, Hà Nội");
        hotel9.setLatitude(new BigDecimal("21.0227"));
        hotel9.setLongitude(new BigDecimal("105.8127"));
        hotel9.setDescription(
                "Lotte Hotel Hanoi tọa lạc tại tòa nhà Lotte Center cao 65 tầng, mang đến tầm nhìn toàn cảnh thành phố Hà Nội. Khách sạn kết hợp dịch vụ Hàn Quốc với nét đẹp Việt Nam.");
        hotel9.setShortDescription("Khách sạn 5 sao với view toàn cảnh Hà Nội");
        hotel9.setPhone("024 3333 1000");
        hotel9.setEmail("info.hanoi@lotte.net");
        hotel9.setWebsite("https://www.lottehotel.com/hanoi");

        hotel9.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Tòa nhà Lotte Center", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=1080",
                        "Suite cao cấp", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Rooftop bar", 3)));
        hotel9.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "4 nhà hàng", "Sky bar", "Phòng tập gym",
                "Shopping mall"));
        Hotel.HotelPolicies policies9 = new Hotel.HotelPolicies();
        policies9.setCancellation("Miễn phí hủy phòng trước 24h");
        policies9.setPets(false);
        policies9.setSmoking(false);
        hotel9.setPolicies(policies9);
        hotel9.setStatus(HotelStatusType.ACTIVE);
        hotel9.setFeatured(true);
        hotel9.setVerified(true);
        hotel9.setAverageRating(new BigDecimal("4.6"));
        hotel9.setTotalReviews(534);
        hotel9.setTotalRooms(318);
        hotel9.setLowestPrice(new BigDecimal("3800000"));
        hotels.add(hotel9);

        // Hotel 10: Hilton Hanoi Opera
        Hotel hotel10 = new Hotel();
        hotel10.setHotelID(null);
        hotel10.setVendorId("vendor009");
        hotel10.setLocationId("location_hanoi");
        hotel10.setName("Hilton Hanoi Opera");
        hotel10.setSlug("hilton-hanoi-opera");
        hotel10.setHotel_Type(HotelType.HOTEL);
        hotel10.setStarRating(5);
        hotel10.setAddress("1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội");
        hotel10.setLatitude(new BigDecimal("21.0199"));
        hotel10.setLongitude(new BigDecimal("105.8551"));
        hotel10.setDescription(
                "Hilton Hanoi Opera nằm ngay trung tâm phố cổ, đối diện Nhà hát Lớn Hà Nội. Khách sạn mang phong cách Pháp cổ điển kết hợp tiện nghi hiện đại.");
        hotel10.setShortDescription("Khách sạn 5 sao gần phố cổ và Nhà hát Lớn");
        hotel10.setPhone("024 3933 0500");
        hotel10.setEmail("hanoi@hilton.com");
        hotel10.setWebsite("https://www.hilton.com/hanoi-opera");

        hotel10.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1614568112072-770f89361490?w=1080",
                        "Mặt tiền khách sạn", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080",
                        "Phòng Deluxe", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1759223607861-f0ef3e617739?w=1080",
                        "Phòng tắm sang trọng", 3)));
        hotel10.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi ngoài trời", "Spa", "Nhà hàng Chez Manny",
                "Executive lounge", "Phòng tập gym"));
        Hotel.HotelPolicies policies10 = new Hotel.HotelPolicies();
        policies10.setCancellation("Miễn phí hủy phòng trước 24h");
        policies10.setPets(false);
        policies10.setSmoking(false);
        hotel10.setPolicies(policies10);
        hotel10.setStatus(HotelStatusType.ACTIVE);
        hotel10.setFeatured(true);
        hotel10.setVerified(true);
        hotel10.setAverageRating(new BigDecimal("4.5"));
        hotel10.setTotalReviews(389);
        hotel10.setTotalRooms(269);
        hotel10.setLowestPrice(new BigDecimal("3200000"));
        hotels.add(hotel10);

        // Hotel 11: Pullman Hanoi
        Hotel hotel11 = new Hotel();
        hotel11.setHotelID(null);
        hotel11.setVendorId("vendor010");
        hotel11.setLocationId("location_hanoi");
        hotel11.setName("Pullman Hanoi");
        hotel11.setSlug("pullman-hanoi");
        hotel11.setHotel_Type(HotelType.HOTEL);
        hotel11.setStarRating(5);
        hotel11.setAddress("40 Cát Linh, Đống Đa, Hà Nội");
        hotel11.setLatitude(new BigDecimal("21.0198"));
        hotel11.setLongitude(new BigDecimal("105.8277"));
        hotel11.setDescription(
                "Pullman Hanoi là khách sạn 5 sao hiện đại thuộc chuỗi Accor, cung cấp không gian làm việc và nghỉ ngơi lý tưởng cho khách công tác và du lịch.");
        hotel11.setShortDescription("Khách sạn 5 sao hiện đại phong cách Pháp");
        hotel11.setPhone("024 3733 0888");
        hotel11.setEmail("h6655@accor.com");
        hotel11.setWebsite("https://www.pullmanhanoi.com");

        hotel11.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?w=1080",
                        "Phòng Superior", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1639998734107-2c65ced46538?w=1080", "Khu lobby",
                        2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080", "Hồ bơi",
                        3)));
        hotel11.setAmenities(
                Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "Nhà hàng", "Quầy bar", "Phòng tập gym", "Phòng họp"));
        Hotel.HotelPolicies policies11 = new Hotel.HotelPolicies();
        policies11.setCancellation("Miễn phí hủy phòng trước 24h");
        policies11.setPets(false);
        policies11.setSmoking(false);
        hotel11.setPolicies(policies11);
        hotel11.setStatus(HotelStatusType.ACTIVE);
        hotel11.setFeatured(false);
        hotel11.setVerified(true);
        hotel11.setAverageRating(new BigDecimal("4.3"));
        hotel11.setTotalReviews(267);
        hotel11.setTotalRooms(242);
        hotel11.setLowestPrice(new BigDecimal("2800000"));
        hotels.add(hotel11);

        // Hotel 12: InterContinental Hanoi Westlake
        Hotel hotel12 = new Hotel();
        hotel12.setHotelID(null);
        hotel12.setVendorId("vendor011");
        hotel12.setLocationId("location_hanoi");
        hotel12.setName("InterContinental Hanoi Westlake");
        hotel12.setSlug("intercontinental-hanoi-westlake");
        hotel12.setHotel_Type(HotelType.RESORT);
        hotel12.setStarRating(5);
        hotel12.setAddress("1A Nghi Tàm, Tây Hồ, Hà Nội");
        hotel12.setLatitude(new BigDecimal("21.0537"));
        hotel12.setLongitude(new BigDecimal("105.8230"));
        hotel12.setDescription(
                "InterContinental Hanoi Westlake là khách sạn duy nhất được xây dựng trên mặt hồ Tây, mang đến trải nghiệm nghỉ dưỡng thanh bình giữa lòng thủ đô.");
        hotel12.setShortDescription("Resort 5 sao độc nhất trên mặt Hồ Tây");
        hotel12.setPhone("024 6270 8888");
        hotel12.setEmail("hanoi@ihg.com");
        hotel12.setWebsite("https://www.intercontinental-hanoi.com");

        hotel12.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080",
                        "View Hồ Tây", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=1080",
                        "Villa on lake", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080",
                        "Nhà hàng Sunset Bar", 3)));
        hotel12.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "3 nhà hàng", "Sunset bar",
                "Dịch vụ thuyền", "Phòng tập gym"));
        Hotel.HotelPolicies policies12 = new Hotel.HotelPolicies();
        policies12.setCancellation("Miễn phí hủy phòng trước 48h");
        policies12.setPets(false);
        policies12.setSmoking(false);
        hotel12.setPolicies(policies12);
        hotel12.setStatus(HotelStatusType.ACTIVE);
        hotel12.setFeatured(true);
        hotel12.setVerified(true);
        hotel12.setAverageRating(new BigDecimal("4.8"));
        hotel12.setTotalReviews(456);
        hotel12.setTotalRooms(359);
        hotel12.setLowestPrice(new BigDecimal("4000000"));
        hotels.add(hotel12);

        // ========== PHÚ QUỐC (location_phuquoc) - 6 hotels ==========

        // Hotel 13: JW Marriott Phu Quoc Emerald Bay
        Hotel hotel13 = new Hotel();
        hotel13.setHotelID(null);
        hotel13.setVendorId("vendor012");
        hotel13.setLocationId("location_phuquoc");
        hotel13.setName("JW Marriott Phu Quoc Emerald Bay Resort & Spa");
        hotel13.setSlug("jw-marriott-phu-quoc");
        hotel13.setHotel_Type(HotelType.RESORT);
        hotel13.setStarRating(5);
        hotel13.setAddress("Bãi Khem, An Thới, Phú Quốc, Kiên Giang");
        hotel13.setLatitude(new BigDecimal("10.1165"));
        hotel13.setLongitude(new BigDecimal("103.9675"));
        hotel13.setDescription(
                "JW Marriott Phu Quoc Emerald Bay được thiết kế bởi kiến trúc sư nổi tiếng Bill Bensley, lấy cảm hứng từ trường đại học Pháp cổ. Resort mang đến trải nghiệm nghỉ dưỡng độc đáo và đẳng cấp.");
        hotel13.setShortDescription("Resort 5 sao thiết kế độc đáo tại Bãi Khem");
        hotel13.setPhone("0297 3977 999");
        hotel13.setEmail("phuquoc@marriott.com");
        hotel13.setWebsite("https://www.marriott.com/phu-quoc");

        hotel13.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Hồ bơi infinity", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Villa biển", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080",
                        "Bãi biển riêng", 3)));
        hotel13.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi vô cực", "Spa", "5 nhà hàng", "Kids club",
                "Dịch vụ butler", "Xe đưa đón sân bay"));
        Hotel.HotelPolicies policies13 = new Hotel.HotelPolicies();
        policies13.setCancellation("Miễn phí hủy phòng trước 48h");
        policies13.setPets(false);
        policies13.setSmoking(false);
        hotel13.setPolicies(policies13);
        hotel13.setStatus(HotelStatusType.ACTIVE);
        hotel13.setFeatured(true);
        hotel13.setVerified(true);
        hotel13.setAverageRating(new BigDecimal("4.9"));
        hotel13.setTotalReviews(723);
        hotel13.setTotalRooms(244);
        hotel13.setLowestPrice(new BigDecimal("5500000"));
        hotels.add(hotel13);

        // Hotel 14: InterContinental Phu Quoc Long Beach
        Hotel hotel14 = new Hotel();
        hotel14.setHotelID(null);
        hotel14.setVendorId("vendor013");
        hotel14.setLocationId("location_phuquoc");
        hotel14.setName("InterContinental Phu Quoc Long Beach Resort");
        hotel14.setSlug("intercontinental-phu-quoc");
        hotel14.setHotel_Type(HotelType.RESORT);
        hotel14.setStarRating(5);
        hotel14.setAddress("Bãi Trường, Dương Tơ, Phú Quốc, Kiên Giang");
        hotel14.setLatitude(new BigDecimal("10.2114"));
        hotel14.setLongitude(new BigDecimal("103.9549"));
        hotel14.setDescription(
                "InterContinental Phu Quoc Long Beach Resort nằm trên bãi Trường dài 20km, mang đến trải nghiệm nghỉ dưỡng đẳng cấp quốc tế với view biển tuyệt đẹp.");
        hotel14.setShortDescription("Resort 5 sao trên bãi Trường dài nhất Phú Quốc");
        hotel14.setPhone("0297 3977 888");
        hotel14.setEmail("phuquoclongbeach@ihg.com");
        hotel14.setWebsite("https://www.intercontinental-phuquoc.com");

        hotel14.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080",
                        "Resort view", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080", "Hồ bơi",
                        2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080", "Bãi biển",
                        3)));
        hotel14.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "4 nhà hàng", "Kids club", "Phòng tập gym",
                "Dịch vụ phòng 24h"));
        Hotel.HotelPolicies policies14 = new Hotel.HotelPolicies();
        policies14.setCancellation("Miễn phí hủy phòng trước 48h");
        policies14.setPets(false);
        policies14.setSmoking(false);
        hotel14.setPolicies(policies14);
        hotel14.setStatus(HotelStatusType.ACTIVE);
        hotel14.setFeatured(true);
        hotel14.setVerified(true);
        hotel14.setAverageRating(new BigDecimal("4.8"));
        hotel14.setTotalReviews(612);
        hotel14.setTotalRooms(459);
        hotel14.setLowestPrice(new BigDecimal("4800000"));
        hotels.add(hotel14);

        // Hotel 15: Premier Village Phu Quoc Resort
        Hotel hotel15 = new Hotel();
        hotel15.setHotelID(null);
        hotel15.setVendorId("vendor014");
        hotel15.setLocationId("location_phuquoc");
        hotel15.setName("Premier Village Phu Quoc Resort");
        hotel15.setSlug("premier-village-phu-quoc");
        hotel15.setHotel_Type(HotelType.RESORT);
        hotel15.setStarRating(5);
        hotel15.setAddress("Nguyễn Trung Trực, Dương Đông, Phú Quốc, Kiên Giang");
        hotel15.setLatitude(new BigDecimal("10.2258"));
        hotel15.setLongitude(new BigDecimal("103.9636"));
        hotel15.setDescription(
                "Premier Village Phu Quoc Resort cung cấp biệt thự sang trọng với hồ bơi riêng, view biển tuyệt đẹp và dịch vụ đẳng cấp 5 sao.");
        hotel15.setShortDescription("Biệt thự cao cấp với hồ bơi riêng");
        hotel15.setPhone("0297 3958 888");
        hotel15.setEmail("phuquoc@premiervillage.com");
        hotel15.setWebsite("https://www.premiervillage-phuquoc.com");

        hotel15.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Villa sang trọng", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=1080",
                        "Hồ bơi riêng", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080", "Phòng ngủ",
                        3)));
        hotel15.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi riêng", "Bếp riêng", "Spa", "Nhà hàng",
                "Xe đưa đón sân bay", "Butler service"));
        Hotel.HotelPolicies policies15 = new Hotel.HotelPolicies();
        policies15.setCancellation("Miễn phí hủy phòng trước 72h");
        policies15.setPets(true);
        policies15.setSmoking(false);
        hotel15.setPolicies(policies15);
        hotel15.setStatus(HotelStatusType.ACTIVE);
        hotel15.setFeatured(true);
        hotel15.setVerified(true);
        hotel15.setAverageRating(new BigDecimal("4.7"));
        hotel15.setTotalReviews(445);
        hotel15.setTotalRooms(228);
        hotel15.setLowestPrice(new BigDecimal("5200000"));
        hotels.add(hotel15);

        // Hotel 16: Vinpearl Resort Phu Quoc
        Hotel hotel16 = new Hotel();
        hotel16.setHotelID(null);
        hotel16.setVendorId("vendor015");
        hotel16.setLocationId("location_phuquoc");
        hotel16.setName("Vinpearl Resort & Spa Phu Quoc");
        hotel16.setSlug("vinpearl-phu-quoc");
        hotel16.setHotel_Type(HotelType.RESORT);
        hotel16.setStarRating(5);
        hotel16.setAddress("Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang");
        hotel16.setLatitude(new BigDecimal("10.4036"));
        hotel16.setLongitude(new BigDecimal("103.9372"));
        hotel16.setDescription(
                "Vinpearl Resort & Spa Phu Quoc tọa lạc tại bãi Dài hoang sơ, kết hợp nghỉ dưỡng với vui chơi giải trí tại Vinpearl Safari và VinWonders.");
        hotel16.setShortDescription("Resort 5 sao với Vinpearl Safari và VinWonders");
        hotel16.setPhone("1900 6677");
        hotel16.setEmail("phuquoc@vinpearl.com");
        hotel16.setWebsite("https://vinpearl.com/phu-quoc");

        hotel16.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Hồ bơi resort", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1614568112072-770f89361490?w=1080", "Lobby", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080", "Bãi biển",
                        3)));
        hotel16.setAmenities(
                Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "Nhà hàng", "Safari Park", "VinWonders", "Kids club"));
        Hotel.HotelPolicies policies16 = new Hotel.HotelPolicies();
        policies16.setCancellation("Miễn phí hủy phòng trước 24h");
        policies16.setPets(false);
        policies16.setSmoking(false);
        hotel16.setPolicies(policies16);
        hotel16.setStatus(HotelStatusType.ACTIVE);
        hotel16.setFeatured(true);
        hotel16.setVerified(true);
        hotel16.setAverageRating(new BigDecimal("4.6"));
        hotel16.setTotalReviews(567);
        hotel16.setTotalRooms(774);
        hotel16.setLowestPrice(new BigDecimal("3900000"));
        hotels.add(hotel16);

        // Hotel 17: Salinda Resort Phu Quoc
        Hotel hotel17 = new Hotel();
        hotel17.setHotelID(null);
        hotel17.setVendorId("vendor016");
        hotel17.setLocationId("location_phuquoc");
        hotel17.setName("Salinda Resort Phu Quoc Island");
        hotel17.setSlug("salinda-phu-quoc");
        hotel17.setHotel_Type(HotelType.RESORT);
        hotel17.setStarRating(5);
        hotel17.setAddress("Cửa Lấp, Dương Tơ, Phú Quốc, Kiên Giang");
        hotel17.setLatitude(new BigDecimal("10.2156"));
        hotel17.setLongitude(new BigDecimal("103.9548"));
        hotel17.setDescription(
                "Salinda Resort Phu Quoc Island là resort boutique 5 sao, mang phong cách Địa Trung Hải với thiết kế tinh tế và dịch vụ tận tâm.");
        hotel17.setShortDescription("Resort boutique sang trọng phong cách Địa Trung Hải");
        hotel17.setPhone("0297 3848 999");
        hotel17.setEmail("info@salindaresort.com");
        hotel17.setWebsite("https://www.salindaresort.com");

        hotel17.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?w=1080",
                        "Resort architecture", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?w=1080",
                        "Phòng deluxe", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080", "Hồ bơi",
                        3)));
        hotel17.setAmenities(Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "Nhà hàng", "Bar", "Phòng tập gym"));
        Hotel.HotelPolicies policies17 = new Hotel.HotelPolicies();
        policies17.setCancellation("Miễn phí hủy phòng trước 48h");
        policies17.setPets(false);
        policies17.setSmoking(false);
        hotel17.setPolicies(policies17);
        hotel17.setStatus(HotelStatusType.ACTIVE);
        hotel17.setFeatured(false);
        hotel17.setVerified(true);
        hotel17.setAverageRating(new BigDecimal("4.5"));
        hotel17.setTotalReviews(334);
        hotel17.setTotalRooms(121);
        hotel17.setLowestPrice(new BigDecimal("3600000"));
        hotels.add(hotel17);

        // Hotel 18: Fusion Resort Phu Quoc
        Hotel hotel18 = new Hotel();
        hotel18.setHotelID(null);
        hotel18.setVendorId("vendor017");
        hotel18.setLocationId("location_phuquoc");
        hotel18.setName("Fusion Resort Phu Quoc");
        hotel18.setSlug("fusion-phu-quoc");
        hotel18.setHotel_Type(HotelType.RESORT);
        hotel18.setStarRating(5);
        hotel18.setAddress("Xóm Mới, Dương Tơ, Phú Quốc, Kiên Giang");
        hotel18.setLatitude(new BigDecimal("10.2234"));
        hotel18.setLongitude(new BigDecimal("103.9587"));
        hotel18.setDescription(
                "Fusion Resort Phu Quoc nổi tiếng với concept all-spa inclusive độc đáo, mang đến trải nghiệm spa không giới hạn cho khách lưu trú.");
        hotel18.setShortDescription("All-spa inclusive resort với spa không giới hạn");
        hotel18.setPhone("0297 3995 000");
        hotel18.setEmail("phuquoc@fusionresorts.com");
        hotel18.setWebsite("https://www.fusionresorts.com/phuquoc");

        hotel18.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080", "Spa area",
                        1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=1080", "Villa", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080", "Beach",
                        3)));
        hotel18.setAmenities(
                Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa miễn phí", "Bữa sáng buffet", "Yoga", "Nhà hàng"));
        Hotel.HotelPolicies policies18 = new Hotel.HotelPolicies();
        policies18.setCancellation("Miễn phí hủy phòng trước 72h");
        policies18.setPets(false);
        policies18.setSmoking(false);
        hotel18.setPolicies(policies18);
        hotel18.setStatus(HotelStatusType.ACTIVE);
        hotel18.setFeatured(true);
        hotel18.setVerified(true);
        hotel18.setAverageRating(new BigDecimal("4.7"));
        hotel18.setTotalReviews(489);
        hotel18.setTotalRooms(198);
        hotel18.setLowestPrice(new BigDecimal("4100000"));
        hotels.add(hotel18);

        return hotels;
    }

    private List<Room> generateSampleRooms(String hotelId) {
        List<Room> rooms = new ArrayList<>();

        // Superior Room
        Room room1 = new Room();
        room1.setId(null);
        room1.setHotelId(hotelId);
        room1.setName("Phòng Superior");
        room1.setSlug("superior-room-" + hotelId);
        room1.setType(RoomType.DOUBLE);
        room1.setMaxOccupancy(2);
        room1.setBedType("2 giường đơn");
        room1.setSize(new BigDecimal("28"));
        room1.setDescription("Phòng Superior rộng rãi với thiết kế hiện đại, đầy đủ tiện nghi cơ bản.");

        room1.setImages(Arrays.asList(
                new Room.RoomImage("https://images.unsplash.com/photo-1603152481281-9fc1b9810e10?w=800", "Phòng ngủ",
                        1),
                new Room.RoomImage("https://images.unsplash.com/photo-1759223607861-f0ef3e617739?w=800", "Phòng tắm",
                        2)));

        room1.setAmenities(Arrays.asList("Tủ lạnh", "Điều hòa", "TV LED", "Két sắt", "Bàn làm việc"));
        room1.setBasePrice(new BigDecimal("1500000"));
        room1.setOriginalPrice(new BigDecimal("2000000"));
        room1.setTotalRooms(50);
        room1.setAvailableRooms(38);
        room1.setRefundable(true);
        room1.setCancellationPolicy(CancellationPolicyType.FLEXIBLE);
        room1.setBreakfastIncluded(false);
        room1.setStatus(RoomStatusType.ACTIVE);

        // Add room options
        room1.setOptions(Arrays.asList(
                new Room.RoomOption("opt-1-1", "Without Breakfast", "2 giường đơn", false, true,
                        new BigDecimal("1500000"), new BigDecimal("2000000"), null, 6000),
                new Room.RoomOption("opt-1-2", "Breakfast for 2", "2 giường đơn", true, true,
                        new BigDecimal("1650000"), new BigDecimal("2200000"), null, 6600)));

        rooms.add(room1);

        // Deluxe Room
        Room room2 = new Room();
        room2.setId(null);
        room2.setHotelId(hotelId);
        room2.setName("Phòng Deluxe");
        room2.setSlug("deluxe-room-" + hotelId);
        room2.setType(RoomType.DOUBLE);
        room2.setMaxOccupancy(2);
        room2.setBedType("1 giường King");
        room2.setSize(new BigDecimal("35"));
        room2.setDescription("Phòng Deluxe sang trọng với tầm nhìn đẹp và không gian rộng rãi hơn.");

        room2.setImages(Arrays.asList(
                new Room.RoomImage("https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?w=800",
                        "Phòng ngủ cao cấp", 1),
                new Room.RoomImage("https://images.unsplash.com/photo-1759223607861-f0ef3e617739?w=800", "Phòng tắm",
                        2),
                new Room.RoomImage("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800", "Ban công",
                        3)));

        room2.setAmenities(
                Arrays.asList("Tủ lạnh", "Điều hòa", "TV LED 55 inch", "Két sắt", "Bàn làm việc", "Sofa", "Ban công"));
        room2.setBasePrice(new BigDecimal("2200000"));
        room2.setOriginalPrice(new BigDecimal("2933000"));
        room2.setTotalRooms(40);
        room2.setAvailableRooms(25);
        room2.setRefundable(true);
        room2.setCancellationPolicy(CancellationPolicyType.FLEXIBLE);
        room2.setBreakfastIncluded(false);
        room2.setStatus(RoomStatusType.ACTIVE);

        room2.setOptions(Arrays.asList(
                new Room.RoomOption("opt-2-1", "Without Breakfast", "1 giường King", false, true,
                        new BigDecimal("2200000"), new BigDecimal("2933000"), null, 8800),
                new Room.RoomOption("opt-2-2", "Breakfast for 2", "1 giường King", true, true,
                        new BigDecimal("2420000"), new BigDecimal("3226000"), 1, 9680)));

        rooms.add(room2);

        // Suite
        Room room3 = new Room();
        room3.setId(null);
        room3.setHotelId(hotelId);
        room3.setName("Suite 1 Phòng Ngủ");
        room3.setSlug("suite-1br-" + hotelId);
        room3.setType(RoomType.SUITE);
        room3.setMaxOccupancy(3);
        room3.setBedType("1 giường King + 1 sofa bed");
        room3.setSize(new BigDecimal("55"));
        room3.setDescription("Suite cao cấp với phòng khách riêng biệt, ban công rộng và tầm nhìn tuyệt đẹp.");

        room3.setImages(Arrays.asList(
                new Room.RoomImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=800", "Phòng khách",
                        1),
                new Room.RoomImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=800", "Phòng ngủ",
                        2),
                new Room.RoomImage("https://images.unsplash.com/photo-1759223198981-661cadbbff36?w=800", "View phòng",
                        3)));

        room3.setAmenities(Arrays.asList("Tủ lạnh", "Điều hòa", "TV LED 65 inch", "Két sắt", "Bàn làm việc",
                "Phòng khách", "Ban công lớn", "Máy pha cà phê", "Bồn tắm", "View biển"));
        room3.setBasePrice(new BigDecimal("3500000"));
        room3.setOriginalPrice(new BigDecimal("4200000"));
        room3.setTotalRooms(20);
        room3.setAvailableRooms(12);
        room3.setRefundable(true);
        room3.setCancellationPolicy(CancellationPolicyType.MODERATE);
        room3.setBreakfastIncluded(false);
        room3.setStatus(RoomStatusType.ACTIVE);

        room3.setOptions(Arrays.asList(
                new Room.RoomOption("opt-3-1", "Without Breakfast", "1 giường King + 1 sofa bed", false, true,
                        new BigDecimal("3500000"), new BigDecimal("4200000"), null, 14000),
                new Room.RoomOption("opt-3-2", "Breakfast for 3", "1 giường King + 1 sofa bed", true, true,
                        new BigDecimal("3850000"), new BigDecimal("4600000"), null, 15400)));

        rooms.add(room3);

        // Family Room
        Room room4 = new Room();
        room4.setId(null);
        room4.setHotelId(hotelId);
        room4.setName("Phòng Gia Đình");
        room4.setSlug("family-room-" + hotelId);
        room4.setType(RoomType.FAMILY);
        room4.setMaxOccupancy(4);
        room4.setBedType("1 giường King + 2 giường đơn");
        room4.setSize(new BigDecimal("45"));
        room4.setDescription("Phòng gia đình rộng rãi, phù hợp cho gia đình có trẻ em với 2 phòng ngủ kết nối.");

        room4.setImages(Arrays.asList(
                new Room.RoomImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=800",
                        "Phòng ngủ chính", 1),
                new Room.RoomImage("https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?w=800",
                        "Phòng ngủ phụ", 2)));

        room4.setAmenities(Arrays.asList("Tủ lạnh", "Điều hòa", "2 TV LED", "Két sắt", "Khu vực vui chơi trẻ em"));
        room4.setBasePrice(new BigDecimal("2800000"));
        room4.setOriginalPrice(new BigDecimal("3500000"));
        room4.setTotalRooms(30);
        room4.setAvailableRooms(18);
        room4.setRefundable(true);
        room4.setCancellationPolicy(CancellationPolicyType.FLEXIBLE);
        room4.setBreakfastIncluded(false);
        room4.setStatus(RoomStatusType.ACTIVE);

        room4.setOptions(Arrays.asList(
                new Room.RoomOption("opt-4-1", "Without Breakfast", "1 giường King + 2 giường đơn", false, true,
                        new BigDecimal("2800000"), new BigDecimal("3500000"), null, 11200),
                new Room.RoomOption("opt-4-2", "Breakfast for 4", "1 giường King + 2 giường đơn", true, true,
                        new BigDecimal("3100000"), new BigDecimal("3900000"), null, 12400)));

        rooms.add(room4);

        return rooms;
    }
}
