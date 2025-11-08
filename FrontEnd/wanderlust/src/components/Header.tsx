import { ChevronDown, Menu, X, User, History, Heart, Settings, LogOut, Wallet, Globe, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import type { PageType } from "../MainApp";
import { tokenService } from "../utils/api";

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: "user" | "admin" | "vendor" | null;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, userRole, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  
  // Get user data from localStorage
  const userData = tokenService.getUserData();
  const displayName = userData ? `${userData.firstName}` : "User";
  
  // Derive login state from userRole prop
  const isLoggedIn = userRole !== null;
  const isAdmin = userRole === "admin";
  const isVendor = userRole === "vendor";
  // Mock wallet balance
  const [walletBalance] = useState(2450000);

  // Language options
  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
  ];

  // Scroll detection - 2 states: transparent at top, white when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine active page category
  const getActiveSection = (): string => {
    if (currentPage === "flights" || currentPage === "search" || currentPage === "booking" || currentPage === "confirmation" || currentPage === "offers") {
      return "flights";
    }
    if (currentPage === "hotel" || currentPage === "hotel-list" || currentPage === "hotel-detail") {
      return "hotel";
    }
    if (currentPage === "visa" || currentPage === "visa-article" || currentPage === "visa-consultation" || currentPage === "visa-tracking" || currentPage === "visa-application" || currentPage === "visa-documents" || currentPage === "visa-payment" || currentPage === "visa-confirmation") {
      return "visa";
    }
    if (currentPage === "car-rental" || currentPage === "car-list" || currentPage === "car-detail" || currentPage === "car-review") {
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
    { id: "activities", label: "Vui chơi", page: "activities" as PageType },
    { id: "travel-guide", label: "Cẩm nang", page: "travel-guide" as PageType },
  ];

  // Determine if header should be white (scrolled)
  const isWhiteHeader = scrolled;

  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isWhiteHeader
          ? 'bg-white shadow-md border-b-2 border-gray-900'
          : 'bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Single Row Layout */}
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo + Navigation */}
          <div className="flex items-center gap-6 flex-1">
            {/* Logo */}
            <h1 
              className={`
                font-['Kadwa',_serif] cursor-pointer transition-all duration-300
                ${isWhiteHeader 
                  ? 'text-gray-900' 
                  : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }
              `}
              onClick={() => onNavigate("home")}
            >
              Wanderlust
            </h1>
            
            {/* Desktop Navigation - Inline */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.page && onNavigate(item.page)}
                  className={`
                    relative px-4 py-2 rounded-md transition-all duration-200
                    ${activeSection === item.id 
                      ? isWhiteHeader
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-yellow-300 bg-black/20 backdrop-blur-sm'
                      : isWhiteHeader
                        ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-white/95 hover:text-white hover:bg-black/20 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                    }
                  `}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 rounded-full ${isWhiteHeader ? 'bg-blue-600' : 'bg-yellow-300'}`} />
                  )}
                </button>
              ))}
              
              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`
                    relative flex items-center gap-1.5 px-4 py-2 rounded-md transition-all duration-200
                    ${(activeSection === "about" || activeSection === "promotions")
                      ? isWhiteHeader
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-yellow-300 bg-black/20 backdrop-blur-sm'
                      : isWhiteHeader
                        ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-white/95 hover:text-white hover:bg-black/20 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                    }
                  `}
                >
                  Thêm
                  <ChevronDown className={`w-4 h-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                  {(activeSection === "about" || activeSection === "promotions") && (
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 rounded-full ${isWhiteHeader ? 'bg-blue-600' : 'bg-yellow-300'}`} />
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
                          onNavigate("promotions");
                          setMoreDropdownOpen(false);
                        }}
                        className={`
                          w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm
                          ${activeSection === "promotions" ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                        `}
                      >
                        Khuyến mãi
                      </button>
                      <button
                        onClick={() => {
                          onNavigate("about");
                          setMoreDropdownOpen(false);
                        }}
                        className={`
                          w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm
                          ${activeSection === "about" ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                        `}
                      >
                        Về chúng tôi
                      </button>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher - Redesigned */}
            <div className="relative">
              <button 
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md transition-all
                  ${isWhiteHeader
                    ? 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-black/30 hover:bg-black/40 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                  }
                `}
              >
                <Globe className={`w-4 h-4 flex-shrink-0 ${isWhiteHeader ? 'text-gray-700' : 'text-white'}`} />
                <span className={`${isWhiteHeader ? 'text-gray-900' : 'text-white'}`}>
                  {languages.find(l => l.code === selectedLanguage)?.flag}
                </span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''} ${isWhiteHeader ? 'text-gray-700' : 'text-white'}`} />
              </button>

              {/* Language Dropdown */}
              {languageDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLanguageDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setLanguageDropdownOpen(false);
                        }}
                        className={`
                          w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3
                          ${selectedLanguage === lang.code ? 'bg-blue-50' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <span className={`${selectedLanguage === lang.code ? 'text-blue-600' : 'text-gray-700'}`}>
                            {lang.name}
                          </span>
                        </div>
                        {selectedLanguage === lang.code && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Auth Buttons / Profile - Desktop Only */}
            <div className="hidden md:flex gap-2 items-center">
              {isLoggedIn ? (
                <>
                  {/* Wallet - Compact */}
                  <button
                    onClick={() => onNavigate("wallet")}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md transition-all
                      ${isWhiteHeader
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-black/30 hover:bg-black/40 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                      }
                    `}
                  >
                    <Wallet className={`w-4 h-4 ${isWhiteHeader ? 'text-blue-600' : 'text-white'}`} />
                    <div className="text-left">
                      <p className={`text-[10px] leading-none ${isWhiteHeader ? 'text-gray-600' : 'text-white/80'}`}>Ví</p>
                      <p className={`leading-tight ${isWhiteHeader ? 'text-gray-900' : 'text-white'}`}>{(walletBalance / 1000).toLocaleString('vi-VN')}k</p>
                    </div>
                  </button>

                  {/* Profile Dropdown - Compact */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-md transition-all
                        ${isWhiteHeader
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : 'bg-black/30 hover:bg-black/40 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                        }
                      `}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${scrolled ? 'bg-blue-100' : 'bg-white'}`}>
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className={`max-w-[80px] truncate ${scrolled ? 'text-gray-900' : 'text-white'}`}>{displayName}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''} ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                    </button>

                    {profileDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setProfileDropdownOpen(false)}
                        />
                        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl py-2 min-w-[220px] z-20">
                          <button
                            onClick={() => {
                              onNavigate("profile");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                          >
                            <User className="w-4 h-4" />
                            Thông tin cá nhân
                          </button>
                          <button
                            onClick={() => {
                              onNavigate("booking-history");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                          >
                            <History className="w-4 h-4" />
                            Lịch sử đặt chỗ
                          </button>
                          <button
                            onClick={() => {
                              onNavigate("saved-items");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                          >
                            <Heart className="w-4 h-4" />
                            Mục đã lưu
                          </button>
                          <button
                            onClick={() => {
                              onNavigate("wallet");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                          >
                            <Wallet className="w-4 h-4" />
                            <div className="flex items-center justify-between flex-1">
                              <span>Ví của tôi</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {(walletBalance / 1000000).toFixed(1)}M
                              </Badge>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate("settings");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                          >
                            <Settings className="w-4 h-4" />
                            Cài đặt
                          </button>
                          {(isAdmin || isVendor) && (
                            <>
                              <div className="my-1 border-t border-gray-200"></div>
                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    onNavigate("admin-dashboard");
                                    setProfileDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors flex items-center gap-3 text-purple-600 text-sm"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  Admin Panel
                                </button>
                              )}
                              {isVendor && (
                                <button
                                  onClick={() => {
                                    onNavigate("vendor-dashboard");
                                    setProfileDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 text-blue-600 text-sm"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  Vendor Panel
                                </button>
                              )}
                            </>
                          )}
                          <div className="my-1 border-t border-gray-200"></div>
                          <button
                            onClick={() => {
                              onLogout?.();
                              setProfileDropdownOpen(false);
                              onNavigate("home");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 text-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                // Login/Register Buttons - Compact
                <>
                  <Button 
                    variant="outline" 
                    className={`px-5 h-[36px] border-none ${
                      scrolled 
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600' 
                        : 'bg-white hover:bg-gray-50 text-blue-600'
                    }`}
                    onClick={() => onNavigate("login")}
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-[36px]"
                    onClick={() => onNavigate("login")}
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className={`
                lg:hidden p-2 rounded-md transition-all
                ${scrolled
                  ? 'text-gray-900'
                  : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }
              `}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav 
            className={`
              lg:hidden pb-4 pt-2 border-t space-y-1
              ${scrolled ? 'border-gray-200' : 'border-white/20'}
            `}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.page) {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-md transition-all
                  ${activeSection === item.id 
                    ? scrolled
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-yellow-300 bg-black/20'
                    : scrolled
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white hover:bg-black/20'
                  }
                `}
              >
                {item.label}
              </button>
            ))}

            {/* More Items */}
            <div className={`border-t pt-2 mt-2 ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
              <button
                onClick={() => {
                  onNavigate("promotions");
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-md transition-all
                  ${activeSection === "promotions"
                    ? scrolled
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-yellow-300 bg-black/20'
                    : scrolled
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white hover:bg-black/20'
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
                  w-full text-left px-4 py-3 rounded-md transition-all
                  ${activeSection === "about"
                    ? scrolled
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-yellow-300 bg-black/20'
                    : scrolled
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white hover:bg-black/20'
                  }
                `}
              >
                Về chúng tôi
              </button>
            </div>

            {/* Mobile Auth Buttons / Profile */}
            <div className={`flex flex-col gap-2 pt-3 border-t mt-2 ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
              {isLoggedIn ? (
                <>
                  {/* Wallet Card - Mobile */}
                  <button
                    onClick={() => {
                      onNavigate("wallet");
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-md flex items-center justify-between
                      ${scrolled 
                        ? 'bg-blue-50 hover:bg-blue-100' 
                        : 'bg-black/20 hover:bg-black/30'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className={`w-5 h-5 ${scrolled ? 'text-blue-600' : 'text-white'}`} />
                      <div>
                        <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>Ví của tôi</p>
                        <p className={`${scrolled ? 'text-gray-900' : 'text-white'}`}>{walletBalance.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      onNavigate("profile");
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-md flex items-center gap-3
                      ${scrolled 
                        ? 'text-gray-700 hover:bg-gray-50' 
                        : 'text-white hover:bg-black/20'
                      }
                    `}
                  >
                    <User className="w-5 h-5" />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setMobileMenuOpen(false);
                      onNavigate("home");
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-md flex items-center gap-3
                      ${scrolled 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-red-300 hover:bg-black/20'
                      }
                    `}
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className={`w-full border-none ${
                      scrolled 
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600' 
                        : 'bg-white hover:bg-gray-50 text-blue-600'
                    }`}
                    onClick={() => {
                      onNavigate("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    onClick={() => {
                      onNavigate("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
