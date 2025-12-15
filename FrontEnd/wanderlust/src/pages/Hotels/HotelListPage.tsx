import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, ChevronDown, Hotel, Minus, Plus, Repeat, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "../../components/Footer";
import { HotelCardGrid } from "../../components/HotelCardGrid";
import { HotelCardList } from "../../components/HotelCardList";
import { HotelFilterSidebar } from "../../components/HotelFilterSidebar";
import { HotelTopBar } from "../../components/HotelTopBar";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

import { format, parse } from "date-fns";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { hotelApi, locationApi } from "../../utils/api";

interface Destination {
  id?: string;
  code: string;
  name: string;
  country: string;
  hotels?: string;
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  address: string;
  image: string;
  price: number;
  originalPrice?: number;
  freeCancellation: boolean;
  tags?: string[];
  roomType?: string;
  bedType?: string;
  breakfast?: boolean;
  amenities?: string[];
  propertyType?: string;
  city?: string;
  country?: string;
  locationId?: string;
  description?: string;
  phone?: string;
  email?: string;
}

interface HotelListPageProps {
  searchParams?: {
    destination?: string;
    destinationId?: string;
    checkIn?: string;
    checkOut?: string;
    bookingInfo?: {
      checkIn?: string | null;
      checkOut?: string | null;
      guests?: {
        adults: number;
        children: number;
        rooms: number;
      };
    };
    guests?: {
      adults: number;
      children: number;
      rooms: number;
    };
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function HotelListPage({
  searchParams,
  onNavigate,
}: HotelListPageProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search form states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(
    searchParams?.guests?.adults ?? searchParams?.bookingInfo?.guests?.adults ?? 2
  );
  const [children, setChildren] = useState(
    searchParams?.guests?.children ?? searchParams?.bookingInfo?.guests?.children ?? 0
  );
  const [rooms, setRooms] = useState(
    searchParams?.guests?.rooms ?? searchParams?.bookingInfo?.guests?.rooms ?? 1
  );

  // Popover states
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  // Fetch locations for search dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationApi.getLocationsByType('CITY');
        const locationsArray = Array.isArray(response) ? response : (response.content || []);
        
        const mappedLocations: Destination[] = locationsArray.map((loc: any) => ({
          id: loc.id,
          code: loc.code || "N/A",
          name: loc.name,
          country: loc.metadata?.country || "Việt Nam", // Mặc định là Việt Nam nếu không có thông tin
          hotels: ""
        }));
        
        if (mappedLocations.length === 0) {
          const fallbackLocations = [
            { code: "SGN", name: "Ho Chi Minh City", country: "Vietnam", hotels: "500+" },
            { code: "HAN", name: "Hanoi", country: "Vietnam", hotels: "450+" },
            { code: "DAD", name: "Da Nang", country: "Vietnam", hotels: "340+" },
            { code: "CAN", name: "Can Tho", country: "Vietnam", hotels: "200+" },
          ];
          setDestinations(fallbackLocations);
        } else {
          setDestinations(mappedLocations);
        }

        // Set initial destination from searchParams
        if (searchParams?.destinationId) {
          const foundDestById = mappedLocations.find(d => d.id === searchParams.destinationId);
          if (foundDestById) {
            setDestination(foundDestById);
          }
        } else if (searchParams?.destination) {
          const foundDest = mappedLocations.find(d =>
            d.name.toLowerCase() === searchParams.destination?.toLowerCase()
          );
          if (foundDest) {
            setDestination(foundDest);
          }
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, [searchParams?.destination]);

  // Initialize dates from searchParams
  useEffect(() => {
    const initialCheckIn = searchParams?.checkIn || searchParams?.bookingInfo?.checkIn || undefined;
    const initialCheckOut = searchParams?.checkOut || searchParams?.bookingInfo?.checkOut || undefined;

    if (initialCheckIn) {
      try {
        const date = parse(initialCheckIn, "dd/MM/yyyy", new Date());
        setCheckIn(date);
      } catch (err) {
        console.error("Invalid checkIn date:", err);
      }
    }
    if (initialCheckOut) {
      try {
        const date = parse(initialCheckOut, "dd/MM/yyyy", new Date());
        setCheckOut(date);
      } catch (err) {
        console.error("Invalid checkOut date:", err);
      }
    }
  }, [searchParams]);

  // Fetch hotels from backend when component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);

        // Prepare search params
        const apiParams: any = {};

        // Map destination to location
        if (searchParams?.destinationId) {
          apiParams.locationId = searchParams.destinationId;
        } else if (searchParams?.destination) {
          apiParams.location = searchParams.destination;
        }

        // Map check-in/check-out dates (convert from dd/MM/yyyy to yyyy-MM-dd)
        const checkInParam = searchParams?.checkIn || searchParams?.bookingInfo?.checkIn;
        if (checkInParam) {
          try {
            const checkInDate = parse(checkInParam, "dd/MM/yyyy", new Date());
            apiParams.checkInDate = format(checkInDate, "yyyy-MM-dd");
          } catch (err) {
            console.error("Invalid checkIn date format:", checkInParam);
          }
        }

        const checkOutParam = searchParams?.checkOut || searchParams?.bookingInfo?.checkOut;
        if (checkOutParam) {
          try {
            const checkOutDate = parse(checkOutParam, "dd/MM/yyyy", new Date());
            apiParams.checkOutDate = format(checkOutDate, "yyyy-MM-dd");
          } catch (err) {
            console.error("Invalid checkOut date format:", checkOutParam);
          }
        }

        // Map guests (adults + children)
        const guestParams = searchParams?.guests || searchParams?.bookingInfo?.guests;
        if (guestParams) {
          const totalGuests = guestParams.adults + guestParams.children;
          apiParams.guests = totalGuests;
        }

        console.log("🔍 Fetching hotels with params:", apiParams);
        const hotelsData = await hotelApi.searchHotels(apiParams);

        console.log("✅ Fetched hotels:", hotelsData);

        // Map backend HotelDTO to frontend Hotel interface
        let mappedHotels: Hotel[] = hotelsData.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          rating: hotel.starRating || hotel.averageRating || 0,
          address: hotel.address,
          image: hotel.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          price: hotel.lowestPrice || 0,
          freeCancellation: hotel.policies?.cancellation !== "NO_REFUND",
          amenities: hotel.amenities || [],
          propertyType: hotel.hotelType || "HOTEL",
          tags: [],
          breakfast: hotel.amenities?.includes("Bữa sáng miễn phí"),
          city: hotel.city,
          country: hotel.country,
          locationId: hotel.locationId,
          description: hotel.description,
          phone: hotel.phone,
          email: hotel.email,
        }));

        // Ensure client-side filtering by locationId or city when provided
        if (searchParams?.destinationId) {
          mappedHotels = mappedHotels.filter((hotel) => hotel.locationId === searchParams.destinationId);
        } else if (searchParams?.destination) {
          const destLower = searchParams.destination.toLowerCase();
          mappedHotels = mappedHotels.filter((hotel) => hotel.city?.toLowerCase() === destLower);
        }

        setHotels(mappedHotels);
        setFilteredHotels(mappedHotels);
      } catch (error: any) {
        console.error("❌ Error fetching hotels:", error);
        toast.error(t('hotels.errorLoadingHotels'));
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  // Apply filters
  const handleFilterChange = (filters: any) => {
    let filtered = [...hotels];

    // Price range
    filtered = filtered.filter(
      (hotel) =>
        hotel.price >= filters.priceRange[0] &&
        hotel.price <= filters.priceRange[1]
    );

    // Free cancellation
    if (filters.freeCancellation) {
      filtered = filtered.filter((hotel) => hotel.freeCancellation);
    }

    // Amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.amenities.every((amenity: string) =>
          hotel.amenities?.includes(amenity)
        )
      );
    }

    // Property types
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.propertyTypes.includes(hotel.propertyType || "")
      );
    }

    // Ratings
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.ratings.includes(hotel.rating.toString())
      );
    }

    setFilteredHotels(filtered);
  };

  // Apply sorting
  useEffect(() => {
    let sorted = [...filteredHotels];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        // Keep original order
        break;
    }

    setFilteredHotels(sorted);
  }, [sortBy]);

  const handleHotelSelect = (hotel: Hotel) => {
    onNavigate("hotel-detail", hotel);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Hero Section with Search Bar */}
      <div className="relative w-full bg-linear-to-r from-blue-600 to-blue-700">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Search Bar */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 pb-8 pt-8">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('hotels.searchHotels')}</h2>

            <div className="space-y-4">
              {/* Location */}
              <div>
                <Popover open={destinationOpen} onOpenChange={setDestinationOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <div className="bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                      <Hotel className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block">{t('hotels.locationPlaceholder')}</label>
                        {destination ? (
                          <div className="text-sm font-semibold text-gray-800">
                            {destination.name}, {destination.country}
                          </div>
                        ) : (
                          <div className="text-sm font-semibold text-gray-400">
                            {searchParams?.destination || t('hotels.defaultLocation')}
                          </div>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t('hotels.searchLocationPlaceholder')} />
                      <CommandList>
                        <CommandEmpty>{t('hotels.noLocationFound')}</CommandEmpty>
                        <CommandGroup>
                          {destinations.map((dest: Destination) => (
                            <CommandItem
                              key={dest.code}
                              value={dest.name}
                              onSelect={() => {
                                setDestination(dest);
                                setDestinationOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${destination?.code === dest.code ? "opacity-100" : "opacity-0"}`}
                              />
                              <div className="flex flex-col">
                                <span>{dest.name}, {dest.country}</span>
                                {dest.hotels && <span className="text-xs text-gray-500">{dest.hotels} {t('hotels.hotelsCount')}</span>}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2">
                {/* Check-in */}
                <Popover open={checkInOpen} onOpenChange={setCheckInOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <div className="bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block">{t('hotels.checkInLabel')}</label>
                        <span className="text-sm font-semibold text-gray-800">
                          {checkIn
                            ? format(checkIn, "d 'tháng' M, EEEE", { locale: vi })
                            : searchParams?.checkIn || "Chọn ngày"}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        setCheckIn(date);
                        setCheckInOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                {/* Swap Icon */}
                <div className="flex items-center justify-center">
                  <div className="bg-white border border-gray-300 rounded-lg p-2 size-10 flex items-center justify-center">
                    <Repeat className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                {/* Check-out */}
                <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <div className="bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block">{t('hotels.checkOutLabel')}</label>
                        <span className="text-sm font-semibold text-gray-800">
                          {checkOut
                            ? format(checkOut, "d 'tháng' M, EEEE", { locale: vi })
                            : searchParams?.checkOut || "Chọn ngày"}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => {
                        setCheckOut(date);
                        setCheckOutOpen(false);
                      }}
                      disabled={(date) => date < (checkIn || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests & Rooms */}
              <div>
                <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                  <PopoverTrigger asChild>
                    <div className="bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block">{t('hotels.guestsAndRooms')}</label>
                        <span className="text-sm font-semibold text-gray-800">
                          {adults} {t('common.adults')}, {children} {t('common.children')}, {rooms} {t('common.rooms')}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px]" align="start">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t('common.adults')}</div>
                          <div className="text-xs text-gray-500">{t('hotels.adultsDesc')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.min(10, adults + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t('common.children')}</div>
                          <div className="text-xs text-gray-500">{t('hotels.childrenDesc')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setChildren(Math.min(10, children + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t('common.rooms')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{rooms}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setRooms(Math.min(10, rooms + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => setGuestsOpen(false)}
                      >
                        {t('common.confirm')}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={() => {
                  if (!destination) {
                    toast.error(t('hotels.locationPlaceholder'));
                    return;
                  }
                  if (checkIn && checkOut && checkOut <= checkIn) {
                    toast.error("Ngày trả phòng phải sau ngày nhận phòng");
                    return;
                  }

                  const formattedCheckIn = checkIn ? format(checkIn, "dd/MM/yyyy") : undefined;
                  const formattedCheckOut = checkOut ? format(checkOut, "dd/MM/yyyy") : undefined;

                  // Re-fetch hotels with new search params
                  const newSearchParams = {
                    destination: destination.name,
                    destinationId: destination.id,
                    checkIn: formattedCheckIn,
                    checkOut: formattedCheckOut,
                    guests: { adults, children, rooms },
                    bookingInfo: {
                      checkIn: formattedCheckIn || null,
                      checkOut: formattedCheckOut || null,
                      guests: { adults, children, rooms },
                    },
                  };

                  // Trigger hotel fetch by updating component
                  onNavigate("hotel-list", newSearchParams);
                }}
              >
                <Search className="w-5 h-5 mr-2" />
                {t('common.search')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Filter */}
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <HotelFilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Main Area */}
        <div className="flex-1">
          {/* Top Bar */}
          <HotelTopBar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredHotels.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            destination={destination ? `${destination.name}, ${destination.country}` : (searchParams?.destination || "Tất cả địa điểm")}
          />

          {/* Hotel Cards */}
          <div className="p-4 lg:p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-4">{t('hotels.loadingHotels')}</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {t('hotels.noHotelsFound')}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCardGrid
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <HotelCardList
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
