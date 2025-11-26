import {
    Activity,
    Calendar,
    Car,
    CheckCircle,
    DollarSign,
    Hotel,
    Mail,
    Plane,
    RefreshCw,
    User,
    XCircle
} from "lucide-react";
import { AdminBooking, BookingStatus, BookingType, PaymentStatus } from "../../api/adminBookingApi";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

interface BookingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: AdminBooking | null;
  onConfirm?: (booking: AdminBooking) => void;
  onCancel?: (booking: AdminBooking) => void;
  onRefund?: (booking: AdminBooking) => void;
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

  const typeIcons: Record<BookingType, any> = {
    FLIGHT: Plane,
    HOTEL: Hotel,
    CAR_RENTAL: Car,
    ACTIVITY: Activity,
  };

  const typeLabels: Record<BookingType, string> = {
    FLIGHT: "Vé máy bay",
    HOTEL: "Khách sạn",
    CAR_RENTAL: "Thuê xe",
    ACTIVITY: "Hoạt động",
  };

  const typeColors: Record<BookingType, string> = {
    FLIGHT: "bg-blue-100 text-blue-700",
    HOTEL: "bg-purple-100 text-purple-700",
    CAR_RENTAL: "bg-green-100 text-green-700",
    ACTIVITY: "bg-orange-100 text-orange-700",
  };

  const statusColors: Record<BookingStatus, string> = {
    CONFIRMED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    REFUND_REQUESTED: "bg-orange-100 text-orange-700",
  };

  const statusLabels: Record<BookingStatus, string> = {
    CONFIRMED: "Đã xác nhận",
    PENDING: "Chờ xử lý",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
    REFUND_REQUESTED: "Yêu cầu hoàn tiền",
  };

  const paymentColors: Record<PaymentStatus, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    REFUNDED: "bg-gray-100 text-gray-700",
    FAILED: "bg-red-100 text-red-700",
  };

  const paymentLabels: Record<PaymentStatus, string> = {
    COMPLETED: "Đã thanh toán",
    PENDING: "Chờ thanh toán",
    PROCESSING: "Đang xử lý",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thất bại",
  };

  const TypeIcon = typeIcons[booking.bookingType];
  
  const getServiceName = (): string => {
    if (booking.serviceDetails) {
      return booking.serviceDetails.name;
    }
    // Fallback
    if (booking.flightId) return `Flight: ${booking.flightId}`;
    if (booking.hotelId) return `Hotel: ${booking.hotelId}`;
    if (booking.carRentalId) return `Car: ${booking.carRentalId}`;
    if (booking.activityId) return `Activity: ${booking.activityId}`;
    return 'N/A';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Chi tiết đặt chỗ</DialogTitle>
            <div className="flex gap-2">
              <Badge className={typeColors[booking.bookingType]}>
                {typeLabels[booking.bookingType]}
              </Badge>
              <Badge className={statusColors[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
            </div>
          </div>
          <DialogDescription>Mã đặt chỗ: {booking.bookingCode}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-blue-600" />
              Thông tin dịch vụ
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="font-semibold text-lg mb-1">{getServiceName()}</p>
                <Badge className={typeColors[booking.bookingType]}>
                  {typeLabels[booking.bookingType]}
                </Badge>
              </div>

              {booking.serviceDetails && (
                <>
                  {booking.serviceDetails.description && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Mô tả</p>
                      <p className="text-sm text-gray-800">{booking.serviceDetails.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    {booking.serviceDetails.provider && (
                      <div>
                        <p className="text-xs text-gray-600">Nhà cung cấp</p>
                        <p className="text-sm font-medium">{booking.serviceDetails.provider}</p>
                      </div>
                    )}
                    
                    {booking.serviceDetails.location && (
                      <div>
                        <p className="text-xs text-gray-600">Địa điểm</p>
                        <p className="text-sm font-medium">{booking.serviceDetails.location}</p>
                      </div>
                    )}
                  </div>

                  {/* Show specific details based on service type */}
                  {booking.bookingType === "FLIGHT" && booking.serviceDetails.details && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Chi tiết chuyến bay</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {booking.serviceDetails.details.flightNumber && (
                          <div>
                            <span className="text-gray-600">Số hiệu: </span>
                            <span className="font-medium">{booking.serviceDetails.details.flightNumber}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.duration && (
                          <div>
                            <span className="text-gray-600">Thời gian: </span>
                            <span className="font-medium">{booking.serviceDetails.details.duration}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.departure?.time && (
                          <div>
                            <span className="text-gray-600">Khởi hành: </span>
                            <span className="font-medium">{booking.serviceDetails.details.departure.time}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.arrival?.time && (
                          <div>
                            <span className="text-gray-600">Đến: </span>
                            <span className="font-medium">{booking.serviceDetails.details.arrival.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {booking.bookingType === "HOTEL" && booking.serviceDetails.details && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Chi tiết khách sạn</p>
                      <div className="space-y-1 text-sm">
                        {booking.serviceDetails.details.rating && (
                          <div>
                            <span className="text-gray-600">Xếp hạng: </span>
                            <span className="font-medium">{booking.serviceDetails.details.rating} ⭐</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.address?.street && (
                          <div>
                            <span className="text-gray-600">Địa chỉ: </span>
                            <span className="font-medium">{booking.serviceDetails.details.address.street}</span>
                          </div>
                        )}
                        {booking.roomId && (
                          <div>
                            <span className="text-gray-600">Phòng: </span>
                            <span className="font-medium">{booking.roomId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {booking.bookingType === "CAR_RENTAL" && booking.serviceDetails.details && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Chi tiết xe</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {booking.serviceDetails.details.category && (
                          <div>
                            <span className="text-gray-600">Loại xe: </span>
                            <span className="font-medium">{booking.serviceDetails.details.category}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.transmission && (
                          <div>
                            <span className="text-gray-600">Hộp số: </span>
                            <span className="font-medium">{booking.serviceDetails.details.transmission}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.seats && (
                          <div>
                            <span className="text-gray-600">Số chỗ: </span>
                            <span className="font-medium">{booking.serviceDetails.details.seats}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.fuelType && (
                          <div>
                            <span className="text-gray-600">Nhiên liệu: </span>
                            <span className="font-medium">{booking.serviceDetails.details.fuelType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {booking.bookingType === "ACTIVITY" && booking.serviceDetails.details && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Chi tiết hoạt động</p>
                      <div className="space-y-1 text-sm">
                        {booking.serviceDetails.details.duration && (
                          <div>
                            <span className="text-gray-600">Thời gian: </span>
                            <span className="font-medium">{booking.serviceDetails.details.duration}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.category && (
                          <div>
                            <span className="text-gray-600">Danh mục: </span>
                            <span className="font-medium">{booking.serviceDetails.details.category}</span>
                          </div>
                        )}
                        {booking.serviceDetails.details.minParticipants && (
                          <div>
                            <span className="text-gray-600">Số người tối thiểu: </span>
                            <span className="font-medium">{booking.serviceDetails.details.minParticipants}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
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
                <p className="font-semibold">{booking.guestInfo?.fullName || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-semibold">{booking.guestInfo?.email || 'N/A'}</p>
              </div>

              {booking.guestInfo?.phone && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-semibold">{booking.guestInfo.phone}</p>
                </div>
              )}

              {booking.numberOfGuests && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Số lượng khách</p>
                  <p className="font-semibold">
                    {booking.numberOfGuests.adults || 0} người lớn
                    {booking.numberOfGuests.children ? `, ${booking.numberOfGuests.children} trẻ em` : ''}
                    {booking.numberOfGuests.infants ? `, ${booking.numberOfGuests.infants} em bé` : ''}
                  </p>
                </div>
              )}
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
                <p className="font-semibold">
                  {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày bắt đầu
                </p>
                <p className="font-semibold">{booking.startDate || 'N/A'}</p>
              </div>

              {booking.endDate && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Ngày kết thúc
                  </p>
                  <p className="font-semibold">{booking.endDate}</p>
                </div>
              )}

              {booking.specialRequests && (
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-gray-600">Yêu cầu đặc biệt</p>
                  <p className="text-sm">{booking.specialRequests}</p>
                </div>
              )}
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
                  {booking.totalPrice ? (booking.totalPrice / 1000000).toFixed(1) + 'M' : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{booking.currency || 'VND'}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center items-center">
                <p className="text-sm text-gray-600 mb-2">Trạng thái thanh toán</p>
                <Badge className={paymentColors[booking.paymentStatus]}>
                  {paymentLabels[booking.paymentStatus]}
                </Badge>
                {booking.paymentMethod && (
                  <p className="text-xs text-gray-500 mt-2">{booking.paymentMethod}</p>
                )}
              </div>
            </div>

            {(booking.basePrice || booking.taxes || booking.fees || booking.discount) && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {booking.basePrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá cơ bản:</span>
                    <span className="font-semibold">{(booking.basePrice / 1000).toFixed(0)}K</span>
                  </div>
                )}
                {booking.taxes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế:</span>
                    <span className="font-semibold">{(booking.taxes / 1000).toFixed(0)}K</span>
                  </div>
                )}
                {booking.fees && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí:</span>
                    <span className="font-semibold">{(booking.fees / 1000).toFixed(0)}K</span>
                  </div>
                )}
                {booking.discount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-semibold text-green-600">-{(booking.discount / 1000).toFixed(0)}K</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cancellation Info */}
          {booking.status === "CANCELLED" && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Thông tin hủy
                </h3>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  {booking.cancellationReason && (
                    <div>
                      <p className="text-sm text-gray-600">Lý do:</p>
                      <p className="text-sm font-medium">{booking.cancellationReason}</p>
                    </div>
                  )}
                  {booking.cancelledAt && (
                    <div>
                      <p className="text-sm text-gray-600">Thời gian hủy:</p>
                      <p className="text-sm font-medium">{new Date(booking.cancelledAt).toLocaleString()}</p>
                    </div>
                  )}
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
            
            {booking.status === "PENDING" && onConfirm && (
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
            
            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && onCancel && (
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
            
            {booking.paymentStatus === "COMPLETED" && booking.status === "CANCELLED" && onRefund && (
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
