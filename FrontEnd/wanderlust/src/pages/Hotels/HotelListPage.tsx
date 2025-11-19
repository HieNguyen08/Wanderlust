import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
import { Footer } from "../../components/Footer";
import { HotelCardGrid } from "../../components/HotelCardGrid";
import { HotelCardList } from "../../components/HotelCardList";
import { HotelFilterSidebar } from "../../components/HotelFilterSidebar";
import { HotelTopBar } from "../../components/HotelTopBar";
import { Button } from "../../components/ui/button";
import { Footer } from "../../components/Footer";
import type { PageType } from "../../MainApp";
import { hotelApi } from "../../utils/api";
import { toast } from "sonner";
import { format, parse } from "date-fns";

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

export default function HotelListPage({
  searchParams,
  onNavigate,
}: HotelListPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hotels from backend when component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);

        // Prepare search params
        const apiParams: any = {};

        // Map destination to location
        if (searchParams?.destination) {
          apiParams.location = searchParams.destination;
        }

        // Map check-in/check-out dates (convert from dd/MM/yyyy to yyyy-MM-dd)
        if (searchParams?.checkIn) {
          try {
            const checkInDate = parse(searchParams.checkIn, "dd/MM/yyyy", new Date());
            apiParams.checkInDate = format(checkInDate, "yyyy-MM-dd");
          } catch (err) {
            console.error("Invalid checkIn date format:", searchParams.checkIn);
          }
        }

        if (searchParams?.checkOut) {
          try {
            const checkOutDate = parse(searchParams.checkOut, "dd/MM/yyyy", new Date());
            apiParams.checkOutDate = format(checkOutDate, "yyyy-MM-dd");
          } catch (err) {
            console.error("Invalid checkOut date format:", searchParams.checkOut);
          }
        }

        // Map guests (adults + children)
        if (searchParams?.guests) {
          const totalGuests = searchParams.guests.adults + searchParams.guests.children;
          apiParams.guests = totalGuests;
        }

        console.log("🔍 Fetching hotels with params:", apiParams);
        const hotelsData = await hotelApi.searchHotels(apiParams);

        console.log("✅ Fetched hotels:", hotelsData);

        // Map backend HotelDTO to frontend Hotel interface
        const mappedHotels: Hotel[] = hotelsData.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          rating: hotel.starRating || hotel.averageRating || 0,
          address: hotel.address,
          image: hotel.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          price: hotel.lowestPrice || 0,
          freeCancellation: hotel.policies?.cancellation !== "NO_REFUND",
          amenities: hotel.amenities || [],
          propertyType: hotel.hotelType || "HOTEL",
          tags: [],
          breakfast: hotel.amenities?.includes("Bữa sáng miễn phí"),
        }));

        setHotels(mappedHotels);
        setFilteredHotels(mappedHotels);
      } catch (error: any) {
        console.error("❌ Error fetching hotels:", error);
        toast.error("Không thể tải danh sách khách sạn. Vui lòng thử lại.");
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

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
      <div className="relative w-full bg-linear-to-r from-blue-600 to-blue-700">
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-4">Đang tải danh sách khách sạn...</p>
              </div>
            ) : filteredHotels.length === 0 ? (
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
