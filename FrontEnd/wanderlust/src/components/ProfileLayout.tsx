import { ReactNode } from "react";
import { User, History, Heart, Settings, CreditCard, LogOut, Shield, Bell, Wallet, Ticket } from "lucide-react";
import type { PageType } from "../MainApp";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface ProfileLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  activePage?: "profile" | "bookings" | "saved" | "vouchers" | "wallet" | "settings" | "payment-methods";
}

export function ProfileLayout({ children, currentPage, onNavigate, activePage = "profile" }: ProfileLayoutProps) {
  const menuItems = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: User,
      page: "profile" as PageType,
    },
    {
      id: "bookings",
      label: "Lịch sử đặt chỗ",
      icon: History,
      page: "booking-history" as PageType,
    },
    {
      id: "saved",
      label: "Mục đã lưu",
      icon: Heart,
      page: "saved-items" as PageType,
    },
    {
      id: "vouchers",
      label: "Ví Voucher",
      icon: Ticket,
      page: "vouchers" as PageType,
    },
    {
      id: "wallet",
      label: "Ví của tôi",
      icon: Wallet,
      page: "wallet" as PageType,
    },
    {
      id: "payment-methods",
      label: "Phương thức thanh toán",
      icon: CreditCard,
      page: "payment-methods" as PageType,
    },
    {
      id: "settings",
      label: "Cài đặt tài khoản",
      icon: Settings,
      page: "settings" as PageType,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              {/* User Info */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nguyễn Văn A</h3>
                    <p className="text-sm text-blue-100">nguyenvana@email.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="p-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.page)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Logout Button */}
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => onNavigate("home")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
