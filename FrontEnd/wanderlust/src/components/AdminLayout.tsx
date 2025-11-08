import { ReactNode } from "react";
import { 
  LayoutDashboard, Users, BookOpen, Hotel, Activity, 
  Star, BarChart3, Settings, LogOut, Menu, X,
  Bell, Search, Home, FileText, DollarSign, Wallet, Gift, ClipboardCheck
} from "lucide-react";
import type { PageType } from "../MainApp";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  activePage?: "admin-dashboard" | "admin-users" | "admin-bookings" | "admin-hotels" | "admin-activities" | "admin-reviews" | "admin-reports" | "admin-settings" | "admin-refunds" | "admin-refund-wallet" | "admin-pending-services" | "admin-vouchers";
}

export function AdminLayout({ children, currentPage, onNavigate, activePage = "admin-dashboard" }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      label: "Quản lý Users",
      icon: Users,
      page: "admin-users" as PageType,
      badge: "2,450",
    },
    {
      id: "admin-bookings",
      label: "Quản lý Bookings",
      icon: BookOpen,
      page: "admin-bookings" as PageType,
      badge: "127",
    },
    {
      id: "admin-hotels",
      label: "Quản lý Khách sạn",
      icon: Hotel,
      page: "admin-hotels" as PageType,
      badge: null,
    },
    {
      id: "admin-activities",
      label: "Quản lý Hoạt động",
      icon: Activity,
      page: "admin-activities" as PageType,
      badge: null,
    },
    {
      id: "admin-pending-services",
      label: "Duyệt Dịch vụ",
      icon: ClipboardCheck,
      page: "admin-pending-services" as PageType,
      badge: "8",
    },
    {
      id: "admin-reviews",
      label: "Quản lý Đánh giá",
      icon: Star,
      page: "admin-reviews" as PageType,
      badge: "15",
    },
    {
      id: "admin-vouchers",
      label: "Quản lý Vouchers",
      icon: Gift,
      page: "admin-vouchers" as PageType,
      badge: null,
    },
    {
      id: "admin-refunds",
      label: "Quản lý Hoàn tiền",
      icon: DollarSign,
      page: "admin-refunds" as PageType,
      badge: "3",
    },
    {
      id: "admin-refund-wallet",
      label: "Hoàn tiền vào Ví",
      icon: Wallet,
      page: "admin-refund-wallet" as PageType,
      badge: "2",
    },
    {
      id: "admin-reports",
      label: "Báo cáo & Thống kê",
      icon: BarChart3,
      page: "admin-reports" as PageType,
      badge: null,
    },
    {
      id: "admin-settings",
      label: "Cài đặt",
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
                userRole="admin"
              />
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
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
                <span>Trang chủ</span>
              </button>
              
              {/* Logout */}
              <button
                onClick={() => {
                  // TODO: Clear admin session
                  onNavigate("home");
                }}
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
