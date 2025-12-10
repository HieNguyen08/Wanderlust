import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    ArrowRightLeft,
    Calendar as CalendarIcon,
    Car,
    Check,
    ChevronsUpDown,
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
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../MainApp";
import { flightApi } from "../utils/api";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "./ui/utils";
import { SearchLoadingOverlay } from "./SearchLoadingOverlay";

interface HeroSearchHubProps {
    onNavigate: (page: PageType, data?: any) => void;
    onSearch?: (data: any) => void;
}

type ServiceType = "flights" | "hotels" | "car-rental" | "activities";
type TripType = "one-way" | "round-trip" | "multi-city";
type CarDriverType = "without" | "with";

const airports = [
    { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất", country: "Việt Nam" },
    { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài", country: "Việt Nam" },
    { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng", country: "Việt Nam" },
    { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh", country: "Việt Nam" },
    { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc", country: "Việt Nam" },
];

export function HeroSearchHub({ onNavigate, onSearch }: HeroSearchHubProps) {
    const { t } = useTranslation();
    const [activeService, setActiveService] = useState<ServiceType>("flights");

    // Flight states
    const [tripType, setTripType] = useState<TripType>("round-trip");
    const [fromAirport, setFromAirport] = useState<typeof airports[0] | null>(null);
    const [toAirport, setToAirport] = useState<typeof airports[0] | null>(null);
    const [flightDepartDate, setFlightDepartDate] = useState<Date>();
    const [flightReturnDate, setFlightReturnDate] = useState<Date>();
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [cabinClass, setCabinClass] = useState<"economy" | "business" | "first">("economy");
    const [isSearching, setIsSearching] = useState(false);
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [openPassengers, setOpenPassengers] = useState(false);
    const [openFlightDates, setOpenFlightDates] = useState(false);

    // Hotel states
    const [hotelLocation, setHotelLocation] = useState("");
    const [hotelCheckIn, setHotelCheckIn] = useState<Date>();
    const [hotelCheckOut, setHotelCheckOut] = useState<Date>();
    const [hotelGuests, setHotelGuests] = useState(2);
    const [hotelChildren, setHotelChildren] = useState(0);
    const [hotelRooms, setHotelRooms] = useState(1);
    const [openHotelLocation, setOpenHotelLocation] = useState(false);
    const [openHotelGuests, setOpenHotelGuests] = useState(false);

    // Car Rental states
    const [carLocation, setCarLocation] = useState("");
    const [carStartDate, setCarStartDate] = useState<Date>();
    const [carEndDate, setCarEndDate] = useState<Date>();
    const [carDriverType, setCarDriverType] = useState<CarDriverType>("without");

    // Activity states
    const [activityLocation, setActivityLocation] = useState("");
    const [activityDate, setActivityDate] = useState<Date>();
    const [activityAdults, setActivityAdults] = useState(1);
    const [activityChildren, setActivityChildren] = useState(0);
    const [openActivityGuests, setOpenActivityGuests] = useState(false);

    const serviceTabs = [
        { id: "flights", label: t("searchHub.flights"), icon: Plane },
        { id: "hotels", label: t("searchHub.hotels"), icon: Hotel },
        { id: "car-rental", label: t("searchHub.carRental"), icon: Car },
        { id: "activities", label: t("searchHub.activities"), icon: PartyPopper },
    ] as const;

    const handleSwapAirports = () => {
        const temp = fromAirport;
        setFromAirport(toAirport);
        setToAirport(temp);
    };

    const handleFlightSearch = async () => {
        if (!fromAirport) { toast.error(t("searchHub.pleaseSelectDeparture")); return; }
        if (!toAirport) { toast.error(t("searchHub.pleaseSelectDestination")); return; }
        if (fromAirport.code === toAirport.code) { toast.error(t("searchHub.sameLocation")); return; }
        if (!flightDepartDate) { toast.error(t("searchHub.pleaseSelectDepartureDate")); return; }
        if (tripType === "round-trip" && !flightReturnDate) { toast.error(t("searchHub.pleaseSelectReturnDate")); return; }
        if (tripType === "round-trip" && flightReturnDate && flightReturnDate < flightDepartDate) { toast.error(t("searchHub.returnBeforeDeparture")); return; }

        try {
            setIsSearching(true);
            const formattedDate = format(flightDepartDate, "yyyy-MM-dd");
            const outboundFlights = await flightApi.searchFlights({
                from: fromAirport.code,
                to: toAirport.code,
                date: formattedDate,
                directOnly: false
            });

            let returnFlights = [];
            if (tripType === "round-trip" && flightReturnDate) {
                const formattedReturnDate = format(flightReturnDate, "yyyy-MM-dd");
                returnFlights = await flightApi.searchFlights({
                    from: toAirport.code,
                    to: fromAirport.code,
                    date: formattedReturnDate,
                    directOnly: false
                });
            }

            const searchData = {
                tripType,
                from: fromAirport,
                to: toAirport,
                departDate: flightDepartDate,
                returnDate: flightReturnDate,
                passengers: { adults, children, infants, total: adults + children + infants },
                cabinClass,
                outboundFlights,
                returnFlights
            };
            onSearch?.(searchData);
            onNavigate("search", searchData);
        } catch (error: any) {
            console.error("Error searching flights:", error);
            toast.error(t("searchHub.searchError"));
        } finally {
            setIsSearching(false);
        }
    };

    const handleHotelSearch = () => {
        const searchData = {
            type: "hotel",
            location: hotelLocation,
            checkIn: hotelCheckIn,
            checkOut: hotelCheckOut,
            guests: { adults: hotelGuests, children: hotelChildren, rooms: hotelRooms },
        };
        onSearch?.(searchData);
        onNavigate("hotel-list", searchData);
    };

    const handleCarSearch = () => {
        const searchData = {
            type: "car",
            location: carLocation,
            startDate: carStartDate,
            endDate: carEndDate,
            driverType: carDriverType,
        };
        onSearch?.(searchData);
        onNavigate("car-list", searchData);
    };

    const handleActivitySearch = () => {
        const searchData = {
            type: "activity",
            location: activityLocation,
            date: activityDate,
            guests: { adults: activityAdults, children: activityChildren },
        };
        onSearch?.(searchData);
        onNavigate("activities", searchData);
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto -mt-24 relative z-20 px-4">
            <SearchLoadingOverlay isLoading={isSearching} searchType="flight" message={t("searchHub.searching")} />
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                {/* Service Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
                    {serviceTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeService === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveService(tab.id as ServiceType)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Flights Form */}
                {activeService === "flights" && (
                    <div className="space-y-4 relative z-10">
                        <div className="flex gap-2">
                            <button onClick={() => setTripType("round-trip")} className={cn("px-4 py-2 rounded-lg text-sm transition-all border-2", tripType === "round-trip" ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent")}>{t("searchHub.roundTrip")}</button>
                            <button onClick={() => setTripType("one-way")} className={cn("px-4 py-2 rounded-lg text-sm transition-all border-2", tripType === "one-way" ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent")}>{t("searchHub.oneWay")}</button>
                            <button onClick={() => setTripType("multi-city")} className={cn("px-4 py-2 rounded-lg text-sm transition-all border-2", tripType === "multi-city" ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent")}>{t("searchHub.multiCity")}</button>
                        </div>
                        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                            <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                                        <PlaneTakeoff className="w-5 h-5 text-blue-600" />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500">{t("searchHub.departure")}</div>
                                            <div className="font-semibold">{fromAirport ? `${fromAirport.city} (${fromAirport.code})` : t("searchHub.selectAirport")}</div>
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={t("searchHub.searchAirport")} />
                                        <CommandList>
                                            <CommandEmpty>{t("searchHub.noAirportFound")}</CommandEmpty>
                                            <CommandGroup>
                                                {airports.map((airport) => (
                                                    <CommandItem key={airport.code} value={`${airport.city} ${airport.code}`} onSelect={() => { setFromAirport(airport); setOpenFrom(false); }}>
                                                        <Check className={cn("mr-2 h-4 w-4", fromAirport?.code === airport.code ? "opacity-100" : "opacity-0")} />
                                                        <div><div className="font-semibold">{airport.city} ({airport.code})</div><div className="text-xs text-gray-500">{airport.name}</div></div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <button onClick={handleSwapAirports} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"><ArrowRightLeft className="w-5 h-5 text-blue-600" /></button>
                            <Popover open={openTo} onOpenChange={setOpenTo}>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                                        <PlaneLanding className="w-5 h-5 text-blue-600" />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500">{t("searchHub.destination")}</div>
                                            <div className="font-semibold">{toAirport ? `${toAirport.city} (${toAirport.code})` : t("searchHub.selectAirport")}</div>
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={t("searchHub.searchAirport")} />
                                        <CommandList>
                                            <CommandEmpty>{t("searchHub.noAirportFound")}</CommandEmpty>
                                            <CommandGroup>
                                                {airports.map((airport) => (
                                                    <CommandItem key={airport.code} value={`${airport.city} ${airport.code}`} onSelect={() => { setToAirport(airport); setOpenTo(false); }}>
                                                        <Check className={cn("mr-2 h-4 w-4", toAirport?.code === airport.code ? "opacity-100" : "opacity-0")} />
                                                        <div><div className="font-semibold">{airport.city} ({airport.code})</div><div className="text-xs text-gray-500">{airport.name}</div></div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <Popover open={openFlightDates} onOpenChange={setOpenFlightDates}>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500">{tripType === "one-way" ? t("searchHub.departureDate") : `${t("searchHub.departureDate")} - ${t("searchHub.returnDate")}`}</div>
                                            <div className="font-semibold">
                                                {tripType === "one-way" ? (flightDepartDate ? format(flightDepartDate, "dd/MM/yyyy", { locale: vi }) : t("searchHub.selectDate")) : (flightDepartDate && flightReturnDate ? `${format(flightDepartDate, "dd/MM", { locale: vi })} - ${format(flightReturnDate, "dd/MM/yyyy", { locale: vi })}` : flightDepartDate ? format(flightDepartDate, "dd/MM/yyyy", { locale: vi }) : t("searchHub.selectDate"))}
                                            </div>
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    {tripType === "one-way" ? (
                                        <Calendar mode="single" selected={flightDepartDate} onSelect={setFlightDepartDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                                    ) : (
                                        <Calendar mode="range" selected={{ from: flightDepartDate, to: flightReturnDate }} onSelect={(range) => { setFlightDepartDate(range?.from); setFlightReturnDate(range?.to); }} numberOfMonths={2} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                                    )}
                                </PopoverContent>
                            </Popover>
                            <Popover open={openPassengers} onOpenChange={setOpenPassengers}>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500">{t("searchHub.passengersAndClass")}</div>
                                            <div className="font-semibold">{adults + children + infants} {t("searchHub.passengers")} · {cabinClass === "economy" ? t("searchHub.economy") : cabinClass === "business" ? t("searchHub.business") : t("searchHub.firstClass")}</div>
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80" align="start">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between"><span>{t("searchHub.adults")}</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" onClick={() => setAdults(Math.max(1, adults - 1))}><Minus className="w-4 h-4" /></Button><span className="w-8 text-center">{adults}</span><Button size="sm" variant="outline" onClick={() => setAdults(adults + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                        <div className="flex items-center justify-between"><span>{t("searchHub.children")}</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" onClick={() => setChildren(Math.max(0, children - 1))}><Minus className="w-4 h-4" /></Button><span className="w-8 text-center">{children}</span><Button size="sm" variant="outline" onClick={() => setChildren(children + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                        <div className="flex items-center justify-between"><span>{t("searchHub.infants")}</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" onClick={() => setInfants(Math.max(0, infants - 1))}><Minus className="w-4 h-4" /></Button><span className="w-8 text-center">{infants}</span><Button size="sm" variant="outline" onClick={() => setInfants(infants + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                        <div className="pt-4 border-t"><div className="text-sm mb-2">{t("searchHub.cabinClass")}</div><div className="space-y-2">{[{ value: "economy", label: t("searchHub.economy") }, { value: "business", label: t("searchHub.business") }, { value: "first", label: t("searchHub.firstClass") }].map((option) => (<button key={option.value} onClick={() => setCabinClass(option.value as any)} className={cn("w-full text-left px-3 py-2 rounded-lg transition-colors", cabinClass === option.value ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100")}>{option.label}</button>))}</div></div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleFlightSearch} className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-14 text-lg shadow-lg shadow-blue-500/30 border-2 border-yellow-400"><Search className="w-5 h-5 mr-2" />{t("searchHub.searchFlights")}</Button>
                    </div>
                )}

                {/* Hotels Form */}
                {activeService === "hotels" && (
                    <div className="space-y-4 relative z-10">
                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors">
                            <div className="grid md:grid-cols-[2fr_2fr_2fr_auto] divide-x divide-gray-200">
                                <Popover open={openHotelLocation} onOpenChange={setOpenHotelLocation}>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                                            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0"><div className="text-xs text-gray-500">{t("searchHub.location")}</div><div className="font-semibold truncate">{hotelLocation || t("searchHub.selectLocation")}</div></div>
                                            <ChevronsUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder={t("searchHub.searchLocation")} />
                                            <CommandList>
                                                <CommandEmpty>{t("searchHub.noLocationFound")}</CommandEmpty>
                                                <CommandGroup>
                                                    {[{ code: "HCM", name: "TP. Hồ Chí Minh", count: 450 }, { code: "HN", name: "Hà Nội", count: 380 }, { code: "DN", name: "Đà Nẵng", count: 220 }, { code: "NT", name: "Nha Trang", count: 180 }, { code: "PQ", name: "Phú Quốc", count: 165 }, { code: "HA", name: "Hội An", count: 140 }, { code: "VT", name: "Vũng Tàu", count: 125 }, { code: "DL", name: "Đà Lạt", count: 155 }].map((location) => (
                                                        <CommandItem key={location.code} value={location.name} onSelect={() => { setHotelLocation(location.name); setOpenHotelLocation(false); }}>
                                                            <Check className={cn("mr-2 h-4 w-4", hotelLocation === location.name ? "opacity-100" : "opacity-0")} />
                                                            <div className="flex items-center justify-between w-full"><div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>{location.name}</span></div><span className="text-xs text-gray-500">{t("searchHub.hotelsCount", { count: location.count })}</span></div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                                            <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                                            <div className="flex-1 min-w-0"><div className="text-xs text-gray-500">{t("searchHub.checkInCheckOut")}</div><div className="font-semibold truncate">{hotelCheckIn && hotelCheckOut ? `${format(hotelCheckIn, "dd/MM")} - ${format(hotelCheckOut, "dd/MM")}` : t("searchHub.selectDate")}</div></div>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="range" selected={{ from: hotelCheckIn, to: hotelCheckOut }} onSelect={(range) => { setHotelCheckIn(range?.from); setHotelCheckOut(range?.to); }} numberOfMonths={2} /></PopoverContent>
                                </Popover>
                                <Popover open={openHotelGuests} onOpenChange={setOpenHotelGuests}>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                                            <Users className="w-5 h-5 text-blue-600 shrink-0" />
                                            <div className="flex-1 min-w-0"><div className="text-xs text-gray-500">{t("searchHub.guestsAndRooms")}</div><div className="font-semibold truncate">{hotelGuests + hotelChildren} {t("searchHub.passengers")} · {hotelRooms} {t("searchHub.rooms")}</div></div>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80" align="start">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between"><span>{t("searchHub.adults")}</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" onClick={() => setHotelGuests(Math.max(1, hotelGuests - 1))}><Minus className="w-4 h-4" /></Button><span className="w-8 text-center">{hotelGuests}</span><Button size="sm" variant="outline" onClick={() => setHotelGuests(hotelGuests + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                            <div className="flex items-center justify-between"><span>{t("searchHub.children")}</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" onClick={() => setHotelChildren(Math.max(0, hotelChildren - 1))}><Minus className="w-4 h-4" /></Button><span className="w-8 text-center">{hotelChildren}</span><Button size="sm" variant="outline" onClick={() => setHotelChildren(hotelChildren + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                            <div className="flex items-center justify-between"><span>{t("searchHub.rooms")}</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" onClick={() => setHotelRooms(Math.max(1, hotelRooms - 1))}><Minus className="w-4 h-4" /></Button><span className="w-8 text-center">{hotelRooms}</span><Button size="sm" variant="outline" onClick={() => setHotelRooms(hotelRooms + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <div className="flex items-center justify-center p-4"><Button onClick={handleHotelSearch} className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12 w-12 rounded-full p-0 shadow-lg shadow-blue-500/30 border-2 border-yellow-400"><Search className="w-5 h-5" /></Button></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Car Rental Form */}
                {activeService === "car-rental" && (
                    <div className="space-y-4 relative z-10">
                        <div className="flex gap-2">
                            <button onClick={() => setCarDriverType("without")} className={cn("px-4 py-2 rounded-lg text-sm transition-all border-2", carDriverType === "without" ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent")}>{t("searchHub.selfDrive")}</button>
                            <button onClick={() => setCarDriverType("with")} className={cn("px-4 py-2 rounded-lg text-sm transition-all border-2", carDriverType === "with" ? "bg-blue-100 text-blue-700 border-yellow-400 shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent")}>{t("searchHub.withDriver")}</button>
                        </div>
                        <div className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-2">
                            <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                                <div className="text-xs text-gray-500">{t("searchHub.pickupLocation")}</div>
                                <Input value={carLocation} onChange={(e) => setCarLocation(e.target.value)} placeholder={t("searchHub.enterLocation")} className="border-none p-0 h-6 focus-visible:ring-0 font-semibold" />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild><button className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400"><div className="text-xs text-gray-500">{t("searchHub.pickupDate")}</div><div className="font-semibold">{carStartDate ? format(carStartDate, "dd/MM/yyyy") : t("searchHub.selectDate")}</div></button></PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={carStartDate} onSelect={setCarStartDate} /></PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild><button className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400"><div className="text-xs text-gray-500">{t("searchHub.returnDateCar")}</div><div className="font-semibold">{carEndDate ? format(carEndDate, "dd/MM/yyyy") : t("searchHub.selectDate")}</div></button></PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={carEndDate} onSelect={setCarEndDate} /></PopoverContent>
                            </Popover>
                            <Button onClick={handleCarSearch} className="h-full w-14 bg-blue-600 hover:bg-blue-700"><Search className="w-5 h-5" /></Button>
                        </div>
                    </div>
                )}

                {/* Activities Form */}
                {activeService === "activities" && (
                    <div className="space-y-4 relative z-10">
                        <div className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-2">
                            <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                                <div className="text-xs text-gray-500">{t("searchHub.location")}</div>
                                <Input value={activityLocation} onChange={(e) => setActivityLocation(e.target.value)} placeholder={t("searchHub.enterLocation")} className="border-none p-0 h-6 focus-visible:ring-0 font-semibold" />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild><button className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400"><div className="text-xs text-gray-500">{t("searchHub.date")}</div><div className="font-semibold">{activityDate ? format(activityDate, "dd/MM/yyyy") : t("searchHub.selectDate")}</div></button></PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={activityDate} onSelect={setActivityDate} /></PopoverContent>
                            </Popover>
                            <Popover open={openActivityGuests} onOpenChange={setOpenActivityGuests}>
                                <PopoverTrigger asChild><button className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400"><div className="text-xs text-gray-500">{t("searchHub.numberOfPeople")}</div><div className="font-semibold">{activityAdults + activityChildren} {t("searchHub.passengers")}</div></button></PopoverTrigger>
                                <PopoverContent className="w-80"><div className="space-y-4">
                                    <div className="flex justify-between items-center"><span>{t("searchHub.adults")}</span><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setActivityAdults(Math.max(1, activityAdults - 1))}><Minus className="w-4 h-4" /></Button><span>{activityAdults}</span><Button size="sm" variant="outline" onClick={() => setActivityAdults(activityAdults + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                    <div className="flex justify-between items-center"><span>{t("searchHub.children")}</span><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setActivityChildren(Math.max(0, activityChildren - 1))}><Minus className="w-4 h-4" /></Button><span>{activityChildren}</span><Button size="sm" variant="outline" onClick={() => setActivityChildren(activityChildren + 1)}><Plus className="w-4 h-4" /></Button></div></div>
                                </div></PopoverContent>
                            </Popover>
                            <Button onClick={handleActivitySearch} className="h-full w-14 bg-blue-600 hover:bg-blue-700"><Search className="w-5 h-5" /></Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}