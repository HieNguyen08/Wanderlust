import { useState } from "react";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Car, MapPin, Calendar, AlertTriangle, Settings } from "lucide-react";
import type { PageType } from "../../MainApp";

interface CarRentalReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  carData?: any;
}

export default function CarRentalReviewPage({ onNavigate, carData }: CarRentalReviewPageProps) {
  const [contactInfo, setContactInfo] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84901234567",
    countryCode: "+84"
  });

  const [driverInfo, setDriverInfo] = useState({
    title: "",
    fullName: "",
    phone: "",
    countryCode: "+84"
  });

  const [pickupDropoffInfo, setPickupDropoffInfo] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    flightNumber: "",
    notesForDriver: ""
  });

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Mock data
  const car = carData?.car || {
    name: "Toyota Agya",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
    transmission: "Tự động",
    seats: 4,
    vendor: "SEWAMOBIL Indonesia"
  };

  const rental = carData?.rental || {
    pickup: "Thứ 7, 8/11/2025 - 09:00",
    dropoff: "Thứ 2, 10/11/2025 - 09:00",
    location: "Pool Bandara CGK",
    days: 2
  };

  const pricing = {
    rentalPrice: 1000000,
    insurance: 200000,
    deposit: 500000
  };

  const totalPrice = pricing.rentalPrice;

  const handleContinueToPayment = () => {
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    if (!driverInfo.title || !driverInfo.fullName || !driverInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin người lái");
      return;
    }

    if (!pickupDropoffInfo.pickupLocation || !pickupDropoffInfo.dropoffLocation) {
      alert("Vui lòng điền địa điểm đón và trả xe");
      return;
    }

    if (!agreeToTerms) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    onNavigate("payment-methods", {
      type: "car-rental",
      contactInfo,
      driverInfo,
      pickupDropoffInfo,
      carData,
      totalPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("car-rental")} className="hover:text-blue-600">
              Thuê xe
            </button>
            <span>/</span>
            <button onClick={() => onNavigate("car-list")} className="hover:text-blue-600">
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
                    Voucher thuê xe sẽ được gửi đến đây
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

            {/* Driver Information */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-6">Thông tin Người lái</h2>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                  <div className="text-sm text-yellow-900">
                    <p className="mb-1">
                      <strong>Vui lòng đảm bảo số điện thoại chính xác.</strong>
                    </p>
                    <p>
                      Nhà cung cấp sẽ liên hệ bạn qua số điện thoại (ưu tiên WhatsApp) để xác nhận đặt xe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driverTitle">
                    Quý danh <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={driverInfo.title}
                    onValueChange={(v) => setDriverInfo({ ...driverInfo, title: v })}
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
                  <Label htmlFor="driverName">
                    Tên đầy đủ <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="driverName"
                    value={driverInfo.fullName}
                    onChange={(e) => setDriverInfo({ ...driverInfo, fullName: e.target.value })}
                    className="mt-1"
                    placeholder="Tên người sẽ lái xe"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Người này phải xuất trình bằng lái xe khi nhận xe
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="driverPhone">
                    Số điện thoại di động <span className="text-red-600">*</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={driverInfo.countryCode}
                      onValueChange={(v) => setDriverInfo({ ...driverInfo, countryCode: v })}
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
                      id="driverPhone"
                      value={driverInfo.phone}
                      onChange={(e) => setDriverInfo({ ...driverInfo, phone: e.target.value })}
                      className="flex-1"
                      placeholder="901234567"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Pickup/Dropoff Details */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-6">Chi tiết Đón/Trả xe</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickupLocation">
                    Địa điểm Đón <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="pickupLocation"
                    value={pickupDropoffInfo.pickupLocation}
                    onChange={(e) => setPickupDropoffInfo({ ...pickupDropoffInfo, pickupLocation: e.target.value })}
                    className="mt-1"
                    placeholder="Ví dụ: Sảnh đến A, Sân bay Tân Sơn Nhất"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Địa chỉ cụ thể nơi bạn muốn nhận xe
                  </p>
                </div>

                <div>
                  <Label htmlFor="dropoffLocation">
                    Địa điểm Trả <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="dropoffLocation"
                    value={pickupDropoffInfo.dropoffLocation}
                    onChange={(e) => setPickupDropoffInfo({ ...pickupDropoffInfo, dropoffLocation: e.target.value })}
                    className="mt-1"
                    placeholder="Ví dụ: Khách sạn Grand Saigon, 8 Đồng Khởi"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Địa chỉ cụ thể nơi bạn sẽ trả xe
                  </p>
                </div>

                <div>
                  <Label htmlFor="flightNumber">
                    Số hiệu chuyến bay (Nếu đón tại sân bay)
                  </Label>
                  <Input
                    id="flightNumber"
                    value={pickupDropoffInfo.flightNumber}
                    onChange={(e) => setPickupDropoffInfo({ ...pickupDropoffInfo, flightNumber: e.target.value })}
                    className="mt-1"
                    placeholder="VN210"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Giúp tài xế theo dõi trạng thái chuyến bay
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">
                    Ghi chú cho tài xế
                  </Label>
                  <Textarea
                    id="notes"
                    value={pickupDropoffInfo.notesForDriver}
                    onChange={(e) => setPickupDropoffInfo({ ...pickupDropoffInfo, notesForDriver: e.target.value })}
                    className="mt-1"
                    placeholder="Ví dụ: Vui lòng đến trước 15 phút..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Important Information */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg text-gray-900 mb-4">Thông tin quan trọng</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Người lái phải xuất trình bằng lái xe hợp lệ khi nhận xe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Tiền cọc {pricing.deposit.toLocaleString('vi-VN')}đ sẽ được hoàn trả sau khi trả xe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Kiểm tra kỹ xe trước khi nhận và chụp ảnh làm bằng chứng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Đổ đầy bình xăng trước khi trả xe (trừ khi có thỏa thuận khác)</span>
                </li>
              </ul>
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
                  <button className="text-blue-600 hover:underline">Điều khoản Thuê xe</button>,{" "}
                  <button className="text-blue-600 hover:underline">Chính sách Hủy</button> và{" "}
                  <button className="text-blue-600 hover:underline">Chính sách Bảo hiểm</button> của nhà cung cấp
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
                <h2 className="text-xl text-gray-900 mb-6">Chi tiết Thuê xe</h2>

                {/* Car Info */}
                <div className="mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{car.name}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      <span>{car.seats} chỗ</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Nhà cung cấp: {car.vendor}
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Rental Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Nhận xe (Pickup)</p>
                      <p className="text-gray-900">{rental.pickup}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Trả xe (Drop-off)</p>
                      <p className="text-gray-900">{rental.dropoff}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Địa điểm</p>
                      <p className="text-gray-900">{rental.location}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price Details */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Giá thuê xe ({rental.days} ngày)
                    </span>
                    <span className="text-gray-900">
                      {pricing.rentalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bảo hiểm (bao gồm)</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-2xl text-blue-600">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 mt-4">
                    <p className="text-sm text-yellow-900">
                      <strong>Tiền cọc:</strong> {pricing.deposit.toLocaleString('vi-VN')}đ
                      <br />
                      <span className="text-xs">Sẽ hoàn trả sau khi trả xe</span>
                    </p>
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
