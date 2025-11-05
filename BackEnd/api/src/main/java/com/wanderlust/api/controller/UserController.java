package com.wanderlust.api.controller;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUsers = userService.findAll();
        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    // Add a user
    @PostMapping
    public ResponseEntity<User> addUser (@RequestBody User user) {
        User newUser  = userService.create(user);
        return new ResponseEntity<>(newUser , HttpStatus.CREATED);
    }

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser (@PathVariable String id, @RequestBody User updatedUser ) {
        updatedUser.setUserId(id); // Ensure the ID in the entity matches the path variable
        try {
            User resultUser  = userService.update(updatedUser );
            return new ResponseEntity<>(resultUser , HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser (@PathVariable String id) {
        try {
            userService.delete(id);
            return new ResponseEntity<>("User  has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all users
    @DeleteMapping
    public ResponseEntity<String> deleteAllUsers() {
        userService.deleteAll();
        return new ResponseEntity<>("All users have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific user by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            User user = userService.findByID(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}