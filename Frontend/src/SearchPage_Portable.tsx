/**
 * PHIÊN BẢN PORTABLE - Không dùng figma:asset
 * Sử dụng Lucide React icons và có thể chạy khi deploy
 */

import { useState } from "react";
import svgPaths from "./imports/svg-rqito9edi5";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Slider } from "./components/ui/slider";
import { 
  ChevronDown, 
  ArrowRightLeft, 
  ThumbsUp, 
  Zap, 
  DollarSign,
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  User,
  Search,
  Plane
} from "lucide-react";

interface SearchPageProps {
  onNavigate?: (page: string) => void;
}

// Header Component
function SearchHeader({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [language, setLanguage] = useState<"VI" | "EN">("VI");

  return (
    <div className="bg-[#0194f3] h-[113px] w-full">
      <div className="max-w-[1440px] mx-auto px-[120px] py-4 relative">
        {/* Logo */}
        <button 
          onClick={() => onNavigate?.("home")}
          className="text-white text-[31px] font-['Kadwa'] hover:opacity-80 transition-opacity"
        >
          Wanderlust
        </button>

        {/* Navigation */}
        <div className="flex gap-8 text-white mt-6 drop-shadow-lg">
          <button 
            onClick={() => onNavigate?.("flights")}
            className="hover:text-yellow-300 transition-colors"
          >
            Vé máy bay
          </button>
          <button 
            onClick={() => onNavigate?.("home")}
            className="hover:text-yellow-300 transition-colors"
          >
            Khách sạn
          </button>
          <button className="hover:text-yellow-300 transition-colors">Visa</button>
          <button className="hover:text-yellow-300 transition-colors">Thuê xe</button>
          <button className="hover:text-yellow-300 transition-colors">Hoạt động vui chơi</button>
          <button className="hover:text-yellow-300 transition-colors">Tin tức</button>
          <button className="hover:text-yellow-300 transition-colors flex items-center gap-1">
            More <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Language & Auth */}
        <div className="absolute top-4 right-[120px] flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === "VI" ? "EN" : "VI")}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-5 h-5 bg-red-600 rounded-full"></div>
            <span>{language}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <Button variant="outline" className="bg-white hover:bg-gray-50 text-blue-600 border-none px-6">
            Đăng nhập
          </Button>
          <Button className="bg-white hover:bg-gray-50 text-blue-600 px-6">
            Đăng Ký
          </Button>
        </div>
      </div>
    </div>
  );
}

// Flight Search Bar
function FlightSearchBar() {
  return (
    <div className="max-w-[1156px] mx-auto py-8">
      <div className="flex gap-2 mb-4">
        <Button variant="outline" className="text-sm">
          Chọn chuyến <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" className="text-sm">
          Chọn hạng vé <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" className="text-sm">
          Chọn hãng <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" className="text-sm">
          Lựa chọn khác <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 border rounded p-2 flex items-center gap-2 bg-white">
          <PlaneTakeoff className="w-4 h-4 text-gray-600" />
          <Input placeholder="Từ" className="border-0 p-0 h-auto" />
        </div>

        <button className="bg-[#b1e1ff] p-2 rounded hover:bg-[#9dd4f0] transition-colors">
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 border rounded p-2 flex items-center gap-2 bg-white">
          <PlaneLanding className="w-4 h-4 text-gray-600" />
          <Input placeholder="Đến" className="border-0 p-0 h-auto" />
        </div>

        <div className="flex-1 border rounded p-2 flex items-center gap-2 bg-white">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-500">Ngày đi - Ngày về</span>
        </div>

        <div className="flex-1 border rounded p-2 flex items-center gap-2 bg-white">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-500">Số hành khách</span>
        </div>

        <Button className="bg-[#0194f3] hover:bg-[#0180d6] px-6">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}

// Filter Sidebar
function FilterSidebar() {
  return (
    <div className="bg-white rounded shadow-lg p-4 w-[240px]">
      <h3 className="text-lg mb-4">Bộ lọc</h3>

      {/* Route Type */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Loại tuyến</span>
          <span className="text-sm text-gray-500">Chỉ từ</span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm">Không trạm dừng</span>
            <span className="ml-auto text-sm">$110</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm">1 trạm dừng</span>
            <span className="ml-auto text-sm">$324</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm">Từ 2 trạm trở lên</span>
            <span className="ml-auto text-sm">$349</span>
          </label>
        </div>
      </div>

      <hr className="my-4" />

      {/* Airlines */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Hãng bay</span>
          <span className="text-sm text-gray-500">Chỉ từ</span>
        </div>
        <div className="space-y-2">
          {["ABC Air", "ABC Airlines", "XYZ Airways", "BOP Links", "EDF Express"].map((airline, i) => (
            <label key={i} className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">{airline}</span>
              <span className="ml-auto text-sm">${[203, 160, 212, 129, 190][i]}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-4" />

      {/* Departure Time */}
      <div className="mb-4">
        <span className="text-sm block mb-2">Departure Time</span>
        <p className="text-xs text-gray-600 mb-2">Mon 5:00 AM - Tue 12:00 AM</p>
        <Slider defaultValue={[33, 66]} max={100} step={1} className="mb-4" />
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" className="flex-1 text-purple-600">Làm mới</Button>
        <Button className="flex-1 bg-[#0194f3]">Áp dụng</Button>
      </div>
    </div>
  );
}

// Flight Card
function FlightCard({ type = "single", onBook }: { type?: "single" | "round-trip"; onBook?: () => void }) {
  return (
    <div className="bg-white rounded shadow-lg p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <span className="">ABC Airline</span>
        </div>
        <span className="text-sm">Hạng vé: <strong>Economy</strong></span>
      </div>

      {/* Flight Details */}
      {type === "single" ? (
        <div className="bg-[#fff1e4] rounded p-4 mb-4">
          <p className="text-xs text-gray-600 mb-2">Sun, 29 Jan 2023</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">14.50</p>
              <p className="text-xs text-gray-600">Moi Intl, Mombasa</p>
              <p className="text-xs text-gray-600">Kenya</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm mb-2">9hr 50min</p>
              <div className="relative w-[140px] h-[20px]">
                <div className="absolute inset-0 border-t border-b border-gray-300"></div>
                <Plane className="absolute left-1/2 -translate-x-1/2 w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-lg">14.50</p>
              <p className="text-xs text-gray-600">JFK Terminal, Nairobi</p>
              <p className="text-xs text-gray-600">Kenya</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {[1, 2].map((_, i) => (
            <div key={i} className="bg-[#fff1e4] rounded p-3 flex items-center justify-between">
              <div>
                <p className="text-lg">14.50</p>
                <p className="text-xs">Sun, 29 Jan 2023</p>
                <p className="text-xs text-gray-600">Moi Intl, Mombasa, Kenya</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm mb-1">9hr 50min</p>
                <div className="relative w-[140px] h-[20px]">
                  <div className="absolute inset-0 border-t border-b border-gray-300"></div>
                  <Plane className="absolute left-1/2 -translate-x-1/2 w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-lg">14.50</p>
                <p className="text-xs">Sun, 29 Jan 2023</p>
                <p className="text-xs text-gray-600">JFK Terminal, Nairobi, Kenya</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price & Book */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">Số ghế trống: 100</p>
        <p className="text-orange-500 text-sm">Chính sách hoàn trả</p>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl">$18,500</p>
          </div>
          <Button 
            className="bg-[#0194f3] hover:bg-[#0180d6]"
            onClick={onBook}
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <Button 
          variant="link" 
          className="text-[#0194f3]"
          onClick={onBook}
        >
          Chi tiết hành trình
        </Button>
      </div>
    </div>
  );
}

// Sorting Options
function SortingOptions() {
  const [selected, setSelected] = useState("recommended");

  return (
    <div className="flex gap-0 mb-4 rounded shadow-lg overflow-hidden">
      <button
        onClick={() => setSelected("recommended")}
        className={`flex-1 p-3 flex items-center gap-2 ${
          selected === "recommended"
            ? "bg-white border-b-2 border-[#0194f3] text-[#0194f3]"
            : "bg-white border-b text-gray-600"
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <div className="text-left">
          <p className="text-sm">Khuyến nghị</p>
          <p className="text-xs">$500 - 10h 20m</p>
        </div>
      </button>

      <button
        onClick={() => setSelected("fastest")}
        className={`flex-1 p-3 flex items-center gap-2 ${
          selected === "fastest"
            ? "bg-white border-b-2 border-[#0194f3] text-[#0194f3]"
            : "bg-white border-b text-gray-600"
        }`}
      >
        <Zap className="w-4 h-4" />
        <div className="text-left">
          <p className="text-sm">Hỏa tốc</p>
          <p className="text-xs">$500 - 10h 20m</p>
        </div>
      </button>

      <button
        onClick={() => setSelected("cheapest")}
        className={`flex-1 p-3 flex items-center gap-2 ${
          selected === "cheapest"
            ? "bg-white border-b-2 border-[#0194f3] text-[#0194f3]"
            : "bg-white border-b text-gray-600"
        }`}
      >
        <DollarSign className="w-4 h-4" />
        <div className="text-left">
          <p className="text-sm">Rẻ nhất</p>
          <p className="text-xs">$500 - 10h 20m</p>
        </div>
      </button>
    </div>
  );
}

// Ad Cards with Unsplash images
function AdCard({ type }: { type: "covid" | "deal" | "login" }) {
  const content = {
    covid: {
      img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=300&fit=crop",
      title: "Hướng dẫn quốc tế",
      desc: "Khoảng cách an toàn trong thời kỳ dịch Covid-19",
    },
    deal: {
      img: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop",
      title: "Chúng tôi tìm thấy bạn còn 1 voucher giảm giá",
      desc: "Mua càng nhiều, ưu đãi càng lớn",
    },
    login: {
      img: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop",
      title: "Đăng nhập để nhận nhiều phần quà hấp dẫn",
      desc: "Đăng nhập để nạp",
    },
  };

  return (
    <div className="bg-white rounded shadow-lg overflow-hidden mb-4 w-[240px]">
      <img alt={type} className="w-full h-[196px] object-cover" src={content[type].img} />
      <div className="p-4">
        <h3 className="text-sm mb-2">{content[type].title}</h3>
        <p className="text-xs text-gray-600 mb-3">{content[type].desc}</p>
        <Button variant="outline" className="w-full text-[#0194f3] border-[#0194f3]">
          {type === "login" ? "Đăng nhập/ Đăng ký tài khoản" : "Xem chi tiết"}
        </Button>
      </div>
    </div>
  );
}

// Footer
function SearchFooter({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <footer className="bg-[#153a43] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-[120px]">
        <div className="grid grid-cols-5 gap-8 mb-12">
          <div>
            <button 
              onClick={() => onNavigate?.("home")}
              className="text-[32px] font-['Kadwa'] mb-4 hover:opacity-80 transition-opacity"
            >
              Wanderlust
            </button>
          </div>
          <div>
            <h4 className="text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund policies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">More</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Airlines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Low fare trips</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex items-center justify-between">
          <div className="flex gap-5">
            {[svgPaths.pfb1df80, svgPaths.p2837cb00, svgPaths.p26841d31].map((path, i) => (
              <a key={i} href="#" className="hover:text-yellow-300 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">© 2023 GlobGoer Inc.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Search Page - PORTABLE VERSION
export default function SearchPagePortable({ onNavigate }: SearchPageProps) {
  const handleBook = () => {
    onNavigate?.("booking-details");
  };

  return (
    <div className="bg-white min-h-screen">
      <SearchHeader onNavigate={onNavigate} />
      <FlightSearchBar />

      <div className="bg-[#f3f3f3] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-8">
          {/* Left Sidebar */}
          <FilterSidebar />

          {/* Main Content */}
          <div className="flex-1">
            {/* Pricing Table Collapsed */}
            <div className="bg-white rounded shadow-lg p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm">📊</span>
                <span className="text-sm">Bảng giá</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </div>

            <SortingOptions />

            <FlightCard type="single" onBook={handleBook} />
            <FlightCard type="round-trip" onBook={handleBook} />
            <FlightCard type="single" onBook={handleBook} />
          </div>

          {/* Right Sidebar */}
          <div className="w-[240px]">
            <AdCard type="covid" />
            <AdCard type="deal" />
            <AdCard type="login" />
          </div>
        </div>
      </div>

      <SearchFooter onNavigate={onNavigate} />
    </div>
  );
}
