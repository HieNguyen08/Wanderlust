# 🔄 HƯỚNG DẪN CẬP NHẬT HEADER

## ✅ **Header Component Mới Đã Tạo**

File: `/components/Header.tsx`

### **Features:**
- ✅ Layout cố định: Logo trái, Nav giữa, Auth buttons phải
- ✅ Active state rõ ràng (underline + background màu vàng)
- ✅ Menu mới:
  - Vé máy bay
  - Khách sạn
  - Visa (disabled)
  - Thuê xe
  - Hoạt động vui chơi
  - **Cẩm nang du lịch** (di chuyển từ More ra ngoài)
  - More dropdown (Chương trình khuyến mãi, Về chúng tôi)
- ✅ Responsive với mobile menu
- ✅ Sticky top-0
- ✅ Đồng bộ trên tất cả pages

---

## 📋 **Cách Sử Dụng Header Component**

### **1. Import**
```tsx
import { Header } from "./components/Header";
```

### **2. Remove old imports**
```tsx
// XÓA những dòng này nếu chỉ dùng cho header:
import { ChevronDown } from "lucide-react"; // Nếu chỉ dùng cho header
import { MoreDropdown } from "./TravelGuidePage"; // Không cần nữa
```

### **3. Replace Header Section**

**TÌM VÀ XÓA:**
```tsx
{/* Header */}
<div className="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-50 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="flex items-center justify-between py-4">
      <h1 ...>Wanderlust</h1>
      ...
    </div>
    <nav className="hidden md:flex gap-6...">
      ...
    </nav>
  </div>
</div>
```

**THAY BẰNG:**
```tsx
{/* Header */}
<Header currentPage="PAGE_TYPE" onNavigate={onNavigate} />
```

---

## 🎯 **Page Types để mapping:**

```tsx
HomePage            → currentPage="home"
FlightsPage         → currentPage="flights"
SearchPage          → currentPage="flights" (part of flights flow)
BookingDetailsPage  → currentPage="flights" (part of flights flow)
ConfirmationPage    → currentPage="flights" (part of flights flow)
OffersPage          → currentPage="flights" (part of flights flow)

HotelLandingPage    → currentPage="hotel"
HotelListPage       → currentPage="hotel"
HotelDetailPage     → currentPage="hotel"

CarRentalLandingPage → currentPage="car-rental"
CarRentalListPage    → currentPage="car-rental"
CarDetailPage        → currentPage="car-rental"
CarPaymentPage       → currentPage="car-rental"
CarThankYouPage      → currentPage="car-rental"

ActivitiesPage       → currentPage="activities"
ActivityDetailPage   → currentPage="activities"

TravelGuidePage      → currentPage="travel-guide"
GuideDetailPage      → currentPage="travel-guide"

AboutPage            → currentPage="about"

PromotionsPage       → currentPage="promotions"
TourDetailPage       → currentPage="promotions"
```

---

## 📁 **Files Đã Cập Nhật:**

### ✅ Completed:
1. `/components/Header.tsx` - Component mới
2. `/HomePage.tsx` - Updated (custom integration)

### ⏳ Cần Cập Nhật:
1. FlightsPage.tsx
2. SearchPage.tsx
3. BookingDetailsPage.tsx
4. ConfirmationPage.tsx
5. OffersPage.tsx
6. HotelLandingPage.tsx
7. HotelListPage.tsx
8. HotelDetailPage.tsx
9. ActivitiesPage.tsx
10. ActivityDetailPage.tsx
11. TravelGuidePage.tsx
12. GuideDetailPage.tsx
13. AboutPage.tsx
14. PromotionsPage.tsx
15. TourDetailPage.tsx
16. CarRentalLandingPage.tsx
17. CarRentalListPage.tsx
18. CarDetailPage.tsx
19. CarPaymentPage.tsx
20. CarThankYouPage.tsx

---

## 🔍 **Example: HotelLandingPage**

### **BEFORE:**
```tsx
import { ChevronDown } from "lucide-react";
import { MoreDropdown } from "./TravelGuidePage";

export default function HotelLandingPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="font-['Kadwa',_serif] text-2xl md:text-3xl text-white drop-shadow-lg cursor-pointer"
                onClick={() => onNavigate("home")}>
              Wanderlust
            </h1>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm...">
                <div className="w-5 h-5 bg-red-600 rounded-full"></div>
                <span className="text-white">VI</span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
              <div className="hidden md:flex gap-3">
                <Button variant="outline"...>Đăng nhập</Button>
                <Button...>Đăng ký</Button>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 lg:gap-8 text-white drop-shadow-lg pb-4">
            <button onClick={() => onNavigate("flights")}...>Vé máy bay</button>
            <button onClick={() => onNavigate("hotel")} className="text-yellow-300 font-semibold">Khách sạn</button>
            <button...>Visa</button>
            <button...>Thuê xe</button>
            <button onClick={() => onNavigate("activities")}...>Hoạt động vui chơi</button>
            <button...>Tin tức</button>
            <MoreDropdown onNavigate={onNavigate} />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      ...
    </div>
  );
}
```

### **AFTER:**
```tsx
import { Header } from "./components/Header";

export default function HotelLandingPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Header */}
      <Header currentPage="hotel" onNavigate={onNavigate} />

      {/* Main Content */}
      ...
    </div>
  );
}
```

---

## ✨ **Benefits:**

1. **Consistent Layout** - Logo, buttons, language selector đều ở vị trí cố định
2. **Active State** - Người dùng biết đang ở page nào (underline + background vàng)
3. **Cleaner Code** - Giảm 50+ dòng code mỗi page
4. **Easy Maintenance** - Chỉ cần update 1 file Header.tsx
5. **Responsive** - Mobile menu tự động
6. **Better UX** - Navigation mượt mà, không bị layout shift

---

## 🎨 **Design Specs:**

### **Header Heights:**
- Top bar: 72px (fixed)
- Nav bar: ~60px
- Total: ~140px

### **Colors:**
- Background: gradient blue-600 to blue-700
- Active: yellow-300 with background white/10
- Hover: yellow-300
- Disabled (Visa): opacity-50

### **Active States:**
- Yellow text
- Light background (white/10)
- Underline indicator (yellow-300)

---

## 🚀 **Next Steps:**

1. User sẽ test HomePage với Header mới
2. Nếu OK, cập nhật tất cả 20 pages còn lại
3. Remove MoreDropdown component khỏi TravelGuidePage (không cần nữa)
4. Update responsive breakpoints nếu cần

---

## 📝 **Notes:**

- FlightsPage có custom header design - có thể cần redesign
- HomePage đã integrate thành công với transparent header overlay
- Tất cả pages khác sẽ dùng standard Header component
- ChevronDown icon vẫn cần giữ nếu dùng cho dropdowns khác (không chỉ header)

---

Xong! Header component sẵn sàng để roll out! 🎉
