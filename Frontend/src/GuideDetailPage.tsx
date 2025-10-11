import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import type { PageType } from "./MainApp";
import { MoreDropdown } from "./TravelGuidePage";
import { Footer } from "./components/Footer";

interface GuideDetailPageProps {
  destination: {
    id: string;
    name: string;
    image?: string;
    description?: string;
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function GuideDetailPage({ destination, onNavigate }: GuideDetailPageProps) {
  // Mock data for Japan (default example)
  const attractions = [
    {
      name: "Nishiki Market",
      image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop",
    },
    {
      name: "Sensoji Temple",
      image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop",
    },
    {
      name: "Tokyo Sky Tree",
      image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=600&fit=crop",
    },
  ];

  const regions = [
    {
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    },
    {
      name: "Hokkaido",
      image: "https://images.unsplash.com/photo-1578469645742-27ccc53e5e0c?w=800&h=600&fit=crop",
    },
    {
      name: "Osaka",
      image: "https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800&h=600&fit=crop",
    },
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 
              className="font-['Kadwa',_serif] text-2xl md:text-3xl text-white drop-shadow-lg cursor-pointer" 
              onClick={() => onNavigate("home")}
            >
              Wanderlust
            </h1>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-2 rounded-lg">
                <div className="w-5 h-5 bg-red-600 rounded-full"></div>
                <span className="text-white">VI</span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
              <div className="hidden md:flex gap-3">
                <Button variant="outline" className="bg-white hover:bg-gray-50 text-blue-600 border-none px-6 h-[38px]">
                  Đăng nhập
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-[38px]">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8 text-white drop-shadow-lg pb-4">
            <button onClick={() => onNavigate("flights")} className="hover:text-yellow-300 transition-colors">Vé máy bay</button>
            <button onClick={() => onNavigate("hotel")} className="hover:text-yellow-300 transition-colors">Khách sạn</button>
            <button className="hover:text-yellow-300 transition-colors">Visa</button>
            <button onClick={() => onNavigate("car-rental")} className="hover:text-yellow-300 transition-colors">Thuê xe</button>
            <button onClick={() => onNavigate("activities")} className="hover:text-yellow-300 transition-colors">Hoạt động vui chơi</button>
            <button onClick={() => onNavigate("travel-guide")} className="hover:text-yellow-300 transition-colors text-yellow-300">Cẩm nang du lịch</button>
          </nav>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="grid grid-cols-2 gap-0 h-[500px]">
        <div className="col-span-1 row-span-2">
          <ImageWithFallback
            src={heroImages[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="col-span-1">
          <ImageWithFallback
            src={heroImages[1]}
            alt={`${destination.name} 2`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="col-span-1">
          <ImageWithFallback
            src={heroImages[2]}
            alt={`${destination.name} 3`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("travel-guide")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại cẩm nang
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Destination Info */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {destination.name}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            {destination.description || `${destination.name} là một trong những quốc gia châu Á có nền văn hóa, lịch sử và vẻ hiện đại hòa quyện với nhau một cách tinh tế. Là quốc gia đông dân, sở hữu nhiều thành trì vua chúa, công viên quốc gia trên núi cùng hàng ngàn ngôi miếu và đền thờ, ${destination.name} đã trở thành một trong những điểm du lịch nổi tiếng. Chẳng ngạc nhiên khi nhiều thành phố lớn đều luôn đông khách du lịch quanh năm.`}
          </p>
        </section>

        {/* Tourist Attractions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Điểm tham quan du lịch {destination.name} nổi tiếng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="h-64 rounded-2xl overflow-hidden mb-4">
                  <ImageWithFallback
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {attraction.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Regions */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Khám phá thế giới
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá các Châu lục trên thế giới
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region, index) => (
              <div
                key={index}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">{region.name}</h3>
                  <p className="text-white/90">{destination.name}</p>
                </div>
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
