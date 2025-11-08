import { ArrowLeft, Star, MapPin, Wifi, Car, Utensils, Dumbbell, Check, Heart, Share2, Phone, Mail, Clock, Users, Bed, Coffee } from "lucide-react";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Badge } from "./components/ui/badge";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { PageType } from "./MainApp";
import { useState } from "react";

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
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleBookNow = () => {
    // Navigate to hotel review page with booking data
    onNavigate("hotel-review", {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        rating: hotel.rating,
        address: hotel.address,
        image: hotel.image
      },
      booking: {
        checkIn: "Thứ 6, 7/11/2025", // TODO: Get from date picker
        checkOut: "Thứ 7, 8/11/2025",
        nights: 1,
        roomType: hotel.roomType || "Superior Twin Room",
        guests: 2 // TODO: Get from guest selector
      },
      pricing: {
        roomPrice: hotel.price,
        taxAndFees: Math.round(hotel.price * 0.1),
        insurance: 50000,
        tourTicket: 100000
      }
    });
  };

  const hotelImages = [
    hotel.image,
    "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBsdXh1cnklMjBiZWR8ZW58MXx8fHwxNzYxOTkwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1759223607861-f0ef3e617739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbW9kZXJufGVufDF8fHx8MTc2MTk5MDQxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1639998734107-2c65ced46538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwcmVjZXB0aW9ufGVufDF8fHx8MTc2MTk5MDQxMXww&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="hotel-detail" onNavigate={onNavigate} />
      
      {/* Breadcrumb & Actions */}
      <div className="bg-white border-b pt-[60px]">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => onNavigate("hotel-list")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500 border-red-500" : ""}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Hotel Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 relative h-[400px] rounded-xl overflow-hidden group">
                <ImageWithFallback
                  src={hotelImages[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {hotelImages.slice(1, 4).map((img, idx) => (
                <div key={idx} className="relative h-[195px] rounded-xl overflow-hidden group">
                  <ImageWithFallback
                    src={img}
                    alt={`${hotel.name} - ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Hotel Name & Rating */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl mb-3">{hotel.name}</h1>
                  <div className="flex items-center gap-3 mb-3">
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
                    <span className="text-gray-600">{hotel.rating}/5 sao</span>
                    <Badge variant="outline" className="ml-2">4.8/5 đánh giá</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{hotel.address}</span>
                  </div>
                </div>
              </div>

              {hotel.freeCancellation && (
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  <Check className="w-3 h-3 mr-1" />
                  Miễn phí hủy phòng
                </Badge>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl mb-6">Tiện nghi khách sạn</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      {amenity === "Wifi" && <Wifi className="w-5 h-5 text-white" />}
                      {amenity === "Chỗ đậu xe" && <Car className="w-5 h-5 text-white" />}
                      {amenity === "Nhà hàng" && <Utensils className="w-5 h-5 text-white" />}
                      {amenity === "Phòng tập gym" && <Dumbbell className="w-5 h-5 text-white" />}
                      {!["Wifi", "Chỗ đậu xe", "Nhà hàng", "Phòng tập gym"].includes(amenity) && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Details */}
            {hotel.roomType && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl mb-6">Chi tiết phòng</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <Bed className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Loại phòng</p>
                      <p className="font-medium">{hotel.roomType}</p>
                    </div>
                  </div>
                  {hotel.bedType && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Giường</p>
                        <p className="font-medium">{hotel.bedType}</p>
                      </div>
                    </div>
                  )}
                  {hotel.breakfast && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <Coffee className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Ăn sáng</p>
                        <p className="font-medium">Đã bao gồm</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl mb-4">Giới thiệu</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Khách sạn {hotel.name} là lựa chọn hoàn hảo cho kỳ nghỉ của bạn. 
                Với vị trí thuận lợi tại {hotel.address}, bạn có thể dễ dàng di chuyển 
                đến các điểm tham quan nổi tiếng. Khách sạn cung cấp đầy đủ các tiện nghi 
                hiện đại và dịch vụ chuyên nghiệp để đảm bảo kỳ nghỉ của bạn thật thoải mái 
                và đáng nhớ.
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl mb-6">Thông tin liên hệ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Điện thoại</p>
                    <p className="text-blue-600">1900-xxxx-xxx</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-blue-600">info@hotel.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-xl sticky top-4 border border-gray-100">
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-baseline gap-2 mb-2">
                  {hotel.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {hotel.originalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl text-red-600">
                    {hotel.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <span className="text-sm text-gray-500">/ phòng / đêm</span>
                {hotel.originalPrice && (
                  <div className="mt-3">
                    <Badge className="bg-red-500 text-white text-sm px-3 py-1">
                      Tiết kiệm{" "}
                      {Math.round(
                        ((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100
                      )}
                      %
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Check-in</p>
                    <p className="text-sm">Từ 15:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Check-out</p>
                    <p className="text-sm">Trước 12:00</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                Đặt phòng ngay
              </Button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Xác nhận tức thì</span>
                </div>
                {hotel.freeCancellation && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Miễn phí hủy phòng</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Thanh toán an toàn</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Hỗ trợ 24/7</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-center text-gray-500">
                  Giá đã bao gồm thuế và phí dịch vụ
                </p>
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
