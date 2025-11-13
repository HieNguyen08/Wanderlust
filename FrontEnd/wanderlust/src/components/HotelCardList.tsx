import { Star, MapPin, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
}

interface HotelCardListProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export function HotelCardList({ hotel, onSelect }: HotelCardListProps) {
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image - Left */}
        <div className="relative w-full md:w-[376px] h-[186px] flex-shrink-0">
          <ImageWithFallback
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info - Middle */}
        <div className="flex-1 p-4 space-y-2">
          <h3 className="font-semibold text-[15px]">{hotel.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">Đánh giá:</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < hotel.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <p className="text-sm font-semibold">Địa chỉ:</p>
            <div className="flex items-start gap-1">
              <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">{hotel.address}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {hotel.freeCancellation && (
              <Badge variant="outline" className="text-xs">
                Có miễn phí hủy phòng
              </Badge>
            )}
            {hotel.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price + Action - Right */}
        <div className="w-full md:w-[300px] p-4 flex flex-col justify-between border-t md:border-t-0 md:border-l">
          {/* Room details */}
          <div className="space-y-1">
            {hotel.roomType && (
              <p className="text-sm font-medium">{hotel.roomType}</p>
            )}
            {hotel.bedType && (
              <p className="text-xs text-gray-600">{hotel.bedType}</p>
            )}
            {hotel.breakfast && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Check className="w-3 h-3" />
                <span>Bao gồm ăn sáng</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-4">
            {hotel.originalPrice && (
              <p className="text-xs text-gray-400 line-through text-right">
                {hotel.originalPrice.toLocaleString("vi-VN")} đ
              </p>
            )}
            <p className="text-2xl font-bold text-red-600 text-right">
              {hotel.price.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-[10px] text-gray-500 text-right">
              / phòng / đêm
            </p>
          </div>

          {/* Button */}
          <Button
            onClick={() => onSelect(hotel)}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Chọn
          </Button>
        </div>
      </div>
    </div>
  );
}
