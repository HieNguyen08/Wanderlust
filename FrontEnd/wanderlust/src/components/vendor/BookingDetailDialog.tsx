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
import {
  Calendar, Users, Phone, Mail, MapPin,
  CreditCard, CheckCircle, X, Download
} from "lucide-react";

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  payment: "paid" | "pending";
  amount: number;
  bookingDate: string;
  specialRequests?: string;
  roomType?: string;
  bedType?: string;
  extras?: string[];
}

interface BookingDetailDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}

export function BookingDetailDialog({
  booking,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}: BookingDetailDialogProps) {
  if (!booking) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700">Đã xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ xử lý</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">Hoàn thành</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Đã thanh toán</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ thanh toán</Badge>;
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(booking.id);
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(booking.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chi tiết đơn đặt chỗ</DialogTitle>
          <DialogDescription>Mã booking: {booking.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status & Payment */}
          <div className="flex gap-3">
            {getStatusBadge(booking.status)}
            {getPaymentBadge(booking.payment)}
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{booking.customer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{booking.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{booking.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Chi tiết đặt phòng</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Loại phòng:</span>
                <span className="font-medium text-gray-900">{booking.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ngày nhận phòng:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{booking.checkIn}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ngày trả phòng:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{booking.checkOut}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Số khách:</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{booking.guests} người</span>
                </div>
              </div>
              {booking.roomType && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Loại giường:</span>
                  <span className="font-medium text-gray-900">{booking.roomType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Yêu cầu đặc biệt</h3>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  {booking.specialRequests}
                </p>
              </div>
            </>
          )}

          {/* Extras */}
          {booking.extras && booking.extras.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dịch vụ thêm</h3>
                <div className="flex flex-wrap gap-2">
                  {booking.extras.map((extra, index) => (
                    <Badge key={index} variant="outline">{extra}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {booking.amount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="text-gray-700">{booking.bookingDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Phương thức:</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Thẻ tín dụng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {booking.status === "pending" && (
              <Button 
                onClick={handleConfirm}
                className="flex-1 gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Xác nhận đơn
              </Button>
            )}
            {booking.status !== "cancelled" && booking.status !== "completed" && (
              <Button 
                onClick={handleCancel}
                variant="destructive" 
                className="flex-1 gap-2"
              >
                <X className="w-4 h-4" />
                Hủy đơn
              </Button>
            )}
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Tải hóa đơn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
