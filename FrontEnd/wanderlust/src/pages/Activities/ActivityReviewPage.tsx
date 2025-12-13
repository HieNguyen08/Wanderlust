import { Calendar, Info, MapPin, Users } from "lucide-react";
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
import type { PageType } from "../../MainApp";
import { useNavigationProps } from "../../router/withPageProps";
import { profileApi, tokenService } from "../../utils/api";

interface ActivityReviewPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  activityData?: any;
  userRole?: any;
  onLogout?: () => void;
}

export default function ActivityReviewPage({
  onNavigate: onNavigateProp,
  activityData: activityDataProp,
  userRole: userRoleProp,
  onLogout: onLogoutProp
}: ActivityReviewPageProps) {
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
  const activityData = activityDataProp ?? pageData ?? {};
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+84"
  });

  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

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
          
          toast.success(t('activities.userInfoLoaded') || 'Đã tải thông tin người dùng');
        } catch (error: any) {
          console.error('Error loading user profile:', error);
          if (error.message !== 'UNAUTHORIZED') {
            toast.info(t('activities.fillContactInfo') || 'Vui lòng điền thông tin liên hệ');
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

  const activity = activityData?.activity;
  const booking = activityData?.booking;
  const pricing = activityData?.pricing;

  if (!activity || !booking || !pricing) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p>{t('activitiesPage.noBookingInfo')}</p>
        <Button onClick={() => onNavigate("activities")}>{t('activitiesPage.backToList')}</Button>
      </div>
    );
  }
  
  // Ensure includes array exists
  const activityIncludes = activity.includes || [];

  const finalTotal = pricing.totalPrice + (pricing.insurance || 0);

  const handleContinueToPayment = () => {
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert(t('activitiesPage.fillContactInfo'));
      return;
    }

    if (!participantInfo.fullName || !participantInfo.phone) {
      alert(t('activitiesPage.fillParticipantInfo'));
      return;
    }

    if (booking.hasPickup && (!pickupInfo.hotelName || !pickupInfo.hotelAddress)) {
      alert(t('activitiesPage.fillPickupInfo'));
      return;
    }

    if (!agreeToTerms) {
      alert(t('activitiesPage.agreeToTerms'));
      return;
    }

    const participantTotal = booking.participants ?? ((booking.adults ?? 0) + (booking.children ?? 0)) ?? 1;

    const normalizedBooking = {
      ...booking,
      date: booking.date,
      time: booking.time,
      participants: participantTotal,
      adults: booking.adults ?? participantTotal ?? 1,
      children: booking.children ?? 0,
      hasPickup: booking.hasPickup,
      pickupInfo: booking.hasPickup ? pickupInfo : undefined,
    };

    const normalizedActivityData = {
      ...activityData,
      activity,
      booking: normalizedBooking,
      pricing: {
        ...pricing,
        totalPrice: finalTotal
      }
    };

    onNavigate("payment-methods", {
      type: "activity",
      contactInfo,
      participantInfo,
      pickupInfo,
      activityData: normalizedActivityData,
      totalPrice: finalTotal
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="activities" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("activities")} className="hover:text-blue-600">
              {t('activitiesPage.activitiesMenu')}
            </button>
            <span>/</span>
            <button onClick={() => onNavigate("activity-detail")} className="hover:text-blue-600">
              {t('activitiesPage.details')}
            </button>
            <span>/</span>
            <span className="text-gray-900">{t('activitiesPage.reviewAndFill')}</span>
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
                    {t('activitiesPage.voucherAlert')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">{t('activitiesPage.contactInfo')}</h2>
                  <p className="text-sm text-gray-600">
                    {t('activitiesPage.voucherSentHere')}
                  </p>
                </div>
                {!isEditingContact && !isLoadingUserData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
                  >
                    {t('activitiesPage.edit')}
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
                    {t('activitiesPage.fullName')} <span className="text-red-600">*</span>
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
                    {t('activitiesPage.mobilePhone')} <span className="text-red-600">*</span>
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
                    {t('activitiesPage.save')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingContact(false)}
                  >
                    {t('activitiesPage.cancel')}
                  </Button>
                </div>
              )}
                </>
              )}
            </Card>

            {/* Participant Information */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-900 mb-1">{t('activitiesPage.participantInfo')}</h2>
                <p className="text-sm text-gray-600">
                  {t('activitiesPage.groupRepresentativeInfo')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participantName">
                    {t('activitiesPage.fullName')} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="participantName"
                    value={participantInfo.fullName}
                    onChange={(e) => setParticipantInfo({ ...participantInfo, fullName: e.target.value })}
                    className="mt-1"
                    placeholder={t('activitiesPage.groupRepresentativeName')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('activitiesPage.guideWillCallName')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="participantPhone">
                    {t('activitiesPage.mobilePhone')} <span className="text-red-600">*</span>
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
                    {t('activitiesPage.emergencyContact')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Pickup Information */}
            {booking.hasPickup && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl text-gray-900 mb-1">{t('activitiesPage.pickupInfo')}</h2>
                  <p className="text-sm text-gray-600">
                    {t('activitiesPage.tourIncludesPickup')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hotelName">
                      {t('activitiesPage.hotelName')} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="hotelName"
                      value={pickupInfo.hotelName}
                      onChange={(e) => setPickupInfo({ ...pickupInfo, hotelName: e.target.value })}
                      className="mt-1"
                      placeholder={t('activitiesPage.hotelNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hotelAddress">
                      {t('activitiesPage.hotelAddress')} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="hotelAddress"
                      value={pickupInfo.hotelAddress}
                      onChange={(e) => setPickupInfo({ ...pickupInfo, hotelAddress: e.target.value })}
                      className="mt-1"
                      placeholder={t('activitiesPage.hotelAddressPlaceholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="roomNumber">
                      {t('activitiesPage.roomNumber')}
                    </Label>
                    <Input
                      id="roomNumber"
                      value={pickupInfo.roomNumber}
                      onChange={(e) => setPickupInfo({ ...pickupInfo, roomNumber: e.target.value })}
                      className="mt-1"
                      placeholder={t('activitiesPage.roomNumberPlaceholder')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('activitiesPage.roomNumberOptional')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>{t('activitiesPage.note')}:</strong> {t('activitiesPage.pickupTimeConfirmation')}
                  </p>
                </div>
              </Card>
            )}

            {/* Tour Information */}
            <Card className="p-6 bg-linear-to-br from-green-50 to-blue-50 border-green-200">
              <h3 className="text-lg text-gray-900 mb-4">{t('activitiesPage.knowBeforeJoining')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-900 mb-2">✅ {t('activitiesPage.included')}:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {activityIncludes.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm text-gray-900 mb-2">📋 {t('activitiesPage.bringAlong')}:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• {t('activitiesPage.idPassport')}</li>
                    <li>• {t('activitiesPage.sunscreen')}</li>
                    <li>• {t('activitiesPage.swimwear')}</li>
                    <li>• {t('activitiesPage.personalMedicine')}</li>
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
                  {t('activitiesPage.agreeWith')}{" "}
                  <button className="text-blue-600 hover:underline">{t('activitiesPage.tourTerms')}</button>,{" "}
                  <button className="text-blue-600 hover:underline">{t('activitiesPage.cancellationPolicy')}</button> {t('activitiesPage.and')}{" "}
                  <button className="text-blue-600 hover:underline">{t('activitiesPage.safetyRegulations')}</button> {t('activitiesPage.ofProvider')}
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
              {t('activitiesPage.continueToPayment')}
            </Button>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h2 className="text-xl text-gray-900 mb-6">{t('activitiesPage.bookingDetails')}</h2>

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
                    {t('activitiesPage.provider')}: {activity.vendor}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('activitiesPage.duration')}: {activity.duration}
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Booking Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{t('activitiesPage.participationDate')}</p>
                      <p className="text-gray-900">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{t('activitiesPage.quantity')}</p>
                      <p className="text-gray-900">
                        {booking.adults} {t('activitiesPage.adults')}, {booking.children} {t('activitiesPage.children')}
                      </p>
                    </div>
                  </div>

                  {booking.hasPickup && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-600 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">{t('activitiesPage.pickup')}</p>
                        <p className="text-green-600">{t('activitiesPage.included')}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Price Details */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">{t('activitiesPage.priceDetails')}</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t('activitiesPage.admissionTicket')} ({booking.participants} x {pricing.unitPrice.toLocaleString('vi-VN')}đ)
                    </span>
                    <span className="text-gray-900">
                      {pricing.totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {pricing.insurance > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('activitiesPage.insurance')}</span>
                      <span className="text-gray-900">
                        {pricing.insurance.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-gray-900">{t('activitiesPage.total')}</span>
                    <span className="text-2xl text-blue-600">
                      {finalTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="text-sm text-gray-900 mb-2">{t('activitiesPage.cancellationPolicy')}</h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• {t('activitiesPage.cancel48h')}</li>
                    <li>• {t('activitiesPage.cancel24to48h')}</li>
                    <li>• {t('activitiesPage.cancelWithin24h')}</li>
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