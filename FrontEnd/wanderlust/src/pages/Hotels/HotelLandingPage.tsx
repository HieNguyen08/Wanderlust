import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Award, Building2, Calendar as CalendarIcon, Check, ChevronDown, Clock, Gift, Hotel, MapPin, Minus, Plus, Repeat, Search, Sparkles, Star, Tag, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { SearchLoadingOverlay } from "../../components/SearchLoadingOverlay";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Card } from "../../components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Separator } from "../../components/ui/separator";
import { PageType } from "../../MainApp";
import { locationApi, promotionApi, tokenService, userVoucherApi } from "../../utils/api";

interface HotelLandingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}
// Type cho destination (location từ backend)
interface Destination {
  id?: string;
  code: string;
  name: string;
  country: string;
  hotels?: string;
}

// Search Form Component
function HotelSearchForm({ onSearch, onViewAll, isSearching }: { onSearch: (data: any) => void; onViewAll: () => void; isSearching: boolean }) {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Popover states
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  // Fetch locations từ backend (lọc theo CITY từ Location API)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationApi.getLocationsByType('CITY');

        console.log("📍 City Locations API response:", response);

        // Check if response is paginated or array
        const locationsArray = Array.isArray(response) ? response : (response.content || []);

        if (!Array.isArray(locationsArray)) {
          console.error("Invalid locations data format:", response);
          throw new Error("Invalid response format");
        }

        // Map location data sang format Destination
        const mappedLocations: Destination[] = locationsArray.map((loc: any) => ({
          id: loc.id,
          code: loc.code || "N/A",
          name: loc.name,
          country: loc.metadata?.country || "Việt Nam", // Mặc định là Việt Nam nếu không có thông tin
          hotels: "" // Will be populated from metadata if available
        }));

        console.log("✅ Mapped city locations:", mappedLocations);

        // Nếu backend không có data (database rỗng), dùng fallback
        if (mappedLocations.length === 0) {
          console.warn("⚠️ No city locations found in database, using fallback data");
          const fallbackLocations = [
            { code: "SGN", name: "Ho Chi Minh City", country: "Vietnam", hotels: "500+" },
            { code: "HAN", name: "Hanoi", country: "Vietnam", hotels: "450+" },
            { code: "DAD", name: "Da Nang", country: "Vietnam", hotels: "340+" },
            { code: "PQC", name: "Phu Quoc", country: "Vietnam", hotels: "250+" },
            { code: "NHA", name: "Nha Trang", country: "Vietnam", hotels: "280+" },
            { code: "DLI", name: "Da Lat", country: "Vietnam", hotels: "180+" },
            { code: "HUE", name: "Hue", country: "Vietnam", hotels: "150+" },
            { code: "VTE", name: "Vung Tau", country: "Vietnam", hotels: "120+" },
            { code: "BKK", name: "Bangkok", country: "Thailand", hotels: "800+" },
            { code: "HKT", name: "Phuket", country: "Thailand", hotels: "600+" },
            { code: "SIN", name: "Singapore", country: "Singapore", hotels: "550+" },
            { code: "MLE", name: "Maldives", country: "Maldives", hotels: "300+" },
          ];
          setDestinations(fallbackLocations);
        } else {
          setDestinations(mappedLocations);
        }
      } catch (error) {
        console.error("❌ Failed to fetch city locations:", error);
        toast.error("Không thể tải danh sách địa điểm");

        // Fallback data nếu API fails
        const fallbackLocations = [
          { code: "SGN", name: "Ho Chi Minh City", country: "Vietnam", hotels: "500+" },
          { code: "HAN", name: "Hanoi", country: "Vietnam", hotels: "450+" },
          { code: "DAD", name: "Da Nang", country: "Vietnam", hotels: "340+" },
          { code: "PQC", name: "Phu Quoc", country: "Vietnam", hotels: "250+" },
          { code: "NHA", name: "Nha Trang", country: "Vietnam", hotels: "280+" },
        ];
        console.log("🔄 Using fallback locations:", fallbackLocations);
        setDestinations(fallbackLocations);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = () => {
    // Only require destination for list search; keep the rest as optional booking info for later (review page)
    if (!destination) {
      toast.error(t('hotels.locationPlaceholder'));
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    onSearch({
      destination: destination.name,
      destinationId: destination.id,
      city: destination.name,
      bookingInfo: {
        checkIn: checkIn ? format(checkIn, "dd/MM/yyyy") : null,
        checkOut: checkOut ? format(checkOut, "dd/MM/yyyy") : null,
        guests: { adults, children, rooms },
      }
    });
  };

  return (
    <div className="w-full max-w-[1168px] mx-auto px-4 -mt-[140px] relative z-20">
      <div className="bg-white rounded-lg border border-[#c8c8c8] p-6 shadow-lg">
        <h2 className="text-[24px] font-['Sansita'] font-bold text-black mb-4">
          {t('hotels.searchTitle')}
        </h2>

        {/* Location */}
        <div className="mb-4">
          <Popover open={destinationOpen} onOpenChange={setDestinationOpen} modal={true}>
            <PopoverTrigger asChild>
              <div className="bg-white border border-[#a1b0cc] rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                <Hotel className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">{t('hotels.locationPlaceholder')}</label>
                  {destination ? (
                    <div className="text-[15px] font-['Sansita'] font-bold text-[#7c8db0]">
                      {destination.name}, {destination.country}
                    </div>
                  ) : (
                    <div className="text-[15px] font-['Sansita'] font-bold text-gray-400">
                      {t('hotels.defaultLocation')}
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
                          className={`mr-2 h-4 w-4 ${destination?.code === dest.code ? "opacity-100" : "opacity-0"
                            }`}
                        />
                        <div className="flex flex-col">
                          <span>{dest.name}, {dest.country}</span>
                          <span className="text-xs text-gray-500">{dest.hotels} {t('hotels.hotelsCount')}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 mb-4">
          {/* Check-in */}
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen} modal={true}>
            <PopoverTrigger asChild>
              <div className="bg-white border border-[#a1b0cc] rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">{t('hotels.checkInLabel')}</label>
                  <span className="text-sm text-[#7c8db0] font-['Sansita'] font-bold">
                    {checkIn
                      ? format(checkIn, "d 'tháng' M, EEEE", { locale: vi })
                      : "15 tháng 9, Chủ nhật"}
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
            <div className="bg-white border border-[#a1b0cc] rounded-lg p-2 size-10 flex items-center justify-center">
              <Repeat className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Check-out */}
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen} modal={true}>
            <PopoverTrigger asChild>
              <div className="bg-white border border-[#a1b0cc] rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">{t('hotels.checkOutLabel')}</label>
                  <span className="text-sm text-[#7c8db0] font-['Sansita'] font-bold">
                    {checkOut
                      ? format(checkOut, "d 'tháng' M, EEEE", { locale: vi })
                      : "21 tháng 9, Thứ 7"}
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
        <div className="mb-4">
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <div className="bg-white border border-[#a1b0cc] rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">{t('hotels.guestsAndRooms')}</label>
                  <span className="text-sm text-[#7c8db0] font-['Sansita'] font-bold">
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

        {/* Search Button & Recently Viewed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-[30px] h-[30px] text-gray-400" />
            <span className="text-[16px] font-['Sansita'] text-[#0194f3]">
              {t('hotels.recentHotels')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-[#0194f3] hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {isSearching ? t('hotels.searching') : t('common.search')}
            </Button>
            
            <Button
              onClick={onViewAll}
              disabled={isSearching}
              variant="outline"
              className="border-[#0194f3] text-[#0194f3] hover:bg-blue-50 px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Building2 className="w-4 h-4" />
              {t('hotels.viewAllHotels') || 'Xem tất cả khách sạn'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelLandingPage({ onNavigate }: HotelLandingPageProps) {
  const { t } = useTranslation();
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Promotions state
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [savedVouchers, setSavedVouchers] = useState<string[]>([]);
  const [savingVoucher, setSavingVoucher] = useState(false);

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

  // Fetch hotel promotions on mount (filter by HOTEL or ALL)
  useEffect(() => {
    const fetchHotelPromotions = async () => {
      try {
        setLoadingPromotions(true);
        // Fetch all active promotions
        const allPromotions = await promotionApi.getActive();
        
        // Filter by category: HOTEL or ALL
        const filteredPromotions = allPromotions.filter((promo: any) => {
          const category = promo.category?.toUpperCase();
          return category === 'HOTEL' || category === 'ALL';
        });
        
        console.log('✅ Filtered hotel promotions:', filteredPromotions);
        setPromotions(filteredPromotions);
      } catch (error) {
        console.error('Error fetching hotel promotions:', error);
        toast.error('Không thể tải ưu đãi');
      } finally {
        setLoadingPromotions(false);
      }
    };

    fetchHotelPromotions();
  }, []);

  const handleSaveVoucher = async (voucher: any) => {
    try {
      // Check authentication
      if (!tokenService.isAuthenticated()) {
        toast.error('Vui lòng đăng nhập để lưu voucher');
        onNavigate('login');
        return;
      }

      setSavingVoucher(true);
      await userVoucherApi.saveToWallet(voucher.code);
      toast.success(`Đã lưu mã ${voucher.code} vào Ví Voucher!`);

      // Refresh available vouchers
      const available = await userVoucherApi.getAvailable();
      setSavedVouchers(available.map((v: any) => v.voucherCode));

      setSelectedVoucher(null);
    } catch (error: any) {
      toast.error(error.message || 'Không thể lưu voucher');
    } finally {
      setSavingVoucher(false);
    }
  };

  const handleSearch = (searchData: any) => {
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // For hotel list we only need destination for filtering; keep bookingInfo attached for later steps (review page)
      onNavigate("hotel-list", {
        destination: searchData.destination,
        destinationId: searchData.destinationId,
        city: searchData.city || searchData.destination,
        bookingInfo: searchData.bookingInfo,
      });
    }, 2000);
  };

  const handleViewAllHotels = () => {
    setIsSearching(true);

    // Navigate to hotel list without any search parameters
    setTimeout(() => {
      setIsSearching(false);
      onNavigate("hotel-list", {});
    }, 1000);
  };

  const domesticDestinations = [
    {
      name: "Phú Quốc",
      hotels: `250+ ${t('hotels.hotelsCount')}`,
      price: `${t('common.from')} 850.000đ/${t('common.perNight')}`,
      image: "https://images.unsplash.com/photo-1641810560800-6f1254f3636f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwcGh1JTIwcXVvYyUyMHJlc29ydHxlbnwxfHx8fDE3NjE5OTAyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8
    },
    {
      name: "Đà Nẵng",
      hotels: `340+ ${t('hotels.hotelsCount')}`,
      price: `${t('common.from')} 650.000đ/${t('common.perNight')}`,
      image: "https://images.unsplash.com/photo-1723142282970-1fd415eec1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwZGFuYW5nJTIwYmVhY2h8ZW58MXx8fHwxNzYwMTA1ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7
    },
    {
      name: "Nha Trang",
      hotels: `280+ ${t('hotels.hotelsCount')}`,
      price: `${t('common.from')} 550.000đ/${t('common.perNight')}`,
      image: "https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc2MDEwNTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.6
    }
  ];

  const internationalDestinations = [
    {
      name: "Phuket, Thái Lan",
      hotels: `450+ ${t('hotels.hotelsCount')}`,
      price: `${t('common.from')} 1.200.000đ/${t('common.perNight')}`,
      image: "https://images.unsplash.com/photo-1729615220929-afe0f01aea61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpbGFuZCUyMHBodWtldCUyMGhvdGVsfGVufDF8fHx8MTc2MTk5MDI5OXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9
    },
    {
      name: "Singapore",
      hotels: `380+ ${t('hotels.hotelsCount')}`,
      price: `${t('common.from')} 2.500.000đ/${t('common.perNight')}`,
      image: "https://images.unsplash.com/photo-1599917858303-0c3c47ccece3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjBtYXJpbmElMjBiYXklMjBob3RlbHxlbnwxfHx8fDE3NjE5OTAyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8
    },
    {
      name: "Maldives",
      hotels: "180+ resort",
      price: `${t('common.from')} 8.500.000đ/${t('common.perNight')}`,
      image: "https://images.unsplash.com/photo-1637576308588-6647bf80944d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG92ZXJ3YXRlciUyMGJ1bmdhbG93fGVufDF8fHx8MTc2MTk5MDMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5.0
    }
  ];

  return (
    <div className="bg-gray-50 w-full min-h-screen overflow-x-hidden">
      {/* Loading Overlay */}
      <SearchLoadingOverlay
        isLoading={isSearching}
        searchType="hotel"
        message={t('hotels.searchingMessage')}
      />

      {/* Hero Section */}
      <div className="relative w-full h-[600px]">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            alt="Beautiful beach resort"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc2MDEwNTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            {t('hotels.specialOffers')}
          </Badge>
          <h1 className="text-white text-5xl md:text-6xl mb-4 drop-shadow-2xl max-w-4xl">
            {t('hotels.heroTitle')}
          </h1>
          <p className="text-white/90 text-xl max-w-2xl drop-shadow-lg">
            {t('hotels.heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Search Form - Overlapping Hero */}
      <HotelSearchForm onSearch={handleSearch} onViewAll={handleViewAllHotels} isSearching={isSearching} />

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Promo Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Gift className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl">{t('hotels.offersTitle')}</h2>
          </div>
          {loadingPromotions ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">{t('hotels.loadingOffers')}</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('hotels.noOffers')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((offer) => (
                <Card
                  key={offer.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setSelectedVoucher(offer)}
                >
                  <div className="relative h-64">
                    <ImageWithFallback
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      src={offer.image || "https://images.unsplash.com/photo-1731080647322-f9cf691d40ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzYxOTkwMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080"}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white border-0">
                      {offer.status === 'active' ? 'HOT' : 'NEW'}
                    </Badge>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="text-3xl mb-2">
                        {offer.type === 'PERCENTAGE'
                          ? `Giảm ${offer.value}%`
                          : `Giảm ${(offer.value / 1000).toFixed(0)}K`
                        }
                      </div>
                      <h3 className="text-2xl mb-2">{offer.title}</h3>
                      <p className="text-sm text-gray-200">{offer.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Domestic Destinations */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl">{t('hotels.domesticDestinations')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {domesticDestinations.map((dest, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                onClick={() => onNavigate("hotel-list", { destination: dest.name })}
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    src={dest.image}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{dest.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-600 text-sm mb-1">{dest.hotels}</p>
                  <p className="text-blue-600 text-lg">{dest.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* International Destinations */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl">{t('hotels.internationalDestinations')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {internationalDestinations.map((dest, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                onClick={() => onNavigate("hotel-list", { destination: dest.name })}
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    src={dest.image}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{dest.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-600 text-sm mb-1">{dest.hotels}</p>
                  <p className="text-blue-600 text-lg">{dest.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Download App */}
        <section className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-orange-200">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700 border-0">VIP Member</Badge>
            </div>
            <h3 className="text-3xl">
              {t('hotels.memberPromoTitle')}
            </h3>
            <p className="text-lg text-gray-700">
              {t('hotels.memberPromoDesc')}
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700">
              {t('hotels.learnMore')}
            </Button>
          </div>
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl border-2 border-orange-300 flex items-center justify-center shadow-lg">
            <span className="text-sm text-gray-500">QR Code</span>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-[24px] font-['Arya'] font-bold text-black">{t('hotels.faqTitle')}</h2>
          <p className="text-[18px] font-['Arvo'] text-black">{t('hotels.faqSubtitle')}</p>

          {/* FAQ Items */}
          <div className="space-y-2">
            {[
              t('hotels.faq.q1'),
              t('hotels.faq.q2'),
              t('hotels.faq.q3'),
              t('hotels.faq.q4'),
              t('hotels.faq.q5'),
            ].map((question, i) => (
              <div
                key={i}
                className="bg-white border border-[#a1b0cc] rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer"
              >
                <p className="text-[16px] font-['Arvo'] text-black">{question}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />

      {/* Voucher Detail Dialog */}
      {selectedVoucher && (
        <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('hotels.offerDetails')}</DialogTitle>
              <DialogDescription>
                {t('hotels.offerDetailsDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Voucher Image */}
              <div className="relative h-48 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedVoucher.image || "https://images.unsplash.com/photo-1731080647322-f9cf691d40ab"}
                  alt={selectedVoucher.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <Badge className="absolute top-4 right-4 bg-red-500 text-white border-0">
                  {selectedVoucher.status === 'active' ? 'HOT' : 'NEW'}
                </Badge>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-3xl mb-1">
                    {selectedVoucher.type === 'PERCENTAGE'
                      ? `Giảm ${selectedVoucher.value}%`
                      : `Giảm ${(selectedVoucher.value / 1000).toFixed(0)}K`
                    }
                  </div>
                  <h3 className="text-xl">{selectedVoucher.title}</h3>
                </div>
              </div>

              {/* Voucher Code */}
              <div className="bg-linear-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">{t('hotels.voucherCode')}</div>
                    <div className="text-2xl font-mono tracking-wider text-blue-600">
                      {selectedVoucher.code}
                    </div>
                  </div>
                  <Tag className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* Voucher Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">{t('hotels.validUntil')}</div>
                    <div className="font-medium">
                      {new Date(selectedVoucher.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Giá trị đơn tối thiểu:</span>
                    <span className="font-medium">
                      {selectedVoucher.minSpend ? `${(selectedVoucher.minSpend / 1000).toLocaleString('vi-VN')}k` : 'Không yêu cầu'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Giảm tối đa:</span>
                    <span className="font-medium text-red-600">
                      {selectedVoucher.maxDiscount
                        ? `${(selectedVoucher.maxDiscount / 1000).toLocaleString('vi-VN')}k`
                        : 'Không giới hạn'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Số lượng còn lại:</span>
                    <span className="font-medium text-blue-600">
                      {selectedVoucher.totalUsesLimit
                        ? `${selectedVoucher.totalUsesLimit - (selectedVoucher.usedCount || 0)} voucher`
                        : 'Không giới hạn'
                      }
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-gray-600 mb-2">Mô tả</div>
                  <p className="text-sm text-gray-700">{selectedVoucher.description}</p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
                onClick={() => handleSaveVoucher(selectedVoucher)}
                disabled={savedVouchers.includes(selectedVoucher.code) || savingVoucher}
              >
                <Tag className="w-4 h-4 mr-2" />
                {savingVoucher
                  ? 'Đang lưu...'
                  : savedVouchers.includes(selectedVoucher.code)
                    ? 'Đã lưu vào Ví Voucher'
                    : 'Lưu vào Ví Voucher'
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
