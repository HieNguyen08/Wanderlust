# Pages Restructure Guide

## Overview
Tái cấu trúc project với /pages directory structure. Mỗi page sẽ có thư mục riêng.

## Structure

```
/pages/
├── Home/
│   └── HomePage.tsx ✓
├── Login/
│   └── LoginPage.tsx ✓
├── Flights/
│   ├── FlightsPage.tsx
│   └── FlightReviewPage.tsx
├── Search/
│   └── SearchPage.tsx
├── Booking/
│   ├── BookingDetailsPage.tsx
│   └── BookingHistoryPage.tsx
├── Confirmation/
│   └── ConfirmationPage.tsx
├── Hotels/
│   ├── HotelLandingPage.tsx
│   ├── HotelListPage.tsx
│   ├── HotelDetailPage.tsx
│   └── HotelReviewPage.tsx
├── CarRental/
│   ├── CarRentalLandingPage.tsx
│   ├── CarRentalListPage.tsx
│   ├── CarDetailPage.tsx
│   └── CarRentalReviewPage.tsx
├── Activities/
│   ├── ActivitiesPage.tsx
│   ├── ActivityDetailPage.tsx
│   └── ActivityReviewPage.tsx
├── Visa/
│   ├── VisaLandingPage.tsx
│   ├── VisaArticleDetailPage.tsx
│   ├── VisaConsultationPage.tsx
│   ├── VisaTrackingPage.tsx
│   ├── VisaApplicationPage.tsx
│   ├── VisaDocumentsPage.tsx
│   ├── VisaPaymentPage.tsx
│   └── VisaConfirmationPage.tsx
├── TravelGuide/
│   ├── TravelGuidePage.tsx
│   ├── GuideDetailPage.tsx
│   └── TravelArticlePage.tsx
├── Tours/
│   └── TourDetailPage.tsx
├── Offers/
│   ├── OffersPage.tsx
│   └── PromotionsPage.tsx
├── Profile/
│   ├── ProfilePage.tsx
│   ├── SavedItemsPage.tsx
│   ├── UserVouchersPage.tsx
│   ├── UserWalletPage.tsx
│   ├── TopUpWalletPage.tsx
│   ├── SettingsPage.tsx
│   └── PaymentMethodsPage.tsx
├── About/
│   └── AboutPage.tsx
├── Admin/
│   ├── AdminDashboard.tsx
│   ├── AdminUsersPage.tsx
│   ├── AdminBookingsPage.tsx
│   ├── AdminHotelsPage.tsx
│   ├── AdminActivitiesPage.tsx
│   ├── AdminVouchersPage.tsx
│   ├── AdminReviewsPage.tsx
│   ├── AdminReportsPage.tsx
│   ├── AdminRefundsPage.tsx
│   ├── AdminRefundWalletPage.tsx
│   ├── AdminPendingServicesPage.tsx
│   └── AdminSettingsPage.tsx
└── Vendor/
    ├── VendorDashboard.tsx
    ├── VendorServicesPage.tsx
    ├── VendorBookingsPage.tsx
    ├── VendorVouchersPage.tsx
    ├── VendorReviewsPage.tsx
    ├── VendorReportsPage.tsx
    └── VendorSettingsPage.tsx
```

## Import Path Changes

From: `import { Component } from "./components/..."`
To: `import { Component } from "../../components/..."`

From: `import type { PageType } from "./MainApp"`
To: `import type { PageType } from "../../MainApp"`

## Status

- [x] Created /pages/Home/HomePage.tsx with Footer component
- [x] Created /pages/Login/LoginPage.tsx  
- [ ] Next: Create remaining pages by priority

## Next Steps

1. Create remaining high-priority pages (Flights, Search, Hotels, Admin, Vendor)
2. Update MainApp.tsx to use new paths
3. Test navigation
4. Create remaining pages
5. Delete old root-level page files
