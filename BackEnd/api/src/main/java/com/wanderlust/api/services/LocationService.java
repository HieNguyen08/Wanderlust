package com.wanderlust.api.services;

import com.wanderlust.api.dto.locationDTO.LocationRequestDTO;
import com.wanderlust.api.dto.locationDTO.LocationResponseDTO;
import com.wanderlust.api.entity.Location;
import com.wanderlust.api.mapper.LocationMapper;
import com.wanderlust.api.repository.LocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper; // MapStruct sẽ tự inject implementation vào đây

    // Get all with pagination
    public Page<LocationResponseDTO> findAll(Pageable pageable) {
        return locationRepository.findAll(pageable)
                .map(locationMapper::toDTO);
    }

    // Get featured
    public List<LocationResponseDTO> findFeatured() {
        return locationMapper.toDTOs(locationRepository.findByFeaturedTrue());
    }

    // Search
    public List<LocationResponseDTO> search(String query) {
        return locationMapper.toDTOs(locationRepository.searchByQuery(query));
    }

    // Get by ID
    public LocationResponseDTO findByID(String id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id " + id));
        return locationMapper.toDTO(location);
    }

    // Create
    public LocationResponseDTO create(LocationRequestDTO locationDTO) {
        Location location = locationMapper.toEntity(locationDTO);
        // Xử lý default logic nếu cần (ví dụ nếu null thì set mặc định)
        if (location.getFeatured() == null) location.setFeatured(false);
        if (location.getPopularity() == null) location.setPopularity(0);
        
        Location savedLocation = locationRepository.save(location);
        return locationMapper.toDTO(savedLocation);
    }

    // Update
    public LocationResponseDTO update(String id, LocationRequestDTO locationDTO) {
        Location existingLocation = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id " + id));
        
        // MapStruct sẽ tự động copy các field không null từ DTO vào existingLocation
        locationMapper.updateEntityFromDTO(locationDTO, existingLocation);
        
        Location updatedLocation = locationRepository.save(existingLocation);
        return locationMapper.toDTO(updatedLocation);
    }

    // Delete
    public void delete(String id) {
        if (!locationRepository.existsById(id)) {
            throw new RuntimeException("Location not found with id " + id);
        }
        locationRepository.deleteById(id);
    }

    // Delete All
    public void deleteAll() {
        locationRepository.deleteAll();
    }
}