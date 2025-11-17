import { Star, MapPin } from "lucide-react";
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

interface HotelCardGridProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export function HotelCardGrid({ hotel, onSelect }: HotelCardGridProps) {
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-[186px] w-full">
        <ImageWithFallback
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="font-semibold text-[15px] line-clamp-1">
          {hotel.name}
        </h3>

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
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600 line-clamp-2">
              {hotel.address}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {hotel.freeCancellation && (
            <Badge variant="outline" className="text-xs">
              Có miễn phí hủy phòng
            </Badge>
          )}
          {hotel.tags?.slice(0, 1).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price + Action */}
      <div className="px-4 pb-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">Giá từ</p>
          {hotel.originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {hotel.originalPrice.toLocaleString("vi-VN")} đ
            </p>
          )}
          <p className="text-xl font-bold text-red-600">
            {hotel.price.toLocaleString("vi-VN")} đ
          </p>
          <p className="text-[10px] text-gray-500">/ phòng / đêm</p>
        </div>
        <Button
          onClick={() => onSelect(hotel)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Chọn
        </Button>
      </div>
    </div>
  );
}
