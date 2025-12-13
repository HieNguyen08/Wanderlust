import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useAppNavigate } from "./router/useAppNavigate";
import { tokenService } from "./utils/api";
import { type FrontendRole } from "./utils/roleMapper";

export type PageType = "home" | "flights" | "flight-detail" | "booking" | "checkout" | "payment-callback" | "payment-success" | "payment-cancel" | "stripe-payment-success" | "stripe-payment-cancel" | "confirmation" | "offers" | "hotel" | "hotel-list" | "hotel-detail" | "visa" | "visa-article" | "visa-consultation" | "visa-tracking" | "visa-application" | "visa-documents" | "visa-payment" | "visa-confirmation" | "activities" | "activity-detail" | "travel-guide" | "guide-detail" | "travel-article" | "about" | "promotions" | "tour-detail" | "car-rental" | "car-list" | "car-detail" | "profile" | "booking-history" | "saved-items" | "vouchers" | "wallet" | "topup-wallet" | "settings" | "payment-history" | "payment-methods" | "flight-review" | "hotel-review" | "car-review" | "activity-review" | "admin-dashboard" | "admin-users" | "admin-bookings" | "admin-flights" | "admin-activities" | "admin-reviews" | "admin-reports" | "admin-settings" | "admin-refunds" | "admin-refund-wallet" | "admin-pending-services" | "admin-vouchers" | "vendor-dashboard" | "vendor-services" | "vendor-bookings" | "vendor-reviews" | "vendor-reports" | "vendor-settings" | "vendor-vouchers" | "login" | "login-success" | "location-detail" | "seat-selection";

export default function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { navigateTo } = useAppNavigate();
  const [userRole, setUserRole] = useState<FrontendRole | null>(null);

  // DEBUG: Log current page to console
  useEffect(() => {
    console.log("🌐 Current URL:", window.location.href);
    console.log("📍 Current path:", location.pathname);
    console.log("👤 User role:", userRole);
    console.log("🔍 URL has token?", window.location.search.includes('token'));
  }, [location, userRole]);

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

  const handleLogin = (role: FrontendRole) => {
    setUserRole(role);
    console.log("Logged in as:", role);
  };

  const handleLogout = () => {
    setUserRole(null);
    tokenService.clearAuth(); // Clear localStorage
    console.log("Logged out");
    navigate("/");
  };

  // Pages that should NOT show Header
  const pagesWithoutHeader = ["/login"];
  const shouldShowHeader = !pagesWithoutHeader.includes(location.pathname);

  return (
    <NotificationProvider>
      <div>
        {/* Header - shown on all pages except login */}
        {shouldShowHeader && (
          <Header
            currentPage={location.pathname as any}
            onNavigate={navigateTo}
            userRole={userRole}
            onLogout={handleLogout}
          />
        )}
        {/* Outlet renders the matched child route */}
        <Outlet context={{ onNavigate: navigateTo, userRole, onLogin: handleLogin, onLogout: handleLogout }} />
      </div>
    </NotificationProvider>
  );
}
