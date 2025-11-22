package com.wanderlust.api.services;

import com.wanderlust.api.dto.search.SearchResultDTO;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.TravelGuideRepository;
import com.wanderlust.api.repository.VisaArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final HotelRepository hotelRepository;
    private final ActivityRepository activityRepository;
    private final TravelGuideRepository travelGuideRepository;
    private final VisaArticleRepository visaArticleRepository;

    public List<SearchResultDTO> globalSearch(String query) {
        List<SearchResultDTO> results = new ArrayList<>();

        // Search Hotels
        List<Hotel> hotels = hotelRepository.searchBasic(query);
        results.addAll(hotels.stream().map(this::mapHotelToDTO).collect(Collectors.toList()));

        // Search Activities
        List<Activity> activities = activityRepository.findByNameContainingIgnoreCase(query);
        results.addAll(activities.stream().map(this::mapActivityToDTO).collect(Collectors.toList()));

        // Search Travel Guides
        List<TravelGuide> guides = travelGuideRepository.findByTitleContainingIgnoreCase(query);
        results.addAll(guides.stream().map(this::mapGuideToDTO).collect(Collectors.toList()));

        // Search Visa Articles
        List<VisaArticle> articles = visaArticleRepository.findByTitleContainingIgnoreCase(query);
        results.addAll(articles.stream().map(this::mapArticleToDTO).collect(Collectors.toList()));

        return results;
    }

    private SearchResultDTO mapHotelToDTO(Hotel hotel) {
        return SearchResultDTO.builder()
                .id(hotel.getHotelID()) // Fixed: getId() -> getHotelID()
                .type("HOTEL")
                .title(hotel.getName())
                .description(hotel.getAddress())
                .imageUrl(hotel.getImages() != null && !hotel.getImages().isEmpty() ? hotel.getImages().get(0).getUrl()
                        : null) // Fixed: get(0) -> get(0).getUrl()
                .price(hotel.getLowestPrice() != null ? hotel.getLowestPrice().doubleValue() : null) // Fixed:
                                                                                                     // BigDecimal ->
                                                                                                     // Double
                .url("/hotels/" + hotel.getHotelID())
                .build();
    }

    private SearchResultDTO mapActivityToDTO(Activity activity) {
        return SearchResultDTO.builder()
                .id(activity.getId())
                .type("ACTIVITY")
                .title(activity.getName())
                .description(activity.getMeetingPoint()) // Fixed: getLocation() -> getMeetingPoint()
                .imageUrl(activity.getImages() != null && !activity.getImages().isEmpty()
                        ? activity.getImages().get(0).getUrl()
                        : null) // Fixed: get(0) -> get(0).getUrl()
                .price(activity.getPrice() != null ? activity.getPrice().doubleValue() : null) // Fixed: BigDecimal ->
                                                                                               // Double
                .url("/activities/" + activity.getId())
                .build();
    }

    private SearchResultDTO mapGuideToDTO(TravelGuide guide) {
        return SearchResultDTO.builder()
                .id(guide.getId())
                .type("TRAVEL_GUIDE")
                .title(guide.getTitle())
                .description(guide.getDescription()) // Fixed: getExcerpt() -> getDescription()
                .imageUrl(guide.getCoverImage()) // Fixed: getThumbnail() -> getCoverImage()
                .url("/travel-guide/" + guide.getId())
                .build();
    }

    private SearchResultDTO mapArticleToDTO(VisaArticle article) {
        return SearchResultDTO.builder()
                .id(article.getId())
                .type("VISA_ARTICLE")
                .title(article.getTitle())
                .description(article.getExcerpt())
                .imageUrl(article.getImage())
                .url("/visa/" + article.getId())
                .build();
    }
}
