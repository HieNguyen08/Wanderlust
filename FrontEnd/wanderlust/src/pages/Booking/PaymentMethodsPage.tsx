import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Loader2,
  MapPin,
  Plane,
  Shield,
  Tag,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { paymentApi, type PaymentMethod } from "../../api/paymentApi";
import { Footer } from "../../components/Footer";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { PaymentMethodSelector } from "../../components/payment/PaymentMethodSelector";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
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
  title?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  totalUsesLimit?: number;
  usedCount?: number;
  conditions?: string[];
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
  const [selectedVoucherDetail, setSelectedVoucherDetail] = useState<VoucherType | null>(null);

  // Extract booking info
  const bookingType = bookingData?.type || "flight";

  // Pre-compute flight pricing once so both display and payload use the same numbers
  const flightPricing = useMemo(() => {
    const passengers = bookingData?.passengers || [];
    const flightData = bookingData?.flightData || {};
    const selectedSeats = bookingData?.flightData?.selectedSeats || { outbound: [], return: [] };
    const passengerCounts = bookingData?.passengersCount || bookingData?.passengers || { adults: passengers.length || 1, children: 0, infants: 0 };
    const cabinClass = bookingData?.flightData?.cabinClass || bookingData?.cabinClass || "economy";
    const outboundBasePrice = flightData?.outbound?.cabinClasses?.[cabinClass]?.fromPrice || 1500000;
    const returnBasePrice = flightData?.return?.cabinClasses?.[cabinClass]?.fromPrice || 0;
    const basePriceTotal = (outboundBasePrice + returnBasePrice) * (passengers.length || 1);
    const taxesTotal = Math.round((outboundBasePrice + returnBasePrice) * 0.1) * (passengers.length || 1);
    const seatFees = (selectedSeats.outbound?.reduce((acc: number, seat: any) => acc + (seat.price || 0), 0) || 0)
      + (selectedSeats.return?.reduce((acc: number, seat: any) => acc + (seat.price || 0), 0) || 0);
    const websiteFees = 0; // Phí dịch vụ web = 0
    const subtotal = basePriceTotal + taxesTotal + seatFees + websiteFees;

    return {
      passengers,
      passengerCounts,
      flightData,
      selectedSeats,
      cabinClass,
      basePriceTotal,
      taxesTotal,
      seatFees,
      websiteFees,
      subtotal
    };
  }, [bookingData]);

  // Subtotal before voucher discount per booking type
  const subtotalAmount = useMemo(() => {
    if (bookingType === "flight") return flightPricing.subtotal;
    if (bookingType === "hotel") {
      return bookingData?.hotelData?.booking?.totalPrice
        ?? bookingData?.hotelData?.booking?.total
        ?? bookingData?.totalPrice
        ?? bookingData?.amount
        ?? 0;
    }
    if (bookingType === "car-rental") {
      return bookingData?.carData?.rental?.totalPrice
        ?? bookingData?.carData?.rental?.price
        ?? bookingData?.totalPrice
        ?? bookingData?.amount
        ?? 0;
    }
    if (bookingType === "activity") {
      return bookingData?.activityData?.pricing?.totalPrice
        ?? bookingData?.totalPrice
        ?? bookingData?.amount
        ?? 0;
    }
    return bookingData?.totalPrice || bookingData?.amount || 0;
  }, [bookingType, bookingData, flightPricing]);

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
          discount: p.value ?? p.discountValue ?? p.discount ?? 0,
          type: (p.type || p.discountType || "FIXED_AMOUNT") as VoucherType["type"],
          minOrderValue: p.minSpend ?? p.minOrderValue ?? 0,
          maxDiscount: p.maxDiscount,
          description: p.description || p.title || p.code,
          title: p.title,
          image: p.image,
          startDate: p.startDate,
          endDate: p.endDate,
          totalUsesLimit: p.totalUsesLimit,
          usedCount: p.usedCount ?? 0,
          conditions: p.conditions || [],
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

    if (subtotalAmount < appliedVoucher.minOrderValue) return 0;

    if (appliedVoucher.type === "FIXED_AMOUNT") {
      return Math.min(appliedVoucher.discount, subtotalAmount);
    } else {
      const percentDiscount = (subtotalAmount * appliedVoucher.discount) / 100;
      return Math.min(
        percentDiscount,
        appliedVoucher.maxDiscount || subtotalAmount
      );
    }
  };

  const voucherDiscount = calculateDiscount();
  const finalAmount = Math.max(subtotalAmount - voucherDiscount, 0);

  const voucherMeta = appliedVoucher
    ? {
        code: appliedVoucher.code,
        discountValue: voucherDiscount,
        discountType: appliedVoucher.type,
        minOrderValue: appliedVoucher.minOrderValue,
        maxDiscount: appliedVoucher.maxDiscount,
        vendorId: appliedVoucher.vendorId,
        adminCreateCheck: appliedVoucher.adminCreateCheck === true
      }
    : null;

  // Apply voucher
  const handleApplyVoucher = async () => {
    const targetCode = voucherCode.trim().toUpperCase();
    const voucher = availableVouchers.find((v) => v.code?.toUpperCase() === targetCode);

    if (!voucher) {
      toast.error(t('payment.invalidVoucher', "Mã giảm giá không hợp lệ"));
      return;
    }

    // Check time validity
    const now = new Date();
    if (voucher.startDate && new Date(voucher.startDate) > now) {
      toast.error("Mã giảm giá chưa có hiệu lực");
      return;
    }
    if (voucher.endDate && new Date(voucher.endDate) < now) {
      toast.error("Mã giảm giá đã hết hạn");
      return;
    }

    // Check usage limit
    if (voucher.totalUsesLimit && voucher.usedCount >= voucher.totalUsesLimit) {
      toast.error("Mã giảm giá đã hết lượt sử dụng");
      return;
    }

    // Check minimum order value
    if (subtotalAmount < voucher.minOrderValue) {
      toast.error(
        t('payment.minOrderNotMet', "Đơn hàng chưa đủ giá trị tối thiểu {{amount}}", {
          amount: voucher.minOrderValue.toLocaleString('vi-VN') + 'đ'
        })
      );
      return;
    }

    try {
      // Step 1: Update promotion usedCount via user-level PATCH
      try {
        const vendorId = voucher.vendorId || '';
        const flightIdForService = bookingType === 'flight'
          ? (bookingData?.flightData?.outbound?.id || bookingData?.flightData?.outboundFlight?.id)
          : undefined;

        await fetch(`http://localhost:8080/api/promotions/usage/${voucher.code}?vendorId=${vendorId || ''}&serviceId=${flightIdForService || ''}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${tokenService.getToken()}`,
              'Content-Type': 'application/json'
            }
          });
      } catch (usageErr) {
        console.warn('Failed to increment voucher usage (non-blocking):', usageErr);
      }

      // Step 2: Calculate discount
      let discountAmount = 0;
      if (voucher.type === "FIXED_AMOUNT") {
        discountAmount = Math.min(voucher.discount, subtotalAmount);
      } else {
        const percentDiscount = (subtotalAmount * voucher.discount) / 100;
        discountAmount = Math.min(
          percentDiscount,
          voucher.maxDiscount || subtotalAmount
        );
      }

      // Step 3: Update booking if exists
      if (bookingData?.bookingId) {
        await bookingApi.updateBooking(bookingData.bookingId, {
          voucherCode: voucher.code,
          voucherDiscount: discountAmount,
          discount: discountAmount,
          totalPrice: subtotalAmount - discountAmount
        });
      }

      setAppliedVoucher(voucher);
      toast.success(t('payment.voucherApplied', "Đã áp dụng mã giảm giá"));
    } catch (error: any) {
      console.error('Failed to apply voucher:', error);
      toast.error("Không thể áp dụng mã giảm giá. Vui lòng thử lại.");
    }
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
        payableAmount: finalAmount,
        originalAmount: subtotalAmount,
        discountAmount: voucherDiscount,
        voucherCode: appliedVoucher?.code,
        voucherMeta,
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
          originalAmount: subtotalAmount,
          discountAmount: voucherDiscount,
          voucherCode: appliedVoucher?.code,
          voucherMeta,
          method: selectedMethod
        })
      );

      // Step 3: Handle payment response
      const markSeatsOccupied = async () => {
        if (bookingType !== "flight") return;
        const selectedSeats = bookingData?.flightData?.selectedSeats || { outbound: [], return: [] };
        const outboundIds = (selectedSeats.outbound || []).map((s: any) => s.id).filter(Boolean);
        const returnIds = (selectedSeats.return || []).map((s: any) => s.id).filter(Boolean);

        const allSeatIds = [...outboundIds, ...returnIds];
        for (const seatId of allSeatIds) {
          try {
            await fetch(`http://localhost:8080/api/flight-seats/${seatId}/status?status=OCCUPIED`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${tokenService.getToken()}`,
                'Content-Type': 'application/json'
              }
            });
          } catch (e) {
            console.warn('Failed to mark seat occupied:', seatId, e);
          }
        }
      };

      if (selectedMethod === "WALLET") {
        // Wallet payment completes immediately
        toast.success(t('payment.walletPaymentSuccess', "Thanh toán ví thành công!"));
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        await markSeatsOccupied();
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
    const passengers = flightPricing.passengers;
    const contactInfo = bookingData?.contactInfo || {};
    const rawFlightData = flightPricing.flightData;
    const selectedSeats = flightPricing.selectedSeats;

    // Handle both structures: flightData.outbound vs flightData.outboundFlight
    const outboundFlight = rawFlightData?.outbound || rawFlightData?.outboundFlight;
    const returnFlight = rawFlightData?.return || rawFlightData?.returnFlight;

    const passengerCounts = flightPricing.passengerCounts;
    const { basePriceTotal, taxesTotal, seatFees, websiteFees, cabinClass } = flightPricing;

    const discount = voucherDiscount || 0;
    const totalWithFees = Math.max(flightPricing.subtotal - discount, 0);

    // Collect all seat IDs
    const flightSeatIds = [
      ...(selectedSeats.outbound?.map((seat: any) => seat.id) || []),
      ...(selectedSeats.return?.map((seat: any) => seat.id) || [])
    ];

    // Build flightId List (1 for one-way, 2 for round-trip)
    const outboundFlightId = outboundFlight?.id || outboundFlight?.flightNumber;
    const returnFlightId = returnFlight?.id || returnFlight?.flightNumber;

    const flightIds = [outboundFlightId];
    const tripType = bookingData?.flightData?.tripType || bookingData?.tripType || 'one-way';
    if (tripType === 'round-trip' && returnFlightId) {
      flightIds.push(returnFlightId);
    }

    console.log('=== Creating Flight Booking in PaymentMethodsPage ===');
    console.log('rawFlightData:', rawFlightData);
    console.log('outboundFlight:', outboundFlight);
    console.log('returnFlight:', returnFlight);
    console.log('tripType:', tripType);
    console.log('flightIds:', flightIds);
    console.log('selectedSeats:', selectedSeats);

    // Determine correct startDate and endDate
    let startDate = outboundFlight?.departureTime;
    let endDate;

    console.log('startDate from outboundFlight:', startDate);

    if (tripType === 'round-trip' && returnFlight) {
      endDate = returnFlight.arrivalTime;
    } else {
      endDate = outboundFlight?.arrivalTime;
    }

    console.log('endDate:', endDate);

    // Fallback to current date if still missing
    if (!startDate) {
      startDate = new Date().toISOString();
      console.warn('Missing departureTime, using current date');
    }

    return {
      productType: "FLIGHT",
      bookingType: "FLIGHT",
      productId: flightIds[0] || "UNKNOWN_FLIGHT",
      flightId: flightIds, // Now a List<String>
      flightSeatIds: flightSeatIds,
      seatCount: flightSeatIds.length,
      amount: totalWithFees,
      basePrice: basePriceTotal + seatFees,
      taxes: taxesTotal,
      fees: websiteFees,
      discount,
      totalPrice: totalWithFees,
      currency: "VND",
      startDate,
      endDate,
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
      specialRequests: `Flights: ${flightIds.join(', ')}. Passengers: ${passengers.length}. Seats: ${flightSeatIds.join(", ")}`,
      voucherCode: appliedVoucher?.code,
      voucherDiscount: discount,
      originalAmount: flightPricing.subtotal,
      voucherAdminCreated: appliedVoucher?.adminCreateCheck === true,
      voucherVendorId: appliedVoucher?.vendorId,
      paymentStatus: "PENDING",
      status: "PENDING",
      metadata: {
        passengers,
        contactInfo,
        selectedSeats,
        selectedFlights: { // NEW: Store full flight info
          outbound: outboundFlight,
          return: returnFlight
        },
        cabinClass,
        basePriceTotal,
        taxesTotal,
        seatFees,
        discount,
        finalAmount: totalWithFees,
        originalAmount: flightPricing.subtotal,
        voucherMeta
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

    // Respect user-selected check-in/out from HotelReviewPage
    const startDate = booking?.checkIn || new Date().toISOString();
    const endDate = booking?.checkOut || undefined;

    return {
      productType: "HOTEL",
      productId: hotel?.id || "HOTEL001",
      hotelId: hotel?.id,
      roomId: room?.id,
      amount: finalAmount,
      originalAmount: subtotalAmount,
      voucherCode: appliedVoucher?.code,
      voucherDiscount,
      voucherAdminCreated: appliedVoucher?.adminCreateCheck === true,
      voucherVendorId: appliedVoucher?.vendorId,
      paymentStatus: "PENDING",
      status: "PENDING",
      startDate,
      endDate,
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

    // Use user-selected pickup/dropoff from CarRentalReviewPage
    const startDate = rental?.pickup || new Date().toISOString();
    const endDate = rental?.dropoff || undefined;

    return {
      productType: "CAR_RENTAL",
      productId: car?.id || "CAR001",
      amount: finalAmount,
      originalAmount: subtotalAmount,
      voucherCode: appliedVoucher?.code,
      voucherDiscount,
      voucherAdminCreated: appliedVoucher?.adminCreateCheck === true,
      voucherVendorId: appliedVoucher?.vendorId,
      paymentStatus: "PENDING",
      status: "PENDING",
      startDate,
      endDate,
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

    // Activities: use selected date, normalized to 06:00 start and 22:00 end on that day
    const bookingDate = booking?.date;
    let startDate = bookingDate;
    let endDate: string | undefined = undefined;

    if (bookingDate) {
      const baseDate = bookingDate.split("T")[0];
      startDate = `${baseDate}T06:00:00`;
      endDate = `${baseDate}T22:00:00`;
    } else {
      startDate = new Date().toISOString();
    }

    return {
      productType: "ACTIVITY",
      productId: activity?.id || "ACTIVITY001",
      amount: finalAmount,
      basePrice: pricing?.totalPrice ?? finalAmount,
      discount: voucherDiscount,
      totalPrice: finalAmount,
      originalAmount: subtotalAmount,
      voucherCode: appliedVoucher?.code,
      voucherAdminCreated: appliedVoucher?.adminCreateCheck === true,
      voucherVendorId: appliedVoucher?.vendorId,
      paymentStatus: "PENDING",
      status: "PENDING",
      startDate,
      endDate,
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
                          className="p-3 border rounded-lg hover:border-blue-500 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 cursor-pointer" onClick={() => {
                              setVoucherCode(voucher.code);
                            }}>
                              <p className="font-medium">{voucher.code}</p>
                              <p className="text-sm text-gray-600">{voucher.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setSelectedVoucherDetail(voucher)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setVoucherCode(voucher.code);
                                  handleApplyVoucher();
                                }}
                              >
                                {t('payment.apply', 'Áp dụng')}
                              </Button>
                            </div>
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
                {bookingType === "flight" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t('payment.basePrice', "Giá vé")}:
                      </span>
                      <span>{(flightPricing.basePriceTotal + flightPricing.seatFees).toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t('payment.taxes', "Thuế và phí sân bay")}:
                      </span>
                      <span>{flightPricing.taxesTotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t('payment.serviceFee', "Phí dịch vụ Wanderlust")}:
                      </span>
                      <span>{flightPricing.websiteFees.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </>
                )}

                {bookingType !== "flight" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t('payment.subtotal', "Tạm tính")}:
                    </span>
                    <span>{subtotalAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('payment.discount', "Giảm giá")} ({appliedVoucher?.code}):</span>
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

      {/* Voucher Detail Dialog */}
      {selectedVoucherDetail && (
        <Dialog open={!!selectedVoucherDetail} onOpenChange={() => setSelectedVoucherDetail(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
              <DialogDescription>
                Xem thông tin đầy đủ về mã giảm giá
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Image */}
              {selectedVoucherDetail.image && (
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedVoucherDetail.image}
                    alt={selectedVoucherDetail.title || selectedVoucherDetail.code}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Code */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedVoucherDetail.title || selectedVoucherDetail.code}
                </h3>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-1 bg-gray-100 rounded text-lg font-mono">
                    {selectedVoucherDetail.code}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedVoucherDetail.code);
                      toast.success("Đã sao chép mã!");
                    }}
                  >
                    📋
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Mô tả
                </h4>
                <p className="text-gray-700">{selectedVoucherDetail.description}</p>
              </div>

              {/* Discount Info */}
              <div>
                <h4 className="font-semibold mb-2">Giá trị giảm giá</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-700">
                    {selectedVoucherDetail.type === "PERCENTAGE"
                      ? `Giảm ${selectedVoucherDetail.discount}%`
                      : `Giảm ${selectedVoucherDetail.discount.toLocaleString("vi-VN")}đ`}
                  </p>
                  {selectedVoucherDetail.maxDiscount && selectedVoucherDetail.type === "PERCENTAGE" && (
                    <p className="text-sm text-gray-600 mt-1">
                      Giảm tối đa: {selectedVoucherDetail.maxDiscount.toLocaleString("vi-VN")}đ
                    </p>
                  )}
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Điều kiện áp dụng
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {selectedVoucherDetail.minOrderValue > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>
                        Đơn hàng tối thiểu:{" "}
                        <strong>{selectedVoucherDetail.minOrderValue.toLocaleString("vi-VN")}đ</strong>
                      </span>
                    </li>
                  )}
                  {selectedVoucherDetail.startDate && selectedVoucherDetail.endDate && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>
                        Thời gian: {new Date(selectedVoucherDetail.startDate).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(selectedVoucherDetail.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </li>
                  )}
                  {selectedVoucherDetail.totalUsesLimit && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>
                        Số lượng có hạn: {selectedVoucherDetail.usedCount}/{selectedVoucherDetail.totalUsesLimit}
                      </span>
                    </li>
                  )}
                  {selectedVoucherDetail.conditions && selectedVoucherDetail.conditions.length > 0 && (
                    selectedVoucherDetail.conditions.map((condition: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{condition}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setVoucherCode(selectedVoucherDetail.code);
                    setSelectedVoucherDetail(null);
                    handleApplyVoucher();
                  }}
                >
                  Áp dụng ngay
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedVoucherDetail(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
