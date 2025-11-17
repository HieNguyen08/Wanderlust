import { Calendar, Info, MapPin, Users } from "lucide-react";
import { useState } from "react";
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

interface ActivityReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  activityData?: any;
}

export default function ActivityReviewPage({ onNavigate, activityData }: ActivityReviewPageProps) {
  const [contactInfo, setContactInfo] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84901234567",
    countryCode: "+84"
  });

  const [participantInfo, setParticipantInfo] = useState({
    fullName: "",
    phone: "",
    countryCode: "+84"
  });

  const [pickupInfo, setPickupInfo] = useState({
    hotelName: "",
    hotelAddress: "",
    roomNumber: ""
  });

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Mock data
  const activity = activityData?.activity || {
    name: "Tour 1 ngày Cù Lao Chàm",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    vendor: "Hoi An Explorer Tours",
    duration: "8 giờ",
    includes: ["Đưa đón", "Bữa trưa", "Hướng dẫn viên"]
  };

  const booking = activityData?.booking || {
    date: "Thứ 7, 8/11/2025",
    adults: 2,
    children: 1,
    hasPickup: true
  };

  const pricing = {
    adultPrice: 600000,
    childPrice: 400000
  };

  const totalPrice = 
    (pricing.adultPrice * booking.adults) + 
    (pricing.childPrice * booking.children);

  const handleContinueToPayment = () => {
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    if (!participantInfo.fullName || !participantInfo.phone) {
      alert("Vui lòng điền thông tin người đại diện nhóm");
      return;
    }

    if (booking.hasPickup && (!pickupInfo.hotelName || !pickupInfo.hotelAddress)) {
      alert("Vui lòng điền thông tin khách sạn để đưa đón");
      return;
    }

    if (!agreeToTerms) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    onNavigate("payment-methods", {
      type: "activity",
      contactInfo,
      participantInfo,
      pickupInfo,
      activityData,
      totalPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("activities")} className="hover:text-blue-600">
              Hoạt động vui chơi
            </button>
            <span>/</span>
            <button onClick={() => onNavigate("activity-detail")} className="hover:text-blue-600">
              Chi tiết
            </button>
            <span>/</span>
            <span className="text-gray-900">Xem lại & Điền thông tin</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p>
                    Voucher và thông tin tour sẽ được gửi qua email. Vui lòng mang theo voucher (in hoặc trên điện thoại) khi tham gia tour.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">Thông tin Liên hệ</h2>
                  <p className="text-sm text-gray-600">
                    Voucher và thông tin tour sẽ được gửi đến đây
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

            {/* Participant Information */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-900 mb-1">Thông tin Người tham gia</h2>
                <p className="text-sm text-gray-600">
                  Thông tin người đại diện nhóm (để hướng dẫn viên liên lạc)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participantName">
                    Tên đầy đủ <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="participantName"
                    value={participantInfo.fullName}
                    onChange={(e) => setParticipantInfo({ ...participantInfo, fullName: e.target.value })}
                    className="mt-1"
                    placeholder="Tên người đại diện nhóm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hướng dẫn viên sẽ gọi tên này khi tập trung
                  </p>
                </div>

                <div>
                  <Label htmlFor="participantPhone">
                    Số điện thoại di động <span className="text-red-600">*</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={participantInfo.countryCode}
                      onValueChange={(v) => setParticipantInfo({ ...participantInfo, countryCode: v })}
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
                      id="participantPhone"
                      value={participantInfo.phone}
                      onChange={(e) => setParticipantInfo({ ...participantInfo, phone: e.target.value })}
                      className="flex-1"
                      placeholder="901234567"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Để hướng dẫn viên liên lạc trong trường hợp khẩn cấp
                  </p>
                </div>
              </div>
            </Card>

            {/* Pickup Information */}
            {booking.hasPickup && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl text-gray-900 mb-1">Thông tin Đón</h2>
                  <p className="text-sm text-gray-600">
                    Tour này bao gồm dịch vụ đưa đón tại khách sạn
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hotelName">
                      Tên Khách sạn <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="hotelName"
                      value={pickupInfo.hotelName}
                      onChange={(e) => setPickupInfo({ ...pickupInfo, hotelName: e.target.value })}
                      className="mt-1"
                      placeholder="Ví dụ: Grand Saigon Hotel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hotelAddress">
                      Địa chỉ Khách sạn <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="hotelAddress"
                      value={pickupInfo.hotelAddress}
                      onChange={(e) => setPickupInfo({ ...pickupInfo, hotelAddress: e.target.value })}
                      className="mt-1"
                      placeholder="Ví dụ: 8 Đồng Khởi, Quận 1, TP.HCM"
                    />
                  </div>

                  <div>
                    <Label htmlFor="roomNumber">
                      Số phòng
                    </Label>
                    <Input
                      id="roomNumber"
                      value={pickupInfo.roomNumber}
                      onChange={(e) => setPickupInfo({ ...pickupInfo, roomNumber: e.target.value })}
                      className="mt-1"
                      placeholder="Ví dụ: 501"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Không bắt buộc - Giúp tài xế dễ dàng liên hệ
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Lưu ý:</strong> Thời gian đón chính xác sẽ được xác nhận qua email/SMS trước 1 ngày. 
                    Vui lòng có mặt tại sảnh khách sạn đúng giờ.
                  </p>
                </div>
              </Card>
            )}

            {/* Tour Information */}
            <Card className="p-6 bg-linear-to-br from-green-50 to-blue-50 border-green-200">
              <h3 className="text-lg text-gray-900 mb-4">Điều cần biết trước khi tham gia</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-900 mb-2">✅ Bao gồm:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {activity.includes.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm text-gray-900 mb-2">📋 Cần mang theo:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• CCCD/Hộ chiếu</li>
                    <li>• Kem chống nắng</li>
                    <li>• Đồ bơi, khăn tắm</li>
                    <li>• Thuốc cá nhân (nếu có)</li>
                  </ul>
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
                  <button className="text-blue-600 hover:underline">Điều khoản Tour</button>,{" "}
                  <button className="text-blue-600 hover:underline">Chính sách Hủy</button> và{" "}
                  <button className="text-blue-600 hover:underline">Quy định An toàn</button> của nhà cung cấp
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
                <h2 className="text-xl text-gray-900 mb-6">Chi tiết Đặt chỗ</h2>

                {/* Activity Info */}
                <div className="mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Nhà cung cấp: {activity.vendor}
                  </p>
                  <p className="text-sm text-gray-600">
                    Thời gian: {activity.duration}
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Booking Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày tham gia</p>
                      <p className="text-gray-900">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Số lượng</p>
                      <p className="text-gray-900">
                        {booking.adults} Người lớn, {booking.children} Trẻ em
                      </p>
                    </div>
                  </div>

                  {booking.hasPickup && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-600 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Đưa đón</p>
                        <p className="text-green-600">Có bao gồm</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Price Details */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Người lớn ({booking.adults} x {pricing.adultPrice.toLocaleString('vi-VN')}đ)
                    </span>
                    <span className="text-gray-900">
                      {(pricing.adultPrice * booking.adults).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Trẻ em ({booking.children} x {pricing.childPrice.toLocaleString('vi-VN')}đ)
                    </span>
                    <span className="text-gray-900">
                      {(pricing.childPrice * booking.children).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-2xl text-blue-600">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="text-sm text-gray-900 mb-2">Chính sách hủy</h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Hủy trước 48h: Hoàn 100%</li>
                    <li>• Hủy trong 24-48h: Hoàn 50%</li>
                    <li>• Hủy trong 24h: Không hoàn tiền</li>
                  </ul>
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
