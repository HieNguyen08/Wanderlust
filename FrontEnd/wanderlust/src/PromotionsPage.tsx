import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Checkbox } from "./components/ui/checkbox";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { 
  Ticket, Calendar, Tag, Copy, Check, ChevronLeft, ChevronRight,
  Filter, X, Clock, TrendingUp, Sparkles, Hotel, Plane, Car, Activity
} from "lucide-react";
import type { PageType } from "./MainApp";
import { toast } from "sonner@2.0.3";

interface PromotionsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function PromotionsPage({ onNavigate }: PromotionsPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [collectedVouchers, setCollectedVouchers] = useState<number[]>([1, 3]); // Mock collected vouchers
  const [showFilters, setShowFilters] = useState(true);
  
  // Fi
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Hero Banners - Ưu đãi khủng
  const heroBanners = [
    {
      id: 1,
      title: "BLACK FRIDAY - GIẢM 50%",
      subtitle: "Toàn bộ khách sạn cao cấp",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop",
      code: "BLACKFRIDAY50",
      gradient: "from-purple-900/70 via-pink-900/70 to-transparent"
    },
    {
      id: 2,
      title: "FLASH SALE - MUA 1 TẶNG 1",
      subtitle: "Vé máy bay nội địa",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=600&fit=crop",
      code: "FLASH11",
      gradient: "from-orange-900/70 via-red-900/70 to-transparent"
    },
    {
      id: 3,
      title: "ƯU ĐÃI CUỐI TUẦN",
      subtitle: "Giảm 30% tất cả hoạt động vui chơi",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&h=600&fit=crop",
      code: "WEEKEND30",
      gradient: "from-blue-900/70 via-cyan-900/70 to-transparent"
    }
  ];

  // Mock vouchers data
  const allVouchers = [
    {
      id: 1,
      code: "HOTEL15",
      title: "Giảm 15% Khách sạn Đà Nẵng",
      description: "Áp dụng cho tất cả khách sạn tại Đà Nẵng",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop",
      type: "PERCENTAGE",
      value: 15,
      maxDiscount: 200000,
      minSpend: 1000000,
      startDate: "2025-11-01",
      endDate: "2025-11-30",
      category: "hotel",
      destination: "Đà Nẵng",
      badge: "GIẢM 15%",
      badgeColor: "bg-blue-600",
      isFeatured: true,
      daysLeft: 25,
      totalUsesLimit: 100,
      usedCount: 45,
      conditions: [
        "Áp dụng cho khách sạn 4-5 sao",
        "Đặt tối thiểu 2 đêm",
        "Không áp dụng vào cuối tuần"
      ],
      applicableServices: [
        {
          id: 1,
          name: "InterContinental Danang Sun Peninsula",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
          price: 3500000
        },
        {
          id: 2,
          name: "Fusion Maia Danang",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
          price: 2800000
        }
      ]
    },
    {
      id: 2,
      code: "TOUR50K",
      title: "Giảm 50.000đ Tour Cù Lao Chàm",
      description: "Giảm ngay 50.000đ cho tour khám phá Cù Lao Chàm",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      type: "FIXED_AMOUNT",
      value: 50000,
      maxDiscount: null,
      minSpend: 500000,
      startDate: "2025-11-01",
      endDate: "2025-12-31",
      category: "activity",
      destination: "Hội An",
      badge: "50.000Đ",
      badgeColor: "bg-green-600",
      isFeatured: false,
      daysLeft: 56,
      totalUsesLimit: 200,
      usedCount: 123,
      conditions: [
        "Áp dụng cho tour nguyên ngày",
        "Bao gồm bữa trưa",
        "Không hoàn tiền"
      ],
      applicableServices: []
    },
    {
      id: 3,
      code: "FLIGHT200K",
      title: "Giảm 200.000đ Vé máy bay",
      description: "Giảm 200.000đ cho vé máy bay nội địa",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop",
      type: "FIXED_AMOUNT",
      value: 200000,
      maxDiscount: null,
      minSpend: 1500000,
      startDate: "2025-11-05",
      endDate: "2025-11-10",
      category: "flight",
      destination: "Toàn quốc",
      badge: "200.000Đ",
      badgeColor: "bg-orange-600",
      isFeatured: true,
      daysLeft: 2,
      totalUsesLimit: 50,
      usedCount: 48,
      conditions: [
        "Chỉ áp dụng cho chuyến bay khứ hồi",
        "Đặt trước 7 ngày",
        "Hạn chót: 10/11/2025"
      ],
      applicableServices: []
    },
    {
      id: 4,
      code: "CAR20",
      title: "Giảm 20% Thuê xe tự lái",
      description: "Giảm 20% cho tất cả dịch vụ thuê xe",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=400&fit=crop",
      type: "PERCENTAGE",
      value: 20,
      maxDiscount: 300000,
      minSpend: 800000,
      startDate: "2025-11-01",
      endDate: "2025-11-15",
      category: "car",
      destination: "Toàn quốc",
      badge: "GIẢM 20%",
      badgeColor: "bg-purple-600",
      isFeatured: false,
      daysLeft: 10,
      totalUsesLimit: 75,
      usedCount: 32,
      conditions: [
        "Thuê tối thiểu 3 ngày",
        "Áp dụng cho xe 4-7 chỗ",
        "Miễn phí giao xe"
      ],
      applicableServices: []
    },
    {
      id: 5,
      code: "PHUQUOC25",
      title: "Giảm 25% Resort Phú Quốc",
      description: "Giảm 25% cho các resort cao cấp tại Phú Quốc",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      type: "PERCENTAGE",
      value: 25,
      maxDiscount: 500000,
      minSpend: 2000000,
      startDate: "2025-11-01",
      endDate: "2025-12-31",
      category: "hotel",
      destination: "Phú Quốc",
      badge: "GIẢM 25%",
      badgeColor: "bg-pink-600",
      isFeatured: true,
      daysLeft: 56,
      totalUsesLimit: 150,
      usedCount: 67,
      conditions: [
        "Áp dụng cho resort 5 sao",
        "Đặt tối thiểu 3 đêm",
        "Bao gồm bữa sáng"
      ],
      applicableServices: []
    },
    {
      id: 6,
      code: "NEWUSER100K",
      title: "Chào mừng thành viên mới",
      description: "Giảm 100.000đ cho đơn hàng đầu tiên",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=400&fit=crop",
      type: "FIXED_AMOUNT",
      value: 100000,
      maxDiscount: null,
      minSpend: 500000,
      startDate: "2025-10-01",
      endDate: "2025-12-31",
      category: "all",
      destination: "Toàn quốc",
      badge: "100.000Đ",
      badgeColor: "bg-yellow-600",
      isFeatured: false,
      daysLeft: 56,
      totalUsesLimit: 1000,
      usedCount: 678,
      conditions: [
        "Chỉ cho khách hàng mới",
        "Sử dụng 1 lần duy nhất",
        "Áp dụng cho tất cả dịch vụ"
      ],
      applicableServices: []
    }
  ];

  // Filter vouchers
  const filteredVouchers = allVouchers.filter(voucher => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(voucher.category) && !selectedCategories.includes('all')) {
      return false;
    }
    if (selectedDestinations.length > 0 && !selectedDestinations.includes(voucher.destination)) {
      return false;
    }
    if (selectedTypes.length > 0 && !selectedTypes.includes(voucher.type)) {
      return false;
    }
    return true;
  });

  // Categorize vouchers
  const featuredVouchers = filteredVouchers.filter(v => v.isFeatured);
  const expiringVouchers = filteredVouchers.filter(v => v.daysLeft <= 7).sort((a, b) => a.daysLeft - b.daysLeft);
  const newestVouchers = [...filteredVouchers].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Đã sao chép mã voucher!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(code);
      toast.success("Đã sao chép mã voucher!");
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleCollectVoucher = (voucherId: number, voucherCode: string) => {
    if (collectedVouchers.includes(voucherId)) {
      toast.info("Bạn đã có voucher này trong ví!");
      return;
    }
    
    setCollectedVouchers([...collectedVouchers, voucherId]);
    toast.success(`Đã lưu mã ${voucherCode} vào Ví Voucher của bạn!`);
  };

  const isCollected = (voucherId: number) => {
    return collectedVouchers.includes(voucherId);
  };

  const toggleFilter = (filterArray: string[], setFilter: Function, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(item => item !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedDestinations([]);
    setSelectedTypes([]);
  };

  const PromotionCard = ({ voucher }: { voucher: any }) => {
    const collected = isCollected(voucher.id);
    
    return (
      <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div 
          className="relative h-48 overflow-hidden"
          onClick={() => setSelectedPromo(voucher)}
        >
          <ImageWithFallback
            src={voucher.image}
            alt={voucher.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badge */}
          <Badge className={`absolute top-3 right-3 ${voucher.badgeColor} text-white border-0`}>
            {voucher.badge}
          </Badge>

          {/* Days left indicator */}
          {voucher.daysLeft <= 7 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Còn {voucher.daysLeft} ngày
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 
            className="text-lg text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
            onClick={() => setSelectedPromo(voucher)}
          >
            {voucher.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            {voucher.description}
          </p>

          {/* Conditions summary */}
          <div className="space-y-1 mb-4 text-sm text-gray-600">
            {voucher.minSpend > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Đơn từ {voucher.minSpend.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>HSD: {voucher.endDate}</span>
            </div>
          </div>

          {/* Progress bar */}
          {voucher.totalUsesLimit && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Đã dùng: {voucher.usedCount}/{voucher.totalUsesLimit}</span>
                <span>{Math.round((voucher.usedCount / voucher.totalUsesLimit) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(voucher.usedCount / voucher.totalUsesLimit) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleCollectVoucher(voucher.id, voucher.code)}
              disabled={collected}
              className={`flex-1 ${collected ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {collected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Đã lấy
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4 mr-2" />
                  Lấy mã
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPromo(voucher)}
              className="px-3"
            >
              Chi tiết
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="promotions" onNavigate={onNavigate} />

      {/* Hero Slider */}
      <section className="relative h-[500px] overflow-hidden bg-gray-900">
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                <div className="max-w-2xl text-white">
                  <Badge className="bg-yellow-500 text-gray-900 mb-4">
                    ƯU ĐÃI HOT
                  </Badge>
                  <h1 className="text-5xl md:text-7xl mb-4">{banner.title}</h1>
                  <p className="text-xl md:text-2xl mb-6 text-white/90">
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-4">
                    <code className="bg-white text-gray-900 px-4 py-2 rounded text-lg">
                      {banner.code}
                    </code>
                    <Button 
                      size="lg"
                      onClick={() => handleCopyCode(banner.code)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    >
                      Sao chép mã
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + heroBanners.length) % heroBanners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % heroBanners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Bộ lọc
                  </h3>
                  {(selectedCategories.length > 0 || selectedDestinations.length > 0 || selectedTypes.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Xóa hết
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm mb-3 text-gray-700">Danh mục</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Tất cả', icon: Sparkles },
                      { value: 'hotel', label: 'Khách sạn', icon: Hotel },
                      { value: 'flight', label: 'Vé máy bay', icon: Plane },
                      { value: 'car', label: 'Thuê xe', icon: Car },
                      { value: 'activity', label: 'Hoạt động', icon: Activity }
                    ].map(category => {
                      const Icon = category.icon;
                      return (
                        <label key={category.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={selectedCategories.includes(category.value)}
                            onCheckedChange={() => toggleFilter(selectedCategories, setSelectedCategories, category.value)}
                          />
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{category.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Destination Filter */}
                <div className="mb-6">
                  <h4 className="text-sm mb-3 text-gray-700">Điểm đến</h4>
                  <div className="space-y-2">
                    {['Toàn quốc', 'Đà Nẵng', 'Phú Quốc', 'Hội An'].map(dest => (
                      <label key={dest} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedDestinations.includes(dest)}
                          onCheckedChange={() => toggleFilter(selectedDestinations, setSelectedDestinations, dest)}
                        />
                        <span className="text-sm">{dest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h4 className="text-sm mb-3 text-gray-700">Loại ưu đãi</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'PERCENTAGE', label: 'Giảm phần trăm' },
                      { value: 'FIXED_AMOUNT', label: 'Giảm tiền cố định' }
                    ].map(type => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedTypes.includes(type.value)}
                          onCheckedChange={() => toggleFilter(selectedTypes, setSelectedTypes, type.value)}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Main Vouchers Section */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-2xl text-gray-900">Ưu đãi hiện có</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </div>

            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="featured" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Nổi bật
                </TabsTrigger>
                <TabsTrigger value="expiring" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Sắp hết hạn
                </TabsTrigger>
                <TabsTrigger value="newest" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Mới nhất
                </TabsTrigger>
              </TabsList>

              {/* Featured Tab */}
              <TabsContent value="featured">
                {featuredVouchers.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">Không tìm thấy ưu đãi</h3>
                    <p className="text-gray-600">Thử thay đổi bộ lọc để xem thêm ưu đãi khác</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredVouchers.map(voucher => (
                      <PromotionCard key={voucher.id} voucher={voucher} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Expiring Tab */}
              <TabsContent value="expiring">
                {expiringVouchers.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">Không có ưu đãi sắp hết hạn</h3>
                    <p className="text-gray-600">Tất cả ưu đãi vẫn còn nhiều thời gian</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {expiringVouchers.map(voucher => (
                      <PromotionCard key={voucher.id} voucher={voucher} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Newest Tab */}
              <TabsContent value="newest">
                {newestVouchers.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">Không tìm thấy ưu đãi</h3>
                    <p className="text-gray-600">Thử thay đổi bộ lọc để xem thêm ưu đãi khác</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newestVouchers.map(voucher => (
                      <PromotionCard key={voucher.id} voucher={voucher} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Voucher Detail Modal */}
      {selectedPromo && (
        <Dialog open={!!selectedPromo} onOpenChange={() => setSelectedPromo(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết ưu đãi</DialogTitle>
              <DialogDescription>
                Xem thông tin đầy đủ về chương trình khuyến mãi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Cover Image */}
              <div className="relative h-64 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={selectedPromo.image}
                  alt={selectedPromo.title}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-4 right-4 ${selectedPromo.badgeColor} text-white border-0`}>
                  {selectedPromo.badge}
                </Badge>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">{selectedPromo.title}</h2>
                <p className="text-gray-600">{selectedPromo.description}</p>
              </div>

              {/* Voucher Code */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Mã voucher</p>
                <div className="flex items-center gap-3">
                  <code className="text-2xl text-gray-900 font-mono flex-1">
                    {selectedPromo.code}
                  </code>
                  <Button
                    onClick={() => handleCopyCode(selectedPromo.code)}
                    variant="outline"
                    className="gap-2"
                  >
                    {copiedCode === selectedPromo.code ? (
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

              {/* Main CTA */}
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  handleCollectVoucher(selectedPromo.id, selectedPromo.code);
                  setSelectedPromo(null);
                }}
                disabled={isCollected(selectedPromo.id)}
              >
                {isCollected(selectedPromo.id) ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Đã lưu vào Ví Voucher
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5 mr-2" />
                    Lấy mã và lưu vào Ví
                  </>
                )}
              </Button>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hạn sử dụng</p>
                  <p className="text-gray-900">{selectedPromo.startDate} - {selectedPromo.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giá trị</p>
                  <p className="text-gray-900">
                    {selectedPromo.type === 'PERCENTAGE' 
                      ? `Giảm ${selectedPromo.value}%` 
                      : `Giảm ${selectedPromo.value.toLocaleString('vi-VN')}đ`}
                  </p>
                </div>
                {selectedPromo.maxDiscount && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Giảm tối đa</p>
                    <p className="text-gray-900">{selectedPromo.maxDiscount.toLocaleString('vi-VN')}đ</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đơn hàng tối thiểu</p>
                  <p className="text-gray-900">{selectedPromo.minSpend.toLocaleString('vi-VN')}đ</p>
                </div>
                {selectedPromo.totalUsesLimit && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Giới hạn sử dụng</p>
                    <p className="text-gray-900">{selectedPromo.totalUsesLimit} lượt</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đã sử dụng</p>
                  <p className="text-gray-900">{selectedPromo.usedCount} lượt</p>
                </div>
              </div>

              {/* Conditions */}
              {selectedPromo.conditions && selectedPromo.conditions.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg text-gray-900 mb-3">Điều kiện áp dụng</h3>
                  <ul className="space-y-2">
                    {selectedPromo.conditions.map((condition: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Applicable Services */}
              {selectedPromo.applicableServices && selectedPromo.applicableServices.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg text-gray-900 mb-4">Dịch vụ áp dụng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPromo.applicableServices.map((service: any) => (
                      <Card key={service.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="relative h-32">
                          <ImageWithFallback
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm text-gray-900 mb-1 line-clamp-2">{service.name}</h4>
                          <p className="text-blue-600">{service.price.toLocaleString('vi-VN')}đ</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
