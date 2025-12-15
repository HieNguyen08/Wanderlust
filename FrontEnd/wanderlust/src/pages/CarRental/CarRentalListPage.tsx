import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, ChevronDown, Fuel, Heart, Settings, Star, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Slider } from "../../components/ui/slider";
import { VoucherCarousel } from "../../components/VoucherCarousel";
import type { PageType } from "../../MainApp";
import { carRentalApi, promotionApi, tokenService, userVoucherApi } from "../../utils/api";

interface CarRentalListPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: any;
  onLogout?: () => void;
  searchParams?: any;
}

interface LocationItem {
  code: string;
  name: string;
  airport?: string;
}

// Danh sách giờ
const timeSlots = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
  "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
];

export default function CarRentalListPage({ onNavigate, userRole, onLogout, searchParams }: CarRentalListPageProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [visibleCars, setVisibleCars] = useState(9);

  // Location and search states
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [pickupLocation, setPickupLocation] = useState<LocationItem | null>(null);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState<string>("09:00");
  const [dropoffLocation, setDropoffLocation] = useState<LocationItem | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [dropoffTime, setDropoffTime] = useState<string>("09:00");
  const [sameLocation, setSameLocation] = useState(true);
  const [withDriver, setWithDriver] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [sortMode, setSortMode] = useState<"trips" | "createdAt">("trips");

  // Vouchers/Promotions
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [savedVouchers, setSavedVouchers] = useState<string[]>([]);

  // Popover states
  const [pickupLocationOpen, setPickupLocationOpen] = useState(false);
  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropoffLocationOpen, setDropoffLocationOpen] = useState(false);
  const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
  const [dropoffTimeOpen, setDropoffTimeOpen] = useState(false);

  // New states for backend integration
  const [allCars, setAllCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for search section
  const searchSectionRef = useRef<HTMLDivElement>(null);
  // Load saved vouchers from backend
  useEffect(() => {
    const loadSavedVouchers = async () => {
      try {
        if (tokenService.isAuthenticated()) {
          const available = await userVoucherApi.getAvailable();
          setSavedVouchers(available.map((v: any) => v.voucherCode));
        }
      } catch (error: any) {
        // Silently fail if not authenticated
        if (error.message !== 'UNAUTHORIZED') {
          console.error('Error loading saved vouchers:', error);
        }
      }
    };

    loadSavedVouchers();
  }, []);

  // Fetch car promotions on mount (filter by CAR or ALL)
  useEffect(() => {
    const fetchCarPromotions = async () => {
      try {
        setLoadingPromotions(true);
        // Fetch all active promotions
        const allPromotions = await promotionApi.getActive();
        
        // Filter by category: CAR or ALL
        const filteredPromotions = allPromotions.filter((promo: any) => {
          const category = promo.category?.toUpperCase();
          return category === 'CAR' || category === 'ALL';
        });
        
        console.log('✅ Filtered car promotions:', filteredPromotions);
        setPromotions(filteredPromotions);
      } catch (error) {
        console.error('Error fetching car promotions:', error);
        toast.error('Không thể tải ưu đãi');
      } finally {
        setLoadingPromotions(false);
      }
    };

    fetchCarPromotions();
  }, []);
  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Fetching cars from backend...");

        const carsData = await carRentalApi.getAllCars();
        console.log("✅ Fetched cars:", carsData);

        // Map backend data to frontend format
        const mappedCars = carsData.map((car: any) => ({
          id: car.id,
          name: `${car.brand} ${car.model}`,
          brand: car.brand,
          model: car.model,
          year: car.year,
          type: car.type, // SPORT, SUV, SEDAN, MPV
          image: car.images?.[0]?.url || "https://images.unsplash.com/photo-1742056024244-02a093dae0b5?w=800",
          gasoline: `${car.fuelType || 'Gasoline'}`,
          transmission: car.transmission, // MANUAL, AUTOMATIC
          capacity: `${car.seats || 5} People`,
          seats: car.seats,
          doors: car.doors,
          luggage: car.luggage,
          color: car.color,
          features: car.features || [],
          price: car.pricePerDay ? parseFloat(car.pricePerDay) : 0,
          pricePerHour: car.pricePerHour ? parseFloat(car.pricePerHour) : 0,
          originalPrice: undefined,
          liked: false,
          rating: car.averageRating || (4.5 + Math.random() * 0.5),
          totalTrips: car.totalTrips || 0,
          city: car.city, // Add city from backend
          createdAt: car.createdAt ? new Date(car.createdAt) : null,
          withDriver: car.withDriver,
          insurance: car.insurance,
          deposit: car.deposit ? parseFloat(car.deposit) : 0,
          minRentalDays: car.minRentalDays,
          deliveryAvailable: car.deliveryAvailable,
        }));

        setAllCars(mappedCars);

        // Build location options from car cities to align with car search by city string
        const uniqueCities = Array.from(new Set(mappedCars.map((c) => c.city).filter(Boolean))).map((city) => ({
          code: city,
          name: city,
          airport: city,
        }));
        setLocations(uniqueCities);
        setLoadingLocations(false);
      } catch (error: any) {
        console.error("❌ Error fetching cars:", error);
        toast.error("Không thể tải danh sách xe. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
        setLoadingLocations(false);
      }
    };

    fetchCars();
  }, []);

  // Apply incoming search params from landing page
  useEffect(() => {
    if (!searchParams) return;

    const city = searchParams.searchData?.pickupLocation || searchParams.pickupLocation;
    if (city) {
      setPickupLocation({ code: city, name: city });
      setDropoffLocation(searchParams.searchData?.dropoffLocation ? { code: searchParams.searchData.dropoffLocation, name: searchParams.searchData.dropoffLocation } : null);
      setSearchCity(city);
    }

    if (searchParams.searchData?.pickupDate) {
      const [day, month, year] = searchParams.searchData.pickupDate.split("/");
      setPickupDate(new Date(Number(year), Number(month) - 1, Number(day)));
    }
    if (searchParams.searchData?.dropoffDate) {
      const [day, month, year] = searchParams.searchData.dropoffDate.split("/");
      setDropoffDate(new Date(Number(year), Number(month) - 1, Number(day)));
    }
    if (searchParams.searchData?.pickupTime) setPickupTime(searchParams.searchData.pickupTime);
    if (searchParams.searchData?.dropoffTime) setDropoffTime(searchParams.searchData.dropoffTime);
    if (typeof searchParams.searchData?.withDriver === "boolean") setWithDriver(searchParams.searchData.withDriver);

    if (searchParams.sortMode === "createdAt" || searchParams.sortMode === "trips") {
      setSortMode(searchParams.sortMode);
    }
  }, [searchParams]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCapacity = (capacity: string) => {
    setSelectedCapacities(prev =>
      prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]
    );
  };

  const swapPickupDropoff = () => {
    const tempLocation = pickupLocation;
    const tempDate = pickupDate;
    const tempTime = pickupTime;

    setPickupLocation(dropoffLocation);
    setPickupDate(dropoffDate);
    setPickupTime(dropoffTime);

    setDropoffLocation(tempLocation);
    setDropoffDate(tempDate);
    setDropoffTime(tempTime);
  };

  // Get unique car types from actual data
  const availableTypes = Array.from(new Set(allCars.map(car => car.type))).sort();

  // Get unique capacity ranges from actual data
  const getCapacityLabel = (seats: number) => {
    if (seats === 2) return "2 Person";
    if (seats >= 4 && seats <= 5) return "4 Person";
    if (seats >= 6 && seats <= 7) return "6 Person";
    if (seats >= 8) return "8 or More";
    return "Other";
  };

  const availableCapacities = Array.from(
    new Set(allCars.map(car => getCapacityLabel(car.seats)).filter(Boolean))
  ).sort((a, b) => {
    const order = ["2 Person", "4 Person", "6 Person", "8 or More"];
    return order.indexOf(a) - order.indexOf(b);
  });

  // Filter cars based on selected criteria
  const filteredCars = allCars.filter(car => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(car.type);

    const locationQuery = (searchCity || pickupLocation?.name || "").trim().toLowerCase();

    // Capacity filter - match based on seat count
    let capacityMatch = selectedCapacities.length === 0;
    if (!capacityMatch && car.seats) {
      capacityMatch = selectedCapacities.some(cap => {
        if (cap === "2 Person") return car.seats === 2;
        if (cap === "4 Person") return car.seats >= 4 && car.seats <= 5;
        if (cap === "6 Person") return car.seats >= 6 && car.seats <= 7;
        if (cap === "8 or More") return car.seats >= 8;
        return false;
      });
    }

    const priceMatch = car.price <= maxPrice;

    // Location filter - match by city string stored on car
    const locationMatch = !locationQuery || (car.city && car.city.toLowerCase().includes(locationQuery));

    return typeMatch && capacityMatch && priceMatch && locationMatch;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortMode === "createdAt") {
      const aDate = a.createdAt ? a.createdAt.getTime() : 0;
      const bDate = b.createdAt ? b.createdAt.getTime() : 0;
      return aDate - bDate; // oldest first
    }
    const tripDiff = (b.totalTrips || 0) - (a.totalTrips || 0);
    if (tripDiff !== 0) return tripDiff;
    const aDate = a.createdAt ? a.createdAt.getTime() : 0;
    const bDate = b.createdAt ? b.createdAt.getTime() : 0;
    return aDate - bDate;
  });

  const displayedCars = sortedCars.slice(0, visibleCars);
  const hasMoreCars = visibleCars < filteredCars.length;

  const handleLoadMore = () => {
    setVisibleCars(prev => Math.min(prev + 6, filteredCars.length));
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedCapacities([]);
    setMaxPrice(100);
  };

  const handleSearch = () => {
    // Validate search inputs
    if (!pickupLocation) {
      toast.error("Vui lòng chọn địa điểm nhận xe");
      return;
    }
    if (!pickupDate) {
      toast.error("Vui lòng chọn ngày nhận xe");
      return;
    }
    if (!dropoffDate) {
      toast.error("Vui lòng chọn ngày trả xe");
      return;
    }

    // Scroll to results or perform search
    toast.success("Đang tìm kiếm xe phù hợp...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header currentPage="car-rental" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        {/* Pick-up / Drop-off Section */}
        <div ref={searchSectionRef}>
          <Card className="p-6 mb-12 shadow-lg border-0">
            <h3 className="text-xl mb-6 text-gray-900">Tìm kiếm xe phù hợp</h3>

            {/* Driver Option */}
            <div className="mb-6 pb-6 border-b">
              <Label className="mb-3 block">With or without driver?</Label>
              <RadioGroup value={withDriver ? "with" : "without"} onValueChange={(value) => setWithDriver(value === "with")}>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="without" id="without-driver" />
                    <Label htmlFor="without-driver" className="cursor-pointer">Without Driver</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="with" id="with-driver" />
                    <Label htmlFor="with-driver" className="cursor-pointer">With Driver</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-6 relative">
              {/* Pick-up */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <h4 className="text-gray-900">Pick - Up</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Pickup Location */}
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Địa điểm</label>
                    <Popover open={pickupLocationOpen} onOpenChange={setPickupLocationOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={pickupLocationOpen}
                          className="w-full justify-between bg-white border-blue-200 hover:bg-white hover:border-blue-300"
                        >
                          {searchCity ? (
                            <span className="truncate">{searchCity}</span>
                          ) : (
                            <span className="text-gray-500">Chọn thành phố</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm thành phố..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy thành phố.</CommandEmpty>
                            <CommandGroup>
                              {loadingLocations ? (
                                <CommandItem disabled>Đang tải...</CommandItem>
                              ) : (
                                locations.map((city) => (
                                  <CommandItem
                                    key={city.code}
                                    value={city.name}
                                    onSelect={() => {
                                      setPickupLocation(city);
                                      setSearchCity(city.name);
                                      if (sameLocation) {
                                        setDropoffLocation(city);
                                      }
                                      setPickupLocationOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${searchCity === city.name ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    <div className="flex flex-col">
                                      <span>{city.name}</span>
                                      <span className="text-xs text-gray-500">{city.airport}</span>
                                    </div>
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Pickup Date */}
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Ngày</label>
                    <Popover open={pickupDateOpen} onOpenChange={setPickupDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left bg-white border-blue-200 hover:bg-white hover:border-blue-300"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? (
                            format(pickupDate, "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span className="text-gray-500">Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={(date) => {
                            setPickupDate(date);
                            setPickupDateOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Pickup Time */}
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Giờ</label>
                    <Popover open={pickupTimeOpen} onOpenChange={setPickupTimeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white border-blue-200 hover:bg-white hover:border-blue-300"
                        >
                          <span>{pickupTime}</span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Tìm giờ..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy.</CommandEmpty>
                            <CommandGroup>
                              {timeSlots.map((time) => (
                                <CommandItem
                                  key={time}
                                  value={time}
                                  onSelect={() => {
                                    setPickupTime(time);
                                    setPickupTimeOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${pickupTime === time ? "opacity-100" : "opacity-0"
                                      }`}
                                  />
                                  {time}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Same Location Checkbox */}
                <div className="flex items-center gap-2 mt-4">
                  <Checkbox
                    id="same-location"
                    checked={sameLocation}
                    onCheckedChange={(checked) => {
                      const value = Boolean(checked);
                      setSameLocation(value);
                      // If keeping the same location, mirror pickup into dropoff
                      if (value && pickupLocation) {
                        setDropoffLocation(pickupLocation);
                      }
                    }}
                  />
                  <label
                    htmlFor="same-location"
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    Trả xe tại cùng địa điểm
                  </label>
                </div>
              </div>

              {/* Swap Button */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                <button
                  onClick={swapPickupDropoff}
                  className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6 text-white rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Drop-off */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <h4 className="text-gray-900">Drop - Off</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Dropoff Location */}
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Địa điểm</label>
                    <Popover open={dropoffLocationOpen} onOpenChange={setDropoffLocationOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={dropoffLocationOpen}
                          disabled={sameLocation}
                          className="w-full justify-between bg-white border-purple-200 hover:bg-white hover:border-purple-300 disabled:opacity-50"
                        >
                          {dropoffLocation ? (
                            <span className="truncate">{dropoffLocation.name}</span>
                          ) : (
                            <span className="text-gray-500">Chọn thành phố</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm thành phố..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy thành phố.</CommandEmpty>
                            <CommandGroup>
                              {loadingLocations ? (
                                <CommandItem disabled>Đang tải...</CommandItem>
                              ) : (
                                locations.map((city) => (
                                  <CommandItem
                                    key={city.code}
                                    value={city.name}
                                    onSelect={() => {
                                      setDropoffLocation(city);
                                      setDropoffLocationOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${dropoffLocation?.code === city.code ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    <div className="flex flex-col">
                                      <span>{city.name}</span>
                                      <span className="text-xs text-gray-500">{city.airport}</span>
                                    </div>
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Dropoff Date */}
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Ngày</label>
                    <Popover open={dropoffDateOpen} onOpenChange={setDropoffDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left bg-white border-purple-200 hover:bg-white hover:border-purple-300"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dropoffDate ? (
                            format(dropoffDate, "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span className="text-gray-500">Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dropoffDate}
                          onSelect={(date) => {
                            setDropoffDate(date);
                            setDropoffDateOpen(false);
                          }}
                          disabled={(date) => date < (pickupDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Dropoff Time */}
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Giờ</label>
                    <Popover open={dropoffTimeOpen} onOpenChange={setDropoffTimeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white border-purple-200 hover:bg-white hover:border-purple-300"
                        >
                          <span>{dropoffTime}</span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Tìm giờ..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy.</CommandEmpty>
                            <CommandGroup>
                              {timeSlots.map((time) => (
                                <CommandItem
                                  key={time}
                                  value={time}
                                  onSelect={() => {
                                    setDropoffTime(time);
                                    setDropoffTimeOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${dropoffTime === time ? "opacity-100" : "opacity-0"
                                      }`}
                                  />
                                  {time}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleSearch}
              >
                Tìm kiếm xe
              </Button>
            </div>
          </Card>
        </div>
        {/* Voucher Carousel Section */}
        {!loadingPromotions && promotions.length > 0 && (
          <section className="mb-12">
            <VoucherCarousel
              vouchers={promotions}
              savedVouchers={savedVouchers}
              onSaveVoucher={async (voucher: any) => {
                try {
                  // Check authentication
                  if (!tokenService.isAuthenticated()) {
                    toast.error('Vui lòng đăng nhập để lưu voucher');
                    onNavigate('login');
                    return;
                  }

                  // Save voucher to wallet
                  await userVoucherApi.saveToWallet(voucher.code);
                  setSavedVouchers([...savedVouchers, voucher.code]);
                  toast.success('Đã lưu voucher vào ví thành công!');
                } catch (error: any) {
                  console.error('Error saving voucher:', error);
                  toast.error(error.message || 'Không thể lưu voucher');
                }
              }}
              onNavigate={onNavigate}
              title="Ưu đãi dành cho bạn"
              subtitle="Tiết kiệm chi phí thuê xe với các mã giảm giá hấp dẫn"
            />
          </section>
        )}
        {/* Results Section */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-900">Bộ lọc</h3>
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  Reset
                </Button>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm text-gray-700">Loại xe</h4>
                <div className="space-y-2">
                  {availableTypes.length === 0 ? (
                    <p className="text-xs text-gray-500">Đang tải...</p>
                  ) : (
                    availableTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <label htmlFor={type} className="ml-2 text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Capacity Filter */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm text-gray-700">Sức chứa</h4>
                <div className="space-y-2">
                  {availableCapacities.length === 0 ? (
                    <p className="text-xs text-gray-500">Đang tải...</p>
                  ) : (
                    availableCapacities.map((capacity) => (
                      <div key={capacity} className="flex items-center">
                        <Checkbox
                          id={capacity}
                          checked={selectedCapacities.includes(capacity)}
                          onCheckedChange={() => toggleCapacity(capacity)}
                        />
                        <label htmlFor={capacity} className="ml-2 text-sm cursor-pointer">
                          {capacity}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="mb-3 text-sm text-gray-700">Giá tối đa</h4>
                <Slider
                  value={[maxPrice]}
                  onValueChange={([value]) => setMaxPrice(value)}
                  max={200}
                  step={10}
                  className="mb-2"
                />
                <div className="text-sm text-gray-600">${maxPrice}/ngày</div>
              </div>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách xe...</p>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Không tìm thấy xe phù hợp</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedCars.map((car) => (
                    <Card
                      key={car.id}
                      className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => onNavigate("car-detail", { car })}
                    >
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageWithFallback
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info("Tính năng yêu thích sắp ra mắt");
                          }}
                        >
                          <Heart className={`w-5 h-5 ${car.liked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg text-gray-900 mb-1">{car.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {car.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{car.rating?.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Fuel className="w-4 h-4" />
                            <span>{car.gasoline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{car.seats}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex flex-col">
                              <span className="text-lg text-blue-600 font-semibold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.price)}
                              </span>
                              <span className="text-xs text-gray-500">/ngày</span>
                            </div>
                          </div>
                          <Button size="sm">Xem chi tiết</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {hasMoreCars && (
                  <div className="mt-8 text-center">
                    <Button onClick={handleLoadMore} variant="outline" size="lg">
                      Xem thêm
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
}
