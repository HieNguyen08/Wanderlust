import { ReactNode } from "react";
import { 
  LayoutDashboard, Package, BookOpen, Star, 
  BarChart3, Settings, LogOut, Menu, X,
  Bell, Search, Hotel, Activity, Car, Plane, Home, Ticket
} from "lucide-react";
import type { PageType } from "../MainApp";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";

interface VendorLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  activePage?: "vendor-dashboard" | "vendor-services" | "vendor-bookings" | "vendor-reviews" | "vendor-vouchers" | "vendor-reports" | "vendor-settings";
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

export function VendorLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  activePage = "vendor-dashboard",
  vendorType = "hotel"
}: VendorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const vendorInfo = {
    hotel: {
      name: "JW Marriott Phu Quoc",
      type: "Khách sạn",
      icon: Hotel,
      color: "blue",
    },
    activity: {
      name: "VinWonders Entertainment",
      type: "Hoạt động vui chơi",
      icon: Activity,
      color: "green",
    },
    car: {
      name: "Premium Car Rental",
      type: "Thuê xe",
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

  const menuItems = [
    {
      id: "vendor-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      page: "vendor-dashboard" as PageType,
      badge: null,
    },
    {
      id: "vendor-services",
      label: vendorType === "hotel" ? "Khách sạn & Phòng" : vendorType === "activity" ? "Hoạt động" : vendorType === "car" ? "Xe" : "Chuyến bay",
      icon: Package,
      page: "vendor-services" as PageType,
      badge: null,
    },
    {
      id: "vendor-bookings",
      label: "Đơn đặt chỗ",
      icon: BookOpen,
      page: "vendor-bookings" as PageType,
      badge: "12",
    },
    {
      id: "vendor-reviews",
      label: "Đánh giá",
      icon: Star,
      page: "vendor-reviews" as PageType,
      badge: "3",
    },
    {
      id: "vendor-vouchers",
      label: "Vouchers",
      icon: Ticket,
      page: "vendor-vouchers" as PageType,
      badge: null,
    },
    {
      id: "vendor-reports",
      label: "Báo cáo",
      icon: BarChart3,
      page: "vendor-reports" as PageType,
      badge: null,
    },
    {
      id: "vendor-settings",
      label: "Cài đặt",
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
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${currentVendor.color}-100 rounded-lg flex items-center justify-center`}>
                <VendorIcon className={`w-6 h-6 text-${currentVendor.color}-600`} />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{currentVendor.name}</h1>
                <p className="text-xs text-gray-500">{currentVendor.type}</p>
              </div>
            </div>
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
                userRole="vendor"
              />
            </div>

            {/* Vendor Profile */}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Nguyễn Văn A</p>
                <p className="text-xs text-gray-500">Quản lý</p>
              </div>
              <div className={`w-10 h-10 bg-${currentVendor.color}-600 rounded-full flex items-center justify-center text-white font-semibold`}>
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
                onClick={() => {
                  // TODO: Clear vendor session
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
