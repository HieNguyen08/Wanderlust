import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { tokenService } from "./utils/api";
import { type FrontendRole } from "./utils/roleMapper";

// ===== PAGE IMPORTS (Organized by Feature) =====
// Home
import HomePage from "./pages/Home/HomePage";

// Auth
import { LoginPage, LoginSuccessPage } from "./pages/Auth";

// Flights
import { FlightReviewPage, FlightsPage } from "./pages/Flights";

// Hotels
import { HotelDetailPage, HotelLandingPage, HotelListPage, HotelReviewPage } from "./pages/Hotels";

// Car Rental
import { CarDetailPage, CarRentalLandingPage, CarRentalListPage, CarRentalReviewPage } from "./pages/CarRental";

// Activities
import { ActivitiesPage, ActivityDetailPage, ActivityReviewPage } from "./pages/Activities";

// Visa
import {
    VisaApplicationPage,
    VisaArticleDetailPage,
    VisaConfirmationPage,
    VisaConsultationPage,
    VisaDocumentsPage,
    VisaLandingPage,
    VisaPaymentPage,
    VisaTrackingPage
} from "./pages/Visa";

// Travel Guide
import { GuideDetailPage, TourDetailPage, TravelArticlePage, TravelGuidePage } from "./pages/TravelGuide";

// Booking
import { BookingDetailsPage, ConfirmationPage, SearchPage } from "./pages/Booking";

// Profile (User)
import {
    BookingHistoryPage,
    PaymentMethodsPage,
    ProfilePage,
    SavedItemsPage,
    SavedPaymentMethodsPage,
    SettingsPage,
    TopUpWalletPage,
    UserVouchersPage,
    UserWalletPage
} from "./pages/Profile";

// Admin
import {
    AdminActivitiesPage,
    AdminBookingsPage,
    AdminDashboard,
    AdminFlightsPage,
    AdminPendingServicesPage,
    AdminRefundsPage,
    AdminRefundWalletPage,
    AdminReportsPage,
    AdminReviewsPage,
    AdminSettingsPage,
    AdminUsersPage,
    AdminVouchersPage
} from "./pages/Admin";

// Vendor
import {
    VendorBookingsPage,
    VendorDashboard,
    VendorReportsPage,
    VendorReviewsPage,
    VendorServicesPage,
    VendorSettingsPage,
    VendorVouchersPage
} from "./pages/Vendor";

// Others
import { AboutPage, OffersPage, PromotionsPage } from "./pages/Others";

export type PageType = "home" | "flights" | "search" | "booking" | "confirmation" | "offers" | "hotel" | "hotel-list" | "hotel-detail" | "visa" | "visa-article" | "visa-consultation" | "visa-tracking" | "visa-application" | "visa-documents" | "visa-payment" | "visa-confirmation" | "activities" | "activity-detail" | "travel-guide" | "guide-detail" | "travel-article" | "about" | "promotions" | "tour-detail" | "car-rental" | "car-list" | "car-detail" | "profile" | "booking-history" | "saved-items" | "vouchers" | "wallet" | "topup-wallet" | "settings" | "saved-payment-methods" | "payment-methods" | "flight-review" | "hotel-review" | "car-review" | "activity-review" | "admin-dashboard" | "admin-users" | "admin-bookings" | "admin-flights" | "admin-activities" | "admin-reviews" | "admin-reports" | "admin-settings" | "admin-refunds" | "admin-refund-wallet" | "admin-pending-services" | "admin-vouchers" | "vendor-dashboard" | "vendor-services" | "vendor-bookings" | "vendor-reviews" | "vendor-reports" | "vendor-settings" | "vendor-vouchers" | "login" | "login-success";

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [pageData, setPageData] = useState<any>(null);
  const [userRole, setUserRole] = useState<FrontendRole | null>(null);
  
  // DEBUG: Log current page to console
  useEffect(() => {
    console.log("📍 Current page:", currentPage);
    console.log("📦 Page data:", pageData);
    console.log("👤 User role:", userRole);
    console.log("🌐 Current URL:", window.location.href);
    console.log("🔍 URL has token?", window.location.search.includes('token'));
  }, [currentPage, pageData, userRole]);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const token = tokenService.getToken();
    const userData = tokenService.getUserData();
    
    // Chỉ restore session nếu CÓ token hợp lệ
    if (token && userData && userData.role) {
      setUserRole(userData.role as FrontendRole);
      console.log("✅ Restored session for:", userData.role);
    } else {
      // Nếu không có token hoặc userData không hợp lệ, xóa session
      if (!token || !userData) {
        console.log("⚠️ Invalid session detected, clearing...");
        tokenService.clearAuth();
        setUserRole(null);
      }
    }
  }, []);

  // **NEW: Detect URL path and auto-navigate**
  useEffect(() => {
    const path = window.location.pathname;
    console.log("🛣️ Detected URL path:", path);
    
    if (path === '/login-success' && window.location.search.includes('token')) {
      console.log("🚀 Auto-navigating to login-success page!");
      setCurrentPage('login-success');
    }
  }, []);

  const handleNavigate = (page: PageType, data?: any) => {
    console.log("🧭 handleNavigate called:", { from: currentPage, to: page, data });
    setCurrentPage(page);
    setPageData(data);
  };

  const handleLogin = (role: FrontendRole) => {
    setUserRole(role);
    console.log("Logged in as:", role);
  };

  const handleLogout = () => {
    setUserRole(null);
    tokenService.clearAuth(); // Clear localStorage
    console.log("Logged out");
  };

  // Pages that should NOT show Header
  const pagesWithoutHeader: PageType[] = ["login"];
  const shouldShowHeader = !pagesWithoutHeader.includes(currentPage);

  return (
    <div>
      {/* Header - shown on all pages except login */}
      {shouldShowHeader && (
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          userRole={userRole}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "flights" && <FlightsPage onNavigate={handleNavigate} />}
      {currentPage === "search" && <SearchPage onNavigate={handleNavigate} searchData={pageData} />}
      {currentPage === "booking" && <BookingDetailsPage onNavigate={handleNavigate} />}
      {currentPage === "confirmation" && <ConfirmationPage onNavigate={handleNavigate} />}
      {currentPage === "offers" && <OffersPage onNavigate={handleNavigate} />}
      {currentPage === "hotel" && <HotelLandingPage onNavigate={handleNavigate} />}
      {currentPage === "hotel-list" && <HotelListPage searchParams={pageData} onNavigate={handleNavigate} />}
      {currentPage === "hotel-detail" && pageData && <HotelDetailPage hotel={pageData} hotelId={pageData.id || pageData.hotelId} onNavigate={handleNavigate} />}
      {currentPage === "visa" && <VisaLandingPage onNavigate={handleNavigate} />}
      {currentPage === "visa-article" && pageData && <VisaArticleDetailPage article={pageData} onNavigate={handleNavigate} />}
      {currentPage === "visa-consultation" && <VisaConsultationPage requestData={pageData} onNavigate={handleNavigate} />}
      {currentPage === "visa-tracking" && <VisaTrackingPage trackingData={pageData} onNavigate={handleNavigate} />}
      {currentPage === "visa-application" && <VisaApplicationPage country={pageData?.country} onNavigate={handleNavigate} />}
      {currentPage === "visa-documents" && <VisaDocumentsPage country={pageData?.country} formData={pageData?.formData} onNavigate={handleNavigate} />}
      {currentPage === "visa-payment" && <VisaPaymentPage country={pageData?.country} formData={pageData?.formData} documents={pageData?.documents} onNavigate={handleNavigate} />}
      {currentPage === "visa-confirmation" && <VisaConfirmationPage {...pageData} onNavigate={handleNavigate} />}
      {currentPage === "activities" && <ActivitiesPage initialCategory={pageData?.category} onNavigate={handleNavigate} />}
      {currentPage === "activity-detail" && pageData && <ActivityDetailPage activity={pageData} onNavigate={handleNavigate} />}
      {currentPage === "travel-guide" && <TravelGuidePage onNavigate={handleNavigate} />}
      {currentPage === "guide-detail" && pageData && <GuideDetailPage guide={pageData.guide} onNavigate={handleNavigate} />}
      {currentPage === "travel-article" && pageData && <TravelArticlePage article={pageData.article} onNavigate={handleNavigate} />}
      {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
      {currentPage === "promotions" && <PromotionsPage onNavigate={handleNavigate} />}
      {currentPage === "tour-detail" && pageData && <TourDetailPage tour={pageData} onNavigate={handleNavigate} />}
      {currentPage === "car-rental" && <CarRentalLandingPage onNavigate={handleNavigate} />}
      {currentPage === "car-list" && <CarRentalListPage onNavigate={handleNavigate} />}
      {currentPage === "car-detail" && pageData && <CarDetailPage car={pageData} onNavigate={handleNavigate} />}
      {currentPage === "profile" && <ProfilePage onNavigate={handleNavigate} />}
      {currentPage === "booking-history" && <BookingHistoryPage onNavigate={handleNavigate} />}
      {currentPage === "saved-items" && <SavedItemsPage onNavigate={handleNavigate} />}
      {currentPage === "vouchers" && <UserVouchersPage onNavigate={handleNavigate} />}
      {currentPage === "wallet" && <UserWalletPage onNavigate={handleNavigate} />}
      {currentPage === "topup-wallet" && <TopUpWalletPage onNavigate={handleNavigate} />}
      {currentPage === "settings" && <SettingsPage onNavigate={handleNavigate} />}
      {currentPage === "saved-payment-methods" && <SavedPaymentMethodsPage onNavigate={handleNavigate} />}
      {currentPage === "payment-methods" && <PaymentMethodsPage onNavigate={handleNavigate} bookingData={pageData} />}
      {currentPage === "flight-review" && <FlightReviewPage onNavigate={handleNavigate} flightData={pageData} />}
      {currentPage === "hotel-review" && <HotelReviewPage onNavigate={handleNavigate} hotelData={pageData} />}
      {currentPage === "car-review" && <CarRentalReviewPage onNavigate={handleNavigate} carData={pageData} />}
      {currentPage === "activity-review" && <ActivityReviewPage onNavigate={handleNavigate} activityData={pageData} />}
      {currentPage === "admin-dashboard" && <AdminDashboard onNavigate={handleNavigate} />}
      {currentPage === "admin-users" && <AdminUsersPage onNavigate={handleNavigate} />}
      {currentPage === "admin-bookings" && <AdminBookingsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-flights" && <AdminFlightsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-activities" && <AdminActivitiesPage onNavigate={handleNavigate} />}
      {currentPage === "admin-reviews" && <AdminReviewsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-reports" && <AdminReportsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-settings" && <AdminSettingsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-refunds" && <AdminRefundsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-refund-wallet" && <AdminRefundWalletPage onNavigate={handleNavigate} />}
      {currentPage === "admin-pending-services" && <AdminPendingServicesPage onNavigate={handleNavigate} />}
      {currentPage === "admin-vouchers" && <AdminVouchersPage onNavigate={handleNavigate} />}
      {currentPage === "vendor-dashboard" && <VendorDashboard onNavigate={handleNavigate} />}
      {currentPage === "vendor-services" && <VendorServicesPage onNavigate={handleNavigate} />}
      {currentPage === "vendor-bookings" && <VendorBookingsPage onNavigate={handleNavigate} />}
      {currentPage === "vendor-reviews" && <VendorReviewsPage onNavigate={handleNavigate} />}
      {currentPage === "vendor-reports" && <VendorReportsPage onNavigate={handleNavigate} />}
      {currentPage === "vendor-settings" && <VendorSettingsPage onNavigate={handleNavigate} />}
      {currentPage === "vendor-vouchers" && <VendorVouchersPage onNavigate={handleNavigate} />}
      {currentPage === "login" && <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} initialMode={pageData?.mode} />}
      {currentPage === "login-success" && <LoginSuccessPage onNavigate={handleNavigate} onLogin={handleLogin} />}
    </div>
  );
}
