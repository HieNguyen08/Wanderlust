import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Plane,
  Shield,
  Tag,
  Users
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { paymentApi, type PaymentMethod } from "../../api/paymentApi";
import { Footer } from "../../components/Footer";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { PaymentMethodSelector } from "../../components/payment/PaymentMethodSelector";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { bookingApi, tokenService } from "../../utils/api";

interface PaymentMethodsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  bookingData?: any;
}

interface VoucherType {
  id: string;
  code: string;
  discount: number;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export default function PaymentMethodsPage({
  onNavigate,
  bookingData
}: PaymentMethodsPageProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("WALLET");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherType | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Extract booking info
  const bookingType = bookingData?.type || "flight";
  const totalAmount = bookingData?.totalPrice || 0;

  // Mock vouchers (replace with API call in production)
  const availableVouchers: VoucherType[] = [
    {
      id: "1",
      code: "SALE100K",
      discount: 100000,
      type: "FIXED_AMOUNT",
      minOrderValue: 500000,
      description: t('payment.voucher1Desc', "Giảm 100.000đ cho đơn từ 500.000đ")
    },
    {
      id: "2",
      code: "DISCOUNT10",
      discount: 10,
      type: "PERCENTAGE",
      minOrderValue: 1000000,
      maxDiscount: 200000,
      description: t('payment.voucher2Desc', "Giảm 10% cho đơn từ 1.000.000đ (tối đa 200.000đ)")
    }
  ];

  // Calculate discount
  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;

    if (totalAmount < appliedVoucher.minOrderValue) return 0;

    if (appliedVoucher.type === "FIXED_AMOUNT") {
      return Math.min(appliedVoucher.discount, totalAmount);
    } else {
      const percentDiscount = (totalAmount * appliedVoucher.discount) / 100;
      return Math.min(
        percentDiscount,
        appliedVoucher.maxDiscount || totalAmount
      );
    }
  };

  const voucherDiscount = calculateDiscount();
  const finalAmount = totalAmount - voucherDiscount;

  // Apply voucher
  const handleApplyVoucher = () => {
    const voucher = availableVouchers.find((v) => v.code === voucherCode.toUpperCase());

    if (!voucher) {
      toast.error(t('payment.invalidVoucher', "Mã giảm giá không hợp lệ"));
      return;
    }

    if (totalAmount < voucher.minOrderValue) {
      toast.error(
        t('payment.minOrderNotMet', "Đơn hàng chưa đủ giá trị tối thiểu {{amount}}", {
          amount: voucher.minOrderValue.toLocaleString('vi-VN') + 'đ'
        })
      );
      return;
    }

    setAppliedVoucher(voucher);
    toast.success(t('payment.voucherApplied', "Đã áp dụng mã giảm giá"));
  };

  // Process payment
  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);

      const user = tokenService.getUserData();
      if (!user?.id) {
        toast.error(t('common.loginRequired', "Vui lòng đăng nhập"));
        onNavigate("login");
        return;
      }

      // Step 1: Create booking if not exists
      let createdBooking = null;

      if (!bookingData?.bookingId) {
        createdBooking = await createBooking();
        if (!createdBooking) {
          return; // Error already handled in createBooking
        }
      }

      const bookingId = bookingData?.bookingId || createdBooking?.id;

      if (!bookingId) {
        toast.error(t('payment.bookingCreationFailed', "Không thể tạo đặt chỗ"));
        return;
      }

      // Step 2: Initiate payment
      const paymentRequest = {
        bookingId,
        userId: user.id,
        amount: finalAmount,
        currency: "VND",
        paymentMethod: selectedMethod
      };

      const paymentResponse = await paymentApi.initiatePayment(paymentRequest);

      // Step 3: Handle payment response
      if (selectedMethod === "WALLET") {
        // Wallet payment completes immediately
        toast.success(t('payment.walletPaymentSuccess', "Thanh toán ví thành công!"));
        onNavigate("payment-success", {
          bookingId,
          paymentId: paymentResponse.id
        });
      } else if (paymentResponse.metadata?.paymentUrl) {
        // Redirect to payment gateway (Stripe)
        toast.success(t('payment.redirectingToStripe', "Đang chuyển đến Stripe..."));
        window.location.href = paymentResponse.metadata.paymentUrl;
      } else {
        console.error('Payment response missing paymentUrl:', paymentResponse);
        toast.error(t('payment.noPaymentUrl', "Không nhận được URL thanh toán"));
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      
      // Improved error messages
      let errorMessage = t('payment.paymentFailed', "Thanh toán thất bại. Vui lòng thử lại.");
      
      if (error.message?.includes('Insufficient balance')) {
        errorMessage = t('payment.insufficientBalance', "Số dư ví không đủ");
      } else if (error.message?.includes('Authentication')) {
        errorMessage = t('payment.authRequired', "Vui lòng đăng nhập lại");
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Create booking based on type
  const createBooking = async () => {
    try {
      let bookingPayload: any = null;

      if (bookingType === "flight") {
        bookingPayload = createFlightBooking();
      } else if (bookingType === "hotel") {
        bookingPayload = createHotelBooking();
      } else if (bookingType === "car-rental") {
        bookingPayload = createCarRentalBooking();
      } else if (bookingType === "activity") {
        bookingPayload = createActivityBooking();
      }

      if (!bookingPayload) {
        toast.error(t('payment.invalidBookingType', "Loại đặt chỗ không hợp lệ"));
        return null;
      }

      const booking = await bookingApi.createBooking(bookingPayload);
      toast.success(t('payment.bookingCreated', "Đã tạo đặt chỗ thành công!"));
      return booking;
    } catch (error: any) {
      console.error("Booking creation error:", error);
      toast.error(
        error.message || t('payment.bookingFailed', "Không thể tạo đặt chỗ. Vui lòng thử lại.")
      );
      return null;
    }
  };

  // Create flight booking payload
  const createFlightBooking = () => {
    const passengers = bookingData?.passengers || [];
    const contactInfo = bookingData?.contactInfo || {};
    const flightData = bookingData?.flightData || {};

    return {
      productType: "FLIGHT",
      productId: flightData?.outbound?.flightNumber || "FLIGHT001",
      startDate: flightData?.outbound?.date || new Date().toISOString(),
      endDate: flightData?.return?.date || undefined,
      quantity: passengers.length || 1,
      guestInfo: {
        firstName: contactInfo?.fullName?.split(" ")[0] || "Guest",
        lastName: contactInfo?.fullName?.split(" ").slice(1).join(" ") || "User",
        email: contactInfo?.email || "guest@example.com",
        phone: contactInfo?.phone || ""
      },
      specialRequests: `Flight: ${flightData?.outbound?.from} to ${flightData?.outbound?.to}. Passengers: ${passengers.length}`
    };
  };

  // Create hotel booking payload
  const createHotelBooking = () => {
    const contactInfo = bookingData?.contactInfo || {};
    const guestInfo = bookingData?.guestInfo || {};
    const hotel = bookingData?.hotelData?.hotel || {};
    const booking = bookingData?.hotelData?.booking || {};

    return {
      productType: "HOTEL",
      productId: hotel?.id || "HOTEL001",
      startDate: booking?.checkIn || new Date().toISOString(),
      endDate: booking?.checkOut || undefined,
      quantity: booking?.roomCount || 1,
      guestInfo: {
        firstName:
          (bookingData?.bookingForMyself ? contactInfo?.fullName : guestInfo?.fullName)
            ?.split(" ")[0] || "Guest",
        lastName:
          (bookingData?.bookingForMyself ? contactInfo?.fullName : guestInfo?.fullName)
            ?.split(" ")
            .slice(1)
            .join(" ") || "User",
        email: contactInfo?.email || "guest@example.com",
        phone: contactInfo?.phone || ""
      },
      specialRequests: `Hotel: ${hotel?.name}. Check-in: ${booking?.checkIn}, Check-out: ${booking?.checkOut}`
    };
  };

  // Create car rental booking payload
  const createCarRentalBooking = () => {
    const contactInfo = bookingData?.contactInfo || {};
    const driverInfo = bookingData?.driverInfo || {};
    const car = bookingData?.carData?.car || {};
    const rental = bookingData?.carData?.rental || {};

    return {
      productType: "CAR_RENTAL",
      productId: car?.id || "CAR001",
      startDate: rental?.pickup || new Date().toISOString(),
      endDate: rental?.dropoff || undefined,
      quantity: 1,
      guestInfo: {
        firstName: driverInfo?.fullName?.split(" ")[0] || "Guest",
        lastName: driverInfo?.fullName?.split(" ").slice(1).join(" ") || "User",
        email: contactInfo?.email || "guest@example.com",
        phone: driverInfo?.phone || contactInfo?.phone || ""
      },
      specialRequests: `Car: ${car?.name}. Location: ${rental?.location}. Days: ${rental?.days}`
    };
  };

  // Create activity booking payload
  const createActivityBooking = () => {
    const contactInfo = bookingData?.contactInfo || {};
    const participantInfo = bookingData?.participantInfo || {};
    const activity = bookingData?.activityData?.activity || {};
    const booking = bookingData?.activityData?.booking || {};

    return {
      productType: "ACTIVITY",
      productId: activity?.id || "ACTIVITY001",
      startDate: booking?.date || new Date().toISOString(),
      endDate: undefined,
      quantity: booking?.participants || 1,
      guestInfo: {
        firstName: participantInfo?.fullName?.split(" ")[0] || "Guest",
        lastName: participantInfo?.fullName?.split(" ").slice(1).join(" ") || "User",
        email: contactInfo?.email || "guest@example.com",
        phone: participantInfo?.phone || contactInfo?.phone || ""
      },
      specialRequests: `Activity: ${activity?.name}. Participants: ${booking?.participants}`
    };
  };

  // Render order summary based on booking type
  const renderOrderSummary = () => {
    switch (bookingType) {
      case "flight":
        return <FlightSummary data={bookingData} />;
      case "hotel":
        return <HotelSummary data={bookingData} />;
      case "car-rental":
        return <CarRentalSummary data={bookingData} />;
      case "activity":
        return <ActivitySummary data={bookingData} />;
      default:
        return <DefaultSummary data={bookingData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back', "Quay lại")}
        </Button>

        <h1 className="text-3xl font-bold mb-8">
          {t('payment.title', "Thanh toán")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card className="p-6">
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                amount={finalAmount}
                showWallet={true}
                disabled={isProcessingPayment}
              />
            </Card>

            {/* Voucher Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                <Tag className="w-5 h-5 inline mr-2" />
                {t('payment.voucher', "Mã giảm giá")}
              </h3>

              <div className="flex gap-2">
                <Input
                  placeholder={t('payment.enterVoucher', "Nhập mã giảm giá")}
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={isProcessingPayment || !!appliedVoucher}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyVoucher}
                  disabled={!voucherCode || isProcessingPayment || !!appliedVoucher}
                  variant="outline"
                >
                  {t('payment.apply', "Áp dụng")}
                </Button>
              </div>

              {appliedVoucher && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">
                      {appliedVoucher.code}
                    </p>
                    <p className="text-sm text-green-600">
                      {appliedVoucher.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode("");
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    {t('common.remove', "Xóa")}
                  </Button>
                </div>
              )}

              {/* Available Vouchers */}
              {!appliedVoucher && availableVouchers.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {t('payment.availableVouchers', "Mã giảm giá có sẵn:")}
                  </p>
                  <div className="space-y-2">
                    {availableVouchers.map((voucher) => (
                      <div
                        key={voucher.id}
                        className="p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => {
                          setVoucherCode(voucher.code);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{voucher.code}</p>
                            <p className="text-sm text-gray-600">
                              {voucher.description}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            {t('payment.select', "Chọn")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <p>
                {t(
                  'payment.securityNote',
                  "Thông tin thanh toán của bạn được bảo mật và mã hóa"
                )}
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">
                {t('payment.orderSummary', "Tóm tắt đơn hàng")}
              </h3>

              {/* Booking Details */}
              {renderOrderSummary()}

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t('payment.subtotal', "Tạm tính")}:
                  </span>
                  <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('payment.discount', "Giảm giá")}:</span>
                    <span>-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>{t('payment.total', "Tổng cộng")}:</span>
                  <span className="text-blue-600">
                    {finalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                className="w-full mt-6 py-6 text-lg"
                onClick={handlePayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('payment.processing', "Đang xử lý...")}
                  </>
                ) : (
                  <>
                    {t('payment.payNow', "Thanh toán ngay")}
                    <Shield className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Summary Components for each booking type
function FlightSummary({ data }: { data: any }) {
  const { t } = useTranslation();
  const flightData = data?.flightData?.outbound;

  if (!flightData) return <DefaultSummary data={data} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-blue-600">
        <Plane className="w-5 h-5" />
        <h4 className="font-medium">{t('payment.flight', "Chuyến bay")}</h4>
      </div>
      <div className="text-sm space-y-1">
        <p className="font-medium">
          {flightData.from} → {flightData.to}
        </p>
        <p className="text-gray-600">
          <Calendar className="w-4 h-4 inline mr-1" />
          {flightData.date}
        </p>
        <p className="text-gray-600">
          <Users className="w-4 h-4 inline mr-1" />
          {data?.passengers?.length || 1} {t('payment.passengers', "hành khách")}
        </p>
      </div>
    </div>
  );
}

function HotelSummary({ data }: { data: any }) {
  const { t } = useTranslation();
  const hotel = data?.hotelData?.hotel;
  const booking = data?.hotelData?.booking;

  if (!hotel) return <DefaultSummary data={data} />;

  return (
    <div className="space-y-3">
      {hotel.image && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <ImageWithFallback
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h4 className="font-medium">{hotel.name}</h4>
      <div className="text-sm space-y-1 text-gray-600">
        <p>
          <MapPin className="w-4 h-4 inline mr-1" />
          {hotel.location}
        </p>
        <p>
          <Calendar className="w-4 h-4 inline mr-1" />
          {booking?.checkIn} - {booking?.checkOut}
        </p>
        <p>
          <Users className="w-4 h-4 inline mr-1" />
          {booking?.guests || 1} {t('payment.guests', "khách")}
        </p>
      </div>
    </div>
  );
}

function CarRentalSummary({ data }: { data: any }) {
  const { t } = useTranslation();
  const car = data?.carData?.car;
  const rental = data?.carData?.rental;

  if (!car) return <DefaultSummary data={data} />;

  return (
    <div className="space-y-3">
      {car.image && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <ImageWithFallback
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h4 className="font-medium">{car.name}</h4>
      <div className="text-sm space-y-1 text-gray-600">
        <p>
          <MapPin className="w-4 h-4 inline mr-1" />
          {rental?.location}
        </p>
        <p>
          <Calendar className="w-4 h-4 inline mr-1" />
          {rental?.pickup} - {rental?.dropoff}
        </p>
        <p>
          <Clock className="w-4 h-4 inline mr-1" />
          {rental?.days} {t('payment.days', "ngày")}
        </p>
      </div>
    </div>
  );
}

function ActivitySummary({ data }: { data: any }) {
  const { t } = useTranslation();
  const activity = data?.activityData?.activity;
  const booking = data?.activityData?.booking;

  if (!activity) return <DefaultSummary data={data} />;

  return (
    <div className="space-y-3">
      {activity.image && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <ImageWithFallback
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h4 className="font-medium">{activity.name}</h4>
      <div className="text-sm space-y-1 text-gray-600">
        <p>
          <MapPin className="w-4 h-4 inline mr-1" />
          {activity.location}
        </p>
        <p>
          <Calendar className="w-4 h-4 inline mr-1" />
          {booking?.date}
        </p>
        <p>
          <Users className="w-4 h-4 inline mr-1" />
          {booking?.participants || 1} {t('payment.participants', "người tham gia")}
        </p>
      </div>
    </div>
  );
}

function DefaultSummary({ data }: { data: any }) {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-gray-600">
      <p>{t('payment.bookingDetails', "Chi tiết đặt chỗ")}</p>
    </div>
  );
}
