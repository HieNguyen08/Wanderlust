import { useState, useEffect } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Search, MapPin, Calendar, Users, Star, ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";
import { Header } from "../../components/Header";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { activityApi } from "../../utils/api";

// Activity Category Icons (using Lucide icons instead of imported images)
const categories = [
  { id: "all", name: "Tất cả hoạt động", icon: "grid" },
  { id: "attractions", name: "Điểm tham quan", icon: "ferris-wheel" },
  { id: "tours", name: "Tours", icon: "map" },
  { id: "spa", name: "Spa", icon: "spa" },
  { id: "food", name: "Ẩm thực", icon: "utensils" },
  { id: "music", name: "Nhạc hội", icon: "music" },
];

interface Activity {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  duration?: string;
  description: string;
}

interface ActivitiesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  initialCategory?: string;
}

export default function ActivitiesPage({ onNavigate, initialCategory = "all" }: ActivitiesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced Search States
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [openLocation, setOpenLocation] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  // Advanced Filters States (kept for future use or if UI elements are re-added)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");

  // Popular destinations
  const destinations = [
    { code: "NT", name: "Nha Trang", count: 245 },
    { code: "DN", name: "Đà Nẵng", count: 189 },
    { code: "HCM", name: "TP. Hồ Chí Minh", count: 312 },
    { code: "HA", name: "Hội An", count: 156 },
    { code: "PQ", name: "Phú Quốc", count: 178 },
    { code: "HN", name: "Hà Nội", count: 234 },
    { code: "DL", name: "Đà Lạt", count: 167 },
    { code: "VT", name: "Vũng Tàu", count: 98 },
  ];

  const totalGuests = adults + children;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await activityApi.getAllActivities();

        // Map backend data to frontend format
        const mapCategory = (backendCategory: string) => {
          const cat = backendCategory?.toUpperCase();
          switch (cat) {
            case 'ATTRACTION': return 'attractions';
            case 'TOUR': return 'tours';
            case 'FOOD': return 'food';
            case 'RELAXATION': return 'spa';
            case 'ENTERTAINMENT': return 'music';
            case 'ADVENTURE': return 'tours';
            case 'CULTURE': return 'attractions';
            default: return 'other';
          }
        };

        const mappedActivities = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.images?.[0]?.url || "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
          price: item.price,
          originalPrice: item.originalPrice,
          category: mapCategory(item.category),
          rating: item.averageRating || 0,
          reviews: item.totalReviews || 0,
          location: item.meetingPoint || "Vietnam", // Use meeting point as location for now
          duration: item.duration,
          description: item.description
        }));

        setActivities(mappedActivities);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Filter logic
  const filteredActivities = activities.filter((activity) => {
    const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory;
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || activity.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesPriceRange = activity.price >= priceRange[0] && activity.price <= priceRange[1];
    const matchesRating = activity.rating >= minRating;

    return matchesCategory && matchesSearch && matchesLocation && matchesPriceRange && matchesRating;
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return 0; // recommended
    }
  });

  const handleActivityClick = (activity: Activity) => {
    onNavigate("activity-detail", activity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="activities" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 pb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&h=800&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* Hero Title */}
          <div className="pt-12 md:pt-20 max-w-4xl">
            <h2 className="text-white text-3xl md:text-5xl lg:text-5xl leading-tight drop-shadow-2xl">
              Trải nghiệm vui vẻ cho chuyến đi khó quên
            </h2>
          </div>
        </div>

        {/* Advanced Search Bar */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            {/* Main Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              {/* Location */}
              <Popover open={openLocation} onOpenChange={setOpenLocation}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-2 border-gray-300 hover:border-blue-500 h-14"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Địa điểm</p>
                        <p className="text-sm font-medium truncate">
                          {selectedLocation || "Chọn địa điểm"}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <div className="p-4">
                    <h4 className="font-medium mb-3">Điểm đến phổ biến</h4>
                    <div className="space-y-1">
                      {destinations.map((dest) => (
                        <button
                          key={dest.code}
                          onClick={() => {
                            setSelectedLocation(dest.name);
                            setOpenLocation(false);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{dest.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{dest.count} hoạt động</span>
                        </button>
                      ))}
                    </div>
                    {selectedLocation && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() => {
                          setSelectedLocation("");
                          setOpenLocation(false);
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Date */}
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-2 border-gray-300 hover:border-blue-500 h-14"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Ngày tham gia</p>
                        <p className="text-sm font-medium truncate">
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setOpenDate(false);
                    }}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>

              {/* Guests */}
              <Popover open={openGuests} onOpenChange={setOpenGuests}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-2 border-gray-300 hover:border-blue-500 h-14"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Số người</p>
                        <p className="text-sm font-medium truncate">
                          {totalGuests} người
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Người lớn</p>
                        <p className="text-sm text-gray-500">Từ 12 tuổi</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAdults(Math.min(10, adults + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Trẻ em</p>
                        <p className="text-sm text-gray-500">2-11 tuổi</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setChildren(Math.min(10, children + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-14">
                <Search className="w-5 h-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          {selectedCategory !== "all" && (
            <div className="mt-2 h-1 bg-green-500 rounded-full w-32" />
          )}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl text-gray-800 mb-2">
            {categories.find(c => c.id === selectedCategory)?.name || "Tất cả hoạt động"}
          </h3>
          <p className="text-gray-600">
            Tìm thấy {filteredActivities.length} hoạt động
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {activity.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{Math.round((1 - activity.price / activity.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {activity.name}
                  </h4>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>

                  {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{activity.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">{activity.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({activity.reviews} đánh giá)</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      {activity.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {activity.originalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                      <p className="text-xl font-bold text-red-600">
                        {activity.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy hoạt động phù hợp
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
