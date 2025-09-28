package com.wanderlust.api.services;

import com.wanderlust.api.entity.Admin;
import com.wanderlust.api.repository.AdminRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AdminService implements BaseServices<Admin> {

    private final AdminRepository adminRepository;

    // Get all admins
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    // Add an admin
    public Admin create(Admin admin) {
        return adminRepository.insert(admin);
    }

    // Update an existing admin
    public Admin update(Admin admin) {
        Admin updatedAdmin = adminRepository.findById(admin.getAdmin_ID())
                .orElseThrow(() -> new RuntimeException("Admin not found with id " + admin.getAdmin_ID()));

        if (admin.getPassword() != null) updatedAdmin.setPassword(admin.getPassword());
        if (admin.getEmail() != null) updatedAdmin.setEmail(admin.getEmail());
        if (admin.getAdmin_Type() != null) updatedAdmin.setAdmin_Type(admin.getAdmin_Type());

        return adminRepository.save(updatedAdmin);
    }

    // Delete an admin by ID
    public void delete(String id) {
        if (adminRepository.findById(id).isPresent()) {
            adminRepository.deleteById(id);
        } else {
            throw new RuntimeException("Admin not found with id " + id);
        }
    }

    // Delete all admins
    public void deleteAll() {
        adminRepository.deleteAll();
    }

    // Get a specific admin by id
    public Admin findByID(String id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id " + id));
    }
}