import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { SearchLoadingOverlay } from "../../components/SearchLoadingOverlay";
import { 
  PlaneTakeoff, PlaneLanding, Calendar as CalendarIcon, Users, Search,
  ArrowRightLeft, Check, ChevronsUpDown, Plus, Minus, Tag, Copy,
  Shield, Clock, Headphones, Globe, Star, Sparkles
} from "lucide-react";
import type { PageType } from "../../MainApp";
import { toast } from "sonner@2.0.3";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { promotionApi, userVoucherApi, tokenService } from "../../utils/api";

interface FlightsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

// Mock airports data
const airports = [
  { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất" },
  { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài" },
  { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng" },
  { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc" },
  { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh" },
  { code: "HPH", city: "Hải Phòng", name: "Sân bay Cát Bi" },
  { code: "VII", city: "Vinh", name: "Sân bay Vinh" },
  { code: "HUI", city: "Huế", name: "Sân bay Phú Bài" },
  { code: "VCA", city: "Cần Thơ", name: "Sân bay Cần Thơ" },
  { code: "DLI", city: "Đà Lạt", name: "Sân bay Liên Khương" },
];

export default function FlightsPage({ onNavigate }: FlightsPageProps) {
  const heroSearchRef = useRef<HTMLDivElement>(null);
  
  // Search form state
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("round-trip");
  const [fromAirport, setFromAirport] = useState<typeof airports[0] | null>(null);
  const [toAirport, setToAirport] = useState<typeof airports[0] | null>(null);
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openPassengers, setOpenPassengers] = useState(false);
  
  // Passenger & Class state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<"economy" | "business" | "first">("economy");
  
  // Voucher modal
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Loading state
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

  // Fetch flight promotions on mount
  useEffect(() => {
    const fetchFlightPromotions = async () => {
      try {
        setLoadingPromotions(true);
        const data = await promotionApi.getActiveByCategory('flight');
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching flight promotions:', error);
        toast.error('Không thể tải ưu đãi');
      } finally {
        setLoadingPromotions(false);
      }
    };

    fetchFlightPromotions();
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

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearch = () => {
    // Validation
    if (!fromAirport) {
      toast.error("Vui lòng chọn điểm khởi hành");
      return;
    }
    if (!toAirport) {
      toast.error("Vui lòng chọn điểm đến");
      return;
    }
    if (fromAirport.code === toAirport.code) {
      toast.error("Điểm đi và điểm đến không được trùng nhau");
      return;
    }
    if (!departDate) {
      toast.error("Vui lòng chọn ngày đi");
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      toast.error("Vui lòng chọn ngày về");
      return;
    }
    if (tripType === "round-trip" && returnDate && returnDate < departDate) {
      toast.error("Ngày về không được trước ngày đi");
      return;
    }

    // Show loading overlay
    setIsSearching(true);
    
    // Simulate search delay (in production, this would be an API call)
    setTimeout(() => {
      setIsSearching(false);
      // Navigate to SearchPage with data
      onNavigate("search", {
        tripType,
        from: fromAirport,
        to: toAirport,
        departDate,
        returnDate,
        passengers: {
          adults,
          children,
          infants,
          total: adults + children + infants
        },
        cabinClass
      });
    }, 2000); // 2 seconds delay to show loading animation
  };

  const handlePopularFlightClick = (from: string, to: string) => {
    const fromAirportData = airports.find(a => a.city === from);
    const toAirportData = airports.find(a => a.city === to);
    
    if (fromAirportData) setFromAirport(fromAirportData);
    if (toAirportData) setToAirport(toAirportData);
    
    // Scroll to hero search
    heroSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast.success(`Đã chọn tuyến ${from} → ${to}`);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Đã sao chép mã voucher!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Không thể sao chép mã");
    }
  };

  const cabinClassLabels = {
    economy: "Phổ thông",
    business: "Thương gia",
    first: "Hạng nhất"
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="bg-white min-h-screen">
      {/* Loading Overlay */}
      <SearchLoadingOverlay 
        isLoading={isSearching}
        searchType="flight"
        message="Đang tìm kiếm chuyến bay..."
      />      {/* Hero Search Section */}
      <div ref={heroSearchRef} className="relative h-[700px] w-full">
        <ImageWithFallback
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=700&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
          <h1 className="text-white text-4xl md:text-5xl text-center mb-8 drop-shadow-2xl max-w-4xl">
            Từ Đông Nam Á Đến Thế Giới, Trong Tầm Tay Bạn
          </h1>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-5xl shadow-2xl">
            <h2 className="text-2xl mb-6">Tìm kiếm chuyến bay</h2>

            {/* Trip Type */}
            <RadioGroup value={tripType} onValueChange={(value: any) => setTripType(value)} className="flex gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label htmlFor="one-way" className="cursor-pointer">Một chiều</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <Label htmlFor="round-trip" className="cursor-pointer">Khứ hồi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multi-city" id="multi-city" />
                <Label htmlFor="multi-city" className="cursor-pointer">Nhiều chặng</Label>
              </div>
            </RadioGroup>

            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* From */}
              <div className="md:col-span-3">
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFrom}
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <PlaneTakeoff className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        {fromAirport ? (
                          <>
                            <span className="text-xs text-gray-500">Từ</span>
                            <span className="truncate w-full text-left">{fromAirport.city}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Từ</span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Tìm sân bay..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy sân bay.</CommandEmpty>
                        <CommandGroup>
                          {airports.map((airport) => (
                            <CommandItem
                              key={airport.code}
                              value={`${airport.city} ${airport.code} ${airport.name}`}
                              onSelect={() => {
                                setFromAirport(airport);
                                setOpenFrom(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  fromAirport?.code === airport.code ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div>
                                <div className="font-medium">{airport.city} ({airport.code})</div>
                                <div className="text-sm text-gray-500">{airport.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-center justify-center">
                <Button
                  onClick={handleSwapAirports}
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5 text-gray-600" />
                </Button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <Popover open={openTo} onOpenChange={setOpenTo}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openTo}
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <PlaneLanding className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        {toAirport ? (
                          <>
                            <span className="text-xs text-gray-500">Đến</span>
                            <span className="truncate w-full text-left">{toAirport.city}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Đến</span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Tìm sân bay..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy sân bay.</CommandEmpty>
                        <CommandGroup>
                          {airports.map((airport) => (
                            <CommandItem
                              key={airport.code}
                              value={`${airport.city} ${airport.code} ${airport.name}`}
                              onSelect={() => {
                                setToAirport(airport);
                                setOpenTo(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  toAirport?.code === airport.code ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div>
                                <div className="font-medium">{airport.city} ({airport.code})</div>
                                <div className="text-sm text-gray-500">{airport.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Dates */}
              <div className="md:col-span-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <CalendarIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-xs text-gray-500">Ngày đi</span>
                        <span className="truncate w-full text-left">
                          {departDate ? format(departDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departDate}
                      onSelect={setDepartDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date (only for round-trip) */}
              {tripType === "round-trip" && (
                <div className="md:col-span-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                      >
                        <CalendarIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-xs text-gray-500">Ngày về</span>
                          <span className="truncate w-full text-left">
                            {returnDate ? format(returnDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => {
                          const minDate = departDate || new Date();
                          return date < minDate;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Passengers & Class */}
              <div className={tripType === "round-trip" ? "md:col-span-2" : "md:col-span-4"}>
                <Popover open={openPassengers} onOpenChange={setOpenPassengers}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-14 border-2 hover:border-blue-500 transition-colors"
                    >
                      <Users className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-xs text-gray-500">Hành khách & Hạng</span>
                        <span className="truncate w-full text-left">
                          {totalPassengers} người, {cabinClassLabels[cabinClass]}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px]">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Người lớn</div>
                          <div className="text-sm text-gray-500">Từ 12 tuổi</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.min(9, adults + 1))}
                            disabled={adults >= 9}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Trẻ em</div>
                          <div className="text-sm text-gray-500">2-11 tuổi</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setChildren(Math.min(9, children + 1))}
                            disabled={children >= 9}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Em bé</div>
                          <div className="text-sm text-gray-500">Dưới 2 tuổi</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            disabled={infants <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{infants}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setInfants(Math.min(adults, infants + 1))}
                            disabled={infants >= adults}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label className="mb-2 block">Hạng vé</Label>
                        <RadioGroup value={cabinClass} onValueChange={(value: any) => setCabinClass(value)}>
                          <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="economy" id="economy" />
                            <Label htmlFor="economy" className="cursor-pointer">Phổ thông</Label>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business" className="cursor-pointer">Thương gia</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="first" id="first" />
                            <Label htmlFor="first" className="cursor-pointer">Hạng nhất</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button 
                        onClick={() => setOpenPassengers(false)} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Xong
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className={tripType === "round-trip" ? "md:col-span-1" : "md:col-span-1"}>
                <Button 
                  onClick={handleSearch}
                  className="w-full h-14 bg-[#0194f3] hover:bg-[#0180d6] text-white"
                >
                  <Search className="w-5 h-5 md:mr-0 lg:mr-2" />
                  <span className="hidden lg:inline">Tìm</span>
                </Button>
              </div>
            </div>

            {/* Multi-city notice */}
            {tripType === "multi-city" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                Tính năng đặt vé nhiều chặng đang được phát triển. Vui lòng chọn "Một chiều" hoặc "Khứ hồi".
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Tại sao chọn Wanderlust?</h2>
          <p className="text-gray-600">Trải nghiệm đặt vé máy bay tuyệt vời nhất</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg mb-3">Tìm kiếm thông minh</h3>
            <p className="text-sm text-gray-600">
              So sánh hàng nghìn chuyến bay từ nhiều hãng hàng không với giá tốt nhất.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg mb-3">Gợi ý cá nhân hóa</h3>
            <p className="text-sm text-gray-600">
              Nhận đề xuất phù hợp dựa trên lịch sử tìm kiếm và sở thích của bạn.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg mb-3">Giá tốt nhất</h3>
            <p className="text-sm text-gray-600">
              Cập nhật giá theo thời gian thực, đảm bảo giá tốt nhất cho bạn.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg mb-3">Hỗ trợ 24/7</h3>
            <p className="text-sm text-gray-600">
              Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp bạn mọi lúc, mọi nơi.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg mb-3">Đa nền tảng</h3>
            <p className="text-sm text-gray-600">
              Sử dụng trên mọi thiết bị, trải nghiệm nhất quán và tiện lợi.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg mb-3">An toàn & Tin cậy</h3>
            <p className="text-sm text-gray-600">
              Thanh toán bảo mật, thông tin được mã hóa và bảo vệ tuyệt đối.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Flights */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Các chuyến bay phổ biến</h2>
          <p className="text-gray-600">Những tuyến bay được ưa chuộng nhất</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { from: "TP. Hồ Chí Minh", to: "Hà Nội", price: "1.200.000đ", image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=300&fit=crop" },
            { from: "Hà Nội", to: "Đà Nẵng", price: "980.000đ", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop" },
            { from: "TP. Hồ Chí Minh", to: "Phú Quốc", price: "1.450.000đ", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" },
            { from: "Hà Nội", to: "Nha Trang", price: "1.100.000đ", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop" }
          ].map((flight, index) => (
            <div
              key={index}
              onClick={() => handlePopularFlightClick(flight.from, flight.to)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  alt={`${flight.from} to ${flight.to}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src={flight.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-lg">{flight.from}</span>
                    <ArrowRightLeft className="w-4 h-4" />
                    <span className="text-lg">{flight.to}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Từ</span>
                  <span className="text-xl text-blue-600">{flight.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deals Section with Carousel */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">Ưu đãi dành cho bạn</h2>
            <p className="text-gray-600">Khuyến mãi hot nhất trong tháng</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onNavigate("promotions")}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Xem tất cả
          </Button>
        </div>

        {loadingPromotions ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Hiện chưa có ưu đãi nào cho vé máy bay</p>
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {promotions.map((promo: any) => (
                <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
                  <div 
                    onClick={() => setSelectedVoucher(promo)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <div className="relative h-48">
                      <ImageWithFallback
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={promo.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"}
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full">
                        {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `${(promo.value / 1000).toFixed(0)}K`}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-sm text-gray-600 mb-1">Wanderlust Travel</div>
                      <h3 className="text-lg mb-2">{promo.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                      <div className="flex items-center justify-between">
                        <code className="border-2 border-dashed border-purple-600 text-purple-600 rounded px-3 py-1">
                          {promo.code}
                        </code>
                        <Button variant="link" className="text-blue-600 p-0">
                          Xem chi tiết →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Câu hỏi thường gặp</h2>
          <p className="text-gray-600">FAQ</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "Làm thế nào để tìm kiếm và đặt vé máy bay trên Wanderlust?",
              a: "Bạn chỉ cần nhập điểm đi, điểm đến, ngày bay và số hành khách vào khung tìm kiếm. Hệ thống sẽ hiển thị các chuyến bay phù hợp. Chọn chuyến bay bạn muốn, điền thông tin hành khách và thanh toán."
            },
            {
              q: "Những hình thức thanh toán nào được chấp nhận?",
              a: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (Momo, ZaloPay), chuyển khoản ngân hàng và Ví Wanderlust."
            },
            {
              q: "Tôi có thể hủy hoặc đổi vé sau khi đã đặt không?",
              a: "Có, bạn có thể hủy hoặc đổi vé tùy theo điều kiện của loại vé bạn đã mua. Vé Linh hoạt cho phép hủy/đổi miễn phí, trong khi vé Tiết kiệm có thể tính phí. Vui lòng kiểm tra điều kiện cụ thể khi đặt vé."
            },
            {
              q: "Làm sao để biết chuyến bay có bị hoãn hoặc hủy?",
              a: "Chúng tôi sẽ gửi thông báo qua email và SMS đến số điện thoại bạn đã đăng ký. Bạn cũng có thể kiểm tra trạng thái chuyến bay trong mục 'Đơn hàng của tôi'."
            },
            {
              q: "Tôi có thể đặt vé cho nhiều hành khách cùng lúc không?",
              a: "Có, bạn có thể đặt vé cho tối đa 9 hành khách trong một giao dịch. Hệ thống sẽ yêu cầu bạn điền thông tin cho từng hành khách."
            },
            {
              q: "Chính sách hành lý ký gửi là gì?",
              a: "Chính sách hành lý phụ thuộc vào hãng hàng không và loại vé. Thông tin chi tiết về hành lý sẽ được hiển thị khi bạn chọn chuyến bay."
            }
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết ưu đãi</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về chương trình khuyến mãi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedVoucher.image}
                  alt={selectedVoucher.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full">
                  {selectedVoucher.type === 'PERCENTAGE' 
                    ? `${selectedVoucher.value}%` 
                    : `${(selectedVoucher.value / 1000).toFixed(0)}K`}
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-2">{selectedVoucher.title}</h3>
                <p className="text-gray-600">{selectedVoucher.description}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Mã voucher</p>
                <div className="flex items-center gap-3">
                  <code className="text-2xl font-mono flex-1">{selectedVoucher.code}</code>
                  <Button
                    onClick={() => handleCopyCode(selectedVoucher.code)}
                    variant="outline"
                    className="gap-2"
                  >
                    {copiedCode === selectedVoucher.code ? (
                      <>
                        <Check className="w-4 h-4" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Điều kiện áp dụng</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {selectedVoucher.conditions && Array.isArray(selectedVoucher.conditions) && selectedVoucher.conditions.length > 0 ? (
                    selectedVoucher.conditions.map((condition: string, index: number) => (
                      <li key={index}>• {condition}</li>
                    ))
                  ) : (
                    <>
                      <li>• Áp dụng cho vé máy bay</li>
                      <li>• Không áp dụng cùng các chương trình khuyến mãi khác</li>
                      <li>• Mỗi tài khoản chỉ được sử dụng 1 lần</li>
                    </>
                  )}
                </ul>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
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

      <Footer />
      
      {/* Search Loading Overlay */}
      <SearchLoadingOverlay 
        isLoading={isSearching} 
        searchType="flight"
        message="Đang tìm kiếm chuyến bay tốt nhất cho bạn..."
      />
    </div>
  );
}
