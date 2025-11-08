import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Star, MapPin, Building2, TrendingUp, DollarSign,
  Users, Calendar, Edit, Trash2, Eye
} from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  rooms: number;
  bookings: number;
  revenue: number;
  status: "active" | "inactive";
}

interface HotelDetailDialogProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
  onManageRooms?: (hotel: Hotel) => void;
}

export function HotelDetailDialog({
  hotel,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onManageRooms,
}: HotelDetailDialogProps) {
  if (!hotel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{hotel.name}</DialogTitle>
          <DialogDescription>Mã khách sạn: {hotel.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Image & Status */}
          <div className="relative">
            <ImageWithFallback
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge
              className={`absolute top-3 right-3 ${
                hotel.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {hotel.status === "active" ? "Hoạt động" : "Tạm ngưng"}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-lg">{hotel.location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold text-gray-900">{hotel.rating}</span>
            </div>
            <span className="text-gray-600">({hotel.reviews} đánh giá)</span>
          </div>

          <Separator />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Tổng phòng</p>
              <p className="text-2xl font-bold text-gray-900">{hotel.rooms}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{hotel.bookings}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Giá/đêm</p>
              <p className="text-2xl font-bold text-blue-600">
                {(hotel.price / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-green-600">
                {(hotel.revenue / 1000000).toFixed(0)}M
              </p>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin bổ sung</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-medium text-gray-900">
                  {hotel.status === "active" ? "Đang hoạt động" : "Tạm ngưng hoạt động"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số đánh giá:</span>
                <span className="font-medium text-gray-900">{hotel.reviews} đánh giá</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tỷ lệ lấp đầy:</span>
                <span className="font-medium text-gray-900">
                  {((hotel.bookings / hotel.rooms) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doanh thu trung bình/đêm:</span>
                <span className="font-medium text-green-600">
                  {hotel.bookings > 0
                    ? ((hotel.revenue / hotel.bookings) / 1000000).toFixed(1)
                    : "0"}M VND
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            {onManageRooms && (
              <Button 
                onClick={() => {
                  onManageRooms(hotel);
                  onClose();
                }}
                className="flex-1 gap-2"
              >
                <Building2 className="w-4 h-4" />
                Quản lý phòng
              </Button>
            )}
            {onEdit && (
              <Button 
                onClick={() => {
                  onEdit(hotel);
                  onClose();
                }}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={() => {
                  onDelete(hotel);
                  onClose();
                }}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
