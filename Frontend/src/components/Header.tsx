import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import type { PageType } from "../MainApp";

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Determine active page category
  const getActiveSection = (): string => {
    if (currentPage === "flights" || currentPage === "search" || currentPage === "booking" || currentPage === "confirmation" || currentPage === "offers") {
      return "flights";
    }
    if (currentPage === "hotel" || currentPage === "hotel-list" || currentPage === "hotel-detail") {
      return "hotel";
    }
    if (currentPage === "visa" || currentPage === "visa-application" || currentPage === "visa-documents" || currentPage === "visa-payment" || currentPage === "visa-confirmation") {
      return "visa";
    }
    if (currentPage === "car-rental" || currentPage === "car-list" || currentPage === "car-detail" || currentPage === "car-payment" || currentPage === "car-thankyou") {
      return "car-rental";
    }
    if (currentPage === "activities" || currentPage === "activity-detail") {
      return "activities";
    }
    if (currentPage === "travel-guide" || currentPage === "guide-detail") {
      return "travel-guide";
    }
    if (currentPage === "about") {
      return "about";
    }
    if (currentPage === "promotions" || currentPage === "tour-detail") {
      return "promotions";
    }
    return "home";
  };

  const activeSection = getActiveSection();

  const navItems = [
    { id: "flights", label: "Vé máy bay", page: "flights" as PageType },
    { id: "hotel", label: "Khách sạn", page: "hotel" as PageType },
    { id: "visa", label: "Visa", page: "visa" as PageType },
    { id: "car-rental", label: "Thuê xe", page: "car-rental" as PageType },
    { id: "activities", label: "Hoạt động vui chơi", page: "activities" as PageType },
    { id: "travel-guide", label: "Cẩm nang du lịch", page: "travel-guide" as PageType },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Bar - Fixed Height */}
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo - Fixed Position */}
          <div className="flex-shrink-0 w-[200px]">
            <h1 
              className="font-['Kadwa',_serif] text-2xl md:text-3xl text-white drop-shadow-lg cursor-pointer hover:text-yellow-300 transition-colors" 
              onClick={() => onNavigate("home")}
            >
              Wanderlust
            </h1>
          </div>
          
          {/* Center Space for Desktop Nav */}
          <div className="flex-1 hidden lg:block" />

          {/* Right Actions - Fixed Position */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Language Switcher - Fixed Width */}
            <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-2 rounded-lg min-w-[90px]">
              <div className="w-5 h-5 bg-red-600 rounded-full flex-shrink-0"></div>
              <span className="text-white font-medium">VI</span>
              <ChevronDown className="w-4 h-4 text-white flex-shrink-0" />
            </button>
            
            {/* Auth Buttons - Desktop Only */}
            <div className="hidden md:flex gap-3">
              <Button variant="outline" className="bg-white hover:bg-gray-50 text-blue-600 border-none px-6 h-[38px] font-medium">
                Đăng nhập
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-[38px] shadow-md font-medium">
                Đăng ký
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation - Fixed Height */}
        <nav className="hidden lg:flex items-center gap-1 pb-4 border-t border-white/10 pt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.page && onNavigate(item.page)}
              disabled={item.disabled}
              className={`
                relative px-4 py-2 rounded-lg transition-all duration-200 font-medium
                ${activeSection === item.id 
                  ? 'text-yellow-300 bg-white/10' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/5'
                }
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {item.label}
              {activeSection === item.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-yellow-300 rounded-full" />
              )}
            </button>
          ))}
          
          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`
                relative flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium
                ${(activeSection === "about" || activeSection === "promotions")
                  ? 'text-yellow-300 bg-white/10' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/5'
                }
              `}
            >
              More
              <ChevronDown className={`w-4 h-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              {(activeSection === "about" || activeSection === "promotions") && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-yellow-300 rounded-full" />
              )}
            </button>

            {moreDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setMoreDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl py-2 min-w-[200px] z-20">
                  <button
                    onClick={() => {
                      onNavigate("about");
                      setMoreDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors
                      ${activeSection === "about" ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'}
                    `}
                  >
                    Về chúng tôi
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("promotions");
                      setMoreDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors
                      ${activeSection === "promotions" ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'}
                    `}
                  >
                    Chương trình khuyến mãi
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 pt-4 border-t border-white/10 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.page) {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                  ${activeSection === item.id 
                    ? 'text-yellow-300 bg-white/10' 
                    : 'text-white hover:bg-white/5'
                  }
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {item.label}
              </button>
            ))}

            {/* More Items */}
            <div className="border-t border-white/10 pt-2 mt-2">
              <button
                onClick={() => {
                  onNavigate("promotions");
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                  ${activeSection === "promotions"
                    ? 'text-yellow-300 bg-white/10' 
                    : 'text-white hover:bg-white/5'
                  }
                `}
              >
                Chương trình khuyến mãi
              </button>
              <button
                onClick={() => {
                  onNavigate("about");
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                  ${activeSection === "about"
                    ? 'text-yellow-300 bg-white/10' 
                    : 'text-white hover:bg-white/5'
                  }
                `}
              >
                Về chúng tôi
              </button>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-2">
              <Button variant="outline" className="bg-white hover:bg-gray-50 text-blue-600 border-none w-full font-medium">
                Đăng nhập
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full shadow-md font-medium">
                Đăng ký
              </Button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
