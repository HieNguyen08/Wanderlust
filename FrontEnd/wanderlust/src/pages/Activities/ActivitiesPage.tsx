import { Calendar, MapPin, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import type { PageType } from "../../MainApp";
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

const mockActivities: Activity[] = [
  {
    id: "act-1",
    name: "Vé VinWonders Nha Trang",
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
    price: 550000,
    originalPrice: 650000,
    category: "attractions",
    rating: 4.8,
    reviews: 2345,
    location: "Nha Trang",
    duration: "Cả ngày",
    description: "Công viên giải trí hàng đầu tại Nha Trang với nhiều trò chơi hấp dẫn",
  },
  {
    id: "act-2",
    name: "Vé Công viên nước The Amazing Bay",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    price: 465000,
    category: "attractions",
    rating: 4.7,
    reviews: 1876,
    location: "Nha Trang",
    duration: "Cả ngày",
    description: "Công viên nước hiện đại với nhiều hoạt động thú vị",
  },
  {
    id: "act-3",
    name: "Sun World Ba Na Hills tại Đà Nẵng",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop",
    price: 550000,
    originalPrice: 700000,
    category: "attractions",
    rating: 4.9,
    reviews: 5432,
    location: "Đà Nẵng",
    duration: "Cả ngày",
    description: "Khu du lịch nổi tiếng với cầu Vàng và phong cảnh tuyệt đẹp",
  },
  {
    id: "act-4",
    name: "Tour Thái Lan trọn gói (Bangkok, Pattaya)",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop",
    price: 6690000,
    category: "tours",
    rating: 4.6,
    reviews: 987,
    location: "Thái Lan",
    duration: "4 ngày 3 đêm",
    description: "Tour trọn gói khám phá Bangkok và Pattaya",
  },
  {
    id: "act-5",
    name: "Địa đạo Củ Chi - Tour nửa ngày",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    price: 405000,
    category: "tours",
    rating: 4.5,
    reviews: 2134,
    location: "TP. Hồ Chí Minh",
    duration: "Nửa ngày",
    description: "Khám phá lịch sử tại địa đạo Củ Chi",
  },
  {
    id: "act-6",
    name: "Dịch vụ massage & spa tại I-Resort",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
    price: 450000,
    originalPrice: 600000,
    category: "spa",
    rating: 4.8,
    reviews: 1456,
    location: "Nha Trang",
    duration: "2-3 giờ",
    description: "Thư giãn với dịch vụ spa cao cấp và tắm bùn khoáng",
  },
  {
    id: "act-7",
    name: "Ăn tối trên sông Sài Gòn",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    price: 850000,
    category: "food",
    rating: 4.7,
    reviews: 876,
    location: "TP. Hồ Chí Minh",
    duration: "2-3 giờ",
    description: "Thưởng thức bữa tối lãng mạn trên du thuyền sông Sài Gòn",
  },
  {
    id: "act-8",
    name: "Vé show Ký ức Hội An",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    price: 400000,
    category: "music",
    rating: 4.9,
    reviews: 3421,
    location: "Hội An",
    duration: "1 giờ 15 phút",
    description: "Trải nghiệm show diễn nghệ thuật đặc sắc về văn hóa Hội An",
  },
  {
    id: "act-9",
    name: "Hong Kong Disneyland",
    image: "https://images.unsplash.com/photo-1512081720881-7d1f6d6e5e2e?w=800&h=600&fit=crop",
    price: 1200000,
    category: "attractions",
    rating: 4.8,
    reviews: 4567,
    location: "Hong Kong",
    duration: "Cả ngày",
    description: "Công viên giải trí nổi tiếng thế giới",
  },
  {
    id: "act-10",
    name: "Tour Singapore và Malaysia",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop",
    price: 8390000,
    category: "tours",
    rating: 4.7,
    reviews: 654,
    location: "Singapore & Malaysia",
    duration: "5 ngày 4 đêm",
    description: "Khám phá 2 quốc gia Đông Nam Á",
  },
  {
    id: "act-11",
    name: "Buffet hải sản tại Nha Trang",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    price: 550000,
    category: "food",
    rating: 4.6,
    reviews: 1234,
    location: "Nha Trang",
    duration: "2 giờ",
    description: "Thưởng thức hải sản tươi ngon",
  },
  {
    id: "act-12",
    name: "Spa thư giãn tại Đà Nẵng",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop",
    price: 380000,
    category: "spa",
    rating: 4.7,
    reviews: 987,
    location: "Đà Nẵng",
    duration: "90 phút",
    description: "Dịch vụ massage chuyên nghiệp",
  },
];

interface ActivitiesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  initialCategory?: string;
}

export default function ActivitiesPage({ onNavigate, initialCategory }: ActivitiesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities from backend
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await activityApi.search({
          category: selectedCategory !== "all" ? selectedCategory.toUpperCase() : undefined,
        });
        setActivities(data);
      } catch (error: any) {
        console.error('Failed to load activities:', error);
        toast.error('Không thể tải danh sách hoạt động');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [selectedCategory]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleActivityClick = (activity: Activity) => {
    onNavigate("activity-detail", activity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Hero Section */}
      <div className="relative w-full bg-linear-to-r from-blue-600 to-blue-700 pb-8">
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

        {/* Search Bar */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-xl p-4 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm hoạt động, địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
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

        {filteredActivities.length === 0 && (
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
