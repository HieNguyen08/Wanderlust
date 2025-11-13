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
  Users, Star, DollarSign, TrendingUp, CheckCircle, XCircle,
  Wifi, Tv, Coffee, Wind, Car, UtensilsCrossed, Edit, Trash2
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  capacity: number;
  available: number;
  total: number;
  rating: number;
  reviews: number;
  bookings: number;
  revenue: number;
  status: "active" | "inactive" | "maintenance";
  amenities: string[];
  description?: string;
}

interface RoomDetailDialogProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
}

export function RoomDetailDialog({
  room,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: RoomDetailDialogProps) {
  if (!room) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700">Tạm ngưng</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-700">Bảo trì</Badge>;
      default:
        return null;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (lower.includes("tv")) return <Tv className="w-4 h-4" />;
    if (lower.includes("bar") || lower.includes("coffee")) return <Coffee className="w-4 h-4" />;
    if (lower.includes("ac") || lower.includes("air")) return <Wind className="w-4 h-4" />;
    if (lower.includes("parking") || lower.includes("car")) return <Car className="w-4 h-4" />;
    if (lower.includes("breakfast") || lower.includes("restaurant")) return <UtensilsCrossed className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{room.name}</DialogTitle>
          <DialogDescription>Mã phòng: {room.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Image & Status */}
          <div className="relative">
            <ImageWithFallback
              src={room.image}
              alt={room.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-white text-gray-900">{room.type}</Badge>
              {getStatusBadge(room.status)}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Sức chứa</p>
              <p className="font-semibold text-gray-900">{room.capacity} người</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Phòng trống</p>
              <p className="font-semibold text-gray-900">{room.available}/{room.total}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Đánh giá</p>
              <p className="font-semibold text-gray-900">{room.rating} ⭐</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Giá/đêm</p>
              <p className="font-semibold text-blue-600">{(room.price / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {room.description && (
            <>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">{room.description}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tiện nghi</h3>
            <div className="grid grid-cols-2 gap-3">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Performance Stats */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Hiệu suất kinh doanh</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tổng bookings</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{room.bookings}</span>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {(room.revenue / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Reviews</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">{room.reviews}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Đóng
            </Button>
            {onEdit && (
              <Button 
                onClick={() => {
                  onEdit(room);
                  onClose();
                }}
                className="flex-1 gap-2"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={() => {
                  onDelete(room);
                  onClose();
                }}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
