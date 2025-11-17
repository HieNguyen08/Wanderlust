# 🌍 Hướng Dẫn Sử Dụng i18n (Internationalization)

## 📋 Tổng Quan

Ứng dụng Wanderlust hỗ trợ 4 ngôn ngữ:
- 🇻🇳 Tiếng Việt (`vi`) - Mặc định
- 🇬🇧 English (`en`)
- 🇯🇵 日本語 (`ja`)
- 🇰🇷 한국어 (`ko`)

## 🚀 Cách Sử Dụng Trong Component

### 1. Import Hook `useTranslation`

```tsx
import { useTranslation } from 'react-i18next';
```

### 2. Sử Dụng Hook Trong Component

```tsx
export function YourComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.flights')}</h1>
      <p>{t('common.welcome')}</p>
    </div>
  );
}
```

### 3. Thay Đổi Ngôn Ngữ

```tsx
const handleLanguageChange = (lang: string) => {
  i18n.changeLanguage(lang);
};

// Sử dụng
<button onClick={() => handleLanguageChange('en')}>English</button>
<button onClick={() => handleLanguageChange('vi')}>Tiếng Việt</button>
```

## 📚 Cấu Trúc Translation Keys

### Navigation (`nav`)
```tsx
t('nav.flights')       // Chuyến bay / Flights / 航空券 / 항공권
t('nav.hotel')         // Khách sạn / Hotel / ホテル / 호텔
t('nav.visa')          // Visa
t('nav.carRental')     // Thuê xe / Car Rental / レンタカー / 렌터카
t('nav.activities')    // Hoạt động / Activities / アクティビティ / 액티비티
```

### Authentication (`auth`)
```tsx
t('auth.login')           // Đăng nhập / Login / ログイン / 로그인
t('auth.register')        // Đăng ký / Register / 登録 / 회원가입
t('auth.logout')          // Đăng xuất / Logout / ログアウト / 로그아웃
t('auth.email')           // Email
t('auth.password')        // Mật khẩu / Password / パスワード / 비밀번호
t('auth.myProfile')       // Hồ sơ của tôi / My Profile / マイプロフィール / 내 프로필
```

### Common (`common`)
```tsx
t('common.search')        // Tìm kiếm / Search / 検索 / 검색
t('common.filter')        // Lọc / Filter / フィルター / 필터
t('common.sort')          // Sắp xếp / Sort / 並び替え / 정렬
t('common.cancel')        // Hủy / Cancel / キャンセル / 취소
t('common.save')          // Lưu / Save / 保存 / 저장
t('common.edit')          // Chỉnh sửa / Edit / 編集 / 편집
t('common.delete')        // Xóa / Delete / 削除 / 삭제
t('common.confirm')       // Xác nhận / Confirm / 確認 / 확인
t('common.loading')       // Đang tải... / Loading... / 読み込み中... / 로딩 중...
```

### Flights (`flights`)
```tsx
t('flights.title')        // Đặt vé máy bay / Book Flights / 航空券予約 / 항공권 예약
t('flights.oneWay')       // Một chiều / One Way / 片道 / 편도
t('flights.roundTrip')    // Khứ hồi / Round Trip / 往復 / 왕복
t('flights.departure')    // Khởi hành / Departure / 出発 / 출발
t('flights.return')       // Về / Return / 帰国 / 귀국
```

### Hotels (`hotels`)
```tsx
t('hotels.title')         // Đặt khách sạn / Book Hotels / ホテル予約 / 호텔 예약
t('hotels.checkIn')       // Nhận phòng / Check In / チェックイン / 체크인
t('hotels.checkOut')      // Trả phòng / Check Out / チェックアウト / 체크아웃
t('hotels.guests')        // Khách / Guests / ゲスト / 게스트
```

### Activities (`activities`)
```tsx
t('activities.title')     // Hoạt động / Activities / アクティビティ / 액티비티
t('activities.category')  // Danh mục / Category / カテゴリー / 카테고리
t('activities.duration')  // Thời lượng / Duration / 期間 / 기간
```

### Car Rental (`carRental`)
```tsx
t('carRental.title')      // Thuê xe / Car Rental / レンタカー / 렌터카
t('carRental.carType')    // Loại xe / Car Type / 車種 / 차종
```

### Visa (`visa`)
```tsx
t('visa.title')           // Dịch vụ Visa / Visa Services / ビザサービス / 비자 서비스
t('visa.applyVisa')       // Xin visa / Apply Visa / ビザ申請 / 비자 신청
```

### Travel Guide (`travelGuide`)
```tsx
t('travelGuide.title')    // Hướng dẫn du lịch / Travel Guide / 旅行ガイド / 여행 가이드
```

### Booking (`booking`)
```tsx
t('booking.title')            // Đặt chỗ / Booking / 予約 / 예약
t('booking.confirmBooking')   // Xác nhận đặt chỗ / Confirm Booking / 予約確認 / 예약 확인
```

### Profile (`profile`)
```tsx
t('profile.title')        // Hồ sơ / Profile / プロフィール / 프로필
t('profile.editProfile')  // Chỉnh sửa hồ sơ / Edit Profile / プロフィール編集 / 프로필 편집
```

### Admin (`admin`)
```tsx
t('admin.dashboard')      // Trang quản trị / Dashboard / ダッシュボード / 대시보드
t('admin.users')          // Người dùng / Users / ユーザー / 사용자
t('admin.bookings')       // Đặt chỗ / Bookings / 予約 / 예약
```

### Vendor (`vendor`)
```tsx
t('vendor.dashboard')     // Trang nhà cung cấp / Dashboard / ダッシュボード / 대시보드
t('vendor.myListings')    // Danh sách của tôi / My Listings / マイリスト / 내 목록
```

### Footer (`footer`)
```tsx
t('footer.company')       // Công ty / Company / 会社 / 회사
t('footer.aboutUs')       // Về chúng tôi / About Us / 私たちについて / 회사 소개
t('footer.copyright')     // © 2025 Wanderlust. All rights reserved.
```

## 💡 Ví Dụ Thực Tế

### Example 1: Flight Search Component

```tsx
import { useTranslation } from 'react-i18next';

export function FlightSearch() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('flights.title')}</h2>
      <div>
        <button>{t('flights.oneWay')}</button>
        <button>{t('flights.roundTrip')}</button>
      </div>
      <input placeholder={t('flights.from')} />
      <input placeholder={t('flights.to')} />
      <button>{t('common.search')}</button>
    </div>
  );
}
```

### Example 2: Hotel Card Component

```tsx
import { useTranslation } from 'react-i18next';

export function HotelCard({ hotel }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3>{hotel.name}</h3>
      <p>{t('common.location')}: {hotel.location}</p>
      <p>{t('common.price')}: ${hotel.price} {t('common.perNight')}</p>
      <p>{t('common.rating')}: {hotel.rating} ({hotel.reviews} {t('common.reviews')})</p>
      <button>{t('common.viewDetails')}</button>
    </div>
  );
}
```

### Example 3: Language Switcher

```tsx
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## 📝 Quy Tắc Best Practices

1. **Luôn sử dụng translation keys** thay vì hardcode text:
   ```tsx
   ❌ BAD: <h1>Chuyến bay</h1>
   ✅ GOOD: <h1>{t('nav.flights')}</h1>
   ```

2. **Sử dụng nested keys** để organize:
   ```tsx
   ✅ t('flights.departure')
   ✅ t('hotels.checkIn')
   ✅ t('common.search')
   ```

3. **Kiểm tra key tồn tại** trong file JSON trước khi sử dụng

4. **Thêm translation cho tất cả 4 ngôn ngữ** khi thêm key mới

## 📂 File Locations

- `src/i18n.ts` - Configuration file
- `src/locales/vi.json` - Vietnamese translations
- `src/locales/en.json` - English translations
- `src/locales/ja.json` - Japanese translations
- `src/locales/ko.json` - Korean translations

## 🔧 Thêm Translation Key Mới

1. Thêm key vào tất cả 4 file trong `src/locales/`:
   ```json
   // vi.json
   "myNewSection": {
     "title": "Tiêu đề mới"
   }
   
   // en.json
   "myNewSection": {
     "title": "New Title"
   }
   
   // ja.json
   "myNewSection": {
     "title": "新しいタイトル"
   }
   
   // ko.json
   "myNewSection": {
     "title": "새 제목"
   }
   ```

2. Sử dụng trong component:
   ```tsx
   {t('myNewSection.title')}
   ```

## ⚠️ Lưu Ý Quan Trọng

- MainApp.tsx đã được wrap với `I18nextProvider` - không cần wrap lại
- Language mặc định là `vi` (Tiếng Việt)
- Fallback language cũng là `vi`
- Ngôn ngữ được lưu trong localStorage và persist sau khi refresh

## 🎯 Next Steps

Để áp dụng i18n cho một page:
1. Import `useTranslation` hook
2. Thay thế tất cả hardcoded text bằng `t('key.path')`
3. Test với cả 4 ngôn ngữ
4. Đảm bảo layout không bị vỡ với các ngôn ngữ dài hơn

---

📚 **Tham khảo thêm**: [react-i18next Documentation](https://react.i18next.com/)
