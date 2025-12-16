import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, ChevronDown, Clock, Fuel, Heart, Settings, Shield, Star, Users, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { SearchLoadingOverlay } from "../../components/SearchLoadingOverlay";
import { VoucherCarousel } from "../../components/VoucherCarousel";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { PaginationUI } from "../../components/ui/PaginationUI";
import { carRentalApi, locationApi, promotionApi, tokenService, userVoucherApi } from "../../utils/api";

interface CarRentalLandingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: any;
  onLogout?: () => void;
}

interface LocationItem {
  id: string;
  code: string;
  name: string;
  country: string;
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

export default function CarRentalLandingPage({ onNavigate, userRole, onLogout }: CarRentalLandingPageProps) {
  // Locations from backend
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Cars from backend
  const [popularCars, setPopularCars] = useState<any[]>([]);
  const [recommendedCars, setRecommendedCars] = useState<any[]>([]);

  const [popularCache, setPopularCache] = useState<Map<number, any[]>>(new Map());
  const [recommendedCache, setRecommendedCache] = useState<Map<number, any[]>>(new Map());
  const [popularLoadingPages, setPopularLoadingPages] = useState<Set<number>>(new Set());
  const [recommendedLoadingPages, setRecommendedLoadingPages] = useState<Set<number>>(new Set());
  const [popularTotalPages, setPopularTotalPages] = useState(0);
  const [recommendedTotalPages, setRecommendedTotalPages] = useState(0);
  const [popularCurrentPage, setPopularCurrentPage] = useState(1);
  const [recommendedCurrentPage, setRecommendedCurrentPage] = useState(1);

  // Vouchers/Promotions
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [savedVouchers, setSavedVouchers] = useState<string[]>([]);

  // Search form state
  const [pickupLocation, setPickupLocation] = useState<LocationItem | null>(null);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState<string>("09:00");
  const [dropoffLocation, setDropoffLocation] = useState<LocationItem | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [dropoffTime, setDropoffTime] = useState<string>("09:00");
  const [sameLocation, setSameLocation] = useState(true);
  const [withDriver, setWithDriver] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [popularSortMode, setPopularSortMode] = useState<"trips" | "createdAt">("trips");

  const ITEMS_PER_PAGE = 6;

  // Ref for search section
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Popover states
  const [pickupLocationOpen, setPickupLocationOpen] = useState(false);
  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropoffLocationOpen, setDropoffLocationOpen] = useState(false);
  const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
  const [dropoffTimeOpen, setDropoffTimeOpen] = useState(false);

  const mapCars = (cars: any[]) => cars.map((car: any) => ({
    id: car.id,
    name: `${car.brand} ${car.model}`,
    brand: car.brand,
    model: car.model,
    year: car.year,
    type: car.type || "SUV",
    image: car.images?.[0]?.url || "https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800",
    gasoline: car.fuelType || "Gasoline",
    transmission: car.transmission || "Manual",
    capacity: `${car.seats || 5} People`,
    seats: car.seats,
    price: car.pricePerDay ? parseFloat(car.pricePerDay) : 0,
    pricePerHour: car.pricePerHour ? parseFloat(car.pricePerHour) : 0,
    liked: false,
    rating: car.averageRating ?? car.rating ?? 0,
    totalTrips: car.totalTrips || 0,
    city: car.city,
    createdAt: car.createdAt ? new Date(car.createdAt) : null,
    features: car.features || [],
    insurance: car.insurance,
    deposit: car.deposit ? parseFloat(car.deposit) : 0,
  }));

  const getPagesToLoad = (page: number, total: number) => {
    const pages = [page];
    if (page > 1) pages.push(page - 1);
    if (page > 2) pages.push(page - 2);
    if (total === 0 || page < total) pages.push(page + 1);
    if (total === 0 || page < total - 1) pages.push(page + 2);
    return pages;
  };

  const loadPopularPages = async (pagesToLoad: number[]) => {
    const pagesToFetch = pagesToLoad.filter((p) => !popularCache.has(p) && !popularLoadingPages.has(p));
    if (pagesToFetch.length === 0) return;

    setPopularLoadingPages((prev) => {
      const next = new Set(prev);
      pagesToFetch.forEach((p) => next.add(p));
      return next;
    });

    try {
      const results = await Promise.all(pagesToFetch.map(async (page) => {
        const resp = await carRentalApi.getAllCars({ page: page - 1, size: ITEMS_PER_PAGE, sortBy: 'totalTrips', sortDir: 'desc' });
        const raw = Array.isArray(resp) ? resp : (resp?.content || []);
        const totalPages = resp?.totalPages || (resp?.totalElements ? Math.max(1, Math.ceil(resp.totalElements / ITEMS_PER_PAGE)) : Math.max(1, Math.ceil(raw.length / ITEMS_PER_PAGE)));
        const pageData = resp?.content ? raw : raw.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        const mapped = mapCars(pageData).sort((a, b) => (b.totalTrips || 0) - (a.totalTrips || 0));
        return { page, mapped, totalPages };
      }));

      setPopularCache((prev) => {
        const next = new Map(prev);
        results.forEach(({ page, mapped }) => next.set(page, mapped));
        return next;
      });

      setPopularTotalPages((prev) => {
        const maxPages = Math.max(prev, ...results.map((r) => r.totalPages));
        return maxPages;
      });
    } catch (error) {
      console.error('❌ Failed to load popular cars pages:', error);
    } finally {
      setPopularLoadingPages((prev) => {
        const next = new Set(prev);
        pagesToFetch.forEach((p) => next.delete(p));
        return next;
      });
    }
  };

  const loadRecommendedPages = async (pagesToLoad: number[]) => {
    const pagesToFetch = pagesToLoad.filter((p) => !recommendedCache.has(p) && !recommendedLoadingPages.has(p));
    if (pagesToFetch.length === 0) return;

    setRecommendedLoadingPages((prev) => {
      const next = new Set(prev);
      pagesToFetch.forEach((p) => next.add(p));
      return next;
    });

    try {
      const results = await Promise.all(pagesToFetch.map(async (page) => {
        const resp = await carRentalApi.getAllCars({ page: page - 1, size: ITEMS_PER_PAGE, sortBy: 'averageRating', sortDir: 'desc' });
        const raw = Array.isArray(resp) ? resp : (resp?.content || []);
        const totalPages = resp?.totalPages || (resp?.totalElements ? Math.max(1, Math.ceil(resp.totalElements / ITEMS_PER_PAGE)) : Math.max(1, Math.ceil(raw.length / ITEMS_PER_PAGE)));
        const pageData = resp?.content ? raw : raw.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        const mapped = mapCars(pageData).sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return { page, mapped, totalPages };
      }));

      setRecommendedCache((prev) => {
        const next = new Map(prev);
        results.forEach(({ page, mapped }) => next.set(page, mapped));
        return next;
      });

      setRecommendedTotalPages((prev) => {
        const maxPages = Math.max(prev, ...results.map((r) => r.totalPages));
        return maxPages;
      });
    } catch (error) {
      console.error('❌ Failed to load recommended cars pages:', error);
    } finally {
      setRecommendedLoadingPages((prev) => {
        const next = new Set(prev);
        pagesToFetch.forEach((p) => next.delete(p));
        return next;
      });
    }
  };

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

  // Fetch locations from backend (CITY type only)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await locationApi.getLocationsByType('CITY');

        console.log("📍 City Locations API response:", response);

        // Check if response is paginated or array
        const locationsArray = Array.isArray(response) ? response : (response.content || []);

        if (!Array.isArray(locationsArray)) {
          console.error("❌ Invalid locations response format:", response);
          throw new Error("Invalid response format");
        }

        // Map location data to LocationItem format
        const mappedLocations: LocationItem[] = locationsArray.map((loc: any) => ({
          id: loc.id,
          code: loc.code || "N/A",
          name: loc.name,
          country: loc.metadata?.country || "Việt Nam",
          airport: loc.metadata?.airport || `${loc.name}`
        }));

        console.log("✅ Mapped city locations:", mappedLocations);

        // Fallback if no data from backend
        if (mappedLocations.length === 0) {
          console.log("⚠️ No city locations from backend, using fallback data");
          const fallbackLocations: LocationItem[] = [
            { id: "SGN", code: "SGN", name: "Ho Chi Minh City", country: "Vietnam", airport: "Sân bay Tân Sơn Nhất" },
            { id: "HAN", code: "HAN", name: "Hanoi", country: "Vietnam", airport: "Sân bay Nội Bài" },
            { id: "DAD", code: "DAD", name: "Da Nang", country: "Vietnam", airport: "Sân bay Đà Nẵng" },
            { id: "NHA", code: "NHA", name: "Nha Trang", country: "Vietnam", airport: "Sân bay Cam Ranh" },
            { id: "PQC", code: "PQC", name: "Phu Quoc", country: "Vietnam", airport: "Sân bay Phú Quốc" },
          ];
          setLocations(fallbackLocations);
        } else {
          setLocations(mappedLocations);
        }
      } catch (error) {
        console.error("❌ Failed to fetch city locations:", error);
        toast.error("Không thể tải danh sách địa điểm");

        // Fallback data if API fails
        const fallbackLocations: LocationItem[] = [
          { id: "SGN", code: "SGN", name: "Ho Chi Minh City", country: "Vietnam", airport: "Sân bay Tân Sơn Nhất" },
          { id: "HAN", code: "HAN", name: "Hanoi", country: "Vietnam", airport: "Sân bay Nội Bài" },
          { id: "DAD", code: "DAD", name: "Da Nang", country: "Vietnam", airport: "Sân bay Đà Nẵng" },
          { id: "NHA", code: "NHA", name: "Nha Trang", country: "Vietnam", airport: "Sân bay Cam Ranh" },
          { id: "PQC", code: "PQC", name: "Phu Quoc", country: "Vietnam", airport: "Sân bay Phú Quốc" },
        ];
        console.log("🔄 Using fallback locations:", fallbackLocations);
        setLocations(fallbackLocations);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Prefetch popular and recommended car pages with caching (+/-2 pages)
  useEffect(() => {
    loadPopularPages([1, 2, 3]);
    loadRecommendedPages([1, 2, 3]);
  }, []);

  useEffect(() => {
    const pages = getPagesToLoad(popularCurrentPage, popularTotalPages);
    loadPopularPages(pages);
  }, [popularCurrentPage, popularTotalPages]);

  useEffect(() => {
    const pages = getPagesToLoad(recommendedCurrentPage, recommendedTotalPages);
    loadRecommendedPages(pages);
  }, [recommendedCurrentPage, recommendedTotalPages]);

  const popularDisplay = useMemo(() => popularCache.get(popularCurrentPage) || [], [popularCache, popularCurrentPage]);
  const recommendedDisplay = useMemo(() => recommendedCache.get(recommendedCurrentPage) || [], [recommendedCache, recommendedCurrentPage]);

  const isPopularLoading = popularCache.size === 0 && popularLoadingPages.size > 0;
  const isRecommendedLoading = recommendedCache.size === 0 && recommendedLoadingPages.size > 0;

  // Scroll to search section
  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Handle swap
  const handleSwap = () => {
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

  // Handle search
  const handleSearch = () => {
    if (!pickupLocation) {
      toast.error("Vui lòng chọn địa điểm nhận xe");
      return;
    }

    if (pickupDate && dropoffDate && dropoffDate < pickupDate) {
      toast.error("Ngày trả xe không được trước ngày nhận xe");
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const searchParams = {
        pickupLocationId: pickupLocation.id,
        pickupLocation: pickupLocation.name,
        pickupLocationCode: pickupLocation.code,
        pickupDate: pickupDate ? format(pickupDate, "dd/MM/yyyy", { locale: vi }) : null,
        pickupTime,
        dropoffLocation: sameLocation ? pickupLocation.name : dropoffLocation?.name || null,
        dropoffDate: dropoffDate ? format(dropoffDate, "dd/MM/yyyy", { locale: vi }) : null,
        dropoffTime,
        withDriver,
      };
      onNavigate("car-list", { searchData: searchParams });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Loading Overlay */}
      <SearchLoadingOverlay
        isLoading={isSearching}
        searchType="car"
        message="Đang tìm kiếm xe phù hợp..."
      />

      {/* Header */}
      <Header currentPage="car-rental" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        {/* Hero Banners */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Banner 1 */}
          <Card className="relative bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent to-white/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 p-8 flex flex-col justify-between h-[360px]">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-4">
                  <Zap className="w-3 h-3 mr-1" />
                  Nền tảng #1
                </Badge>
                <h2 className="text-white text-3xl mb-4 max-w-[280px]">
                  Nền tảng tốt nhất cho thuê xe
                </h2>
                <p className="text-white/90 text-base max-w-[280px] mb-6">
                  Dễ dàng thuê xe an toàn và đáng tin cậy. Tất nhiên với giá tốt nhất.
                </p>
                <Button
                  onClick={scrollToSearch}
                  className="bg-white text-blue-600 hover:bg-white/90 shadow-lg"
                  size="lg"
                >
                  Khám phá ngay
                </Button>
              </div>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Bảo hiểm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>24/7</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Banner 2 */}
          <Card className="relative bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent to-white/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 p-8 flex flex-col justify-between h-[360px]">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-4">
                  <Star className="w-3 h-3 mr-1" />
                  Ưu đãi đặc biệt
                </Badge>
                <h2 className="text-white text-3xl mb-4 max-w-[280px]">
                  Cách dễ dàng để thuê xe với giá thấp
                </h2>
                <p className="text-white/90 text-base max-w-[280px] mb-6">
                  Cung cấp dịch vụ thuê xe giá rẻ và tiện nghi an toàn thoải mái.
                </p>
                <Button
                  onClick={scrollToSearch}
                  className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                  size="lg"
                >
                  Thuê xe ngay
                </Button>
              </div>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white/80" />
                  <span>4.9/5</span>
                </div>
                <div>
                  <span>1000+ Đánh giá</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

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
                          {pickupLocation ? (
                            <span className="truncate">{pickupLocation.name}</span>
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
                                      if (sameLocation) {
                                        setDropoffLocation(city);
                                      }
                                      setPickupLocationOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${pickupLocation?.code === city.code ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    <div className="flex flex-col">
                                      <span>{city.name}</span>
                                      <span className="text-xs text-gray-500">{city.country}</span>
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
                      setSameLocation(checked as boolean);
                      if (checked && pickupLocation) {
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
                  onClick={handleSwap}
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
                                      <span className="text-xs text-gray-500">{city.country}</span>
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
        {/* Popular Cars */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-1">Xe phổ biến</h2>
              <p className="text-gray-600">Những dòng xe được yêu thích nhất</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate("car-list", { sortMode: "trips" })}
              className="text-blue-600 hover:text-blue-700"
            >
              Xem tất cả →
            </Button>
          </div>
          {isPopularLoading ? (
            <div className="text-center py-12 text-gray-500">Đang tải xe phổ biến...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularDisplay.map((car) => (
                  <CarCard key={`${car.id}-popular`} car={car} onNavigate={onNavigate} />
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <PaginationUI
                  currentPage={popularCurrentPage}
                  totalPages={popularTotalPages || Math.max(1, popularCache.size)}
                  onPageChange={setPopularCurrentPage}
                />
              </div>
            </>
          )}
        </section>

        {/* Recommended Cars */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-1">Xe đề xuất</h2>
            <p className="text-gray-600">Lựa chọn phù hợp cho chuyến đi của bạn</p>
          </div>
          {isRecommendedLoading ? (
            <div className="text-center py-12 text-gray-500">Đang tải xe đề xuất...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedDisplay.map((car) => (
                  <CarCard key={`${car.id}-recommended`} car={car} onNavigate={onNavigate} />
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <PaginationUI
                  currentPage={recommendedCurrentPage}
                  totalPages={recommendedTotalPages || Math.max(1, recommendedCache.size)}
                  onPageChange={setRecommendedCurrentPage}
                />
              </div>
            </>
          )}
        </section>

        {/* Show More */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => onNavigate("car-list", {})}
            size="lg"
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Xem tất cả xe →
          </Button>
          <p className="text-sm text-gray-500">Khám phá thêm nhiều lựa chọn xe hơn</p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function CarCard({ car, onNavigate }: { car: any; onNavigate: (page: PageType, data?: any) => void }) {
  const [isLiked, setIsLiked] = useState(car.liked);

  return (
    <Card
      onClick={() => onNavigate("car-detail", car)}
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{car.name}</h3>
            <p className="text-sm text-gray-500">{car.type}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-6 h-6 transition-all duration-300 ${isLiked
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-gray-300 hover:text-red-500'
                }`}
            />
          </button>
        </div>

        <div className="mb-6 h-32 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 group-hover:scale-105 transition-transform">
          <ImageWithFallback
            src={car.image}
            alt={car.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex items-center justify-between gap-3 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4 text-blue-600" />
            <span>{car.gasoline}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4 text-blue-600" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{car.capacity}</span>
          </div>
        </div>

        {car.rating && (
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{car.rating}</span>
            <span className="text-sm text-gray-500">(Tuyệt vời)</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="flex flex-col">
              <span className="text-lg text-blue-600 font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.price)}
              </span>
              <span className="text-xs text-gray-500">/ngày</span>
            </div>
            {car.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(car.originalPrice)}
              </p>
            )}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("car-review", {
                car: {
                  id: car.id,
                  name: car.name,
                  type: car.type,
                  image: car.image,
                  transmission: car.transmission,
                  capacity: car.capacity,
                  seats: car.seats,
                  pricePerDay: car.price,
                  pricePerHour: car.pricePerHour || 0,
                  withDriver: car.withDriver,
                  driverPrice: car.driverPrice || 0,
                  insurance: car.insurance,
                  deposit: car.deposit
                }
              });
            }}
            size="sm"
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Thuê ngay
          </Button>
        </div>
      </div>
    </Card>
  );
}