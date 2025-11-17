import {
    Calendar,
    Check,
    Clock,
    Heart,
    MapPin,
    RefreshCw,
    Share2,
    Shield,
    Star,
    Ticket,
    Users
} from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";

interface ActivityDetailPageProps {
  activity: {
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
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function ActivityDetailPage({ activity, onNavigate }: ActivityDetailPageProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [guestCount, setGuestCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const highlights = [
    "Hủy miễn phí trước 24 giờ",
    "Xác nhận tức thì",
    "Hướng dẫn viên chuyên nghiệp",
    "Đón tại khách sạn (nếu áp dụng)",
    "Bảo hiểm du lịch",
  ];

  const included = [
    "Vé tham quan",
    "Hướng dẫn viên tiếng Việt",
    "Xe đưa đón (tùy gói)",
    "Bữa ăn (tùy gói)",
    "Nước uống",
  ];

  const relatedImages = [
    activity.image,
    "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
  ];

  const handleBooking = () => {
    // Navigate to activity review page
    onNavigate("activity-review", {
      activity: {
        id: activity.id,
        name: activity.name,
        image: activity.image,
        category: activity.category,
        location: activity.location,
        duration: activity.duration
      },
      booking: {
        date: selectedDate || "Thứ 7, 8/11/2025",
        time: "09:00",
        participants: guestCount
      },
      pricing: {
        activityPrice: activity.price * guestCount,
        fees: 0,
        insurance: 50000
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Breadcrumb */}
      <div className="bg-white border-b pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("home")} className="hover:text-blue-600">Trang chủ</button>
            <span>/</span>
            <button onClick={() => onNavigate("activities")} className="hover:text-blue-600">Hoạt động vui chơi</button>
            <span>/</span>
            <span className="text-gray-900">{activity.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 row-span-2">
                <ImageWithFallback
                  src={relatedImages[0]}
                  alt={activity.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
              {relatedImages.slice(1).map((img, index) => (
                <ImageWithFallback
                  key={index}
                  src={img}
                  alt={`${activity.name} ${index + 2}`}
                  className="w-full h-48 object-cover rounded-xl"
                />
              ))}
            </div>

            {/* Title & Actions */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-600">{activity.category}</Badge>
                  {activity.originalPrice && (
                    <Badge variant="destructive">
                      Giảm {Math.round((1 - activity.price / activity.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {activity.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{activity.rating}</span>
                    <span className="text-sm">({activity.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{activity.location}</span>
                  </div>
                  {activity.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      <span>{activity.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Về hoạt động này</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {activity.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                Trải nghiệm độc đáo này sẽ mang đến cho bạn những khoảnh khắc đáng nhớ. 
                Được thiết kế phù hợp cho mọi lứa tuổi, hoạt động này đảm bảo sự an toàn 
                và chất lượng dịch vụ hàng đầu.
              </p>
            </Card>

            {/* Highlights */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Điểm nổi bật</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Included */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bao gồm</h2>
              <div className="space-y-2">
                {included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cancellation Policy */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Chính sách hủy linh hoạt</h3>
                  <p className="text-gray-700">
                    Hủy miễn phí trước 24 giờ để nhận hoàn tiền đầy đủ. 
                    Áp dụng điều khoản và điều kiện.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  {activity.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {activity.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>
                <div className="text-4xl font-bold text-red-600">
                  {activity.price.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-sm text-gray-600 mt-1">/ người</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Chọn ngày
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Số khách
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    >
                      -
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{guestCount}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuestCount(guestCount + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {activity.price.toLocaleString('vi-VN')}đ x {guestCount} khách
                  </span>
                  <span className="font-semibold">
                    {(activity.price * guestCount).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">
                    {(activity.price * guestCount).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                onClick={handleBooking}
                disabled={!selectedDate}
              >
                Đặt ngay
              </Button>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <p>
                  Thanh toán an toàn và bảo mật. Bạn sẽ không bị tính phí cho đến khi xác nhận.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
