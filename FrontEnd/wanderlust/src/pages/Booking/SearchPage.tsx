import { addDays, format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
    ArrowRightLeft,
    Ban,
    Calendar as CalendarIcon,
    Check, Filter,
    Loader2,
    Luggage,
    Plane,
    PlaneLanding,
    PlaneTakeoff,
    RefreshCcw
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
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
import { flightApi } from "../../utils/api";

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

export default function SearchPage({ onNavigate, searchData }: SearchPageProps) {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  
  // Search modification state
  const [showModifySearch, setShowModifySearch] = useState(false);
  const [tripType, setTripType] = useState(searchData?.tripType || "round-trip");
  const [fromAirport, setFromAirport] = useState(searchData?.from || airports[0]);
  const [toAirport, setToAirport] = useState(searchData?.to || airports[3]);
  const [departDate, setDepartDate] = useState(searchData?.departDate || new Date());
  const [returnDate, setReturnDate] = useState(searchData?.returnDate || addDays(new Date(), 3));
  const [adults, setAdults] = useState(searchData?.passengers?.adults || 1);
  const [children, setChildren] = useState(searchData?.passengers?.children || 0);
  const [infants, setInfants] = useState(searchData?.passengers?.infants || 0);
  const [cabinClass, setCabinClass] = useState(searchData?.cabinClass || "economy");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openPassengers, setOpenPassengers] = useState(false);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [flightType, setFlightType] = useState<"all" | "direct">("all");
  const [departureTime, setDepartureTime] = useState<string[]>([]);
  const [arrivalTime, setArrivalTime] = useState<string[]>([]);

  // Sort & Selection state
  const [sortBy, setSortBy] = useState("default");
  const [selectedDay, setSelectedDay] = useState(departDate);
  const [expandedFlight, setExpandedFlight] = useState<number | null>(null);
  const [expandedCabinClass, setExpandedCabinClass] = useState<string | null>(null);
  const [selectedFare, setSelectedFare] = useState<any>(null);
  
  // Round-trip state
  const [flightLeg, setFlightLeg] = useState<'outbound' | 'inbound'>(searchData?.flightLeg || 'outbound');
  const [outboundFlight, setOutboundFlight] = useState<any>(searchData?.outboundFlight || null);
  const [inboundFlight, setInboundFlight] = useState<any>(searchData?.inboundFlight || null);

  // Backend data state
  const [flights, setFlights] = useState<any[]>(searchData?.outboundFlights || []);
  const [dayPricesData, setDayPricesData] = useState<any[]>([]);

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
        toast.error('Không thể tải danh sách chuyến bay. Vui lòng thử lại!');
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
      setIsLoadingPrices(true);
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
        setIsLoadingPrices(false);
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

  // Helper to get current flight details based on leg (legacy code kept for compatibility)
  const currentFrom = getCurrentFrom();
  const currentTo = getCurrentTo();

  const handleModifySearch = () => {
    setShowModifySearch(false);
    toast.success("Đã cập nhật tìm kiếm!");
    if (flightLeg === 'outbound') {
      setSelectedDay(departDate);
    } else {
      setSelectedDay(returnDate);
    }
  };

  const handleSelectFare = (flight: any, cabinClass: string, fare: any) => {
    setSelectedFare({
      flight,
      cabinClass,
      fare,
      passengers: { adults, children, infants }
    });
    toast.success(`Đã chọn ${fare.name} - ${fare.price.toLocaleString('vi-VN')}đ`);
  };

  const handleContinueToReturn = () => {
    if (!selectedFare) {
      toast.error("Vui lòng chọn loại vé chiều đi");
      return;
    }
    
    // Save outbound flight
    setOutboundFlight({
      ...selectedFare,
      date: format(selectedDay, "dd/MM/yyyy")
    });
    
    // Switch to inbound leg
    setFlightLeg('inbound');
    setSelectedDay(returnDate);
    setExpandedFlight(null);
    setExpandedCabinClass(null);
    setSelectedFare(null);
    
    toast.success("Vui lòng chọn chuyến bay về");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinue = () => {
    if (!selectedFare) {
      toast.error("Vui lòng chọn loại vé");
      return;
    }
    
    // For one-way, go directly to review
    if (tripType === 'one-way') {
      // Navigate to flight review page
      const flightData: any = {
        tripType,
        from: fromAirport.code,
        to: toAirport.code,
        fromCity: fromAirport.city,
        toCity: toAirport.city,
        passengers: { adults, children, infants },
        isInternational: false,
        outbound: {
          ...selectedFare.flight,
          class: selectedFare.fare.name,
          farePrice: selectedFare.fare.price,
          cabinClass: selectedFare.cabinClass,
          date: format(selectedDay, "dd/MM/yyyy")
        }
      };
      onNavigate("flight-review", flightData);
      return;
    }
    
    // For round-trip, need both flights
    if (tripType === 'round-trip' && flightLeg === 'outbound') {
      handleContinueToReturn();
      return;
    }
    
    // For round-trip inbound flight
    const flightData: any = {
      tripType,
      from: fromAirport.code,
      to: toAirport.code,
      fromCity: fromAirport.city,
      toCity: toAirport.city,
      passengers: { adults, children, infants },
      isInternational: false,
      outbound: {
        ...outboundFlight.flight,
        class: outboundFlight.fare.name,
        farePrice: outboundFlight.fare.price,
        cabinClass: outboundFlight.cabinClass,
        date: outboundFlight.date || format(departDate, "dd/MM/yyyy")
      },
      return: {
        ...selectedFare.flight,
        class: selectedFare.fare.name,
        farePrice: selectedFare.fare.price,
        cabinClass: selectedFare.cabinClass,
        date: format(selectedDay, "dd/MM/yyyy")
      }
    };
    
    // Navigate to flight review page
    onNavigate("flight-review", flightData);
  };

  const cabinClassLabels: any = {
    economy: "Phổ thông",
    business: "Thương gia",
    first: "Hạng nhất"
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
                <span>{cabinClassLabels[cabinClass]}</span>
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
                className={`px-6 py-4 border-b-4 transition-all ${
                  flightLeg === 'outbound'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  if (flightLeg !== 'outbound') {
                    setFlightLeg('outbound');
                    setSelectedDay(departDate);
                    setExpandedFlight(null);
                    setExpandedCabinClass(null);
                    setSelectedFare(outboundFlight || null);
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
                className={`px-6 py-4 border-b-4 transition-all ${
                  flightLeg === 'inbound'
                    ? 'border-blue-600 text-blue-600'
                    : outboundFlight
                    ? 'border-transparent text-gray-600 hover:text-gray-900'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (outboundFlight && flightLeg !== 'inbound') {
                    setFlightLeg('inbound');
                    setSelectedDay(returnDate);
                    setExpandedFlight(null);
                    setExpandedCabinClass(null);
                    setSelectedFare(inboundFlight || null);
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
                  {inboundFlight && <Check className="w-5 h-5 text-green-600" />}
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
                <strong>Đã chọn chiều đi:</strong> {outboundFlight.flight.flightNumber} • {outboundFlight.fare.name} • {outboundFlight.fare.price.toLocaleString('vi-VN')}₫
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
                  setExpandedFlight(null);
                  setExpandedCabinClass(null);
                  setSelectedFare(null);
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  day.isSelected 
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

                  {/* Cabin Classes (Right) */}
                  <div className="col-span-7 grid grid-cols-3 gap-3">
                    {/* Economy */}
                    {flight.cabinClasses.economy && (
                      <button
                        onClick={() => {
                          if (expandedFlight === flight.id && expandedCabinClass === 'economy') {
                            setExpandedFlight(null);
                            setExpandedCabinClass(null);
                          } else {
                            setExpandedFlight(flight.id);
                            setExpandedCabinClass('economy');
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          expandedFlight === flight.id && expandedCabinClass === 'economy'
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-sm text-gray-600 mb-1">PHỔ THÔNG</div>
                        <div className="text-lg">
                          từ {flight.cabinClasses.economy.fromPrice?.toLocaleString('vi-VN') || 'N/A'}₫
                        </div>
                      </button>
                    )}

                    {/* Premium Economy */}
                    {flight.cabinClasses.premiumEconomy && (
                      <button
                        onClick={() => {
                          if (expandedFlight === flight.id && expandedCabinClass === 'premiumEconomy') {
                            setExpandedFlight(null);
                            setExpandedCabinClass(null);
                          } else {
                            setExpandedFlight(flight.id);
                            setExpandedCabinClass('premiumEconomy');
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          expandedFlight === flight.id && expandedCabinClass === 'premiumEconomy'
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-sm text-gray-600 mb-1">PHỔ THÔNG ĐẶC BIỆT</div>
                        <div className="text-lg">
                          từ {flight.cabinClasses.premiumEconomy.fromPrice?.toLocaleString('vi-VN') || 'N/A'}₫
                        </div>
                      </button>
                    )}

                    {/* Business */}
                    {flight.cabinClasses.business && (
                      <button
                        onClick={() => {
                          if (expandedFlight === flight.id && expandedCabinClass === 'business') {
                            setExpandedFlight(null);
                            setExpandedCabinClass(null);
                          } else {
                            setExpandedFlight(flight.id);
                            setExpandedCabinClass('business');
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          expandedFlight === flight.id && expandedCabinClass === 'business'
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-sm text-gray-600 mb-1">THƯƠNG GIA</div>
                        <div className="text-lg">
                          từ {flight.cabinClasses.business.fromPrice?.toLocaleString('vi-VN') || 'N/A'}₫
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Fare Selection */}
              {expandedFlight === flight.id && expandedCabinClass && (
                <div className="border-t bg-gray-50 p-6">
                  <h3 className="text-lg mb-4">Chọn loại vé</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flight.cabinClasses[expandedCabinClass]?.fares.map((fare: any) => (
                        <Card 
                          key={fare.id} 
                          className={`cursor-pointer transition-all ${
                            selectedFare?.fare?.id === fare.id 
                              ? 'ring-2 ring-blue-600' 
                              : 'hover:shadow-lg'
                          }`}
                          onClick={() => handleSelectFare(flight, expandedCabinClass, fare)}
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3 mb-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                                selectedFare?.fare?.id === fare.id 
                                  ? 'border-blue-600 bg-blue-600' 
                                  : 'border-gray-300'
                              }`}>
                                {selectedFare?.fare?.id === fare.id && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{fare.name}</h4>
                                <div className="text-2xl text-blue-600">
                                  {fare.price.toLocaleString('vi-VN')}₫
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Luggage className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{fare.baggage}</span>
                              </div>
                              {fare.checkedBag !== "Không" && (
                                <div className="flex items-center gap-2">
                                  <Luggage className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">Hành lý ký gửi: {fare.checkedBag}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                {fare.refundable ? (
                                  <RefreshCcw className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Ban className="w-4 h-4 text-red-600" />
                                )}
                                <span className={fare.refundable ? "text-green-700" : "text-red-700"}>
                                  {fare.refundable ? "Có thể hoàn vé" : "Không hoàn vé"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {fare.changeable ? (
                                  <RefreshCcw className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Ban className="w-4 h-4 text-red-600" />
                                )}
                                <span className={fare.changeable ? "text-green-700" : "text-red-700"}>
                                  {fare.changeable ? "Có thể đổi vé" : "Không đổi vé"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Plane className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">Tích lũy {fare.miles} dặm</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    }
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Summary Bar */}
      {selectedFare && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">
                  {tripType === 'one-way' 
                    ? `${selectedFare.flight.flightNumber} • ${selectedFare.fare.name}`
                    : `${flightLeg === 'outbound' ? 'Chiều đi' : 'Chiều về'}: ${selectedFare.flight.flightNumber} • ${selectedFare.fare.name}`
                  }
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl text-blue-600">
                    {selectedFare.fare.price.toLocaleString('vi-VN')}₫
                    <span className="text-sm text-gray-600 ml-2">/ người</span>
                  </div>
                  {tripType === 'round-trip' && outboundFlight && flightLeg === 'inbound' && (
                    <div className="text-sm text-gray-600">
                      Tổng cả 2 chiều: {(outboundFlight.fare.price + selectedFare.fare.price).toLocaleString('vi-VN')}₫/người
                    </div>
                  )}
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleContinue}
                className="bg-orange-600 hover:bg-orange-700 whitespace-nowrap"
              >
                {tripType === 'round-trip' && flightLeg === 'outbound' 
                  ? 'CHỌN CHUYẾN VỀ' 
                  : 'TIẾP TỤC ĐẶT VÉ'}
              </Button>
            </div>
          </div>
        </div>
      )}

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
