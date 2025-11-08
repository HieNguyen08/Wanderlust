import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { tokenService } from "./utils/api"; // Import tokenService

// NEW STRUCTURE - Import from /pages
import HomePage from "./pages/Home/HomePage";
import { LoginPage } from "./LoginPage"; // CHANGED: Use root LoginPage with real API
import { LoginSuccessPage } from "./LoginSuccessPage"; // OAuth2 callback handler

// OLD STRUCTURE - Still using root imports for now
import FlightsPage from "./FlightsPage";
import SearchPage from "./SearchPage";
import BookingDetailsPage from "./BookingDetailsPage";
import ConfirmationPage from "./ConfirmationPage";
import OffersPage from "./OffersPage";
import HotelLandingPage from "./HotelLandingPage";
import HotelListPage from "./HotelListPage";
import HotelDetailPage from "./HotelDetailPage";
import VisaLandingPage from "./VisaLandingPage";
import VisaArticleDetailPage from "./VisaArticleDetailPage";
import VisaConsultationPage from "./VisaConsultationPage";
import VisaTrackingPage from "./VisaTrackingPage";
import VisaApplicationPage from "./VisaApplicationPage";
import VisaDocumentsPage from "./VisaDocumentsPage";
import VisaPaymentPage from "./VisaPaymentPage";
import VisaConfirmationPage from "./VisaConfirmationPage";
import ActivitiesPage from "./ActivitiesPage";
import ActivityDetailPage from "./ActivityDetailPage";
import TravelGuidePage from "./TravelGuidePage";
import GuideDetailPage from "./GuideDetailPage";
import AboutPage from "./AboutPage";
import PromotionsPage from "./PromotionsPage";
import TourDetailPage from "./TourDetailPage";
import CarRentalLandingPage from "./CarRentalLandingPage";
import CarRentalListPage from "./CarRentalListPage";
import CarDetailPage from "./CarDetailPage";
import ProfilePage from "./ProfilePage";
import BookingHistoryPage from "./BookingHistoryPage";
import SavedItemsPage from "./SavedItemsPage";
import SettingsPage from "./SettingsPage";
import PaymentMethodsPage from "./PaymentMethodsPage";
import AdminDashboard from "./AdminDashboard";
import AdminUsersPage from "./AdminUsersPage";
import AdminBookingsPage from "./AdminBookingsPage";
import AdminHotelsPage from "./AdminHotelsPage";
import AdminActivitiesPage from "./AdminActivitiesPage";
import AdminReviewsPage from "./AdminReviewsPage";
import AdminReportsPage from "./AdminReportsPage";
import AdminSettingsPage from "./AdminSettingsPage";
import AdminRefundsPage from "./AdminRefundsPage";
import AdminRefundWalletPage from "./AdminRefundWalletPage";
import AdminPendingServicesPage from "./AdminPendingServicesPage";
import VendorDashboard from "./VendorDashboard";
import VendorServicesPage from "./VendorServicesPage";
import VendorBookingsPage from "./VendorBookingsPage";
import VendorReviewsPage from "./VendorReviewsPage";
import VendorReportsPage from "./VendorReportsPage";
import VendorSettingsPage from "./VendorSettingsPage";
import UserWalletPage from "./UserWalletPage";
import TopUpWalletPage from "./TopUpWalletPage";
import TravelArticlePage from "./TravelArticlePage";
import AdminVouchersPage from "./AdminVouchersPage";
import VendorVouchersPage from "./VendorVouchersPage";
import UserVouchersPage from "./UserVouchersPage";
import FlightReviewPage from "./FlightReviewPage";
import HotelReviewPage from "./HotelReviewPage";
import CarRentalReviewPage from "./CarRentalReviewPage";
import ActivityReviewPage from "./ActivityReviewPage";

export type PageType = "home" | "flights" | "search" | "booking" | "confirmation" | "offers" | "hotel" | "hotel-list" | "hotel-detail" | "visa" | "visa-article" | "visa-consultation" | "visa-tracking" | "visa-application" | "visa-documents" | "visa-payment" | "visa-confirmation" | "activities" | "activity-detail" | "travel-guide" | "guide-detail" | "travel-article" | "about" | "promotions" | "tour-detail" | "car-rental" | "car-list" | "car-detail" | "profile" | "booking-history" | "saved-items" | "vouchers" | "wallet" | "topup-wallet" | "settings" | "payment-methods" | "flight-review" | "hotel-review" | "car-review" | "activity-review" | "admin-dashboard" | "admin-users" | "admin-bookings" | "admin-hotels" | "admin-activities" | "admin-reviews" | "admin-reports" | "admin-settings" | "admin-refunds" | "admin-refund-wallet" | "admin-pending-services" | "admin-vouchers" | "vendor-dashboard" | "vendor-services" | "vendor-bookings" | "vendor-reviews" | "vendor-reports" | "vendor-settings" | "vendor-vouchers" | "login" | "login-success";

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  
  // DEBUG: Log current page to console
  useEffect(() => {
    console.log("📍 Current page:", currentPage);
  }, [currentPage]);
  const [pageData, setPageData] = useState<any>(null);
  const [userRole, setUserRole] = useState<"user" | "admin" | "vendor" | null>(null);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const userData = tokenService.getUserData();
    if (userData && userData.role) {
      setUserRole(userData.role as "user" | "admin" | "vendor");
      console.log("Restored session for:", userData.role);
    }
  }, []);

  const handleNavigate = (page: PageType, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const handleLogin = (role: "user" | "admin" | "vendor") => {
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
      {currentPage === "hotel-detail" && pageData && <HotelDetailPage hotel={pageData} onNavigate={handleNavigate} />}
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
      {currentPage === "guide-detail" && pageData && <GuideDetailPage destination={pageData} onNavigate={handleNavigate} />}
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
      {currentPage === "payment-methods" && <PaymentMethodsPage onNavigate={handleNavigate} bookingData={pageData} />}
      {currentPage === "flight-review" && <FlightReviewPage onNavigate={handleNavigate} flightData={pageData} />}
      {currentPage === "hotel-review" && <HotelReviewPage onNavigate={handleNavigate} hotelData={pageData} />}
      {currentPage === "car-review" && <CarRentalReviewPage onNavigate={handleNavigate} carData={pageData} />}
      {currentPage === "activity-review" && <ActivityReviewPage onNavigate={handleNavigate} activityData={pageData} />}
      {currentPage === "admin-dashboard" && <AdminDashboard onNavigate={handleNavigate} />}
      {currentPage === "admin-users" && <AdminUsersPage onNavigate={handleNavigate} />}
      {currentPage === "admin-bookings" && <AdminBookingsPage onNavigate={handleNavigate} />}
      {currentPage === "admin-hotels" && <AdminHotelsPage onNavigate={handleNavigate} />}
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
      {currentPage === "login" && <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />}
      {currentPage === "login-success" && <LoginSuccessPage onNavigate={handleNavigate} onLogin={handleLogin} />}
    </div>
  );
}
