/**
 * MongoDB Index Creation Script for Wanderlust
 * 
 * CRITICAL: Run this script AFTER deploying the backend with @CompoundIndex annotations
 * This ensures all performance indexes are created for 2,000 concurrent users
 * 
 * Usage:
 *   mongosh "mongodb://localhost:27017/wanderlust" mongodb-indexes.js
 *   OR
 *   mongosh
 *   use wanderlust
 *   load("mongodb-indexes.js")
 * 
 * Expected Duration: 1-5 minutes depending on collection sizes
 */

print("=".repeat(80));
print("🚀 Creating MongoDB Indexes for Wanderlust - Production Optimization");
print("=".repeat(80));
print("");

// Switch to wanderlust database
db = db.getSiblingDB('wanderlust');

print("📊 Current Database:", db.getName());
print("");

// Helper function to create index with error handling
function createIndexSafe(collection, keys, options) {
    const collName = collection.getName();
    const indexName = options.name || "unnamed_index";
    
    try {
        print(`Creating index: ${indexName} on ${collName}...`);
        const result = collection.createIndex(keys, options);
        print(`  ✅ Success: ${result}`);
        return true;
    } catch (error) {
        if (error.code === 85 || error.code === 86) {
            print(`  ⚠️  Index ${indexName} already exists, skipping...`);
            return true;
        } else {
            print(`  ❌ Error: ${error.message}`);
            return false;
        }
    }
}

print("=".repeat(80));
print("1️⃣  USER COLLECTION - Critical for Login Performance");
print("=".repeat(80));

createIndexSafe(
    db.users,
    { "email": 1 },
    { unique: true, name: "email_unique_idx" }
);

createIndexSafe(
    db.users,
    { "role": 1, "isBlocked": 1 },
    { name: "role_status_idx" }
);

createIndexSafe(
    db.users,
    { "membershipLevel": 1, "loyaltyPoints": -1 },
    { name: "membership_points_idx" }
);

createIndexSafe(
    db.users,
    { "vendorRequestStatus": 1, "createdAt": -1 },
    { name: "vendor_request_idx" }
);

print("");
print("=".repeat(80));
print("2️⃣  FLIGHT SEAT COLLECTION - Critical for Double-Booking Prevention");
print("=".repeat(80));

createIndexSafe(
    db.flight_seat,
    { "flightId": 1, "status": 1 },
    { name: "flight_status_idx" }
);

createIndexSafe(
    db.flight_seat,
    { "flightId": 1, "cabinClass": 1, "status": 1 },
    { name: "flight_cabin_status_idx" }
);

print("");
print("=".repeat(80));
print("3️⃣  WALLET COLLECTION - Critical for Financial Integrity");
print("=".repeat(80));

createIndexSafe(
    db.wallets,
    { "userId": 1 },
    { unique: true, name: "user_wallet_idx" }
);

print("");
print("=".repeat(80));
print("4️⃣  BOOKING COLLECTION - High Query Volume");
print("=".repeat(80));

createIndexSafe(
    db.bookings,
    { "userId": 1, "bookingDate": -1, "status": 1 },
    { name: "user_bookings_idx" }
);

createIndexSafe(
    db.bookings,
    { "vendorId": 1, "startDate": -1, "status": 1 },
    { name: "vendor_bookings_idx" }
);

createIndexSafe(
    db.bookings,
    { "carRentalId": 1, "status": 1, "startDate": 1, "endDate": 1 },
    { name: "availability_idx" }
);

createIndexSafe(
    db.bookings,
    { "status": 1, "paymentStatus": 1, "bookingDate": -1 },
    { name: "admin_filter_idx" }
);

createIndexSafe(
    db.bookings,
    { "bookingType": 1, "bookingDate": -1 },
    { name: "type_date_idx" }
);

print("");
print("=".repeat(80));
print("5️⃣  FLIGHT COLLECTION - Main Search Feature");
print("=".repeat(80));

createIndexSafe(
    db.flights,
    { "departureAirport": 1, "arrivalAirport": 1, "departureTime": 1, "status": 1 },
    { name: "route_date_status_idx" }
);

createIndexSafe(
    db.flights,
    { "airlineCode": 1, "departureTime": 1 },
    { name: "airline_departure_idx" }
);

createIndexSafe(
    db.flights,
    { "departureAirport": 1, "arrivalAirport": 1, "isDirect": 1, "departureTime": 1 },
    { name: "route_direct_idx" }
);

createIndexSafe(
    db.flights,
    { "status": 1, "departureTime": 1 },
    { name: "status_time_idx" }
);

print("");
print("=".repeat(80));
print("6️⃣  HOTEL COLLECTION - Location and Vendor Searches");
print("=".repeat(80));

createIndexSafe(
    db.hotels,
    { "locationId": 1, "status": 1, "approvalStatus": 1, "starRating": -1, "lowestPrice": 1 },
    { name: "location_search_idx" }
);

createIndexSafe(
    db.hotels,
    { "vendorId": 1, "status": 1, "approvalStatus": 1 },
    { name: "vendor_hotels_idx" }
);

createIndexSafe(
    db.hotels,
    { "featured": -1, "verified": -1, "avgRating": -1 },
    { name: "featured_idx" }
);

createIndexSafe(
    db.hotels,
    { "starRating": -1, "lowestPrice": 1 },
    { name: "rating_price_idx" }
);

print("");
print("=".repeat(80));
print("7️⃣  NOTIFICATION COLLECTION - Called on Every Page Load");
print("=".repeat(80));

createIndexSafe(
    db.notifications,
    { "userId": 1, "createdAt": -1 },
    { name: "user_notifications_idx" }
);

createIndexSafe(
    db.notifications,
    { "userId": 1, "isRead": 1 },
    { name: "unread_count_idx" }
);

print("");
print("=".repeat(80));
print("8️⃣  PAYMENT COLLECTION - Transaction Tracking");
print("=".repeat(80));

createIndexSafe(
    db.payments,
    { "bookingId": 1, "status": 1 },
    { name: "booking_payment_idx" }
);

createIndexSafe(
    db.payments,
    { "userId": 1, "createdAt": -1 },
    { name: "user_payments_idx" }
);

createIndexSafe(
    db.payments,
    { "status": 1, "paymentMethod": 1, "createdAt": -1 },
    { name: "status_tracking_idx" }
);

createIndexSafe(
    db.payments,
    { "gatewayTransactionId": 1 },
    { name: "gateway_ref_idx" }
);

print("");
print("=".repeat(80));
print("📈 Index Creation Summary");
print("=".repeat(80));

// List all collections and their indexes
const collections = [
    'users',
    'flight_seat', 
    'wallets',
    'bookings',
    'flights',
    'hotels',
    'notifications',
    'payments'
];

collections.forEach(collName => {
    if (db.getCollectionNames().includes(collName)) {
        const indexes = db.getCollection(collName).getIndexes();
        print(`\n📁 ${collName}: ${indexes.length} indexes`);
        indexes.forEach(idx => {
            const keyStr = JSON.stringify(idx.key);
            const unique = idx.unique ? " [UNIQUE]" : "";
            print(`   • ${idx.name}: ${keyStr}${unique}`);
        });
    } else {
        print(`\n⚠️  ${collName}: Collection does not exist yet`);
    }
});

print("");
print("=".repeat(80));
print("✅ Index creation script completed!");
print("=".repeat(80));
print("");
print("Next Steps:");
print("  1. Verify all indexes created: db.collection.getIndexes()");
print("  2. Test query performance: db.collection.find().explain('executionStats')");
print("  3. Monitor index usage: db.collection.aggregate([{$indexStats:{}}])");
print("  4. Start backend application and verify @Version fields are working");
print("");
