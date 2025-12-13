import { Calendar, Info, MapPin, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import type { PageType } from "../../MainApp";
import { useNavigationProps } from "../../router/withPageProps";
import { bookingApi, profileApi, tokenService } from "../../utils/api";

interface HotelReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  hotelData?: any;
}

export default function HotelReviewPage({ onNavigate, hotelData: hotelDataProp }: HotelReviewPageProps) {
  const { t } = useTranslation();
  const { pageData, onNavigate: navigateFromHook } = useNavigationProps();
  const hotelData = useMemo(() => hotelDataProp ?? pageData, [hotelDataProp, pageData]);
  const goTo = onNavigate ?? navigateFromHook;
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+84"
  });

  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const [guestInfo, setGuestInfo] = useState({
    title: "",
    fullName: ""
  });

  const [bookingForMyself, setBookingForMyself] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const [specialRequests, setSpecialRequests] = useState({
    nonSmoking: false,
    highFloor: false,
    connectingRooms: false
  });

  const [addons, setAddons] = useState({
    travelInsurance: false,
    tourTickets: false
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [roomCount, setRoomCount] = useState(hotelData?.booking?.roomCount || 1);

  // Debug: Log received hotel data
  useEffect(() => {
    console.log('=== HotelReviewPage Data ===');
    console.log('Full hotelData:', hotelData);
    console.log('hotel:', hotelData?.hotel);
    console.log('room:', hotelData?.room);
    console.log('booking:', hotelData?.booking);
    console.log('pricing:', hotelData?.pricing);
  }, [hotelData]);

  // Load user info when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (tokenService.isAuthenticated()) {
        try {
          const userProfile = await profileApi.getCurrentUser();
          
          // Auto-fill contact info from user profile
          setContactInfo({
            fullName: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
            email: userProfile.email || "",
            phone: userProfile.mobile || "",
            countryCode: "+84"
          });
          
          toast.success(t('hotels.userInfoLoaded') || 'Đã tải thông tin người dùng');
        } catch (error: any) {
          console.error('Error loading user profile:', error);
          if (error.message !== 'UNAUTHORIZED') {
            toast.info(t('hotels.fillContactInfo') || 'Vui lòng điền thông tin liên hệ');
          }
        } finally {
          setIsLoadingUserData(false);
        }
      } else {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, [t]);

  // Mock data
  const hotel = hotelData?.hotel || {
    name: "Grand Saigon Hotel",
    address: "8 Đồng Khởi, Quận 1, TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    rating: 4.5
  };

  const room = hotelData?.room || {
    id: "",
    name: "Superior Twin Room",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    size: 28,
    amenities: []
  };

  const booking = hotelData?.booking || {
    checkIn: "Thứ 6, 7/11/2025",
    checkOut: "Thứ 7, 8/11/2025",
    nights: 1,
    roomType: "Superior Twin Room",
    roomCount: 1,
    guests: 2,
    option: "Without Breakfast",
    bedType: "2 giường đơn",
    breakfast: false
  };

  const pricing = hotelData?.pricing || {
    roomPrice: 1294000,
    taxAndFees: 200000,
    insurance: 43500,
    tourTicket: 907000
  };

  // Calculate total price for multiple rooms
  const totalAddons = 
    (addons.travelInsurance ? pricing.insurance : 0) +
    (addons.tourTickets ? pricing.tourTicket : 0);

  const baseRoomPrice = pricing.roomPrice * roomCount;
  const baseTaxAndFees = pricing.taxAndFees * roomCount;
  const totalPrice = baseRoomPrice + baseTaxAndFees + totalAddons;

  const handleContinueToPayment = async () => {
    // Validation
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert(t('hotels.pleaseFillContactInfo') || "Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    if (!bookingForMyself && (!guestInfo.title || !guestInfo.fullName)) {
      alert(t('hotels.pleaseFillGuestInfo') || "Vui lòng điền thông tin khách sẽ check-in");
      return;
    }

    if (!agreeToTerms) {
      alert(t('hotels.pleaseAgreeToTerms') || "Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    if (!hotelData?.hotel || !hotelData?.room) {
      toast.error(t('hotels.missingHotelData') || 'Thiếu dữ liệu khách sạn, vui lòng chọn lại');
      goTo('hotel-list');
      return;
    }

    // Require login before creating booking
    if (!tokenService.isAuthenticated?.()) {
      toast.error(t('common.loginRequired') || 'Vui lòng đăng nhập');
      goTo('login');
      return;
    }

    try {
      setIsCreatingBooking(true);

      // Build special requests string
      const specialRequestsList: string[] = [];
      if (specialRequests.nonSmoking) specialRequestsList.push('Non-smoking room');
      if (specialRequests.highFloor) specialRequestsList.push('High floor');
      if (specialRequests.connectingRooms) specialRequestsList.push('Connecting rooms');
      
      const specialRequestsText = [
        `Hotel: ${hotel.name}`,
        `Room: ${room.name}`,
        `Check-in: ${booking.checkIn}`,
        `Check-out: ${booking.checkOut}`,
        `Rooms: ${roomCount}`,
        `Guests: ${booking.guests || 2}`,
        `Bed Type: ${booking.bedType || 'N/A'}`,
        `Breakfast: ${booking.breakfast ? 'Yes' : 'No'}`,
        specialRequestsList.length > 0 ? `Special Requests: ${specialRequestsList.join(', ')}` : ''
      ].filter(Boolean).join(' | ');

      const bookingPayload = {
        productType: "HOTEL",
        bookingType: "HOTEL",
        productId: hotel.id || "HOTEL001",
        hotelId: hotel.id,
        roomId: room.id,
        userId: tokenService.getUserData()?.id,
        amount: totalPrice,
        basePrice: baseRoomPrice,
        taxes: baseTaxAndFees,
        fees: totalAddons,
        discount: 0,
        totalPrice,
        currency: "VND",
        startDate: booking.checkIn || new Date().toISOString(),
        endDate: booking.checkOut || undefined,
        quantity: roomCount,
        numberOfGuests: {
          adults: booking.guests || 2,
          children: 0,
          infants: 0
        },
        guestInfo: {
          fullName: bookingForMyself ? contactInfo.fullName : guestInfo.fullName,
          firstName: (bookingForMyself ? contactInfo.fullName : guestInfo.fullName)?.split(" ")[0] || "Guest",
          lastName: (bookingForMyself ? contactInfo.fullName : guestInfo.fullName)?.split(" ").slice(1).join(" ") || "User",
          email: contactInfo.email,
          phone: contactInfo.phone,
          title: bookingForMyself ? "" : guestInfo.title
        },
        specialRequests: specialRequestsText,
        paymentStatus: "PENDING",
        status: "PENDING",
        metadata: {
          contactInfo,
          guestInfo: bookingForMyself ? contactInfo : guestInfo,
          bookingForMyself,
          specialRequests,
          addons,
          hotelData,
          roomCount,
          baseRoomPrice,
          baseTaxAndFees,
          totalAddons,
          finalAmount: totalPrice
        }
      } as any;

      console.log('Creating hotel booking with payload:', bookingPayload);
      const createdBooking = await bookingApi.createBooking(bookingPayload);
      console.log('Hotel booking created:', createdBooking);

      toast.success(t('hotels.bookingCreated') || 'Đã tạo đặt phòng thành công');

      // Navigate to payment with persisted booking
      goTo("payment-methods", {
        type: "hotel",
        contactInfo,
        guestInfo: bookingForMyself ? contactInfo : guestInfo,
        bookingForMyself,
        specialRequests,
        addons,
        hotelData: {
          ...hotelData,
          booking: {
            ...booking,
            roomCount
          }
        },
        totalPrice,
        bookingId: createdBooking?.id,
        booking: createdBooking,
        userId: tokenService.getUserData()?.id,
        roomCount
      });
    } catch (error: any) {
      console.error('Failed to create hotel booking:', error);
      toast.error(error.message || t('payment.bookingFailed') || 'Không thể tạo đặt phòng, vui lòng thử lại');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("hotel")} className="hover:text-blue-600">
              Khách sạn
            </button>
            <span>/</span>
            <button onClick={() => onNavigate("hotel-list")} className="hover:text-blue-600">
              Danh sách
            </button>
            <span>/</span>
            <span className="text-gray-900">Xem lại & Điền thông tin</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">{t('hotels.contactInfo') || 'Thông tin Liên hệ'}</h2>
                  <p className="text-sm text-gray-600">
                    {t('hotels.confirmationWillBeSent') || 'Xác nhận đặt phòng sẽ được gửi đến đây'}
                  </p>
                </div>
                {!isEditingContact && !isLoadingUserData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
                  >
                    {t('common.edit') || 'Chỉnh sửa'}
                  </Button>
                )}
              </div>

              {isLoadingUserData ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">{t('common.loading') || 'Đang tải...'}</span>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">
                    {t('hotels.fullName') || 'Tên đầy đủ'} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                    disabled={!isEditingContact}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">
                    Email <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    disabled={!isEditingContact}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="contactPhone">
                    {t('hotels.mobilePhone') || 'Số điện thoại di động'} <span className="text-red-600">*</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={contactInfo.countryCode}
                      onValueChange={(v) => setContactInfo({ ...contactInfo, countryCode: v })}
                      disabled={!isEditingContact}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+84">🇻🇳 +84</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+86">🇨🇳 +86</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="contactPhone"
                      value={contactInfo.phone.replace(contactInfo.countryCode, "")}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: contactInfo.countryCode + e.target.value })}
                      disabled={!isEditingContact}
                      className="flex-1"
                      placeholder="901234567"
                    />
                  </div>
                </div>
              </div>

              {isEditingContact && (
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => setIsEditingContact(false)}>
                    {t('common.save') || 'Lưu'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingContact(false)}
                  >
                    {t('common.cancel') || 'Hủy'}
                  </Button>
                </div>
              )}
                </>
              )}
            </Card>

            {/* Guest Details */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-6">Chi tiết Khách</h2>

              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="bookingForMyself"
                    checked={bookingForMyself}
                    onCheckedChange={(checked) => {
                      setBookingForMyself(checked as boolean);
                      if (checked) {
                        setGuestInfo({
                          title: "",
                          fullName: contactInfo.fullName
                        });
                      }
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="bookingForMyself" className="text-sm text-gray-700 cursor-pointer">
                    Tôi đặt cho chính mình (I'm booking for myself)
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guestTitle">
                    Quý danh <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={guestInfo.title}
                    onValueChange={(v) => setGuestInfo({ ...guestInfo, title: v })}
                    disabled={bookingForMyself}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Ông (Mr.)</SelectItem>
                      <SelectItem value="mrs">Bà (Mrs.)</SelectItem>
                      <SelectItem value="ms">Cô (Ms.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="guestName">
                    Tên đầy đủ <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="guestName"
                    value={guestInfo.fullName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                    disabled={bookingForMyself}
                    className="mt-1"
                    placeholder="Tên người sẽ check-in"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tên của khách sẽ check-in tại quầy lễ tân
                  </p>
                </div>
              </div>
            </Card>

            {/* Special Requests */}
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">Yêu cầu Đặc biệt</h2>
                  <p className="text-sm text-gray-600">
                    Các yêu cầu này tùy thuộc vào tình trạng sẵn có của khách sạn
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="nonSmoking"
                    checked={specialRequests.nonSmoking}
                    onCheckedChange={(checked) => 
                      setSpecialRequests({ ...specialRequests, nonSmoking: checked as boolean })
                    }
                  />
                  <label htmlFor="nonSmoking" className="text-sm text-gray-700 cursor-pointer">
                    Phòng không hút thuốc (Non-smoking Room)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="highFloor"
                    checked={specialRequests.highFloor}
                    onCheckedChange={(checked) => 
                      setSpecialRequests({ ...specialRequests, highFloor: checked as boolean })
                    }
                  />
                  <label htmlFor="highFloor" className="text-sm text-gray-700 cursor-pointer">
                    Tầng cao (High Floor)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="connectingRooms"
                    checked={specialRequests.connectingRooms}
                    onCheckedChange={(checked) => 
                      setSpecialRequests({ ...specialRequests, connectingRooms: checked as boolean })
                    }
                  />
                  <label htmlFor="connectingRooms" className="text-sm text-gray-700 cursor-pointer">
                    Phòng thông nhau (Connecting Rooms)
                  </label>
                </div>
              </div>
            </Card>

            {/* Add-ons */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-6">Tiện ích Bổ sung</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg hover:border-blue-600 transition-colors cursor-pointer">
                  <Checkbox
                    id="insurance"
                    checked={addons.travelInsurance}
                    onCheckedChange={(checked) => 
                      setAddons({ ...addons, travelInsurance: checked as boolean })
                    }
                  />
                  <label htmlFor="insurance" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Bảo hiểm Du lịch Chubb</span>
                      <span className="text-blue-600">
                        {pricing.insurance.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Bảo vệ chuyến đi của bạn với bảo hiểm toàn diện
                    </p>
                  </label>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg hover:border-blue-600 transition-colors cursor-pointer">
                  <Checkbox
                    id="tourTicket"
                    checked={addons.tourTickets}
                    onCheckedChange={(checked) => 
                      setAddons({ ...addons, tourTickets: checked as boolean })
                    }
                  />
                  <label htmlFor="tourTicket" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Coupon Sun World Ba Na Hills</span>
                      <span className="text-blue-600">
                        {pricing.tourTicket.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Vé tham quan Sun World Ba Na Hills (1 ngày)
                    </p>
                  </label>
                </div>
              </div>
            </Card>

            {/* Terms & Conditions */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  Tôi đã đọc và đồng ý với{" "}
                  <button className="text-blue-600 hover:underline">Điều khoản & Điều kiện</button>,{" "}
                  <button className="text-blue-600 hover:underline">Chính sách Hủy phòng</button> và{" "}
                  <button className="text-blue-600 hover:underline">Chính sách Bảo mật</button> của Wanderlust
                </label>
              </div>
            </Card>

            {/* Action Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleContinueToPayment}
              disabled={!agreeToTerms || isCreatingBooking}
            >
              {isCreatingBooking ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('common.processing') || 'Đang xử lý...'}</span>
                </div>
              ) : (
                t('hotels.continueToPayment') || 'TIẾP TỤC THANH TOÁN'
              )}
            </Button>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h2 className="text-xl text-gray-900 mb-6">Đặt phòng của bạn</h2>

                {/* Hotel Info */}
                <div className="mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{hotel.address}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Booking Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="text-gray-900">{booking.checkIn}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="text-gray-900">{booking.checkOut}</p>
                      <p className="text-xs text-gray-500">({booking.nights} đêm)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Số lượng phòng</p>
                      <Select 
                        value={roomCount.toString()} 
                        onValueChange={(value) => setRoomCount(parseInt(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn số phòng" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} phòng
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-2">
                        Loại phòng: {booking.roomType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.option && `${booking.option} • `}
                        {booking.bedType && `${booking.bedType} • `}
                        {booking.guests} khách/phòng
                      </p>
                      {booking.breakfast && (
                        <p className="text-xs text-green-600 mt-1">✓ Bao gồm bữa sáng</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price Details */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Giá phòng ({roomCount} phòng × {booking.nights} đêm)
                    </span>
                    <span className="text-gray-900">
                      {baseRoomPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế và Phí ({roomCount} phòng)</span>
                    <span className="text-gray-900">
                      {baseTaxAndFees.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {addons.travelInsurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bảo hiểm Du lịch</span>
                      <span className="text-gray-900">
                        {pricing.insurance.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}

                  {addons.tourTickets && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Tour</span>
                      <span className="text-gray-900">
                        {pricing.tourTicket.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-2xl text-blue-600">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
