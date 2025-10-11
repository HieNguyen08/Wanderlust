import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import type { PageType } from "./MainApp";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

interface TravelGuidePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TravelGuidePage({ onNavigate }: TravelGuidePageProps) {
  const vietnamDestinations = [
    {
      id: "saigon",
      name: "Sài Gòn",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    },
    {
      id: "danang",
      name: "Đà Nẵng", 
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop",
    },
    {
      id: "hanoi",
      name: "Hà Nội",
      image: "https://images.unsplash.com/photo-1604391681301-2c1e5c6e0e9f?w=800&h=600&fit=crop",
    },
    {
      id: "sapa",
      name: "Sa Pa",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop",
    },
  ];

  const popularDestinations = [
    {
      id: "japan",
      name: "Nhật Bản",
      image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop",
      description: "Xứ sở hoa anh đào",
    },
    {
      id: "korea",
      name: "Hàn Quốc",
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop",
      description: "Xứ sở kim chi",
    },
    {
      id: "turkey",
      name: "Thổ Nhĩ Kỳ",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
      description: "Cầu nối Á - Âu",
    },
    {
      id: "france",
      name: "Pháp",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      description: "Kinh đô ánh sáng",
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Getting from Osaka to Tokyo: Best Transportation to Choose, Route, and Fares",
      image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Top Lombok Places to Visit: Top Attractions and Getting Around",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Đồng hồ Big Ben - Công trình kiến trúc biểu tượng của nước Anh",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    },
  ];

  const continents = [
    {
      id: "asia",
      name: "Asia",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop",
    },
    {
      id: "australia",
      name: "Australia & Oceania",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=400&fit=crop",
    },
    {
      id: "europe",
      name: "Europe",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    },
    {
      id: "america",
      name: "North America",
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop",
    },
  ];

  const handleDestinationClick = (destination: any) => {
    onNavigate("guide-detail", destination);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="travel-guide" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=1920&h=800&fit=crop"
          alt="Hạ Long Bay, Vietnam"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Find travel inspirations, your way!
            </h2>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 text-white text-xl">
          Hạ Long Bay, Vietnam
        </div>
      </div>

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Vietnam Travel Guide */}
        <section className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Cẩm nang du lịch
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Cẩm nang du lịch cho chuyến đi hoàn hảo
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vietnamDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleDestinationClick(dest)}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h4 className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                  {dest.name}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Các điểm đến phổ biến
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Hãy chuẩn bị hành lý và khám phá những điểm đến này ngay thôi!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleDestinationClick(dest)}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-white text-2xl font-bold mb-1">{dest.name}</h4>
                  <p className="text-white/90 text-sm">{dest.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Inspiration Blog */}
        <section className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Cảm hứng du lịch
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Đọc các bài viết sau để lên kế hoạch du lịch cho mình!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {post.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Explore the World */}
        <section>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Khám phá thế giới
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá các Châu lục trên thế giới
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {continents.map((continent) => (
              <div
                key={continent.id}
                className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={continent.image}
                  alt={continent.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h4 className="absolute bottom-6 left-6 text-white text-xl font-bold">
                  {continent.name}
                </h4>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
