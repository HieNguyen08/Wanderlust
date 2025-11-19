import { ArrowLeft, Star, MapPin, Wifi, Car, Utensils, Dumbbell, Check, Heart, Share2, Phone, Mail, Clock, Users, Bed, Coffee, Info, ChevronDown, Maximize2, Refrigerator, AirVent, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import type { PageType } from "../../MainApp";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { hotelApi } from "../../utils/api";
import { toast } from "sonner";

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
  description?: string;
  phone?: string;
  email?: string;
}

interface HotelDetailPageProps {
  hotel?: Hotel;
  hotelId?: string;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function HotelDetailPage({ hotel: initialHotel, hotelId, onNavigate }: HotelDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceDisplay, setPriceDisplay] = useState("per-room");
  const [showCouponBanner, setShowCouponBanner] = useState(true);
  const [hotel, setHotel] = useState<any>(initialHotel || null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialHotel);

  // Fetch hotel and room data from backend
  useEffect(() => {
    const fetchHotelData = async () => {
      if (initialHotel && !hotelId) {
        return; // Already have hotel data from props
      }

      if (!hotelId) {
        toast.error("Không tìm thấy thông tin khách sạn");
        onNavigate("hotel-list");
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Fetching hotel details for ID:", hotelId);

        const [hotelData, roomsData] = await Promise.all([
          hotelApi.getHotelById(hotelId),
          hotelApi.getHotelRooms(hotelId)
        ]);

        console.log("✅ Fetched hotel:", hotelData);
        console.log("✅ Fetched rooms:", roomsData);

        // Map backend HotelDTO to frontend Hotel interface
        const mappedHotel = {
          id: hotelData.id,
          name: hotelData.name,
          rating: hotelData.starRating || hotelData.averageRating || 0,
          address: hotelData.address,
          image: hotelData.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          price: hotelData.lowestPrice || 0,
          freeCancellation: hotelData.policies?.cancellation !== "NO_REFUND",
          amenities: hotelData.amenities || [],
          description: hotelData.description,
          phone: hotelData.phone,
          email: hotelData.email,
        };

        // Map backend rooms to frontend format
        const mappedRooms = roomsData.map((room: any) => ({
          id: room.id,
          name: room.name,
          image: room.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          size: room.size || 0,
          amenities: room.amenities || [],
          maxGuests: room.maxOccupancy || 2,
          description: room.description || "",
          options: room.options?.map((opt: any) => ({
            id: opt.id,
            name: opt.name,
            bedType: opt.bedType,
            breakfast: opt.breakfast,
            cancellation: opt.cancellation,
            price: opt.price,
            originalPrice: opt.originalPrice,
            roomsLeft: opt.roomsLeft,
            earnPoints: opt.earnPoints
          })) || []
        }));

        setHotel(mappedHotel);
        setAvailableRooms(mappedRooms);
      } catch (error: any) {
        console.error("❌ Error fetching hotel details:", error);
        toast.error("Không thể tải thông tin khách sạn. Vui lòng thử lại.");
        onNavigate("hotel-list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId, initialHotel]);

  if (isLoading || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin khách sạn...</p>
        </div>
      </div>
    );
  }

  const handleRoomSelection = (room: any, option: any) => {
    // Navigate to hotel review page with booking data
    onNavigate("hotel-review", {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        rating: hotel.rating,
        address: hotel.address,
        image: hotel.image
      },
      room: {
        id: room.id,
        name: room.name,
        size: room.size,
        image: room.image,
        amenities: room.amenities
      },
      booking: {
        checkIn: "Thứ 6, 7/11/2025", // TODO: Get from date picker
        checkOut: "Thứ 7, 8/11/2025",
        nights: 1,
        roomType: room.name,
        option: option.name,
        bedType: option.bedType,
        breakfast: option.breakfast,
        guests: 2 // TODO: Get from guest selector
      },
      pricing: {
        roomPrice: option.price,
        taxAndFees: Math.round(option.price * 0.1),
        insurance: 50000,
        tourTicket: 0
      }
    });
  };

  const hotelImages = [
    hotel.image,
    "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBsdXh1cnklMjBiZWR8ZW58MXx8fHwxNzYxOTkwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1759223607861-f0ef3e617739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbW9kZXJufGVufDF8fHx8MTc2MTk5MDQxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1639998734107-2c65ced46538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwcmVjZXB0aW9ufGVufDF8fHx8MTc2MTk5MDQxMXww&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  const filterOptions = [
    { label: "Hủy miễn phí", value: "free-cancellation" },
    { label: "Ưu đãi đặc biệt", value: "extra-benefit" },
    { label: "Giường lớn", value: "large-bed" },
    { label: "Ăn sáng miễn phí", value: "free-breakfast" }
  ];

  const toggleFilter = (value: string) => {
    setSelectedFilters(prev =>
      prev.includes(value)
        ? prev.filter(f => f !== value)
        : [...prev, value]
    );
  };

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
        <div className="space-y-8">
          {/* Hotel Overview Section */}
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
                            className={`w-5 h-5 ${i < hotel.rating
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

            {/* Right Column - Quick Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-xl sticky top-4 border border-gray-100">
                <div className="mb-6 pb-6 border-b">
                  <p className="text-sm text-gray-600 mb-2">Giá từ</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl text-red-600">
                      {Math.min(...availableRooms.flatMap(r => r.options.map(o => o.price))).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">/ phòng / đêm</span>
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

                <div className="space-y-3">
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

          {/* Available Room Types Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <h2 className="text-3xl mb-2">Các loại phòng có sẵn tại {hotel.name}</h2>
            </div>

            {/* Coupon Banner */}
            {showCouponBanner && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white hover:bg-blue-700"
                  onClick={() => setShowCouponBanner(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <p className="text-white">
                  🎉 Coupon giảm tới 500K cho App - Mở App và đặt khách sạn ngay!
                </p>
              </div>
            )}

            {/* Filters & Price Display */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm mb-3">Tăng tốc tìm kiếm với các tiêu chí:</p>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedFilters.includes(filter.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilter(filter.value)}
                        className="rounded-full"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Hiển thị giá:</span>
                  <Select value={priceDisplay} onValueChange={setPriceDisplay}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per-room">Mỗi phòng mỗi đêm (chưa thuế & phí)</SelectItem>
                      <SelectItem value="per-room-tax">Mỗi phòng mỗi đêm (đã thuế & phí)</SelectItem>
                      <SelectItem value="total">Tổng giá cả kỳ nghỉ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Room List */}
            <div className="divide-y">
              {availableRooms.map((room) => (
                <div key={room.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <h3 className="text-2xl mb-4">{room.name}</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Room Image & Details */}
                    <div className="lg:col-span-4">
                      <div className="relative h-[220px] rounded-lg overflow-hidden mb-4">
                        <ImageWithFallback
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Maximize2 className="w-4 h-4" />
                          <span>{room.size} m²</span>
                        </div>
                        {room.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            {amenity === "Tủ lạnh" && <Refrigerator className="w-4 h-4" />}
                            {amenity === "Điều hòa" && <AirVent className="w-4 h-4" />}
                            {!["Tủ lạnh", "Điều hòa"].includes(amenity) && <Check className="w-4 h-4" />}
                            <span>{amenity}</span>
                          </div>
                        ))}

                        <Button
                          variant="link"
                          className="text-blue-600 p-0 h-auto"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          Xem chi tiết phòng
                        </Button>
                      </div>
                    </div>

                    {/* Room Options */}
                    <div className="lg:col-span-8">
                      <div className="space-y-4">
                        {room.options.map((option) => (
                          <div
                            key={option.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            {/* Option Name */}
                            <div className="md:col-span-4 space-y-2">
                              <p className="text-xs text-gray-500">{room.name}</p>
                              <p className="font-semibold">{option.name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Bed className="w-4 h-4" />
                                <span>{option.bedType}</span>
                              </div>
                              {option.cancellation && (
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                  <Check className="w-3 h-3" />
                                  <span>Chính sách hủy linh hoạt</span>
                                  <Info className="w-3 h-3 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Guests */}
                            <div className="md:col-span-2 flex justify-center">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-500" />
                                <Users className="w-4 h-4 text-gray-500" />
                              </div>
                            </div>

                            {/* Price */}
                            <div className="md:col-span-4 text-center">
                              {option.originalPrice && (
                                <p className="text-sm text-gray-400 line-through">
                                  {option.originalPrice.toLocaleString("vi-VN")} VND
                                </p>
                              )}
                              <p className="text-2xl text-red-600 mb-1">
                                {option.price.toLocaleString("vi-VN")} VND
                              </p>
                              <p className="text-xs text-gray-500">Chưa bao gồm thuế & phí</p>
                              {option.earnPoints && (
                                <div className="flex items-center justify-center gap-1 mt-2">
                                  <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                                  <span className="text-xs">Tích {option.earnPoints.toLocaleString()} điểm</span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="md:col-span-2 flex flex-col items-center gap-2">
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full md:w-auto"
                                onClick={() => handleRoomSelection(room, option)}
                              >
                                Chọn
                              </Button>
                              {option.roomsLeft && (
                                <p className="text-xs text-red-600 font-semibold">
                                  {option.roomsLeft} phòng còn lại!
                                </p>
                              )}
                              {option.breakfast && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Rẻ nhất có ăn sáng
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Explore More Button */}
            <div className="p-6 bg-gray-50 border-t">
              <Button
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Khám phá thêm các loại phòng
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
