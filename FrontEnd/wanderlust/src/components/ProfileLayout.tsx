import { CreditCard, Heart, History, LogOut, Settings, Ticket, User, Wallet } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import avatarMan from "../assets/images/avatarman.jpeg";
import avatarOther from "../assets/images/avatarother.jpeg";
import avatarWoman from "../assets/images/avatarwoman.jpeg";
import type { PageType } from "../MainApp";
import { tokenService } from "../utils/api";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface ProfileLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  activePage?: "profile" | "bookings" | "saved" | "vouchers" | "wallet" | "settings" | "saved-payment-methods";
}

export function ProfileLayout({ children, currentPage, onNavigate, activePage = "profile" }: ProfileLayoutProps) {
  const { t } = useTranslation();
  
  // Get user data from localStorage
  const userData = tokenService.getUserData();
  const displayName = userData ? `${userData.firstName} ${userData.lastName}` : "User";
  const displayEmail = userData?.email || "user@email.com";
  
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

  const menuItems = [
    {
      id: "profile",
      label: t('auth.profile'),
      icon: User,
      page: "profile" as PageType,
    },
    {
      id: "bookings",
      label: t('auth.bookingHistory'),
      icon: History,
      page: "booking-history" as PageType,
    },
    {
      id: "saved",
      label: t('auth.savedItems'),
      icon: Heart,
      page: "saved-items" as PageType,
    },
    {
      id: "vouchers",
      label: t('profileLayout.vouchers'),
      icon: Ticket,
      page: "vouchers" as PageType,
    },
    {
      id: "wallet",
      label: t('auth.myWallet'),
      icon: Wallet,
      page: "wallet" as PageType,
    },
    {
      id: "saved-payment-methods",
      label: t('profileLayout.paymentMethods'),
      icon: CreditCard,
      page: "saved-payment-methods" as PageType,
    },
    {
      id: "settings",
      label: t('profileLayout.accountSettings'),
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
              <div className="p-6 bg-linear-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-4">
                  <img 
                    src={getAvatarSrc(userData)} 
                    alt="User Avatar" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      e.currentTarget.src = avatarOther;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{displayName}</h3>
                    <p className="text-sm text-blue-100 truncate">{displayEmail}</p>
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
                    <span>{t('auth.logout')}</span>
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
