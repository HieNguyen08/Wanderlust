import {
  Activity,
  BarChart3,
  BookOpen,
  Check, ChevronDown,
  ClipboardCheck,
  DollarSign,
  Gift,
  Globe,
  Home,
  LayoutDashboard,
  LogOut, Menu,
  Plane,
  Settings,
  Star,
  Users,
  X
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { adminBookingApi } from "../api/adminBookingApi";
import { adminUserApi } from "../api/adminUserApi";
import avatarMan from '../assets/images/avatarman.jpeg';
import avatarOther from '../assets/images/avatarother.jpeg';
import avatarWoman from '../assets/images/avatarwoman.jpeg';
import type { PageType } from "../MainApp";
import { adminApi, tokenService, vendorApi } from "../utils/api";
import { NotificationDropdown } from "./NotificationDropdown";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  onLogout?: () => void;
  activePage?: "admin-dashboard" | "admin-users" | "admin-bookings" | "admin-flights" | "admin-services" | "admin-reviews" | "admin-reports" | "admin-settings" | "admin-refunds" | "admin-pending-services" | "admin-vouchers";
  adminServicesLabel?: string;
}

export function AdminLayout({ children, currentPage, onNavigate, onLogout, activePage, adminServicesLabel }: AdminLayoutProps) {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    bookings: 0,
    services: 0,
    reviews: 0,
    refunds: 0
  });

  // Calculate actual active page
  const current = activePage || currentPage || "admin-dashboard";

  // Helper to normalize response to array
  const normalizeList = (data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Parallel fetch for dashboard counts
        const [
          usersData,
          bookingsData,
          reviewsData,
          refundsData,
          hotelsData,
          activitiesData,
          carsData
        ] = await Promise.all([
          // Users: getAllUsers returns List<User>
          adminUserApi.getAllUsers().catch(() => []),

          // Bookings: getAllBookings returns List<BookingDTO>, ignores status param, so we filter client-side
          adminApi.getAllBookings().catch(() => []),

          // Pending reviews: returns List<?>
          adminApi.getPendingReviews().catch(() => []),

          // Pending refunds: bookings with refund requested
          adminBookingApi.getRefundRequests().catch(() => []),

          // Services (manual filter for pending)
          vendorApi.getServices("hotels", { size: 100 }).catch(() => ({ content: [] })),
          vendorApi.getServices("activities", { size: 100 }).catch(() => ({ content: [] })),
          vendorApi.getServices("car-rentals", { size: 100 }).catch(() => ({ content: [] }))
        ]);

        const allBookings = normalizeList(bookingsData);
        const pendingBookingsCount = allBookings.filter((b: any) => b.status === 'PENDING').length;

        const allUsers = normalizeList(usersData);
        // User count is total users
        const usersCount = allUsers.length;

        // Helper to count pending services locally
        const countPending = (list: any[]) => normalizeList(list).filter((i: any) =>
          (!i.approvalStatus || i.approvalStatus === 'PENDING') && !i.adminNote
        ).length;

        const pendingServices =
          countPending(hotelsData) +
          countPending(activitiesData) +
          countPending(carsData);

        // Reviews might return list or page
        const pendingReviewsCount = normalizeList(reviewsData).length;

        // Refunds returns Page object with totalElements
        const refundsList = normalizeList(refundsData);
        const refundsCount = refundsList.filter((r: any) => {
          const status = (r.status || '').toString().toUpperCase();
          return status === 'REFUND_REQUESTED' || status === 'PENDING';
        }).length;

        setCounts({
          users: usersCount,
          bookings: pendingBookingsCount,
          services: pendingServices,
          reviews: pendingReviewsCount,
          refunds: refundsCount
        });
      } catch (error) {
        console.error("Failed to fetch sidebar counts", error);
      }
    };

    fetchCounts();
  }, []);

  // Get user data from localStorage
  const userData = tokenService.getUserData() || {};
  const displayName = userData?.firstName || "Admin";
  const userEmail = userData?.email || "admin@wanderlust.com";

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

  const menuItems = [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      page: "admin-dashboard" as PageType,
      badge: null,
    },
    {
      id: "admin-users",
      label: t('admin.manageUsers'),
      icon: Users,
      page: "admin-users" as PageType,
      badge: counts.users > 0 ? counts.users.toLocaleString() : null,
    },
    {
      id: "admin-bookings",
      label: t('admin.manageBookings'),
      icon: BookOpen,
      page: "admin-bookings" as PageType,
      badge: counts.bookings > 0 ? counts.bookings.toLocaleString() : null,
    },
    {
      id: "admin-flights",
      label: t('admin.manageFlights'),
      icon: Plane,
      page: "admin-flights" as PageType,
      badge: null,
    },
    {
      id: "admin-services",
      label: adminServicesLabel || t('admin.manageServices'),
      icon: Activity,
      page: "admin-services" as PageType,
      badge: counts.services > 0 ? counts.services.toString() : null,
    },
    {
      id: "admin-pending-services",
      label: t('admin.approveServices'),
      icon: ClipboardCheck,
      page: "admin-pending-services" as PageType,
      badge: counts.services > 0 ? counts.services.toString() : null,
    },
    {
      id: "admin-reviews",
      label: t('admin.manageReviews'),
      icon: Star,
      page: "admin-reviews" as PageType,
      badge: counts.reviews > 0 ? counts.reviews.toString() : null,
    },
    {
      id: "admin-vouchers",
      label: t('admin.manageVouchers'),
      icon: Gift,
      page: "admin-vouchers" as PageType,
      badge: null,
    },
    {
      id: "admin-refunds",
      label: t('admin.manageRefunds'),
      icon: DollarSign,
      page: "admin-refunds" as PageType,
      badge: counts.refunds > 0 ? counts.refunds.toString() : null,
    },
    {
      id: "admin-reports",
      label: t('admin.reportsAndStatistics'),
      icon: BarChart3,
      page: "admin-reports" as PageType,
      badge: null,
    },
    {
      id: "admin-settings",
      label: t('admin.settings'),
      icon: Settings,
      page: "admin-settings" as PageType,
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
              Wanderlust Admin
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
              {t('admin.home')}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <NotificationDropdown
                onNavigate={onNavigate}
                userRole="admin"
              />
            </div>

            {/* Admin Profile */}
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
              const isActive = current === item.id;
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
                      ? 'bg-blue-50 text-blue-600 font-medium'
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
                <span>{t('admin.home')}</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('admin.logout')}</span>
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
