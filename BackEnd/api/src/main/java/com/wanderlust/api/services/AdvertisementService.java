package com.wanderlust.api.services;

import com.wanderlust.api.dto.advertisement.AdvertisementRequestDTO;
import com.wanderlust.api.dto.advertisement.AdvertisementResponseDTO;
import com.wanderlust.api.entity.Advertisement;
import com.wanderlust.api.entity.types.AdPosition;
import com.wanderlust.api.mapper.AdvertisementMapper;
import com.wanderlust.api.repository.AdvertisementRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AdvertisementService { // Không cần implements BaseServices nữa

    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementMapper advertisementMapper;

    // Get all advertisements (có thể filter theo position)
    public List<AdvertisementResponseDTO> findAll(AdPosition position) {
        List<Advertisement> advertisements;
        if (position != null) {
            advertisements = advertisementRepository.findByPosition(position); // Cần tạo method này trong Repository
        } else {
            advertisements = advertisementRepository.findAll();
        }
        return advertisementMapper.toDTOs(advertisements);
    }

    // Get a specific advertisement by id
    public AdvertisementResponseDTO findByID(String id) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found with id " + id));
        return advertisementMapper.toDTO(ad);
    }

    // Add an advertisement
    public AdvertisementResponseDTO create(AdvertisementRequestDTO dto) {
        Advertisement advertisement = advertisementMapper.toEntity(dto);
        
        // Set giá trị mặc định khi tạo
        advertisement.setImpressions(0);
        advertisement.setClicks(0);
        advertisement.setConversions(0);
        advertisement.setSpend(BigDecimal.ZERO);
        advertisement.setCreatedAt(LocalDateTime.now());
        advertisement.setUpdatedAt(LocalDateTime.now());

        Advertisement savedAd = advertisementRepository.insert(advertisement);
        return advertisementMapper.toDTO(savedAd);
    }

    // Update an existing advertisement
    public AdvertisementResponseDTO update(String id, AdvertisementRequestDTO dto) {
        Advertisement existingAd = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found with id " + id));

        // Dùng mapper để cập nhật các trường từ DTO
        advertisementMapper.updateEntityFromDTO(dto, existingAd);
        existingAd.setUpdatedAt(LocalDateTime.now());

        Advertisement updatedAd = advertisementRepository.save(existingAd);
        return advertisementMapper.toDTO(updatedAd);
    }

    // Delete an advertisement by ID
    public void delete(String id) {
        if (!advertisementRepository.existsById(id)) {
            throw new RuntimeException("Advertisement not found with id " + id);
        }
        advertisementRepository.deleteById(id);
    }

    // Delete all advertisements
    public void deleteAll() {
        advertisementRepository.deleteAll();
    }

    // Track an impression 
    public void trackImpression(String id) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found with id " + id));
        ad.setImpressions(ad.getImpressions() + 1);
        // Cập nhật 'spend' dựa trên CPM (costPerImpression)
        if (ad.getCostPerImpression() != null) {
            ad.setSpend(ad.getSpend().add(ad.getCostPerImpression().divide(BigDecimal.valueOf(1000))));
        }
        advertisementRepository.save(ad);
    }

    // Track a click 
    public void trackClick(String id) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found with id " + id));
        ad.setClicks(ad.getClicks() + 1);
        // Cập nhật 'spend' dựa trên CPC (costPerClick)
        if (ad.getCostPerClick() != null) {
            ad.setSpend(ad.getSpend().add(ad.getCostPerClick()));
        }
        advertisementRepository.save(ad);
    }
}