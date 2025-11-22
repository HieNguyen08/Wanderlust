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

/**
 * Extended hotel data seeder with hotels across multiple locations in Vietnam
 * and international destinations.
 * Each location has approximately 6 hotels for diversity.
 * 
 * Locations covered:
 * - Đà Nẵng (6 hotels) - location_danang
 * - Hà Nội (6 hotels) - location_hanoi
 * - Phú Quốc (6 hotels) - location_phuquoc
 * - Nha Trang (6 hotels) - location_nhatrang
 * - Bangkok, Thailand (6 hotels) - location_bangkok
 * - Singapore (6 hotels) - location_singapore
 * 
 * Total: 36 hotels + 144 rooms (4 types per hotel)
 */
@Component
public class HotelDataSeederExpanded {

    private static final Logger logger = LoggerFactory.getLogger(HotelDataSeederExpanded.class);

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public HotelDataSeederExpanded(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    public void seedHotels() {
        try {
            long hotelCount = hotelRepository.count();

            if (hotelCount >= 30) {
                logger.info("Database already has {} hotels. Skipping expanded seed.", hotelCount);
                return;
            }

            logger.info("Starting expanded hotel seed with multiple locations...");

            List<Hotel> hotels = generateAllHotels();
            List<Hotel> savedHotels = hotelRepository.saveAll(hotels);

            logger.info("✅ Successfully seeded {} hotels across {} locations!",
                    savedHotels.size(), getUniqueLocationCount(savedHotels));

            // Seed rooms for each hotel
            List<Room> allRooms = new ArrayList<>();
            for (Hotel hotel : savedHotels) {
                List<Room> rooms = generateStandardRooms(hotel.getHotelID());
                allRooms.addAll(rooms);
            }

            List<Room> savedRooms = roomRepository.saveAll(allRooms);
            logger.info("✅ Successfully seeded {} rooms!", savedRooms.size());

        } catch (Exception e) {
            logger.error("❌ Error seeding hotels: {}", e.getMessage(), e);
        }
    }

    private int getUniqueLocationCount(List<Hotel> hotels) {
        return (int) hotels.stream()
                .map(Hotel::getLocationId)
                .distinct()
                .count();
    }

    private List<Hotel> generateAllHotels() {
        List<Hotel> hotels = new ArrayList<>();

        // Đà Nẵng - 6 hotels (already exists in original seeder)
        // Hà Nội - 6 hotels
        hotels.addAll(generateHanoiHotels());
        // Phú Quốc - 6 hotels
        hotels.addAll(generatePhuQuocHotels());
        // Nha Trang - 6 hotels
        hotels.addAll(generateNhaTrangHotels());
        // Bangkok - 6 hotels
        hotels.addAll(generateBangkokHotels());
        // Singapore - 6 hotels
        hotels.addAll(generateSingaporeHotels());

        return hotels;
    }

    // ==================== HÀ NỘI HOTELS ====================

    private List<Hotel> generateHanoiHotels() {
        List<Hotel> hotels = new ArrayList<>();

        // Hotel 1: JW Marriott Hotel Hanoi
        Hotel h1 = createHotel(
                "vendor006", "location_hanoi", "JW Marriott Hotel Hanoi", "jw-marriott-hanoi",
                HotelType.HOTEL, 5, "8 Đỗ Đức Dục, Mễ Trì, Nam Từ Liêm, Hà Nội",
                "21.0278", "105.7819",
                "JW Marriott Hotel Hanoi là khách sạn 5 sao quốc tế hàng đầu tại Hà Nội, kết hợp sang trọng hiện đại với nét văn hóa Việt Nam.",
                "Khách sạn 5 sao quốc tế tại trung tâm Hà Nội",
                "024 3833 5588", "reservation.hanoi@marriott.com", "https://www.marriott.com/hanoi",
                "4.7", 412, 450, "3500000");
        hotels.add(h1);

        // Hotel 2: Sofitel Legend Metropole Hanoi
        Hotel h2 = createHotel(
                "vendor007", "location_hanoi", "Sofitel Legend Metropole Hanoi", "sofitel-metropole-hanoi",
                HotelType.HOTEL, 5, "15 Ngô Quyền, Hoàn Kiếm, Hà Nội",
                "21.0231", "105.8544",
                "Sofitel Legend Metropole Hanoi là khách sạn lịch sử 5 sao, được xây dựng từ năm 1901 với kiến trúc thuộc địa Pháp.",
                "Khách sạn lịch sử 5 sao từ năm 1901",
                "024 3826 6919", "h0551@sofitel.com", "https://www.sofitel-legend-metropole-hanoi.com",
                "4.9", 678, 364, "4200000");
        hotels.add(h2);

        // Hotel 3: Lotte Hotel Hanoi
        Hotel h3 = createHotel(
                "vendor008", "location_hanoi", "Lotte Hotel Hanoi", "lotte-hotel-hanoi",
                HotelType.HOTEL, 5, "54 Liễu Giai, Ba Đình, Hà Nội",
                "21.0227", "105.8127",
                "Lotte Hotel Hanoi tọa lạc tại tòa nhà Lotte Center cao 65 tầng, mang đến tầm nhìn toàn cảnh thành phố Hà Nội.",
                "Khách sạn 5 sao với view toàn cảnh Hà Nội",
                "024 3333 1000", "info.hanoi@lotte.net", "https://www.lottehotel.com/hanoi",
                "4.6", 534, 318, "3800000");
        hotels.add(h3);

        // Hotel 4: Hilton Hanoi Opera
        Hotel h4 = createHotel(
                "vendor009", "location_hanoi", "Hilton Hanoi Opera", "hilton-hanoi-opera",
                HotelType.HOTEL, 5, "1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội",
                "21.0199", "105.8551",
                "Hilton Hanoi Opera nằm ngay trung tâm phố cổ, đối diện Nhà hát Lớn Hà Nội.",
                "Khách sạn 5 sao gần phố cổ và Nhà hát Lớn",
                "024 3933 0500", "hanoi@hilton.com", "https://www.hilton.com/hanoi-opera",
                "4.5", 389, 269, "3200000");
        hotels.add(h4);

        // Hotel 5: Pullman Hanoi
        Hotel h5 = createHotel(
                "vendor010", "location_hanoi", "Pullman Hanoi", "pullman-hanoi",
                HotelType.HOTEL, 5, "40 Cát Linh, Đống Đa, Hà Nội",
                "21.0198", "105.8277",
                "Pullman Hanoi là khách sạn 5 sao hiện đại thuộc chuỗi Accor.",
                "Khách sạn 5 sao hiện đại phong cách Pháp",
                "024 3733 0888", "h6655@accor.com", "https://www.pullmanhanoi.com",
                "4.3", 267, 242, "2800000");
        h5.setFeatured(false);
        hotels.add(h5);

        // Hotel 6: InterContinental Hanoi Westlake
        Hotel h6 = createHotel(
                "vendor011", "location_hanoi", "InterContinental Hanoi Westlake", "intercontinental-hanoi-westlake",
                HotelType.RESORT, 5, "1A Nghi Tàm, Tây Hồ, Hà Nội",
                "21.0537", "105.8230",
                "InterContinental Hanoi Westlake là khách sạn duy nhất được xây dựng trên mặt hồ Tây.",
                "Resort 5 sao độc nhất trên mặt Hồ Tây",
                "024 6270 8888", "hanoi@ihg.com", "https://www.intercontinental-hanoi.com",
                "4.8", 456, 359, "4000000");
        hotels.add(h6);

        return hotels;
    }

    // ==================== PHÚ QUỐC HOTELS ====================

    private List<Hotel> generatePhuQuocHotels() {
        List<Hotel> hotels = new ArrayList<>();

        Hotel h1 = createHotel(
                "vendor012", "location_phuquoc", "JW Marriott Phu Quoc Emerald Bay Resort & Spa",
                "jw-marriott-phu-quoc",
                HotelType.RESORT, 5, "Bãi Khem, An Thới, Phú Quốc, Kiên Giang",
                "10.1165", "103.9675",
                "JW Marriott Phu Quoc Emerald Bay được thiết kế bởi Bill Bensley, lấy cảm hứng từ trường đại học Pháp cổ.",
                "Resort 5 sao thiết kế độc đáo tại Bãi Khem",
                "0297 3977 999", "phuquoc@marriott.com", "https://www.marriott.com/phu-quoc",
                "4.9", 723, 244, "5500000");
        hotels.add(h1);

        Hotel h2 = createHotel(
                "vendor013", "location_phuquoc", "InterContinental Phu Quoc Long Beach Resort",
                "intercontinental-phu-quoc",
                HotelType.RESORT, 5, "Bãi Trường, Dương Tơ, Phú Quốc, Kiên Giang",
                "10.2114", "103.9549",
                "InterContinental Phu Quoc Long Beach Resort nằm trên bãi Trường dài 20km, mang đến trải nghiệm nghỉ dưỡng đẳng cấp quốc tế.",
                "Resort 5 sao trên bãi Trường dài nhất Phú Quốc",
                "0297 3977 888", "phuquoclongbeach@ihg.com", "https://www.intercontinental-phuquoc.com",
                "4.8", 612, 459, "4800000");
        hotels.add(h2);

        Hotel h3 = createHotel(
                "vendor014", "location_phuquoc", "Premier Village Phu Quoc Resort", "premier-village-phu-quoc",
                HotelType.RESORT, 5, "Nguyễn Trung Trực, Dương Đông, Phú Quốc",
                "10.2258", "103.9636",
                "Premier Village Phu Quoc Resort cung cấp biệt thự sang trọng với hồ bơi riêng, view biển tuyệt đẹp.",
                "Biệt thự cao cấp với hồ bơi riêng",
                "0297 3958 888", "phuquoc@premiervillage.com", "https://www.premiervillage-phuquoc.com",
                "4.7", 445, 228, "5200000");
        hotels.add(h3);

        Hotel h4 = createHotel(
                "vendor015", "location_phuquoc", "Vinpearl Resort & Spa Phu Quoc", "vinpearl-phu-quoc",
                HotelType.RESORT, 5, "Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang",
                "10.4036", "103.9372",
                "Vinpearl Resort & Spa Phu Quoc tọa lạc tại bãi Dài hoang sơ, kết hợp nghỉ dưỡng với vui chơi giải trí.",
                "Resort 5 sao với Vinpearl Safari và VinWonders",
                "1900 6677", "phuquoc@vinpearl.com", "https://vinpearl.com/phu-quoc",
                "4.6", 567, 774, "3900000");
        hotels.add(h4);

        Hotel h5 = createHotel(
                "vendor016", "location_phuquoc", "Salinda Resort Phu Quoc Island", "salinda-phu-quoc",
                HotelType.RESORT, 5, "Cửa Lấp, Dương Tơ, Phú Quốc, Kiên Giang",
                "10.2156", "103.9548",
                "Salinda Resort Phu Quoc Island là resort boutique 5 sao, mang phong cách Địa Trung Hải.",
                "Resort boutique sang trọng phong cách Địa Trung Hải",
                "0297 3848 999", "info@salindaresort.com", "https://www.salindaresort.com",
                "4.5", 334, 121, "3600000");
        h5.setFeatured(false);
        hotels.add(h5);

        Hotel h6 = createHotel(
                "vendor017", "location_phuquoc", "Fusion Resort Phu Quoc", "fusion-phu-quoc",
                HotelType.RESORT, 5, "Xóm Mới, Dương Tơ, Phú Quốc, Kiên Giang",
                "10.2234", "103.9587",
                "Fusion Resort Phu Quoc nổi tiếng với concept all-spa inclusive độc đáo.",
                "All-spa inclusive resort với spa không giới hạn",
                "0297 3995 000", "phuquoc@fusionresorts.com", "https://www.fusionresorts.com/phuquoc",
                "4.7", 489, 198, "4100000");
        hotels.add(h6);

        return hotels;
    }

    // ==================== NHA TRANG HOTELS ====================

    private List<Hotel> generateNhaTrangHotels() {
        List<Hotel> hotels = new ArrayList<>();

        Hotel h1 = createHotel(
                "vendor018", "location_nhatrang", "InterContinental Nha Trang", "intercontinental-nha-trang",
                HotelType.RESORT, 5, "32-34 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
                "12.2444", "109.1943",
                "InterContinental Nha Trang là resort 5 sao đẳng cấp quốc tế, nằm giữa trung tâm thành phố và bãi biển Nha Trang.",
                "Resort 5 sao tại trung tâm Nha Trang",
                "0258 3881 888", "nhatrang@ihg.com", "https://www.intercontinental-nhatrang.com",
                "4.8", 678, 286, "4200000");
        hotels.add(h1);

        Hotel h2 = createHotel(
                "vendor019", "location_nhatrang", "Vinpearl Resort Nha Trang", "vinpearl-nha-trang",
                HotelType.RESORT, 5, "Hòn Tre, Vĩnh Nguyên, Nha Trang, Khánh Hòa",
                "12.2101", "109.2466",
                "Vinpearl Resort Nha Trang tọa lạc trên đảo Hòn Tre, tiên phong mô hình khu nghỉ dưỡng giải trí tại Việt Nam.",
                "Resort 5 sao trên đảo với công viên giải trí",
                "0258 3598 188", "nhatrang@vinpearl.com", "https://vinpearl.com/nha-trang",
                "4.6", 892, 485, "3800000");
        hotels.add(h2);

        Hotel h3 = createHotel(
                "vendor020", "location_nhatrang", "Sheraton Nha Trang Hotel & Spa", "sheraton-nha-trang",
                HotelType.HOTEL, 5, "26-28 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
                "12.2456", "109.1936",
                "Sheraton Nha Trang Hotel & Spa nằm ngay trung tâm thành phố, kết hợp dịch vụ đẳng cấp và tiện nghi hiện đại.",
                "Khách sạn 5 sao view biển tại trung tâm",
                "0258 3880 000", "nhatrang@sheraton.com", "https://www.sheraton-nhatrang.com",
                "4.5", 534, 280, "3500000");
        hotels.add(h3);

        Hotel h4 = createHotel(
                "vendor021", "location_nhatrang", "Mia Resort Nha Trang", "mia-resort-nha-trang",
                HotelType.RESORT, 5, "Bãi Đông, Cam Hải Đông, Cam Lâm, Khánh Hòa",
                "12.0537", "109.2556",
                "Mia Resort Nha Trang là resort boutique sang trọng, nổi tiếng với kiến trúc độc đáo và dịch vụ tận tâm.",
                "Resort boutique đẳng cấp tại vịnh Nha Trang",
                "0258 3989 666", "info@mianhatrang.com", "https://www.mianhatrang.com",
                "4.9", 456, 50, "5800000");
        hotels.add(h4);

        Hotel h5 = createHotel(
                "vendor022", "location_nhatrang", "Evason Ana Mandara Nha Trang", "evason-ana-mandara",
                HotelType.RESORT, 5, "Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
                "12.2389", "109.1956",
                "Evason Ana Mandara Nha Trang là resort 5 sao ven biển với không gian xanh mát và dịch vụ spa đẳng cấp.",
                "Resort 5 sao ven biển với khu vườn nhiệt đới",
                "0258 352 2222", "info@evasonanamandara.com", "https://www.evasonanamandara.com",
                "4.7", 612, 74, "4500000");
        hotels.add(h5);

        Hotel h6 = createHotel(
                "vendor023", "location_nhatrang", "Liberty Central Nha Trang", "liberty-central-nha-trang",
                HotelType.HOTEL, 4, "40 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
                "12.2467", "109.1931",
                "Liberty Central Nha Trang là khách sạn 4 sao hiện đại với vị trí đắc địa ngay trung tâm thành phố.",
                "Khách sạn 4 sao view biển tuyệt đẹp",
                "0258 3989 999", "nhatrang@libertycentral.com.vn", "https://www.libertycentral.com.vn",
                "4.3", 378, 244, "2200000");
        h6.setFeatured(false);
        hotels.add(h6);

        return hotels;
    }

    // ==================== BANGKOK HOTELS ====================

    private List<Hotel> generateBangkokHotels() {
        List<Hotel> hotels = new ArrayList<>();

        Hotel h1 = createHotel(
                "vendor024", "location_bangkok", "Mandarin Oriental Bangkok", "mandarin-oriental-bangkok",
                HotelType.HOTEL, 5, "48 Oriental Avenue, Bangkok 10500, Thailand",
                "13.7245", "100.5156",
                "Mandarin Oriental Bangkok is a legendary 5-star hotel on the banks of the Chao Phraya River, renowned for its impeccable service and colonial charm.",
                "Legendary 5-star hotel on the Chao Phraya River",
                "+66 2 659 9000", "mobkk-reservations@mohg.com", "https://www.mandarinoriental.com/bangkok",
                "4.9", 1234, 393, "8500000");
        hotels.add(h1);

        Hotel h2 = createHotel(
                "vendor025", "location_bangkok", "The Peninsula Bangkok", "peninsula-bangkok",
                HotelType.HOTEL, 5, "333 Charoennakorn Road, Bangkok 10600, Thailand",
                "13.7211", "100.5089",
                "The Peninsula Bangkok offers luxury accommodation with stunning river views, world-class dining, and a 3-tiered riverside pool.",
                "Luxury riverside hotel with iconic pool",
                "+66 2 861 2888", "pbk@peninsula.com", "https://www.peninsula.com/bangkok",
                "4.8", 967, 370, "7800000");
        hotels.add(h2);

        Hotel h3 = createHotel(
                "vendor026", "location_bangkok", "Four Seasons Hotel Bangkok at Chao Phraya River",
                "four-seasons-bangkok",
                HotelType.HOTEL, 5, "300/1 Charoen Krung Road, Bangkok 10120, Thailand",
                "13.7234", "100.5123",
                "Four Seasons Hotel Bangkok features stunning views of the Chao Phraya River, spacious rooms, and exceptional dining experiences.",
                "Modern luxury hotel on the riverside",
                "+66 2 032 0888", "bangkok@fourseasons.com", "https://www.fourseasons.com/bangkok",
                "4.7", 845, 299, "7200000");
        hotels.add(h3);

        Hotel h4 = createHotel(
                "vendor027", "location_bangkok", "Shangri-La Bangkok", "shangri-la-bangkok",
                HotelType.HOTEL, 5, "89 Soi Wat Suan Plu, Bangkok 10120, Thailand",
                "13.7189", "100.5167",
                "Shangri-La Bangkok is a riverside sanctuary offering luxurious rooms, award-winning restaurants, and the unique CHI, The Spa.",
                "Riverside sanctuary with award-winning spa",
                "+66 2 236 7777", "slb@shangri-la.com", "https://www.shangri-la.com/bangkok",
                "4.6", 723, 802, "6500000");
        hotels.add(h4);

        Hotel h5 = createHotel(
                "vendor028", "location_bangkok", "Anantara Siam Bangkok Hotel", "anantara-siam-bangkok",
                HotelType.HOTEL, 5, "155 Rajadamri Road, Bangkok 10330, Thailand",
                "13.7411", "100.5389",
                "Anantara Siam Bangkok Hotel is a luxury oasis in the heart of Bangkok, close to shopping districts and cultural attractions.",
                "Luxury oasis in the heart of Bangkok",
                "+66 2 126 8866", "siam@anantara.com", "https://www.anantara.com/siam-bangkok",
                "4.5", 612, 354, "5800000");
        h5.setFeatured(false);
        hotels.add(h5);

        Hotel h6 = createHotel(
                "vendor029", "location_bangkok", "Rosewood Bangkok", "rosewood-bangkok",
                HotelType.HOTEL, 5, "1041/38 Phloen Chit Road, Bangkok 10330, Thailand",
                "13.7445", "100.5467",
                "Rosewood Bangkok is a modern luxury hotel featuring stunning architecture, Michelin-starred dining, and a rooftop bar with panoramic city views.",
                "Modern luxury with Michelin-starred dining",
                "+66 2 080 0088", "bangkok@rosewoodhotels.com", "https://www.rosewoodhotels.com/bangkok",
                "4.9", 534, 159, "9200000");
        hotels.add(h6);

        return hotels;
    }

    // ==================== SINGAPORE HOTELS ====================

    private List<Hotel> generateSingaporeHotels() {
        List<Hotel> hotels = new ArrayList<>();

        Hotel h1 = createHotel(
                "vendor030", "location_singapore", "Marina Bay Sands", "marina-bay-sands",
                HotelType.RESORT, 5, "10 Bayfront Avenue, Singapore 018956",
                "1.2834", "103.8607",
                "Marina Bay Sands is Singapore's most iconic integrated resort, featuring the world-famous infinity pool, luxury shopping, and world-class entertainment.",
                "Iconic resort with rooftop infinity pool",
                "+65 6688 8868", "reservations@marinabaysands.com", "https://www.marinabaysands.com",
                "4.8", 2145, 2561, "12000000");
        hotels.add(h1);

        Hotel h2 = createHotel(
                "vendor031", "location_singapore", "Raffles Singapore", "raffles-singapore",
                HotelType.HOTEL, 5, "1 Beach Road, Singapore 189673",
                "1.2947", "103.8545",
                "Raffles Singapore is a legendary colonial-style hotel, home of the Singapore Sling cocktail, offering timeless elegance and impeccable service.",
                "Legendary colonial hotel since 1887",
                "+65 6337 1886", "singapore@raffles.com", "https://www.raffles.com/singapore",
                "4.9", 1567, 115, "15000000");
        hotels.add(h2);

        Hotel h3 = createHotel(
                "vendor032", "location_singapore", "The Fullerton Hotel Singapore", "fullerton-singapore",
                HotelType.HOTEL, 5, "1 Fullerton Square, Singapore 049178",
                "1.2859", "103.8539",
                "The Fullerton Hotel Singapore is a luxury heritage hotel housed in a beautifully restored neoclassical building at the mouth of the Singapore River.",
                "Heritage luxury hotel in neoclassical building",
                "+65 6733 8388", "info@fullertonhotel.com", "https://www.fullertonhotel.com",
                "4.7", 1234, 400, "9500000");
        hotels.add(h3);

        Hotel h4 = createHotel(
                "vendor033", "location_singapore", "Capella Singapore", "capella-singapore",
                HotelType.RESORT, 5, "1 The Knolls, Sentosa Island, Singapore 098297",
                "1.2456", "103.8178",
                "Capella Singapore is an award-winning resort on Sentosa Island, offering tranquil gardens, spa villas, and Michelin-starred dining.",
                "Award-winning resort on Sentosa Island",
                "+65 6377 8888", "enquiry.singapore@capellahotels.com", "https://www.capellahotels.com/singapore",
                "4.9", 789, 112, "18000000");
        hotels.add(h4);

        Hotel h5 = createHotel(
                "vendor034", "location_singapore", "The St. Regis Singapore", "st-regis-singapore",
                HotelType.HOTEL, 5, "29 Tanglin Road, Singapore 247911",
                "1.3045", "103.8267",
                "The St. Regis Singapore offers sophisticated luxury in the prestigious Orchard Road district, with personalized butler service and exquisite dining.",
                "Sophisticated luxury on Orchard Road",
                "+65 6506 6888", "singapore@stregis.com", "https://www.stregis.com/singapore",
                "4.8", 956, 299, "11000000");
        hotels.add(h5);

        Hotel h6 = createHotel(
                "vendor035", "location_singapore", "Parkroyal Collection Pickering", "parkroyal-pickering",
                HotelType.HOTEL, 5, "3 Upper Pickering Street, Singapore 058289",
                "1.2867", "103.8456",
                "Parkroyal Collection Pickering is an award-winning eco-friendly hotel with stunning sky gardens and modern sustainable luxury.",
                "Eco-luxury hotel with iconic sky gardens",
                "+65 6809 8888", "enquiry.pickering@parkroyalhotels.com", "https://www.parkroyalhotels.com/pickering",
                "4.6", 678, 367, "6800000");
        h6.setFeatured(false);
        hotels.add(h6);

        return hotels;
    }

    // ==================== HELPER METHOD TO CREATE HOTEL ====================

    private Hotel createHotel(String vendorId, String locationId, String name, String slug,
            HotelType type, int stars, String address,
            String lat, String lng,
            String description, String shortDesc,
            String phone, String email, String website,
            String rating, int reviews, int totalRooms, String lowestPrice) {
        Hotel hotel = new Hotel();
        hotel.setHotelID(null);
        hotel.setVendorId(vendorId);
        hotel.setLocationId(locationId);
        hotel.setName(name);
        hotel.setSlug(slug);
        hotel.setHotel_Type(type);
        hotel.setStarRating(stars);
        hotel.setAddress(address);
        hotel.setLatitude(new BigDecimal(lat));
        hotel.setLongitude(new BigDecimal(lng));
        hotel.setDescription(description);
        hotel.setShortDescription(shortDesc);
        hotel.setPhone(phone);
        hotel.setEmail(email);
        hotel.setWebsite(website);

        // Standard images
        hotel.setImages(Arrays.asList(
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731080647266-85cf1bc27162?w=1080",
                        "Hotel exterior", 1),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080",
                        "Deluxe room", 2),
                new Hotel.HotelImage("https://images.unsplash.com/photo-1623718649591-311775a30c43?w=1080",
                        "Swimming pool", 3)));

        hotel.setAmenities(
                Arrays.asList("Wifi miễn phí", "Hồ bơi", "Spa", "Nhà hàng", "Phòng tập gym", "Dịch vụ phòng"));

        Hotel.HotelPolicies policies = new Hotel.HotelPolicies();
        policies.setCancellation("Miễn phí hủy phòng trước 24h");
        policies.setPets(false);
        policies.setSmoking(false);
        hotel.setPolicies(policies);

        hotel.setStatus(HotelStatusType.ACTIVE);
        hotel.setFeatured(true);
        hotel.setVerified(true);
        hotel.setAverageRating(new BigDecimal(rating));
        hotel.setTotalReviews(reviews);
        hotel.setTotalRooms(totalRooms);
        hotel.setLowestPrice(new BigDecimal(lowestPrice));

        return hotel;
    }

    // ==================== STANDARD ROOMS FOR EACH HOTEL ====================

    private List<Room> generateStandardRooms(String hotelId) {
        List<Room> rooms = new ArrayList<>();

        // Superior Room
        Room room1 = new Room();
        room1.setId(null);
        room1.setHotelId(hotelId);
        room1.setName("Phòng Superior");
        room1.setSlug("superior-room-" + hotelId);
        room1.setType(RoomType.DOUBLE);
        room1.setMaxOccupancy(2);
        room1.setBedType("1 giường Queen");
        room1.setSize(new BigDecimal("28"));
        room1.setDescription("Phòng Superior rộng rãi với thiết kế hiện đại, đầy đủ tiện nghi cơ bản.");
        room1.setImages(Arrays.asList(
                new Room.RoomImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=800", "Phòng ngủ",
                        1),
                new Room.RoomImage("https://images.unsplash.com/photo-1759223607861-f0ef3e617739?w=800", "Phòng tắm",
                        2)));
        room1.setAmenities(Arrays.asList("TV LED", "Máy lạnh", "Minibar", "Két sắt", "Bàn làm việc"));
        room1.setBasePrice(new BigDecimal("1500000"));
        room1.setTotalRooms(50);
        room1.setAvailableRooms(38);
        room1.setRefundable(true);
        room1.setCancellationPolicy(CancellationPolicyType.FLEXIBLE);
        room1.setBreakfastIncluded(false);
        room1.setStatus(RoomStatusType.ACTIVE);
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
                        2)));
        room2.setAmenities(
                Arrays.asList("TV LED 55 inch", "Máy lạnh", "Minibar", "Két sắt", "Bàn làm việc", "Sofa", "Ban công"));
        room2.setBasePrice(new BigDecimal("2200000"));
        room2.setTotalRooms(40);
        room2.setAvailableRooms(25);
        room2.setRefundable(true);
        room2.setCancellationPolicy(CancellationPolicyType.FLEXIBLE);
        room2.setBreakfastIncluded(true);
        room2.setStatus(RoomStatusType.ACTIVE);
        rooms.add(room2);

        // Suite
        Room room3 = new Room();
        room3.setId(null);
        room3.setHotelId(hotelId);
        room3.setName("Suite 1 Phòng Ngủ");
        room3.setSlug("suite-1br-" + hotelId);
        room3.setType(RoomType.SUITE);
        room3.setMaxOccupancy(3);
        room3.setBedType("1 giường King");
        room3.setSize(new BigDecimal("55"));
        room3.setDescription("Suite cao cấp với phòng khách riêng biệt, ban công rộng và tầm nhìn tuyệt đẹp.");
        room3.setImages(Arrays.asList(
                new Room.RoomImage("https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=800", "Phòng khách",
                        1),
                new Room.RoomImage("https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=800", "Phòng ngủ",
                        2)));
        room3.setAmenities(Arrays.asList("TV LED 65 inch", "Máy lạnh", "Minibar", "Két sắt", "Bàn làm việc",
                "Phòng khách", "Ban công lớn", "Máy pha cà phê"));
        room3.setBasePrice(new BigDecimal("3500000"));
        room3.setTotalRooms(20);
        room3.setAvailableRooms(12);
        room3.setRefundable(true);
        room3.setCancellationPolicy(CancellationPolicyType.MODERATE);
        room3.setBreakfastIncluded(true);
        room3.setStatus(RoomStatusType.ACTIVE);
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
        room4.setAmenities(
                Arrays.asList("2 TV LED", "Máy lạnh", "Minibar", "Két sắt", "Khu vực vui chơi trẻ em", "Tủ lạnh"));
        room4.setBasePrice(new BigDecimal("2800000"));
        room4.setTotalRooms(30);
        room4.setAvailableRooms(18);
        room4.setRefundable(true);
        room4.setCancellationPolicy(CancellationPolicyType.FLEXIBLE);
        room4.setBreakfastIncluded(true);
        room4.setStatus(RoomStatusType.ACTIVE);
        rooms.add(room4);

        return rooms;
    }
}
