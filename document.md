# Tài liệu Giải thích Code (Project Documentation)

Tài liệu này giải thích chi tiết cấu trúc code, chức năng của từng file và các hàm quan trọng trong dự án Wanderlust, bao gồm Frontend (React, Tailwind) và Backend (Spring Boot).

---

# FRONTEND (ReactJS + TailwindCSS)

## 1. File: `src/MainApp.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/MainApp.tsx`

### Ý đồ & Chức năng:
Đây là **Root Component** quản lý routing và session toàn cục.
*   **Routing**: Sử dụng `Outlet` để render các trang con.
*   **Session**: Tự động khôi phục đăng nhập từ `tokenService` khi F5 trang.

### Giải thích Code:
*   **`useEffect` (Restore Session)**: Logic quan trọng kiểm tra token trong LocalStorage. Nếu tồn tại, set lại state `userRole` để user không bị out, ngược lại clear session rác.
*   **`useLocation`**: Hook lấy URL hiện tại để quyết định ẩn/hiện Header (trang Login không cần Header).

---

## 2. File: `src/pages/Home/HomePage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Home/HomePage.tsx`

### Ý đồ & Chức năng:
**Trang chủ (Landing Page)** với mục tiêu điều hướng người dùng và Marketing.
*   Hiển thị Banner tìm kiếm (`HeroSearchHub`).
*   Gợi ý địa điểm nổi bật (`Featured Destinations`) và Tour (`Popular Tours`).

### Giải thích Code:
*   **`featuredLocations` & `fetchLocations`**: Gọi API lấy danh sách thành phố (`locationApi.getLocationsByType`) và render ra thẻ Card sử dụng Tailwind Grid (`grid-cols-1 md:grid-cols-3`).
*   **`HeroSearchHub`**: Component con chứa thanh tìm kiếm đa năng (Vé máy bay, Khách sạn...). Khi search, gọi hàm `handleSearch` để giả lập loading trước khi chuyển trang.
*   **`ImageWithFallback`**: Component tiện ích tự động thay thế ảnh bị lỗi bằng ảnh mặc định.

---

## 3. File: `src/pages/Auth/LoginPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Auth/LoginPage.tsx`

### Ý đồ & Chức năng:
Trang **Đăng nhập & Đăng ký** tích hợp (Sliding Panel).
*   Cho phép user đăng nhập bằng Email/Password hoặc Google/Facebook.
*   Đăng ký tài khoản mới với đầy đủ thông tin (Họ tên, SĐT, Ngày sinh...).

### Giải thích Code:
*   **Sliding Animation**:
    *   Sử dụng CSS Transform (`translate-x`) và Tailwind transition classes (`duration-1000 ease-in-out`) để tạo hiệu ứng trượt mượt mà giữa form Login và Register.
*   **`handleSignIn`**:
    *   Gọi `authApi.login(email, password)`.
    *   Thành công: Lưu Token vào LocalStorage qua `tokenService.setToken()`.
    *   Mapping Role: Chuyển đổi Role từ Backend (enum) sang Frontend Role để phân quyền UI.
*   **`handleSignUp`**:
    *   Thu thập dữ liệu từ nhiều Input state (`firstName`, `lastName`, `gender`...).
    *   Gọi `authApi.register()` để tạo user mới và tự động đăng nhập ngay sau đó.
*   **Form Validation**: Kiểm tra password match (`password === confirmPassword`) và các thẻ `<Input required />` của HTML5.

---

## 4. File: `src/pages/Flights/FlightsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Flights/FlightsPage.tsx`

### Ý đồ & Chức năng:
Trang **Tìm kiếm Chuyến bay** chi tiết.
*   Form tìm kiếm nâng cao: Điểm đi/đến, Ngày, Số lượng khách, Hạng vé.
*   Hiển thị các chuyến bay trong ngày (`Today's Flights`).

### Giải thích Code:
*   **Search Form Logic**:
    *   **`Popover` & `Command`**: Sử dụng UI Component phức tạp của shadcn/ui để làm dropdown chọn sân bay có khả năng filter/search (`CommandInput`).
    *   **Logic Date Picker**: Giới hạn không cho chọn ngày quá khứ. Nếu "Khứ hồi" (`round-trip`), ngày về phải sau ngày đi.
*   **`handleSearch`**:
    *   Validation: Kiểm tra điểm đi/đến có trùng nhau không.
    *   Gọi `flightApi.searchFlights(...)` hai lần nếu là khứ hồi (Outbound & Return).
    *   Chuyển hướng sang trang Chi tiết (`flight-detail`) và truyền toàn bộ kết quả search qua state của Router (`onNavigate`).
*   **`handleSaveVoucher`**:
    *   Tính năng lưu Voucher vào ví user: Gọi `userVoucherApi.saveToWallet(...)`. Yêu cầu user phải đăng nhập (`isAuthenticated`).

---

## 5. File: `src/pages/Flights/FlightDetailPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Flights/FlightDetailPage.tsx`

### Ý đồ & Chức năng:
Trang **Kết quả tìm kiếm & Chi tiết chuyến bay**.
*   Hiển thị danh sách chuyến bay thỏa mãn tiêu chí tìm kiếm.
*   Bộ lọc nâng cao (Hãng bay, Giờ cất cánh/hạ cánh).
*   Lịch giá vé 7 ngày (7-Day Price Calendar).
*   Xử lý logic chọn vé cho hành trình khứ hồi (Outbound -> Inbound).

### Giải thích Code:
*   **7-Day Price Calendar**:
    *   Sử dụng `flightApi.searchFlightsByDateRange` để lấy giá vé rẻ nhất cho +/- 3 ngày quanh ngày đã chọn.
    *   Hiển thị UI dạng thanh trượt ngang, click vào ngày nào sẽ tự động search lại (`setSelectedDay`).
*   **Logic Khứ hồi (`round-trip`)**:
    *   State `flightLeg`: Kiểm soát đang chọn chiều đi (`outbound`) hay chiều về (`inbound`).
    *   Nút chọn chuyến bay: Nếu là chiều đi, lưu chuyến vào `outboundFlight` và chuyển `flightLeg` sang `inbound`. Nếu là chiều về, điều hướng sang trang Review (`flight-review`).
*   **Client-side Filtering**:
    *   Dữ liệu được fetch 1 lần từ Backend, sau đó filtering (theo giờ, hãng bay) được thực hiện ở Frontend (`filteredAndSortedFlights`) để tăng tốc độ phản hồi UX.

---

## 6. File: `src/pages/Flights/SeatSelectionPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Flights/SeatSelectionPage.tsx`

### Ý đồ & Chức năng:
Trang **Chọn ghế ngồi** trực quan.
*   Mô phỏng sơ đồ máy bay (Fuselage).
*   Phân loại ghế theo hạng (Economy, Business, First) và trạng thái (Còn trống, Đã đặt, Đang chọn).

### Giải thích Code:
*   **Visual Seat Map**:
    *   Sử dụng CSS Grid/Flexbox để vẽ sơ đồ ghế.
    *   Logic `getSeatColor`: Thay đổi màu sắc dựa trên `cabinClass` và `status`.
    *   Hiệu ứng `HoverCard`: Khi rê chuột vào ghế, hiển thị popup thông tin chi tiết (Giá tiền, tiện nghi: ổ điện, wifi, độ ngả lưng...).
*   **Validation**:
    *   Đảm bảo user chọn đủ số lượng ghế tương ứng với số lượng hành khách (`requiredSeatsCount`).
    *   Không cho chọn ghế đã có người đặt (`seat.status !== 'AVAILABLE'`).

---

## 7. File: `src/pages/Hotels/HotelLandingPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Hotels/HotelLandingPage.tsx`

### Ý đồ & Chức năng:
**Trang chủ phân hệ Khách sạn**.
*   Form tìm kiếm phòng chuyên biệt (Địa điểm, Ngày Check-in/out, Số phòng/Người).
*   Hiển thị Ưu đãi khách sạn (Vouchers).
*   Gợi ý điểm đến trong nước và quốc tế.

### Giải thích Code:
*   **Search Form UI**:
    *   Sử dụng **Popover** kết hợp **Calendar** (của thư viện `shadcn/ui`) để chọn ngày. Giới hạn `disabled` cho ngày quá khứ và ngày check-out phải sau check-in.
    *   **User/Room Selector**: Panel điều chỉnh số lượng người lớn, trẻ em, phòng.
*   **Data Fetching**:
    *   `fetchLocations`: Lấy danh sách địa điểm có khách sạn từ Backend (`hotelApi.getHotelLocations`).
    *   `hotelApi.getActiveByCategory('hotel')`: Lấy danh sách Voucher active để hiển thị.

---

## 8. File: `src/pages/Hotels/HotelDetailPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Hotels/HotelDetailPage.tsx`

### Ý đồ & Chức năng:
Trang **Chi tiết Khách sạn**.
*   Hiển thị thông tin chi tiết (Ảnh, Mô tả, Tiện nghi).
*   Danh sách phòng trống với các tùy chọn (Ăn sáng, Hủy miễn phí).
*   Tính toán giá dự kiến.

### Giải thích Code:
*   **Data Fetching**: Sử dụng `Promise.all` để fetch song song thông tin khách sạn (`getHotelById`) và danh sách phòng (`getHotelRooms`), giảm thời gian chờ.
*   **Price Logic**:
    *   `lowestDisplayPrice`: Tự động tìm giá thấp nhất trong các phòng khả dụng để hiển thị "Giá từ...".
    *   `taxAndFeesMultiplier`: Tạm thời hardcode 10% thuế phí để tính giá hiển thị.
*   **Room Filtering**: Filter phòng theo các tiêu chí (Hủy miễn phí, Giường lớn...) ngay tại client (`useMemo`) để trải nghiệm mượt mà.

---

## 9. File: `src/pages/Booking/BookingDetailsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/BookingDetailsPage.tsx`

### Ý đồ & Chức năng:
Trang **Nhập thông tin đặt chỗ**.
*   Form nhập thông tin hành khách (động theo số lượng người lớn/trẻ em).
*   Thông tin liên hệ.
*   Tóm tắt giá tiền (Price Breakdown).

### Giải thích Code:
*   **Dynamic Form**: State `passengerForms` là một mảng object, được khởi tạo dựa trên số lượng hành khách (`passengers.adults`, `children`...).
*   **Validation**: Hàm `validateAndContinue` kiểm tra kỹ lưỡng:
    *   Thông tin bắt buộc của từng hành khách.
    *   Định dạng Email/SĐT (Regex).
    *   Checkbox đồng ý điều khoản.
*   **Price Calculation**: Tự động tính tổng tiền dựa trên loại vé và số lượng khách, cộng thêm thuế phí trước khi chuyển sang thanh toán.

---

## 10. File: `src/pages/Booking/CheckoutPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/CheckoutPage.tsx`

### Ý đồ & Chức năng:
Trang **Thanh toán**.
*   Chọn phương thức thanh toán (Ví Wanderlust, Stripe, MoMo...).
*   Khởi tạo giao dịch thanh toán.

### Giải thích Code:
*   **Payment Flow**:
    *   Gọi `initiatePayment` với thông tin booking và phương thức thanh toán.
    *   Nếu trả về `paymentUrl` (ví dụ Stripe/MoMo), redirect user sang trang thanh toán của bên thứ 3 (`window.location.href`).
    *   Nếu thanh toán bằng Ví nội bộ, chuyển hướng ngay đến trang xác nhận (`confirmation`).
*   **UI/UX**: State `loading` và `error` để hiển thị trạng thái xử lý giao dịch rõ ràng.

---

## 11. File: `src/pages/Booking/ConfirmationPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/ConfirmationPage.tsx`

### Ý đồ & Chức năng:
Trang **Xác nhận đặt chỗ thành công** (cho trường hợp thanh toán Ví hoặc đặt trước trả sau).
*   Thông báo đặt chỗ thành công với mã đặt chỗ (`Booking Reference`).
*   Hướng dẫn bước tiếp theo (Check email, Giấy tờ tùy thân).

### Giải thích Code:
*   **Booking Reference**: Tạo mã đặt chỗ giả lập `WL + Timestamp` để hiển thị ngay cho người dùng.
*   **Dynamic UI**: Sử dụng switch-case (`getBookingTypeInfo`) để thay đổi Icon và Màu sắc chủ đạo tùy theo loại dịch vụ (Máy bay: Xanh dương, Khách sạn: Tím...).
*   **Payment Info**: Hiển thị bảng tóm tắt phương thức thanh toán và số tiền đã trừ (nếu có).

---

## 12. File: `src/pages/Booking/PaymentCallbackPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/PaymentCallbackPage.tsx`

### Ý đồ & Chức năng:
Trang **Trung gian xử lý kết quả** từ cổng thanh toán (Stripe/MoMo).
*   User được redirect về đây sau khi thanh toán ở trang bên thứ 3.
*   Gọi API kiểm tra trạng thái thanh toán và điều hướng tiếp.

### Giải thích Code:
*   **Query Params Parsing**: Đọc các tham số URL (`success`, `canceled`, `booking_id`, `payment_id`) để xác định kết quả sơ bộ.
*   **Verification**:
    *   Gọi `paymentApi.getPaymentStatus` để xác thực server-side chắc chắn giao dịch đã thành công.
    *   Cơ chế `sessionStorage` (`PENDING_PAYMENT_KEY`) để fallback dữ liệu nếu URL params bị thiếu.
    *   Nếu thành công -> Redirect sang `PaymentSuccessPage`.
    *   Nếu thất bại -> Hiển thị lỗi và nút Thử lại.

---

## 13. File: `src/pages/Booking/PaymentSuccessPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/PaymentSuccessPage.tsx`

### Ý đồ & Chức năng:
Trang **Thành công cuối cùng** của luồng thanh toán Online.
*   Xác nhận giao dịch hoàn tất.
*   Kích hoạt cập nhật trạng thái Booking về phía Backend lần cuối (Double-check).

### Giải thích Code:
*   **Double-Confirmation Logic**:
    *   Ngoài việc hiển thị, trang này còn gọi `paymentApi.confirmStripeSuccess` và `bookingApi.updateBooking` để đảm bảo hệ thống cập nhật trạng thái `COMPLETED` ngay cả khi Webhook của cổng thanh toán bị chậm.
*   **UI/UX**: Hiển thị chi tiết Mã giao dịch, Số tiền, Phương thức để user chụp ảnh màn hình làm bằng chứng.

---

## 14. File: `src/pages/Booking/PaymentCancelPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/PaymentCancelPage.tsx`

### Ý đồ & Chức năng:
Trang đơn giản thông báo **Giao dịch đã bị hủy**.
*   Hiển thị khi người dùng bấm "Hủy" hoặc "Back" từ cổng thanh toán.

---

## 15. File: `src/pages/Hotels/HotelListPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Hotels/HotelListPage.tsx`

### Ý đồ & Chức năng:
Trang **Kết quả tìm kiếm Khách sạn** (Danh sách).
*   Hiển thị danh sách khách sạn theo tiêu chí tìm kiếm.
*   Bộ lọc nâng cao (Sidebar Filter).
*   Chuyển đổi giao diện (Lưới/Danh sách).

### Giải thích Code:
*   **Data Fetching (`useEffect`)**:
    *   Nhận `searchParams` từ trang chủ.
    *   Parse ngày tháng từ định dạng `dd/MM/yyyy` sang `yyyy-MM-dd` để gọi Backend API (`hotelApi.searchHotels`).
    *   Mapping dữ liệu từ Backend DTO sang cấu trúc Frontend Interface chuyên biệt để hiển thị.
*   **Client-side Filtering & Sorting**:
    *   **Filtering**: Logic lọc `handleFilterChange` khá phức tạp, chạy trên mảng `hotels` (in-memory) để lọc theo Giá, Tiện nghi, Loại hình...
    *   **Sorting**: Sắp xếp theo Giá thấp/cao hoặc Rating ngay lập tức khi user chọn dropdown (`useMemo`/`useEffect`).

---

## 16. File: `src/pages/Hotels/HotelReviewPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Hotels/HotelReviewPage.tsx`

### Ý đồ & Chức năng:
Trang **Xem lại & Điền thông tin Đặt phòng**.
*   Bước đệm quan trọng trước khi thanh toán.
*   Nhập thông tin liên hệ và thông tin khách ở.
*   Chọn các dịch vụ bổ sung (Bảo hiểm, Vé tham quan...).
*   Gửi yêu cầu tạo Booking (`PENDING`) xuống Backend.

### Giải thích Code:
*   **Auto-fill User Data**: Tự động điền tên, email/sđt nếu user đã đăng nhập (`profileApi.getCurrentUser`).
*   **Booking Payload Construction**:
    *   Hàm `createBooking` xây dựng một object payload JSON khổng lồ chứa đầy đủ mọi thông tin: `guestInfo`, `specialRequests` (nối chuỗi), `dates`, `pricing`.
*   **Add-ons Calculation**: Tính toán lại tổng tiền nếu user chọn thêm Bảo hiểm hoặc Vé Tour (`totalPrice + totalAddons`).

---

## 17. File: `src/pages/Booking/PaymentMethodsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Booking/PaymentMethodsPage.tsx`

### Ý đồ & Chức năng:
Trang **Chọn phương thức thanh toán & Áp dụng Voucher**.
*   Là cổng thanh toán chung cho mọi loại hình dịch vụ (Flight, Hotel, Car...).
*   Xử lý Voucher giảm giá và tính lại tiền.
*   Gọi API thanh toán cuối cùng.

### Giải thích Code:
*   **Abstract Pricing Logic (`subtotalAmount`)**: Sử dụng `useMemo` để chuẩn hóa logic lấy giá tiền từ nhiều nguồn dữ liệu khác nhau (Flight, Hotel...) về một biến số chung `subtotalAmount` để xử lý thanh toán thống nhất.
*   **Voucher Logic**:
    *   Tải voucher khả dụng từ API (`promotionApi.getActiveByCategory`).
    *   Tính toán logic giảm giá (`calculateDiscount`): Hỗ trợ giảm theo % hoặc số tiền cố định.
*   **Payment Execution**:
    *   Chuẩn bị payload thanh toán kèm thông tin Voucher đã dùng.
    *   Nếu là **Wallet**: Trừ tiền ngay và chuyển trang Success.
    *   Nếu là **Stripe**: Redirect sang URL đưọc trả về.

---

## 18. File: `src/pages/Profile/ProfilePage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Profile/ProfilePage.tsx`

### Ý đồ & Chức năng:
Trang **Thông tin Cá nhân & Hạng thành viên**.
*   Hiển thị thông tin user (Họ tên, Passport, Sđt).
*   Hiển thị Hạng thành viên (Bronze/Silver/Gold/Platinum) và điểm tích lũy.
*   Cho phép cập nhật Avatar và thông tin cá nhân.

### Giải thích Code:
*   **Avatar Management**:
    *   Cung cấp một bộ avatar mặc định để user chọn nhanh.
    *   Hỗ trợ nhập URL ảnh avatar từ bên ngoài.
*   **Membership Logic**:
    *   Hiển thị thanh tiến độ (`ProgressBar`) để user biết còn bao nhiêu điểm nữa thì lên hạng tiếp theo.
    *   Logic tính toán `%` dựa trên các mốc điểm (5000, 15000, 30000).

---

## 19. File: `src/pages/Profile/BookingHistoryPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Profile/BookingHistoryPage.tsx`

### Ý đồ & Chức năng:
Trang **Lịch sử Đặt chỗ**.
*   Liệt kê danh sách Booking theo trạng thái: Sắp tới (Upcoming), Đã hoàn thành (Completed), Đã hủy (Cancelled).
*   Thực hiện các hành động: Hủy phòng, Hoàn tiền, Viết đánh giá.

### Giải thích Code:
*   **Data Transformation (`transformBookingData`)**:
    *   Hàm quan trọng để chuẩn hóa dữ liệu Booking thô sơ từ Backend (vốn lưu thông tin chi tiết dạng text trong `specialRequests`) thành object struct rõ ràng cho Frontend hiển thị (Title, Subtitle, Image...).
    *   Ví dụ: Parse chuỗi `Flight: VN123 to Hanoi` để lấy ra địa điểm và mã chuyến bay.
*   **Cancellation Flow**:
    *   Kiểm tra xem booking đã thanh toán chưa. Nếu chưa -> Hủy ngay.
    *   Nếu đã thanh toán -> Gọi API hủy kèm yêu cầu hoàn tiền (`requestRefund`).
    *   Tự động tính toán số tiền được hoàn (ví dụ 80%) dựa trên chính sách.
*   **Completion Confirmation**:
    *   Nút "Xác nhận hoàn thành" chỉ hiện ra khi đã qua ngày kết thúc tour, giúp hệ thống biết để giải ngân cho Vendor.

---

## 20. File: `src/pages/Profile/UserWalletPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Profile/UserWalletPage.tsx`

### Ý đồ & Chức năng:
Trang **Ví điện tử Wanderlust**.
*   Xem số dư, tổng nạp, tổng chi.
*   Lịch sử giao dịch (Nạp/Rút/Thanh toán/Hoàn tiền).
*   Chức năng Nạp tiền (Top-up).

### Giải thích Code:
*   **Helper Functions**: `getTypeIcon`, `getTypeLabel` giúp visual hóa loại giao dịch (Credit màu xanh, Debit màu đỏ).
*   **Real-time Updates**: Logic kiểm tra giao dịch mới (`last_transaction_check`) để hiện thông báo đẩy nếu có biến động số dư khi user đang online.

---

## 21. File: `src/pages/CarRental/CarRentalListPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/CarRental/CarRentalListPage.tsx`

### Ý đồ & Chức năng:
Trang **Tìm kiếm & Thuê xe tự lái/có tài**.
*   Form tìm kiếm địa điểm nhận/trả xe, ngày giờ.
*   Hiển thị danh sách xe với bộ lọc (Loại xe, Số chỗ, Giá).

### Giải thích Code:
*   **Search Flow**:
    *   `fetchLocations`: Lấy danh sách địa điểm từ API để nạp vào dropdown `Popover/Command` của địa điểm nhận xe.
    *   `swapPickupDropoff`: Nút đảo chiều tiện lợi giữa điểm nhận và điểm trả.
*   **Filter Logic (`filteredCars`)**:
    *   Thực hiện lọc phía Client (In-memory filtering) trên danh sách `allCars` đã fetch về. Lọc đồng thời theo `type`, `capacity`, `price`, và `location` (dựa trên tên xe/hãng xe).
*   **Backend Integration**: Sử dụng `carRentalApi.getAllCars()` để lấy dữ liệu xe thực từ DB thay vì mock data.

---

## 22. File: `src/pages/CarRental/CarDetailPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/CarRental/CarDetailPage.tsx`

### Ý đồ & Chức năng:
Trang **Chi tiết Xe thuê**.
*   Xem thông tin kỹ thuật, hình ảnh, chính sách bảo hiểm.
*   Gợi ý các xe tương tự.
*   Tính toán giá thuê tạm tính.

### Giải thích Code:
*   **Recommended Cars Algorithm**:
    *   Logic `fetchRecommendedCars` khá thông minh: Lấy danh sách xe khác, ưu tiên xe CÙNG LOẠI (`sameTypeCars`), sau đó shuffle ngẫu nhiên và lấy 3 chiếc. Giúp tăng khả năng upsell.
*   **Data Structure**: Map dữ liệu phẳng từ Backend (`brand`, `model`, `seats`...) về cấu trúc Frontend Rich UI (thêm các field giả lập `features` nếu thiếu, fallback ảnh) để đảm bảo giao diện luôn đẹp.

---

## 23. File: `src/pages/Activities/ActivitiesPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Activities/ActivitiesPage.tsx`

### Ý đồ & Chức năng:
Trang **Danh sách Hoạt động giải trí (Tours, Tickets)**.
*   Tìm kiếm theo địa điểm, ngày, thể loại (Category).
*   Hiển thị dạng lưới (Grid) với hình ảnh hấp dẫn và giá tiền.

### Giải thích Code:
*   **Mapping Categories**:
    *   Hàm `mapCategory` chuyển đổi enum từ Backend (`ATTRACTION`, `TOUR`...) sang ID category của Frontend (`attractions`, `tours`...) để hiển thị đúng tab và icon.
*   **Advanced Search UI**:
    *   Sử dụng hệ thống `Popover` phức tạp chứa bên trong là danh sách địa điểm phổ biến (`destinations`) và bộ chọn số người (`adults/children`).
*   **Sorting**: Hỗ trợ sort client-side theo Giá (thấp-cao) và Rating, Reviews.

---

## 24. File: `src/pages/Activities/ActivityDetailPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Activities/ActivityDetailPage.tsx`

### Ý đồ & Chức năng:
Trang **Chi tiết Hoạt động**.
*   Thông tin chi tiết (Lịch trình, bao gồm/không bao gồm).
*   Chọn ngày và số lượng vé.
*   Tính tổng tiền theo đầu người.

### Giải thích Code:
*   **Pricing Logic**:
    *   Cập nhật realtime giá tổng (`totalPrice`) khi user thay đổi số lượng khách (`guestCount`).
*   **Component UI**:
    *   Sử dụng nhiều `Card` nhỏ để phân chia thông tin dễ đọc: Highlights, Cancellation Policy, Included Services.
    *   **Image Gallery**: Grid layout hiển thị 1 ảnh lớn bên trái và 2 ảnh nhỏ bên phải.

---

## 25. File: `src/pages/Profile/UserVouchersPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Profile/UserVouchersPage.tsx`

### Ý đồ & Chức năng:
Trang **Ví Voucher cá nhân**.
*   Quản lý danh sách voucher: Có thể dùng (Available), Đã dùng (Used), Hết hạn (Expired).
*   Lưu voucher mới bằng mã code.
*   Thống kê tổng số tiền đã tiết kiệm.

### Giải thích Code:
*   **Clipboard API (`handleCopyCode`)**:
    *   Sử dụng API hiện đại `navigator.clipboard.writeText` để sao chép mã.
    *   Có cơ chế Fallback (tạo thẻ `textarea` ẩn) để hỗ trợ các trình duyệt cũ chặn API clipboard.
*   **Smart Notification**: Logic kiểm tra xem có voucher mới được tặng hay không (`latestGifted`) so với lần kiểm tra trước (`last_voucher_check`) để hiện thông báo đẩy.
*   **Enriched Voucher Card**:
    *   Component `VoucherCard` hiển thị trực quan trạng thái voucher (làm mờ nếu hết hạn), hiển thị badge "Được tặng".

---

## 26. File: `src/pages/TravelGuide/TravelGuidePage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/TravelGuide/TravelGuidePage.tsx`

### Ý đồ & Chức năng:
**Tạp chí du lịch (Travel Magazine Landing Page)**.
*   Giao diện Magazine hiện đại, tập trung vào hình ảnh đẹp.
*   Phân chia các section: Khám phá Việt Nam, Điểm đến quốc tế, Blog cảm hứng.
*   Điều hướng theo Châu lục (Asia, Europe...).

### Giải thích Code:
*   **Skeleton Loading**: Sử dụng state `loading` để hiển thị spinner trong lúc chờ tải nội dung nặng (ảnh).
*   **Categorization Strategy**: 
    *   Backend trả về list hỗn hợp, Frontend lọc lại (`filter`) theo `type === 'destination'` hoặc `type === 'blog'` để render vào đúng section. Điều này giúp giảm số lượng API request (chỉ cần gọi 1-2 API lấy list rồi phân loại client-side).

---

## 27. File: `src/pages/TravelGuide/GuideDetailPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/TravelGuide/GuideDetailPage.tsx`

### Ý đồ & Chức năng:
Trang **Chi tiết Điểm đến (Destination Guide)**.
*   "One-Stop-Shop" cho một địa điểm: Tích hợp hiển thị Vé máy bay, Khách sạn, Hoạt động vui chơi *liên quan* đến địa điểm đó.
*   Thông tin thắng cảnh, văn hóa.
*   Logic Cross-selling mạnh mẽ.

### Giải thích Code:
*   **Service Integration**:
    *   Mặc dù hiển thị danh sách mockup cho Flight/Hotel (ở version hiện tại), nhưng các nút "Xem tất cả" được gắn sự kiện điều hướng chính xác: `onNavigate("flights", { destination: guide.title })`. Logic này giúp user chuyển sang trang đặt vé với form search đã được điền sẵn điểm đến.
*   **Visual Logic**:
    *   Gallery ảnh thông minh: Tự động sắp xếp layout grid (1 ảnh lớn, 2 ảnh nhỏ) bất kể số lượng ảnh backend trả về (fallback về cover image nếu thiếu ảnh).

---

## 28. File: `src/pages/TravelGuide/TravelArticlePage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/TravelGuide/TravelArticlePage.tsx`

### Ý đồ & Chức năng:
Trang **Bài viết Blog (Article)**.
*   Giao diện đọc bài viết thuần túy (Typography optimized).
*   Chức năng chia sẻ xã hội (Social Share) và Lưu bài viết.
*   Khu vực Call-to-Action (CTA) cuối bài để thúc đẩy đặt dịch vụ.

### Giải thích Code:
*   **Social Sharing**:
    *   Các nút Facebook/Twitter hiện là giả lập (`toast.success`). Nút "Copy Link" hoạt động thật với logic tương tự trang Voucher.
*   **CTA Component**: Khối "Sẵn sàng cho chuyến đi?" sử dụng background gradient nổi bật (`bg-linear-to-r`), chứa 3 nút điều hướng trực tiếp sang 3 dịch vụ cốt lõi (Bay, Ở, Chơi) với tham số `destination` của bài viết.

---

# BACKEND (Spring Boot)

## 1. File: `com.wanderlust.api.controller.AuthController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/AuthController.java`

### Ý đồ & Chức năng:
Controller xử lý xác thực (Auth).
*   Endpoint login/register.
*   Tạo JWT Token.

### Giải thích Code:
*   **`login(@RequestBody LoginRequestDTO)`**:
    *   Sử dụng `userService.authenticate` để verify credentials.
    *   Nếu đúng: Tạo JWT bằng `jwtService.generateToken`.
*   **`register(@RequestBody User)`**:
    *   Ngoài việc lưu user (`userService.registerUser`), Controller này con gọi `walletService.createWalletForNewUser` để tạo ví tiền ảo cho user mới ngay lập tức. Đây là logic nghiệp vụ quan trọng (User mới phải có Ví).

---

## 2. File: `com.wanderlust.api.services.UserService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/UserService.java`

### Ý đồ & Chức năng:
Service xử lý nghiệp vụ User.
*   Mã hóa mật khẩu.
*   CRUD User (Tạo, Sửa, Xóa).
*   Xử lý logic bảo vệ Role Admin.

### Giải thích Code:
*   **`passwordEncoder`**: Inject từ Spring Security. Dùng để hash password (`encode`) trước khi lưu xuống DB và kiểm tra password (`matches`) khi đăng nhập.
*   **`createOauthUser`**: Hàm đặc biệt để xử lý user đăng nhập qua Google/Facebook. Nếu email chưa tồn tại, tự động tạo user mới với password ngẫu nhiên hoặc trống, và cũng tạo Ví cho họ.
*   **Logic `update`**:
    *   Có đoạn code bảo vệ role: Không cho phép user thường tự update lên `ADMIN` và ngược lại. Điều này ngăn chặn lỗ hổng bảo mật leo thang đặc quyền.

---

## 3. File: `com.wanderlust.api.controller.FlightController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/FlightController.java`

### Ý đồ & Chức năng:
Controller cho module Chuyến bay.
*   API Search public cho người dùng.
*   API CRUD quản trị cho Admin.

### Giải thích Code:
*   **Param Binding**: Sử dụng `@RequestParam` với `required=false` cho các tiêu chí lọc (giá, hãng bay), giúp API linh hoạt.
*   **`@PreAuthorize("hasRole('ADMIN')")`**: Bảo vệ các hàm Create/Update/Delete. Chỉ Admin mới có quyền gọi, đảm bảo an toàn dữ liệu.

---

## 4. File: `com.wanderlust.api.services.FlightService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/FlightService.java`

### Ý đồ & Chức năng:
Service chứa logic cốt lõi của việc Tìm kiếm chuyến bay (Search Engine).

### Giải thích Code:
*   **`searchFlights` function (Advanced Filter)**:
    1.  **Repository Search**: Đầu tiên gọi DB để lấy chuyến bay thỏa mãn Tuyến đường (From-To) và Ngày bay.
    2.  **In-Memory Filtering (Java Stream)**: Sau đó dùng Java Stream API để lọc tiếp các tiêu chí phức tạp mà Query DB khó làm hoặc kém hiệu quả:
        *   `filter(f -> airlineCodes.contains(...))`: Lọc hãng bay.
        *   `filter(price...)`: Lọc theo khoảng giá min/max. Lấy giá từ `cabinClasses` (Map cấu trúc dữ liệu phức tạp).
        *   `filter(timeRange...)`: Lọc theo khung giờ (Sáng/Chiều/Tối) bằng cách check `getHour()`.
*   **`updateAvailableSeats`**: Hàm synchronized (hoặc transactional) để trừ số ghế khi có booking mới, ngăn chặn overbooking.

---

## 5. File: `com.wanderlust.api.controller.HotelController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/HotelController.java`

### Ý đồ & Chức năng:
Controller xử lý toàn bộ API liên quan đến Khách sạn.
*   Public: Search, Get Detail, Get Rooms.
*   Vendor/Admin: Quản lý khách sạn (CRUD), Duyệt/Từ chối khách sạn.

### Giải thích Code:
*   **`searchHotels`**: Endpoint quan trọng nhất, nhận vào `HotelSearchCriteria` (DTO chứa các tiêu chí lọc).
*   **`@PreAuthorize` (Security)**:
    *   Các API quản lý (`create`, `update`, `delete`) yêu cầu role `ADMIN` hoặc `VENDOR`.
    *   Riêng `VENDOR` có thêm logic `@webSecurity.isHotelOwner(...)`: Chỉ cho phép chủ khách sạn sửa khách sạn của chính mình.
*   **Workflow Duyệt**:
    *   API `approve`, `reject`, `request-revision`: Admin dùng để kiểm duyệt khách sạn mới đăng ký.

---

## 6. File: `com.wanderlust.api.services.HotelService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/HotelService.java`

### Ý đồ & Chức năng:
Service logic nghiệp vụ Khách sạn.
*   Tìm kiếm & Lọc (Search Engine).
*   Quy trình phê duyệt (Approval Workflow).

### Giải thích Code:
*   **Advanced Filter (Stream API)**:
    *   Logic `searchHotels` thực hiện qua 2 bước:
        1.  Query DB cơ bản (theo Location hoặc lấy All).
        2.  Lọc chi tiết in-memory bằng Java Stream: Star Rating, Price Range (so sánh `lowestPrice`), Amenities (so sánh list `containsAll`), Rating.
*   **`getUniqueLocations`**: Logic aggregation thủ công để nhóm các khách sạn theo Tỉnh/Thành phố và đếm số lượng (`Collectors.groupingBy`), phục vụ cho dropdown location ở Frontend.
*   **Enrich Data**: Hàm `enrichHotelsWithRooms` tự động tính toán giá thấp nhất (`lowestPrice`) của khách sạn dựa trên danh sách phòng `roomRepository` để hiển thị ra danh sách tìm kiếm.

---

## 7. File: `com.wanderlust.api.controller.BookingController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/BookingController.java`

### Ý đồ & Chức năng:
Controller quản lý Booking.
*   Tạo Booking mới.
*   Xử lý Refund, Cancel, Complete.
*   Phân quyền chặt chẽ (`@PreAuthorize`).

### Giải thích Code:
*   **Date Parsing Helper**: Hàm `parseDate` hỗ trợ nhiều định dạng ngày tháng (ISO 8601, dd/MM/yyyy...) để handle input đa dạng từ frontend.
*   **`createBooking`**: Endpoint phức tạp xử lý payload linh động (Map<String, Object>), map dữ liệu sang `BookingDTO` và tự động set type (Flight/Hotel/...).
*   **Refund Workflow**:
    *   `requestRefund`: User yêu cầu.
    *   `approveRefund`: Admin/Vendor duyệt -> Gọi Service xử lý tiền nong.
    *   `rejectRefund`: Admin/Vendor từ chối -> Quay lại trạng thái Confirmed.

---

## 8. File: `com.wanderlust.api.services.BookingService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/BookingService.java`

### Ý đồ & Chức năng:
Service xử lý nghiệp vụ Booking cốt lõi.
*   Vòng đời Booking (Pending -> Confirmed -> Completed/Cancelled).
*   Tích hợp Thanh toán & Chuyển tiền (MoneyTransfer).

### Giải thích Code:
*   **`create`**: Tạo booking code unique (`WL` + timestamp), xác định Vendor ID chủ sở hữu dịch vụ để sau này chia tiền.
*   **Refund Logic (`requestRefund`)**: Kiểm tra Deadline hoàn tiền (ví dụ: chỉ cho phép trong vòng 24h sau khi kết thúc chuyến đi).
*   **`approveRefund`**: Tích hợp với `MoneyTransferService` để trừ tiền Vendor/Admin và trả lại ví User. Transactional đảm bảo tiền không bị mất.
*   **`completeBooking`**: User xác nhận đã sử dụng dịch vụ xong. Lúc này hệ thống mới "giải ngân" tiền cho Vendor (`processBookingCompletionTransfer`).
*   **Statistics**: Hàm `getStatistics` sử dụng Java Stream để tính toán doanh thu, số lượng booking theo trạng thái/loại hình, phục vụ Dashboard.

---

## 9. File: `com.wanderlust.api.controller.PaymentController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/PaymentController.java`

### Ý đồ & Chức năng:
Controller quản lý Giao dịch thanh toán.
*   Khởi tạo thanh toán (`initiate`).
*   Xử lý Callback/Webhook.
*   API Confirm thủ công từ Frontend.

### Giải thích Code:
*   **`initiatePayment`**: Endpoint bắt đầu quy trình. Tùy vào phương thức (Wallet/Stripe) mà trả về URL redirect hoặc xử lý ngay.
*   **Webhook (`handleGatewayCallback`)**: Endpoint public nhận data từ Stripe Server gửi về để cập nhật trạng thái ngầm.
*   **Security**:
    *   `confirmStripeSuccess`: Endpoint quan trọng giúp Frontend kích hoạt xác nhận ngay lập tức, được bảo vệ bởi `@webSecurity.isBookingOwner` để tránh user khác gọi bừa.

---

## 10. File: `com.wanderlust.api.services.PaymentService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/PaymentService.java`
### Ý đồ & Chức năng:
Service xử lý tích hợp Cổng thanh toán (Payment Gateway Integration).
*   Tích hợp Stripe SDK.
*   Xử lý thanh toán Ví nội bộ.
*   Luồng Nạp tiền (Top-up) vs Thanh toán Booking.

### Giải thích Code:
*   **`initiatePayment`**:
    *   Nếu là **Wallet**: Gọi `processWalletPayment` -> Kiểm tra số dư -> Trừ tiền (`walletService`) -> Chuyển tiền cho Admin (`moneyTransferService`).
    *   Nếu là **Stripe**: Gọi `initiateStripePayment` -> Tạo `Stripe Session` -> Trả về URL thanh toán. Metadata của Session chứa `booking_id` để đối soát sau này.
*   **`handleGatewayCallback`**:
    *   Xử lý sự kiện `checkout.session.completed` từ Stripe.
    *   Phân luồng: Nếu là `WALLET_TOPUP` -> Cộng tiền vào ví User. Nếu là `BOOKING` -> Gọi Booking Service cập nhật trạng thái đã thanh toán.
*   **Transactional**: Đảm bảo toàn vẹn dữ liệu tiền tệ.

---

## 11. File: `com.wanderlust.api.services.RoomService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/RoomService.java`

### Ý đồ & Chức năng:
Service quản lý Phòng khách sạn.
*   CRUD Phòng.
*   Quy định trạng thái phòng theo trạng thái khách sạn.

### Giải thích Code:
*   **Inherit Status**: Khi tạo phòng mới (`create`), trạng thái duyệt (`ApprovalStatus`) và hoạt động (`Status`) của phòng được tự động set theo khách sạn cha. Nếu khách sạn đã duyệt & active thì phòng mới cũng active luôn, ngược lại thì pending.
*   **Availability**: Hàm `checkAvailability` đơn giản kiểm tra số lượng `availableRooms > 0`.

---

## 12. File: `com.wanderlust.api.controller.UserProfileController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/UserProfileController.java`

### Ý đồ & Chức năng:
Controller quản lý hồ sơ người dùng cá nhân (Self-service).
*   Lấy và cập nhật thông tin profile.
*   Xem thống kê và hạng thành viên.
*   Đổi mật khẩu, cài đặt thông báo.

### Giải thích Code:
*   **Endpoint `/me`**: Pattern RESTful sử dụng `/me` để truy cập tài nguyên của chính user đang đăng nhập (lấy ID từ Token), tránh việc user A xem trộm profile user B.
*   **Request Vendor Role**: Có API cho phép user thường yêu cầu nâng cấp lên đối tác (Vendor).

---

## 13. File: `com.wanderlust.api.services.UserProfileService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/UserProfileService.java`

### Ý đồ & Chức năng:
Service xử lý Logic cho User Profile.
*   Tính toán hạng thành viên (Membership Level).
*   Tích điểm thưởng (Loyalty Points).
*   Map data giữa Entity và DTO.

### Giải thích Code:
*   **Logic Membership (`getMembershipInfo`)**:
    *   Hệ thống 4 hạng: Bronze, Silver, Gold, Platinum.
    *   Tính toán % để lên hạng tiếp theo (`progressPercentage`) để Frontend vẽ thanh tiến độ.
*   **Auto-Point Updates (`addLoyaltyPoints`)**:
    *   Công thức: Mỗi 10,000đ chi tiêu = 1 điểm thưởng.
    *   Khi điểm tăng, tự động kiểm tra và nâng hạng user (`updateMembershipLevel`) ngay lập tức.
*   **Validation**: Kiểm tra kỹ lưỡng khi đổi mật khẩu (khớp pass cũ, confirm pass mới).

---

## 14. File: `com.wanderlust.api.controller.WalletController`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/WalletController.java`

### Ý đồ & Chức năng:
Controller quản lý Ví điện tử.
*   Xem số dư.
*   Nạp tiền (Deposit), Rút tiền (Withdraw).
*   Thanh toán đơn hàng (Pay).

### Giải thích Code:
*   **Webhook `/topup/callback`**: Endpoint nhận tín hiệu từ Payment Gateway khi user nạp tiền thành công để cộng tiền vào ví.
*   **Security**: Hàm `getCurrentUserId` trích xuất ID an toàn từ SecurityContext, hỗ trợ cả user đăng nhập thường và OAuth2 (Google/Facebook).

---

## 15. File: `com.wanderlust.api.services.WalletService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/WalletService.java`

### Ý đồ & Chức năng:
Service xử lý nghiệp vụ Ví tiền (Core Money Logic).
*   Quản lý giao dịch (Credit/Debit).
*   Đảm bảo tính toàn vẹn dữ liệu tiền tệ.

### Giải thích Code:
*   **Atomic Balance Update (`updateBalance`)**:
    *   Mọi thay đổi số dư đều phải đi qua hàm này. Nó cộng/trừ tiền và cập nhật cả các biến tổng (TotalTopUp, TotalSpent) cùng lúc.
*   **Payment Process (`processWalletPayment`)**:
    *   Thực hiện "Atomic Transaction": (1) Kiểm tra số dư -> (2) Tạo log giao dịch -> (3) Trừ tiền -> (4) Xác nhận đơn hàng bên BookingService.
    *   Nếu có lỗi bất kỳ bước nào, `Transactional` sẽ rollback toàn bộ để user không bị mất tiền oan.
*   **Integration**: Tích hợp chặt chẽ với `TransactionService` để lưu lịch sử và `PaymentService` để gọi cổng thanh toán bên ngoài khi nạp tiền.

---

## 16. File: `com.wanderlust.api.services.CarRentalService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/CarRentalService.java`

### Ý đồ & Chức năng:
Service xử lý nghiệp vụ thuê xe (Car Rental Business Logic).
*   Tìm kiếm xe (Location, Brand, Price...).
*   Kiểm tra tình trạng trống xe (Check Availability).
*   Tính toán giá thuê tổng thể.

### Giải thích Code:
*   **Availability Logic (`checkAvailability`)**:
    *   Khác với máy bay (check ghế), thuê xe phải check trùng lịch.
    *   Hàm này gọi `bookingRepository.findConflictingCarBookings` để tìm xem xe này đã có ai đặt trong khoảng thời gian `startDate -> endDate` chưa.
*   **Price Calculation (`calculatePrice`)**:
    *   Tính tổng giá thuê = (Giá ngày * Số ngày).
    *   Phụ phí tài xế: Nếu chọn `withDriver`, cộng thêm phí tài xế * số ngày.
    *   Phí dịch vụ: Tự động cộng thêm 5% service fee.

---

## 17. File: `com.wanderlust.api.services.ActivityService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/ActivityService.java`

### Ý đồ & Chức năng:
Service xử lý nghiệp vụ Hoạt động giải trí (Tours, Tickets).
*   Tìm kiếm hoạt động.
*   Quản lý vòng đời (Tạo, Duyệt, Pause/Resume).

### Giải thích Code:
*   **Visibility Rules (`searchActivities`)**:
    *   User thường: Chỉ thấy hoạt động đã Duyệt (`APPROVED`) và đang Hoạt động (`ACTIVE`).
    *   Vendor: Thấy tất cả hoạt động do mình tạo ra (kể cả đang chờ duyệt).
*   **Location Enrichment**:
    *   Khi tạo hoạt động (`create`), hệ thống tự động lookup `locationRepository` để điền thông tin Thành phố/Quốc gia vào bản ghi Activity, giúp việc search sau này nhanh hơn (không cần join bảng).

---

## 29. File: `com.wanderlust.api.services.PromotionService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/PromotionService.java`

### Ý đồ & Chức năng:
Service cốt lõi quản lý Chương trình khuyến mãi.
*   Tính toán giá trị giảm giá (`calculateDiscount`).
*   Validate điều kiện áp dụng khắt khe.
*   Hỗ trợ Vendor tự tạo voucher riêng.

### Giải thích Code:
*   **Discount Calculation Engine**:
    *   Hỗ trợ 2 loại: `PERCENTAGE` (Giảm %) và `FIXED_AMOUNT` (Giảm tiền mặt).
    *   Logic `maxDiscount`: Rất quan trọng với loại %, đảm bảo không giảm quá số tiền trần (ví dụ giảm 50% nhưng tối đa 100k).
*   **Validation (`validatePromotionCode`)**: Validate đa tầng:
    1.  Tồn tại & Active?
    2.  Đúng Category dịch vụ không?
    3.  Đủ điều kiện chi tiêu tối thiểu (`minSpend`)?
    4.  Của đúng Vendor sở hữu dịch vụ không (`isVendorApplicable`)? - Tránh trường hợp user dùng voucher của Hãng A để thanh toán cho Hãng B.

---

## 30. File: `com.wanderlust.api.services.UserVoucherService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/UserVoucherService.java`

### Ý đồ & Chức năng:
Service quản lý Ví voucher của người dùng (`My Vouchers`).
*   Hành động "Lưu voucher" (`Claiming`).
*   Quy trình sử dụng (Redeem) và Hoàn tác (nếu hủy đơn).

### Giải thích Code:
*   **Claim Logic (`saveVoucherToWallet`)**:
    *   Kiểm tra giới hạn tổng (`TotalUsesLimit`) của promotion gốc trước khi cho phép user lưu.
    *   Mỗi user chỉ được lưu 1 lần (`existsByUserIdAndVoucherCode`).
*   **Data Enrichment (`enrichVouchersWithPromotionData`)**:
    *   Dữ liệu trong bảng `UserVoucher` chỉ chứa ID/Code. Hàm này thực hiện "Join" in-memory để lấy đầy đủ thông tin (Title, Image, Description) từ bảng `Promotion` trả về cho Frontend hiển thị đẹp mắt.

---

## 31. File: `com.wanderlust.api.services.TravelGuideService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/TravelGuideService.java`

### Ý đồ & Chức năng:
Service quản lý nội dung số (CMS) cho Cẩm nang du lịch.
*   Quản lý Điểm đến (Destination) và Bài viết (Blog).
*   Tương tác xã hội (Like, View).

### Giải thích Code:
*   **Search Engine**: Hỗ trợ tìm kiếm theo nhiều tiêu chí (`Country`, `Continent`, `Tag`).
*   **Interaction Logic**:
    *   Các hàm `incrementViews`, `incrementLikes` được thiết kế atomic đơn giản để tăng tương tác người dùng, phục vụ cho thuật toán "Popular Guides" (`findTop10...OrderByViewsDesc`).

---

## 32. File: `VisaLandingPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaLandingPage.tsx`

### Ý đồ & Chức năng:
Trang chủ của dịch vụ Visa, cửa ngõ để người dùng tìm kiếm thông tin và bắt đầu quy trình xin visa.
*   **Hero Section**: Banner ấn tượng với nút kêu gọi hành động (Consult Now) và hotline.
*   **Phân loại Visa theo khu vực**: Hiển thị danh sách visa được nhóm theo châu lục (Á, Âu, Mỹ, Úc, Phi) giúp người dùng dễ dàng tìm kiếm.
*   **Điểm đến Hot**: Mục riêng biệt dành cho các loại visa phổ biến nhất.
*   **Lý do chọn dịch vụ**: Các thẻ thông tin khẳng định uy tín (Tư vấn chuyên nghiệp, Tỷ lệ đậu cao, Hỗ trợ 24/7).

### Giải thích Code:
*   **`ArticleCard` Component**: Một component tái sử dụng để hiển thị tóm tắt bài viết visa (ảnh, cờ quốc gia, nhãn "Hot", thời gian xử lý).
*   **Data Fetching & Filtering**:
    *   Sử dụng `useEffect` và `visaArticleApi.getAll()` để lấy toàn bộ dữ liệu bài viết visa khi trang tải.
    *   Thực hiện lọc dữ liệu ngay tại phía client (Client-side filtering) để chia thành các nhóm `VISA_HOT`, `VISA_CHAU_A`, `VISA_CHAU_AU`, v.v., giúp render ra các section tương ứng mà không cần gọi API nhiều lần.

---

## 33. File: `VisaApplicationPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaApplicationPage.tsx`

### Ý đồ & Chức năng:
Trang nộp hồ sơ xin visa trực tuyến, thiết kế theo dạng Multi-step Form (Form nhiều bước) để nâng cao trải nghiệm người dùng.
*   **Quy trình 4 bước**: Thông tin cá nhân -> Liên hệ & Hộ chiếu -> Thông tin chuyến đi & Việc làm -> Thông tin bổ sung (Tiền án/Tiền sự, Sức khỏe).
*   **Validation**: Kiểm tra dữ liệu đầu vào chặt chẽ ở từng bước.
*   **Submission**: Tổng hợp dữ liệu và gửi đơn đăng ký về hệ thống.

### Giải thích Code:
*   **State Management**:
    *   `formData`: State object lớn chứa toàn bộ thông tin của đơn đăng ký.
    *   `currentStep`: State quản lý bước hiện tại của wizard.
*   **Dynamic Rendering (`renderStepContent`)**: Hàm switch-case để render giao diện form tương ứng với `currentStep` hiện tại.
*   **Date Handling**: Sử dụng thư viện `date-fns` và component `Calendar` của shadcn/ui để xử lý việc chọn ngày tháng (Ngày sinh, Ngày cấp/hết hạn hộ chiếu) chuẩn xác.

---

## 34. File: `com.wanderlust.api.services.VisaApplicationService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/VisaApplicationService.java`

### Ý đồ & Chức năng:
Service xử lý nghiệp vụ cho các đơn đăng ký visa.
*   **Tạo đơn (Create)**: Tiếp nhận dữ liệu từ frontend, lưu trữ vào cơ sở dữ liệu với trạng thái ban đầu là `PENDING`.
*   **Quản lý đơn vủa tôi**: Cho phép người dùng xem lại lịch sử các đơn đã nộp.
*   **Cập nhật trạng thái**: Chức năng dành cho Admin/Nhân viên để duyệt hoặc từ chối hồ sơ.

### Giải thích Code:
*   **DTO Mapping (`mapToDTO`)**:
    *   Khi trả về thông tin đơn, service này thực hiện "Join" thủ công với `VisaArticleRepository` để lấy thêm tên quốc gia và tiêu đề visa. Điều này giúp frontend hiển thị thông tin ngữ cảnh phong phú (ví dụ: "Đơn xin visa Nhật Bản") thay vì chỉ hiển thị mã bài viết.
*   **Stateless Logic**: Các phương thức được thiết kế để xử lý dữ liệu thuần túy, ID người dùng được truyền vào từ Controller đảm bảo bảo mật.

---

## 35. File: `com.wanderlust.api.services.VisaArticleService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/VisaArticleService.java`

### Ý đồ & Chức năng:
Service quản lý nội dung thông tin (CMS) cho mảng Visa.
*   **Quản lý bài viết**: Thêm, xóa, sửa thông tin chi tiết về thủ tục visa của các nước.
*   **Tìm kiếm & Phân loại**: Cung cấp các phương thức để tìm visa theo Châu lục, Category, hoặc độ phổ biến (Popular).

### Giải thích Code:
*   **Selective Update (`updateVisaArticle`)**:
    *   Logic cập nhật (`updateVisaArticle`) được viết rất chi tiết để kiểm tra `null`. Chỉ những trường có giá trị mới được cập nhật vào database. Điều này cho phép client chỉ gửi những trường cần thay đổi (PATCH semantics) mà không sợ làm mất dữ liệu cũ.
*   **Repository Access**: Sử dụng `VisaArticleRepository` để thực hiện các câu truy vấn database chuẩn JPA.

---

## 36. File: `VendorDashboard.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorDashboard.tsx`

### Ý đồ & Chức năng:
Bảng điều khiển trung tâm (Dashboard) dành cho Đối tác (Vendor).
*   **Tổng quan kinh doanh**: Hiển thị các chỉ số key (Doanh thu, Booking mới, Rating trung bình) dưới dạng thẻ (Cards) trực quan.
*   **Hoạt động gần đây**: Liệt kê các booking vừa nhận được để vendor nắm bắt nhanh.
*   **Phản hồi khách hàng**: Hiển thị các đánh giá mới nhất cần phản hồi.
*   **Lối tắt (Quick Actions)**: Nút thao tác nhanh để thêm dịch vụ mới, xem báo cáo, v.v.

### Giải thích Code:
*   **Modular layout**: Sử dụng `VendorLayout` làm wrapper chung, đảm bảo tính nhất quán về thanh điều hướng (Sidebar/Header) cho toàn bộ phân hệ Vendor.
*   **Data Presentation**: Hiện tại đang sử dụng dữ liệu mẫu (mock data) được cấu trúc rõ ràng (`stats`, `recentBookings`) để xây dựng UI khung.
*   **Conditional Styling**: Hàm `getStatusBadge` giúp hiển thị trạng thái booking (Confirmed/Pending/Completed) với màu sắc phù hợp (Xanh/Vàng).

---

## 37. File: `VendorServicesPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorServicesPage.tsx`

### Ý đồ & Chức năng:
Trang quản lý danh mục dịch vụ (Sản phẩm) toàn diện của Vendor.
*   **Đa loại hình dịch vụ**: Quản lý tập trung cả 3 loại hình: Khách sạn (Hotel), Hoạt động (Activity), và Xe (Car Rental).
*   **Bộ lọc trạng thái**: Tab chuyển đổi nhanh giữa các dịch vụ Đang hoạt động, Chờ duyệt, hoặc Bị từ chối.
*   **Tác vụ quản lý**: Hỗ trợ đầy đủ các thao tác Thêm mới, Chỉnh sửa, Tạm dừng (Pause), Kích hoạt lại (Resume), và Xóa dịch vụ.

### Giải thích Code:
*   **Data Normalization (`mapService`)**:
    *   Đây là hàm cốt lõi giúp đồng bộ hóa dữ liệu. Vì cấu trúc API của Hotel, Activity và Car Rental khác nhau, hàm này ánh xạ tất cả về một interface `Service` chung (có các trường `id`, `name`, `image`, `price`, `status`...). Nhờ đó, một UI duy nhất có thể hiển thị danh sách cho cả 3 loại dịch vụ.
*   **Dynamic Dialogs**: Sử dụng các dialog chuyên biệt cho từng loại dịch vụ (ví dụ: `HotelWizardDialog` cho khách sạn vì quy trình phức tạp hơn, `AddServiceDialog` cho Activity/Car).

---

## 38. File: `com.wanderlust.api.services.MoneyTransferService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/MoneyTransferService.java`

### Ý đồ & Chức năng:
Dịch vụ nòng cốt xử lý các giao dịch tài chính phức tạp trong hệ thống.
*   **Phân phối dòng tiền**: Quản lý đường đi của tiền từ User -> Admin (tạm giữ) -> Vendor (sau khi hoàn thành dịch vụ).
*   **Tính toán hoa hồng (Commission)**: Tự động trích phần trăm doanh thu cho sàn trước khi chuyển cho Vendor.
*   **Xử lý hoàn tiền (Refund)**: Quản lý logic hoàn tiền và các khoản phạt (Penalty) nếu Vendor hủy dịch vụ.

### Giải thích Code:
*   **Atomic Transactions (`processBookingCompletionTransfer`)**:
    *   Được đánh dấu `@Transactional` để đảm bảo tính toàn vẹn dữ liệu.
    *   Thực hiện đồng thời việc trừ tiền từ ví Admin và cộng tiền vào ví Vendor.
    *   Tự động tính toán `VendorReceives` = `TotalPrice` - `Commission`.
    *   Tự động phân định trách nhiệm chi trả Voucher (Admin hay Vendor tạo voucher) để trừ tiền đúng đối tượng.
*   **Audit Trail**: Mỗi biến động số dư đều đi kèm với việc tạo bản ghi `WalletTransaction` chi tiết, giúp dễ dàng đối soát sau này.

---

## 39. File: `com.wanderlust.api.services.WebSecurityService`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/WebSecurityService.java`

### Ý đồ & Chức năng:
Service hỗ trợ bảo mật mức phương thức (Method Security) chuyên sâu.
*   **Kiểm tra quyền sở hữu (Ownership Checks)**: Đảm bảo người dùng chỉ có thể thao tác trên tài nguyên của chính mình (ví dụ: Vendor A không thể sửa khách sạn của Vendor B).
*   **Hỗ trợ `@PreAuthorize`**: Các phương thức trong service này được gọi trực tiếp từ annotation bảo mật trên Controller (VD: `@PreAuthorize("@webSecurity.isHotelOwner(authentication, #id)")`).

### Giải thích Code:
*   **Principal Abstraction (`getUserIdFromAuthentication`)**: Xử lý đa dạng các loại đối tượng xác thực (JWT UserDetails, OAuth2User) để trích xuất UserID một cách thống nhất.
*   **Specific Resource Checks (`is...Owner`)**:
    *   Triển khai các phương thức kiểm tra riêng biệt cho từng loại resource (`isHotelOwner`, `isActivityOwner`, `isBookingOwner`).
    *   Hỗ trợ logic "bắc cầu": Ví dụ `isRoomOwner` sẽ tìm Hotel chứa Room đó, rồi gọi lại `isHotelOwner` để xác thực quyền.

---

## 40. File: `AdminDashboard.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Admin/AdminDashboard.tsx`

### Ý đồ & Chức năng:
Trang tổng quan (Dashboard) dành cho Quản trị viên hệ thống.
*   **Thống kê toàn hệ thống**: Hiển thị các chỉ số vĩ mô như Tổng người dùng, Doanh thu tháng, Booking mới và Tăng trưởng.
*   **Monitoring**: Giám sát các hoạt động gần đây nhất (Booking mới, Review mới) để phát hiện bất thường.
*   **Top Performance**: Xem danh sách Khách sạn được đánh giá cao nhất.

### Giải thích Code:
*   **Data Aggregation**:
    *   Sử dụng `Promise.all` để gọi song song 4 API lớn (`getBookingStatistics`, `getAllBookings`, `searchHotels`, `getAllReviews`).
    *   Thực hiện xử lý dữ liệu (Sorting, Slicing) ngay tại client để lấy ra Top 5 booking mới nhất, Top 4 hotel rating cao nhất.
*   **Trend Calculation**:
    *   Tính toán phần trăm tăng trưởng (`growth`) so với tháng trước bằng công thức: `((Current - Previous) / Previous) * 100`.
    *   Logic hiển thị mũi tên lên/xuống (Trend Icon) và màu sắc (Xanh/Đỏ) dựa trên giá trị dương/âm.

---

## 41. File: `AdminUsersPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Admin/AdminUsersPage.tsx`

### Ý đồ & Chức năng:
Trang quản lý Người dùng (User Management).
*   **CRUD User**: Thêm mới, Sửa thông tin, Xóa người dùng.
*   **Security Actions**: Cấm (Ban) tài khoản vi phạm hoặc Tạm khóa (Suspend).
*   **Phân quyền**: Gán vai trò (User, Vendor, Admin) cho tài khoản.

### Giải thích Code:
*   **Tab Navigation**: Phân chia user theo trạng thái (All, Active, Suspended, Banned) giúp admin dễ quản lý.
*   **Client-side Search**:
    *   Thực hiện tìm kiếm theo Tên hoặc Email ngay trên dữ liệu đã tải về (`users.filter`).
*   **Dialog Management**:
    *   Sử dụng nhiều `Dialog` (shadcn/ui) cho các hành động khác nhau: `AddUserDialog`, `EditUserDialog`, `BanConfirmDialog`, `DeleteConfirmDialog`.
    *   State quản lý riêng biệt cho từng dialog để tránh xung đột dữ liệu.

---

## 42. File: `AdminPendingServicesPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Admin/AdminPendingServicesPage.tsx`

### Ý đồ & Chức năng:
Trang kiểm duyệt Dịch vụ (Service Approval) - Cổng kiểm soát chất lượng của sàn.
*   **Unified Approval Interface**: Một giao diện duy nhất để duyệt cả Khách sạn, Phòng, Tour, và Xe thuê.
*   **Quy trình duyệt (Workflow)**: Vendor gửi bài -> Admin xem -> Admin có thể: Duyệt (Approve), Từ chối (Reject), hoặc Yêu cầu sửa đổi (Request Revision).
*   **So sánh dữ liệu**: Xem chi tiết thông tin dịch vụ vendor gửi lên để quyết định.

### Giải thích Code:
*   **Data Normalization Strategy**:
    *   Vì mỗi loại dịch vụ (Hotel, Activity, Car) có cấu trúc JSON khác nhau, hàm `mapService` đóng vai trò vital adapter, chuyển đổi tất cả về một định dạng chung `PendingService` để render lên bảng.
    *   Xử lý các trường đặc thù trong `details` object (ví dụ Hotel có `starRating`, Car có `transmission`).
*   **Polymorphic Actions**:
    *   Hàm `handleApprove` và `handleReject` tự động gọi đúng API tương ứng (`hotelApi`, `activityApi`...) dựa trên `service.type`.
*   **Background Data Merging**:
    *   Kỹ thuật `Promise.all` kết hợp loading 2 giai đoạn: Load trang 1 trước để hiển thị nhanh -> Load toàn bộ ngầm (background) để phục vụ search/filter toàn cục.

---

## 43. File: `StripePaymentPage/PaymentSuccess.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/StripePaymentPage/PaymentSuccess.tsx`

### Ý đồ & Chức năng:
Trang xử lý sau khi thanh toán thành công (Redirect từ Stripe Gateway).
*   **Xử lý Nạp ví (Top-up)**: Xác nhận giao dịch nạp tiền, cộng tiền vào ví.
*   **Xử lý Thanh toán Booking**: Cập nhật trạng thái đơn hàng đã thanh toán.
*   **Thông báo kết quả**: Hiển thị giao diện thành công và hướng dẫn bước tiếp theo.

### Giải thích Code:
*   **Dual Mode Handling**:
    *   Phân biệt loginc dựa trên URL Params: Nếu có `booking_id` -> Xử lý Booking. Nếu chỉ có `session_id` -> Xử lý Nạp ví.
*   **Booking Payment Confirmation**:
    *   Gọi `paymentApi.confirmStripeSuccess` để update trạng thái Payment.
    *   Gọi `bookingApi.updateBooking` set `paymentStatus: 'COMPLETED'`.
*   **Top-up Polling**:
    *   Với giao dịch nạp ví, do Webhook có thể chậm, frontend thực hiện cơ chế chờ (`setTimeout`) và gọi lại API `transactionApi.getTransactions` để xác minh tiền đã thực sự vào ví chưa trước khi báo thành công.

---

## 44. File: `PromotionsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Others/PromotionsPage.tsx`

### Ý đồ & Chức năng:
Trang thư viện Mã giảm giá (Voucher Hub).
*   **Voucher Showcase**: Trưng bày các mã ưu đãi đang hoạt động, chia theo phân loại (Khách sạn, Máy bay...).
*   **User Action**: Cho phép người dùng lấy mã (Lưu vào ví) hoặc sao chép mã.
*   **Thời gian thực**: Hiển thị đếm ngược thời gian và số lượng mã còn lại.

### Giải thích Code:
*   **Hero Slider**: 
    *   Sử dụng thủ thuật CSS `gradients` và `opacity` transition để tạo hiệu ứng chuyển slide mượt mà cho 3 voucher nổi bật nhất.
*   **Client-side Filtering**:
    *   Bộ lọc đa chiều (Category + Type + Search Text) chạy hoàn toàn ở phía client (`filteredVouchers`) giúp phản hồi tức thì với người dùng.
*   **Voucher Collection Logic**:
    *   Sử dụng `userVoucherApi.saveToWallet` để liên kết voucher với tài khoản người dùng, ngăn chặn việc lưu trùng (`savedVouchers` state check).

---

## 45. File: `InventoryService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/InventoryService.java`

### Ý đồ & Chức năng:
Service quản lý Kho hàng (Inventory) trung tâm.
*   **Inventory Decrement**: Tự động trừ phòng/slot khi booking được xác nhận hoặc bắt đầu (tuỳ logic).
*   **Inventory Restoration**: Hoàn trả phòng/slot khi booking bị hủy hoặc hoàn thành (đối với xe/slot dùng lại được).
*   **Phạm vi**: Xử lý cho Hotel (Room), Activity (Slot theo số khách), và CarRental (Trạng thái xe).

### Giải thích Code:
*   **Polymorphic Handling**: 
    *   Phương thức `decreaseInventory(Booking booking)` sử dụng `switch(booking.getBookingType())` để điều hướng đến logic xử lý riêng biệt cho từng loại dịch vụ.
*   **Atomic Transactions**: 
    *   Annotation `@Transactional` đảm bảo tính nhất quán: nếu trừ slot thất bại, toàn bộ giao dịch (booking status update) sẽ rollback.
*   **Specific Logic**:
    *   **Hotel**: Trừ `availableRooms` của Room entity.
    *   **Car Rental**: Cập nhật trạng thái xe từ `AVAILABLE` sang `RENTED`.
    *   **Activity**: Chỉ log (hiện tại) hoặc trừ vào biến đếm số chỗ (tùy implementation thực tế).

---

## 46. File: `ReviewCommentService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/ReviewCommentService.java`

### Ý đồ & Chức năng:
Service quản lý Đánh giá và Bình luận.
*   **Review Lifecycle**: Tạo review -> Check điều kiện (Đã đi chưa?) -> Admin duyệt -> Public.
*   **Vendor Response**: Cho phép Vendor phản hồi lại đánh giá của khách hàng.
*   **Anti-Spam**: Đảm bảo chỉ người dùng đã đặt và hoàn thành dịch vụ mới được đánh giá.

### Giải thích Code:
*   **Conditional Creation (`create`)**:
    *   Kiểm tra nghiêm ngặt: `booking.getStatus() == COMPLETED` và `booking.getUserId() == currentUser` mới cho phép tạo review. Ngăn chặn review ảo.
*   **Vendor Security (`addVendorResponse`)**:
    *   Xác minh người gọi API (`currentUser`) có phải là chủ sở hữu (`VendorOwner`) của dịch vụ được review hay không trước khi cho phép phản hồi.
*   **Scope-based Fetching**:
    *   Cung cấp các method riêng biệt cho các bên: `findAllApprovedByTarget` (Public), `findAllPending` (Admin), `getReviewsByVendor` (Vendor dashboard).

---

## 47. File: `VendorBookingsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorBookingsPage.tsx`

### Ý đồ & Chức năng:
Trang quản lý Đặt chỗ cho Vendor (Đối tác).
*   **Quản lý đơn hàng**: Xem danh sách booking của khách sạn/tour/xe.
*   **Workflow xử lý**: Xác nhận (Confirm) đơn mới, Hủy đơn (Cancel) khi hết chỗ/sự cố.
*   **Theo dõi trạng thái**: Phân loại rõ ràng (Pending, Confirmed, Completed, Cancelled).

### Giải thích Code:
*   **Tabs Navigation**: Sử dụng `Tabs` của shadcn/ui để chia danh sách theo trạng thái đơn hàng, giúp vendor dễ dàng tập trung vào các đơn cần xử lý gấp (Pending).
*   **Action Logic**:
    *   `handleConfirmBooking`: Gọi API xác nhận đơn hàng, chuyển trạng thái sang `CONFIRMED`.
    *   `VendorCancelOrderDialog`: Dialog riêng biệt yêu cầu nhập lý do hủy đơn để đảm bảo minh bạch với khách hàng.

---

## 48. File: `VendorRefundsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorRefundsPage.tsx`

### Ý đồ & Chức năng:
Trang quản lý Yêu cầu Hoàn tiền.
*   **Xử lý khiếu nại**: Xem các yêu cầu hoàn tiền từ khách hàng do hủy đơn hoặc sự cố dịch vụ.
*   **Phê duyệt/Từ chối**: Vendor có quyền đồng ý hoàn tiền hoặc từ chối (kèm lý do) nếu không vi phạm chính sách.

### Giải thích Code:
*   **Stats Dashboard**: Hiển thị ngay đầu trang các chỉ số quan trọng (Số đơn chờ duyệt, Tổng tiền hoàn...) giúp vendor nắm bắt tình hình tài chính.
*   **Approval Flow**:
    *   Khi bấm "Phê duyệt" (`handleConfirmApprove`), hệ thống gọi API `vendorApi.approveRefund`. Lưu ý: Việc chuyển tiền thực tế sẽ do Admin hệ thống thực hiện sau đó để kiểm soát dòng tiền.
    *   Khi bấm "Từ chối", bắt buộc phải nhập `rejectionReason` vào trong Dialog.

---

## 49. File: `VendorReportsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorReportsPage.tsx`

### Ý đồ & Chức năng:
Trang Báo cáo & Thống kê Doanh thu.
*   **Analytics Dashboard**: Biểu đồ doanh thu, số lượng booking theo thời gian.
*   **Performance Metrics**: Tỉ lệ lấp đầy (Occupancy), Đánh giá trung bình, Tăng trưởng so với kỳ trước.
*   **Top Products**: Thống kê phòng/tour bán chạy nhất.

### Giải thích Code:
*   **Chart Design**: Hiện tại sử dụng các thanh bar chart tùy biến từ thẻ `div` với CSS width % (`style={{ width: ... }}`) để hiển thị trực quan mức độ doanh thu mà không cần thư viện chart nặng nề.
*   **Data Aggregation**: Dữ liệu như `revenueData`, `topRooms` hiện đang được mock (giả lập) hoặc tính toán đơn giản từ API thống kê tổng (`vendorApi.getReports`).

---

## 50. File: `VendorReviewsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorReviewsPage.tsx`

### Ý đồ & Chức năng:
Trang quản lý Đánh giá từ Khách hàng.
*   **Phản hồi khách hàng**: Cho phép Vendor trả lời (`Reply`) các bình luận của khách.
*   **Review Insights**: Phân tích phân bố sao (5 sao, 4 sao...).
*   **Bộ lọc**: Lọc các đánh giá chưa trả lời để ưu tiên xử lý.

### Giải thích Code:
*   **Rating Distribution UI**: Vẽ biểu đồ thanh ngang thể hiện tỉ lệ % các mức sao đánh giá.
*   **Reply Capability**:
    *   Sử dụng `ReplyReviewDialog` để nhập nội dung phản hồi.
    *   Gọi `vendorApi.respondToReview` để lưu câu trả lời. Hệ thống backend sẽ kiểm tra quyền sở hữu (`isBookingOwner`) trước khi cho phép lưu.

---

## 51. File: `VendorSettingsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorSettingsPage.tsx`

### Ý đồ & Chức năng:
Trang Cấu hình & Cài đặt Vendor.
*   **Thông tin doanh nghiệp**: Cập nhật tên, địa chỉ, liên hệ hiển thị trên hóa đơn/trang chi tiết.
*   **Cấu hình thông báo**: Bật/tắt email khi có booking mới.
*   **Tài khoản nhận tiền**: Cập nhật thông tin ngân hàng để Admin giải ngân (Payout).

### Giải thích Code:
*   **Form Management**: Sử dụng state object lớn `settings` để quản lý hàng loạt các trường thông tin.
*   **Notification Toggles**: Các nút Switch (`emailBookings`, `smsBookings`) cho phép tùy chỉnh trải nghiệm nhận tin.

---

## 52. File: `VendorVouchersPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Vendor/VendorVouchersPage.tsx`

### Ý đồ & Chức năng:
Trang quản lý Voucher riêng của Vendor.
*   **Chiến dịch Marketing**: Vendor tự tạo mã giảm giá cho dịch vụ của mình để kích cầu.
*   **Kiểm soát ngân sách**: Cài đặt giới hạn số lượt dùng, số tiền giảm tối đa.
*   **Phạm vi áp dụng**: Chọn áp dụng cho tất cả dịch vụ hoặc chỉ nhóm cụ thể (Hotel, Tour...).

### Giải thích Code:
*   **`CreateVendorVoucherDialog`**: 
    *   Form tạo voucher phức tạp với nhiều logic validate: Ngày kết thúc phải sau ngày bắt đầu, Giảm % thì phải dưới 100...
    *   Hỗ trợ upload ảnh banner cho voucher (Input URL).
*   **Status Computation (`computeStatus`)**: 
    *   Logic frontend tự động tính toán trạng thái hiển thị (`ACTIVE`, `EXPIRED`, `EXHAUSTED`) dựa trên ngày hiện tại và số lượt đã dùng so với giới hạn, giúp Vendor thấy ngay voucher nào còn hiệu lực.

---

## 53. File: `VisaArticleDetailPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaArticleDetailPage.tsx`

### Ý đồ & Chức năng:
Trang chi tiết bài viết Visa.
*   **Thông tin chuyên sâu**: Cung cấp kiến thức chi tiết về visa của một quốc gia cụ thể (Hồ sơ cần, lệ phí, quy trình).
*   **Call-to-Action**: Thúc đẩy người dùng đăng ký tư vấn ngay sau khi đọc bài viết.
*   **Trực quan hóa**: Sử dụng icon, timeline, checklist để trình bày thông tin dễ hiểu.

### Giải thích Code:
*   **Interactive UI**:
    *   Sử dụng component `ImageWithFallback` để xử lý ảnh minh họa quốc gia.
    *   Phần "Checklist hồ sơ" sử dụng các icon `CheckCircle2` để tạo cảm giác dễ dàng chuẩn bị.
*   **Direct Navigation**: Nút "Đăng ký tư vấn ngay" chuyển hướng người dùng sang trang `VisaConsultationPage` kèm theo data quốc gia đã chọn (`countryId`, `countryname`), giúp giảm bớt thao tác nhập liệu cho user.

---

## 54. File: `VisaConfirmationPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaConfirmationPage.tsx`

### Ý đồ & Chức năng:
Trang xác nhận đơn xin Visa thành công.
*   **Thông báo kết quả**: Hiển thị mã đơn hàng (`VISA-xxxxxxxx`) và trạng thái thanh toán.
*   **Hướng dẫn tiếp theo**: Chỉ dẫn người dùng các bước cần làm sau (Check email, chờ xét duyệt).
*   **Tải tài liệu**: Cung cấp chức năng tải hóa đơn và biên nhận lưu trữ.

### Giải thích Code:
*   **Dynamic Data Display**: Nhận data từ các trang trước qua `props` (country, formData, paymentMethod, total) để hiển thị lại thông tin tổng kết.
*   **Processing Time Calculation**: Tính toán ngày dự kiến hoàn thành dựa trên `country.processingTime` (ví dụ: cộng thêm 7 ngày vào ngày hiện tại).

---

## 55. File: `VisaConsultationPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaConsultationPage.tsx`

### Ý đồ & Chức năng:
Trang Form Đăng ký Tư vấn Visa.
*   **Thu thập nhu cầu**: Form nhập thông tin cơ bản: Nơi đến, Số người, Loại visa, Ngày đi dự kiến.
*   **Chọn phương thức liên hệ**: Cho phép khách chọn cách tư vấn mong muốn (Điện thoại/Email).
*   **Workflow bắt đầu**: Là điểm khởi đầu của quy trình tracking visa.

### Giải thích Code:
*   **Form State**: Sử dụng `formData` để quản lý toàn bộ input.
*   **Mock submission**: Hiện tại `handleSubmit` đang giả lập tạo `requestId` và điều hướng sang trang Tracking (`VisaTrackingPage`) với trạng thái `pending`. Thực tế sẽ cần gọi API `visaApi.createConsultation`.

---

## 56. File: `VisaDocumentsPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaDocumentsPage.tsx`

### Ý đồ & Chức năng:
Trang Nộp Hồ sơ Online (Upload tài liệu).
*   **Checklist hồ sơ số hóa**: Liệt kê các giấy tờ bắt buộc (Hộ chiếu, Ảnh, CMND...) và không bắt buộc.
*   **Upload & Validation**: Cho phép tải file lên, kiểm tra định dạng và dung lượng.
*   **Progress Tracking**: Thanh tiến trình hiển thị mức độ hoàn thành hồ sơ.

### Giải thích Code:
*   **File State Management**: Sử dụng `uploadedDocs` (Record<string, DocumentFile>) để lưu trữ file tạm thời.
*   **Client-side Validation**: Hàm `handleFileUpload` kiểm tra ngay lập tức kích thước (<5MB) và định dạng (PDF/IMG) trước khi chấp nhận file.
*   **Requirement Check**: Nút "Tiếp tục" chỉ kích hoạt (`disabled={!requiredDocsUploaded}`) khi người dùng đã upload đủ tất cả các mục `required: true`.

---

## 57. File: `VisaPaymentPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaPaymentPage.tsx`

### Ý đồ & Chức năng:
Trang Thanh toán dịch vụ Visa.
*   **Đa dạng phương thức**: Thẻ tín dụng, Chuyển khoản ngân hàng, Ví điện tử.
*   **Minh bạch chi phí**: Hiển thị bảng tính chi tiết (Phí dịch vụ + Phí xử lý).
*   **Bảo mật**: Form nhập thẻ cơ bản (Mock UI).

### Giải thích Code:
*   **Fee Calculation Logic**:
    *   Tính toán tự động: `processingFee` = 5% `serviceFee`.
    *   `total` = `serviceFee` + `processingFee`.
*   **Payment Simulation**: Hàm `handlePayment` sử dụng `setTimeout` để giả lập độ trễ xử lý thanh toán trước khi chuyển sang trang Xác nhận.

---

## 58. File: `VisaTrackingPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Visa/VisaTrackingPage.tsx`

### Ý đồ & Chức năng:
Trang Theo dõi và Tra cứu trạng thái Visa.
*   **Xem lại thông tin**: Hiển thị tóm tắt lại toàn bộ yêu cầu đã gửi.
*   **Trạng thái xử lý**: Cho biết hồ sơ đang ở bước nào (Đã tiếp nhận -> Đang xử lý -> Có kết quả).
*   **Thông tin hỗ trợ**: Cung cấp hotline/email hỗ trợ trực tiếp.

### Giải thích Code:
*   **Stateless Component**: Component này chủ yếu nhận `trackingData` từ props hoặc state điều hướng để hiển thị. Nó được thiết kế để có thể dùng chung cho cả việc: hiển thị sau khi submit form (Success Page) và tra cứu lại sau này (Tracking Result Page).

---

## 59. File: `AboutPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Others/AboutPage.tsx`

### Ý đồ & Chức năng:
Trang Giới thiệu về Wanderlust.
*   **Câu chuyện thương hiệu**: Chia sẻ sứ mệnh, tầm nhìn và giá trị cốt lõi (Mission, Team, Quality, Global).
*   **Minh chứng uy tín**: Hiển thị các con số ấn tượng (Stats) và đội ngũ lãnh đạo (Team).
*   **Xây dựng niềm tin**: Giúp người dùng hiểu rõ hơn về doanh nghiệp đứng sau nền tảng.

### Giải thích Code:
*   **Static Content Structure**: Trang này chủ yếu là nội dung tĩnh (Static), sử dụng mảng dối tượng `values`, `stats`, `team` để render lặp lại các thẻ Card, giúp code gọn gàng và dễ bảo trì nội dung.
*   **Visual Appeal**: Sử dụng `ImageWithFallback` kết hợp với lớp phủ gradient (`bg-black/50`) để tạo Hero banner ấn tượng.

---

## 60. File: `OffersPage.tsx`
**Đường dẫn**: `FrontEnd/wanderlust/src/pages/Others/OffersPage.tsx`

### Ý đồ & Chức năng:
Trang Tổng hợp Ưu đãi & Khuyến mãi.
*   **Săn deal**: Hiển thị danh sách các ưu đãi đang diễn ra (Weekly Offers).
*   **Phân loại deal**: Bộ lọc theo loại dịch vụ (Flight, Hotel, Tour) và thời gian (Weekend, Next Month).
*   **Tương tác nhanh**: Cho phép copy mã giảm giá ngay trên thẻ ưu đãi.

### Giải thích Code:
*   **Clipboard Interaction**: Component `OfferCard` tích hợp `navigator.clipboard.writeText` để copy mã voucher, có feedback visual ("Copied") trong 2 giây.
*   **Filtering UI**: Phần `FilterSection` hiện tại là giao diện tĩnh (HTML Select), chưa kết nối logic lọc thực tế nhưng đã định hình sẵn cấu trúc UX cho tính năng lọc deal sau này.

---

## 61. File: `MoneyTransferService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/MoneyTransferService.java`

### Ý đồ & Chức năng:
Service xử lý luồng tiền và giao dịch trong hệ thống.
*   **Thanh toán Booking**: Xử lý trừ tiền ví user hoặc ghi nhận thanh toán thẻ, cộng tiền vào ví Admin tạm giữ.
*   **Giải ngân (Payout)**: Chuyển tiền từ Admin sang Vendor khi booking hoàn tất (đã trừ hoa hồng).
*   **Hoàn tiền (Refund)**: Xử lý trả lại tiền cho User khi hủy đơn, bao gồm logic phạt Vendor nếu có.

### Giải thích Code:
*   **Atomic Transactions**: Sử dụng `@Transactional` để đảm bảo tính toàn vẹn dữ liệu tiền tệ. Nếu có lỗi xảy ra, toàn bộ giao dịch sẽ rollback.
*   **Commission Logic**: Tính toán hoa hồng (mặc định 5%) và chia tách tiền rõ ràng giữa Admin và Vendor.
*   **Audit Trail**: Mọi biến động số dư đều được lưu lại trong bảng `WalletTransaction` với đầy đủ thông tin (bookingId, type, amount, description).

---

## 62. File: `LocationService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/LocationService.java`

### Ý đồ & Chức năng:
Service quản lý dữ liệu Địa điểm (Tỉnh/Thành phố, Quốc gia).
*   **Tìm kiếm & Lọc**: Cung cấp API tìm kiếm địa điểm theo tên, loại (CITY, COUNTRY) hoặc parentId.
*   **Featured Locations**: Lấy danh sách địa điểm nổi bật để hiển thị trên trang chủ.

### Giải thích Code:
*   **Hierarchy Handling**: Hỗ trợ cấu trúc địa lý phân cấp (Ví dụ: Quận thuộc Thành phố) thông qua `findByParentId`.
*   **DTO Mapping**: Sử dụng `LocationMapper` để chuyển đổi giữa Entity và DTO, ẩn đi các thông tin không cần thiết khi trả về API.

---

## 63. File: `NotificationService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/NotificationService.java`

### Ý đồ & Chức năng:
Service quản lý Thông báo người dùng.
*   **Tạo thông báo**: Lưu thông báo mới vào database.
*   **Truy xuất**: Lấy danh sách thông báo của user, đếm số lượng chưa đọc.
*   **Trạng thái**: Đánh dấu đã đọc (`markAsRead`).

### Giải thích Code:
*   **Ownership Check**: Luôn kiểm tra `notification.getUserId().equals(userId)` trước khi cho phép đọc/xóa để đảm bảo bảo mật.
*   **Stream API**: Sử dụng Java Stream để map Entity sang DTO gọn gàng.

---

## 64. File: `SearchService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/SearchService.java`

### Ý đồ & Chức năng:
Service Tìm kiếm toàn cục (Global Search).
*   **Aggregated Search**: Tìm kiếm từ khóa trên nhiều module cùng lúc (Hotel, Activity, TravelGuide, VisaArticle).
*   **Unified Result**: Trả về kết quả dưới dạng danh sách `SearchResultDTO` đồng nhất để frontend dễ hiển thị.

### Giải thích Code:
*   **Cross-Repository Query**: Gọi đồng thời các repository của từng module để tìm kiếm theo tên/tiêu đề.
*   **Polymorphic Mapping**: Convert từng loại entity (Hotel, Activity...) về cùng một mẫu `SearchResultDTO` (id, title, description, image, url, type).

---

## 65. File: `AdminWalletService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/AdminWalletService.java`

### Ý đồ & Chức năng:
Interface định nghĩa các nghiệp vụ quản lý ví dành cho Admin.
*   **Quản lý ví User**: Xem danh sách, chi tiết, khóa/mở khóa ví.
*   **Xử lý Refund**: Duyệt hoặc từ chối các yêu cầu hoàn tiền đang chờ (`PendingRefund`).
*   **Giao dịch thủ công**: Tạo lệnh hoàn tiền hoặc đền bù thủ công khi cần thiết.

### Giải thích Code:
*   **Separation of Concerns**: Tách biệt logic quản lý ví của Admin ra khỏi `WalletService` chung để dễ quản lý quyền hạn và nghiệp vụ đặc thù.

---

## 66. File: `TransactionService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/TransactionService.java`

### Ý đồ & Chức năng:
Interface định nghĩa nghiệp vụ quản lý Giao dịch lịch sử.
*   **Lịch sử giao dịch**: Lấy danh sách biến động số dư của user.
*   **Thống kê**: Tính tổng thu/chi (`getTransactionSummary`).
*   **Automated Flows**: Xử lý tạo transaction tự động khi hủy đơn hoặc hoàn tiền.

### Giải thích Code:
*   **Comprehensive Tracking**: Định nghĩa đầy đủ các phương thức để track vòng đời của tiền tệ từ lúc nạp, thanh toán, đến hoàn tiền.

---

## 67. File: `RefundService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/RefundService.java`

### Ý đồ & Chức năng:
Service quản lý quy trình Hoàn tiền.
*   **Yêu cầu hoàn tiền**: User gửi yêu cầu -> Validate điều kiện (thời gian, trạng thái).
*   **Xử lý yêu cầu**: Admin/Vendor duyệt hoặc từ chối.
*   **Cập nhật Booking**: Đồng bộ trạng thái Booking (CANCELLED/CONFIRMED) dựa trên kết quả hoàn tiền.

### Giải thích Code:
*   **Validation Rules**: Kiểm tra kỹ các điều kiện biên (Time Windows) trước khi cho phép tạo yêu cầu hoàn tiền: Trước ngày đi hoặc trong vòng 24h sau khi kết thúc (nếu có khiếu nại).
*   **Workflow State Machine**: Chuyển đổi trạng thái Booking nhịp nhàng theo quyết định Refund (`REFUND_REQUESTED` -> `CANCELLED` hoặc quay về `CONFIRMED` nếu bị từ chối).

---

## 68. File: `VisaArticleService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/VisaArticleService.java`

### Ý đồ & Chức năng:
Service quản lý bài viết Visa.
*   **CRUD Operations**: Tạo, sửa, xóa, lấy chi tiết bài viết.
*   **Filtering**: Lọc bài viết theo quốc gia, châu lục, loại visa, hoặc độ phổ biến.

### Giải thích Code:
*   **Optional Handling**: Sử dụng `Optional` để xử lý null safety khi tìm kiếm bài viết.
*   **Date Formatting**: Tự động cập nhật `createdAt`, `updatedAt` theo format chuẩn khi tạo/sửa.

---

## 69. File: `WebSecurityService.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/services/WebSecurityService.java`

### Ý đồ & Chức năng:
Service bảo mật trung tâm (Security Guard).
*   **Authorization Check**: Cung cấp các method kiểm tra quyền sở hữu tài nguyên (`isHotelOwner`, `isBookingOwner`...).
*   **Integration**: Được sử dụng trực tiếp trong Spring Security `@PreAuthorize` annotations ở Controller.

### Giải thích Code:
*   **Authentication Abstraction**: Hàm `getUserIdFromAuthentication` xử lý đa hình các loại Authentication Principal (User thường, OAuth2 User) để luôn lấy được UserId chuẩn.
*   **Resource Owner Verification**: Các hàm `is...Owner` truy vấn DB để xác thực xem user hiện tại có đúng là chủ sở hữu của tài nguyên đang thao tác hay không, ngăn chặn IDOR vulnerability.

---

## 70. File: `BookingController.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/BookingController.java`

### Ý đồ & Chức năng:
Controller quản lý toàn bộ vòng đời đặt chỗ.
*   **Create Booking**: Nhận payload đa hình (ProductType: FLIGHT, HOTEL...) để tạo đơn hàng.
*   **Cancellation & Refund**: Xử lý logic hủy và hoàn tiền với phân quyền chặt chẽ (User/Admin/Vendor).
*   **Completion**: Xác nhận hoàn tất đơn hàng để trigger thanh toán cho vendor.

### Giải thích Code:
*   **Flexible Payload Handling**: Sử dụng `Map<String, Object>` cho payload tạo booking để linh hoạt xử lý các trường dữ liệu khác nhau của từng loại dịch vụ (FlightSeat vs Room vs ActivitySlot).
*   **Date Parsing**: Hàm `parseDate` hỗ trợ nhiều định dạng ngày (dd/MM/yyyy, ISO) để tương thích với nhiều nguồn input.

---

## 71. File: `PaymentController.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/PaymentController.java`

### Ý đồ & Chức năng:
Controller quản lý thanh toán.
*   **Initiate Payment**: Khởi tạo phiên thanh toán (Stripe Session hoặc Wallet deduction).
*   **Callback Handling**: Xử lý kết quả trả về từ gateway.
*   **Admin Ops**: Quản lý, xóa, refund thanh toán từ góc độ admin.

### Giải thích Code:
*   **Gateway Agnostic**: Endpoint `/callback/{gateway}` thiết kế mở để dễ dàng tích hợp thêm các cổng thanh toán khác ngoài Stripe (như MoMo, PayPal) trong tương lai.
*   **Security**: Các endpoint quan trọng đều được bảo vệ bởi `@PreAuthorize("hasRole('ADMIN') or @webSecurity.isPaymentOwner...")`.

---

## 72. File: `StripeWebhookController.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/StripeWebhookController.java`

### Ý đồ & Chức năng:
Controller chuyên biệt để nhận Webhook từ Stripe.
*   **Event Listening**: Lắng nghe các sự kiện `checkout.session.completed`, `payment_intent.succeeded/failed`.
*   **Async Processing**: Đảm bảo cập nhật trạng thái đơn hàng ngay cả khi user tắt trình duyệt trước khi redirect về site.

### Giải thích Code:
*   **Signature Verification**: Bắt buộc verify header `Stripe-Signature` để chống giả mạo request.
*   **Resilience**: Luôn trả về 200 OK cho Stripe để tránh retry spam, nhưng log lỗi chi tiết nếu xử lý nội bộ thất bại.

---

## 73. File: `AdminWalletController.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/AdminWalletController.java`

### Ý đồ & Chức năng:
Controller dành riêng cho Admin quản lý tài chính.
*   **Refund Approval**: API endpoint để Approve/Reject yêu cầu hoàn tiền.
*   **Manual Intervention**: API tạo refund thủ công hoặc điều chỉnh trạng thái ví user.

### Giải thích Code:
*   **DTO Utilization**: Sử dụng các DTO chuyên biệt (như `AdminApproveRefundDTO`, `AdminRefundRequestDTO`) để validate input chặt chẽ cho các thao tác nhạy cảm về tiền bạc.

---

## 74. File: `PromotionController.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/PromotionController.java`

### Ý đồ & Chức năng:
Controller quản lý Khuyến mãi & Voucher.
*   **Public API**: Lấy danh sách khuyến mãi, validate code, tính toán mức giảm giá.
*   **Vendor API**: Cho phép Vendor tự tạo và quản lý voucher của riêng mình.

### Giải thích Code:
*   **Vendor Isolation**: Endpoint `/vendor/my-promotions` tự động filter theo vendorId của user đang đăng nhập, đảm bảo vendor này không thấy voucher của vendor khác.
*   **Calculation Logic**: Endpoint `/calculate-discount` tách biệt logic tính toán giá tiền ra khỏi logic apply, giúp frontend hiển thị số tiền giảm dự kiến trước khi user thực sự apply.

---

## 75. File: `ReviewCommentController.java`
**Đường dẫn**: `BackEnd/api/src/main/java/com/wanderlust/api/controller/ReviewCommentController.java`

### Ý đồ & Chức năng:
Controller quản lý Đánh giá & Bình luận.
*   **User Reviews**: CRUD review cá nhân.
*   **Vendor Response**: Cho phép Vendor trả lời review của khách hàng.
*   **Moderation**: Admin duyệt hoặc ẩn các review vi phạm.

### Giải thích Code:
*   **Context Awareness**: Hàm `getCurrentUserId` xử lý linh hoạt cả `CustomUserDetails` (User thường) và `CustomOAuth2User` (Google/FB User) để luôn lấy được ID chính xác.
*   **Role-Based Access**: Phân chia rõ ràng các nhóm endpoint cho USER, PARTNER, và ADMIN.







