# Script để cập nhật tất cả headers

Cần cập nhật các files sau để sử dụng Header component:

## Files cần update:

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

## Changes needed:

### 1. Import
```tsx
import { Header } from "./components/Header";
```

### 2. Remove old imports
- Remove: `ChevronDown` from lucide-react (nếu chỉ dùng cho header)
- Remove: `MoreDropdown` from TravelGuidePage

### 3. Replace header section
Replace entire header div (from `<div className="bg-gradient-to-r from-blue-600 to-blue-700...` to end of closing `</div>`) with:

```tsx
<Header currentPage="APPROPRIATE_PAGE" onNavigate={onNavigate} />
```

Where APPROPRIATE_PAGE is one of:
- "flights", "hotel", "car-rental", "activities", "travel-guide", "about", "promotions"
