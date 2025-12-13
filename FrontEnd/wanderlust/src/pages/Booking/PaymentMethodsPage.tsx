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
import { useEffect, useState } from "react";
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
import { useNavigationProps } from "../../router/withPageProps";
import { bookingApi, promotionApi, tokenService } from "../../utils/api";

const PENDING_PAYMENT_KEY = "wanderlust_pending_payment";

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
  vendorId?: string;
  adminCreateCheck?: boolean;
}

export default function PaymentMethodsPage({
  onNavigate,
  bookingData: bookingDataProp
}: PaymentMethodsPageProps) {
  const { t } = useTranslation();
  const { pageData, onNavigate: navigateFromHook } = useNavigationProps();
  const bookingData = bookingDataProp ?? pageData;
  const goTo = onNavigate ?? navigateFromHook;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("WALLET");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherType | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<VoucherType[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  // Extract booking info
  const bookingType = bookingData?.type || "flight";
  const totalAmount = bookingData?.totalPrice || bookingData?.amount || 0;

  // Load vouchers from promotions API based on booking type
  useEffect(() => {
    const loadVouchers = async () => {
      try {
        setLoadingVouchers(true);

        const categoryMap: Record<string, string> = {
          flight: "FLIGHT",
          hotel: "HOTEL",
          "car-rental": "CAR",
          car: "CAR",
          activity: "ACTIVITY",
          all: "ALL"
        };

        const category = categoryMap[bookingType] || "ALL";
        const promos = category === "ALL"
          ? await promotionApi.getActive()
          : await promotionApi.getActiveByCategory(category);

        const normalized = (promos || []).map((p: any, idx: number) => ({
          id: p.id || p._id || `${p.code || 'promo'}-${idx}`,
          code: p.code,
          discount: p.discountValue ?? p.discount ?? 0,
          type: (p.discountType || p.type || "FIXED_AMOUNT") as VoucherType["type"],
          minOrderValue: p.minOrderValue ?? 0,
          maxDiscount: p.maxDiscount,
          description: p.description || p.title || p.code,
          vendorId: p.vendorId,
          adminCreateCheck: p.adminCreateCheck
        })) as VoucherType[];

        setAvailableVouchers(normalized);
      } catch (error: any) {
        console.error("Failed to load vouchers", error);
        toast.error(t('payment.cannotLoadVouchers', 'Không thể tải mã giảm giá'));
      } finally {
        setLoadingVouchers(false);
      }
    };

    loadVouchers();
  }, [bookingType, t]);

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
    const targetCode = voucherCode.trim().toUpperCase();
    const voucher = availableVouchers.find((v) => v.code?.toUpperCase() === targetCode);

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

      const isAuthenticated = tokenService.isAuthenticated?.() || !!tokenService.getToken?.();
      const user = tokenService.getUserData();

      if (!isAuthenticated) {
        toast.error(t('common.loginRequired', "Vui lòng đăng nhập"));
        goTo("login");
        return;
      }

      const userId = user?.id || bookingData?.userId;
      const userEmail = user?.email || user?.sub || tokenService.getUserData?.()?.email;
      if (!userId && !userEmail) {
        toast.error(t('payment.userMissing', "Không tìm thấy thông tin người dùng"));
        return;
      }

      if (finalAmount <= 0) {
        toast.error(t('payment.invalidAmount', "Số tiền thanh toán không hợp lệ"));
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
        userId,
        userEmail,
        amount: finalAmount,
        currency: "VND",
        paymentMethod: selectedMethod
      } as any;

      const paymentResponse = await paymentApi.initiatePayment(paymentRequest);

      // Persist pending payment info for callback pages (Stripe)
      sessionStorage.setItem(
        PENDING_PAYMENT_KEY,
        JSON.stringify({
          bookingId,
          paymentId: paymentResponse?.id,
          amount: finalAmount,
          method: selectedMethod
        })
      );

      // Step 3: Handle payment response
      if (selectedMethod === "WALLET") {
        // Wallet payment completes immediately
        toast.success(t('payment.walletPaymentSuccess', "Thanh toán ví thành công!"));
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        goTo("payment-success", {
          bookingId,
          paymentId: paymentResponse.id
        });
      } else if (paymentResponse?.metadata?.paymentUrl || (paymentResponse as any)?.paymentUrl) {
        // Redirect to payment gateway (Stripe)
        toast.success(t('payment.redirectingToStripe', "Đang chuyển đến Stripe..."));
        const redirectUrl = paymentResponse.metadata?.paymentUrl || (paymentResponse as any)?.paymentUrl;
        window.location.href = redirectUrl;
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
    const selectedSeats = bookingData?.flightData?.selectedSeats || { outbound: [], return: [] };

    const passengerCounts = bookingData?.passengersCount || bookingData?.passengers || { adults: passengers.length || 1, children: 0, infants: 0 };

    const cabinClass = bookingData?.flightData?.cabinClass || bookingData?.cabinClass || 'economy';
    const outboundBasePrice = flightData?.outbound?.cabinClasses?.[cabinClass]?.fromPrice || 1500000;
    const returnBasePrice = flightData?.return?.cabinClasses?.[cabinClass]?.fromPrice || 0;
    const basePriceTotal = (outboundBasePrice + returnBasePrice) * (passengers.length || 1);
    const taxesTotal = Math.round((outboundBasePrice + returnBasePrice) * 0.1) * (passengers.length || 1);
    const seatFees = (selectedSeats.outbound?.reduce((acc: number, seat: any) => acc + (seat.price || 0), 0) || 0)
      + (selectedSeats.return?.reduce((acc: number, seat: any) => acc + (seat.price || 0), 0) || 0);
    const discount = voucherDiscount || 0;
    const totalWithFees = basePriceTotal + taxesTotal + seatFees - discount;

    // Collect all seat IDs
    const flightSeatIds = [
      ...(selectedSeats.outbound?.map((seat: any) => seat.id) || []),
      ...(selectedSeats.return?.map((seat: any) => seat.id) || [])
    ];

    return {
      productType: "FLIGHT",
      bookingType: "FLIGHT",
      productId: flightData?.outbound?.id || flightData?.outbound?.flightNumber || "FLIGHT001",
      flightId: flightData?.outbound?.flightNumber || flightData?.outbound?.id,
      flightSeatIds: flightSeatIds, // Add seat IDs to booking
      seatCount: flightSeatIds.length,
      amount: totalWithFees,
      basePrice: basePriceTotal,
      taxes: taxesTotal,
      fees: seatFees,
      discount,
      totalPrice: totalWithFees,
      currency: "VND",
      startDate: flightData?.outbound?.departureTime || flightData?.outbound?.date || new Date().toISOString(),
      endDate: flightData?.return?.arrivalTime || flightData?.return?.date || undefined,
      quantity: passengers.length || 1,
      numberOfGuests: {
        adults: passengerCounts?.adults || passengers.length || 1,
        children: passengerCounts?.children || 0,
        infants: passengerCounts?.infants || 0
      },
      guestInfo: {
        firstName: contactInfo?.fullName?.split(" ")[0] || "Guest",
        lastName: contactInfo?.fullName?.split(" ").slice(1).join(" ") || "User",
        email: contactInfo?.email || "guest@example.com",
        phone: contactInfo?.phone || ""
      },
      specialRequests: `Flight: ${flightData?.outbound?.from || flightData?.outbound?.departureAirportCode} to ${flightData?.outbound?.to || flightData?.outbound?.arrivalAirportCode}. Passengers: ${passengers.length}. Seats: ${flightSeatIds.join(", ")}`,
      voucherCode: appliedVoucher?.code,
      voucherDiscount: discount,
      paymentStatus: "PENDING",
      status: "PENDING",
      metadata: {
        passengers,
        contactInfo,
        selectedSeats,
        cabinClass,
        basePriceTotal,
        taxesTotal,
        seatFees,
        discount,
        finalAmount: totalWithFees
      }
    };
  };

  // Create hotel booking payload
  const createHotelBooking = () => {
    const contactInfo = bookingData?.contactInfo || {};
    const guestInfo = bookingData?.guestInfo || {};
    const hotel = bookingData?.hotelData?.hotel || {};
    const room = bookingData?.hotelData?.room || {};
    const booking = bookingData?.hotelData?.booking || {};
    const roomCount = bookingData?.roomCount || booking?.roomCount || 1;

    return {
      productType: "HOTEL",
      productId: hotel?.id || "HOTEL001",
      hotelId: hotel?.id,
      roomId: room?.id,
      amount: finalAmount,
      startDate: booking?.checkIn || new Date().toISOString(),
      endDate: booking?.checkOut || undefined,
      quantity: roomCount,
      numberOfGuests: {
        adults: booking?.guests || 2,
        children: 0,
        infants: 0
      },
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
      specialRequests: `Hotel: ${hotel?.name}. Room: ${room?.name}. Check-in: ${booking?.checkIn}, Check-out: ${booking?.checkOut}. Rooms: ${roomCount}`
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
      amount: finalAmount,
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
    const pricing = bookingData?.activityData?.pricing || {};

    return {
      productType: "ACTIVITY",
      productId: activity?.id || "ACTIVITY001",
      amount: finalAmount,
      basePrice: pricing?.totalPrice ?? finalAmount,
      discount: voucherDiscount,
      totalPrice: finalAmount,
      startDate: booking?.date || new Date().toISOString(),
      endDate: undefined,
      quantity: booking?.participants || 1,
      guestInfo: {
        firstName: participantInfo?.fullName?.split(" ")[0] || "Guest",
        lastName: participantInfo?.fullName?.split(" ").slice(1).join(" ") || "User",
        email: contactInfo?.email || "guest@example.com",
        phone: participantInfo?.phone || contactInfo?.phone || ""
      },
      specialRequests: `Activity: ${activity?.name}. Participants: ${booking?.participants}. Date: ${booking?.date || ''} ${booking?.time || ''}. Pickup: ${booking?.hasPickup ? 'Yes' : 'No'}`
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
              {!appliedVoucher && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    {t('payment.availableVouchers', "Mã giảm giá có sẵn:")}
                    {loadingVouchers && (
                      <span className="text-xs text-gray-400">{t('common.loading', 'Đang tải...')}</span>
                    )}
                  </p>
                  {availableVouchers.length === 0 && !loadingVouchers ? (
                    <p className="text-xs text-gray-400">{t('payment.noVoucher', 'Không có mã giảm giá khả dụng')}</p>
                  ) : (
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
                              <p className="text-sm text-gray-600">{voucher.description}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              {t('payment.apply', 'Áp dụng')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Additional content can go here if needed */}
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
  const room = data?.hotelData?.room;
  const booking = data?.hotelData?.booking;
  const roomCount = data?.roomCount || booking?.roomCount || 1;

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
      {room && (
        <p className="text-sm text-gray-700">
          {roomCount > 1 ? `${roomCount} × ` : ''}{room.name}
        </p>
      )}
      <div className="text-sm space-y-1 text-gray-600">
        <p>
          <MapPin className="w-4 h-4 inline mr-1" />
          {hotel.address || hotel.location}
        </p>
        <p>
          <Calendar className="w-4 h-4 inline mr-1" />
          {booking?.checkIn} - {booking?.checkOut}
        </p>
        <p>
          <Users className="w-4 h-4 inline mr-1" />
          {roomCount} {t('payment.rooms', 'phòng')} · {booking?.guests || 2} {t('payment.guests', "khách")}
        </p>
        {booking?.breakfast && (
          <p className="text-xs text-green-600">
            ✓ {t('hotels.breakfastIncluded', 'Bao gồm bữa sáng')}
          </p>
        )}
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

function DefaultSummary({ data: _data }: { data: any }) {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-gray-600">
      <p>{t('payment.bookingDetails', "Chi tiết đặt chỗ")}</p>
    </div>
  );
}
