import {
    Activity,
    BarChart3,
    BookOpen,
    Car,
    Check,
    ChevronDown,
    Globe,
    Home,
    Hotel,
    LayoutDashboard,
    LogOut, Menu,
    Package,
    Plane,
    RefreshCw,
    Settings,
    Star,
    Ticket,
    X
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import avatarMan from '../assets/images/avatarman.jpeg';
import avatarOther from '../assets/images/avatarother.jpeg';
import avatarWoman from '../assets/images/avatarwoman.jpeg';
import type { PageType } from "../MainApp";
import { tokenService, vendorApi } from "../utils/api";
import { NotificationDropdown } from "./NotificationDropdown";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface VendorLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  onLogout?: () => void;
  activePage?: "vendor-dashboard" | "vendor-services" | "vendor-bookings" | "vendor-refunds" | "vendor-reviews" | "vendor-vouchers" | "vendor-reports" | "vendor-settings";
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

export function VendorLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  activePage = "vendor-dashboard",
  vendorType = "hotel"
}: VendorLayoutProps) {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Get user data from localStorage
  const userData = tokenService.getUserData() || {};
  const displayName = userData?.firstName || "Vendor";
  const userEmail = userData?.email || "vendor@wanderlust.com";

  // Get avatar based on gender
  const getAvatarSrc = (userData: any): string => {
    if (userData?.avatar) {
      return userData.avatar;
    }
    const gender = userData?.gender?.toUpperCase();
    switch (gender) {
      case 'MALE':
        return avatarMan;
      case 'FEMALE':
        return avatarWoman;
      case 'OTHER':
        return avatarOther;
      default:
        return avatarOther;
    }
  };

  // Language options
  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "VN" },
    { code: "en", name: "English", flag: "EN" },
    { code: "ja", name: "日本語", flag: "JP" },
    { code: "ko", name: "한국어", flag: "KR" },
  ];

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode).then(() => {
      localStorage.setItem('i18nextLng', langCode);
      setLanguageDropdownOpen(false);
    });
  };

  // Handle logout
  const handleLogout = () => {
    tokenService.clearAuth();
    if (onLogout) {
      onLogout();
    } else {
      onNavigate("home");
    }
  };

  const vendorInfo = {
    hotel: {
      name: "JW Marriott Phu Quoc",
      type: t('vendor.hotel'),
      icon: Hotel,
      color: "blue",
    },
    activity: {
      name: "VinWonders Entertainment",
      type: t('vendor.activity'),
      icon: Activity,
      color: "green",
    },
    car: {
      name: "Premium Car Rental",
      type: t('vendor.carRental'),
      icon: Car,
      color: "purple",
    },
    airline: {
      name: "Vietnam Airlines",
      type: "Hãng hàng không",
      icon: Plane,
      color: "orange",
    },
  };

  const currentVendor = vendorInfo[vendorType];
  const VendorIcon = currentVendor.icon;

  // State for sidebar badges
  const [counts, setCounts] = useState({
    bookings: 0,
    reviews: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userId = userData?.id; // Assuming userData contains id. If tokenService.getUserData() returns id, verify property path.
        // NOTE: tokenService.getUserData() might return object with 'id' or 'userId'. 
        // Based on previous code, let's proceed. If userId is needed for reviews.

        // Fetch Bookings
        const bookings = await vendorApi.getVendorBookings();
        // The API returns List<BookingDTO>. Filter for PENDING status.
        // Assuming BookingDTO has 'status' field.
        const pendingBookings = Array.isArray(bookings)
          ? bookings.filter((b: any) => String(b.status).toLowerCase() === 'pending').length
          : 0;

        // Fetch Reviews
        // vendorApi.getVendorReviews requires vendorId. 
        // We need to be sure we have the vendorId. 
        // If the user IS the vendor, their ID is the vendorId.
        let pendingReviews = 0;
        if (userData?.id) {
          try {
            const reviewsPage = await vendorApi.getVendorReviews(userData.id, { page: 0, size: 50 });
            const reviews = Array.isArray((reviewsPage as any)?.content)
              ? (reviewsPage as any).content
              : Array.isArray(reviewsPage)
                ? reviewsPage
                : [];

            // ReviewCommentDTO likely has 'hasResponse' or 'response' field.
            pendingReviews = reviews.filter((r: any) => !r.hasResponse && !r.response).length;
          } catch (err) {
            console.error("Failed to fetch vendor reviews", err);
          }
        }

        setCounts({
          bookings: pendingBookings,
          reviews: pendingReviews
        });

      } catch (error) {
        console.error("Failed to fetch sidebar counts", error);
      }
    };

    fetchCounts();
  }, []);

  const menuItems = [
    {
      id: "vendor-dashboard",
      label: t('vendor.dashboard'),
      icon: LayoutDashboard,
      page: "vendor-dashboard" as PageType,
      badge: null,
    },
    {
      id: "vendor-services",
      label: vendorType === "hotel" ? t('vendor.hotelRooms') : vendorType === "activity" ? t('vendor.activities') : vendorType === "car" ? t('vendor.cars') : t('vendor.flights'),
      icon: Package,
      page: "vendor-services" as PageType,
      badge: null,
    },
    {
      id: "vendor-bookings",
      label: t('vendor.bookings'),
      icon: BookOpen,
      page: "vendor-bookings" as PageType,
      badge: counts.bookings > 0 ? counts.bookings.toString() : null,
    },
    {
      id: "vendor-refunds",
      label: t('vendor.refunds', 'Hoàn tiền'),
      icon: RefreshCw,
      page: "vendor-refunds" as PageType,
      badge: null,
    },
    {
      id: "vendor-reviews",
      label: t('vendor.reviews'),
      icon: Star,
      page: "vendor-reviews" as PageType,
      badge: counts.reviews > 0 ? counts.reviews.toString() : null,
    },
    {
      id: "vendor-vouchers",
      label: t('vendor.vouchers'),
      icon: Ticket,
      page: "vendor-vouchers" as PageType,
      badge: null,
    },
    {
      id: "vendor-reports",
      label: t('admin.reports'),
      icon: BarChart3,
      page: "vendor-reports" as PageType,
      badge: null,
    },
    {
      id: "vendor-settings",
      label: t('common.settings'),
      icon: Settings,
      page: "vendor-settings" as PageType,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <h1
              className="font-['Kadwa',_serif] text-2xl text-blue-600 cursor-pointer"
              onClick={() => onNavigate("home")}
            >
              Wanderlust Vendor
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {languages.find(l => l.code === i18n.language)?.flag || "EN"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {languageDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLanguageDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">{lang.flag}</span>
                          <span className="text-sm text-gray-700">{lang.name}</span>
                        </div>
                        {i18n.language === lang.code && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Back to Home Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("home")}
              className="hidden md:flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Button>

            {/* Notifications */}
            <div className="relative">
              <NotificationDropdown
                onNavigate={onNavigate}
                userRole="vendor"
              />
            </div>

            {/* Vendor Profile */}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <img
                src={getAvatarSrc(userData)}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r w-64 
            transition-transform duration-300 z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.page);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                    ${isActive
                      ? `bg-${currentVendor.color}-50 text-${currentVendor.color}-600 font-medium`
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}

            {/* Back to Home - Mobile */}
            <div className="pt-4 border-t mt-4 space-y-1">
              <button
                onClick={() => onNavigate("home")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Trang chủ</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-4rem)] pt-[calc(4rem+1.5rem)]">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
