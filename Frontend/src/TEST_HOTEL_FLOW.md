# 🧪 Test Hotel Flow - Hướng Dẫn Test

## ✅ Đã Fix
- ✅ Update HomePage interface: `onNavigate: (page: PageType, data?: any) => void`
- ✅ Update FlightsPage interface tương tự
- ✅ MainApp đã có routes: `hotel-list` và `hotel-detail`
- ✅ SearchBar đã có handleSearch với navigation

---

## 🚀 Bắt Đầu Test

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Mở Browser
```
http://localhost:5173
```

---

## 📝 Test Flow Chi Tiết

### ✅ BƯỚC 1: HomePage
1. Trang sẽ load HomePage với hero section
2. Scroll xuống hoặc nhìn phía trên hero section
3. Tìm **Search Bar** màu vàng với các trường:
   - 🏨 **Địa điểm**: "Đà Nẵng, Việt Nam" (có thể edit)
   - 📅 **Check-in - Check-out**: Chọn ngày
   - 👥 **Khách & Phòng**: "2 người lớn · 0 trẻ em · 1 phòng"
   - 🔍 **Button "Tìm"** màu xanh

4. Click vào button **"Tìm"**

**Expected Result:**
- ✅ Navigate sang HotelListPage
- ✅ URL không đổi (vì đang dùng state routing)
- ✅ Thấy danh sách 6 khách sạn

---

### ✅ BƯỚC 2: HotelListPage (Grid View - Default)

**Nhìn sẽ thấy:**

#### Top Area:
```
┌─────────────────────────────────────────────────┐
│ [← Quay lại trang chủ]                         │
├─────────────────────────────────────────────────┤
│ Tìm thấy 6 cơ sở lưu trú tại Đà Nẵng           │
│                                                 │
│ Xếp theo: [Độ phổ biến ▼]                      │
│ Hiển thị giá: [Mỗi phòng mỗi đêm ▼]            │
│ Xem: [Grid] [List]  ← Click để toggle          │
└─────────────────────────────────────────────────┘
```

#### Layout:
```
┌────────────┬────────────────────────────────────┐
│ SIDEBAR    │  GRID VIEW (3 columns)            │
│ 310px      │                                    │
│            │  ┌─────┐  ┌─────┐  ┌─────┐        │
│ Filters:   │  │Hotel│  │Hotel│  │Hotel│        │
│ ◯ Phạm vi  │  │  1  │  │  2  │  │  3  │        │
│   giá      │  │     │  │     │  │     │        │
│ ━━━━━━━    │  │2.5M │  │3.2M │  │1.8M │        │
│ 0đ - 10Mđ  │  │[Chọn│  │[Chọn│  │[Chọn│        │
│            │  └─────┘  └─────┘  └─────┘        │
│ ☑ Miễn phí │                                    │
│   hủy      │  ┌─────┐  ┌─────┐  ┌─────┐        │
│            │  │Hotel│  │Hotel│  │Hotel│        │
│ Tiện nghi: │  │  4  │  │  5  │  │  6  │        │
│ ☑ Wifi     │  │     │  │     │  │     │        │
│ ☐ Hồ bơi   │  │2.1M │  │2.8M │  │4.5M │        │
│ ☐ Chỗ đậu  │  │[Chọn│  │[Chọn│  │[Chọn│        │
│            │  └─────┘  └─────┘  └─────┘        │
└────────────┴────────────────────────────────────┘
```

**Actions to Test:**

1. **Test Filters:**
   - ✅ Kéo slider giá: 0đ → 3,000,000đ
   - ✅ Check "Miễn phí hủy" → Tất cả 6 hotels vẫn hiện (tất cả đều có)
   - ✅ Check "Wifi" trong Tiện nghi → Hotels filter
   - ✅ Check "Resort" trong Loại hình → Chỉ còn 3 hotels
   - ✅ Click "Đặt lại tất cả bộ lọc" → Quay về 6 hotels

2. **Test Sort:**
   - ✅ Chọn "Giá thấp → cao" → Hotels xếp theo giá tăng dần
   - ✅ Chọn "Giá cao → thấp" → Hotels xếp ngược lại
   - ✅ Chọn "Đánh giá cao nhất" → Hotels 5⭐ lên đầu

3. **Test View Toggle:**
   - ✅ Click button **[List]** → Chuyển sang List View

---

### ✅ BƯỚC 3: HotelListPage (List View)

**After clicking [List] button:**

#### Layout Changes:
```
┌────────────┬────────────────────────────────────┐
│ SIDEBAR    │  LIST VIEW (full width)           │
│ 310px      │                                    │
│            │  ┌──────────────────────────────┐  │
│ Filters    │  │ [Image] │ Info  │Price+Btn │  │
│            │  │ Hotel 1 │ Name  │ 2.5M đ   │  │
│            │  │ 376px   │ Addr  │ [Chọn]   │  │
│            │  └──────────────────────────────┘  │
│            │                                    │
│            │  ┌──────────────────────────────┐  │
│            │  │ [Image] │ Info  │Price+Btn │  │
│            │  │ Hotel 2 │ Name  │ 3.2M đ   │  │
│            │  │ 376px   │ Addr  │ [Chọn]   │  │
│            │  └──────────────────────────────┘  │
└────────────┴────────────────────────────────────┘
```

**Differences from Grid:**
- ✅ Cards are horizontal (not vertical)
- ✅ More info visible: Room Type, Bed Type, Breakfast
- ✅ Image on left (376px)
- ✅ Info in middle (367px)
- ✅ Price + Button on right (376px)

**Actions:**
- ✅ Click **[Grid]** button → Switch back to Grid View
- ✅ Scroll down → See all 6 hotels
- ✅ Click **"Chọn"** on any hotel → Navigate to HotelDetailPage

---

### ✅ BƯỚC 4: HotelDetailPage

**After clicking "Chọn" on Hotel Card:**

#### Layout:
```
┌─────────────────────────────────────────────────┐
│ [← Quay lại danh sách]                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────┐  ┌──────────────┐         │
│  │                 │  │ BOOKING CARD │         │
│  │   Hero Image    │  │              │         │
│  │   (400px)       │  │ 2,500,000 đ  │         │
│  │                 │  │ /phòng/đêm   │         │
│  └─────────────────┘  │              │         │
│                       │ Check-in:    │         │
│  Vinpearl Resort...   │ 15:00        │         │
│  ⭐⭐⭐⭐⭐             │              │         │
│  📍 Phạm Văn Đồng... │ Check-out:   │         │
│                       │ 12:00        │         │
│  [Có miễn phí hủy]    │              │         │
│                       │ [Đặt phòng   │         │
│  ━━━━━━━━━━━━━━━━   │  ngay]       │         │
│  Tiện nghi            │              │         │
│  🌐 Wifi              │ ✓ Xác nhận   │         │
│  🏊 Hồ bơi            │   tức thì    │         │
│  🚗 Chỗ đậu xe        │ ✓ Miễn phí   │         │
│  🍴 Nhà hàng          │   hủy phòng  │         │
│                       └──────────────┘         │
│  ━━━━━━━━━━━━━━━━                            │
│  Chi tiết phòng                                 │
│  ✓ Loại phòng: Deluxe                          │
│  ✓ Giường: 2 giường đơn                        │
│  ✓ Bao gồm ăn sáng                             │
│                                                 │
│  ━━━━━━━━━━━━━━━━                            │
│  Mô tả                                          │
│  Khách sạn Vinpearl Resort & Spa...            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Actions to Test:**

1. **Scroll Page:**
   - ✅ Thấy Hero Image (400px height)
   - ✅ Thấy Hotel name + 5 stars rating
   - ✅ Thấy địa chỉ với icon 📍
   - ✅ Thấy badge "Có miễn phí hủy phòng"

2. **Check Sections:**
   - ✅ **Tiện nghi**: Grid với icons (Wifi, Pool, Parking, etc.)
   - ✅ **Chi tiết phòng**: Loại phòng, Giường, Ăn sáng
   - ✅ **Mô tả**: Paragraph text

3. **Booking Card (Right Sidebar - Sticky):**
   - ✅ Price hiển thị: "2,500,000 đ"
   - ✅ Original price crossed out: "3,000,000 đ"
   - ✅ Discount badge: "Tiết kiệm 17%"
   - ✅ Check-in time: "15:00"
   - ✅ Check-out time: "12:00"
   - ✅ Benefits: Xác nhận tức thì, Miễn phí hủy, Thanh toán an toàn

4. **Navigation:**
   - ✅ Click **"← Quay lại danh sách"** → Back to HotelListPage
   - ✅ Click **"Đặt phòng ngay"** → Navigate to BookingDetailsPage

---

### ✅ BƯỚC 5: BookingDetailsPage (Existing)

**After clicking "Đặt phòng ngay":**
- ✅ Navigate to existing BookingDetailsPage
- ✅ Pre-filled with hotel data
- ✅ Continue existing booking flow

---

## 🐛 Troubleshooting

### ❌ Problem: Không thấy button "Tìm" trên HomePage
**Solution:**
- Scroll lên trên hero section
- Search bar có màu vàng, nằm overlay trên hero image
- Nếu vẫn không thấy, check console (F12)

### ❌ Problem: Click "Tìm" không chuyển trang
**Solution:**
1. Check console (F12) có lỗi không
2. Verify MainApp.tsx có import HotelListPage
3. Verify HomePage có pass `onNavigate` vào SearchBar
4. Hard refresh: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)

### ❌ Problem: HotelListPage hiển thị trắng
**Solution:**
1. Check console có lỗi component không
2. Verify tất cả UI components exist:
   - `/components/ui/slider.tsx`
   - `/components/ui/checkbox.tsx`
   - `/components/ui/select.tsx`
3. Run: `npm install` để đảm bảo dependencies

### ❌ Problem: Images không load
**Solution:**
- Unsplash images cần internet connection
- Check network tab (F12 → Network)
- Images sẽ fallback nếu không load được

### ❌ Problem: Filter không hoạt động
**Solution:**
1. Check console có lỗi state management không
2. Try click "Đặt lại tất cả bộ lọc"
3. Refresh page

### ❌ Problem: View toggle không chuyển
**Solution:**
1. Click button Grid/List nhiều lần
2. Check console có lỗi state không
3. Hard refresh page

---

## ✅ Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| HomePage → Click "Tìm" | Navigate to HotelListPage (Grid View) |
| HotelListPage → 6 hotels displayed | ✅ |
| Filter by price | Hotels filtered by price range |
| Filter by amenities | Hotels filtered by amenities |
| Sort by price | Hotels sorted ascending/descending |
| Toggle Grid → List | View changes to horizontal cards |
| Toggle List → Grid | View changes to vertical cards |
| Click "Chọn" on hotel | Navigate to HotelDetailPage |
| HotelDetailPage → All info shown | ✅ |
| Click "Đặt phòng ngay" | Navigate to BookingDetailsPage |
| Click "← Quay lại" | Navigate back to previous page |

---

## 📊 Test Checklist

### HomePage
- [ ] Search bar visible
- [ ] Can edit location
- [ ] Can select dates
- [ ] Button "Tìm" clickable
- [ ] Click navigates to HotelListPage

### HotelListPage - Grid View
- [ ] 6 hotels displayed in 3 columns
- [ ] Filters work (price, amenities, rating)
- [ ] Sort works (5 options)
- [ ] "Chọn" button clickable
- [ ] View toggle visible

### HotelListPage - List View
- [ ] Hotels displayed horizontally
- [ ] More details visible
- [ ] Images on left
- [ ] "Chọn" button on right

### HotelDetailPage
- [ ] Hero image loads
- [ ] Hotel name + rating shown
- [ ] Amenities displayed with icons
- [ ] Room details shown
- [ ] Booking card sticky on scroll
- [ ] Price + discount shown
- [ ] "Đặt phòng ngay" clickable

### Navigation
- [ ] HomePage → HotelListPage ✓
- [ ] HotelListPage → HotelDetailPage ✓
- [ ] HotelDetailPage → BookingDetailsPage ✓
- [ ] Back buttons work ✓

---

## 🎯 Quick Test (2 phút)

```bash
# 1. Start
npm run dev

# 2. Open browser
http://localhost:5173

# 3. Quick path:
HomePage → Click "Tìm" → See 6 hotels → Click "Chọn" → See hotel details → Done!
```

---

## ✅ Success Criteria

Nếu bạn thấy:
1. ✅ HomePage search works
2. ✅ 6 hotels hiển thị
3. ✅ Toggle Grid/List works
4. ✅ Filters work
5. ✅ Click "Chọn" → Hotel detail page
6. ✅ Click "Đặt phòng ngay" → Booking page

→ **HOTEL FLOW HOẠT ĐỘNG 100%!** 🎉

---

## 📝 Notes

- URL không đổi vì dùng state-based routing (không dùng React Router)
- Tất cả data là mock data (6 hotels cố định)
- Images từ Unsplash (cần internet)
- Responsive: Test trên mobile, tablet, desktop
- No backend required

---

**Last Updated:** December 2024  
**Status:** ✅ Ready to Test  
**Estimated Test Time:** 5-10 phút
