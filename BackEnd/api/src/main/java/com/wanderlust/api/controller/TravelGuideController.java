package com.wanderlust.api.controller;

import com.wanderlust.api.dto.AttractionDTO;
import com.wanderlust.api.dto.TravelGuideRequestDTO;
import com.wanderlust.api.dto.TravelGuideResponseDTO;
import com.wanderlust.api.dto.TipDTO;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.services.TravelGuideService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/travelguides")
public class TravelGuideController {
    private final TravelGuideService travelGuideService;

    // Lấy tất cả travel guides
    @GetMapping
    public ResponseEntity<List<TravelGuideResponseDTO>> getAllTravelGuides() {
        List<TravelGuide> guides = travelGuideService.getAllTravelGuides();
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy travel guide theo id
    @GetMapping("/{id}")
    public ResponseEntity<TravelGuideResponseDTO> getTravelGuideById(@PathVariable String id) {
        // Tăng view count khi xem chi tiết
        TravelGuide guide = travelGuideService.incrementViews(id);
        if (guide != null) {
            return new ResponseEntity<>(convertToResponseDTO(guide), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Tạo mới travel guide (chỉ admin và partner)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<TravelGuideResponseDTO> createTravelGuide(@RequestBody TravelGuideRequestDTO requestDTO) {
        TravelGuide guide = convertToEntity(requestDTO);
        TravelGuide createdGuide = travelGuideService.createTravelGuide(guide);
        return new ResponseEntity<>(convertToResponseDTO(createdGuide), HttpStatus.CREATED);
    }

    // Cập nhật travel guide
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<TravelGuideResponseDTO> updateTravelGuide(
            @PathVariable String id,
            @RequestBody TravelGuideRequestDTO requestDTO) {
        TravelGuide guide = convertToEntity(requestDTO);
        TravelGuide updatedGuide = travelGuideService.updateTravelGuide(id, guide);
        if (updatedGuide != null) {
            return new ResponseEntity<>(convertToResponseDTO(updatedGuide), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Xóa travel guide
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTravelGuide(@PathVariable String id) {
        boolean deleted = travelGuideService.deleteTravelGuide(id);
        if (deleted) {
            return new ResponseEntity<>("Travel guide deleted successfully!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Travel guide not found!", HttpStatus.NOT_FOUND);
    }

    // Lấy theo destination
    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByDestination(@PathVariable String destination) {
        List<TravelGuide> guides = travelGuideService.getByDestination(destination);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy theo country
    @GetMapping("/country/{country}")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByCountry(@PathVariable String country) {
        List<TravelGuide> guides = travelGuideService.getByCountry(country);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy theo continent
    @GetMapping("/continent/{continent}")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByContinent(@PathVariable String continent) {
        List<TravelGuide> guides = travelGuideService.getByContinent(continent);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy theo category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByCategory(@PathVariable String category) {
        List<TravelGuide> guides = travelGuideService.getByCategory(category);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy theo type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByType(@PathVariable String type) {
        List<TravelGuide> guides = travelGuideService.getByType(type);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy published guides
    @GetMapping("/published")
    public ResponseEntity<List<TravelGuideResponseDTO>> getPublishedGuides() {
        List<TravelGuide> guides = travelGuideService.getPublishedGuides();
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy featured guides
    @GetMapping("/featured")
    public ResponseEntity<List<TravelGuideResponseDTO>> getFeaturedGuides() {
        List<TravelGuide> guides = travelGuideService.getFeaturedGuides();
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy popular guides
    @GetMapping("/popular")
    public ResponseEntity<List<TravelGuideResponseDTO>> getPopularGuides() {
        List<TravelGuide> guides = travelGuideService.getPopularGuides();
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy theo author
    @GetMapping("/author/{authorId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByAuthor(@PathVariable String authorId) {
        List<TravelGuide> guides = travelGuideService.getByAuthor(authorId);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Lấy theo tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<TravelGuideResponseDTO>> getByTag(@PathVariable String tag) {
        List<TravelGuide> guides = travelGuideService.getByTag(tag);
        List<TravelGuideResponseDTO> response = guides.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Like travel guide
    @PutMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TravelGuideResponseDTO> likeTravelGuide(@PathVariable String id) {
        TravelGuide guide = travelGuideService.incrementLikes(id);
        if (guide != null) {
            return new ResponseEntity<>(convertToResponseDTO(guide), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Unlike travel guide
    @PutMapping("/{id}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TravelGuideResponseDTO> unlikeTravelGuide(@PathVariable String id) {
        TravelGuide guide = travelGuideService.decrementLikes(id);
        if (guide != null) {
            return new ResponseEntity<>(convertToResponseDTO(guide), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Helper method: Convert Entity to Response DTO
    private TravelGuideResponseDTO convertToResponseDTO(TravelGuide guide) {
        TravelGuideResponseDTO dto = new TravelGuideResponseDTO();
        dto.setId(guide.getId());
        dto.setTitle(guide.getTitle());
        dto.setDestination(guide.getDestination());
        dto.setCountry(guide.getCountry());
        dto.setContinent(guide.getContinent());
        dto.setCategory(guide.getCategory());
        dto.setDescription(guide.getDescription());
        dto.setContent(guide.getContent());
        dto.setReadTime(guide.getReadTime());
        dto.setCoverImage(guide.getCoverImage());
        dto.setImages(guide.getImages());
        dto.setAuthorId(guide.getAuthorId());
        dto.setAuthorName(guide.getAuthorName());
        dto.setTags(guide.getTags());
        dto.setViews(guide.getViews());
        dto.setLikes(guide.getLikes());
        dto.setDuration(guide.getDuration());
        dto.setType(guide.getType());
        dto.setDifficulty(guide.getDifficulty());
        
        // Convert attractions
        if (guide.getAttractions() != null) {
            List<AttractionDTO> attractionDTOs = guide.getAttractions().stream()
                    .map(attraction -> new AttractionDTO(
                        attraction.getName(), 
                        attraction.getImage(), 
                        attraction.getDescription()
                    ))
                    .collect(Collectors.toList());
            dto.setAttractions(attractionDTOs);
        }
        
        // Convert tips
        if (guide.getTips() != null) {
            List<TipDTO> tipDTOs = guide.getTips().stream()
                    .map(tip -> new TipDTO(tip.getTitle(), tip.getContent(), tip.getIcon()))
                    .collect(Collectors.toList());
            dto.setTips(tipDTOs);
        }
        
        dto.setPublished(guide.getPublished());
        dto.setFeatured(guide.getFeatured());
        dto.setCreatedAt(guide.getCreatedAt());
        dto.setUpdatedAt(guide.getUpdatedAt());
        return dto;
    }

    // Helper method: Convert Request DTO to Entity
    private TravelGuide convertToEntity(TravelGuideRequestDTO dto) {
        TravelGuide guide = new TravelGuide();
        guide.setTitle(dto.getTitle());
        guide.setDestination(dto.getDestination());
        guide.setCountry(dto.getCountry());
        guide.setContinent(dto.getContinent());
        guide.setCategory(dto.getCategory());
        guide.setDescription(dto.getDescription());
        guide.setContent(dto.getContent());
        guide.setReadTime(dto.getReadTime());
        guide.setCoverImage(dto.getCoverImage());
        guide.setImages(dto.getImages());
        guide.setAuthorId(dto.getAuthorId());
        guide.setAuthorName(dto.getAuthorName());
        guide.setTags(dto.getTags());
        guide.setDuration(dto.getDuration());
        guide.setType(dto.getType());
        guide.setDifficulty(dto.getDifficulty());
        
        // Convert attractions
        if (dto.getAttractions() != null) {
            List<TravelGuide.Attraction> attractions = dto.getAttractions().stream()
                    .map(attractionDTO -> {
                        TravelGuide.Attraction attraction = new TravelGuide.Attraction();
                        attraction.setName(attractionDTO.getName());
                        attraction.setImage(attractionDTO.getImage());
                        attraction.setDescription(attractionDTO.getDescription());
                        return attraction;
                    })
                    .collect(Collectors.toList());
            guide.setAttractions(attractions);
        }
        guide.setDuration(dto.getDuration());
        guide.setDifficulty(dto.getDifficulty());
        
        // Convert tips
        if (dto.getTips() != null) {
            List<TravelGuide.Tip> tips = dto.getTips().stream()
                    .map(tipDTO -> {
                        TravelGuide.Tip tip = new TravelGuide.Tip();
                        tip.setTitle(tipDTO.getTitle());
                        tip.setContent(tipDTO.getContent());
                        tip.setIcon(tipDTO.getIcon());
                        return tip;
                    })
                    .collect(Collectors.toList());
            guide.setTips(tips);
        }
        
        guide.setPublished(dto.getPublished());
        guide.setFeatured(dto.getFeatured());
        return guide;
    }
}
