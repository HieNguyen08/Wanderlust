import { useState } from "react";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import {
  Plane, Calendar as CalendarIcon, ArrowRight, Info,
  Luggage, RefreshCcw, Ban, AlertCircle
} from "lucide-react";
import type { PageType } from "../../MainApp";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

interface BookingDetailsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  bookingData?: any;
}

interface PassengerForm {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  frequentFlyerProgram: string;
}

export default function BookingDetailsPage({ onNavigate, bookingData }: BookingDetailsPageProps) {
  const tripType = bookingData?.tripType || 'one-way';
  const isRoundTrip = tripType === 'round-trip';

  // For round-trip
  const outboundFlight = bookingData?.outboundFlight;
  const inboundFlight = bookingData?.inboundFlight;

  // For one-way (backward compatibility)
  const flight = bookingData?.flight || {};
  const fare = bookingData?.fare || {};

  const passengers = bookingData?.passengers || { adults: 1, children: 0, infants: 0 };
  const from = bookingData?.from || { city: "TP. Hồ Chí Minh", code: "SGN" };
  const to = bookingData?.to || { city: "Phú Quốc", code: "PQC" };
  const departDate = bookingData?.departDate || new Date();
  // const returnDate = bookingData?.returnDate;

  // Passenger forms state
  const [passengerForms, setPassengerForms] = useState<PassengerForm[]>(() => {
    const forms: PassengerForm[] = [];
    for (let i = 0; i < passengers.adults; i++) {
      forms.push({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: undefined,
        frequentFlyerProgram: ""
      });
    }
    for (let i = 0; i < passengers.children; i++) {
      forms.push({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: undefined,
        frequentFlyerProgram: ""
      });
    }
    for (let i = 0; i < passengers.infants; i++) {
      forms.push({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: undefined,
        frequentFlyerProgram: ""
      });
    }
    return forms;
  });

  // Contact info state
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhoneType, setContactPhoneType] = useState("personal");
  const [contactCountryCode, setContactCountryCode] = useState("+84");
  const [contactPhone, setContactPhone] = useState("");

  // Agreement checkboxes
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const updatePassengerForm = (index: number, field: keyof PassengerForm, value: any) => {
    const newForms = [...passengerForms];
    newForms[index] = { ...newForms[index], [field]: value };
    setPassengerForms(newForms);
  };

  const getPassengerType = (index: number) => {
    if (index < passengers.adults) return "Người lớn";
    if (index < passengers.adults + passengers.children) return "Trẻ em";
    return "Em bé";
  };

  const validateAndContinue = () => {
    // Validate passenger forms
    for (let i = 0; i < passengerForms.length; i++) {
      const form = passengerForms[i];
      if (!form.title || !form.firstName || !form.lastName || !form.dateOfBirth) {
        toast.error(`Vui lòng điền đầy đủ thông tin hành khách ${i + 1}`);
        return;
      }
    }

    // Validate contact info
    if (!contactEmail || !contactPhone) {
      toast.error("Vui lòng điền đầy đủ thông tin liên lạc");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate phone format
    if (contactPhone.length < 9 || contactPhone.length > 11) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    // Validate terms agreement
    if (!agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    // Navigate to payment/confirmation page
    onNavigate("checkout", {
      ...bookingData,
      passengers: passengerForms,
      contact: {
        email: contactEmail,
        phoneType: contactPhoneType,
        countryCode: contactCountryCode,
        phone: contactPhone
      },
      agreeMarketing
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (isRoundTrip && outboundFlight && inboundFlight) {
      const outboundTotal = outboundFlight.fare.price * (passengers.adults + passengers.children + passengers.infants * 0.1);
      const inboundTotal = inboundFlight.fare.price * (passengers.adults + passengers.children + passengers.infants * 0.1);
      return outboundTotal + inboundTotal;
    } else {
      return fare.price * (passengers.adults + passengers.children + passengers.infants * 0.1);
    }
  };

  const totalPrice = calculateTotalPrice();
  const taxesFees = totalPrice * 0.1; // Mock 10% taxes
  const grandTotal = totalPrice + taxesFees;

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Banner */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>Lưu ý quan trọng:</strong> Tên hành khách phải khớp chính xác với giấy tờ tùy thân (CCCD/Passport).
              Các trường đánh dấu (*) là bắt buộc.
            </AlertDescription>
          </Alert>

          {/* Passenger Information Forms */}
          <Card className="p-6">
            <h2 className="text-2xl mb-6">Thông tin hành khách</h2>

            {passengerForms.map((form, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
                  <h3 className="font-medium">
                    Hành khách {index + 1}: {getPassengerType(index)}
                  </h3>
                </div>

                <div className="border border-t-0 rounded-b-lg p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor={`title-${index}`}>
                      Quý danh <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={form.title}
                      onValueChange={(value) => updatePassengerForm(index, 'title', value)}
                    >
                      <SelectTrigger id={`title-${index}`}>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">Ông</SelectItem>
                        <SelectItem value="mrs">Bà</SelectItem>
                        <SelectItem value="ms">Cô</SelectItem>
                        <SelectItem value="mstr">Em</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* First Name */}
                  <div>
                    <Label htmlFor={`firstName-${index}`}>
                      Họ <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id={`firstName-${index}`}
                      placeholder="VD: NGUYEN"
                      value={form.firstName}
                      onChange={(e) => updatePassengerForm(index, 'firstName', e.target.value.toUpperCase())}
                    />
                    <p className="text-xs text-gray-500 mt-1">Nhập chữ IN HOA không dấu</p>
                  </div>

                  {/* Middle & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`middleName-${index}`}>Tên đệm</Label>
                      <Input
                        id={`middleName-${index}`}
                        placeholder="VD: VAN"
                        value={form.middleName}
                        onChange={(e) => updatePassengerForm(index, 'middleName', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`lastName-${index}`}>
                        Tên <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`lastName-${index}`}
                        placeholder="VD: AN"
                        value={form.lastName}
                        onChange={(e) => updatePassengerForm(index, 'lastName', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <Label>
                      Ngày sinh <span className="text-red-600">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.dateOfBirth ? (
                            format(form.dateOfBirth, "dd/MM/yyyy")
                          ) : (
                            <span className="text-gray-500">Chọn ngày sinh</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.dateOfBirth}
                          onSelect={(date) => updatePassengerForm(index, 'dateOfBirth', date)}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Frequent Flyer (Optional) */}
                  {getPassengerType(index) === "Người lớn" && (
                    <div>
                      <Label htmlFor={`ffp-${index}`}>Chương trình khách hàng thường xuyên (không bắt buộc)</Label>
                      <Select
                        value={form.frequentFlyerProgram || ""}
                        onValueChange={(value) => updatePassengerForm(index, 'frequentFlyerProgram', value)}
                      >
                        <SelectTrigger id={`ffp-${index}`}>
                          <SelectValue placeholder="Chọn chương trình" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vn-lotusmiles">Vietnam Airlines - Lotusmiles</SelectItem>
                          <SelectItem value="vj-skyboss">VietJet - SkyBoss</SelectItem>
                          <SelectItem value="qh-bamboo">Bamboo Airways - Bamboo Club</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-2xl mb-2">Thông tin liên lạc</h2>
            <p className="text-sm text-gray-600 mb-6">
              Thông tin xác nhận đặt chỗ sẽ được gửi đến email và số điện thoại này
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Địa chỉ email <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              {/* Phone Type */}
              <div>
                <Label htmlFor="phoneType">
                  Loại điện thoại <span className="text-red-600">*</span>
                </Label>
                <Select value={contactPhoneType} onValueChange={setContactPhoneType}>
                  <SelectTrigger id="phoneType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Cá nhân</SelectItem>
                    <SelectItem value="work">Công việc</SelectItem>
                    <SelectItem value="home">Nhà riêng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country Code & Phone */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="countryCode">
                    Mã quốc gia <span className="text-red-600">*</span>
                  </Label>
                  <Select value={contactCountryCode} onValueChange={setContactCountryCode}>
                    <SelectTrigger id="countryCode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+84">+84 (Việt Nam)</SelectItem>
                      <SelectItem value="+1">+1 (Mỹ)</SelectItem>
                      <SelectItem value="+44">+44 (Anh)</SelectItem>
                      <SelectItem value="+86">+86 (Trung Quốc)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="912345678"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Agreement Checkboxes */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Tôi đã đọc và đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản & Điều kiện
                    </a>{" "}
                    và{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Chính sách quyền riêng tư
                    </a>{" "}
                    của Wanderlust <span className="text-red-600">*</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={agreeMarketing}
                  onCheckedChange={(checked) => setAgreeMarketing(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="marketing"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Tôi đồng ý nhận email về các ưu đãi, khuyến mãi và tin tức du lịch từ Wanderlust
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Mobile Continue Button */}
          <div className="lg:hidden">
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={validateAndContinue}
              disabled={!agreeTerms}
            >
              TIẾP TỤC THANH TOÁN
            </Button>
          </div>
        </div>

        {/* Sidebar Summary (Right) - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Chuyến bay của bạn</h3>

              {/* Outbound Flight (For round-trip) or Single Flight */}
              {isRoundTrip && outboundFlight ? (
                <>
                  {/* Outbound Flight */}
                  <div className="space-y-4 mb-6 pb-6 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">CHIỀU ĐI</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center shrink-0">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{outboundFlight.flight.airlineName}</div>
                        <div className="text-sm text-gray-600">{outboundFlight.flight.flightNumber}</div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-2">
                        {format(outboundFlight.date, "EEEE, dd 'Thg' MM yyyy", { locale: vi })}
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2 mb-3">
                        <div>
                          <div className="text-lg">{outboundFlight.flight.departTime}</div>
                          <div className="text-sm text-gray-600">{from.code}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-gray-600 mb-1">{outboundFlight.flight.duration}</div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-right">
                          <div className="text-lg">{outboundFlight.flight.arriveTime}</div>
                          <div className="text-sm text-gray-600">{to.code}</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600">
                        {from.city} → {to.city}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Loại vé</span>
                        <span className="font-medium">{outboundFlight.fare.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Luggage className="w-4 h-4" />
                        <span>{outboundFlight.fare.baggage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inbound Flight */}
                  {inboundFlight && (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">CHIỀU VỀ</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center shrink-0">
                          <Plane className="w-5 h-5 text-green-600 rotate-180" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{inboundFlight.flight.airlineName}</div>
                          <div className="text-sm text-gray-600">{inboundFlight.flight.flightNumber}</div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-2">
                          {format(inboundFlight.date, "EEEE, dd 'Thg' MM yyyy", { locale: vi })}
                        </div>

                        <div className="grid grid-cols-3 items-center gap-2 mb-3">
                          <div>
                            <div className="text-lg">{inboundFlight.flight.departTime}</div>
                            <div className="text-sm text-gray-600">{to.code}</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-gray-600 mb-1">{inboundFlight.flight.duration}</div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-right">
                            <div className="text-lg">{inboundFlight.flight.arriveTime}</div>
                            <div className="text-sm text-gray-600">{from.code}</div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600">
                          {to.city} → {from.city}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Loại vé</span>
                          <span className="font-medium">{inboundFlight.fare.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Luggage className="w-4 h-4" />
                          <span>{inboundFlight.fare.baggage}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Single Flight */
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{flight.airlineName || "Vietnam Airlines"}</div>
                      <div className="text-sm text-gray-600">{flight.flightNumber || "VN 6123"}</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-2">
                      {format(departDate, "EEEE, dd 'Thg' MM yyyy", { locale: vi })}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2 mb-3">
                      <div>
                        <div className="text-lg">{flight.departTime || "09:55"}</div>
                        <div className="text-sm text-gray-600">{from.code}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-600 mb-1">{flight.duration || "1h 10p"}</div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-lg">{flight.arriveTime || "11:05"}</div>
                        <div className="text-sm text-gray-600">{to.code}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      {from.city} → {to.city}
                    </div>
                  </div>

                  {/* Fare Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Loại vé</span>
                      <span className="font-medium">{fare.name || "Phổ thông"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Luggage className="w-4 h-4" />
                      <span>{fare.baggage || "7kg xách tay"}</span>
                    </div>
                    {fare.checkedBag && fare.checkedBag !== "Không" && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Luggage className="w-4 h-4" />
                        <span>Hành lý ký gửi: {fare.checkedBag}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      {fare.refundable ? (
                        <>
                          <RefreshCcw className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">Có thể hoàn vé</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-4 h-4 text-red-600" />
                          <span className="text-red-700">Không hoàn vé</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium">Chi tiết giá</h4>

                {isRoundTrip && outboundFlight && inboundFlight ? (
                  <>
                    {/* Round-trip pricing */}
                    {passengers.adults > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Người lớn x {passengers.adults} (Cả 2 chiều)
                        </span>
                        <span>{((outboundFlight.fare.price + inboundFlight.fare.price) * passengers.adults).toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}

                    {passengers.children > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Trẻ em x {passengers.children} (Cả 2 chiều)
                        </span>
                        <span>{((outboundFlight.fare.price + inboundFlight.fare.price) * passengers.children).toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}

                    {passengers.infants > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Em bé x {passengers.infants} (Cả 2 chiều)
                        </span>
                        <span>{((outboundFlight.fare.price + inboundFlight.fare.price) * passengers.infants * 0.1).toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* One-way pricing */}
                    {passengers.adults > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Người lớn x {passengers.adults}
                        </span>
                        <span>{(fare.price * passengers.adults).toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}

                    {passengers.children > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Trẻ em x {passengers.children}
                        </span>
                        <span>{(fare.price * passengers.children).toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}

                    {passengers.infants > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Em bé x {passengers.infants}
                        </span>
                        <span>{(fare.price * passengers.infants * 0.1).toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế & Phí</span>
                  <span>{taxesFees.toLocaleString('vi-VN')}₫</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">TỔNG CỘNG</span>
                  <span className="text-2xl text-blue-600">
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Desktop Continue Button */}
              <Button
                size="lg"
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700 hidden lg:flex"
                onClick={validateAndContinue}
                disabled={!agreeTerms}
              >
                TIẾP TỤC THANH TOÁN
              </Button>
            </Card>

            {/* Info Alert */}
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-xs">
                Giá vé có thể thay đổi trước khi thanh toán. Vui lòng hoàn tất đặt vé sớm để đảm bảo giá tốt nhất.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
