# Hướng dẫn Áp dụng i18n cho Wanderlust Frontend

## Tổng quan
Document này hướng dẫn chi tiết cách chuyển đổi các component và pages từ hardcoded text sang hệ thống đa ngôn ngữ (i18n) sử dụng react-i18next.

## 📋 Tình trạng hiện tại

### ✅ Đã hoàn thành:
- ✅ **Translation files cơ bản**: Đã cập nhật `vi.json` và `en.json` với các keys mới cho:
  - Visa services (visa.*)
  - Travel Guide (travelGuide.*)
  - Vendor panel (vendor.*)
  
- ✅ **Components đã i18n hóa**:
  - Header.tsx
  - Footer.tsx  
  - VisaLandingPage.tsx (ví dụ mẫu hoàn chỉnh)

### ⚠️ Cần hoàn thiện:
- ⚠️ **Translation files**: Cần thêm bản dịch cho `ja.json` (Japanese) và `ko.json` (Korean)
- ⚠️ **Visa pages còn lại**:
  - VisaConsultationPage.tsx
  - VisaTrackingPage.tsx
  - VisaApplicationPage.tsx
  - VisaPaymentPage.tsx
  - VisaConfirmationPage.tsx
  - VisaArticlePage.tsx
  - VisaDocumentsPage.tsx

- ⚠️ **Travel Guide pages**:
  - TravelGuidePage.tsx
  - GuideDetailPage.tsx
  - TourDetailPage.tsx

- ⚠️ **Admin pages**: Tất cả các pages trong `src/pages/Admin/`
- ⚠️ **Vendor pages**: Tất cả các pages trong `src/pages/Vendor/`
- ⚠️ **Profile pages**: Một số pages còn thiếu i18n
- ⚠️ **Components**: VendorLayout, RoomSelectionCard, VendorCancelOrderDialog, etc.

---

## 🚀 Quy trình chuyển đổi (Step by Step)

### Bước 1: Import useTranslation hook

Thêm import vào đầu file component:

```tsx
import { useTranslation } from 'react-i18next';
```

Trong function component, thêm hook:

```tsx
export default function YourComponent({ onNavigate }: YourComponentProps) {
  const { t } = useTranslation();
  // ... rest of component
}
```

### Bước 2: Xác định các hardcoded text cần thay thế

Tìm tất cả các text literal trong JSX:
- Tiêu đề (h1, h2, h3...)
- Paragraphs (p)
- Button labels
- Placeholder text
- Toast messages
- Error/Success messages
- Labels và descriptions

**Ví dụ cần thay:**
```tsx
// ❌ Trước khi i18n
<h1>Tư Vấn Làm Visa Chuyên Nghiệp</h1>
<p>Hướng dẫn chi tiết - Tư vấn tận tâm</p>
<Button>Đăng ký ngay</Button>
```

### Bước 3: Thêm translation keys vào JSON files

**Quy tắc đặt tên key:**
- Sử dụng camelCase
- Nhóm theo chức năng (visa.*, admin.*, profile.*)
- Key phải mô tả rõ ràng nội dung
- Tránh đặt key quá dài

**Ví dụ structure trong `vi.json`:**
```json
{
  "visa": {
    "heroTitle": "Tư Vấn Làm Visa Chuyên Nghiệp",
    "heroSubtitle": "Hướng dẫn chi tiết - Tư vấn tận tâm",
    "consultNow": "Đăng ký ngay"
  }
}
```

**Tương ứng trong `en.json`:**
```json
{
  "visa": {
    "heroTitle": "Professional Visa Consulting",
    "heroSubtitle": "Detailed guidance - Dedicated consultation",
    "consultNow": "Register Now"
  }
}
```

### Bước 4: Thay thế hardcoded text bằng t() function

```tsx
// ✅ Sau khi i18n
<h1>{t('visa.heroTitle')}</h1>
<p>{t('visa.heroSubtitle')}</p>
<Button>{t('visa.consultNow')}</Button>
```

### Bước 5: Xử lý các trường hợp đặc biệt

#### 5.1. String interpolation (Chèn biến)
```tsx
// Translation key với placeholder
"visa.documentsUploaded": "{count} tài liệu đã upload"

// Sử dụng
{t('visa.documentsUploaded', { count: documents.length })}
```

#### 5.2. Plural forms (Số nhiều)
```tsx
// vi.json
"common.guests": "{{count}} khách",
"common.guests_plural": "{{count}} khách"

// en.json  
"common.guests": "{{count}} guest",
"common.guests_plural": "{{count}} guests"

// Sử dụng
{t('common.guests', { count: guestCount })}
```

#### 5.3. Date/Number formatting
```tsx
// Số tiền
{totalPrice.toLocaleString('vi-VN')}đ

// Ngày tháng với date-fns
{format(date, "dd/MM/yyyy", { locale: vi })}
```

#### 5.4. Conditional text
```tsx
// ❌ Cũ
{isAvailable ? "Còn chỗ" : "Hết chỗ"}

// ✅ Mới
{isAvailable ? t('common.available') : t('common.unavailable')}
```

#### 5.5. Toast messages
```tsx
// ❌ Cũ
toast.error('Không thể tải dữ liệu');
toast.success('Cập nhật thành công!');

// ✅ Mới
toast.error(t('common.error'));
toast.success(t('profile.updateSuccess'));
```

---

## 📝 Ví dụ hoàn chỉnh: VisaLandingPage.tsx

### Trước khi i18n:
```tsx
export default function VisaLandingPage({ onNavigate }: VisaLandingPageProps) {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin ..."></div>
          <p className="text-gray-600">Đang tải danh sách visa...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Tư Vấn Làm Visa Chuyên Nghiệp</h1>
      <Button onClick={() => onNavigate("visa-consultation")}>
        Đăng ký tư vấn ngay
      </Button>
    </div>
  );
}
```

### Sau khi i18n:
```tsx
import { useTranslation } from 'react-i18next';

export default function VisaLandingPage({ onNavigate }: VisaLandingPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin ..."></div>
          <p className="text-gray-600">{t('visa.loadingVisa')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{t('visa.heroTitle')}</h1>
      <Button onClick={() => onNavigate("visa-consultation")}>
        {t('visa.consultNow')}
      </Button>
    </div>
  );
}
```

---

## 🗂️ Translation Keys đã có sẵn

### Common (common.*)
```
welcome, language, currency, search, filter, sort, apply, cancel, save, 
edit, delete, confirm, back, next, previous, loading, noData, error, 
success, viewDetails, bookNow, selectDate, from, to, price, total, 
subtotal, discount, perNight, perDay, perPerson, adults, children, 
rooms, guests, date, time, status, rating, reviews, location, 
description, facilities, policies, contact, phone, address, map, 
gallery, available, unavailable, soldOut, showMore, showLess
```

### Auth (auth.*)
```
login, register, logout, myProfile, profile, bookingHistory, 
savedItems, myWallet, wallet, settings, adminPanel, vendorPanel, 
email, password, confirmPassword, forgotPassword, rememberMe, 
signInWith, firstName, lastName, phoneNumber, gender, male, female, 
other, selectGender, dateOfBirth, mobile, address, city, country, etc.
```

### Visa (visa.*)
```
title, visaType, tourist, business, student, work, country, 
nationality, processingTime, standard, express, urgent, 
requiredDocuments, applyVisa, visaDetails, applicationStatus, 
consultation, heroTitle, heroSubtitle, consultNow, hotDestinations, 
asiaVisa, europeVisa, americaVisa, oceaniaVisa, africaVisa, 
whyChooseUs, whyChooseUsDesc, professionalAdvice, 
professionalAdviceDesc, highSuccess, highSuccessDesc, fastProcessing, 
fastProcessingDesc, support247, support247Desc, loadingVisa, 
consultationTitle, consultationSubtitle, fullName, phoneNumber, 
email, selectCountry, selectVisaType, numberOfPeople, 
departureDatePlan, additionalNotes, submitRequest, etc.
```

### Travel Guide (travelGuide.*)
```
title, guides, tips, attractions, restaurants, shopping, 
transportation, accommodation, safety, budget, bestTime, readMore, 
subtitle, popularDestinations, blogPosts, continents.asia, 
continents.europe, etc., exploreGuides, viewAllGuides, travelTime, 
bestSeasonToVisit, overview, includedServices, notIncludedServices, 
itinerary, day, tourHighlights, languages, relatedTours
```

### Vendor (vendor.*)
```
dashboard, myListings, bookings, earnings, reviews, addListing, 
editListing, deleteListing, performance, messages, calendar, pricing, 
availability, hotelRooms, activities, cars, flights, vouchers, 
orders, cancelOrder, cancelWarningTitle, cancelWarningMessage, 
cancelImpact, refundToCustomer, affectReputation, cancellationFee, 
continueCancel, selectReasonTitle, selectReasonMessage, 
reasonOverbooking, reasonNotAvailable, reasonMaintenance, 
reasonEmergency, reasonOther, additionalNote, confirmCancellation, etc.
```

*(Xem đầy đủ trong files `vi.json` và `en.json`)*

---

## ✅ Checklist cho mỗi file

Khi chuyển đổi một file, hãy đảm bảo:

- [ ] Đã import `useTranslation` từ 'react-i18next'
- [ ] Đã khai báo `const { t } = useTranslation();` trong component
- [ ] Đã thêm tất cả translation keys cần thiết vào `vi.json` và `en.json`
- [ ] Đã thay thế tất cả hardcoded text bằng `t()` function
- [ ] Đã test switching giữa các ngôn ngữ
- [ ] Đã xử lý các trường hợp string interpolation (nếu có)
- [ ] Đã xử lý toast messages
- [ ] Đã xử lý error messages
- [ ] Code không còn hardcoded Vietnamese/English text
- [ ] Component vẫn hoạt động bình thường sau khi i18n

---

## 🎯 Ưu tiên triển khai

### Priority 1 (Cao nhất - User-facing pages)
1. VisaConsultationPage.tsx
2. VisaTrackingPage.tsx  
3. TravelGuidePage.tsx
4. GuideDetailPage.tsx
5. Profile-related pages chưa có i18n

### Priority 2 (Trung bình - Vendor/Admin panels)
1. VendorLayout.tsx
2. Admin pages
3. Vendor pages
4. Service management dialogs

### Priority 3 (Thấp - Supporting components)
1. VendorCancelOrderDialog.tsx
2. ServiceDetailDialog.tsx
3. RoomDetailDialog.tsx
4. RoomSelectionCard.tsx
5. Other utility components

---

## 🔧 Tips & Best Practices

### 1. Sử dụng namespace để tổ chức
```tsx
// Tốt - Có cấu trúc
t('visa.heroTitle')
t('profile.updateSuccess')
t('admin.manageUsers')

// Tránh - Không rõ ràng
t('title')
t('success')
t('manage')
```

### 2. Tái sử dụng keys chung
```tsx
// Thay vì tạo nhiều keys giống nhau
"visa.cancel": "Hủy",
"profile.cancel": "Hủy",
"admin.cancel": "Hủy",

// Sử dụng key chung
"common.cancel": "Hủy"
```

### 3. Giữ HTML tags trong translation
```tsx
// ❌ Tránh
<p>
  <strong>Lưu ý:</strong> {t('visa.note')}
</p>

// ✅ Tốt hơn
<p>
  {t('visa.noteWithLabel')}
</p>

// Translation
"visa.noteWithLabel": "<strong>Lưu ý:</strong> Vui lòng chuẩn bị đầy đủ giấy tờ"
```

### 4. Test với nhiều ngôn ngữ
```tsx
// Kiểm tra UI không bị vỡ với text dài (tiếng Đức, tiếng Nga)
// Kiểm tra alignment với ngôn ngữ RTL (tiếng Ả Rập)
// Kiểm tra special characters hiển thị đúng
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Key không tìm thấy
```
Lỗi: i18next::translator: missingKey en translation visa.someKey
```
**Giải pháp:** Kiểm tra key có trong cả `vi.json` và `en.json`, đúng tên và đúng namespace.

### Issue 2: Translation không update real-time
**Giải pháp:** Kiểm tra `i18n.ts` config có `fallbackLng` và `debug: true` để debug.

### Issue 3: Variables không hiển thị
```tsx
// ❌ Sai
{t('visa.documentsUploaded', { count })}
// Key: "visa.documentsUploaded": "{count} documents"

// ✅ Đúng  
{t('visa.documentsUploaded', { count })}
// Key: "visa.documentsUploaded": "{{count}} documents"
```

---

## 📚 Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Translation Keys Reference](./src/locales/vi.json)
- [Completed Example](./src/pages/Visa/VisaLandingPage.tsx)

---

## 📝 Notes

- Khi thêm key mới, luôn thêm vào **TẤT CẢ** các file ngôn ngữ (`vi.json`, `en.json`, `ja.json`, `ko.json`)
- Sử dụng công cụ translation hoặc AI để dịch cho tiếng Nhật và Hàn Quốc
- Test kỹ trước khi commit
- Document các keys mới nếu cần

---

**Last Updated:** November 21, 2025  
**Version:** 1.0  
**Author:** Wanderlust Development Team
