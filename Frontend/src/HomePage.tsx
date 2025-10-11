import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Search, Hotel, Calendar as CalendarIcon, Users } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";
import type { PageType } from "./MainApp";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// Language Selector Component
function LanguageSelector() {
  const [language, setLanguage] = useState<"VI" | "EN">("VI");

  return (
    <button
      onClick={() => setLanguage(language === "VI" ? "EN" : "VI")}
      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-2 rounded-lg"
    >
      <div className="w-5 h-5 bg-red-600 rounded-full"></div>
      <span className="text-white">{language}</span>
      <ChevronDown className="w-4 h-4 text-white" />
    </button>
  );
}

// Auth Buttons
function AuthButtons() {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="bg-white hover:bg-gray-50 text-blue-600 border-none px-6 h-[38px]"
      >
        Đăng nhập
      </Button>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-[38px]"
      >
        Đăng ký
      </Button>
    </div>
  );
}

// Search Bar Component
function SearchBar({ onNavigate }: { onNavigate: (page: PageType, data?: any) => void }) {
  const [location, setLocation] = useState("Đà Nẵng, Việt Nam");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2 người lớn · 0 trẻ em · 1 phòng");

  const handleSearch = () => {
    const searchParams = {
      destination: location,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      guests: {
        adults: 2,
        children: 0,
        rooms: 1,
      },
    };
    onNavigate("hotel-list", searchParams);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-12 relative z-20">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-2 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Location Input */}
          <div className="flex-1 bg-white rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <Hotel className="w-7 h-7 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-500 block">Địa điểm</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 bg-white rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
                <CalendarIcon className="w-7 h-7 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-500 block">Check-in - Check-out</label>
                  <span className="text-sm truncate block">
                    {checkIn && checkOut
                      ? `${checkIn.getDate()}/${checkIn.getMonth() + 1} - ${checkOut.getDate()}/${checkOut.getMonth() + 1}`
                      : "Chọn ngày"}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
              />
            </PopoverContent>
          </Popover>

          {/* Guests Selector */}
          <div className="flex-1 bg-white rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <Users className="w-7 h-7 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-500 block">Khách & Phòng</label>
              <span className="text-sm truncate block">{guests}</span>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg h-auto min-h-[72px] md:min-h-0"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm
          </Button>
        </div>
      </div>
    </div>
  );
}

interface HomePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="bg-white w-full min-h-screen overflow-x-hidden">
      {/* Header - Fixed Position */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Header currentPage="home" onNavigate={onNavigate} />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <ImageWithFallback 
            alt="Beautiful tropical beach" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        
        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* Header Spacer */}
          <div className="h-[140px]" />
          
          {/* Hero Text */}
          <div className="mt-12 md:mt-20 max-w-4xl">
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl leading-tight drop-shadow-2xl">
              Từ Đông Nam Á đến thế giới,
              <br />
              <span className="text-yellow-300">trong tầm tay bạn</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl mt-4 drop-shadow-lg">
              Khám phá những điểm đến tuyệt vời với giá tốt nhất
            </p>
          </div>
        </div>
      </div>
      
      {/* Search Bar - Overlapping Hero */}
      <SearchBar onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Promo Section */}
        <div className="mb-16 md:mb-20">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl text-red-600 mb-2">Săn Sale</h2>
            <p className="text-gray-600 text-base md:text-lg">Promotion, offers to you</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="cursor-pointer transition-transform hover:scale-105 rounded-xl overflow-hidden shadow-lg aspect-[3/2]">
              <ImageWithFallback 
                alt="Vé máy bay giảm 25%" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop" 
              />
            </div>
            <div className="cursor-pointer transition-transform hover:scale-105 rounded-xl overflow-hidden shadow-lg aspect-[3/2]">
              <ImageWithFallback 
                alt="Hoạt động vui chơi giảm 25%" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop" 
              />
            </div>
            <div className="cursor-pointer transition-transform hover:scale-105 rounded-xl overflow-hidden shadow-lg aspect-[3/2]">
              <ImageWithFallback 
                alt="Khách sạn giảm 25%" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" 
              />
            </div>
            <div className="cursor-pointer transition-transform hover:scale-105 rounded-xl overflow-hidden shadow-lg aspect-[3/2]">
              <ImageWithFallback 
                alt="Ưu đãi ngân hàng 300" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop" 
              />
            </div>
          </div>
        </div>

        {/* Popular Destinations Section */}
        <div className="mb-16 md:mb-20">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl text-red-600 mb-2">Điểm đến phổ biến</h2>
            <p className="text-gray-600 text-base md:text-lg">Khám phá những điểm đến hot nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="cursor-pointer group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="h-56 md:h-64 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&h=400&fit=crop"
                  alt="Paris"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-xl mb-1">Paris, Pháp</h3>
                <p className="text-gray-600 text-sm">Thành phố tình yêu</p>
                <p className="text-blue-600 text-lg mt-2">từ 25.000.000đ</p>
              </div>
            </div>

            <div className="cursor-pointer group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="h-56 md:h-64 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1602283662099-1c6c158ee94d?w=600&h=400&fit=crop"
                  alt="Tokyo"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-xl mb-1">Tokyo, Nhật Bản</h3>
                <p className="text-gray-600 text-sm">Hiện đại và truyền thống</p>
                <p className="text-blue-600 text-lg mt-2">từ 18.000.000đ</p>
              </div>
            </div>

            <div className="cursor-pointer group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="h-56 md:h-64 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1604394089666-6d365c060c6c?w=600&h=400&fit=crop"
                  alt="Bali"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-xl mb-1">Bali, Indonesia</h3>
                <p className="text-gray-600 text-sm">Đảo thiên đường</p>
                <p className="text-blue-600 text-lg mt-2">từ 8.000.000đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-['Kadwa',_serif] text-2xl mb-4">Wanderlust</h3>
              <p className="text-gray-400 text-sm">Từ Đông Nam Á đến thế giới, trong tầm tay bạn</p>
            </div>
            <div>
              <h4 className="text-lg mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white transition-colors">Giới thiệu</button></li>
                <li><button className="hover:text-white transition-colors">Tuyển dụng</button></li>
                <li><button className="hover:text-white transition-colors">Liên hệ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white transition-colors">Vé máy bay</button></li>
                <li><button className="hover:text-white transition-colors">Khách sạn</button></li>
                <li><button className="hover:text-white transition-colors">Visa</button></li>
                <li><button className="hover:text-white transition-colors">Thuê xe</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1900 xxxx</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@wanderlust.vn</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>TP. Hồ Chí Minh</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 Wanderlust. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="hover:text-yellow-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="hover:text-yellow-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="hover:text-yellow-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
