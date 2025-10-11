import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Calendar as CalendarIcon, Users, Hotel, Search, MapPin, Repeat, ChevronDown } from "lucide-react";
import { Calendar } from "./components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";

interface HotelLandingPageProps {
  onNavigate: (page: string, data?: any) => void;
}

// Header Component
function HotelHeader({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const [language, setLanguage] = useState<"VI" | "EN">("VI");

  return (
    <div className="bg-[#0194f3] h-[279px] w-full">
      <div className="max-w-[1440px] mx-auto px-[120px] py-4 relative">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="text-white text-[31px] font-['Kadwa'] hover:opacity-80 transition-opacity"
        >
          Wanderlust
        </button>

        {/* Navigation */}
        <div className="flex gap-8 text-white mt-6 drop-shadow-lg text-[17px]">
          <button
            onClick={() => onNavigate("flights")}
            className="hover:text-yellow-300 transition-colors"
          >
            Vé máy bay
          </button>
          <button className="text-[#cb43bd] font-bold">Khách sạn</button>
          <button className="hover:text-yellow-300 transition-colors">Visa</button>
          <button className="hover:text-yellow-300 transition-colors">Thuê xe</button>
          <button className="hover:text-yellow-300 transition-colors">
            Hoạt động vui chơi
          </button>
          <button className="hover:text-yellow-300 transition-colors">Tin tức</button>
          <button className="hover:text-yellow-300 transition-colors">More</button>
        </div>

        {/* Right side - Language & Auth */}
        <div className="absolute right-[120px] top-[40px] flex items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === "VI" ? "EN" : "VI")}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-2 rounded-lg"
          >
            <div className="w-5 h-5 bg-red-600 rounded-full"></div>
            <span className="text-white">{language}</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {/* Auth Buttons */}
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 text-blue-600 border-none px-6 h-[34px]"
          >
            Đăng nhập
          </Button>
          <Button className="bg-white hover:bg-gray-50 text-blue-600 px-6 h-[34px]">
            Đăng Ký
          </Button>
        </div>
      </div>
    </div>
  );
}

// Search Form Component
function HotelSearchForm({ onSearch }: { onSearch: (data: any) => void }) {
  const [location, setLocation] = useState("Đà Nẵng, Việt Nam");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2 người lớn, 0 trẻ em, 1 phòng");

  const handleSearch = () => {
    onSearch({
      destination: location,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      guests: { adults: 2, children: 0, rooms: 1 },
    });
  };

  return (
    <div className="w-full max-w-[1168px] mx-auto px-4 -mt-[140px] relative z-20">
      <div className="bg-white rounded-[4px] border border-[#c8c8c8] p-6 shadow-lg">
        <h2 className="text-[24px] font-['Sansita'] font-bold text-black mb-4">
          Tìm kiếm khách sạn
        </h2>

        {/* Location */}
        <div className="mb-4">
          <div className="bg-white border border-[#a1b0cc] rounded-[4px] p-3 flex items-center gap-3">
            <Hotel className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <label className="text-xs text-gray-500 block">Thành phố, khách sạn, điểm đến</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] font-['Sansita'] font-bold text-[#7c8db0]"
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 mb-4">
          {/* Check-in */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="bg-white border border-[#a1b0cc] rounded-[4px] p-3 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">Thời gian nhận phòng</label>
                  <span className="text-sm text-[#7c8db0] font-['Sansita'] font-bold">
                    {checkIn
                      ? `${checkIn.getDate()} tháng ${checkIn.getMonth() + 1}, ${checkIn.toLocaleDateString('vi-VN', { weekday: 'long' })}`
                      : "15 tháng 9, Chủ nhật"}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} />
            </PopoverContent>
          </Popover>

          {/* Swap Icon */}
          <div className="flex items-center justify-center">
            <div className="bg-white border border-[#a1b0cc] rounded-[4px] p-2 size-[40px] flex items-center justify-center">
              <Repeat className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Check-out */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="bg-white border border-[#a1b0cc] rounded-[4px] p-3 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">Thời gian trả phòng</label>
                  <span className="text-sm text-[#7c8db0] font-['Sansita'] font-bold">
                    {checkOut
                      ? `${checkOut.getDate()} tháng ${checkOut.getMonth() + 1}, ${checkOut.toLocaleDateString('vi-VN', { weekday: 'long' })}`
                      : "21 tháng 9, Thứ 7"}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests & Rooms */}
        <div className="mb-4">
          <div className="bg-white border border-[#a1b0cc] rounded-[4px] p-3 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <label className="text-xs text-gray-500 block">Số khách & số phòng</label>
              <span className="text-sm text-[#7c8db0] font-['Sansita'] font-bold">{guests}</span>
            </div>
          </div>
        </div>

        {/* Search Button & Recently Viewed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-[30px] h-[30px] text-gray-400" />
            <span className="text-[16px] font-['Sansita'] text-[#0194f3]">
              Khách sạn xem gần đây
            </span>
          </div>

          <Button
            onClick={handleSearch}
            className="bg-[#0194f3] hover:bg-blue-700 text-white px-6 py-3 rounded-[4px] flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { PageType } from "./MainApp";

export default function HotelLandingPage({ onNavigate }: { onNavigate: (page: PageType, data?: any) => void }) {
  const handleSearch = (searchData: any) => {
    onNavigate("hotel-list", searchData);
  };

  return (
    <div className="bg-white w-full min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header currentPage="hotel" onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <div className="relative w-full h-[600px]">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            alt="Beautiful beach resort"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc2MDEwNTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-white text-[48px] font-['Arvo'] font-bold drop-shadow-lg">
            Từ Đông Nam Á Đến Thế Giới, Trong Tầm Tay Bạn
          </h1>
        </div>
      </div>

      {/* Search Form - Overlapping Hero */}
      <HotelSearchForm onSearch={handleSearch} />

      {/* Content Sections */}
      <div className="max-w-[1314px] mx-auto px-4 py-16 space-y-16">
        {/* Promo Section */}
        <section>
          <h2 className="text-[36px] font-['Arvo'] font-bold text-black mb-8">
            Ưu đãi dành cho bạn
          </h2>
          <div className="h-[236px] rounded-lg overflow-hidden">
            <ImageWithFallback
              alt="Hotel Promo"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1661777997156-ccac1c9876e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHByb21vJTIwZGVhbHN8ZW58MXx8fHwxNzYwMTA1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080"
            />
          </div>
        </section>

        {/* Domestic Destinations */}
        <section>
          <h2 className="text-[36px] font-['Arvo'] font-bold text-black mb-8">
            Giá tốt tại các điểm đến nội địa
          </h2>
          <div className="h-[268px] rounded-lg overflow-hidden">
            <ImageWithFallback
              alt="Domestic Hotels"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1723142282970-1fd415eec1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwZGFuYW5nJTIwYmVhY2h8ZW58MXx8fHwxNzYwMTA1ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            />
          </div>
        </section>

        {/* International Destinations */}
        <section>
          <h2 className="text-[36px] font-['Arvo'] font-bold text-black mb-8">
            Giá tốt tại các điểm đến quốc tế
          </h2>
          <div className="h-[268px] rounded-lg overflow-hidden">
            <ImageWithFallback
              alt="International Hotels"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsJTIwaG90ZWwlMjBsdXh1cnl8ZW58MXx8fHwxNzYwMTA1ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            />
          </div>
        </section>

        {/* Featured Hotels */}
        <section>
          <h2 className="text-[36px] font-['Arvo'] font-bold text-black mb-8">
            Khách sạn tiêu biểu
          </h2>
          <div className="h-[268px] rounded-lg overflow-hidden">
            <ImageWithFallback
              alt="Featured Hotels"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1725281097209-b5a49cd8597b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1vdXMlMjBsYW5kbWFyayUyMGhvdGVsfGVufDF8fHx8MTc2MDEwNTg3NXww&ixlib=rb-4.1.0&q=80&w=1080"
            />
          </div>
        </section>

        {/* Hot Destinations */}
        <section>
          <h2 className="text-[36px] font-['Arvo'] font-bold text-black mb-8">
            Các điểm đến hot nhất
          </h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <ImageWithFallback
              alt="Hot Destinations"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1521358266004-c16b6ec0e79f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3QlMjBkZXN0aW5hdGlvbiUyMHRyYXZlbHxlbnwxfHx8fDE3NjAxMDU4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            />
          </div>
        </section>

        {/* Download App */}
        <section className="bg-[#fff1e4] rounded-[4px] p-6 flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-[24px] font-['Arvo'] font-bold text-black">
              Đăng ký hội viên, nhận thêm nhiều ưu đãi
            </h3>
            <p className="text-[16px] font-['Arya'] text-black">
              Vui lòng quét mã QR để biết thêm chi tiết về chương trình ưu đãi của chúng tôi.
            </p>
          </div>
          <div className="w-[128px] h-[128px] bg-white border border-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-500">QR Code</span>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-[24px] font-['Arya'] font-bold text-black">FAQ</h2>
          <p className="text-[18px] font-['Arvo'] text-black">Câu hỏi thường gặp</p>

          {/* FAQ Items */}
          <div className="space-y-2">
            {[
              "Làm thế nào để tôi có thể tìm kiếm chuyến bay, khách sạn và đặt phòng trên trang web này?",
              "Những hình thức thanh toán nào được chấp nhận?",
              "Liệu tôi có thể hủy chuyến sau khi đã xác nhận đặt vé và phòng?",
              "Những thông tin cần thiết về lộ trình và mô tả chuyến đi?",
              "Làm thế nào để tôi có thể liên lạc với nhân viên hỗ trợ trong thời gian chuyến du lịch diễn ra?",
            ].map((question, i) => (
              <div
                key={i}
                className="border-b border-[#c8c8c8] py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors px-4"
              >
                <p className="text-[16px] font-['Arvo'] text-black">{question}</p>
                <span className="text-2xl text-gray-400">+</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
