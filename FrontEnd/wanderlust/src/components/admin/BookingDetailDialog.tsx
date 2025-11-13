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
import { 
  User, Mail, Calendar, DollarSign, 
  Plane, Hotel, Car, Activity,
  CheckCircle, XCircle, Clock, RefreshCw
} from "lucide-react";

interface BookingData {
  id: string;
  customer: string;
  email: string;
  type: "flight" | "hotel" | "car" | "activity";
  service: string;
  bookingDate: string;
  travelDate: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  amount: number;
  payment: "paid" | "pending" | "refunded";
}

interface BookingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingData | null;
  onConfirm?: (booking: BookingData) => void;
  onCancel?: (booking: BookingData) => void;
  onRefund?: (booking: BookingData) => void;
}

export function BookingDetailDialog({ 
  open, 
  onOpenChange, 
  booking,
  onConfirm,
  onCancel,
  onRefund
}: BookingDetailDialogProps) {
  if (!booking) return null;

  const typeIcons = {
    flight: Plane,
    hotel: Hotel,
    car: Car,
    activity: Activity,
  };

  const typeLabels = {
    flight: "Vé máy bay",
    hotel: "Khách sạn",
    car: "Thuê xe",
    activity: "Hoạt động",
  };

  const typeColors = {
    flight: "bg-blue-100 text-blue-700",
    hotel: "bg-purple-100 text-purple-700",
    car: "bg-green-100 text-green-700",
    activity: "bg-orange-100 text-orange-700",
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const statusLabels = {
    confirmed: "Đã xác nhận",
    pending: "Chờ xử lý",
    cancelled: "Đã hủy",
    completed: "Hoàn thành",
  };

  const paymentColors = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    refunded: "bg-gray-100 text-gray-700",
  };

  const paymentLabels = {
    paid: "Đã thanh toán",
    pending: "Chờ thanh toán",
    refunded: "Đã hoàn tiền",
  };

  const TypeIcon = typeIcons[booking.type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Chi tiết đặt chỗ</DialogTitle>
            <div className="flex gap-2">
              <Badge className={typeColors[booking.type]}>
                {typeLabels[booking.type]}
              </Badge>
              <Badge className={statusColors[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
            </div>
          </div>
          <DialogDescription>Mã đặt chỗ: {booking.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-blue-600" />
              Thông tin dịch vụ
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-lg mb-2">{booking.service}</p>
              <Badge className={typeColors[booking.type]}>
                {typeLabels[booking.type]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin khách hàng
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Tên khách hàng
                </p>
                <p className="font-semibold">{booking.customer}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-semibold">{booking.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Thông tin đặt chỗ
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày đặt
                </p>
                <p className="font-semibold">{booking.bookingDate}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày sử dụng
                </p>
                <p className="font-semibold">{booking.travelDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Thông tin thanh toán
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tổng tiền</p>
                <p className="text-3xl font-bold text-green-600">
                  {(booking.amount / 1000).toFixed(0)}K
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center items-center">
                <p className="text-sm text-gray-600 mb-2">Trạng thái thanh toán</p>
                <Badge className={paymentColors[booking.payment]}>
                  {paymentLabels[booking.payment]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            
            {booking.status === "pending" && onConfirm && (
              <Button 
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onConfirm(booking);
                  onOpenChange(false);
                }}
              >
                <CheckCircle className="w-4 h-4" />
                Xác nhận
              </Button>
            )}
            
            {booking.status !== "cancelled" && onCancel && (
              <Button 
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => {
                  onCancel(booking);
                  onOpenChange(false);
                }}
              >
                <XCircle className="w-4 h-4" />
                Hủy
              </Button>
            )}
            
            {booking.payment === "paid" && booking.status === "cancelled" && onRefund && (
              <Button 
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  onRefund(booking);
                  onOpenChange(false);
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Hoàn tiền
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
