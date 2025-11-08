import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { MapPin, Calendar, Users, Info } from "lucide-react";
import type { PageType } from "./MainApp";

interface HotelReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  hotelData?: any;
}

export default function HotelReviewPage({ onNavigate, hotelData }: HotelReviewPageProps) {
  const [contactInfo, setContactInfo] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84901234567",
    countryCode: "+84"
  });

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

  // Mock data
  const hotel = hotelData?.hotel || {
    name: "Grand Saigon Hotel",
    address: "8 Đồng Khởi, Quận 1, TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    rating: 4.5
  };

  const booking = hotelData?.booking || {
    checkIn: "Thứ 6, 7/11/2025",
    checkOut: "Thứ 7, 8/11/2025",
    nights: 1,
    roomType: "Superior Twin Room",
    roomCount: 1,
    guests: 2
  };

  const pricing = {
    roomPrice: 1294000,
    taxAndFees: 200000,
    insurance: 43500,
    tourTicket: 907000
  };

  const totalAddons = 
    (addons.travelInsurance ? pricing.insurance : 0) +
    (addons.tourTickets ? pricing.tourTicket : 0);

  const totalPrice = pricing.roomPrice + pricing.taxAndFees + totalAddons;

  const handleContinueToPayment = () => {
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    if (!bookingForMyself && (!guestInfo.title || !guestInfo.fullName)) {
      alert("Vui lòng điền thông tin khách sẽ check-in");
      return;
    }

    if (!agreeToTerms) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    onNavigate("payment-methods", {
      type: "hotel",
      contactInfo,
      guestInfo: bookingForMyself ? contactInfo : guestInfo,
      specialRequests,
      addons,
      hotelData,
      totalPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="booking" onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
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
                  <h2 className="text-2xl text-gray-900 mb-1">Thông tin Liên hệ</h2>
                  <p className="text-sm text-gray-600">
                    Xác nhận đặt phòng sẽ được gửi đến đây
                  </p>
                </div>
                {!isEditingContact && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">
                    Tên đầy đủ <span className="text-red-600">*</span>
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
                    Số điện thoại di động <span className="text-red-600">*</span>
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
                    Lưu
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingContact(false)}
                  >
                    Hủy
                  </Button>
                </div>
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
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
              disabled={!agreeToTerms}
            >
              TIẾP TỤC THANH TOÁN
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
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{hotel.address}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Booking Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="text-gray-900">{booking.checkIn}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="text-gray-900">{booking.checkOut}</p>
                      <p className="text-xs text-gray-500">({booking.nights} đêm)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Loại phòng</p>
                      <p className="text-gray-900">
                        ({booking.roomCount}x) {booking.roomType}
                      </p>
                      <p className="text-xs text-gray-500">({booking.guests} khách)</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price Details */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Giá phòng ({booking.nights} đêm)
                    </span>
                    <span className="text-gray-900">
                      {pricing.roomPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế và Phí</span>
                    <span className="text-gray-900">
                      {pricing.taxAndFees.toLocaleString('vi-VN')}đ
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
