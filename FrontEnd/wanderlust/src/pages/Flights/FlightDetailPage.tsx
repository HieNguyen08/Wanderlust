import { addDays, format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
    Armchair,
    ArrowRightLeft,
    Calendar as CalendarIcon,
    Check, Filter,
    Loader2,
    Plane,
    PlaneLanding,
    PlaneTakeoff
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Footer } from "../../components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import type { PageType } from "../../MainApp";
import { flightApi, flightSeatApi } from "../../utils/api";

interface SearchPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  searchData?: any;
}

// Airports data (sử dụng cho UI, backend có data riêng)
const airports = [
  { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất" },
  { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài" },
  { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng" },
  { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc" },
  { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh" },
  { code: "HPH", city: "Hải Phòng", name: "Sân bay Cát Bi" },
  { code: "DLI", city: "Đà Lạt", name: "Sân bay Liên Khương" },
  { code: "VCA", city: "Cần Thơ", name: "Sân bay Cần Thơ" },
  { code: "SIN", city: "Singapore", name: "Changi Airport" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport" },
  { code: "KUL", city: "Kuala Lumpur", name: "KLIA" },
  { code: "HKT", city: "Phuket", name: "Phuket Airport" },
];

// Airlines data
const airlines = [
  { code: "VN", name: "Vietnam Airlines" },
  { code: "VJ", name: "VietJet Air" },
  { code: "BL", name: "Pacific Airlines" },
  { code: "QH", name: "Bamboo Airways" },
];

export default function FlightDetailPage({ onNavigate, searchData }: SearchPageProps) {
  const { t } = useTranslation();
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Search modification state
  const [showModifySearch, setShowModifySearch] = useState(false);
  const [tripType, setTripType] = useState(searchData?.tripType || "round-trip");
  const [fromAirport, setFromAirport] = useState(searchData?.from || airports[0]);
  const [toAirport, setToAirport] = useState(searchData?.to || airports[3]);
  const [departDate, setDepartDate] = useState(searchData?.departDate || new Date());
  const [returnDate, setReturnDate] = useState(searchData?.returnDate || addDays(new Date(), 3));
  const [adults] = useState(searchData?.passengers?.adults || 1);
  const [children] = useState(searchData?.passengers?.children || 0);
  const [infants] = useState(searchData?.passengers?.infants || 0);
  const [cabinClass] = useState(searchData?.cabinClass || "economy");

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [flightType, setFlightType] = useState<"all" | "direct">("all");
  const [departureTime, setDepartureTime] = useState<string[]>([]);
  const [arrivalTime, setArrivalTime] = useState<string[]>([]);

  // Sort & Selection state
  const [sortBy, setSortBy] = useState("default");
  const [selectedDay, setSelectedDay] = useState(departDate);

  // Round-trip state
  const [flightLeg, setFlightLeg] = useState<'outbound' | 'inbound'>(searchData?.flightLeg || 'outbound');
  const [outboundFlight, setOutboundFlight] = useState<any>(searchData?.outboundFlight || null);

  // Backend data state
  const [flights, setFlights] = useState<any[]>(searchData?.outboundFlights || []);
  const [dayPricesData, setDayPricesData] = useState<any[]>([]);

  // Seat selection state
  const [selectedFlightForSeats, setSelectedFlightForSeats] = useState<any>(null);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Get current flight details based on leg
  const getCurrentFrom = () => (tripType === 'one-way' || flightLeg === 'outbound') ? fromAirport : toAirport;
  const getCurrentTo = () => (tripType === 'one-way' || flightLeg === 'outbound') ? toAirport : fromAirport;
  const getCurrentBaseDate = () => (tripType === 'one-way' || flightLeg === 'outbound') ? departDate : returnDate;

  // Load initial flights from searchData if available
  useEffect(() => {
    if (searchData?.outboundFlights && flightLeg === 'outbound') {
      setFlights(searchData.outboundFlights);
      setIsLoading(false);
    } else if (searchData?.returnFlights && flightLeg === 'inbound') {
      setFlights(searchData.returnFlights);
      setIsLoading(false);
    }
  }, [searchData, flightLeg]);

  // Fetch flights from backend when search params change
  useEffect(() => {
    // Skip if we already have data from initial search
    if (searchData?.outboundFlights && flightLeg === 'outbound' &&
      format(selectedDay, 'yyyy-MM-dd') === format(searchData.departDate, 'yyyy-MM-dd')) {
      return;
    }
    if (searchData?.returnFlights && flightLeg === 'inbound' &&
      format(selectedDay, 'yyyy-MM-dd') === format(searchData.returnDate, 'yyyy-MM-dd')) {
      return;
    }

    const fetchFlights = async () => {
      setIsLoading(true);
      try {
        const currentFrom = getCurrentFrom();
        const currentTo = getCurrentTo();
        const results = await flightApi.searchFlights({
          from: currentFrom.code,
          to: currentTo.code,
          date: format(selectedDay, 'yyyy-MM-dd'),
          directOnly: flightType === 'direct',
          airlines: selectedAirlines.length > 0 ? selectedAirlines : undefined,
        });
        setFlights(results);
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast.error(t('search.errorLoading'));
        setFlights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [selectedDay, fromAirport, toAirport, flightLeg, selectedAirlines, flightType]);

  // Fetch 7-day price range (only when route/filters change, NOT when selectedDay changes)
  useEffect(() => {
    const fetch7DayPrices = async () => {
      setIsLoading(true);
      try {
        const currentFrom = getCurrentFrom();
        const currentTo = getCurrentTo();
        const baseDate = getCurrentBaseDate();

        const startDate = format(subDays(baseDate, 3), 'yyyy-MM-dd');
        const endDate = format(addDays(baseDate, 3), 'yyyy-MM-dd');

        const results = await flightApi.searchFlightsByDateRange({
          from: currentFrom.code,
          to: currentTo.code,
          startDate,
          endDate,
          directOnly: flightType === 'direct',
        });

        // Group by date and find cheapest price per day
        const priceMap = new Map<string, number>();
        results.forEach((flight: any) => {
          const flightDate = flight.departureTime.split('T')[0];
          const cheapestPrice = Math.min(
            ...Object.values(flight.cabinClasses || {}).map((cabin: any) => cabin.fromPrice || Infinity)
          );
          if (!priceMap.has(flightDate) || priceMap.get(flightDate)! > cheapestPrice) {
            priceMap.set(flightDate, cheapestPrice);
          }
        });

        // Build 7-day array with initial selected state
        const days = [];
        for (let i = -3; i <= 3; i++) {
          const date = addDays(baseDate, i);
          const dateStr = format(date, 'yyyy-MM-dd');
          days.push({
            date,
            price: priceMap.get(dateStr) || null,
            isSelected: format(date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
          });
        }
        setDayPricesData(days);
      } catch (error) {
        console.error('Error fetching 7-day prices:', error);
        // Fallback to empty prices
        const days = [];
        const baseDate = getCurrentBaseDate();
        for (let i = -3; i <= 3; i++) {
          const date = addDays(baseDate, i);
          days.push({
            date,
            price: null,
            isSelected: format(date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
          });
        }
        setDayPricesData(days);
      } finally {
        setIsLoading(false);
      }
    };

    fetch7DayPrices();
  }, [fromAirport, toAirport, departDate, returnDate, flightLeg, flightType]);

  // Update isSelected immediately when selectedDay changes (instant UI update without re-fetch)
  useEffect(() => {
    if (dayPricesData.length === 0) return;

    setDayPricesData(prevDays =>
      prevDays.map(day => ({
        ...day,
        isSelected: format(day.date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
      }))
    );
  }, [selectedDay]);

  // Helper to get day prices
  const dayPrices = dayPricesData;

  const handleModifySearch = () => {
    setShowModifySearch(false);
    toast.success(t('search.searchUpdated'));
    if (flightLeg === 'outbound') {
      setSelectedDay(departDate);
    } else {
      setSelectedDay(returnDate);
    }
  };

  const handleSelectFlight = async (flight: any) => {
    try {
      setLoadingSeats(true);
      setSelectedFlightForSeats(flight);
      setSelectedSeats([]);

      // Map frontend cabin class to backend enum
      const getCabinClassEnum = (cabinClass: string) => {
        const mapping: Record<string, string> = {
          'economy': 'ECONOMY',
          'business': 'BUSINESS',
          'first': 'FIRST_CLASS'
        };
        return mapping[cabinClass.toLowerCase()] || 'ECONOMY';
      };

      const targetCabinClass = getCabinClassEnum(cabinClass);
      const seats = await flightSeatApi.getSeatsByFlight(flight.id);

      // Filter by cabin class and available status
      const filteredSeats = seats.filter((seat: any) =>
        seat.cabinClass === targetCabinClass && seat.status === 'AVAILABLE'
      );

      // Sort by row and position
      const sortedSeats = filteredSeats.sort((a: any, b: any) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.position.localeCompare(b.position);
      });

      setAvailableSeats(sortedSeats);
    } catch (error) {
      console.error('Error loading seats:', error);
      toast.error('Không thể tải sơ đồ ghế');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seat: any) => {
    const requiredSeatsCount = adults + children;
    const isSelected = selectedSeats.find(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= requiredSeatsCount) {
        toast.error(`Bạn chỉ có thể chọn tối đa ${requiredSeatsCount} ghế`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirmSeats = () => {
    const requiredSeatsCount = adults + children;
    if (selectedSeats.length < requiredSeatsCount) {
      toast.error(`Vui lòng chọn đủ ${requiredSeatsCount} ghế`);
      return;
    }

    if (flightLeg === 'outbound') {
      if (tripType === 'round-trip') {
        // Save outbound selection and move to return flight
        setOutboundFlight({
          flight: selectedFlightForSeats,
          selectedSeats: selectedSeats
        });
        setFlightLeg('inbound');
        setSelectedDay(returnDate);
        setSelectedFlightForSeats(null);
        setSelectedSeats([]);
        toast.success('Đã chọn ghế chiều đi. Vui lòng chọn chuyến bay chiều về.');
      } else {
        // One-way: go to review
        onNavigate('flight-review', {
          tripType,
          from: fromAirport,
          to: toAirport,
          departDate,
          returnDate,
          passengers: { adults, children, infants, total: adults + children + infants },
          cabinClass,
          outboundFlight: selectedFlightForSeats,
          selectedSeats: { outbound: selectedSeats, return: [] }
        });
      }
    } else {
      // Return flight selected - go to review
      onNavigate('flight-review', {
        tripType,
        from: fromAirport,
        to: toAirport,
        departDate,
        returnDate,
        passengers: { adults, children, infants, total: adults + children + infants },
        cabinClass,
        outboundFlight: outboundFlight.flight,
        returnFlight: selectedFlightForSeats,
        selectedSeats: {
          outbound: outboundFlight.selectedSeats,
          return: selectedSeats
        }
      });
    }
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="min-h-screen bg-gray-50">{isLoading && (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span>Đang tìm kiếm chuyến bay...</span>
        </div>
      </div>
    )}      {/* Search Summary Bar */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm mt-[60px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl mb-2">Chọn chuyến bay</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{fromAirport.city} ({fromAirport.code})</span>
                  <ArrowRightLeft className="w-4 h-4" />
                  <span className="font-medium text-gray-900">{toAirport.city} ({toAirport.code})</span>
                </div>
                <span>•</span>
                <span>{format(departDate, "EEEE, dd 'Thg' MM, yyyy", { locale: vi })}</span>
                {tripType === "round-trip" && (
                  <>
                    <span>•</span>
                    <span>Về: {format(returnDate, "dd/MM/yyyy")}</span>
                  </>
                )}
                <span>•</span>
                <span>{totalPassengers} hành khách</span>
                <span>•</span>
                <span>{cabinClass === 'economy' ? 'Phổ thông' : cabinClass === 'business' ? 'Thương gia' : 'Hạng nhất'}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowModifySearch(true)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              THAY ĐỔI
            </Button>
          </div>
        </div>
      </div>

      {/* Flight Leg Tabs - Only show for round-trip */}
      {tripType === 'round-trip' && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex gap-4">
              <button
                className={`px-6 py-4 border-b-4 transition-all ${flightLeg === 'outbound'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => {
                  if (flightLeg !== 'outbound') {
                    setFlightLeg('outbound');
                    setSelectedDay(departDate);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Chiều đi</div>
                    <div className="text-sm">
                      {fromAirport.code} → {toAirport.code} • {format(departDate, "dd/MM")}
                    </div>
                  </div>
                  {outboundFlight && <Check className="w-5 h-5 text-green-600" />}
                </div>
              </button>

              <button
                className={`px-6 py-4 border-b-4 transition-all ${flightLeg === 'inbound'
                  ? 'border-blue-600 text-blue-600'
                  : outboundFlight
                    ? 'border-transparent text-gray-600 hover:text-gray-900'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
                  }`}
                onClick={() => {
                  if (outboundFlight && flightLeg !== 'inbound') {
                    setFlightLeg('inbound');
                    setSelectedDay(returnDate);
                  }
                }}
                disabled={!outboundFlight}
              >
                <div className="flex items-center gap-2">
                  <PlaneLanding className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Chiều về</div>
                    <div className="text-sm">
                      {toAirport.code} → {fromAirport.code} • {format(returnDate, "dd/MM")}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner for Inbound Leg */}
      {tripType === 'round-trip' && flightLeg === 'inbound' && outboundFlight && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Check className="w-5 h-5 text-green-600" />
              <span>
                <strong>Đã chọn chiều đi:</strong> Chuyến bay {outboundFlight.flight?.flightNumber || outboundFlight.flightNumber}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Price Calendar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-7 gap-2">
            {dayPrices.map((day, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedDay(day.date);
                }}
                className={`p-3 rounded-lg border-2 transition-all ${day.isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
              >
                <div className={`text-xs mb-1 ${day.isSelected ? 'text-orange-600' : 'text-gray-600'}`}>
                  {format(day.date, "EEE", { locale: vi })}
                </div>
                <div className={`mb-1 ${day.isSelected ? 'font-bold text-orange-600' : 'font-medium'}`}>
                  {format(day.date, "dd 'Thg' MM")}
                </div>
                <div className={`text-sm ${day.isSelected ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>
                  {Math.round(day.price).toLocaleString('vi-VN')}₫
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort & Filter Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              HIỂN THỊ BỘ LỌC
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sắp xếp theo:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="price-low">Giá rẻ nhất</SelectItem>
                  <SelectItem value="price-high">Giá cao nhất</SelectItem>
                  <SelectItem value="depart-early">Giờ khởi hành sớm nhất</SelectItem>
                  <SelectItem value="depart-late">Giờ khởi hành muộn nhất</SelectItem>
                  <SelectItem value="duration">Thời gian bay ngắn nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Flight List */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <p className="text-sm text-gray-600 mb-4">Có {flights.length} chuyến bay</p>

        {flights.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <Plane className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chuyến bay</h3>
            <p className="text-gray-600">Vui lòng thử tìm kiếm với điều kiện khác hoặc chọn ngày khác.</p>
          </Card>
        )}

        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden">
              {/* Flight Row */}
              <div className="p-6">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Flight Info (Left) */}
                  <div className="col-span-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center shrink-0">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{flight.airlineName}</span>
                          <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 items-center mb-2">
                          <div>
                            <div className="text-2xl">{format(new Date(flight.departureTime), 'HH:mm')}</div>
                            <div className="text-sm text-gray-600">{flight.departureAirport}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">{flight.durationDisplay}</div>
                            <div className="border-t border-gray-300 my-1"></div>
                            <div className="text-xs text-gray-500">
                              {flight.isDirect ? "Bay thẳng" : "Có dừng"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl">{format(new Date(flight.arrivalTime), 'HH:mm')}</div>
                            <div className="text-sm text-gray-600">{flight.arrivalAirport}</div>
                          </div>
                        </div>

                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-sm text-blue-600 hover:underline">
                              Chi tiết hành trình
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Máy bay</span>
                                <span className="text-sm font-medium">{flight.aircraftType || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Thời gian bay</span>
                                <span className="text-sm font-medium">{flight.durationDisplay}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Khoảng cách</span>
                                <span className="text-sm font-medium">{flight.distanceKm} km</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Khai thác bởi</span>
                                <span className="text-sm font-medium">{flight.airlineName}</span>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  {/* Flight Info & Actions */}
                  <div className="col-span-7 flex items-center justify-between gap-4">
                    {/* Flight Stats */}
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Tổng ghế</div>
                        <div className="text-lg font-semibold">{flight.totalSeats || 'N/A'}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Còn trống</div>
                        <div className="text-lg font-semibold text-green-600">{flight.availableSeats || 'N/A'}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Giá từ</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {flight.cabinClasses[cabinClass]?.fromPrice?.toLocaleString('vi-VN') || 'N/A'}₫
                        </div>
                      </div>
                    </div>

                    {/* Select Button */}
                    <Button
                      onClick={() => handleSelectFlight(flight)}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
                      disabled={selectedFlightForSeats?.id === flight.id}
                    >
                      {selectedFlightForSeats?.id === flight.id ? 'Đang chọn ghế' : 'Chọn chuyến bay'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Seat Selection Grid - Show when this flight is selected */}
              {selectedFlightForSeats?.id === flight.id && (
                <div className="border-t bg-gray-50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Chọn ghế ngồi</h3>
                      <p className="text-sm text-gray-600">
                        Vui lòng chọn {adults + children} ghế cho hành khách của bạn
                        ({selectedSeats.length}/{adults + children} đã chọn)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFlightForSeats(null);
                        setSelectedSeats([]);
                      }}
                    >
                      Hủy
                    </Button>
                  </div>

                  {loadingSeats ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="ml-3">Đang tải sơ đồ ghế...</span>
                    </div>
                  ) : availableSeats.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Armchair className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Không còn ghế trống cho hạng vé này</p>
                    </div>
                  ) : (
                    <div>
                      {/* Legend */}
                      <div className="flex flex-wrap gap-6 text-sm justify-center mb-6 pb-4 border-b">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 border-2 border-gray-300 rounded bg-white"></div>
                          <span>Còn trống</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 border-2 border-blue-600 bg-blue-600 rounded"></div>
                          <span>Đã chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 border-2 border-gray-200 bg-gray-200 rounded"></div>
                          <span>Đã đặt</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 border-2 border-green-400 bg-white rounded ring-2 ring-green-400 ring-offset-1"></div>
                          <span>Ghế đặc biệt</span>
                        </div>
                      </div>

                      {/* Seat Grid */}
                      <div className="flex flex-col items-center max-w-fit mx-auto">
                        {/* Header with position labels */}
                        <div className="flex gap-1 mb-2">
                          <div className="w-12"></div>
                          {[...new Set(availableSeats.map(s => s.position))].sort().map(pos => (
                            <div key={pos} className="w-12 text-center font-semibold text-gray-700">
                              {pos}
                            </div>
                          ))}
                        </div>

                        {/* Rows */}
                        {[...new Set(availableSeats.map(s => s.row))].sort((a, b) => a - b).map(rowNum => {
                          const rowSeats = availableSeats.filter(s => s.row === rowNum);
                          const positions = [...new Set(availableSeats.map(s => s.position))].sort();

                          return (
                            <div key={rowNum} className="flex gap-1 mb-1">
                              {/* Row number */}
                              <div className="w-12 flex items-center justify-center font-semibold text-gray-700">
                                {rowNum}
                              </div>

                              {/* Seats */}
                              {positions.map(pos => {
                                const seat = rowSeats.find(s => s.position === pos);
                                if (!seat) {
                                  return <div key={pos} className="w-12 h-12 m-0.5"></div>;
                                }

                                const isSelected = selectedSeats.find(s => s.id === seat.id);
                                const isAvailable = seat.status === 'AVAILABLE';

                                let bgClass = "bg-white border-gray-300 hover:border-blue-500 hover:shadow-md cursor-pointer";
                                let textClass = "text-gray-700";

                                if (!isAvailable) {
                                  bgClass = "bg-gray-200 cursor-not-allowed border-gray-200";
                                  textClass = "text-gray-400";
                                } else if (isSelected) {
                                  bgClass = "bg-blue-600 border-blue-600 shadow-lg";
                                  textClass = "text-white";
                                }

                                if (seat.isExitRow || seat.extraLegroom) {
                                  bgClass += " ring-2 ring-green-400 ring-offset-1";
                                }

                                const seatPrice = seat.price ? `+${(seat.price / 1000).toFixed(0)}K` : '';

                                return (
                                  <button
                                    key={seat.id}
                                    disabled={!isAvailable}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`relative w-12 h-12 m-0.5 rounded border-2 flex flex-col items-center justify-center text-xs font-semibold transition-all ${bgClass} ${textClass}`}
                                    title={`${seat.row}${seat.position}${seat.isExitRow ? ' (Exit Row)' : ''}${seat.extraLegroom ? ' (Extra Legroom)' : ''}${seatPrice ? ` ${seatPrice}` : ''}`}
                                  >
                                    <span className="text-[10px] font-bold">{seat.row}{seat.position}</span>
                                    {seatPrice && isAvailable && (
                                      <span className="text-[8px] opacity-75">{seatPrice}</span>
                                    )}
                                    {(seat.isExitRow || seat.extraLegroom) && isAvailable && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                                    )}
                                    {isSelected && (
                                      <Check className="absolute -top-1 -left-1 w-4 h-4 text-white bg-blue-600 rounded-full p-0.5" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>

                      {/* Confirm Button */}
                      <div className="flex justify-center mt-6 pt-6 border-t">
                        <Button
                          onClick={handleConfirmSeats}
                          disabled={selectedSeats.length < (adults + children)}
                          className="px-12 py-6 text-lg"
                        >
                          Xác nhận chọn ghế ({selectedSeats.length}/{adults + children})
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Modify Search Modal */}
      <Dialog open={showModifySearch} onOpenChange={setShowModifySearch}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Thay đổi tìm kiếm</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tìm kiếm chuyến bay của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Trip Type */}
            <RadioGroup value={tripType} onValueChange={(value: any) => setTripType(value)} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="mod-one-way" />
                <Label htmlFor="mod-one-way">Một chiều</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="mod-round-trip" />
                <Label htmlFor="mod-round-trip">Khứ hồi</Label>
              </div>
            </RadioGroup>

            {/* Search Form - simplified version */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Từ</Label>
                <Select value={fromAirport.code} onValueChange={(code) => setFromAirport(airports.find(a => a.code === code)!)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map(airport => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.city} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Đến</Label>
                <Select value={toAirport.code} onValueChange={(code) => setToAirport(airports.find(a => a.code === code)!)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map(airport => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.city} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ngày đi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(departDate, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={departDate} onSelect={(date) => date && setDepartDate(date)} />
                  </PopoverContent>
                </Popover>
              </div>

              {tripType === "round-trip" && (
                <div>
                  <Label>Ngày về</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(returnDate, "dd/MM/yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={returnDate} onSelect={(date) => date && setReturnDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <Button onClick={handleModifySearch} className="w-full bg-blue-600">
              Cập nhật tìm kiếm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bộ lọc</SheetTitle>
            <SheetDescription>
              Lọc kết quả tìm kiếm theo tiêu chí của bạn
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Accordion type="multiple" className="w-full">
              {/* Flight Type */}
              <AccordionItem value="flight-type">
                <AccordionTrigger>Loại chuyến bay</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={flightType} onValueChange={(value: any) => setFlightType(value)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="direct" id="direct" />
                      <Label htmlFor="direct">Bay thẳng</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              {/* Departure Time */}
              <AccordionItem value="depart-time">
                <AccordionTrigger>Giờ khởi hành</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[
                      { id: "morning", label: "06:00 - 11:59 Sáng", value: "morning" },
                      { id: "afternoon", label: "12:00 - 17:59 Chiều", value: "afternoon" },
                      { id: "evening", label: "18:00 - 23:59 Tối", value: "evening" },
                      { id: "night", label: "00:00 - 05:59 Đêm", value: "night" }
                    ].map(time => (
                      <label key={time.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={departureTime.includes(time.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setDepartureTime([...departureTime, time.value]);
                            } else {
                              setDepartureTime(departureTime.filter(t => t !== time.value));
                            }
                          }}
                        />
                        <span className="text-sm">{time.label}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Arrival Time */}
              <AccordionItem value="arrival-time">
                <AccordionTrigger>Giờ đến</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[
                      { id: "morning", label: "06:00 - 11:59 Sáng", value: "morning" },
                      { id: "afternoon", label: "12:00 - 17:59 Chiều", value: "afternoon" },
                      { id: "evening", label: "18:00 - 23:59 Tối", value: "evening" },
                      { id: "night", label: "00:00 - 05:59 Đêm", value: "night" }
                    ].map(time => (
                      <label key={time.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={arrivalTime.includes(time.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setArrivalTime([...arrivalTime, time.value]);
                            } else {
                              setArrivalTime(arrivalTime.filter(t => t !== time.value));
                            }
                          }}
                        />
                        <span className="text-sm">{time.label}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Airlines */}
              <AccordionItem value="airlines">
                <AccordionTrigger>Hãng hàng không</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {airlines.map(airline => (
                      <label key={airline.code} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedAirlines.includes(airline.code)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAirlines([...selectedAirlines, airline.code]);
                            } else {
                              setSelectedAirlines(selectedAirlines.filter(a => a !== airline.code));
                            }
                          }}
                        />
                        <span className="text-sm">{airline.name}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <SheetFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAirlines([]);
                setFlightType("all");
                setDepartureTime([]);
                setArrivalTime([]);
              }}
              className="flex-1"
            >
              THIẾT LẬP LẠI
            </Button>
            <Button
              onClick={() => {
                setShowFilters(false);
                toast.success("Đã áp dụng bộ lọc");
              }}
              className="flex-1 bg-blue-600"
            >
              ÁP DỤNG
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}
