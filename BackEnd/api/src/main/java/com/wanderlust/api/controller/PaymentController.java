package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Payment; // Use the Payment entity directly
import com.wanderlust.api.services.PaymentService; // Assuming you have a PaymentService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Get all payments
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> allPayments = paymentService.findAll();
        return new ResponseEntity<>(allPayments, HttpStatus.OK);
    }

    // Add a payment
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Payment> addPayment(@RequestBody Payment payment) {
        Payment newPayment = paymentService.create(payment);
        return new ResponseEntity<>(newPayment, HttpStatus.CREATED);
    }

    // Update an existing payment
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePayment(@PathVariable String id, @RequestBody Payment updatedPayment) {
        updatedPayment.setPaymentId(id); // Ensure the ID in the entity matches the path variable
        try {
            Payment resultPayment = paymentService.update(updatedPayment);
            return new ResponseEntity<>(resultPayment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a payment by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePayment(@PathVariable String id) {
        try {
            paymentService.delete(id);
            return new ResponseEntity<>("Payment has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all payments
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllPayments() {
        paymentService.deleteAll();
        return new ResponseEntity<>("All payments have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific payment by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPaymentById(@PathVariable String id) {
        try {
            Payment payment = paymentService.findByID(id);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}