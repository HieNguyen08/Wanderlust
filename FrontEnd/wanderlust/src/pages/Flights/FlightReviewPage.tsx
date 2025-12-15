import { AlertCircle, Plane } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
  const { t } = useTranslation();
  const { pageData, onNavigate: navigateFromHook } = useNavigationProps();
  const resolvedFlightData = useMemo(() => flightData ?? pageData, [flightData, pageData]);
  const goTo = onNavigate ?? navigateFromHook;
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+84"
  });

  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

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
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // If navigation passed contact info, pre-fill the form
  useEffect(() => {
    if (resolvedFlightData?.contactInfo) {
      setContactInfo((prev) => ({
        ...prev,
        ...resolvedFlightData.contactInfo
      }));
    }
  }, [resolvedFlightData]);

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

          toast.success(t('flights.userInfoLoaded'));
        } catch (error: any) {
          console.error('Error loading user profile:', error);
          // If error but not auth issue, just use empty form
          if (error.message !== 'UNAUTHORIZED') {
            toast.info(t('flights.fillContactInfo'));
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

  // Get actual flight data from previous page (location.state or prop)
  const isInternational = resolvedFlightData?.isInternational || false;
  const tripType = resolvedFlightData?.tripType || 'one-way';

  // Debug: Log received flight data
  useEffect(() => {
    console.log('=== FlightReviewPage Data ===');
    console.log('Full flightData:', resolvedFlightData);
    console.log('outboundFlight:', resolvedFlightData?.outboundFlight);
    console.log('returnFlight:', resolvedFlightData?.returnFlight);
    console.log('selectedSeats:', resolvedFlightData?.selectedSeats);
    console.log('cabinClass:', resolvedFlightData?.cabinClass);
    
    // Additional debugging for seat flightIds
    if (resolvedFlightData?.selectedSeats?.outbound) {
      console.log('Outbound seat flightIds:', resolvedFlightData.selectedSeats.outbound.map((s: any) => s.flightId));
    }
    if (resolvedFlightData?.selectedSeats?.return) {
      console.log('Return seat flightIds:', resolvedFlightData.selectedSeats.return.map((s: any) => s.flightId));
    }
  }, [resolvedFlightData]);

  // Outbound flight data from SearchPage
  const outboundFlightData = resolvedFlightData?.outboundFlight;
  const returnFlightData = resolvedFlightData?.returnFlight;

  // Extract flightId from seats if not available in flight data
  const getFlightIdFromSeats = (seats: any[]) => {
    if (!seats || seats.length === 0) return null;
    return seats[0]?.flightId;
  };

  const outboundFlightId = outboundFlightData?.flightNumber 
    || outboundFlightData?.id 
    || getFlightIdFromSeats(resolvedFlightData?.selectedSeats?.outbound);
  
  const returnFlightId = returnFlightData?.flightNumber 
    || returnFlightData?.id 
    || getFlightIdFromSeats(resolvedFlightData?.selectedSeats?.return);

  // Load complete flight data if missing
  useEffect(() => {
    const loadFlightData = async () => {
      try {
        // If we have flightId but missing flight details, fetch them
        if (outboundFlightId && !outboundFlightData?.departureTime) {
          console.log('Fetching outbound flight data for:', outboundFlightId);
          const response = await fetch(`http://localhost:8080/api/flights/${outboundFlightId}`);
          if (response.ok) {
            const flightData = await response.json();
            console.log('Loaded outbound flight:', flightData);
            // Update resolvedFlightData with complete info
            if (resolvedFlightData) {
              resolvedFlightData.outboundFlight = { 
                ...resolvedFlightData.outboundFlight, 
                ...flightData 
              };
            }
          }
        }
        
        if (returnFlightId && tripType === 'round-trip' && !returnFlightData?.arrivalTime) {
          console.log('Fetching return flight data for:', returnFlightId);
          const response = await fetch(`http://localhost:8080/api/flights/${returnFlightId}`);
          if (response.ok) {
            const flightData = await response.json();
            console.log('Loaded return flight:', flightData);
            if (resolvedFlightData) {
              resolvedFlightData.returnFlight = { 
                ...resolvedFlightData.returnFlight, 
                ...flightData 
              };
            }
          }
        }
      } catch (error) {
        console.error('Error loading flight data:', error);
      }
    };

    if (outboundFlightId) {
      loadFlightData();
    }
  }, [outboundFlightId, returnFlightId, tripType]);

  // Format flight info for display
  const formatTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Map cabin class for display
  const getCabinClassName = (cabinClass: string) => {
    const mapping: Record<string, string> = {
      'economy': t('flights.economy'),
      'business': t('flights.business'),
      'first': t('flights.firstClass')
    };
    return mapping[cabinClass?.toLowerCase()] || cabinClass;
  };

  // Extract passenger counts from object or use default
  const passengerInfo = resolvedFlightData?.passengers || { adults: 1, children: 0, infants: 0 };
  const numPassengers = typeof passengerInfo === 'number'
    ? passengerInfo
    : (passengerInfo.adults || 0) + (passengerInfo.children || 0) + (passengerInfo.infants || 0);

  // Ensure passenger form count matches passenger quantity
  useEffect(() => {
    const count = numPassengers || 1;
    setPassengers((prev) => {
      if (prev.length === count) return prev;

      const buildEmptyPassenger = (): PassengerForm => ({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportIssuingCountry: "",
        passportExpiry: ""
      });

      const next = Array.from({ length: count }, (_, idx) => prev[idx] ?? buildEmptyPassenger());
      return next;
    });
  }, [numPassengers]);

  // Selected Seats from previous page
  const selectedSeats = resolvedFlightData?.selectedSeats || { outbound: [], return: [] };

  // Calculate base price from cabin class
  const cabinClass = resolvedFlightData?.cabinClass || 'economy';

  // Get cabin class price from flight data
  const outboundBasePrice = outboundFlightData?.cabinClasses?.[cabinClass]?.fromPrice || 1500000;
  const returnBasePrice = returnFlightData?.cabinClasses?.[cabinClass]?.fromPrice || 0;
  const basePrice = outboundBasePrice + returnBasePrice;

  // Calculate taxes and fees (10% of base price per passenger)
  const taxAndFees = Math.round((outboundBasePrice + returnBasePrice) * 0.1);

  // Calculate total seat price from selected seats
  const outboundSeatPrice = selectedSeats.outbound?.reduce((acc: number, seat: any) => acc + (seat.price || 0), 0) || 0;
  const returnSeatPrice = selectedSeats.return?.reduce((acc: number, seat: any) => acc + (seat.price || 0), 0) || 0;
  const totalSeatPrice = outboundSeatPrice + returnSeatPrice;

  // Total = Seat fees only (per user request)
  const totalPrice = totalSeatPrice;

  const handleUpdatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleContinueToPayment = async () => {
    // Validation
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      alert(t('flights.pleaseFillContactInfo'));
      return;
    }

    for (let i = 0; i < numPassengers; i++) {
      const p = passengers[i];
      if (!p.title || !p.firstName || !p.lastName || !p.dateOfBirth) {
        alert(t('flights.pleaseFillPassengerInfo', { number: i + 1 }));
        return;
      }

      if (isInternational) {
        if (!p.nationality || !p.passportNumber || !p.passportIssuingCountry || !p.passportExpiry) {
          alert(t('flights.pleaseFillPassportInfo', { number: i + 1 }));
          return;
        }
      }
    }

    if (!agreeToTerms) {
      alert(t('flights.pleaseAgreeToTerms'));
      return;
    }

    if (!resolvedFlightData?.outboundFlight) {
      toast.error(t('flights.missingFlightData'));
      goTo('search');
      return;
    }

    // Require login before creating booking
    if (!tokenService.isAuthenticated?.()) {
      toast.error(t('common.loginRequired'));
      goTo('login');
      return;
    }

    try {
      setIsCreatingBooking(true);

      // Collect seat IDs
      const selectedSeatsData = resolvedFlightData?.selectedSeats || { outbound: [], return: [] };
      const flightSeatIds = [
        ...(selectedSeatsData.outbound?.map((s: any) => s.id) || []),
        ...(selectedSeatsData.return?.map((s: any) => s.id) || [])
      ];

      // Calculate correct pricing
      const totalBasePriceForBooking = basePrice * (passengers.length || numPassengers || 1);
      const totalTaxesForBooking = taxAndFees * (passengers.length || numPassengers || 1);
      const totalFeesForBooking = 0; // Website service fee = 0
      const totalAmountBeforeDiscount = totalBasePriceForBooking + totalTaxesForBooking + totalSeatPrice;

      // Build flightId List (1 for one-way, 2 for round-trip)
      const flightIds = [outboundFlightId];
      if (tripType === 'round-trip' && returnFlightId) {
        flightIds.push(returnFlightId);
      }

      console.log('=== Creating Booking ===');
      console.log('flightIds:', flightIds);
      console.log('outboundFlightData:', outboundFlightData);
      console.log('returnFlightData:', returnFlightData);

      if (!outboundFlightId) {
        toast.error('Không tìm thấy thông tin chuyến bay');
        return;
      }

      // Determine startDate and endDate from actual flight data
      let startDate = outboundFlightData?.departureTime;
      let endDate;

      console.log('startDate from outboundFlight:', startDate);

      if (!startDate) {
        toast.error('Thiếu thông tin thời gian bay');
        return;
      }

      if (tripType === 'round-trip' && returnFlightData) {
        // Round-trip: endDate = arrivalTime of return flight
        endDate = returnFlightData.arrivalTime;
      } else {
        // One-way: endDate = arrivalTime of outbound flight
        endDate = outboundFlightData?.arrivalTime;
      }

      console.log('endDate:', endDate);

      if (!endDate) {
        toast.error('Thiếu thông tin thời gian hạ cánh');
        return;
      }

      const bookingPayload = {
        productType: "FLIGHT",
        bookingType: "FLIGHT",
        productId: flightIds[0], // For compatibility
        flightId: flightIds, // Now a List<String>
        flightSeatIds,
        seatCount: flightSeatIds.length,
        userId: tokenService.getUserData()?.id,
        amount: totalAmountBeforeDiscount,
        basePrice: totalBasePriceForBooking,
        taxes: totalTaxesForBooking,
        fees: totalFeesForBooking,
        discount: 0,
        totalPrice: totalAmountBeforeDiscount,
        currency: "VND",
        startDate,
        endDate,
        quantity: passengers.length || numPassengers || 1,
        numberOfGuests: {
          adults: passengerInfo?.adults || numPassengers || 1,
          children: passengerInfo?.children || 0,
          infants: passengerInfo?.infants || 0
        },
        guestInfo: {
          fullName: contactInfo.fullName,
          firstName: contactInfo.fullName?.split(" ")[0] || "Guest",
          lastName: contactInfo.fullName?.split(" ").slice(1).join(" ") || "User",
          email: contactInfo.email,
          phone: contactInfo.phone
        },
        specialRequests: `Cabin: ${resolvedFlightData?.cabinClass || 'economy'} | Seats: ${flightSeatIds.join(', ')} | Pax: ${passengers.length || numPassengers}`,
        paymentStatus: "PENDING",
        status: "PENDING",
        metadata: {
          passengers,
          contactInfo,
          selectedSeats: selectedSeatsData,
          selectedFlights: { // NEW: Store full flight info
            outbound: outboundFlightData,
            return: returnFlightData
          },
          tripType,
          cabinClass,
          basePricePerPassenger: basePrice,
          taxesPerPassenger: taxAndFees,
          seatFees: totalSeatPrice,
          voucherDiscount: 0,
          finalAmount: totalAmountBeforeDiscount
        }
      } as any;

      const createdBooking = await bookingApi.createBooking(bookingPayload);

      // Update flight seats to RESERVED status (user-level PATCH)
      try {
        for (const seatId of flightSeatIds) {
          await fetch(`http://localhost:8080/api/flight-seats/${seatId}/status?status=RESERVED`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${tokenService.getToken()}`,
              'Content-Type': 'application/json'
            }
          });
        }
        console.log('Successfully updated seat statuses to RESERVED');
      } catch (seatError) {
        console.error('Failed to update seat statuses:', seatError);
        // Continue anyway as booking is already created
      }

      // Decrement available seats for each flight leg
      try {
        const outboundCount = selectedSeatsData.outbound?.length || 0;
        if (outboundFlightId && outboundCount > 0) {
          await fetch(`http://localhost:8080/api/flights/${outboundFlightId}/available-seats/decrement?count=${outboundCount}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${tokenService.getToken()}`
            }
          });
        }

        const returnCount = selectedSeatsData.return?.length || 0;
        if (tripType === 'round-trip' && returnFlightId && returnCount > 0) {
          await fetch(`http://localhost:8080/api/flights/${returnFlightId}/available-seats/decrement?count=${returnCount}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${tokenService.getToken()}`
            }
          });
        }
        console.log('Successfully decremented available seats for flights');
      } catch (flightSeatError) {
        console.error('Failed to decrement available seats:', flightSeatError);
      }

      // Navigate to payment with persisted booking
      goTo("payment-methods", {
        type: "flight",
        contactInfo,
        passengers,
        flightData: resolvedFlightData,
        totalPrice: totalAmountBeforeDiscount,
        bookingId: createdBooking?.id,
        booking: createdBooking,
        userId: tokenService.getUserData()?.id,
        flightSeatIds
      });
    } catch (error: any) {
      console.error('Failed to create booking before payment', error);
      toast.error(error.message || t('payment.bookingFailed'));
    } finally {
      setIsCreatingBooking(false);
    }

    // Navigate to payment page with all data
    goTo("payment-methods", {
      type: "flight",
      contactInfo,
      passengers,
      flightData: resolvedFlightData,
      totalPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => goTo("flights")} className="hover:text-blue-600">
            {t('flights.flightTickets')}
          </button>
          <span>/</span>
          <button onClick={() => goTo("search")} className="hover:text-blue-600">
            {t('common.search')}
          </button>
          <span>/</span>
          <span className="text-gray-900">{t('flights.reviewAndFillInfo')}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-1">
                  <strong>{t('flights.importantNote')}:</strong> {t('flights.passengerInfoMustMatch')}
                </p>
                <p>{t('flights.ticketNonRefundable')}</p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-1">{t('flights.contactInfo')}</h2>
                <p className="text-sm text-gray-600">
                  {t('flights.eTicketWillBeSent')}
                </p>
              </div>
              {!isEditingContact && !isLoadingUserData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingContact(true)}
                >
                  {t('common.edit')}
                </Button>
              )}
            </div>

            {isLoadingUserData ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">{t('common.loading')}</span>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">
                      {t('flights.fullName')} <span className="text-red-600">*</span>
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
                      {t('flights.mobilePhone')} <span className="text-red-600">*</span>
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
                      {t('common.save')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingContact(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Passenger Information */}
          {[...Array(numPassengers)].map((_, index) => (
            <Card key={index} className="p-6">
              <h2 className="text-2xl text-gray-900 mb-6">
                {t('flights.passenger')} {index + 1}: {t('flights.adult')}
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor={`title-${index}`}>
                    {t('flights.passengerTitle')} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={passengers[index]?.title || ""}
                    onValueChange={(v) => handleUpdatePassenger(index, "title", v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('common.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">{t('flights.mr')}</SelectItem>
                      <SelectItem value="mrs">{t('flights.mrs')}</SelectItem>
                      <SelectItem value="ms">{t('flights.ms')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name Fields */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`lastName-${index}`}>
                      {t('flights.lastName')} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id={`lastName-${index}`}
                      value={passengers[index]?.lastName || ""}
                      onChange={(e) => handleUpdatePassenger(index, "lastName", e.target.value)}
                      placeholder="NGUYEN"
                      className="mt-1 uppercase"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('flights.asOnIdPassport')}</p>
                  </div>

                  <div>
                    <Label htmlFor={`middleName-${index}`}>
                      {t('flights.middleName')}
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
                      {t('flights.firstName')} <span className="text-red-600">*</span>
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
                    {t('flights.dateOfBirth')} <span className="text-red-600">*</span>
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
                    <h3 className="text-gray-900">{t('flights.passportInfo')}</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`nationality-${index}`}>
                          {t('flights.nationality')} <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={passengers[index]?.nationality || ""}
                          onValueChange={(v) => handleUpdatePassenger(index, "nationality", v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={t('flights.selectNationality')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VN">{t('common.countries.VN')}</SelectItem>
                            <SelectItem value="US">{t('common.countries.US')}</SelectItem>
                            <SelectItem value="GB">{t('common.countries.GB')}</SelectItem>
                            <SelectItem value="CN">{t('common.countries.CN')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`passportNumber-${index}`}>
                          {t('flights.passportNumber')} <span className="text-red-600">*</span>
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
                          {t('flights.passportIssuingCountry')} <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={passengers[index]?.passportIssuingCountry || ""}
                          onValueChange={(v) => handleUpdatePassenger(index, "passportIssuingCountry", v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={t('flights.selectCountry')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VN">{t('common.countries.VN')}</SelectItem>
                            <SelectItem value="US">{t('common.countries.US')}</SelectItem>
                            <SelectItem value="GB">{t('common.countries.GB')}</SelectItem>
                            <SelectItem value="CN">{t('common.countries.CN')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`passportExpiry-${index}`}>
                          {t('flights.passportExpiry')} <span className="text-red-600">*</span>
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
                {t('flights.iAgreeWith')}{" "}
                <button className="text-blue-600 hover:underline">{t('flights.termsAndConditions')}</button>,{" "}
                <button className="text-blue-600 hover:underline">{t('flights.cancellationPolicy')}</button> {t('common.and')}{" "}
                <button className="text-blue-600 hover:underline">{t('flights.privacyPolicy')}</button> {t('flights.ofWanderlust')}
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
            {isCreatingBooking ? t('common.loading') : t('flights.continueToPayment')}
          </Button>
        </div>

        {/* Sidebar - Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('flights.yourFlight')}</h2>

              {/* Debug Info (remove in production) */}
              {!outboundFlightData && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                  {t('flights.noFlightDataFound')}
                </div>
              )}

              {/* Outbound Flight */}
              {outboundFlightData ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Plane className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{t('flights.outbound')}</span>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">{outboundFlightData.airlineCode || 'VN'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{outboundFlightData.airlineName}</p>
                        <p className="text-xs text-gray-600">{outboundFlightData.flightNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatTime(outboundFlightData.departureTime)}</p>
                        <p className="text-sm text-gray-600">{outboundFlightData.departureAirportCode}</p>
                      </div>
                      <div className="flex-1 mx-4 flex flex-col items-center">
                        <div className="w-full border-t-2 border-dashed border-blue-300 relative">
                          <Plane className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-50 to-gray-50" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatTime(outboundFlightData.arrivalTime)}</p>
                        <p className="text-sm text-gray-600">{outboundFlightData.arrivalAirportCode}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>{formatDate(outboundFlightData.departureTime)}</span>
                      <span className="font-medium text-blue-700">{getCabinClassName(cabinClass)}</span>
                    </div>

                    {/* Selected Seats for Outbound */}
                    {selectedSeats.outbound && selectedSeats.outbound.length > 0 ? (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">💺 {t('flights.selectedSeats')}:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSeats.outbound.map((seat: any) => (
                            <div key={seat.id} className="flex flex-col items-center">
                              <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-md font-bold shadow-sm">
                                {seat.row}{seat.position}
                              </span>
                              {seat.price > 0 && (
                                <span className="text-[10px] text-gray-600 mt-0.5 font-medium">
                                  +{(seat.price / 1000).toFixed(0)}K
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-blue-700 font-bold mt-2 bg-blue-100 px-2 py-1 rounded inline-block">
                          {t('flights.seatsFee')}: +{outboundSeatPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-gray-500 italic">{t('flights.noSeatsSelected')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 text-center">{t('flights.noFlightInfo')}</p>
                </div>
              )}

              {/* Return Flight */}
              {returnFlightData && tripType === 'round-trip' ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Plane className="w-4 h-4 text-blue-600 rotate-180" />
                    <span className="text-sm font-medium text-gray-700">{t('flights.return')}</span>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-gray-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">{returnFlightData.airlineCode || 'VN'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{returnFlightData.airlineName}</p>
                        <p className="text-xs text-gray-600">{returnFlightData.flightNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatTime(returnFlightData.departureTime)}</p>
                        <p className="text-sm text-gray-600">{returnFlightData.departureAirportCode}</p>
                      </div>
                      <div className="flex-1 mx-4 flex flex-col items-center">
                        <div className="w-full border-t-2 border-dashed border-green-300 relative">
                          <Plane className="w-4 h-4 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-green-50 to-gray-50 rotate-180" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatTime(returnFlightData.arrivalTime)}</p>
                        <p className="text-sm text-gray-600">{returnFlightData.arrivalAirportCode}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>{formatDate(returnFlightData.departureTime)}</span>
                      <span className="font-medium text-green-700">{getCabinClassName(cabinClass)}</span>
                    </div>

                    {/* Selected Seats for Return */}
                    {selectedSeats.return && selectedSeats.return.length > 0 ? (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">💺 {t('flights.selectedSeats') || "Ghế đã chọn"}:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSeats.return.map((seat: any) => (
                            <div key={seat.id} className="flex flex-col items-center">
                              <span className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-md font-bold shadow-sm">
                                {seat.row}{seat.position}
                              </span>
                              {seat.price > 0 && (
                                <span className="text-[10px] text-gray-600 mt-0.5 font-medium">
                                  +{(seat.price / 1000).toFixed(0)}K
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-green-700 font-bold mt-2 bg-green-100 px-2 py-1 rounded inline-block">
                          {t('flights.seatsFee') || 'Phí ghế'}: +{returnSeatPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs text-gray-500 italic">ℹ️ Chưa chọn ghế ngồi</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : tripType === 'round-trip' ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 text-center">🛩️ Chưa có thông tin chuyến bay về</p>
                </div>
              ) : null}

              <Separator className="my-6" />

              {/* Price Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">{t('flights.priceDetails') || 'Chi tiết giá'}</h3>

                {/* Show summary if no flight data */}
                {!outboundFlightData ? (
                  <div className="text-sm text-gray-600 text-center py-4">
                    <p>🔄 Đang tải thông tin giá...</p>
                  </div>
                ) : (
                  <>


                    {/* Seat Selection Fee - Only show if seats are selected */}
                    {totalSeatPrice > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm items-center bg-blue-50 p-2 rounded">
                          <span className="text-gray-700 font-medium">💺 {t('flights.seatSelectionFee') || "Phí chọn ghế"}</span>
                          <span className="text-blue-700 font-bold">
                            +{totalSeatPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        {outboundSeatPrice > 0 && (
                          <div className="flex justify-between text-xs ml-4 items-center">
                            <span className="text-gray-500">• {t('flights.outbound') || 'Chiều đi'} ({selectedSeats.outbound?.length || 0} ghế)</span>
                            <span className="text-gray-600 font-medium">
                              {outboundSeatPrice.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        )}
                        {returnSeatPrice > 0 && (
                          <div className="flex justify-between text-xs ml-4 items-center">
                            <span className="text-gray-500">• {t('flights.return') || 'Chiều về'} ({selectedSeats.return?.length || 0} ghế)</span>
                            <span className="text-gray-600 font-medium">
                              {returnSeatPrice.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    <Separator className="my-4" />

                    {/* Total Price */}
                    <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-gray-900 text-lg">{t('flights.totalPrice') || 'Tổng cộng'}</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-blue-600">
                          {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                        <p className="text-xs text-gray-500 mt-1">(Đã bao gồm thuế và phí)</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div >

      <Footer />
    </div >
  );
}
