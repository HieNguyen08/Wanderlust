# 📱 FRONTEND API REQUIREMENTS ANALYSIS

## 🎯 TỔNG QUAN

Phân tích các trang Frontend và xác định APIs cần thiết để kết nối với Backend.

---

## ✅ ĐÃ KẾT NỐI (5 pages)

### 1. **Auth/LoginPage.tsx** ✅
**Backend:** AuthController
- `POST /api/auth/login`
- `POST /api/auth/register`
**Status:** HOÀN THÀNH

### 2. **Profile/ProfilePage.tsx** ✅
**Backend:** UserProfileController
- `GET /api/v1/users/me`
- `PUT /api/v1/users/me/profile`
- `GET /api/v1/users/me/stats`
- `GET /api/v1/users/me/membership`
**Status:** HOÀN THÀNH

### 3. **Profile/UserWalletPage.tsx** ✅
**Backend:** WalletController, TransactionController
- `GET /api/v1/wallet`
- `GET /api/v1/transactions`
**Status:** HOÀN THÀNH

### 4. **Profile/SettingsPage.tsx** ✅
**Backend:** UserProfileController
- `PUT /api/v1/users/me/password`
- `GET /api/v1/users/me/notification-settings`
- `PUT /api/v1/users/me/notification-settings`
**Status:** HOÀN THÀNH

### 5. **Profile/UserVouchersPage.tsx** ✅
**Backend:** UserVoucherController
- `GET /api/v1/user-vouchers`
- `GET /api/v1/user-vouchers/available`
- `GET /api/v1/user-vouchers/used`
- `GET /api/v1/user-vouchers/statistics`
- `POST /api/v1/user-vouchers/save`
**Status:** HOÀN THÀNH

---

## 🔄 CẦN KẾT NỐI (Ưu tiên cao)

### 6. **Hotels Module**

#### HotelListPage.tsx
**APIs cần:**
- `GET /api/hotels` - Tìm kiếm khách sạn
- `GET /api/hotels/featured` - Khách sạn nổi bật
- `GET /api/locations` - Danh sách địa điểm

**Backend Controllers:**
- HotelController
- LocationController

#### HotelDetailPage.tsx
**APIs cần:**
- `GET /api/hotels/{id}` - Chi tiết khách sạn
- `GET /api/hotels/{id}/rooms` - Danh sách phòng
- `GET /api/hotels/{id}/reviews` - Đánh giá
- `POST /api/hotels/{id}/check-availability` - Kiểm tra còn phòng

**Backend Controllers:**
- HotelController
- RoomController
- ReviewCommentController

#### HotelBookingPage.tsx
**APIs cần:**
- `GET /api/rooms/{id}` - Chi tiết phòng
- `GET /api/rooms/{id}/availability` - Kiểm tra phòng trống
- `POST /api/bookings` - Tạo booking
- `POST /api/bookings/preview` - Preview booking
- `GET /api/promotions` - Lấy mã giảm giá
- `POST /api/promotions/validate` - Validate voucher

**Backend Controllers:**
- RoomController
- BookingController
- PromotionController

---

### 7. **Flights Module**

#### FlightSearchPage.tsx
**APIs cần:**
- `GET /api/flights/search` - Tìm kiếm chuyến bay
- `GET /api/flights/range` - Chuyến bay theo khoảng ngày
- `GET /api/locations` - Điểm đi/đến

**Backend Controllers:**
- FlightController
- LocationController

#### FlightBookingPage.tsx
**APIs cần:**
- `GET /api/flights/{id}` - Chi tiết chuyến bay
- `GET /api/flight-seats` - Danh sách ghế
- `POST /api/bookings` - Tạo booking
- `POST /api/payments/initiate` - Khởi tạo thanh toán

**Backend Controllers:**
- FlightController
- FlightSeatController
- BookingController
- PaymentController

---

### 8. **Activities Module**

#### ActivitiesPage.tsx
**APIs cần:**
- `GET /api/activities` - Tìm kiếm activities
- `GET /api/activities/featured` - Activities nổi bật
- `GET /api/locations` - Lọc theo địa điểm

**Backend Controllers:**
- ActivityController
- LocationController

#### ActivityDetailPage.tsx
**APIs cần:**
- `GET /api/activities/{id}` - Chi tiết activity
- `GET /api/activities/{id}/reviews` - Đánh giá
- `GET /api/activities/{id}/availability` - Kiểm tra slots
- `POST /api/activities/{id}/check-availability` - Kiểm tra cụ thể
- `POST /api/bookings` - Đặt activity

**Backend Controllers:**
- ActivityController
- ReviewCommentController
- BookingController

---

### 9. **Car Rental Module**

#### CarRentalPage.tsx
**APIs cần:**
- `GET /api/car-rentals` - Tìm kiếm xe
- `GET /api/car-rentals/popular` - Xe phổ biến
- `GET /api/locations` - Địa điểm thuê xe

**Backend Controllers:**
- CarRentalController
- LocationController

#### CarDetailPage.tsx
**APIs cần:**
- `GET /api/car-rentals/{id}` - Chi tiết xe
- `GET /api/car-rentals/{id}/availability` - Kiểm tra xe trống
- `POST /api/car-rentals/{id}/calculate-price` - Tính giá
- `POST /api/bookings` - Đặt xe

**Backend Controllers:**
- CarRentalController
- BookingController

---

### 10. **Booking Module**

#### BookingHistoryPage.tsx
**APIs cần:**
- `GET /api/bookings` - Lịch sử bookings
- `GET /api/bookings/{id}` - Chi tiết booking
- `PUT /api/bookings/{id}/cancel` - Hủy booking
- `POST /api/bookings/{id}/request-refund` - Yêu cầu hoàn tiền

**Backend Controllers:**
- BookingController

---

### 11. **Travel Guide Module**

#### TravelGuidePage.tsx ✅ (Đã có API calls)
**APIs đang dùng:**
- `travelGuideApi.getByCountry("Việt Nam")`
- `travelGuideApi.getFeatured()`
- `travelGuideApi.getByType("blog")`
- `travelGuideApi.getByContinent(continent)`

**APIs cần thêm:**
- Like/Unlike travel guide

**Backend Controller:**
- TravelGuideController

#### GuideDetailPage.tsx ✅ (Đã có API calls)
**APIs đang dùng:**
- `travelGuideApi.getById(id)`
- `travelGuideApi.getByCountry(country)`
- `travelGuideApi.getByType("blog")`

**APIs cần thêm:**
- `PUT /api/travelguides/{id}/like`
- `PUT /api/travelguides/{id}/unlike`

**Backend Controller:**
- TravelGuideController

---

### 12. **Visa Module**

#### VisaLandingPage.tsx ✅ (Đã có API calls)
**APIs đang dùng:**
- `visaArticleApi.getAll()`

**Backend Controller:**
- VisaArticleController

#### VisaApplicationPage.tsx
**APIs cần:**
- ⚠️ **MISSING IN BACKEND** - Visa application submission
- Suggestion: Cần tạo `VisaApplicationController`

#### VisaPaymentPage.tsx
**APIs cần:**
- `POST /api/payments/initiate`
- `POST /api/payments/callback/{gateway}`

**Backend Controller:**
- PaymentController

---

### 13. **Admin Module**

#### AdminDashboard.tsx
**APIs cần:**
- `GET /api/admin/bookings/statistics`
- `GET /api/v1/admin/wallets` (pagination)
- `GET /api/users` - Tổng users

**Backend Controllers:**
- AdminBookingController
- AdminWalletController
- UserController

#### AdminBookings.tsx
**APIs cần:**
- `GET /api/admin/bookings`
- `PUT /api/admin/bookings/{id}`
- `DELETE /api/admin/bookings/{id}`

**Backend Controller:**
- AdminBookingController

#### AdminWallet.tsx
**APIs cần:**
- `GET /api/v1/admin/wallets`
- `GET /api/v1/admin/wallets/{userId}`
- `GET /api/v1/admin/wallets/refunds/pending`
- `PUT /api/v1/admin/wallets/refunds/{transactionId}/approve`
- `PUT /api/v1/admin/wallets/refunds/{transactionId}/reject`
- `PUT /api/v1/admin/wallets/{userId}/status`

**Backend Controller:**
- AdminWalletController

#### AdminUsers.tsx
**APIs cần:**
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

**Backend Controller:**
- UserController

---

### 14. **Vendor Module**

#### VendorBookingsPage.tsx
**APIs cần:**
- `GET /api/vendor/bookings`
- `POST /api/vendor/bookings/{id}/confirm`
- `POST /api/vendor/bookings/{id}/reject`

**Backend Controller:**
- VendorBookingController

#### VendorServicesPage.tsx
**APIs cần:**
- `GET /api/vendor/hotels` - Danh sách hotels của vendor
- `POST /api/vendor/hotels` - Tạo hotel
- `PUT /api/vendor/hotels/{id}` - Cập nhật
- `DELETE /api/vendor/hotels/{id}` - Xóa
- `GET /api/vendor/rooms` - Danh sách rooms
- `POST /api/vendor/rooms` - Tạo room
- `PUT /api/vendor/rooms/{id}` - Cập nhật
- `DELETE /api/vendor/rooms/{id}` - Xóa

**Backend Controllers:**
- HotelController
- RoomController

#### VendorReviewsPage.tsx
**APIs cần:**
- `GET /api/reviews` (filter by vendorId - **MISSING**)
- `POST /api/reviews/{id}/respond`

**Backend Controller:**
- ReviewCommentController
**Note:** Cần thêm API filter reviews by vendor

---

## ⚠️ MISSING APIs IN BACKEND

### 1. **Visa Application**
**Cần tạo:** `VisaApplicationController`
- `POST /api/visa-applications` - Submit application
- `GET /api/visa-applications` - User's applications
- `GET /api/visa-applications/{id}` - Application detail
- `PUT /api/visa-applications/{id}/status` - Update status (Admin)

### 2. **Vendor Reviews Filter**
**Cần thêm vào ReviewCommentController:**
- `GET /api/reviews/vendor/{vendorId}` - Reviews cho vendor

### 3. **Search/Filter Enhancements**
**Cần thêm:**
- `GET /api/search/global?query=` - Global search
- Advanced filters cho Hotels, Flights, Activities

### 4. **Notifications**
**Cần tạo:** `NotificationController`
- `GET /api/notifications` - User notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

---

## 📊 TỔNG KẾT

### Đã kết nối:
- ✅ 5 pages: Auth, Profile (3 pages), Vouchers

### Cần kết nối:
- 🔄 Hotels: 3 pages
- 🔄 Flights: 2 pages
- 🔄 Activities: 2 pages
- 🔄 Car Rental: 2 pages
- 🔄 Booking: 1 page
- 🔄 Travel Guide: 2 pages (cần thêm Like)
- 🔄 Visa: 2 pages
- 🔄 Admin: 4 pages
- 🔄 Vendor: 3 pages

**Tổng:** 26 pages cần integration

### APIs còn thiếu:
1. VisaApplicationController (4 endpoints)
2. NotificationController (3 endpoints)
3. Vendor Reviews Filter (1 endpoint)
4. Global Search (1 endpoint)

---

## 🚀 KẾ HOẠCH TRIỂN KHAI

### Phase 1: Core Booking Features (Ưu tiên cao)
1. Hotels Module (3 pages) - ~15 APIs
2. Flights Module (2 pages) - ~10 APIs
3. Booking History (1 page) - ~4 APIs

### Phase 2: Additional Services
4. Activities Module (2 pages) - ~8 APIs
5. Car Rental Module (2 pages) - ~6 APIs

### Phase 3: Content & Reviews
6. Travel Guide (Like/Unlike) - ~2 APIs
7. Review System Integration - ~5 APIs

### Phase 4: Admin & Vendor
8. Admin Module (4 pages) - ~15 APIs
9. Vendor Module (3 pages) - ~10 APIs

### Phase 5: Visa & Extensions
10. Visa Module (2 pages) - ~5 APIs
11. Missing Backend APIs

---

**Cập nhật:** 15/11/2025
**Status:** Phase 1 đang chuẩn bị triển khai
