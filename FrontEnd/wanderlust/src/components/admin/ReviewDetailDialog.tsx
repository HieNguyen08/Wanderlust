import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  User, Star, Calendar, 
  Hotel, Activity, Car,
  CheckCircle, XCircle, Trash2, Image as ImageIcon
} from "lucide-react";

interface ReviewData {
  id: string;
  user: string;
  userImage?: string;
  service: string;
  serviceType: "hotel" | "activity" | "car";
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface ReviewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReviewData | null;
  onApprove?: (review: ReviewData) => void;
  onReject?: (review: ReviewData) => void;
  onDelete?: (review: ReviewData) => void;
}

export function ReviewDetailDialog({ 
  open, 
  onOpenChange, 
  review,
  onApprove,
  onReject,
  onDelete
}: ReviewDetailDialogProps) {
  if (!review) return null;

  const typeIcons = {
    hotel: Hotel,
    activity: Activity,
    car: Car,
  };

  const typeLabels = {
    hotel: "Khách sạn",
    activity: "Hoạt động",
    car: "Thuê xe",
  };

  const typeColors = {
    hotel: "bg-purple-100 text-purple-700",
    activity: "bg-orange-100 text-orange-700",
    car: "bg-green-100 text-green-700",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Đã từ chối",
  };

  const TypeIcon = typeIcons[review.serviceType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Chi tiết đánh giá</DialogTitle>
            <div className="flex gap-2">
              <Badge className={typeColors[review.serviceType]}>
                {typeLabels[review.serviceType]}
              </Badge>
              <Badge className={statusColors[review.status]}>
                {statusLabels[review.status]}
              </Badge>
            </div>
          </div>
          <DialogDescription>Mã đánh giá: {review.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin người đánh giá
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {review.user.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{review.user}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {review.date}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-blue-600" />
              Dịch vụ được đánh giá
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-lg mb-2">{review.service}</p>
              <Badge className={typeColors[review.serviceType]}>
                {typeLabels[review.serviceType]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              Đánh giá
            </h3>
            
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-3 rounded-lg w-fit">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-2xl font-bold text-gray-900 ml-2">
                {review.rating}/5
              </span>
            </div>
          </div>

          <Separator />

          {/* Comment */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Nội dung đánh giá</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          </div>

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Hình ảnh đính kèm
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            
            {review.status === "pending" && (
              <>
                {onApprove && (
                  <Button 
                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      onApprove(review);
                      onOpenChange(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Duyệt
                  </Button>
                )}
                
                {onReject && (
                  <Button 
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => {
                      onReject(review);
                      onOpenChange(false);
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </Button>
                )}
              </>
            )}
            
            {onDelete && (
              <Button 
                variant="destructive"
                className="gap-2"
                onClick={() => {
                  onDelete(review);
                  onOpenChange(false);
                }}
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
