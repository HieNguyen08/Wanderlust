import { createBrowserRouter } from "react-router-dom";
import MainApp from "../MainApp";
import { withPageProps } from "./withPageProps";

// Import page wrappers for pages with dynamic data
import {
    ActivityDetailPageWrapper,
    CarDetailPageWrapper,
    CheckoutPageWrapper,
    GuideDetailPageWrapper,
    HotelDetailPageWrapper,
    LocationDetailPageWrapper,
    PaymentSuccessPageWrapper,
    SeatSelectionPageWrapper,
    TourDetailPageWrapper,
    TravelArticlePageWrapper,
    VisaArticleDetailPageWrapper,
} from "../components/PageWrappers";

// ===== PAGE IMPORTS (Organized by Feature) =====
// Home
import HomePage from "../pages/Home/HomePage";

// Auth
import { LoginPage, LoginSuccessPage } from "../pages/Auth";

// Flights
import { FlightReviewPage, FlightsPage } from "../pages/Flights";

// Hotels
import { HotelLandingPage, HotelListPage, HotelReviewPage } from "../pages/Hotels";

// Car Rental
import { CarRentalLandingPage, CarRentalListPage, CarRentalReviewPage } from "../pages/CarRental";

// Activities
import { ActivitiesPage, ActivityReviewPage } from "../pages/Activities";

// Visa
import {
    VisaApplicationPage,
    VisaConfirmationPage,
    VisaConsultationPage,
    VisaDocumentsPage,
    VisaLandingPage,
    VisaPaymentPage,
    VisaTrackingPage
} from "../pages/Visa";

// Travel Guide
import { TravelGuidePage } from "../pages/TravelGuide";

// Booking
import { BookingDetailsPage, ConfirmationPage, SearchPage } from "../pages/Booking";
import PaymentCallbackPage from "../pages/Booking/PaymentCallbackPage";
import PaymentCancelPage from "../pages/Booking/PaymentCancelPage";

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
} from "../pages/Profile";

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
} from "../pages/Admin";

// Vendor
import {
    VendorBookingsPage,
    VendorDashboard,
    VendorReportsPage,
    VendorReviewsPage,
    VendorServicesPage,
    VendorSettingsPage,
    VendorVouchersPage
} from "../pages/Vendor";

// Others
import { AboutPage, OffersPage, PromotionsPage } from "../pages/Others";

// Stripe Payment Pages (for Wallet Top-up)
import { PaymentCancel as StripePaymentCancel, PaymentSuccess as StripePaymentSuccess } from "../pages/StripePaymentPage";

// Wrap all simple pages with HOC to inject props
const HomePageWrapped = withPageProps(HomePage);
const LoginPageWrapped = withPageProps(LoginPage);
const LoginSuccessPageWrapped = withPageProps(LoginSuccessPage);
const FlightsPageWrapped = withPageProps(FlightsPage);
const FlightReviewPageWrapped = withPageProps(FlightReviewPage);
const HotelLandingPageWrapped = withPageProps(HotelLandingPage);
const HotelListPageWrapped = withPageProps(HotelListPage);
const HotelReviewPageWrapped = withPageProps(HotelReviewPage);
const CarRentalLandingPageWrapped = withPageProps(CarRentalLandingPage);
const CarRentalListPageWrapped = withPageProps(CarRentalListPage);
const CarRentalReviewPageWrapped = withPageProps(CarRentalReviewPage);
const ActivitiesPageWrapped = withPageProps(ActivitiesPage);
const ActivityReviewPageWrapped = withPageProps(ActivityReviewPage);
const VisaLandingPageWrapped = withPageProps(VisaLandingPage);
const VisaConsultationPageWrapped = withPageProps(VisaConsultationPage);
const VisaTrackingPageWrapped = withPageProps(VisaTrackingPage);
const VisaApplicationPageWrapped = withPageProps(VisaApplicationPage);
const VisaDocumentsPageWrapped = withPageProps(VisaDocumentsPage);
const VisaPaymentPageWrapped = withPageProps(VisaPaymentPage);
const VisaConfirmationPageWrapped = withPageProps(VisaConfirmationPage);
const TravelGuidePageWrapped = withPageProps(TravelGuidePage);
const SearchPageWrapped = withPageProps(SearchPage);
const BookingDetailsPageWrapped = withPageProps(BookingDetailsPage);
const PaymentCallbackPageWrapped = withPageProps(PaymentCallbackPage);
const PaymentCancelPageWrapped = withPageProps(PaymentCancelPage);
const ConfirmationPageWrapped = withPageProps(ConfirmationPage);
const StripePaymentSuccessWrapped = withPageProps(StripePaymentSuccess);
const StripePaymentCancelWrapped = withPageProps(StripePaymentCancel);
const ProfilePageWrapped = withPageProps(ProfilePage);
const BookingHistoryPageWrapped = withPageProps(BookingHistoryPage);
const SavedItemsPageWrapped = withPageProps(SavedItemsPage);
const UserVouchersPageWrapped = withPageProps(UserVouchersPage);
const UserWalletPageWrapped = withPageProps(UserWalletPage);
const TopUpWalletPageWrapped = withPageProps(TopUpWalletPage);
const SettingsPageWrapped = withPageProps(SettingsPage);
const SavedPaymentMethodsPageWrapped = withPageProps(SavedPaymentMethodsPage);
const PaymentMethodsPageWrapped = withPageProps(PaymentMethodsPage);
const AdminDashboardWrapped = withPageProps(AdminDashboard);
const AdminUsersPageWrapped = withPageProps(AdminUsersPage);
const AdminBookingsPageWrapped = withPageProps(AdminBookingsPage);
const AdminFlightsPageWrapped = withPageProps(AdminFlightsPage);
const AdminActivitiesPageWrapped = withPageProps(AdminActivitiesPage);
const AdminReviewsPageWrapped = withPageProps(AdminReviewsPage);
const AdminReportsPageWrapped = withPageProps(AdminReportsPage);
const AdminSettingsPageWrapped = withPageProps(AdminSettingsPage);
const AdminRefundsPageWrapped = withPageProps(AdminRefundsPage);
const AdminRefundWalletPageWrapped = withPageProps(AdminRefundWalletPage);
const AdminPendingServicesPageWrapped = withPageProps(AdminPendingServicesPage);
const AdminVouchersPageWrapped = withPageProps(AdminVouchersPage);
const VendorDashboardWrapped = withPageProps(VendorDashboard);
const VendorServicesPageWrapped = withPageProps(VendorServicesPage);
const VendorBookingsPageWrapped = withPageProps(VendorBookingsPage);
const VendorReviewsPageWrapped = withPageProps(VendorReviewsPage);
const VendorReportsPageWrapped = withPageProps(VendorReportsPage);
const VendorSettingsPageWrapped = withPageProps(VendorSettingsPage);
const VendorVouchersPageWrapped = withPageProps(VendorVouchersPage);
const OffersPageWrapped = withPageProps(OffersPage);
const AboutPageWrapped = withPageProps(AboutPage);
const PromotionsPageWrapped = withPageProps(PromotionsPage);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainApp />,
    children: [
      // Home
      { path: "/", element: <HomePageWrapped /> },
      { path: "/location/:id", element: <LocationDetailPageWrapper /> },
      
      // Auth
      { path: "/login", element: <LoginPageWrapped /> },
      { path: "/login-success", element: <LoginSuccessPageWrapped /> },
      
      // Flights
      { path: "/flights", element: <FlightsPageWrapped /> },
      { path: "/flights/seat-selection", element: <SeatSelectionPageWrapper /> },
      { path: "/flights/review", element: <FlightReviewPageWrapped /> },
      
      // Hotels
      { path: "/hotels", element: <HotelLandingPageWrapped /> },
      { path: "/hotels/list", element: <HotelListPageWrapped /> },
      { path: "/hotels/:id", element: <HotelDetailPageWrapper /> },
      { path: "/hotels/review", element: <HotelReviewPageWrapped /> },
      
      // Car Rental
      { path: "/car-rental", element: <CarRentalLandingPageWrapped /> },
      { path: "/car-rental/list", element: <CarRentalListPageWrapped /> },
      { path: "/car-rental/:id", element: <CarDetailPageWrapper /> },
      { path: "/car-rental/review", element: <CarRentalReviewPageWrapped /> },
      
      // Activities
      { path: "/activities", element: <ActivitiesPageWrapped /> },
      { path: "/activities/:id", element: <ActivityDetailPageWrapper /> },
      { path: "/activities/review", element: <ActivityReviewPageWrapped /> },
      
      // Visa
      { path: "/visa", element: <VisaLandingPageWrapped /> },
      { path: "/visa/article/:id", element: <VisaArticleDetailPageWrapper /> },
      { path: "/visa/consultation", element: <VisaConsultationPageWrapped /> },
      { path: "/visa/tracking", element: <VisaTrackingPageWrapped /> },
      { path: "/visa/application", element: <VisaApplicationPageWrapped /> },
      { path: "/visa/documents", element: <VisaDocumentsPageWrapped /> },
      { path: "/visa/payment", element: <VisaPaymentPageWrapped /> },
      { path: "/visa/confirmation", element: <VisaConfirmationPageWrapped /> },
      
      // Travel Guide
      { path: "/travel-guide", element: <TravelGuidePageWrapped /> },
      { path: "/travel-guide/:id", element: <GuideDetailPageWrapper /> },
      { path: "/travel-guide/article/:id", element: <TravelArticlePageWrapper /> },
      { path: "/travel-guide/tour/:id", element: <TourDetailPageWrapper /> },
      
      // Booking
      { path: "/search", element: <SearchPageWrapped /> },
      { path: "/booking", element: <BookingDetailsPageWrapped /> },
      { path: "/checkout", element: <CheckoutPageWrapper /> },
      { path: "/payment/callback", element: <PaymentCallbackPageWrapped /> },
      { path: "/payment/success", element: <PaymentSuccessPageWrapper /> },
      { path: "/payment/cancel", element: <PaymentCancelPageWrapped /> },
      { path: "/confirmation", element: <ConfirmationPageWrapped /> },
      
      // Stripe Payment (Wallet)
      { path: "/stripe/payment-success", element: <StripePaymentSuccessWrapped /> },
      { path: "/stripe/payment-cancel", element: <StripePaymentCancelWrapped /> },
      
      // Profile
      { path: "/profile", element: <ProfilePageWrapped /> },
      { path: "/profile/booking-history", element: <BookingHistoryPageWrapped /> },
      { path: "/profile/saved-items", element: <SavedItemsPageWrapped /> },
      { path: "/profile/vouchers", element: <UserVouchersPageWrapped /> },
      { path: "/profile/wallet", element: <UserWalletPageWrapped /> },
      { path: "/profile/wallet/topup", element: <TopUpWalletPageWrapped /> },
      { path: "/profile/settings", element: <SettingsPageWrapped /> },
      { path: "/profile/payment-methods", element: <SavedPaymentMethodsPageWrapped /> },
      { path: "/payment-methods", element: <PaymentMethodsPageWrapped /> },
      
      // Admin
      { path: "/admin", element: <AdminDashboardWrapped /> },
      { path: "/admin/users", element: <AdminUsersPageWrapped /> },
      { path: "/admin/bookings", element: <AdminBookingsPageWrapped /> },
      { path: "/admin/flights", element: <AdminFlightsPageWrapped /> },
      { path: "/admin/activities", element: <AdminActivitiesPageWrapped /> },
      { path: "/admin/reviews", element: <AdminReviewsPageWrapped /> },
      { path: "/admin/reports", element: <AdminReportsPageWrapped /> },
      { path: "/admin/settings", element: <AdminSettingsPageWrapped /> },
      { path: "/admin/refunds", element: <AdminRefundsPageWrapped /> },
      { path: "/admin/refund-wallet", element: <AdminRefundWalletPageWrapped /> },
      { path: "/admin/pending-services", element: <AdminPendingServicesPageWrapped /> },
      { path: "/admin/vouchers", element: <AdminVouchersPageWrapped /> },
      
      // Vendor
      { path: "/vendor", element: <VendorDashboardWrapped /> },
      { path: "/vendor/services", element: <VendorServicesPageWrapped /> },
      { path: "/vendor/bookings", element: <VendorBookingsPageWrapped /> },
      { path: "/vendor/reviews", element: <VendorReviewsPageWrapped /> },
      { path: "/vendor/reports", element: <VendorReportsPageWrapped /> },
      { path: "/vendor/settings", element: <VendorSettingsPageWrapped /> },
      { path: "/vendor/vouchers", element: <VendorVouchersPageWrapped /> },
      
      // Others
      { path: "/offers", element: <OffersPageWrapped /> },
      { path: "/about", element: <AboutPageWrapped /> },
      { path: "/promotions", element: <PromotionsPageWrapped /> },
    ],
  },
]);
