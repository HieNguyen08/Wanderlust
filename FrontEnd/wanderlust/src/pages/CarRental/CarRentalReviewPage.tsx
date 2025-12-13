import { AlertTriangle, Car, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import type { PageType } from "../../MainApp";
import { useNavigationProps } from "../../router/withPageProps";
import { profileApi, tokenService } from "../../utils/api";

interface CarRentalReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  carData?: any;
  userRole?: any;
  onLogout?: () => void;
}

export default function CarRentalReviewPage({
  onNavigate: onNavigateProp,
  carData: carDataProp,
  userRole: userRoleProp,
  onLogout: onLogoutProp
}: CarRentalReviewPageProps) {
  const { t } = useTranslation();
  const {
    onNavigate: navFromContext,
    pageData,
    userRole: userRoleFromContext,
    onLogout: onLogoutFromContext
  } = useNavigationProps();

  const onNavigate = onNavigateProp ?? navFromContext;
  const userRole = userRoleProp ?? userRoleFromContext;
  const onLogout = onLogoutProp ?? onLogoutFromContext;
  const carData = carDataProp ?? pageData ?? {};

  const isIsoDate = (value?: string) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const initialPickupDate = isIsoDate(carData?.rental?.pickupDate) ? carData.rental.pickupDate : '';
  const initialDropoffDate = isIsoDate(carData?.rental?.dropoffDate) ? carData.rental.dropoffDate : '';
  const initialPickupTime = carData?.rental?.pickupTime || '09:00';
  const initialDropoffTime = carData?.rental?.dropoffTime || '09:00';
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+84"
  });

  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

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

  // Rental configuration states
  const [rentalType, setRentalType] = useState<'daily' | 'hourly'>('daily');
  const [pickupDate, setPickupDate] = useState<string>(initialPickupDate);
  const [dropoffDate, setDropoffDate] = useState<string>(initialDropoffDate);
  const [pickupTime, setPickupTime] = useState<string>(initialPickupTime);
  const [dropoffTime, setDropoffTime] = useState<string>(initialDropoffTime);
  const [withDriverService, setWithDriverService] = useState<boolean>(carData?.car?.withDriver || false);

  // Load user info when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (tokenService.isAuthenticated()) {
        try {
          const userProfile = await profileApi.getCurrentUser();
          
          setContactInfo({
            fullName: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
            email: userProfile.email || "",
            phone: userProfile.mobile || "",
            countryCode: "+84"
          });
          
          toast.success(t('carRental.userInfoLoaded') || 'Đã tải thông tin người dùng');
        } catch (error: any) {
          console.error('Error loading user profile:', error);
          if (error.message !== 'UNAUTHORIZED') {
            toast.info(t('carRental.fillContactInfo') || 'Vui lòng điền thông tin liên hệ');
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

  // Car data from CarDetailPage
  const car = carData?.car || {
    name: "Toyota Agya",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
    transmission: "Tự động",
    seats: 4,
    pricePerDay: 1855148,
    pricePerHour: 185515,
    withDriver: false,
    driverPrice: 0,
    insurance: { type: "Basic", price: 188091 },
    deposit: 9791397
  };

  // Initialize pickup location from CarDetailPage if available
  useEffect(() => {
    if (carData?.rental?.pickupLocation && !pickupDropoffInfo.pickupLocation) {
      setPickupDropoffInfo(prev => ({
        ...prev,
        pickupLocation: carData.rental.pickupLocation,
        dropoffLocation: carData.rental.dropoffLocation || carData.rental.pickupLocation
      }));
    }
  }, [carData]);

  // Calculate rental duration and pricing
  const calculateDuration = () => {
    if (!pickupDate || !dropoffDate) return { days: 0, hours: 0 };

    const pickup = new Date(`${pickupDate}T${pickupTime}:00`);
    const dropoff = new Date(`${dropoffDate}T${dropoffTime}:00`);

    const diffMs = dropoff.getTime() - pickup.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return { days: diffDays, hours: diffHours };
  };

  const duration = calculateDuration();

  // Calculate pricing dynamically
  const calculatePricing = () => {
    const pricePerDay = car.pricePerDay || 0;
    const pricePerHour = car.pricePerHour || 0;
    const driverPricePerDay = car.driverPrice || 0;
    const insurancePrice = car.insurance?.price ? parseFloat(car.insurance.price) : 0;
    const depositAmount = car.deposit ? parseFloat(car.deposit) : 0;

    let rentalPrice = 0;
    let driverServicePrice = 0;

    if (rentalType === 'daily') {
      rentalPrice = pricePerDay * duration.days;
      if (withDriverService && car.withDriver) {
        driverServicePrice = driverPricePerDay * duration.days;
      }
    } else {
      rentalPrice = pricePerHour * duration.hours;
      if (withDriverService && car.withDriver) {
        // Driver price per hour (estimate from daily rate)
        const driverPricePerHour = driverPricePerDay / 24;
        driverServicePrice = driverPricePerHour * duration.hours;
      }
    }

    return {
      rentalPrice,
      driverServicePrice,
      insurance: insurancePrice,
      deposit: depositAmount,
      total: rentalPrice + driverServicePrice + insurancePrice
    };
  };

  const pricing = calculatePricing();

  const handleContinueToPayment = () => {
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert(t('carRentalReview.fillContactInfo'));
      return;
    }

    if (!driverInfo.title || !driverInfo.fullName || !driverInfo.phone) {
      alert(t('carRentalReview.fillDriverInfo'));
      return;
    }

    if (!pickupDropoffInfo.pickupLocation || !pickupDropoffInfo.dropoffLocation) {
      alert(t('carRentalReview.fillPickupDropoff'));
      return;
    }

    if (!agreeToTerms) {
      alert(t('carRentalReview.agreeToTerms'));
      return;
    }

    const normalizedRental = {
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      pickupLocation: pickupDropoffInfo.pickupLocation,
      dropoffLocation: pickupDropoffInfo.dropoffLocation,
      location: pickupDropoffInfo.pickupLocation,
      pickup: pickupDate && pickupTime ? `${pickupDate}T${pickupTime}` : undefined,
      dropoff: dropoffDate && dropoffTime ? `${dropoffDate}T${dropoffTime}` : undefined,
      rentalType,
      duration: rentalType === 'daily' ? `${duration.days} ngày` : `${duration.hours} giờ`,
      days: rentalType === 'daily' ? duration.days : Math.ceil(duration.hours / 24),
      withDriverService
    };

    onNavigate("payment-methods", {
      type: "car-rental",
      contactInfo,
      driverInfo,
      pickupDropoffInfo,
      carData: {
        car,
        rental: normalizedRental,
        pricing: {
          ...pricing,
          totalPrice: pricing.total
        }
      },
      totalPrice: pricing.total
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="car-rental" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("car-rental")} className="hover:text-blue-600">
              {t('carRentalReview.carRental')}
            </button>
            <span>/</span>
            <button onClick={() => onNavigate("car-list")} className="hover:text-blue-600">
              {t('carRentalReview.list')}
            </button>
            <span>/</span>
            <span className="text-gray-900">{t('carRentalReview.reviewAndFill')}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">{t('carRentalReview.contactInfo')}</h2>
                  <p className="text-sm text-gray-600">
                    {t('carRentalReview.voucherSentHere')}
                  </p>
                </div>
                {!isEditingContact && !isLoadingUserData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
                  >
                    {t('carRentalReview.edit')}
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
                    {t('carRentalReview.fullName')} <span className="text-red-600">*</span>
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
                    {t('carRentalReview.mobilePhone')} <span className="text-red-600">*</span>
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
                    {t('carRentalReview.save')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingContact(false)}
                  >
                    {t('carRentalReview.cancel')}
                  </Button>
                </div>
              )}
                </>
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
                    {t('carRentalReview.title')} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={driverInfo.title}
                    onValueChange={(v) => setDriverInfo({ ...driverInfo, title: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('carRentalReview.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">{t('carRentalReview.mr')}</SelectItem>
                      <SelectItem value="mrs">{t('carRentalReview.mrs')}</SelectItem>
                      <SelectItem value="ms">{t('carRentalReview.ms')}</SelectItem>
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
                    {t('carRentalReview.flightNumber')}
                  </Label>
                  <Input
                    id="flightNumber"
                    value={pickupDropoffInfo.flightNumber}
                    onChange={(e) => setPickupDropoffInfo({ ...pickupDropoffInfo, flightNumber: e.target.value })}
                    className="mt-1"
                    placeholder="VN210"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('carRentalReview.flightTracking')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">
                    {t('carRentalReview.notesForDriver')}
                  </Label>
                  <Textarea
                    id="notes"
                    value={pickupDropoffInfo.notesForDriver}
                    onChange={(e) => setPickupDropoffInfo({ ...pickupDropoffInfo, notesForDriver: e.target.value })}
                    className="mt-1"
                    placeholder={t('carRentalReview.notesPlaceholder')}
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Important Information */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg text-gray-900 mb-4">{t('carRentalReview.importantInfo')}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('carRentalReview.mustShowLicense')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('carRentalReview.depositRefund', { amount: pricing.deposit.toLocaleString('vi-VN') })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('carRentalReview.inspectCar')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('carRentalReview.fillGas')}</span>
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
              <Card className="p-7">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Chi tiết Thuê xe</h2>

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

                  {/* Pricing Info */}
                  <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Giá thuê theo ngày:</span>
                      <span className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.pricePerDay || 0)}
                      </span>
                    </div>
                    {car.pricePerHour > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Giá thuê theo giờ:</span>
                        <span className="font-semibold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.pricePerHour)}
                        </span>
                      </div>
                    )}
                    {car.withDriver && car.driverPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Phụ phí tài xế/ngày:</span>
                        <span className="font-semibold text-purple-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.driverPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rental Type Selection */}
                <div className="mb-6">
                  <Label className="text-sm mb-2 block text-gray-700">Loại thuê xe</Label>
                  <Select value={rentalType} onValueChange={(value: 'daily' | 'hourly') => setRentalType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Thuê theo ngày</SelectItem>
                      {car.pricePerHour > 0 && <SelectItem value="hourly">Thuê theo giờ</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time Selection */}
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <Label className="text-sm mb-2 block text-gray-700">Ngày nhận xe</Label>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                      <Input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full"
                      />
                      {rentalType === 'hourly' && (
                        <Input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-28"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block text-gray-700">Ngày trả xe</Label>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                      <Input
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        className="w-full"
                      />
                      {rentalType === 'hourly' && (
                        <Input
                          type="time"
                          value={dropoffTime}
                          onChange={(e) => setDropoffTime(e.target.value)}
                          className="w-28"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Driver Service Option */}
                {car.withDriver && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="driverService"
                          checked={withDriverService}
                          onCheckedChange={(checked) => setWithDriverService(checked as boolean)}
                        />
                        <Label htmlFor="driverService" className="text-sm cursor-pointer">
                          Thuê thêm tài xế
                        </Label>
                      </div>
                      {car.driverPrice > 0 && (
                        <span className="text-sm font-semibold text-purple-600">
                          +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.driverPrice)}/{rentalType === 'daily' ? 'ngày' : 'giờ'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Duration Display */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Thời gian thuê:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {rentalType === 'daily' ? `${duration.days} ngày` : `${duration.hours} giờ`}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3 font-semibold">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Giá thuê xe ({rentalType === 'daily' ? `${duration.days} ngày` : `${duration.hours} giờ`})
                    </span>
                    <span className="text-gray-900 font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricing.rentalPrice)}
                    </span>
                  </div>

                  {withDriverService && pricing.driverServicePrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dịch vụ tài xế</span>
                      <span className="text-purple-600 font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricing.driverServicePrice)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bảo hiểm ({car.insurance?.type || 'Cơ bản'})</span>
                    <span className={pricing.insurance > 0 ? "text-gray-900 font-medium" : "text-green-600"}>
                      {pricing.insurance > 0 
                        ? `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricing.insurance)}`
                        : "Miễn phí"
                      }
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">Tổng cộng</span>
                    <span className="text-2xl text-blue-600 font-bold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricing.total)}
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


