package com.wanderlust.api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.wanderlust.api.services.PaymentService;

import lombok.extern.slf4j.Slf4j;

/**
 * Controller để xử lý Stripe Webhooks
 * Stripe sẽ gửi các event về endpoint này khi có sự kiện thanh toán
 */
@Slf4j
@RestController
@RequestMapping("/api/payments/webhook")
public class StripeWebhookController {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final PaymentService paymentService;

    @Autowired
    public StripeWebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Endpoint nhận Stripe Webhook Events
     * 
     * QUAN TRỌNG:
     * - Endpoint này phải public (không cần authentication)
     * - Phải verify signature từ Stripe để đảm bảo request hợp lệ
     * - Luôn trả về 200 OK cho Stripe, ngay cả khi có lỗi internal
     */
    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Stripe.apiKey = stripeSecretKey;
        Event event = null;

        // 1. Verify webhook signature
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("❌ Stripe Webhook signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            log.error("❌ Error parsing Stripe webhook: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error");
        }

        // 2. Handle the event
        log.info("✅ Stripe Event received: {} (ID: {})", event.getType(), event.getId());

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;

        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else {
            log.warn("⚠️ Deserialization failed for event: {}", event.getId());
            // Fallback: still try to process using raw data
        }

        // 3. Route event to appropriate handler
        try {
            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event, stripeObject);
                    break;

                case "payment_intent.succeeded":
                    handlePaymentIntentSucceeded(event, stripeObject);
                    break;

                case "payment_intent.payment_failed":
                    handlePaymentIntentFailed(event, stripeObject);
                    break;

                case "charge.refunded":
                    handleChargeRefunded(event, stripeObject);
                    break;

                default:
                    log.info("ℹ️ Unhandled event type: {}", event.getType());
            }
        } catch (Exception e) {
            log.error("❌ Error processing Stripe event {}: {}", event.getType(), e.getMessage(), e);
            // Still return 200 to prevent Stripe from retrying
        }

        return ResponseEntity.ok("Webhook received");
    }

    /**
     * Xử lý khi checkout session hoàn tất (khách hàng đã thanh toán)
     */
    private void handleCheckoutSessionCompleted(Event event, StripeObject stripeObject) {
        Session session = (Session) stripeObject;
        log.info("💰 Checkout Session Completed: {}", session.getId());
        log.info("   - Client Reference ID: {}", session.getClientReferenceId());
        log.info("   - Payment Status: {}", session.getPaymentStatus());
        log.info("   - Amount Total: {}", session.getAmountTotal());

        // Tạo callback data để gửi vào PaymentService
        Map<String, Object> callbackData = new HashMap<>();
        callbackData.put("type", event.getType());

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> object = new HashMap<>();
        object.put("id", session.getId());
        object.put("client_reference_id", session.getClientReferenceId());
        object.put("payment_status", session.getPaymentStatus());
        object.put("amount_total", session.getAmountTotal());
        object.put("currency", session.getCurrency());

        data.put("object", object);
        callbackData.put("data", data);

        // Gọi PaymentService để xử lý
        try {
            paymentService.handleGatewayCallback("stripe", callbackData);
            log.info("✅ Payment processed successfully for session: {}", session.getId());
        } catch (Exception e) {
            log.error("❌ Failed to process payment for session {}: {}", session.getId(), e.getMessage());
        }
    }

    /**
     * Xử lý khi payment intent thành công
     */
    private void handlePaymentIntentSucceeded(Event event, StripeObject stripeObject) {
        com.stripe.model.PaymentIntent paymentIntent = (com.stripe.model.PaymentIntent) stripeObject;
        log.info("✅ Payment Intent Succeeded: {}", paymentIntent.getId());

        Map<String, Object> callbackData = new HashMap<>();
        callbackData.put("type", event.getType());

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> object = new HashMap<>();
        object.put("id", paymentIntent.getId());
        object.put("amount", paymentIntent.getAmount());
        object.put("status", paymentIntent.getStatus());

        data.put("object", object);
        callbackData.put("data", data);

        try {
            paymentService.handleGatewayCallback("stripe", callbackData);
        } catch (Exception e) {
            log.error("❌ Failed to process payment intent: {}", e.getMessage());
        }
    }

    /**
     * Xử lý khi payment intent thất bại
     */
    private void handlePaymentIntentFailed(Event event, StripeObject stripeObject) {
        com.stripe.model.PaymentIntent paymentIntent = (com.stripe.model.PaymentIntent) stripeObject;
        log.warn("❌ Payment Intent Failed: {}", paymentIntent.getId());
        log.warn("   - Last Payment Error: {}", 
            paymentIntent.getLastPaymentError() != null 
                ? paymentIntent.getLastPaymentError().getMessage() 
                : "Unknown");

        Map<String, Object> callbackData = new HashMap<>();
        callbackData.put("type", event.getType());

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> object = new HashMap<>();
        object.put("id", paymentIntent.getId());
        object.put("status", paymentIntent.getStatus());

        data.put("object", object);
        callbackData.put("data", data);

        try {
            paymentService.handleGatewayCallback("stripe", callbackData);
        } catch (Exception e) {
            log.error("❌ Failed to process payment failure: {}", e.getMessage());
        }
    }

    /**
     * Xử lý khi có refund
     */
    private void handleChargeRefunded(Event event, StripeObject stripeObject) {
        com.stripe.model.Charge charge = (com.stripe.model.Charge) stripeObject;
        log.info("💸 Charge Refunded: {}", charge.getId());
        log.info("   - Amount Refunded: {}", charge.getAmountRefunded());
        
        // TODO: Implement refund handling logic if needed
    }

    /**
     * Test endpoint để verify webhook setup
     * Có thể xóa sau khi test xong
     */
    @GetMapping("/stripe/test")
    public ResponseEntity<Map<String, String>> testWebhook() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Stripe webhook endpoint is ready");
        response.put("endpoint", "/api/payments/webhook/stripe");
        response.put("webhookSecret", webhookSecret != null ? "Configured" : "Not configured");
        return ResponseEntity.ok(response);
    }
}
