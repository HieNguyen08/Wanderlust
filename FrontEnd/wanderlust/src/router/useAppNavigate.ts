import { useNavigate, useLocation } from "react-router-dom";
import { PageType } from "../MainApp";

/**
 * Custom hook to replace the old onNavigate callback pattern
 * Maps PageType to actual routes and handles navigation with state
 */
export function useAppNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  const pageToRoute: Record<PageType, string> = {
    "home": "/",
    "flights": "/flights",
    "seat-selection": "/flights/seat-selection",
    "flight-review": "/flights/review",
    "search": "/search",
    "booking": "/booking",
    "checkout": "/checkout",
    "payment-callback": "/payment/callback",
    "payment-success": "/payment/success",
    "payment-cancel": "/payment/cancel",
    "stripe-payment-success": "/stripe/payment-success",
    "stripe-payment-cancel": "/stripe/payment-cancel",
    "confirmation": "/confirmation",
    "offers": "/offers",
    "hotel": "/hotels",
    "hotel-list": "/hotels/list",
    "hotel-detail": "/hotels/:id", // Will be replaced dynamically
    "hotel-review": "/hotels/review",
    "visa": "/visa",
    "visa-article": "/visa/article/:id", // Will be replaced dynamically
    "visa-consultation": "/visa/consultation",
    "visa-tracking": "/visa/tracking",
    "visa-application": "/visa/application",
    "visa-documents": "/visa/documents",
    "visa-payment": "/visa/payment",
    "visa-confirmation": "/visa/confirmation",
    "activities": "/activities",
    "activity-detail": "/activities/:id", // Will be replaced dynamically
    "activity-review": "/activities/review",
    "travel-guide": "/travel-guide",
    "guide-detail": "/travel-guide/:id", // Will be replaced dynamically
    "travel-article": "/travel-guide/article/:id", // Will be replaced dynamically
    "tour-detail": "/travel-guide/tour/:id", // Will be replaced dynamically
    "car-rental": "/car-rental",
    "car-list": "/car-rental/list",
    "car-detail": "/car-rental/:id", // Will be replaced dynamically
    "car-review": "/car-rental/review",
    "profile": "/profile",
    "booking-history": "/profile/booking-history",
    "saved-items": "/profile/saved-items",
    "vouchers": "/profile/vouchers",
    "wallet": "/profile/wallet",
    "topup-wallet": "/profile/wallet/topup",
    "settings": "/profile/settings",
    "saved-payment-methods": "/profile/payment-methods",
    "payment-methods": "/payment-methods",
    "admin-dashboard": "/admin",
    "admin-users": "/admin/users",
    "admin-bookings": "/admin/bookings",
    "admin-flights": "/admin/flights",
    "admin-activities": "/admin/activities",
    "admin-reviews": "/admin/reviews",
    "admin-reports": "/admin/reports",
    "admin-settings": "/admin/settings",
    "admin-refunds": "/admin/refunds",
    "admin-refund-wallet": "/admin/refund-wallet",
    "admin-pending-services": "/admin/pending-services",
    "admin-vouchers": "/admin/vouchers",
    "vendor-dashboard": "/vendor",
    "vendor-services": "/vendor/services",
    "vendor-bookings": "/vendor/bookings",
    "vendor-reviews": "/vendor/reviews",
    "vendor-reports": "/vendor/reports",
    "vendor-settings": "/vendor/settings",
    "vendor-vouchers": "/vendor/vouchers",
    "login": "/login",
    "login-success": "/login-success",
    "location-detail": "/location/:id", // Will be replaced dynamically
    "about": "/about",
    "promotions": "/promotions",
  };

  /**
   * Navigate to a page with optional data
   * @param page - The page type to navigate to
   * @param data - Optional data to pass to the next page (via location.state)
   */
  const navigateTo = (page: PageType, data?: any) => {
    let route = pageToRoute[page];

    // Handle dynamic routes (routes with :id parameter)
    if (route.includes(":id") && data) {
      // Extract id from data
      const id = data.id || data.hotelId || data.activityId || data.carId || data.guideId || data.articleId || data.tourId || data.locationId;
      if (id) {
        route = route.replace(":id", id.toString());
      }
    }

    console.log("🧭 Navigating:", { from: location.pathname, to: route, page, data });

    // Navigate with state if data is provided
    navigate(route, { state: data });
  };

  /**
   * Get the current page data from location.state
   */
  const getPageData = () => {
    return location.state;
  };

  return {
    navigateTo,
    getPageData,
    currentPath: location.pathname,
  };
}
