import { useState } from "react";
import { Header } from "./components/Header";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Calendar } from "./components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Textarea } from "./components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Checkbox } from "./components/ui/checkbox";
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { PageType } from "./MainApp";

interface VisaApplicationPageProps {
  country?: any;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function VisaApplicationPage({ country, onNavigate }: VisaApplicationPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: undefined as Date | undefined,
    placeOfBirth: "",
    nationality: "Việt Nam",
    gender: "male",
    maritalStatus: "single",
    
    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    
    // Passport Information
    passportNumber: "",
    passportIssueDate: undefined as Date | undefined,
    passportExpiryDate: undefined as Date | undefined,
    passportIssuePlace: "",
    
    // Travel Information
    purposeOfTravel: "tourism",
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    accommodationAddress: "",
    
    // Employment Information
    occupation: "",
    companyName: "",
    companyAddress: "",
    monthlyIncome: "",
    
    // Additional Information
    previousVisits: false,
    criminalRecord: false,
    healthIssues: false,
    additionalNotes: ""
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Go to documents page
      onNavigate("visa-documents", { country, formData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate("visa", country);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông Tin Cá Nhân</h2>
            
            <div>
              <Label htmlFor="fullName">Họ và tên đầy đủ *</Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ngày sinh *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => handleInputChange("dateOfBirth", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="placeOfBirth">Nơi sinh *</Label>
                <Input
                  id="placeOfBirth"
                  placeholder="Hà Nội, Việt Nam"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Giới tính *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Nữ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Khác</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="maritalStatus">Tình trạng hôn nhân *</Label>
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(value) => handleInputChange("maritalStatus", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Độc thân</SelectItem>
                    <SelectItem value="married">Đã kết hôn</SelectItem>
                    <SelectItem value="divorced">Ly hôn</SelectItem>
                    <SelectItem value="widowed">Góa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nationality">Quốc tịch *</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông Tin Liên Hệ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+84 xxx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ hiện tại *</Label>
              <Textarea
                id="address"
                placeholder="Số nhà, tên đường"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="city">Thành phố/Tỉnh *</Label>
              <Input
                id="city"
                placeholder="Hà Nội"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="mt-1"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Thông Tin Hộ Chiếu</h2>
            
            <div>
              <Label htmlFor="passportNumber">Số hộ chiếu *</Label>
              <Input
                id="passportNumber"
                placeholder="B1234567"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ngày cấp *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.passportIssueDate ? format(formData.passportIssueDate, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.passportIssueDate}
                      onSelect={(date) => handleInputChange("passportIssueDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Ngày hết hạn *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.passportExpiryDate ? format(formData.passportExpiryDate, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.passportExpiryDate}
                      onSelect={(date) => handleInputChange("passportExpiryDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="passportIssuePlace">Nơi cấp *</Label>
              <Input
                id="passportIssuePlace"
                placeholder="Cục Quản lý xuất nhập cảnh"
                value={formData.passportIssuePlace}
                onChange={(e) => handleInputChange("passportIssuePlace", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông Tin Chuyến Đi</h2>
            
            <div>
              <Label htmlFor="purposeOfTravel">Mục đích chuyến đi *</Label>
              <Select
                value={formData.purposeOfTravel}
                onValueChange={(value) => handleInputChange("purposeOfTravel", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourism">Du lịch</SelectItem>
                  <SelectItem value="business">Công tác</SelectItem>
                  <SelectItem value="family">Thăm thân</SelectItem>
                  <SelectItem value="study">Học tập</SelectItem>
                  <SelectItem value="medical">Y tế</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ngày khởi hành dự kiến *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.departureDate ? format(formData.departureDate, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.departureDate}
                      onSelect={(date) => handleInputChange("departureDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Ngày trở về dự kiến *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.returnDate ? format(formData.returnDate, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.returnDate}
                      onSelect={(date) => handleInputChange("returnDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="accommodationAddress">Địa chỉ lưu trú tại {country?.name || "nước ngoài"} *</Label>
              <Textarea
                id="accommodationAddress"
                placeholder="Tên khách sạn, địa chỉ chi tiết"
                value={formData.accommodationAddress}
                onChange={(e) => handleInputChange("accommodationAddress", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Thông Tin Nghề Nghiệp</h2>
            
            <div>
              <Label htmlFor="occupation">Nghề nghiệp *</Label>
              <Input
                id="occupation"
                placeholder="Kỹ sư phần mềm"
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Tên công ty/Tổ chức</Label>
                <Input
                  id="companyName"
                  placeholder="ABC Company"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">Thu nhập hàng tháng (VNĐ)</Label>
                <Input
                  id="monthlyIncome"
                  placeholder="15,000,000"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyAddress">Địa chỉ công ty</Label>
              <Textarea
                id="companyAddress"
                placeholder="Số nhà, tên đường, quận/huyện, thành phố"
                value={formData.companyAddress}
                onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông Tin Bổ Sung</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="previousVisits"
                  checked={formData.previousVisits}
                  onCheckedChange={(checked) => handleInputChange("previousVisits", checked)}
                />
                <div>
                  <Label htmlFor="previousVisits" className="cursor-pointer">
                    Bạn đã từng đến {country?.name || "quốc gia này"} trước đây chưa?
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="criminalRecord"
                  checked={formData.criminalRecord}
                  onCheckedChange={(checked) => handleInputChange("criminalRecord", checked)}
                />
                <div>
                  <Label htmlFor="criminalRecord" className="cursor-pointer">
                    Bạn có tiền án tiền sự không?
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="healthIssues"
                  checked={formData.healthIssues}
                  onCheckedChange={(checked) => handleInputChange("healthIssues", checked)}
                />
                <div>
                  <Label htmlFor="healthIssues" className="cursor-pointer">
                    Bạn có vấn đề sức khỏe nghiêm trọng cần khai báo không?
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes">Thông tin bổ sung (nếu có)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Các thông tin khác bạn muốn chia sẻ..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                className="mt-1"
                rows={5}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vui lòng kiểm tra kỹ tất cả thông tin trước khi gửi</li>
                    <li>Thông tin sai lệch có thể dẫn đến việc từ chối visa</li>
                    <li>Hộ chiếu phải còn hạn ít nhất 6 tháng</li>
                    <li>Bước tiếp theo bạn sẽ cần upload các giấy tờ cần thiết</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="visa-application" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate("visa")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách quốc gia
        </button>

        {/* Country Info */}
        {country && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Đơn xin Visa {country.name}
                </h1>
                <p className="text-blue-100">
                  Thời gian xử lý: {country.processingTime} | Phí dịch vụ: {country.price}
                </p>
              </div>
              <div className="text-6xl">{country.flag}</div>
            </div>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Thông tin cá nhân</span>
            <span>Liên hệ & Hộ chiếu</span>
            <span>Chuyến đi</span>
            <span>Hoàn tất</span>
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-6">
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-8"
          >
            {currentStep === 1 ? "Hủy" : "Quay lại"}
          </Button>
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {currentStep === totalSteps ? "Tiếp tục nộp hồ sơ" : "Tiếp theo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
