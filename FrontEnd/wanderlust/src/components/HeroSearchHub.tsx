import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    ArrowRightLeft,
    Calendar as CalendarIcon,
    Car,
    Check,
    Clock,
    Hotel,
    MapPin,
    Minus,
    PartyPopper,
    Plane,
    PlaneLanding,
    PlaneTakeoff,
    Plus,
    Search,
    Users
} from "lucide-react";
import { useState } from "react";
import type { PageType } from "../MainApp";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "./ui/utils";

interface HeroSearchHubProps {
  onNavigate: (page: PageType, data?: any) => void;
  onSearch?: (data: any) => void;
}

type ServiceType = "flights" | "hotels" | "car-rental" | "activities";
type TripType = "one-way" | "round-trip" | "multi-city";
type HotelType = "all" | "hotels" | "villa" | "apartment";
type CarDriverType = "without" | "with";

// Mock data
const airports = [
  { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất", country: "Việt Nam" },
  { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài", country: "Việt Nam" },
  { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng", country: "Việt Nam" },
  { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh", country: "Việt Nam" },
  { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc", country: "Việt Nam" },
];

const timeSlots = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

export function HeroSearchHub({ onNavigate, onSearch }: HeroSearchHubProps) {
  // Active service tab
  const [activeService, setActiveService] = useState<ServiceType>("hotels");
  
  // Flight states
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [fromAirport, setFromAirport] = useState<typeof airports[0] | null>(null);
  const [toAirport, setToAirport] = useState<typeof airports[0] | null>(null);
  const [flightDepartDate, setFlightDepartDate] = useState<Date>();
  const [flightReturnDate, setFlightReturnDate] = useState<Date>();
  const [hasReturnDate, setHasReturnDate] = useState(true);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState<"economy" | "business" | "first">("economy");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openPassengers, setOpenPassengers] = useState(false);
  const [openFlightDates, setOpenFlightDates] = useState(false);
  
  // Hotel states
  const [hotelType, setHotelType] = useState<HotelType>("all");
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState<Date>();
  const [hotelCheckOut, setHotelCheckOut] = useState<Date>();
  const [hotelGuests, setHotelGuests] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [openHotelGuests, setOpenHotelGuests] = useState(false);
  const [openHotelLocation, setOpenHotelLocation] = useState(false);
  
  // Car Rental states
  const [carDriverType, setCarDriverType] = useState<CarDriverType>("without");
  const [carLocation, setCarLocation] = useState("");
  const [carStartDate, setCarStartDate] = useState<Date>();
  const [carStartTime, setCarStartTime] = useState("09:00");
  const [carEndDate, setCarEndDate] = useState<Date>();
  const [carEndTime, setCarEndTime] = useState("18:00");
  const [openCarStartTime, setOpenCarStartTime] = useState(false);
  const [openCarEndTime, setOpenCarEndTime] = useState(false);
  
  // Activities states
  const [activityLocation, setActivityLocation] = useState("");
  const [activityDate, setActivityDate] = useState<Date>();
  const [activityAdults, setActivityAdults] = useState(2);
  const [activityChildren, setActivityChildren] = useState(0);
  const [openActivityGuests, setOpenActivityGuests] = useState(false);

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleFlightSearch = () => {
    onSearch?.({ type: "flights", tripType, from: fromAirport, to: toAirport, departDate: flightDepartDate, returnDate: hasReturnDate ? flightReturnDate : null });
    onNavigate("flights");
  };

  const handleHotelSearch = () => {
    onSearch?.({ type: "hotels", location: hotelLocation, checkIn: hotelCheckIn, checkOut: hotelCheckOut });
    onNavigate("hotel");
  };

  const handleCarSearch = () => {
    onSearch?.({ type: "car", location: carLocation, startDate: carStartDate, endDate: carEndDate });
    onNavigate("car-rental");
  };

  const handleActivitySearch = () => {
    onSearch?.({ type: "activities", location: activityLocation, date: activityDate, adults: activityAdults, children: activityChildren });
    onNavigate("activities");
  };

  // Service tabs configuration
  const serviceTabs = [
    { id: "hotels" as ServiceType, icon: Hotel, label: "Khách sạn" },
    { id: "flights" as ServiceType, icon: Plane, label: "Vé máy bay" },
    { id: "car-rental" as ServiceType, icon: Car, label: "Thuê xe" },
    { id: "activities" as ServiceType, icon: PartyPopper, label: "Hoạt động" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-yellow-400 relative overflow-hidden">
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-linear-to-br from-yellow-400/20 to-transparent rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-linear-to-tl from-yellow-400/20 to-transparent rounded-tl-full"></div>
        
        {/* Service Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 relative z-10">
          {serviceTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeService === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveService(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap",
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105 border-2 border-yellow-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 border-2 border-transparent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Flights Form */}
        {activeService === "flights" && (
          <div className="space-y-4 relative z-10">
            {/* Sub-tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setTripType("round-trip")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all border-2",
                  tripType === "round-trip"
                    ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent"
                )}
              >
                Khứ hồi
              </button>
              <button
                onClick={() => setTripType("one-way")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all border-2",
                  tripType === "one-way"
                    ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent"
                )}
              >
                Một chiều
              </button>
              <button
                onClick={() => setTripType("multi-city")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all border-2",
                  tripType === "multi-city"
                    ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent"
                )}
              >
                Nhiều chặng
              </button>
            </div>

            {/* From/To Row */}
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-2 items-center">
              {/* From */}
              <Popover open={openFrom} onOpenChange={setOpenFrom}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                    <PlaneTakeoff className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Điểm khởi hành</div>
                      <div className="font-semibold">
                        {fromAirport ? `${fromAirport.city} (${fromAirport.code})` : "Chọn sân bay"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm sân bay..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy sân bay.</CommandEmpty>
                      <CommandGroup>
                        {airports.map((airport) => (
                          <CommandItem
                            key={airport.code}
                            value={`${airport.city} ${airport.code}`}
                            onSelect={() => {
                              setFromAirport(airport);
                              setOpenFrom(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", fromAirport?.code === airport.code ? "opacity-100" : "opacity-0")} />
                            <div>
                              <div className="font-semibold">{airport.city} ({airport.code})</div>
                              <div className="text-xs text-gray-500">{airport.name}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Swap Button */}
              <button
                onClick={handleSwapAirports}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              </button>

              {/* To */}
              <Popover open={openTo} onOpenChange={setOpenTo}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                    <PlaneLanding className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Điểm đến</div>
                      <div className="font-semibold">
                        {toAirport ? `${toAirport.city} (${toAirport.code})` : "Chọn sân bay"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm sân bay..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy sân bay.</CommandEmpty>
                      <CommandGroup>
                        {airports.map((airport) => (
                          <CommandItem
                            key={airport.code}
                            value={`${airport.city} ${airport.code}`}
                            onSelect={() => {
                              setToAirport(airport);
                              setOpenTo(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", toAirport?.code === airport.code ? "opacity-100" : "opacity-0")} />
                            <div>
                              <div className="font-semibold">{airport.city} ({airport.code})</div>
                              <div className="text-xs text-gray-500">{airport.name}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Dates & Passengers Row */}
            <div className="grid md:grid-cols-2 gap-3">
              {/* Flight Dates - Combined Date Range Picker */}
              <Popover open={openFlightDates} onOpenChange={setOpenFlightDates}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">
                        {tripType === "one-way" ? "Ngày đi" : "Ngày đi - Ngày về"}
                      </div>
                      <div className="font-semibold">
                        {tripType === "one-way" ? (
                          flightDepartDate ? format(flightDepartDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"
                        ) : (
                          flightDepartDate && flightReturnDate
                            ? `${format(flightDepartDate, "dd/MM", { locale: vi })} - ${format(flightReturnDate, "dd/MM/yyyy", { locale: vi })}`
                            : flightDepartDate
                            ? format(flightDepartDate, "dd/MM/yyyy", { locale: vi })
                            : "Chọn ngày"
                        )}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {tripType === "one-way" ? (
                    <Calendar 
                      mode="single" 
                      selected={flightDepartDate} 
                      onSelect={setFlightDepartDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  ) : (
                    <Calendar
                      mode="range"
                      selected={{ from: flightDepartDate, to: flightReturnDate }}
                      onSelect={(range) => {
                        setFlightDepartDate(range?.from);
                        setFlightReturnDate(range?.to);
                      }}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  )}
                </PopoverContent>
              </Popover>

              {/* Passengers */}
              <Popover open={openPassengers} onOpenChange={setOpenPassengers}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Hành khách & Hạng vé</div>
                      <div className="font-semibold">
                        {adults + children} người · {cabinClass === "economy" ? "Phổ thông" : cabinClass === "business" ? "Thương gia" : "Hạng nhất"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Người lớn</span>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" onClick={() => setAdults(Math.max(1, adults - 1))}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{adults}</span>
                        <Button size="sm" variant="outline" onClick={() => setAdults(adults + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trẻ em</span>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" onClick={() => setChildren(Math.max(0, children - 1))}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{children}</span>
                        <Button size="sm" variant="outline" onClick={() => setChildren(children + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-sm mb-2">Hạng vé</div>
                      <div className="space-y-2">
                        {[
                          { value: "economy", label: "Phổ thông" },
                          { value: "business", label: "Thương gia" },
                          { value: "first", label: "Hạng nhất" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setCabinClass(option.value as any)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg transition-colors",
                              cabinClass === option.value ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <Button onClick={handleFlightSearch} className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-14 text-lg shadow-lg shadow-blue-500/30 border-2 border-yellow-400">
              <Search className="w-5 h-5 mr-2" />
              Tìm chuyến bay
            </Button>
          </div>
        )}

        {/* Hotels Form */}
        {activeService === "hotels" && (
          <div className="space-y-4 relative z-10">
            {/* Unified Search Bar */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors">
              <div className="grid md:grid-cols-[2fr_2fr_2fr_auto] divide-x divide-gray-200">
                {/* Location */}
                <Popover open={openHotelLocation} onOpenChange={setOpenHotelLocation}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Địa điểm</div>
                        <div className="font-semibold truncate">
                          {hotelLocation || "Chọn địa điểm"}
                        </div>
                      </div>
                      <ChevronsUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Tìm địa điểm..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy địa điểm.</CommandEmpty>
                        <CommandGroup>
                          {[
                            { code: "HCM", name: "TP. Hồ Chí Minh", count: 450 },
                            { code: "HN", name: "Hà Nội", count: 380 },
                            { code: "DN", name: "Đà Nẵng", count: 220 },
                            { code: "NT", name: "Nha Trang", count: 180 },
                            { code: "PQ", name: "Phú Quốc", count: 165 },
                            { code: "HA", name: "Hội An", count: 140 },
                            { code: "VT", name: "Vũng Tàu", count: 125 },
                            { code: "DL", name: "Đà Lạt", count: 155 },
                          ].map((location) => (
                            <CommandItem
                              key={location.code}
                              value={location.name}
                              onSelect={() => {
                                setHotelLocation(location.name);
                                setOpenHotelLocation(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", hotelLocation === location.name ? "opacity-100" : "opacity-0")} />
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{location.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{location.count} khách sạn</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Check-in & Check-out */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Nhận phòng - Trả phòng</div>
                        <div className="font-semibold truncate">
                          {hotelCheckIn && hotelCheckOut
                            ? `${format(hotelCheckIn, "dd/MM")} - ${format(hotelCheckOut, "dd/MM")}`
                            : "Chọn ngày"}
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: hotelCheckIn, to: hotelCheckOut }}
                      onSelect={(range) => {
                        setHotelCheckIn(range?.from);
                        setHotelCheckOut(range?.to);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {/* Guests & Rooms */}
                <Popover open={openHotelGuests} onOpenChange={setOpenHotelGuests}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                      <Users className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Khách & Phòng</div>
                        <div className="font-semibold truncate">
                          {hotelGuests + hotelChildren} người · {hotelRooms} phòng
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Người lớn</span>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" onClick={() => setHotelGuests(Math.max(1, hotelGuests - 1))}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{hotelGuests}</span>
                          <Button size="sm" variant="outline" onClick={() => setHotelGuests(hotelGuests + 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Trẻ em</span>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" onClick={() => setHotelChildren(Math.max(0, hotelChildren - 1))}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{hotelChildren}</span>
                          <Button size="sm" variant="outline" onClick={() => setHotelChildren(hotelChildren + 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Số phòng</span>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" onClick={() => setHotelRooms(Math.max(1, hotelRooms - 1))}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{hotelRooms}</span>
                          <Button size="sm" variant="outline" onClick={() => setHotelRooms(hotelRooms + 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <div className="flex items-center justify-center p-4">
                  <Button onClick={handleHotelSearch} className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12 w-12 rounded-full p-0 shadow-lg shadow-blue-500/30 border-2 border-yellow-400">
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Car Rental Form */}
        {activeService === "car-rental" && (
          <div className="space-y-4 relative z-10">
            {/* Sub-tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setCarDriverType("without")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all border-2",
                  carDriverType === "without"
                    ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent"
                )}
              >
                Tự lái
              </button>
              <button
                onClick={() => setCarDriverType("with")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all border-2",
                  carDriverType === "with"
                    ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent"
                )}
              >
                Có tài xế
              </button>
            </div>

            {/* Unified Search Bar */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors">
              <div className="grid md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_auto] divide-x divide-gray-200">
                {/* Location */}
                <div className="flex items-center gap-3 p-4">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">Địa điểm thuê xe</div>
                    <Input
                      value={carLocation}
                      onChange={(e) => setCarLocation(e.target.value)}
                      placeholder="Nhập địa điểm..."
                      className="border-0 p-0 h-6 focus-visible:ring-0 font-semibold"
                    />
                  </div>
                </div>

                {/* Start Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Ngày nhận</div>
                        <div className="font-semibold text-sm truncate">
                          {carStartDate ? format(carStartDate, "dd/MM/yyyy") : "Chọn ngày"}
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={carStartDate} onSelect={setCarStartDate} />
                  </PopoverContent>
                </Popover>

                {/* Start Time */}
                <Popover open={openCarStartTime} onOpenChange={setOpenCarStartTime}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors">
                      <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Giờ nhận</div>
                        <div className="font-semibold text-sm">{carStartTime}</div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setCarStartTime(time);
                            setOpenCarStartTime(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm",
                            carStartTime === time ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Ngày trả</div>
                        <div className="font-semibold text-sm truncate">
                          {carEndDate ? format(carEndDate, "dd/MM/yyyy") : "Chọn ngày"}
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={carEndDate} onSelect={setCarEndDate} />
                  </PopoverContent>
                </Popover>

                {/* End Time */}
                <Popover open={openCarEndTime} onOpenChange={setOpenCarEndTime}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors">
                      <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Giờ trả</div>
                        <div className="font-semibold text-sm">{carEndTime}</div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setCarEndTime(time);
                            setOpenCarEndTime(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm",
                            carEndTime === time ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <div className="flex items-center justify-center p-4">
                  <Button onClick={handleCarSearch} className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12 w-12 rounded-full p-0 shadow-lg shadow-blue-500/30 border-2 border-yellow-400">
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Form */}
        {activeService === "activities" && (
          <div className="space-y-4 relative z-10">
            {/* Unified Search Bar */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors">
              <div className="grid md:grid-cols-[2fr_1.5fr_1.5fr_auto] divide-x divide-gray-200">
                {/* Location/Activity */}
                <div className="flex items-center gap-3 p-4">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">Địa điểm</div>
                    <Input
                      value={activityLocation}
                      onChange={(e) => setActivityLocation(e.target.value)}
                      placeholder="Chọn địa điểm..."
                      className="border-0 p-0 h-6 focus-visible:ring-0 font-semibold"
                    />
                  </div>
                </div>

                {/* Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Ngày tham gia</div>
                        <div className="font-semibold">
                          {activityDate ? format(activityDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={activityDate} onSelect={setActivityDate} />
                  </PopoverContent>
                </Popover>

                {/* Guests */}
                <Popover open={openActivityGuests} onOpenChange={setOpenActivityGuests}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Số người</div>
                        <div className="font-semibold truncate">
                          {activityAdults + activityChildren} người
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Người lớn</p>
                          <p className="text-sm text-gray-500">Từ 12 tuổi</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" onClick={() => setActivityAdults(Math.max(1, activityAdults - 1))} disabled={activityAdults <= 1}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{activityAdults}</span>
                          <Button size="sm" variant="outline" onClick={() => setActivityAdults(activityAdults + 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Trẻ em</p>
                          <p className="text-sm text-gray-500">2-11 tuổi</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" onClick={() => setActivityChildren(Math.max(0, activityChildren - 1))} disabled={activityChildren <= 0}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{activityChildren}</span>
                          <Button size="sm" variant="outline" onClick={() => setActivityChildren(activityChildren + 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <div className="flex items-center justify-center p-4">
                  <Button onClick={handleActivitySearch} className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12 w-12 rounded-full p-0 shadow-lg shadow-blue-500/30 border-2 border-yellow-400">
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}