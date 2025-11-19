import { Users, Bed, Maximize2, Coffee, Check, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";

interface RoomImage {
  url: string;
  caption?: string;
  order?: number;
}

interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  maxOccupancy: number;
  bedType: string;
  size: number;
  images?: RoomImage[];
  amenities?: string[];
  basePrice: number;
  availableRooms: number;
  cancellationPolicy: string;
  breakfastIncluded: boolean;
  status: string;
}

interface RoomSelectionCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  isSelected?: boolean;
}

export function RoomSelectionCard({ room, onSelect, isSelected = false }: RoomSelectionCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = room.images && room.images.length > 1;

  const roomImages = room.images && room.images.length > 0 
    ? room.images.sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? roomImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === roomImages.length - 1 ? 0 : prev + 1
    );
  };

  // Map amenities to Vietnamese
  const amenityMap: { [key: string]: string } = {
    "wifi": "WiFi miễn phí",
    "tv": "TV màn hình phẳng",
    "minibar": "Minibar",
    "air_conditioning": "Điều hòa",
    "balcony": "Ban công",
    "bathtub": "Bồn tắm",
    "shower": "Vòi sen",
    "hairdryer": "Máy sấy tóc",
    "safe": "Két an toàn",
    "coffee_maker": "Máy pha cà phê",
    "iron": "Bàn là",
    "desk": "Bàn làm việc",
    "sofa": "Sofa",
    "view": "View đẹp"
  };

  const displayAmenities = room.amenities?.slice(0, 6).map(a => 
    amenityMap[a.toLowerCase()] || a
  ) || [];

  const getCancellationText = (policy: string) => {
    switch (policy) {
      case "FLEXIBLE":
        return "Miễn phí hủy";
      case "MODERATE":
        return "Hủy trước 24h";
      case "STRICT":
        return "Không hoàn tiền";
      default:
        return "Liên hệ để biết chính sách";
    }
  };

  const getCancellationColor = (policy: string) => {
    switch (policy) {
      case "FLEXIBLE":
        return "bg-green-50 text-green-700 border-green-200";
      case "MODERATE":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "STRICT":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div 
      className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all ${
        isSelected ? "border-blue-500 shadow-lg ring-2 ring-blue-200" : "border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Room Image Gallery */}
        <div className="md:w-72 flex-shrink-0">
          <div className="relative group">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <ImageWithFallback
                src={roomImages[currentImageIndex]?.url || defaultImage}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Navigation */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {roomImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? "bg-white w-4" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Breakfast Badge */}
            {room.breakfastIncluded && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-500 text-white">
                  <Coffee className="w-3 h-3 mr-1" />
                  Có bữa sáng
                </Badge>
              </div>
            )}
          </div>

          {/* Image Count */}
          {hasMultipleImages && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {currentImageIndex + 1} / {roomImages.length} ảnh
            </p>
          )}
        </div>

        {/* Room Details */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            {/* Room Name & Type */}
            <div className="mb-3">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {room.name}
              </h3>
              <p className="text-sm text-gray-500">{room.type}</p>
            </div>

            {/* Room Specs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-sm">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                {room.maxOccupancy} người
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Bed className="w-3.5 h-3.5 mr-1.5" />
                {room.bedType}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                {room.size} m²
              </Badge>
            </div>

            {/* Amenities */}
            {displayAmenities.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {displayAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
                {room.amenities && room.amenities.length > 6 && (
                  <button className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Xem thêm {room.amenities.length - 6} tiện nghi
                  </button>
                )}
              </div>
            )}

            {/* Cancellation Policy */}
            <div className="mb-4">
              <Badge className={getCancellationColor(room.cancellationPolicy)}>
                {getCancellationText(room.cancellationPolicy)}
              </Badge>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-red-600">
                  {room.basePrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <p className="text-xs text-gray-500">/ phòng / đêm</p>
              {room.availableRooms > 0 && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  Còn {room.availableRooms} phòng
                </p>
              )}
              {room.availableRooms === 0 && (
                <p className="text-sm text-red-600 font-medium mt-1">
                  Hết phòng
                </p>
              )}
            </div>
            
            <Button
              onClick={() => onSelect(room)}
              disabled={room.availableRooms === 0 || isSelected}
              className={`min-w-[140px] ${
                isSelected 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              }`}
              size="lg"
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Đã chọn
                </>
              ) : (
                "Chọn phòng"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
