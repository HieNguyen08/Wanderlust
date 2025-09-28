package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Admin;
import com.wanderlust.api.services.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/admin/admins")
public class AdminController {

    private final AdminService adminService;

    // Get all admins
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> allAdmins = adminService.findAll();
        return new ResponseEntity<>(allAdmins, HttpStatus.OK);
    }

    // Add an admin
    @PostMapping
    public ResponseEntity<Admin> addAdmin(@RequestBody Admin admin) {
        Admin newAdmin = adminService.create(admin);
        return new ResponseEntity<>(newAdmin, HttpStatus.CREATED);
    }

    // Update an existing admin
    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable String id, @RequestBody Admin updatedAdmin) {
        updatedAdmin.setAdmin_ID(id); // Ensure the ID in the entity matches the path variable
        Admin resultAdmin = adminService.update(updatedAdmin);
        return new ResponseEntity<>(resultAdmin, HttpStatus.OK);
    }

    // Delete an admin by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable String id) {
        try {
            adminService.delete(id);
            return new ResponseEntity<>("Admin has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all admins
    @DeleteMapping
    public ResponseEntity<String> deleteAllAdmins() {
        adminService.deleteAll();
        return new ResponseEntity<>("All admins have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific admin by id
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
        Admin admin = adminService.findByID(id);
        return new ResponseEntity<>(admin, HttpStatus.OK);
    }
}