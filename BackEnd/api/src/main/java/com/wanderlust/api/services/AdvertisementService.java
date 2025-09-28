package com.wanderlust.api.services;

import com.wanderlust.api.entity.Advertisement;
import com.wanderlust.api.repository.AdvertisementRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AdvertisementService implements BaseServices<Advertisement> {

    private final AdvertisementRepository advertisementRepository;

    // Get all advertisements
    public List<Advertisement> findAll() {
        return advertisementRepository.findAll();
    }

    // Add an advertisement
    public Advertisement create(Advertisement advertisement) {
        return advertisementRepository.insert(advertisement);
    }

    // Update an existing advertisement
    public Advertisement update(Advertisement advertisement) {
        Advertisement updatedAdvertisement = advertisementRepository.findById(advertisement.getAd_ID())
                .orElseThrow(() -> new RuntimeException("Advertisement not found with id " + advertisement.getAd_ID()));

        if (advertisement.getNews() != null) updatedAdvertisement.setNews(advertisement.getNews());
        if (advertisement.getAd_Type() != null) updatedAdvertisement.setAd_Type(advertisement.getAd_Type());

        return advertisementRepository.save(updatedAdvertisement);
    }

    // Delete an advertisement by ID
    public void delete(String id) {
        if (advertisementRepository.findById(id).isPresent()) {
            advertisementRepository.deleteById(id);
        } else {
            throw new RuntimeException("Advertisement not found with id " + id);
        }
    }

    // Delete all advertisements
    public void deleteAll() {
        advertisementRepository.deleteAll();
    }

    // Get a specific advertisement by id
    public Advertisement findByID(String id) {
        return advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found with id " + id));
    }
}