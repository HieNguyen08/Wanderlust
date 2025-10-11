import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import type { PageType } from "./MainApp";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

interface PromotionsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function PromotionsPage({ onNavigate }: PromotionsPageProps) {
  // Featured promotions
  const featuredPromos = [
    {
      id: 1,
      title: "Vé máy bay giảm 25%",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
      badge: "Giảm 25%",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 2,
      title: "Hoạt động vui chơi giảm 25%",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop",
      badge: "Giảm 25%",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      title: "Khách sạn giảm 25%",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      badge: "Giảm 25%",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Tour packages
  const tourPackages = [
    {
      id: 1,
      name: "Phú Quốc - Vinpearl Land & Safari",
      location: "Phú Quốc, Việt Nam",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      price: 2500000,
      originalPrice: 3500000,
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: "Đà Nẵng - Hội An 3N2Đ",
      location: "Đà Nẵng, Việt Nam",
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop",
      price: 1800000,
      originalPrice: 2500000,
      rating: 4.9,
      reviews: 456,
    },
    {
      id: 3,
      name: "Nha Trang - Vinpearl Resort",
      location: "Nha Trang, Việt Nam",
      image: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800&h=600&fit=crop",
      price: 2200000,
      originalPrice: 3000000,
      rating: 4.7,
      reviews: 189,
    },
    {
      id: 4,
      name: "Sa Pa - Fansipan 2N1Đ",
      location: "Sa Pa, Việt Nam",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop",
      price: 1500000,
      originalPrice: 2000000,
      rating: 4.6,
      reviews: 321,
    },
  ];

  // Best hotels
  const bestHotels = [
    {
      id: 1,
      name: "JW Marriott Phu Quoc",
      location: "Phú Quốc",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      price: 3500000,
      rating: 4.9,
    },
    {
      id: 2,
      name: "InterContinental Danang",
      location: "Đà Nẵng",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      price: 2800000,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Vinpearl Resort & Spa",
      location: "Nha Trang",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      price: 2500000,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Azerai La Residence",
      location: "Huế",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      price: 3200000,
      rating: 4.9,
    },
  ];

  // International destinations
  const internationalDestinations = [
    {
      id: 1,
      name: "Bangkok",
      country: "Thái Lan",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop",
      tours: 45,
    },
    {
      id: 2,
      name: "Singapore",
      country: "Singapore",
      image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop",
      tours: 32,
    },
    {
      id: 3,
      name: "Tokyo",
      country: "Nhật Bản",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      tours: 28,
    },
    {
      id: 4,
      name: "Seoul",
      country: "Hàn Quốc",
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop",
      tours: 36,
    },
    {
      id: 5,
      name: "Paris",
      country: "Pháp",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      tours: 24,
    },
    {
      id: 6,
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
      tours: 41,
    },
  ];

  // Beach destinations
  const beachDestinations = [
    {
      id: 1,
      name: "Côn Đảo",
      description: "Thiên đường biển đảo yên bình",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      price: 2800000,
    },
    {
      id: 2,
      name: "Đảo Phú Quý",
      description: "Hoang sơ và kỳ vĩ",
      image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&h=600&fit=crop",
      price: 1900000,
    },
    {
      id: 3,
      name: "Lý Sơn",
      description: "Vương quốc tỏi giữa biển",
      image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&h=600&fit=crop",
      price: 1500000,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="promotions" onNavigate={onNavigate} />

      {/* Hero Banner - Ưu đãi 100% */}
      <section className="relative h-[400px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=800&fit=crop"
          alt="Ưu đãi 100%"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">Ưu đãi 100%</h2>
              <p className="text-xl md:text-2xl mb-6">
                Khám phá những ưu đãi tuyệt vời cho chuyến du lịch của bạn
              </p>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                Khám phá ngay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Featured Promotions */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Khuyến mãi đặc biệt cho bạn
          </h3>
          <p className="text-gray-600 mb-8">
            Tiết kiệm ngay hôm nay với các ưu đãi độc quyền
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPromos.map((promo) => (
              <div
                key={promo.id}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-80`} />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <Badge className="bg-white text-gray-900 self-start">
                    {promo.badge}
                  </Badge>
                  <h4 className="text-white text-2xl font-bold">
                    {promo.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tours phổ biến */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Tours phổ biến
              </h3>
              <p className="text-gray-600">
                Những tour du lịch được yêu thích nhất
              </p>
            </div>
            <Button variant="outline">Xem tất cả</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tourPackages.map((tour) => (
              <div
                key={tour.id}
                onClick={() => onNavigate("tour-detail", tour)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                    Giảm {Math.round((1 - tour.price / tour.originalPrice) * 100)}%
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{tour.location}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {tour.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{tour.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({tour.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-400 line-through">
                        {tour.originalPrice.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        {tour.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Đặt phòng vé tốt nhất */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Đặt phòng giá tốt nhất
              </h3>
              <p className="text-gray-600">
                Khách sạn cao cấp với giá ưu đãi
              </p>
            </div>
            <Button variant="outline">Xem tất cả</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {hotel.price.toLocaleString('vi-VN')}đ
                    <span className="text-sm font-normal text-gray-600">/đêm</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Đặt phòng vé tốt nhất (International) */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Điểm đến quốc tế
              </h3>
              <p className="text-gray-600">
                Khám phá thế giới với các tour quốc tế
              </p>
            </div>
            <Button variant="outline">Xem tất cả</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {internationalDestinations.map((dest) => (
              <div
                key={dest.id}
                className="relative h-40 rounded-xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-white font-bold mb-1">{dest.name}</h4>
                  <p className="text-white/90 text-sm">{dest.tours} tours</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bãi biển nổi tiếng */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Bãi biển nổi tiếng
              </h3>
              <p className="text-gray-600">
                Những bãi biển đẹp nhất Việt Nam
              </p>
            </div>
            <Button variant="outline">Xem tất cả</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beachDestinations.map((beach) => (
              <div
                key={beach.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {beach.name}
                  </h4>
                  <p className="text-gray-600 mb-3">
                    {beach.description}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    Từ {beach.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              Đăng ký nhận ưu đãi đặc biệt
            </h3>
            <p className="text-lg mb-6">
              Nhận thông tin về các chương trình khuyến mãi và ưu đãi độc quyền
            </p>
            <div className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
