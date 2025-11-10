import { useState, useEffect } from "react";
import { HotelFilterSidebar } from "../../components/HotelFilterSidebar";
import { HotelTopBar } from "../../components/HotelTopBar";
import { HotelCardGrid } from "../../components/HotelCardGrid";
import { HotelCardList } from "../../components/HotelCardList";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Footer } from "../../components/Footer";
import type { PageType } from "../../MainApp";

interface Hotel {
  id: string;
  name: string;
  rating: number;
  address: string;
  image: string;
  price: number;
  originalPrice?: number;
  freeCancellation: boolean;
  tags?: string[];
  roomType?: string;
  bedType?: string;
  breakfast?: boolean;
  amenities?: string[];
  propertyType?: string;
}

interface HotelListPageProps {
  searchParams?: {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: {
      adults: number;
      children: number;
      rooms: number;
    };
  };
  onNavigate: (page: string, data?: any) => void;
}

// Mock hotel data
const mockHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Vinpearl Resort & Spa Đà Nẵng",
    rating: 5,
    address: "Phạm Văn Đồng, Sơn Trà, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1731080647266-85cf1bc27162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NTk5OTQwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 2500000,
    originalPrice: 3000000,
    freeCancellation: true,
    tags: ["Thanh toán tại KS"],
    roomType: "Phòng Deluxe",
    bedType: "2 giường đơn",
    breakfast: true,
    amenities: ["Wifi", "Hồ bơi", "Spa", "Nhà hàng", "Phòng tập gym"],
    propertyType: "Resort",
  },
  {
    id: "hotel-2",
    name: "Premier Village Danang Resort",
    rating: 5,
    address: "99 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1729605412240-bc3cb17d7600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsfGVufDF8fHx8MTc2MDAwMzM4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 3200000,
    originalPrice: 4000000,
    freeCancellation: true,
    tags: ["Phù hợp gia đình"],
    roomType: "Biệt thự 2 phòng ngủ",
    bedType: "1 giường king, 2 giường đơn",
    breakfast: true,
    amenities: ["Wifi", "Hồ bơi", "Chỗ đậu xe", "Nhà hàng", "Dịch vụ phòng"],
    propertyType: "Resort",
  },
  {
    id: "hotel-3",
    name: "Novotel Danang Premier Han River",
    rating: 4,
    address: "36 Bạch Đằng, Hải Châu, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwMDk3NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 1800000,
    originalPrice: 2200000,
    freeCancellation: true,
    tags: ["Có xuất hóa đơn"],
    roomType: "Phòng Superior",
    bedType: "1 giường queen",
    breakfast: true,
    amenities: ["Wifi", "Hồ bơi", "Phòng tập gym", "Nhà hàng"],
    propertyType: "Khách sạn",
  },
  {
    id: "hotel-4",
    name: "Fusion Suites Danang Beach",
    rating: 4,
    address: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1649731000184-7ced04998f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsfGVufDF8fHx8MTc2MDAwNDY4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 2100000,
    freeCancellation: true,
    tags: ["All-inclusive breakfast"],
    roomType: "Suite 1 phòng ngủ",
    bedType: "1 giường king",
    breakfast: true,
    amenities: ["Wifi", "Hồ bơi", "Spa", "Dịch vụ giặt ủi"],
    propertyType: "Khách sạn",
  },
  {
    id: "hotel-5",
    name: "Grand Mercure Danang",
    rating: 5,
    address: "Lô A1, Đường Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1614568112072-770f89361490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaG90ZWx8ZW58MXx8fHwxNzYwMDQyODc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 2800000,
    originalPrice: 3500000,
    freeCancellation: true,
    tags: ["Phù hợp gia đình", "Thanh toán tại KS"],
    roomType: "Phòng Deluxe Ocean View",
    bedType: "2 giường đơn",
    breakfast: true,
    amenities: ["Wifi", "Hồ bơi", "Nhà hàng", "Quầy bar", "Spa"],
    propertyType: "Khách sạn",
  },
  {
    id: "hotel-6",
    name: "InterContinental Danang Sun Peninsula Resort",
    rating: 5,
    address: "Bãi Bắc, Sơn Trà, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1623718649591-311775a30c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBwb29sfGVufDF8fHx8MTc2MDA4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 4500000,
    originalPrice: 5500000,
    freeCancellation: true,
    tags: ["Luxury Resort"],
    roomType: "Junior Suite Ocean View",
    bedType: "1 giường king",
    breakfast: true,
    amenities: ["Wifi", "Hồ bơi", "Spa", "Nhà hàng", "Phòng tập gym", "Trung tâm thể dục"],
    propertyType: "Resort",
  },
];

export default function HotelListPage({
  searchParams,
  onNavigate,
}: HotelListPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(mockHotels);

  // Apply filters
  const handleFilterChange = (filters: any) => {
    let filtered = [...hotels];

    // Price range
    filtered = filtered.filter(
      (hotel) =>
        hotel.price >= filters.priceRange[0] &&
        hotel.price <= filters.priceRange[1]
    );

    // Free cancellation
    if (filters.freeCancellation) {
      filtered = filtered.filter((hotel) => hotel.freeCancellation);
    }

    // Amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.amenities.every((amenity: string) =>
          hotel.amenities?.includes(amenity)
        )
      );
    }

    // Property types
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.propertyTypes.includes(hotel.propertyType || "")
      );
    }

    // Ratings
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.ratings.includes(hotel.rating.toString())
      );
    }

    setFilteredHotels(filtered);
  };

  // Apply sorting
  useEffect(() => {
    let sorted = [...filteredHotels];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        // Keep original order
        break;
    }

    setFilteredHotels(sorted);
  }, [sortBy]);

  const handleHotelSelect = (hotel: Hotel) => {
    onNavigate("hotel-detail", hotel);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Hero Section with Search Bar */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Search Bar */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 pb-8 pt-8">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tìm kiếm khách sạn</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Địa điểm</label>
                <input
                  type="text"
                  placeholder={searchParams?.destination || "Đà Nẵng, Việt Nam"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-in */}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Ngày nhận phòng</label>
                <input
                  type="text"
                  placeholder="15/9 Chủ nhật"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-out */}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Ngày trả phòng</label>
                <input
                  type="text"
                  placeholder="21/9 Thứ 7"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Khách & Phòng</label>
                <input
                  type="text"
                  placeholder="2 người lớn, 1 phòng"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <Button className="w-full md:w-auto mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Filter */}
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <HotelFilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Main Area */}
        <div className="flex-1">
          {/* Top Bar */}
          <HotelTopBar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredHotels.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            destination={searchParams?.destination || "Đà Nẵng"}
          />

          {/* Hotel Cards */}
          <div className="p-4 lg:p-6">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Không tìm thấy khách sạn phù hợp với bộ lọc của bạn
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCardGrid
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <HotelCardList
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
