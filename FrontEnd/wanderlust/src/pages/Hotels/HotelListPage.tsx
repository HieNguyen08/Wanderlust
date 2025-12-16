import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, ChevronDown, Hotel, Minus, Plus, Repeat, Search, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
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
import { PaginationUI } from "../../components/ui/PaginationUI";
import { useSmartPagination } from "../../hooks/useSmartPagination";
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
    city?: string;
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
  const location = useLocation();
  const params = useMemo(
    () => searchParams ?? ((location.state as any) || {}),
    [searchParams, location.state]
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  // Filter state
  const [activeFilters, setActiveFilters] = useState<any>({
    priceRange: [0, 50000000],
    freeCancellation: false, // Not fully supported by backend yet
    amenities: [],
    propertyTypes: [],
    ratings: []
  });

  // Search form states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(
    params?.guests?.adults ?? params?.bookingInfo?.guests?.adults ?? 2
  );
  const [children, setChildren] = useState(
    params?.guests?.children ?? params?.bookingInfo?.guests?.children ?? 0
  );
  const [rooms, setRooms] = useState(
    params?.guests?.rooms ?? params?.bookingInfo?.guests?.rooms ?? 1
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

        // Set initial destination from resolved params
        if (params?.destinationId) {
          const foundDestById = mappedLocations.find(d => d.id === params.destinationId);
          if (foundDestById) {
            setDestination(foundDestById);
          }
        } else if (params?.destination) {
          const foundDest = mappedLocations.find(d =>
            d.name.toLowerCase() === params.destination?.toLowerCase()
          );
          if (foundDest) {
            setDestination(foundDest);
          } else if (params?.city) {
            setDestination({ code: "CUSTOM", name: params.city, country: "Việt Nam" });
          }
        } else if (params?.city) {
          setDestination({ code: "CUSTOM", name: params.city, country: "Việt Nam" });
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, [params?.city, params?.destination, params?.destinationId]);

  // Initialize dates from resolved params (props or navigation state)
  useEffect(() => {
    const initialCheckIn = params?.checkIn || params?.bookingInfo?.checkIn || undefined;
    const initialCheckOut = params?.checkOut || params?.bookingInfo?.checkOut || undefined;

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
  }, [params]);

  // useSmartPagination Hook
  const fetchData = useCallback(async (page: number, size: number) => {
    // Prepare search params from form/url state
    const apiParams: any = {};

    // 1. Location
    if (destination?.id) {
      apiParams.locationId = destination.id; // Backend expects string logic? searchHotels param is 'location'
      // api.ts uses 'location' param. If I pass locationId, does backend handle it?
      // HotelService logic: "hotels = hotelRepository.searchBasic(criteria.getLocation());"
      // It searches by keyword. If I pass ID, it might fail if ID is UUID.
      // But HotelController has getHotelsByLocation(id).
      // SearchHotels takes criteria. criteria.location.
      // If I want to search by ID in searchHotels, I should check if backend supports it.
      // Current HotelService searches by keyword.
      // But if I pass city name it works.
      apiParams.location = destination.name;
    } else if (params?.destination) {
      apiParams.location = params.destination;
    } else if (params?.city) {
      apiParams.location = params.city;
    }

    // 2. Dates
    if (checkIn) apiParams.checkInDate = format(checkIn, "yyyy-MM-dd");
    if (checkOut) apiParams.checkOutDate = format(checkOut, "yyyy-MM-dd");

    // 3. Guests
    const totalGuests = adults + children;
    apiParams.guests = totalGuests;

    // 4. Filters from Sidebar
    if (activeFilters.priceRange) {
      apiParams.minPrice = activeFilters.priceRange[0];
      apiParams.maxPrice = activeFilters.priceRange[1];
    }
    if (activeFilters.amenities && activeFilters.amenities.length > 0) {
      apiParams.amenities = activeFilters.amenities;
    }
    if (activeFilters.propertyTypes && activeFilters.propertyTypes.length > 0) {
      apiParams.hotelTypes = activeFilters.propertyTypes;
    }
    if (activeFilters.ratings && activeFilters.ratings.length > 0) {
      // Map ratings array (strings) to minStar?
      // E.g. ["4", "5"] -> minStar = 4?
      const stars = activeFilters.ratings.map((r: string) => parseInt(r)).filter((n: number) => !isNaN(n));
      if (stars.length > 0) {
        apiParams.minStar = Math.min(...stars);
      }
    }

    // Sort? Backend doesn't support sort param yet. We sort client-side on current page.

    try {
      const results = await hotelApi.searchHotels({
        ...apiParams,
        page,
        size
      });

      // Map backend HotelDTO to frontend Hotel interface
      const mappedHotels: Hotel[] = (results.content || []).map((hotel: any) => ({
        id: hotel.hotelID || hotel.id,
        name: hotel.name,
        rating: hotel.starRating || hotel.averageRating || 0,
        address: hotel.address,
        image: hotel.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        price: hotel.lowestPrice || 0,
        originalPrice: hotel.originalPrice || undefined,
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

      return {
        data: mappedHotels,
        totalItems: results.totalElements || 0
      };
    } catch (e) {
      console.error("Error searching hotels", e);
      return { data: [], totalItems: 0 };
    }
  }, [destination, params, checkIn, checkOut, adults, children, activeFilters]);

  const {
    currentItems: hotels, // We map this to 'hotels' variable used in render
    totalPages,
    currentPage,
    goToPage,
    isLoading
  } = useSmartPagination({
    fetchData,
    pageSize: 9,
    preloadRange: 1
  });

  // Client-side sorting for current page
  const filteredAndSortedHotels = useMemo(() => {
    let sorted = [...hotels];
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
    }
    return sorted;
  }, [hotels, sortBy]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    // useSmartPagination will automatically refetch when activeFilters (dependency) changes?
    // Wait, useSmartPagination doesn't auto-refetch on dep change unless I force it.
    // The hook in 'useSmartPagination' relies on 'fetchData' identity change if included in deps?
    // Checking hook: useEffect calls `loadPage(currentPage)` when `currentPage` changes.
    // DOES IT REACT TO FETCHDATA CHANGE?
    // "useEffect(() => { loadPage(currentPage); ... }, [loadPage, currentPage, ...])"
    // Yes. loadPage depends on fetchData. So if fetchData changes (deps change), loadPage changes.
    // Ideally we should reset to page 0 when filters change.
    // The hook internally doesn't reset page to 0.
    // We might need to manually call goToPage(0) if filters change.
    // For now let's reliance on the update flow.
  };

  // Reset page when filters change
  useEffect(() => {
    goToPage(0);
  }, [activeFilters, destination, checkIn, checkOut, adults, children]);

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
                            {params?.city || params?.destination || t('hotels.defaultLocation')}
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
                            : params?.checkIn || "Chọn ngày"}
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
                            : params?.checkOut || "Chọn ngày"}
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
                    city: destination.name,
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
            totalResults={filteredAndSortedHotels.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            destination={destination
              ? `${destination.name}, ${destination.country}`
              : params?.city
                ? params.city
                : params?.destination || filteredAndSortedHotels[0]?.city || hotels[0]?.city || "Tất cả địa điểm"}
          />

          {/* Hotel Cards */}
          <div className="p-4 lg:p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-4">{t('hotels.loadingHotels')}</p>
              </div>
            ) : filteredAndSortedHotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {t('hotels.noHotelsFound')}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedHotels.map((hotel) => (
                  <HotelCardGrid
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedHotels.map((hotel) => (
                  <HotelCardList
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-8 flex justify-center">
              <PaginationUI
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
