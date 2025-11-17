# 📋 KẾ HOẠCH KẾT NỐI BACKEND - FRONTEND API

**Ngày tạo:** 15/11/2025
**Trạng thái:** Đang phân tích

---

## 🎯 MỤC TIÊU
Kết nối toàn bộ Frontend React với Backend Spring Boot theo từng module có hệ thống

---

## 📊 PHASE 1: PHÂN TÍCH BACKEND APIs (24 Controllers)

### ✅ **ĐÃ HOÀN THÀNH:**

#### 1. **AuthController** ✅
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- **Trạng thái:** ✅ Đã kết nối với LoginPage.tsx

#### 2. **UserProfileController** ✅
- `GET /api/v1/users/me` - Lấy thông tin user
- `PUT /api/v1/users/me/profile` - Cập nhật profile
- `GET /api/v1/users/me/stats` - Thống kê user
- `GET /api/v1/users/me/membership` - Thông tin membership
- `PUT /api/v1/users/me/password` - Đổi mật khẩu
- `GET /api/v1/users/me/notification-settings` - Lấy cài đặt thông báo
- `PUT /api/v1/users/me/notification-settings` - Cập nhật thông báo
- `POST /api/v1/users/me/request-partner-role` - Yêu cầu partner
- **Trạng thái:** ✅ Đã kết nối với ProfilePage.tsx, SettingsPage.tsx

#### 3. **WalletController** ✅
- `GET /api/v1/wallet` - Lấy thông tin ví
- `POST /api/v1/wallet/deposit` - Nạp tiền
- `POST /api/v1/wallet/pay` - Thanh toán
- `POST /api/v1/wallet/withdraw` - Rút tiền
- **Trạng thái:** ✅ Đã kết nối với UserWalletPage.tsx

#### 4. **TransactionController** ✅
- `GET /api/v1/transactions` - Lịch sử giao dịch
- `GET /api/v1/transactions/{id}` - Chi tiết giao dịch
- `GET /api/v1/transactions/summary` - Tổng quan giao dịch
- **Trạng thái:** ✅ Đã kết nối với UserWalletPage.tsx

---

### ✅ **ĐÃ PHÂN TÍCH XONG:**

#### 5. **HotelController** ✅
**Public Endpoints:**
- `GET /api/hotels` - Tìm kiếm khách sạn (location, dates, etc)
- `GET /api/hotels/featured` - Khách sạn nổi bật
- `GET /api/hotels/{id}` - Chi tiết khách sạn
- `GET /api/hotels/{id}/rooms` - Danh sách phòng
- `GET /api/hotels/{id}/reviews` - Đánh giá (placeholder)
- `POST /api/hotels/{id}/check-availability` 🔐 - Kiểm tra còn phòng

**Vendor/Admin Endpoints:**
- `GET /api/vendor/hotels` 🔐 PARTNER/ADMIN - Danh sách khách sạn của vendor
- `POST /api/vendor/hotels` 🔐 PARTNER/ADMIN - Tạo khách sạn mới
- `PUT /api/vendor/hotels/{id}` 🔐 PARTNER/ADMIN - Cập nhật
- `DELETE /api/vendor/hotels/{id}` 🔐 PARTNER/ADMIN - Xóa

#### 6. **RoomController** ✅
**Public Endpoints:**
- `GET /api/rooms/{id}` - Chi tiết phòng
- `GET /api/rooms/{id}/availability` - Kiểm tra phòng trống

**Vendor Endpoints:**
- `GET /api/vendor/rooms` 🔐 PARTNER/ADMIN - Danh sách phòng
- `POST /api/vendor/rooms` 🔐 PARTNER/ADMIN - Tạo phòng mới
- `PUT /api/vendor/rooms/{id}` 🔐 PARTNER/ADMIN - Cập nhật phòng
- `DELETE /api/vendor/rooms/{id}` 🔐 PARTNER/ADMIN - Xóa phòng

#### 7. **FlightController** ✅
**Public Endpoints:**
- `GET /api/flights` - Danh sách tất cả chuyến bay
- `GET /api/flights/{id}` - Chi tiết chuyến bay
- `GET /api/flights/search` - Tìm kiếm (from, to, date, directOnly, airlines)
- `GET /api/flights/range` - Tìm theo khoảng ngày

**Admin Endpoints:**
- `POST /api/flights` 🔐 ADMIN - Tạo chuyến bay
- `DELETE /api/flights/{id}` 🔐 ADMIN - Xóa chuyến bay

#### 8. **FlightSeatController** ✅
- `GET /api/flight-seats` 🔐 Authenticated - Tất cả ghế
- `GET /api/flight-seats/{id}` 🔐 Authenticated - Chi tiết ghế
- `POST /api/flight-seats` 🔐 ADMIN - Tạo ghế
- `PUT /api/flight-seats/{id}` 🔐 ADMIN - Cập nhật ghế
- `DELETE /api/flight-seats/{id}` 🔐 ADMIN - Xóa ghế
- `DELETE /api/flight-seats` 🔐 ADMIN - Xóa tất cả

#### 9. **BookingController** ✅
- `GET /api/bookings` 🔐 Authenticated - Lấy bookings của user
- `GET /api/bookings/{id}` 🔐 Owner/ADMIN - Chi tiết booking
- `POST /api/bookings` 🔐 Authenticated - Tạo booking mới
- `PUT /api/bookings/{id}/cancel` 🔐 Owner/ADMIN - Hủy booking
- `POST /api/bookings/{id}/request-refund` 🔐 Owner - Yêu cầu hoàn tiền
- `POST /api/bookings/preview` 🔐 Authenticated - Xem trước booking

#### 10. **ActivityController** ✅
**Public Endpoints:**
- `GET /api/activities` - Tìm kiếm (locationId, category, minPrice, maxPrice)
- `GET /api/activities/featured` - Activities nổi bật
- `GET /api/activities/{id}` - Chi tiết activity
- `GET /api/activities/{id}/availability` - Kiểm tra slots
- `GET /api/activities/{id}/reviews` - Đánh giá đã duyệt
- `POST /api/activities/{id}/check-availability` 🔐 - Kiểm tra cụ thể

**Partner/Admin Endpoints:**
- `POST /api/activities` 🔐 PARTNER/ADMIN - Tạo activity
- `PUT /api/activities/{id}` 🔐 PARTNER/ADMIN - Cập nhật
- `DELETE /api/activities/{id}` 🔐 PARTNER/ADMIN - Xóa
- `DELETE /api/activities` 🔐 ADMIN - Xóa tất cả

#### 11. **CarRentalController** ✅
**Public Endpoints:**
- `GET /api/car-rentals` - Tìm kiếm xe (locationId, brand, type, price)
- `GET /api/car-rentals/popular` - Xe phổ biến
- `GET /api/car-rentals/{id}` - Chi tiết xe
- `GET /api/car-rentals/{id}/availability` - Kiểm tra xe trống
- `POST /api/car-rentals/{id}/calculate-price` 🔐 - Tính giá thuê

**Partner/Admin Endpoints:**
- `POST /api/car-rentals` 🔐 PARTNER/ADMIN - Tạo xe cho thuê
- `PUT /api/car-rentals/{id}` 🔐 PARTNER/ADMIN - Cập nhật
- `DELETE /api/car-rentals/{id}` 🔐 PARTNER/ADMIN - Xóa

#### 12. **PaymentController** ✅
**Admin Endpoints:**
- `GET /api/payments` 🔐 ADMIN - Tất cả payments
- `PUT /api/payments/{id}` 🔐 ADMIN - Cập nhật payment
- `DELETE /api/payments/{id}` 🔐 ADMIN - Xóa payment
- `DELETE /api/payments` 🔐 ADMIN - Xóa tất cả

**User Endpoints:**
- `POST /api/payments/initiate` 🔐 Authenticated - Khởi tạo thanh toán
- `POST /api/payments/{id}/refund` 🔐 Owner/ADMIN - Hoàn tiền
- `POST /api/payments/{id}/verify` 🔐 Owner/ADMIN - Xác thực
- `GET /api/payments/{id}` 🔐 Owner/ADMIN - Chi tiết payment
- `GET /api/payments/booking/{bookingId}` 🔐 Owner/ADMIN - Payment theo booking
- `GET /api/payments/user/{userId}` 🔐 Owner/ADMIN - Payments của user

**Public Endpoint:**
- `POST /api/payments/callback/{gateway}` - Callback từ cổng thanh toán

#### 13. **PromotionController** ✅
**Public/User Endpoints:**
- `GET /api/promotions` - Tất cả promotions
- `GET /api/promotions/{id}` - Chi tiết promotion
- `GET /api/promotions/code/{code}` - Lấy theo mã code
- `GET /api/promotions/category/{category}` - Theo danh mục
- `GET /api/promotions/destination/{destination}` - Theo điểm đến
- `GET /api/promotions/featured` - Promotions nổi bật
- `GET /api/promotions/active` - Promotions đang active
- `GET /api/promotions/active/category/{category}` - Active theo category
- `GET /api/promotions/expiring` - Sắp hết hạn (days param)
- `GET /api/promotions/newest` - Mới nhất
- `POST /api/promotions/validate` 🔐 - Validate mã code
- `POST /api/promotions/apply/{code}` 🔐 - Áp dụng promotion
- `GET /api/promotions/calculate-discount` 🔐 - Tính discount

**Admin Endpoints:**
- `POST /api/promotions` 🔐 ADMIN - Tạo promotion
- `PUT /api/promotions/{id}` 🔐 ADMIN - Cập nhật
- `DELETE /api/promotions/{id}` 🔐 ADMIN - Xóa

#### 14. **ReviewCommentController** ✅
**Public Endpoints:**
- `GET /api/reviews/{id}` - Chi tiết review
- `GET /api/reviews` - Reviews đã duyệt theo target (params: targetType, targetId)

**User Endpoints:**
- `GET /api/reviews/my-reviews` 🔐 USER - Reviews của tôi
- `POST /api/reviews` 🔐 USER - Tạo review
- `PUT /api/reviews/{id}` 🔐 USER - Cập nhật review của tôi
- `DELETE /api/reviews/{id}` 🔐 USER - Xóa review của tôi

**Partner Endpoints:**
- `POST /api/reviews/{id}/respond` 🔐 PARTNER - Vendor phản hồi review

**Admin Endpoints:**
- `GET /api/reviews/admin/all` 🔐 ADMIN - Tất cả reviews
- `GET /api/reviews/admin/pending` 🔐 ADMIN - Reviews chờ duyệt
- `PUT /api/reviews/admin/{id}/moderate` 🔐 ADMIN - Duyệt/Từ chối review
- `DELETE /api/reviews/admin/{id}` 🔐 ADMIN - Xóa review
- `DELETE /api/reviews/admin/all` 🔐 ADMIN - Xóa tất cả

#### 15. **TravelGuideController** ✅
**Public Endpoints:**
- `GET /api/travelguides` - Tất cả travel guides
- `GET /api/travelguides/{id}` - Chi tiết (tự động tăng views)
- `GET /api/travelguides/destination/{destination}` - Theo điểm đến
- `GET /api/travelguides/country/{country}` - Theo quốc gia
- `GET /api/travelguides/continent/{continent}` - Theo châu lục
- `GET /api/travelguides/category/{category}` - Theo category
- `GET /api/travelguides/type/{type}` - Theo type
- `GET /api/travelguides/published` - Guides đã publish
- `GET /api/travelguides/featured` - Guides nổi bật
- `GET /api/travelguides/popular` - Guides phổ biến
- `GET /api/travelguides/tag/{tag}` - Theo tag

**User Endpoints:**
- `GET /api/travelguides/author/{authorId}` 🔐 Authenticated
- `PUT /api/travelguides/{id}/like` 🔐 Authenticated - Like guide
- `PUT /api/travelguides/{id}/unlike` 🔐 Authenticated - Unlike guide

**Partner/Admin Endpoints:**
- `POST /api/travelguides` 🔐 PARTNER/ADMIN - Tạo guide
- `PUT /api/travelguides/{id}` 🔐 PARTNER/ADMIN - Cập nhật
- `DELETE /api/travelguides/{id}` 🔐 PARTNER/ADMIN - Xóa

#### 16. **VisaArticleController** ✅
**Public Endpoints:**
- `GET /api/visa-articles` - Tất cả visa articles
- `GET /api/visa-articles/{id}` - Chi tiết article
- `GET /api/visa-articles/country/{country}` - Theo quốc gia
- `GET /api/visa-articles/continent/{continent}` - Theo châu lục
- `GET /api/visa-articles/category/{category}` - Theo category
- `GET /api/visa-articles/popular` - Articles phổ biến

**Admin Endpoints:**
- `POST /api/visa-articles` 🔐 ADMIN - Tạo article
- `PUT /api/visa-articles/{id}` 🔐 ADMIN - Cập nhật
- `DELETE /api/visa-articles/{id}` 🔐 ADMIN - Xóa

#### 17. **UserVoucherController** ✅
**Base:** `/api/v1/user-vouchers` 🔐 All Authenticated
- `POST /save` - Lưu voucher vào ví
- `GET /` - Tất cả vouchers của user
- `GET /available` - Vouchers khả dụng
- `GET /used` - Vouchers đã dùng
- `GET /statistics` - Thống kê vouchers
- `POST /validate` - Validate voucher trước khi dùng
- `POST /use` - Đánh dấu voucher đã dùng
- `DELETE /{voucherCode}` - Xóa voucher khỏi ví

#### 18. **LocationController** ✅
**Public/User Endpoints:**
- `GET /api/locations` - Danh sách (có pagination, sort)
- `GET /api/locations/featured` - Locations nổi bật
- `GET /api/locations/search` - Tìm kiếm (query param)
- `GET /api/locations/{id}` - Chi tiết location

**Admin/Partner Endpoints:**
- `POST /api/locations` 🔐 PARTNER/ADMIN - Tạo location
- `PUT /api/locations/{id}` 🔐 ADMIN - Cập nhật
- `DELETE /api/locations/{id}` 🔐 ADMIN - Xóa
- `DELETE /api/locations` 🔐 ADMIN - Xóa tất cả

#### 19. **AdvertisementController** ✅
**User Endpoints:**
- `GET /api/advertisements` 🔐 Authenticated - Tất cả ads (filter by position)
- `GET /api/advertisements/{id}` 🔐 Authenticated - Chi tiết ad

**Public Tracking:**
- `POST /api/advertisements/{id}/track-impression` - Track lượt hiển thị
- `POST /api/advertisements/{id}/track-click` - Track lượt click

**Partner/Admin Endpoints:**
- `POST /api/advertisements` 🔐 PARTNER/ADMIN - Tạo ad
- `PUT /api/advertisements/{id}` 🔐 PARTNER/ADMIN - Cập nhật
- `DELETE /api/advertisements/{id}` 🔐 PARTNER/ADMIN - Xóa
- `DELETE /api/advertisements` 🔐 ADMIN - Xóa tất cả

#### 20. **AdminBookingController** ✅
**Base:** `/api/admin/bookings` 🔐 ADMIN Only
- `GET /` - Tất cả bookings
- `GET /statistics` - Thống kê bookings
- `PUT /{id}` - Cập nhật booking
- `DELETE /{id}` - Xóa booking

#### 21. **AdminWalletController** ✅
**Base:** `/api/v1/admin/wallets` 🔐 ADMIN Only
- `GET /` - Danh sách tất cả ví (pagination, search)
- `GET /{userId}` - Chi tiết ví của user
- `PUT /refunds/{transactionId}/approve` - Duyệt hoàn tiền
- `PUT /refunds/{transactionId}/reject` - Từ chối hoàn tiền
- `POST /refunds` - Tạo refund thủ công
- `GET /refunds/pending` - Danh sách refund chờ xử lý
- `PUT /{userId}/status` - Khóa/Mở khóa ví
- `GET /{userId}/transactions` - Lịch sử giao dịch của user

#### 22. **VendorBookingController** ✅
**Base:** `/api/vendor/bookings` 🔐 PARTNER Only
- `GET /` - Bookings của vendor
- `POST /{id}/confirm` - Xác nhận booking
- `POST /{id}/reject` - Từ chối booking

#### 23. **UserController** ✅
**Base:** `/api/users` 🔐 ADMIN Only
- `GET /` - Tất cả users
- `GET /{id}` - Chi tiết user
- `POST /` - Tạo user mới
- `PUT /{id}` - Cập nhật user
- `DELETE /{id}` - Xóa user
- `DELETE /` - Xóa tất cả users

#### 24. **TestTravelGuideController** ⚠️
- Test controller - BỎ QUA (không cần tích hợp)

---

## 📱 PHASE 2: PHÂN TÍCH FRONTEND PAGES

### **Cần kết nối:**

#### Profile Module (9 pages)
- ✅ ProfilePage.tsx - ĐÃ KẾT NỐI
- ✅ SettingsPage.tsx - ĐÃ KẾT NỐI  
- ✅ UserWalletPage.tsx - ĐÃ KẾT NỐI
- ⏳ TopUpWalletPage.tsx
- ⏳ UserVouchersPage.tsx
- ⏳ SavedItemsPage.tsx
- ⏳ SavedPaymentMethodsPage.tsx
- ⏳ PaymentMethodsPage.tsx
- ⏳ BookingHistoryPage.tsx

#### Hotels Module
- ⏳ HotelListPage.tsx
- ⏳ HotelDetailPage.tsx

#### Flights Module
- ⏳ FlightSearchPage.tsx
- ⏳ FlightBookingPage.tsx

#### Activities Module
- ⏳ ActivitiesPage.tsx
- ⏳ ActivityDetailPage.tsx

#### Car Rental Module
- ⏳ CarRentalPage.tsx
- ⏳ CarDetailPage.tsx

#### Visa Module
- ⏳ VisaArticlesPage.tsx
- ⏳ VisaApplicationPage.tsx

#### Travel Guide Module
- ⏳ TravelGuidePage.tsx
- ⏳ GuideDetailPage.tsx

#### Admin Module
- ⏳ AdminDashboard
- ⏳ AdminBookings
- ⏳ AdminWallet

#### Vendor Module
- ⏳ VendorDashboard
- ⏳ VendorBookings

---

## 🚀 KẾ HOẠCH THỰC HIỆN

### **Ưu tiên 1: Core User Features**
1. ✅ Authentication (Login/Register)
2. ✅ Profile Management
3. ✅ Wallet & Transactions
4. ⏳ Booking History
5. ⏳ Vouchers

### **Ưu tiên 2: Booking Features**
6. ⏳ Hotels Search & Booking
7. ⏳ Flights Search & Booking
8. ⏳ Activities Booking
9. ⏳ Car Rental

### **Ưu tiên 3: Content Features**
10. ⏳ Travel Guide
11. ⏳ Visa Articles
12. ⏳ Promotions

### **Ưu tiên 4: Admin & Vendor**
13. ⏳ Admin Dashboard
14. ⏳ Vendor Management

---

## 📝 GHI CHÚ

**Tiến độ hiện tại:** 
- ✅ **PHASE 1 HOÀN THÀNH:** Đã phân tích 24/24 Controllers (100%)
- 🔄 **PHASE 2 BẮT ĐẦU:** Phân tích Frontend pages và xác định APIs cần thiết
- ⏳ **PHASE 3 PENDING:** Kết nối tuần tự từng module

**Tổng kết Backend APIs:**
- **Tổng số Controllers:** 24 (1 test controller bỏ qua)
- **Tổng số Endpoints:** ~150+ APIs
- **Public APIs:** ~60+ endpoints
- **Authenticated APIs:** ~50+ endpoints  
- **Admin APIs:** ~25+ endpoints
- **Partner/Vendor APIs:** ~15+ endpoints

**Bước tiếp theo:** 
1. ✅ Đọc và phân tích 24 Controllers - **HOÀN THÀNH**
2. 🔄 Phân tích Frontend pages và components
3. ⏳ Tạo API mapping matrix
4. ⏳ Thực hiện kết nối tuần tự theo ưu tiên

---

## ⚠️ VẤN ĐỀ CẦN GIẢI QUYẾT

- [ ] CORS configuration
- [ ] JWT token refresh
- [ ] Error handling standardization
- [ ] API response format consistency
- [ ] File upload handling (avatars, documents)
- [ ] Pagination implementation
- [ ] Search & filter parameters

