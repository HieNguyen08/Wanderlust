import { ArrowLeft, Star, MapPin, Wifi, Car, Utensils, Dumbbell, Check } from "lucide-react";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Badge } from "./components/ui/badge";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { PageType } from "./MainApp";

interface Hotel {
  id: string;
  name: string;
  rating: number;
  address: string;
  image: string;
  price: number;
  originalPrice?: number;
  freeCancellation: boolean;
  roomType?: string;
  bedType?: string;
  breakfast?: boolean;
  amenities?: string[];
}

interface HotelDetailPageProps {
  hotel: Hotel;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function HotelDetailPage({ hotel, onNavigate }: HotelDetailPageProps) {
  const handleBookNow = () => {
    onNavigate("booking", { type: "hotel", data: hotel });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="hotel-detail" onNavigate={onNavigate} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onNavigate("hotel-list")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Hotel Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <ImageWithFallback
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hotel Name & Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < hotel.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hotel.address}</span>
                </div>
              </div>

              {hotel.freeCancellation && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Có miễn phí hủy phòng
                </Badge>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Tiện nghi</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      {amenity === "Wifi" && <Wifi className="w-4 h-4 text-blue-600" />}
                      {amenity === "Chỗ đậu xe" && <Car className="w-4 h-4 text-blue-600" />}
                      {amenity === "Nhà hàng" && <Utensils className="w-4 h-4 text-blue-600" />}
                      {amenity === "Phòng tập gym" && <Dumbbell className="w-4 h-4 text-blue-600" />}
                      {!["Wifi", "Chỗ đậu xe", "Nhà hàng", "Phòng tập gym"].includes(amenity) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Details */}
            {hotel.roomType && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Chi tiết phòng</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Loại phòng: {hotel.roomType}</span>
                  </div>
                  {hotel.bedType && (
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Giường: {hotel.bedType}</span>
                    </div>
                  )}
                  {hotel.breakfast && (
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Bao gồm ăn sáng</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
              <p className="text-gray-600 leading-relaxed">
                Khách sạn {hotel.name} là lựa chọn hoàn hảo cho kỳ nghỉ của bạn. 
                Với vị trí thuận lợi tại {hotel.address}, bạn có thể dễ dàng di chuyển 
                đến các điểm tham quan nổi tiếng. Khách sạn cung cấp đầy đủ các tiện nghi 
                hiện đại và dịch vụ chuyên nghiệp để đảm bảo kỳ nghỉ của bạn thật thoải mái 
                và đáng nhớ.
              </p>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  {hotel.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {hotel.originalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">
                    {hotel.price.toLocaleString("vi-VN")} đ
                  </span>
                  <span className="text-sm text-gray-500">/ phòng / đêm</span>
                </div>
                {hotel.originalPrice && (
                  <div className="mt-2">
                    <Badge className="bg-red-100 text-red-700">
                      Tiết kiệm{" "}
                      {Math.round(
                        ((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100
                      )}
                      %
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium">15:00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium">12:00</span>
                </div>
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12"
                size="lg"
              >
                Đặt phòng ngay
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Xác nhận tức thì</span>
                </div>
                {hotel.freeCancellation && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Miễn phí hủy phòng</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
