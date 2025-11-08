import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { 
  CheckCircle2, 
  Plane, 
  Hotel, 
  Car, 
  PartyPopper,
  Mail,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Home,
  FileText
} from "lucide-react";
import type { PageType } from "./MainApp";

interface ConfirmationPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  type?: "flight" | "hotel" | "car-rental" | "activity";
  paymentInfo?: any;
  [key: string]: any;
}

export default function ConfirmationPage({ onNavigate, type, paymentInfo, ...bookingData }: ConfirmationPageProps) {
  // Generate booking reference
  const bookingRef = `WL${Date.now().toString().slice(-8)}`;
  
  // Get icon and title based on type
  const getBookingTypeInfo = () => {
    switch (type) {
      case "flight":
        return {
          icon: Plane,
          title: "Đặt vé máy bay thành công!",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      case "hotel":
        return {
          icon: Hotel,
          title: "Đặt phòng khách sạn thành công!",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        };
      case "car-rental":
        return {
          icon: Car,
          title: "Đặt thuê xe thành công!",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        };
      case "activity":
        return {
          icon: PartyPopper,
          title: "Đặt hoạt động thành công!",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      default:
        return {
          icon: CheckCircle2,
          title: "Đặt chỗ thành công!",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
    }
  };

  const { icon: Icon, title, color, bgColor, borderColor } = getBookingTypeInfo();

  // Get email from booking data
  const email = bookingData?.contactInfo?.email || "email đã đăng ký";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="confirmation" onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 py-12 pt-[calc(60px+3rem)]">
        {/* Success Hero Section */}
        <div className={`${bgColor} ${borderColor} border-2 rounded-2xl p-8 mb-8 text-center`}>
          <div className="flex justify-center mb-6">
            <div className={`${bgColor} rounded-full p-6 ${borderColor} border-4`}>
              <Icon className={`w-20 h-20 ${color}`} />
            </div>
          </div>
          
          <h1 className={`text-3xl mb-4 ${color}`}>
            {title}
          </h1>
          
          <p className="text-gray-700 text-lg mb-6">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của Wanderlust
          </p>

          {/* Booking Reference */}
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border-2 border-gray-200">
            <FileText className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="text-xs text-gray-600">Mã đặt chỗ</p>
              <p className="text-lg tracking-wider">{bookingRef}</p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg mb-2">Email xác nhận đã được gửi</h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi đã gửi email xác nhận kèm theo chi tiết đặt chỗ và e-ticket (nếu có) đến địa chỉ:
              </p>
              <p className="text-blue-600 mt-2">{email}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Lưu ý:</strong> Vui lòng kiểm tra cả hộp thư spam/junk nếu bạn không thấy email trong vài phút tới.
            </p>
          </div>
        </Card>

        {/* Payment Summary */}
        {paymentInfo && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg">Thông tin thanh toán</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng giá trị đơn hàng</span>
                <span className="text-gray-900">
                  {paymentInfo.totalAmount?.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {paymentInfo.voucherDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá (Voucher)</span>
                  <span className="text-green-600">
                    -{paymentInfo.voucherDiscount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}

              {paymentInfo.walletUsed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thanh toán bằng Ví</span>
                  <span className="text-blue-600">
                    -{paymentInfo.walletUsed.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <span className="text-gray-900">Đã thanh toán</span>
                <span className="text-xl text-green-600">
                  {paymentInfo.totalAmount?.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <span className="text-gray-600">Phương thức: </span>
                <span className="text-gray-900">
                  {paymentInfo.paymentMethod === "wallet" 
                    ? "Ví Wanderlust" 
                    : paymentInfo.paymentMethod === "momo"
                    ? "Ví MoMo"
                    : paymentInfo.paymentMethod === "vnpay"
                    ? "VNPay"
                    : paymentInfo.paymentMethod === "zalopay"
                    ? "ZaloPay"
                    : "Thẻ tín dụng/ghi nợ"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* What's Next */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg mb-4">Tiếp theo, bạn cần làm gì?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">1</span>
              </div>
              <div>
                <p className="text-gray-900 mb-1">Kiểm tra email xác nhận</p>
                <p className="text-sm text-gray-600">
                  Xem kỹ các thông tin đặt chỗ và lưu lại e-ticket
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">2</span>
              </div>
              <div>
                <p className="text-gray-900 mb-1">Chuẩn bị giấy tờ cần thiết</p>
                <p className="text-sm text-gray-600">
                  {type === "flight" && "CCCD/Hộ chiếu, vé điện tử in ra hoặc trên điện thoại"}
                  {type === "hotel" && "CCCD/Hộ chiếu, email xác nhận đặt phòng"}
                  {type === "car-rental" && "Bằng lái xe, CCCD, email xác nhận thuê xe"}
                  {type === "activity" && "Email xác nhận, CCCD (nếu cần)"}
                  {!type && "Giấy tờ tùy thân và email xác nhận"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">3</span>
              </div>
              <div>
                <p className="text-gray-900 mb-1">Theo dõi lịch trình</p>
                <p className="text-sm text-gray-600">
                  Truy cập "Lịch sử đặt chỗ" để xem chi tiết và cập nhật
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("booking-history")}
            className="w-full"
          >
            <FileText className="w-5 h-5 mr-2" />
            Lịch sử đặt chỗ
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("home")}
            className="w-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>

          <Button
            size="lg"
            onClick={() => onNavigate("promotions")}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            <PartyPopper className="w-5 h-5 mr-2" />
            Khám phá ưu đãi
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Cần hỗ trợ? Liên hệ với chúng tôi
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="tel:1900xxxx" className="text-blue-600 hover:underline">
              Hotline: 1900 xxxx
            </a>
            <span className="text-gray-400">|</span>
            <a href="mailto:support@wanderlust.vn" className="text-blue-600 hover:underline">
              support@wanderlust.vn
            </a>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
