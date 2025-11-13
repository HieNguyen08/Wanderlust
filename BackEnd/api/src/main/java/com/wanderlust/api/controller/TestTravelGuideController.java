package com.wanderlust.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/test/travelguides")
@CrossOrigin(origins = "*")
public class TestTravelGuideController {

    @GetMapping
    public List<Map<String, Object>> getAllGuides() {
        return getSampleGuides();
    }

    @GetMapping("/country/{country}")
    public List<Map<String, Object>> getByCountry(@PathVariable String country) {
        // Filter by country
        return getSampleGuides().stream()
            .filter(g -> g.get("country").toString().equalsIgnoreCase(country))
            .toList();
    }

    @GetMapping("/featured")
    public List<Map<String, Object>> getFeatured() {
        // Return first 3 as featured
        return getSampleGuides().subList(0, Math.min(3, getSampleGuides().size()));
    }

    @GetMapping("/type/{type}")
    public List<Map<String, Object>> getByType(@PathVariable String type) {
        // Filter by type
        return getSampleGuides().stream()
            .filter(g -> g.get("type").toString().equalsIgnoreCase(type))
            .toList();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable String id) {
        return getSampleGuides().stream()
            .filter(g -> g.get("id").toString().equals(id))
            .findFirst()
            .orElse(null);
    }

    private List<Map<String, Object>> getSampleGuides() {
        List<Map<String, Object>> guides = new ArrayList<>();

        // 1. Tokyo Guide
        Map<String, Object> tokyo = new HashMap<>();
        tokyo.put("id", "1");
        tokyo.put("title", "Khám Phá Tokyo - Thành Phố Không Ngủ");
        tokyo.put("description", "Hướng dẫn toàn diện về Tokyo - từ những ngôi đền cổ kính đến các con phố hiện đại nhộn nhịp");
        tokyo.put("coverImage", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800");
        tokyo.put("country", "Nhật Bản");
        tokyo.put("continent", "Châu Á");
        tokyo.put("category", "Thành phố");
        tokyo.put("type", "destination");
        tokyo.put("readTime", 15);
        tokyo.put("views", 12450);
        tokyo.put("likes", 892);
        tokyo.put("featured", true);
        tokyo.put("tags", List.of("Tokyo", "Nhật Bản", "Văn hóa", "Ẩm thực", "Mua sắm"));

        List<Map<String, Object>> tokyoAttractions = new ArrayList<>();
        Map<String, Object> sensoji = new HashMap<>();
        sensoji.put("name", "Chùa Senso-ji");
        sensoji.put("description", "Ngôi chùa Phật giáo cổ nhất Tokyo");
        sensoji.put("image", "https://images.unsplash.com/photo-1548013146-72479768bada?w=400");
        sensoji.put("location", "Asakusa");
        tokyoAttractions.add(sensoji);
        
        tokyo.put("attractions", tokyoAttractions);

        List<Map<String, Object>> tokyoTips = new ArrayList<>();
        Map<String, Object> tip1 = new HashMap<>();
        tip1.put("title", "Di chuyển bằng JR Pass");
        tip1.put("content", "Mua JR Pass để tiết kiệm chi phí di chuyển");
        tip1.put("icon", "train");
        tokyoTips.add(tip1);
        
        tokyo.put("tips", tokyoTips);
        
        guides.add(tokyo);

        // 2. Paris Guide
        Map<String, Object> paris = new HashMap<>();
        paris.put("id", "2");
        paris.put("title", "Paris - Thành Phố Tình Yêu");
        paris.put("description", "Khám phá vẻ đẹp lãng mạn của Paris với những địa điểm không thể bỏ lỡ");
        paris.put("coverImage", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800");
        paris.put("country", "Pháp");
        paris.put("continent", "Châu Âu");
        paris.put("category", "Thành phố");
        paris.put("type", "destination");
        paris.put("readTime", 18);
        paris.put("views", 15230);
        paris.put("likes", 1204);
        paris.put("featured", true);
        paris.put("tags", List.of("Paris", "Pháp", "Nghệ thuật", "Lãng mạn"));
        paris.put("attractions", new ArrayList<>());
        paris.put("tips", new ArrayList<>());
        guides.add(paris);

        // 3. Saigon Guide
        Map<String, Object> saigon = new HashMap<>();
        saigon.put("id", "3");
        saigon.put("title", "Sài Gòn - Thành Phố Hồ Chí Minh Sôi Động");
        saigon.put("description", "Trải nghiệm văn hóa, ẩm thực và nhịp sống sôi động của thành phố lớn nhất Việt Nam");
        saigon.put("coverImage", "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800");
        saigon.put("country", "Việt Nam");
        saigon.put("continent", "Châu Á");
        saigon.put("category", "Thành phố");
        saigon.put("type", "destination");
        saigon.put("readTime", 12);
        saigon.put("views", 8750);
        saigon.put("likes", 654);
        saigon.put("featured", true);
        saigon.put("tags", List.of("Sài Gòn", "Việt Nam", "Ẩm thực", "Lịch sử"));
        saigon.put("attractions", new ArrayList<>());
        saigon.put("tips", new ArrayList<>());
        guides.add(saigon);

        // 4. Food Blog
        Map<String, Object> foodBlog = new HashMap<>();
        foodBlog.put("id", "4");
        foodBlog.put("title", "Ẩm Thực Đường Phố Tokyo");
        foodBlog.put("description", "Khám phá những món ăn đường phố ngon nhất ở Tokyo");
        foodBlog.put("coverImage", "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800");
        foodBlog.put("country", "Nhật Bản");
        foodBlog.put("continent", "Châu Á");
        foodBlog.put("category", "Ẩm thực");
        foodBlog.put("type", "blog");
        foodBlog.put("readTime", 8);
        foodBlog.put("views", 5420);
        foodBlog.put("likes", 432);
        foodBlog.put("featured", false);
        foodBlog.put("tags", List.of("Ẩm thực", "Tokyo", "Street Food"));
        foodBlog.put("attractions", new ArrayList<>());
        foodBlog.put("tips", new ArrayList<>());
        guides.add(foodBlog);

        // 5. Budget Travel Blog
        Map<String, Object> budgetBlog = new HashMap<>();
        budgetBlog.put("id", "5");
        budgetBlog.put("title", "Du Lịch Châu Âu Bằng Backpack");
        budgetBlog.put("description", "Hướng dẫn du lịch tiết kiệm khám phá 10 nước Châu Âu trong 30 ngày");
        budgetBlog.put("coverImage", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800");
        budgetBlog.put("country", "Nhiều quốc gia");
        budgetBlog.put("continent", "Châu Âu");
        budgetBlog.put("category", "Du lịch bụi");
        budgetBlog.put("type", "blog");
        budgetBlog.put("readTime", 20);
        budgetBlog.put("views", 9850);
        budgetBlog.put("likes", 782);
        budgetBlog.put("featured", false);
        budgetBlog.put("tags", List.of("Backpacking", "Châu Âu", "Budget Travel"));
        budgetBlog.put("attractions", new ArrayList<>());
        budgetBlog.put("tips", new ArrayList<>());
        guides.add(budgetBlog);

        return guides;
    }
}
