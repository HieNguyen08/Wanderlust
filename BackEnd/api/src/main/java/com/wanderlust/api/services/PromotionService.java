package com.wanderlust.api.services;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.repository.PromotionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class PromotionService implements BaseServices<Promotion> {

    private final PromotionRepository promotionRepository;

    // Get all promotions
    public List<Promotion> findAll() {
        return promotionRepository.findAll();
    }

    // Add a promotion
    public Promotion create(Promotion promotion) {
        return promotionRepository.insert(promotion);
    }

    // Update an existing promotion
    public Promotion update(Promotion promotion) {
        Promotion updatedPromotion = promotionRepository.findById(promotion.getPromotion_ID())
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + promotion.getPromotion_ID()));

        if (promotion.getDescription() != null) updatedPromotion.setDescription(promotion.getDescription());
        if (promotion.getDiscount_Percentage() != null) updatedPromotion.setDiscount_Percentage(promotion.getDiscount_Percentage());
        if (promotion.getApplicable_service() != null) updatedPromotion.setApplicable_service(promotion.getApplicable_service());
        if (promotion.getStart_date() != null) updatedPromotion.setStart_date(promotion.getStart_date());
        if (promotion.getEnd_date() != null) updatedPromotion.setEnd_date(promotion.getEnd_date());
        if (promotion.getDuration() != null) updatedPromotion.setDuration(promotion.getDuration());

        return promotionRepository.save(updatedPromotion);
    }

    // Delete a promotion by ID
    public void delete(String id) {
        if (promotionRepository.findById(id).isPresent()) {
            promotionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Promotion not found with id " + id);
        }
    }

    // Delete all promotions
    public void deleteAll() {
        promotionRepository.deleteAll();
    }

    // Get a specific promotion by id
    public Promotion findByID(String id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + id));
    }
}