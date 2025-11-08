import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card } from "./components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "./components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./components/ui/command";
import { 
  PlaneTakeoff, PlaneLanding, Calendar as CalendarIcon, Users, Search,
  ArrowRightLeft, ChevronsUpDown, Check, Filter, ChevronDown, ChevronUp,
  Clock, Plane, Luggage, RefreshCcw, Ban, Plus, Minus, X
} from "lucide-react";
import type { PageType } from "./MainApp";
import { format, addDays, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner@2.0.3";

interface SearchPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  searchData?: any;
}

// Mock airports
const airports = [
  { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất" },
  { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài" },
  { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng" },
  { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc" },
  { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh" },
];

// Mock airlines
const airlines = [
  { code: "VN", name: "Vietnam Airlines" },
  { code: "VJ", name: "VietJet Air" },
  { code: "BL", name: "Pacific Airlines" },
  { code: "QH", name: "Bamboo Airways" },
];

export default function SearchPage({ onNavigate, searchData }: SearchPageProps) {
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

  // Get current flight details based on leg
  // Get current flight details based on leg (for round-trip only, one-way always uses outbound)
  const getCurrentFrom = () => (tripType === 'one-way' || flightLeg === 'outbound') ? fromAirport : toAirport;
  const getCurrentTo = () => (tripType === 'one-way' || flightLeg === 'outbound') ? toAirport : fromAirport;
  const getCurrentBaseDate = () => (tripType === 'one-way' || flightLeg === 'outbound') ? departDate : returnDate;

  // Mock 7-day prices
  const getDayPrices = () => {
    const days = [];
    const baseDate = getCurrentBaseDate();
    for (let i = -3; i <= 3; i++) {
      const date = addDays(baseDate, i);
      days.push({
        date,
        price: 892000 + Math.random() * 500000,
        isSelected: format(date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
      });
    }
    return days;
  };

  // Mock flights data - dynamically based on flight leg
  const currentFrom = getCurrentFrom();
  const currentTo = getCurrentTo();
  
  const mockFlights = [
    {
      id: flightLeg === 'outbound' ? 1 : 101,
      airline: "VN",
      airlineName: "Vietnam Airlines",
      flightNumber: flightLeg === 'outbound' ? "VN 6123" : "VN 6124",
      aircraft: "Airbus A321",
      from: currentFrom.code,
      to: currentTo.code,
      departTime: flightLeg === 'outbound' ? "09:55" : "14:20",
      arriveTime: flightLeg === 'outbound' ? "11:05" : "15:30",
      duration: "1h 10p",
      isDirect: true,
      terminal: "Nhà ga 3",
      date: format(selectedDay, "dd/MM/yyyy"),
      cabinClasses: {
        economy: {
          available: true,
          from: 1098000,
          fares: [
            {
              id: "eco-standard",
              name: "Phổ thông Tiêu chuẩn",
              price: 1098000,
              baggage: "7kg xách tay",
              checkedBag: "Không",
              refundable: false,
              changeable: false,
              miles: 500
            },
            {
              id: "eco-flex",
              name: "Phổ thông Linh hoạt",
              price: 1598000,
              baggage: "7kg xách tay",
              checkedBag: "20kg",
              refundable: true,
              changeable: true,
              miles: 750
            }
          ]
        },
        premiumEconomy: {
          available: true,
          from: 2013000,
          fares: [
            {
              id: "peco-standard",
              name: "Phổ thông Đặc biệt",
              price: 2013000,
              baggage: "7kg xách tay",
              checkedBag: "25kg",
              refundable: true,
              changeable: true,
              miles: 1000
            }
          ]
        },
        business: {
          available: true,
          from: 3334000,
          fares: [
            {
              id: "biz-standard",
              name: "Thương gia Tiêu chuẩn",
              price: 3334000,
              baggage: "10kg xách tay",
              checkedBag: "30kg",
              refundable: true,
              changeable: true,
              miles: 2000
            },
            {
              id: "biz-flex",
              name: "Thương gia Linh hoạt",
              price: 3834000,
              baggage: "10kg xách tay",
              checkedBag: "40kg",
              refundable: true,
              changeable: true,
              miles: 2500
            }
          ]
        }
      }
    },
    {
      id: flightLeg === 'outbound' ? 2 : 102,
      airline: "VJ",
      airlineName: "VietJet Air",
      flightNumber: flightLeg === 'outbound' ? "VJ 234" : "VJ 235",
      aircraft: "Airbus A320",
      from: currentFrom.code,
      to: currentTo.code,
      departTime: flightLeg === 'outbound' ? "14:30" : "17:15",
      arriveTime: flightLeg === 'outbound' ? "15:45" : "18:30",
      duration: "1h 15p",
      isDirect: true,
      terminal: "Nhà ga 1",
      date: format(selectedDay, "dd/MM/yyyy"),
      cabinClasses: {
        economy: {
          available: true,
          from: 892000,
          fares: [
            {
              id: "eco-saver",
              name: "Tiết kiệm",
              price: 892000,
              baggage: "7kg xách tay",
              checkedBag: "Không",
              refundable: false,
              changeable: false,
              miles: 300
            },
            {
              id: "eco-standard",
              name: "Tiêu chuẩn",
              price: 1192000,
              baggage: "7kg xách tay",
              checkedBag: "20kg",
              refundable: false,
              changeable: true,
              miles: 500
            }
          ]
        }
      }
    },
    {
      id: flightLeg === 'outbound' ? 3 : 103,
      airline: "QH",
      airlineName: "Bamboo Airways",
      flightNumber: flightLeg === 'outbound' ? "QH 456" : "QH 457",
      aircraft: "Embraer E195",
      from: currentFrom.code,
      to: currentTo.code,
      departTime: flightLeg === 'outbound' ? "18:20" : "20:45",
      arriveTime: flightLeg === 'outbound' ? "19:30" : "21:55",
      duration: "1h 10p",
      isDirect: true,
      terminal: "Nhà ga 2",
      date: format(selectedDay, "dd/MM/yyyy"),
      cabinClasses: {
        economy: {
          available: true,
          from: 1250000,
          fares: [
            {
              id: "eco-basic",
              name: "Phổ thông Cơ bản",
              price: 1250000,
              baggage: "7kg xách tay",
              checkedBag: "Không",
              refundable: false,
              changeable: false,
              miles: 400
            },
            {
              id: "eco-plus",
              name: "Phổ thông Plus",
              price: 1650000,
              baggage: "7kg xách tay",
              checkedBag: "23kg",
              refundable: true,
              changeable: true,
              miles: 700
            }
          ]
        },
        business: {
          available: true,
          from: 2890000,
          fares: [
            {
              id: "biz-class",
              name: "Thương gia",
              price: 2890000,
              baggage: "10kg xách tay",
              checkedBag: "32kg",
              refundable: true,
              changeable: true,
              miles: 1800
            }
          ]
        }
      }
    }
  ];

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
        date: format(outboundFlight.date || departDate, "dd/MM/yyyy")
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

  const dayPrices = getDayPrices();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="flights" onNavigate={onNavigate} />

      {/* Search Summary Bar */}
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
        <p className="text-sm text-gray-600 mb-4">Có {mockFlights.length} chuyến bay</p>

        <div className="space-y-4">
          {mockFlights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden">
              {/* Flight Row */}
              <div className="p-6">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Flight Info (Left) */}
                  <div className="col-span-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{flight.airlineName}</span>
                          <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 items-center mb-2">
                          <div>
                            <div className="text-2xl">{flight.departTime}</div>
                            <div className="text-sm text-gray-600">{flight.from}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">{flight.duration}</div>
                            <div className="border-t border-gray-300 my-1"></div>
                            <div className="text-xs text-gray-500">
                              {flight.isDirect ? "Bay thẳng" : "1 dừng"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl">{flight.arriveTime}</div>
                            <div className="text-sm text-gray-600">{flight.to}</div>
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
                                <span className="text-sm font-medium">{flight.aircraft}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Thời gian bay</span>
                                <span className="text-sm font-medium">{flight.duration}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Nhà ga</span>
                                <span className="text-sm font-medium">{flight.terminal}</span>
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
                          từ {flight.cabinClasses.economy.from.toLocaleString('vi-VN')}₫
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
                          từ {flight.cabinClasses.premiumEconomy.from.toLocaleString('vi-VN')}₫
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
                          từ {flight.cabinClasses.business.from.toLocaleString('vi-VN')}₫
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
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
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
