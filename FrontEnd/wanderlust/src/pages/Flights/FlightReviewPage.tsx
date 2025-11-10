import { useState } from "react";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Plane, Clock, AlertCircle } from "lucide-react";
import type { PageType } from "../../MainApp";

interface FlightReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  flightData?: any;
}

interface PassengerForm {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality?: string;
  passportNumber?: string;
  passportIssuingCountry?: string;
  passportExpiry?: string;
}

export default function FlightReviewPage({ onNavigate, flightData }: FlightReviewPageProps) {
  const [contactInfo, setContactInfo] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84901234567",
    countryCode: "+84"
  });

  const [passengers, setPassengers] = useState<PassengerForm[]>([
    {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      passportIssuingCountry: "",
      passportExpiry: ""
    }
  ]);

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Mock data - in real app, this comes from previous page
  const isInternational = flightData?.isInternational || false;
  const outboundFlight = flightData?.outbound || {
    airline: "Vietnam Airlines",
    flightNumber: "VN210",
    from: "SGN",
    to: "HAN",
    departure: "08:00",
    arrival: "10:15",
    date: "08/11/2025",
    class: "Phổ thông Linh hoạt"
  };

  const returnFlight = flightData?.return;
  
  // Extract passenger counts from object or use default
  const passengerInfo = flightData?.passengers || { adults: 1, children: 0, infants: 0 };
  const numPassengers = typeof passengerInfo === 'number' 
    ? passengerInfo 
    : (passengerInfo.adults || 0) + (passengerInfo.children || 0) + (passengerInfo.infants || 0);
  
  const basePrice = 1500000;
  const taxAndFees = 500000;
  const totalPrice = (basePrice + taxAndFees) * numPassengers;

  const handleUpdatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleContinueToPayment = () => {
    // Validation
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    for (let i = 0; i < numPassengers; i++) {
      const p = passengers[i];
      if (!p.title || !p.firstName || !p.lastName || !p.dateOfBirth) {
        alert(`Vui lòng điền đầy đủ thông tin hành khách ${i + 1}`);
        return;
      }

      if (isInternational) {
        if (!p.nationality || !p.passportNumber || !p.passportIssuingCountry || !p.passportExpiry) {
          alert(`Vui lòng điền đầy đủ thông tin hộ chiếu cho hành khách ${i + 1}`);
          return;
        }
      }
    }

    if (!agreeToTerms) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    // Navigate to payment page with all data
    onNavigate("payment-methods", {
      type: "flight",
      contactInfo,
      passengers,
      flightData,
      totalPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("flights")} className="hover:text-blue-600">
              Vé máy bay
            </button>
            <span>/</span>
            <button onClick={() => onNavigate("search")} className="hover:text-blue-600">
              Tìm kiếm
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
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">
                    <strong>Lưu ý quan trọng:</strong> Thông tin hành khách phải khớp chính xác 100% với giấy tờ tùy thân (CCCD/Hộ chiếu).
                  </p>
                  <p>Vé máy bay không thể hoàn lại sau khi đã xuất.</p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">Thông tin Liên hệ</h2>
                  <p className="text-sm text-gray-600">
                    Vé điện tử và thông báo sẽ được gửi đến đây
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

            {/* Passenger Information */}
            {[...Array(numPassengers)].map((_, index) => (
              <Card key={index} className="p-6">
                <h2 className="text-2xl text-gray-900 mb-6">
                  Hành khách {index + 1}: Người lớn
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor={`title-${index}`}>
                      Quý danh <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={passengers[index]?.title || ""}
                      onValueChange={(v) => handleUpdatePassenger(index, "title", v)}
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

                  {/* Name Fields */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`lastName-${index}`}>
                        Họ <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`lastName-${index}`}
                        value={passengers[index]?.lastName || ""}
                        onChange={(e) => handleUpdatePassenger(index, "lastName", e.target.value)}
                        placeholder="NGUYEN"
                        className="mt-1 uppercase"
                      />
                      <p className="text-xs text-gray-500 mt-1">Như trên CCCD/Hộ chiếu</p>
                    </div>

                    <div>
                      <Label htmlFor={`middleName-${index}`}>
                        Tên đệm
                      </Label>
                      <Input
                        id={`middleName-${index}`}
                        value={passengers[index]?.middleName || ""}
                        onChange={(e) => handleUpdatePassenger(index, "middleName", e.target.value)}
                        placeholder="VAN"
                        className="mt-1 uppercase"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`firstName-${index}`}>
                        Tên <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`firstName-${index}`}
                        value={passengers[index]?.firstName || ""}
                        onChange={(e) => handleUpdatePassenger(index, "firstName", e.target.value)}
                        placeholder="A"
                        className="mt-1 uppercase"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <Label htmlFor={`dob-${index}`}>
                      Ngày sinh <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id={`dob-${index}`}
                      type="date"
                      value={passengers[index]?.dateOfBirth || ""}
                      onChange={(e) => handleUpdatePassenger(index, "dateOfBirth", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* International Flight Additional Fields */}
                  {isInternational && (
                    <>
                      <Separator />
                      <h3 className="text-gray-900">Thông tin Hộ chiếu</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`nationality-${index}`}>
                            Quốc tịch <span className="text-red-600">*</span>
                          </Label>
                          <Select
                            value={passengers[index]?.nationality || ""}
                            onValueChange={(v) => handleUpdatePassenger(index, "nationality", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Chọn quốc tịch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VN">Việt Nam</SelectItem>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                              <SelectItem value="CN">China</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`passportNumber-${index}`}>
                            Số hộ chiếu <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id={`passportNumber-${index}`}
                            value={passengers[index]?.passportNumber || ""}
                            onChange={(e) => handleUpdatePassenger(index, "passportNumber", e.target.value)}
                            placeholder="N1234567"
                            className="mt-1 uppercase"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`passportCountry-${index}`}>
                            Quốc gia cấp Hộ chiếu <span className="text-red-600">*</span>
                          </Label>
                          <Select
                            value={passengers[index]?.passportIssuingCountry || ""}
                            onValueChange={(v) => handleUpdatePassenger(index, "passportIssuingCountry", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Chọn quốc gia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VN">Việt Nam</SelectItem>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                              <SelectItem value="CN">China</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`passportExpiry-${index}`}>
                            Ngày hết hạn Hộ chiếu <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id={`passportExpiry-${index}`}
                            type="date"
                            value={passengers[index]?.passportExpiry || ""}
                            onChange={(e) => handleUpdatePassenger(index, "passportExpiry", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}

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
                  <button className="text-blue-600 hover:underline">Chính sách Hủy vé</button> và{" "}
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
                <h2 className="text-xl text-gray-900 mb-6">Chuyến bay của bạn</h2>

                {/* Outbound Flight */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Plane className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Chiều đi</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs">VN</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{outboundFlight.airline}</p>
                        <p className="text-xs text-gray-600">{outboundFlight.flightNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-2xl text-gray-900">{outboundFlight.departure}</p>
                        <p className="text-sm text-gray-600">{outboundFlight.from}</p>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="border-t border-gray-300 relative">
                          <Clock className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-gray-900">{outboundFlight.arrival}</p>
                        <p className="text-sm text-gray-600">{outboundFlight.to}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600">{outboundFlight.date}</p>
                    <p className="text-xs text-gray-600">{outboundFlight.class}</p>
                  </div>
                </div>

                {/* Return Flight */}
                {returnFlight && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Plane className="w-4 h-4 text-blue-600 rotate-180" />
                      <span className="text-sm text-gray-600">Chiều về</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs">VN</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{returnFlight.airline}</p>
                          <p className="text-xs text-gray-600">{returnFlight.flightNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-2xl text-gray-900">{returnFlight.departure}</p>
                          <p className="text-sm text-gray-600">{returnFlight.from}</p>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="border-t border-gray-300 relative">
                            <Clock className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50" />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-gray-900">{returnFlight.arrival}</p>
                          <p className="text-sm text-gray-600">{returnFlight.to}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600">{returnFlight.date}</p>
                      <p className="text-xs text-gray-600">{returnFlight.class}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Price Details */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Giá vé ({numPassengers} Người lớn)
                    </span>
                    <span className="text-gray-900">
                      {(basePrice * numPassengers).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế và Phí</span>
                    <span className="text-gray-900">
                      {(taxAndFees * numPassengers).toLocaleString('vi-VN')}đ
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
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
