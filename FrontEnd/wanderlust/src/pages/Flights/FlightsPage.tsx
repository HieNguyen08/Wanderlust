import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowRightLeft,
  Calendar as CalendarIcon,
  Check, ChevronsUpDown,
  Copy,
  Globe,
  Headphones,
  Minus,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  Shield,
  Sparkles,
  Tag,
  Users
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { ReviewList } from "../../components/reviews/ReviewList";
import { SearchLoadingOverlay } from "../../components/SearchLoadingOverlay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import type { PageType } from "../../MainApp";
import { flightApi, promotionApi, tokenService, userVoucherApi } from "../../utils/api";

interface FlightsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

// Mock airports data
const airports = [
  { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất" },
  { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài" },
  { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng" },
  { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc" },
  { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh" },
  { code: "HPH", city: "Hải Phòng", name: "Sân bay Cát Bi" },
  { code: "VII", city: "Vinh", name: "Sân bay Vinh" },
  { code: "HUI", city: "Huế", name: "Sân bay Phú Bài" },
  { code: "VCA", city: "Cần Thơ", name: "Sân bay Cần Thơ" },
  { code: "DLI", city: "Đà Lạt", name: "Sân bay Liên Khương" },
];

export default function FlightsPage({ onNavigate }: FlightsPageProps) {
  const { t } = useTranslation();
  const heroSearchRef = useRef<HTMLDivElement>(null);

  // Search form state
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("round-trip");
  const [fromAirport, setFromAirport] = useState<typeof airports[0] | null>(null);
  const [toAirport, setToAirport] = useState<typeof airports[0] | null>(null);
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openPassengers, setOpenPassengers] = useState(false);

  // Passenger & Class state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<"economy" | "business" | "first">("economy");

  // Voucher modal
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Loading state
  const [isSearching, setIsSearching] = useState(false);

  // Promotions state
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [savedVouchers, setSavedVouchers] = useState<string[]>([]);
  const [savingVoucher, setSavingVoucher] = useState(false);
  const [todayFlights, setTodayFlights] = useState<any[]>([]);

  // Load saved vouchers from backend
  useEffect(() => {
    const loadSavedVouchers = async () => {
      try {
        if (tokenService.isAuthenticated()) {
          const available = await userVoucherApi.getAvailable();
          setSavedVouchers(available.map((v: any) => v.voucherCode));
        }
      } catch (error: any) {
        // Silently fail if not authenticated - user just won't see saved vouchers
        if (error.message !== 'UNAUTHORIZED') {
          console.error('Error loading saved vouchers:', error);
        }
      }
    };

    loadSavedVouchers();
  }, []);

  // Fetch flight promotions on mount
  useEffect(() => {
    const fetchFlightPromotions = async () => {
      try {
        setLoadingPromotions(true);
        const data = await promotionApi.getActiveByCategory('FLIGHT');
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching flight promotions:', error);
        toast.error(t('flights.toast.fetchPromotionsError'));
      } finally {
        setLoadingPromotions(false);
      }
    };

    fetchFlightPromotions();
  }, []);

  // Fetch today's flights
  useEffect(() => {
    const fetchTodayFlights = async () => {
      try {
        const flights = await flightApi.getNearestFlights(8);
        setTodayFlights(flights);
      } catch (error) {
        console.error("Error fetching today's flights:", error);
      }
    };
    fetchTodayFlights();
  }, []);

  const handleSaveVoucher = async (voucher: any) => {
    try {
      // Check authentication
      if (!tokenService.isAuthenticated()) {
        toast.error(t('flights.toast.loginRequired'));
        onNavigate('login');
        return;
      }

      setSavingVoucher(true);
      await userVoucherApi.saveToWallet(voucher.code);
      toast.success(t('flights.toast.voucherSaved', { code: voucher.code }));

      // Refresh available vouchers
      const available = await userVoucherApi.getAvailable();
      setSavedVouchers(available.map((v: any) => v.voucherCode));

      setSelectedVoucher(null);
    } catch (error: any) {
      toast.error(error.message || t('flights.toast.saveError'));
    } finally {
      setSavingVoucher(false);
    }
  };

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearch = async () => {
    // Validation
    if (!fromAirport) {
      toast.error(t('flights.toast.fromRequired'));
      return;
    }
    if (!toAirport) {
      toast.error(t('flights.toast.toRequired'));
      return;
    }
    if (fromAirport.code === toAirport.code) {
      toast.error(t('flights.toast.sameAirports'));
      return;
    }
    if (!departDate) {
      toast.error(t('flights.toast.departDateRequired'));
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      toast.error(t('flights.toast.returnDateRequired'));
      return;
    }
    if (tripType === "round-trip" && returnDate && returnDate < departDate) {
      toast.error(t('flights.toast.returnDateInvalid'));
      return;
    }

    try {
      // Show loading overlay
      setIsSearching(true);

      // Format date to yyyy-MM-dd for API
      const formattedDate = format(departDate, "yyyy-MM-dd");

      // Search flights via API
      console.log("🔍 Searching flights:", {
        from: fromAirport.code,
        to: toAirport.code,
        date: formattedDate,
        directOnly: false
      });

      const outboundFlights = await flightApi.searchFlights({
        from: fromAirport.code,
        to: toAirport.code,
        date: formattedDate,
        directOnly: false,
        cabinClass: cabinClass
      });

      console.log("✅ Found outbound flights:", outboundFlights);

      let returnFlights = [];
      if (tripType === "round-trip" && returnDate) {
        const formattedReturnDate = format(returnDate, "yyyy-MM-dd");
        returnFlights = await flightApi.searchFlights({
          from: toAirport.code,
          to: fromAirport.code,
          date: formattedReturnDate,
          directOnly: false,
          cabinClass: cabinClass
        });
        console.log("✅ Found return flights:", returnFlights);
      }

      // Navigate to FlightDetailPage with results
      onNavigate("flight-detail", {
        tripType,
        from: fromAirport,
        to: toAirport,
        departDate,
        returnDate,
        passengers: {
          adults,
          children,
          infants,
          total: adults + children + infants
        },
        cabinClass,
        outboundFlights,
        returnFlights
      });
    } catch (error: any) {
      console.error("❌ Error searching flights:", error);
      toast.error(t('flights.toast.searchError'));
    } finally {
      setIsSearching(false);
    }
  };

  const handlePopularFlightClick = (from: string, to: string) => {
    const fromAirportData = airports.find(a => a.city === from);
    const toAirportData = airports.find(a => a.city === to);

    if (fromAirportData) setFromAirport(fromAirportData);
    if (toAirportData) setToAirport(toAirportData);

    // Scroll to hero search
    heroSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast.success(t('flights.routeSelected', { from, to }));
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(t('flights.voucherCopied'));
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error(t('flights.cannotCopyCode'));
    }
  };

  const cabinClassLabels = {
    economy: t('flights.economy'),
    business: t('flights.business'),
    first: t('flights.firstClass')
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="bg-white min-h-screen">
      {/* Loading Overlay */}
      <SearchLoadingOverlay
        isLoading={isSearching}
        searchType="flight"
        message={t('flights.searchingFlights')}
      />      {/* Hero Search Section */}
      <div ref={heroSearchRef} className="relative h-[700px] w-full">
        <ImageWithFallback
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=700&fit=crop"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
          <h1 className="text-white text-4xl md:text-5xl text-center mb-8 drop-shadow-2xl max-w-4xl">
            {t('flights.heroTitle')}
          </h1>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-5xl shadow-2xl">
            <h2 className="text-2xl mb-6">{t('flights.searchFlights')}</h2>

            {/* Trip Type */}
            <RadioGroup value={tripType} onValueChange={(value: any) => setTripType(value)} className="flex gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label htmlFor="one-way" className="cursor-pointer">{t('flights.oneWay')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <Label htmlFor="round-trip" className="cursor-pointer">{t('flights.roundTrip')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multi-city" id="multi-city" />
                <Label htmlFor="multi-city" className="cursor-pointer">{t('flights.multiCity')}</Label>
              </div>
            </RadioGroup>

            {/* Search Inputs - Row 1: Airports and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* From */}
              <div className="md:col-span-3">
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFrom}
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <PlaneTakeoff className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        {fromAirport ? (
                          <>
                            <span className="text-xs text-gray-500">{t('flights.from')}</span>
                            <span className="truncate w-full text-left">{fromAirport.city}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">{t('flights.from')}</span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder={t('flights.searchAirport')} />
                      <CommandList>
                        <CommandEmpty>{t('flights.noAirportFound')}</CommandEmpty>
                        <CommandGroup>
                          {airports.map((airport) => (
                            <CommandItem
                              key={airport.code}
                              value={`${airport.city} ${airport.code} ${airport.name}`}
                              onSelect={() => {
                                setFromAirport(airport);
                                setOpenFrom(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${fromAirport?.code === airport.code ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                              <div>
                                <div className="font-medium">{airport.city} ({airport.code})</div>
                                <div className="text-sm text-gray-500">{airport.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-center justify-center">
                <Button
                  onClick={handleSwapAirports}
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5 text-gray-600" />
                </Button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <Popover open={openTo} onOpenChange={setOpenTo}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openTo}
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <PlaneLanding className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        {toAirport ? (
                          <>
                            <span className="text-xs text-gray-500">{t('flights.to')}</span>
                            <span className="truncate w-full text-left">{toAirport.city}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">{t('flights.to')}</span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder={t('flights.searchAirport')} />
                      <CommandList>
                        <CommandEmpty>{t('flights.noAirportFound')}</CommandEmpty>
                        <CommandGroup>
                          {airports.map((airport) => (
                            <CommandItem
                              key={airport.code}
                              value={`${airport.city} ${airport.code} ${airport.name}`}
                              onSelect={() => {
                                setToAirport(airport);
                                setOpenTo(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${toAirport?.code === airport.code ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                              <div>
                                <div className="font-medium">{airport.city} ({airport.code})</div>
                                <div className="text-sm text-gray-500">{airport.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Dates */}
              <div className="md:col-span-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <CalendarIcon className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-xs text-gray-500">{t('flights.departDate')}</span>
                        <span className="truncate w-full text-left">
                          {departDate ? format(departDate, "dd/MM/yyyy", { locale: vi }) : t('flights.selectDate')}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departDate}
                      onSelect={setDepartDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date (only for round-trip) */}
              {tripType === "round-trip" && (
                <div className="md:col-span-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                      >
                        <CalendarIcon className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-xs text-gray-500">{t('flights.returnDate')}</span>
                          <span className="truncate w-full text-left">
                            {returnDate ? format(returnDate, "dd/MM/yyyy", { locale: vi }) : t('flights.selectDate')}
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => {
                          const minDate = departDate || new Date();
                          return date < minDate;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Search Inputs - Row 2: Passengers and Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
              {/* Passengers & Class */}
              <div className={tripType === "round-trip" ? "md:col-span-6" : "md:col-span-6"}>
                <Popover open={openPassengers} onOpenChange={setOpenPassengers}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <Users className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-xs text-gray-500">{t('flights.passengersAndClass')}</span>
                        <span className="w-full text-left text-xs leading-tight">
                          {adults} {t('flights.adults')}{children > 0 ? `, ${children} ${t('flights.children')}` : ''}{infants > 0 ? `, ${infants} ${t('flights.infants')}` : ''} • {cabinClassLabels[cabinClass]}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />

                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] p-6">
                    <div className="space-y-5">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t('flights.adults')}</div>
                          <div className="text-sm text-gray-500">{t('flights.adultsAge')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.min(9, adults + 1))}
                            disabled={adults >= 9}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t('flights.children')}</div>
                          <div className="text-sm text-gray-500">{t('flights.childrenAge')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setChildren(Math.min(9, children + 1))}
                            disabled={children >= 9}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t('flights.infants')}</div>
                          <div className="text-sm text-gray-500">{t('flights.infantsAge')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            disabled={infants <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{infants}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setInfants(Math.min(adults, infants + 1))}
                            disabled={infants >= adults}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label className="mb-2 block">{t('flights.cabinClass')}</Label>
                        <RadioGroup value={cabinClass} onValueChange={(value: any) => setCabinClass(value)}>
                          <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="economy" id="economy" />
                            <Label htmlFor="economy" className="cursor-pointer">{t('flights.economy')}</Label>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business" className="cursor-pointer">{t('flights.business')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="first" id="first" />
                            <Label htmlFor="first" className="cursor-pointer">{t('flights.firstClass')}</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button
                        onClick={() => setOpenPassengers(false)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {t('common.done')}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className={tripType === "round-trip" ? "md:col-span-3" : "md:col-span-3"}>
                <Button
                  onClick={handleSearch}
                  className="w-full h-14 bg-[#0194f3] hover:bg-[#0180d6] text-white"
                >
                  <Search className="w-5 h-5 md:mr-0 lg:mr-2" />
                  <span className="hidden lg:inline">{t('flights.searchButton')}</span>
                </Button>
              </div>
            </div>

            {/* Multi-city notice */}
            {tripType === "multi-city" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                {t('flights.multiCityNotice')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">{t('flights.whyChooseUs')}</h2>
          <p className="text-gray-600">{t('flights.bestFlightExperience')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg mb-3">{t('flights.smartSearch')}</h3>
            <p className="text-sm text-gray-600">
              {t('flights.smartSearchDesc')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg mb-3">{t('flights.personalizedSuggestions')}</h3>
            <p className="text-sm text-gray-600">
              {t('flights.personalizedSuggestionsDesc')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg mb-3">{t('flights.bestPrice')}</h3>
            <p className="text-sm text-gray-600">
              {t('flights.bestPriceDesc')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg mb-3">{t('flights.support247')}</h3>
            <p className="text-sm text-gray-600">
              {t('flights.support247Desc')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg mb-3">{t('flights.multiPlatform')}</h3>
            <p className="text-sm text-gray-600">
              {t('flights.multiPlatformDesc')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg mb-3">{t('flights.safeAndReliable')}</h3>
            <p className="text-sm text-gray-600">
              {t('flights.safeAndReliableDesc')}
            </p>
          </div>
        </div>
      </section>



      {/* Today's Flights Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 bg-blue-50/50">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">{t('flights.todayFlights')}</h2>
          <p className="text-gray-600">{t('flights.upcomingFlights')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayFlights.length > 0 ? (
            todayFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all cursor-pointer border border-gray-100"
                onClick={() => {
                  // Fill search form with this flight's route
                  const fromAp = airports.find(a => a.code === flight.departureAirportCode);
                  const toAp = airports.find(a => a.code === flight.arrivalAirportCode);
                  if (fromAp) setFromAirport(fromAp);
                  if (toAp) setToAirport(toAp);
                  setDepartDate(new Date(flight.departureTime));
                  // Scroll to top
                  heroSearchRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-blue-600">{flight.airlineName}</span>
                  <span className="text-xs text-gray-500">{flight.flightNumber}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{format(new Date(flight.departureTime), "HH:mm")}</div>
                    <div className="text-xs text-gray-500">{flight.departureAirportCode}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400">{flight.durationDisplay}</span>
                    <div className="w-16 h-px bg-gray-300 my-1 relative">
                      <PlaneTakeoff className="w-3 h-3 absolute -top-1.5 left-1/2 -translate-x-1/2 text-gray-400" />
                    </div>
                    <span className="text-xs text-green-600">{flight.isDirect ? t('flights.direct') : t('flights.stops', { count: flight.stops })}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{format(new Date(flight.arrivalTime), "HH:mm")}</div>
                    <div className="text-xs text-gray-500">{flight.arrivalAirportCode}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{format(new Date(flight.departureTime), "dd/MM/yyyy")}</span>
                  {/* Min price display if available */}
                  <span className="text-sm font-bold text-blue-600">
                    {t('common.viewDetails')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-40 flex items-center justify-center text-gray-500">
              {t('flights.noUpcomingFlights')}
            </div>
          )}
        </div>
      </section>

      {/* Popular Flights */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">{t('flights.popularFlights')}</h2>
          <p className="text-gray-600">{t('flights.mostFavoriteRoutes')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { from: t('flights.cities.hoChiMinh'), to: t('flights.cities.haNoi'), price: "1.200.000đ", image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=300&fit=crop" },
            { from: t('flights.cities.haNoi'), to: t('flights.cities.daNang'), price: "980.000đ", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop" },
            { from: t('flights.cities.hoChiMinh'), to: t('flights.cities.phuQuoc'), price: "1.450.000đ", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" },
            { from: t('flights.cities.haNoi'), to: t('flights.cities.nhaTrang'), price: "1.100.000đ", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop" }
          ].map((flight, index) => (
            <div
              key={index}
              onClick={() => handlePopularFlightClick(flight.from, flight.to)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  alt={`${flight.from} to ${flight.to}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src={flight.image}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-lg">{flight.from}</span>
                    <ArrowRightLeft className="w-4 h-4" />
                    <span className="text-lg">{flight.to}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('flights.from')}</span>
                  <span className="text-xl text-blue-600">{flight.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deals Section with Carousel */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">{t('common.dealsForYou')}</h2>
            <p className="text-gray-600">{t('common.hottestPromotions')}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate("promotions")}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            {t('common.viewAll')}
          </Button>
        </div>

        {loadingPromotions ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>{t('flights.noFlightDeals')}</p>
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {promotions.map((promo: any) => (
                <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
                  <div
                    onClick={() => setSelectedVoucher(promo)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <div className="relative h-48">
                      <ImageWithFallback
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={promo.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"}
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full">
                        {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `${(promo.value / 1000).toFixed(0)}K`}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-sm text-gray-600 mb-1">{t('common.travelAgency')}</div>
                      <h3 className="text-lg mb-2">{promo.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                      <div className="flex items-center justify-between">
                        <code className="border-2 border-dashed border-purple-600 text-purple-600 rounded px-3 py-1">
                          {promo.code}
                        </code>
                        <Button variant="link" className="text-blue-600 p-0">
                          {t('common.viewDetails')} →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </section>

      {/* Flight Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">{t('flights.customerReviews') || 'Đánh giá từ hành khách'}</h2>
          <p className="text-gray-600">{t('flights.reviewsDesc') || 'Xem đánh giá thực tế từ khách hàng đã sử dụng dịch vụ'}</p>
        </div>

        <ReviewList
          targetType="FLIGHT"
          targetId="ALL_FLIGHTS"
          title={t('flights.allFlightReviews') || 'Đánh giá chuyến bay'}
          limit={5}
          showViewAllButton={true}
          sortByRating={true}
        />
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">{t('flights.faq')}</h2>
          <p className="text-gray-600">{t('flights.faqSubtitle')}</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: t('flights.faqQuestions.q1'),
              a: t('flights.faqQuestions.a1')
            },
            {
              q: t('flights.faqQuestions.q2'),
              a: t('flights.faqQuestions.a2')
            },
            {
              q: t('flights.faqQuestions.q3'),
              a: t('flights.faqQuestions.a3')
            },
            {
              q: t('flights.faqQuestions.q4'),
              a: t('flights.faqQuestions.a4')
            },
            {
              q: t('flights.faqQuestions.q5'),
              a: t('flights.faqQuestions.a5')
            },
            {
              q: t('flights.faqQuestions.q6'),
              a: t('flights.faqQuestions.a6')
            }
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Voucher Detail Modal */}
      {
        selectedVoucher && (
          <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('flights.voucherDetails')}</DialogTitle>
                <DialogDescription>
                  {t('flights.promotionInfo')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedVoucher.image}
                    alt={selectedVoucher.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full">
                    {selectedVoucher.type === 'PERCENTAGE'
                      ? `${selectedVoucher.value}%`
                      : `${(selectedVoucher.value / 1000).toFixed(0)}K`}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl mb-2">{selectedVoucher.title}</h3>
                  <p className="text-gray-600">{selectedVoucher.description}</p>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('flights.voucherCode')}</p>
                  <div className="flex items-center gap-3">
                    <code className="text-2xl font-mono flex-1">{selectedVoucher.code}</code>
                    <Button
                      onClick={() => handleCopyCode(selectedVoucher.code)}
                      variant="outline"
                      className="gap-2"
                    >
                      {copiedCode === selectedVoucher.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          {t('flights.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t('flights.copyCode')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3">{t('flights.conditions')}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {selectedVoucher.conditions && Array.isArray(selectedVoucher.conditions) && selectedVoucher.conditions.length > 0 ? (
                      selectedVoucher.conditions.map((condition: string, index: number) => (
                        <li key={index}>• {condition}</li>
                      ))
                    ) : (
                      <>
                        <li>• {t('flights.voucherConditions.flight')}</li>
                        <li>• {t('flights.voucherConditions.noCombine')}</li>
                        <li>• {t('flights.voucherConditions.oneTime')}</li>
                      </>
                    )}
                  </ul>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleSaveVoucher(selectedVoucher)}
                  disabled={savedVouchers.includes(selectedVoucher.code) || savingVoucher}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {savingVoucher
                    ? t('flights.savingVoucher')
                    : savedVouchers.includes(selectedVoucher.code)
                      ? t('flights.savedVoucher')
                      : t('flights.saveVoucher')
                  }
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      <Footer />

      {/* Search Loading Overlay */}
      <SearchLoadingOverlay
        isLoading={isSearching}
        searchType="flight"
        message={t('flights.searchingMessage')}
      />
    </div >
  );
}
