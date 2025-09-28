package com.wanderlust.api.services;

import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.repository.PaymentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class PaymentService implements BaseServices<Payment> {

    private final PaymentRepository paymentRepository;

    // Get all payments
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    // Add a payment
    public Payment create(Payment payment) {
        return paymentRepository.insert(payment);
    }

    // Update an existing payment
    public Payment update(Payment payment) {
        Payment updatedPayment = paymentRepository.findById(payment.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + payment.getPaymentId()));

        if (payment.getPayment_Amount() != null) updatedPayment.setPayment_Amount(payment.getPayment_Amount());
        if (payment.getPayment_Method() != null) updatedPayment.setPayment_Method(payment.getPayment_Method());
        if (payment.getPayment_Date() != null) updatedPayment.setPayment_Date(payment.getPayment_Date());
        if (payment.getStatus() != null) updatedPayment.setStatus(payment.getStatus());

        return paymentRepository.save(updatedPayment);
    }

    // Delete a payment by ID
    public void delete(String id) {
        if (paymentRepository.findById(id).isPresent()) {
            paymentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Payment not found with id " + id);
        }
    }

    // Delete all payments
    public void deleteAll() {
        paymentRepository.deleteAll();
    }

    // Get a specific payment by id
    public Payment findByID(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }
}