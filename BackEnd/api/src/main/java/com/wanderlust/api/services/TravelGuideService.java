package com.wanderlust.api.services;

import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.repository.TravelGuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TravelGuideService {
    
    @Autowired
    private TravelGuideRepository travelGuideRepository;
    
    // Lấy tất cả travel guides
    public List<TravelGuide> getAllTravelGuides() {
        return travelGuideRepository.findAll();
    }
    
    // Lấy travel guide theo id
    public Optional<TravelGuide> getTravelGuideById(String id) {
        return travelGuideRepository.findById(id);
    }
    
    // Tạo mới travel guide
    public TravelGuide createTravelGuide(TravelGuide travelGuide) {
        travelGuide.setCreatedAt(LocalDateTime.now());
        travelGuide.setUpdatedAt(LocalDateTime.now());
        travelGuide.setViews(0);
        travelGuide.setLikes(0);
        return travelGuideRepository.save(travelGuide);
    }
    
    // Cập nhật travel guide
    public TravelGuide updateTravelGuide(String id, TravelGuide updatedGuide) {
        Optional<TravelGuide> existingGuide = travelGuideRepository.findById(id);
        if (existingGuide.isPresent()) {
            TravelGuide guide = existingGuide.get();
            guide.setTitle(updatedGuide.getTitle());
            guide.setDestination(updatedGuide.getDestination());
            guide.setCountry(updatedGuide.getCountry());
            guide.setContinent(updatedGuide.getContinent());
            guide.setCategory(updatedGuide.getCategory());
            guide.setDescription(updatedGuide.getDescription());
            guide.setContent(updatedGuide.getContent());
            guide.setReadTime(updatedGuide.getReadTime());
            guide.setCoverImage(updatedGuide.getCoverImage());
            guide.setImages(updatedGuide.getImages());
            guide.setTags(updatedGuide.getTags());
            guide.setDuration(updatedGuide.getDuration());
            guide.setType(updatedGuide.getType());
            guide.setDifficulty(updatedGuide.getDifficulty());
            guide.setAttractions(updatedGuide.getAttractions());
            guide.setTips(updatedGuide.getTips());
            guide.setPublished(updatedGuide.getPublished());
            guide.setFeatured(updatedGuide.getFeatured());
            guide.setUpdatedAt(LocalDateTime.now());
            return travelGuideRepository.save(guide);
        }
        return null;
    }
    
    // Xóa travel guide
    public boolean deleteTravelGuide(String id) {
        if (travelGuideRepository.existsById(id)) {
            travelGuideRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Lấy theo destination
    public List<TravelGuide> getByDestination(String destination) {
        return travelGuideRepository.findByDestinationContainingIgnoreCase(destination);
    }
    
    // Lấy theo country
    public List<TravelGuide> getByCountry(String country) {
        return travelGuideRepository.findByCountryContainingIgnoreCase(country);
    }
    
    // Lấy theo continent
    public List<TravelGuide> getByContinent(String continent) {
        return travelGuideRepository.findByContinent(continent);
    }
    
    // Lấy theo category
    public List<TravelGuide> getByCategory(String category) {
        return travelGuideRepository.findByCategory(category);
    }
    
    // Lấy theo type
    public List<TravelGuide> getByType(String type) {
        return travelGuideRepository.findByType(type);
    }
    
    // Lấy published guides
    public List<TravelGuide> getPublishedGuides() {
        return travelGuideRepository.findByPublished(true);
    }
    
    // Lấy featured guides
    public List<TravelGuide> getFeaturedGuides() {
        return travelGuideRepository.findByFeaturedTrue();
    }
    
    // Lấy theo author
    public List<TravelGuide> getByAuthor(String authorId) {
        return travelGuideRepository.findByAuthorId(authorId);
    }
    
    // Lấy theo tag
    public List<TravelGuide> getByTag(String tag) {
        return travelGuideRepository.findByTagsContaining(tag);
    }
    
    // Lấy popular guides
    public List<TravelGuide> getPopularGuides() {
        return travelGuideRepository.findTop10ByPublishedTrueOrderByViewsDesc();
    }
    
    // Tăng view count
    public TravelGuide incrementViews(String id) {
        Optional<TravelGuide> guide = travelGuideRepository.findById(id);
        if (guide.isPresent()) {
            TravelGuide travelGuide = guide.get();
            travelGuide.setViews(travelGuide.getViews() + 1);
            return travelGuideRepository.save(travelGuide);
        }
        return null;
    }
    
    // Tăng like count
    public TravelGuide incrementLikes(String id) {
        Optional<TravelGuide> guide = travelGuideRepository.findById(id);
        if (guide.isPresent()) {
            TravelGuide travelGuide = guide.get();
            travelGuide.setLikes(travelGuide.getLikes() + 1);
            return travelGuideRepository.save(travelGuide);
        }
        return null;
    }
    
    // Giảm like count
    public TravelGuide decrementLikes(String id) {
        Optional<TravelGuide> guide = travelGuideRepository.findById(id);
        if (guide.isPresent()) {
            TravelGuide travelGuide = guide.get();
            if (travelGuide.getLikes() > 0) {
                travelGuide.setLikes(travelGuide.getLikes() - 1);
                return travelGuideRepository.save(travelGuide);
            }
        }
        return null;
    }
}
