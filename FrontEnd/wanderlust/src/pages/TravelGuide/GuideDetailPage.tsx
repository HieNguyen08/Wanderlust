import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ArrowLeft, Plane, Hotel, PartyPopper, MapPin, Star, Clock, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";

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
  // Mock data for attractions
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

  // Mock data for regions - "Khám phá thế giới"
  const regions = [
    {
      id: "tokyo",
      name: "Tokyo",
      country: destination.name,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    },
    {
      id: "hokkaido",
      name: "Hokkaido",
      country: destination.name,
      image: "https://images.unsplash.com/photo-1578469645742-27ccc53e5e0c?w=800&h=600&fit=crop",
    },
    {
      id: "osaka",
      name: "Osaka",
      country: destination.name,
      image: "https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800&h=600&fit=crop",
    },
  ];

  // Mock data for blog posts - "Cảm hứng du lịch"
  const blogPosts = [
    {
      id: 1,
      title: `Top ${destination.name} Places to Visit: Best Attractions and Getting Around`,
      image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop",
      readTime: "8 phút đọc",
    },
    {
      id: 2,
      title: `Du lịch ${destination.name}: Hành trình khám phá văn hóa và ẩm thực`,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
      readTime: "10 phút đọc",
    },
    {
      id: 3,
      title: `Kinh nghiệm du lịch ${destination.name} tự túc tiết kiệm`,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
      readTime: "12 phút đọc",
    },
  ];

  // Mock data for flights
  const flights = [
    {
      id: 1,
      airline: "Vietnam Airlines",
      from: "Hà Nội (HAN)",
      to: destination.name,
      departure: "08:00",
      arrival: "12:30",
      duration: "4h 30m",
      price: 3500000,
      logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      airline: "VietJet Air",
      from: "TP.HCM (SGN)",
      to: destination.name,
      departure: "10:15",
      arrival: "14:45",
      duration: "4h 30m",
      price: 2800000,
      logo: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      airline: "Bamboo Airways",
      from: "Đà Nẵng (DAD)",
      to: destination.name,
      departure: "14:00",
      arrival: "18:15",
      duration: "4h 15m",
      price: 3200000,
      logo: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=100&h=100&fit=crop",
    },
  ];

  // Mock data for hotels
  const hotels = [
    {
      id: 1,
      name: `Grand ${destination.name} Hotel`,
      location: `Trung tâm ${destination.name}`,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      rating: 4.8,
      reviews: 342,
      price: 2500000,
      amenities: ["Wi-Fi miễn phí", "Bể bơi", "Spa"],
    },
    {
      id: 2,
      name: `${destination.name} City View Hotel`,
      location: `Gần sân bay ${destination.name}`,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      rating: 4.6,
      reviews: 256,
      price: 1800000,
      amenities: ["Wi-Fi miễn phí", "Nhà hàng", "Gym"],
    },
    {
      id: 3,
      name: `Luxury ${destination.name} Resort`,
      location: `Bãi biển ${destination.name}`,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      rating: 4.9,
      reviews: 489,
      price: 4200000,
      amenities: ["Wi-Fi miễn phí", "Bể bơi", "Spa", "Golf"],
    },
  ];

  // Mock data for activities
  const activities = [
    {
      id: 1,
      name: `Tour tham quan ${destination.name} cả ngày`,
      location: destination.name,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
      rating: 4.7,
      reviews: 189,
      duration: "8 giờ",
      price: 850000,
      type: "Tour du lịch",
    },
    {
      id: 2,
      name: `Trải nghiệm ẩm thực ${destination.name}`,
      location: destination.name,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      rating: 4.9,
      reviews: 276,
      duration: "4 giờ",
      price: 650000,
      type: "Ẩm thực",
    },
    {
      id: 3,
      name: `Khám phá văn hóa ${destination.name}`,
      location: destination.name,
      image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop",
      rating: 4.8,
      reviews: 203,
      duration: "6 giờ",
      price: 750000,
      type: "Văn hóa",
    },
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}      {/* Hero Image Gallery */}
      <div className="w-full bg-gray-100 pt-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 max-h-[600px]">
          {/* Large image on left */}
          <div className="w-full h-[300px] md:h-[600px]">
            <ImageWithFallback
              src={heroImages[0]}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Two smaller images on right */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
            <div className="w-full h-[150px] md:h-[298px]">
              <ImageWithFallback
                src={heroImages[1]}
                alt={`${destination.name} 2`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full h-[150px] md:h-[298px]">
              <ImageWithFallback
                src={heroImages[2]}
                alt={`${destination.name} 3`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("travel-guide")}
            className="gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại cẩm nang
          </Button>
        </div>

        {/* Destination Info */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
            {destination.name}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            {destination.description || `${destination.name} là một trong những điểm đến châu Á có nền văn hóa, lịch sử và vẻ hiện đại hòa quyện với nhau một cách tinh tế. Là điểm đến đông khách, sở hữu nhiều thành phố sôi động, công viên quốc gia trên núi cùng hàng ngàn ngôi miếu và đền thờ, ${destination.name} đã trở thành một trong những điểm du lịch nổi tiếng. Chẳng ngạc nhiên khi nhiều thành phố lớn đều luôn đông khách du lịch quanh năm.`}
          </p>
        </section>

        {/* Tourist Attractions */}
        <section className="mb-16">
          <h2 className="text-3xl text-gray-900 mb-8">
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
                <h3 className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                  {attraction.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Flights */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl text-gray-900">Vé máy bay đến {destination.name}</h2>
                <p className="text-gray-600">Tìm chuyến bay phù hợp với bạn</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("flights", { destination: destination.name })}
              className="gap-2"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => (
              <Card
                key={flight.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate("search", { destination: destination.name })}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={flight.logo}
                      alt={flight.airline}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-gray-900">{flight.airline}</p>
                    <p className="text-sm text-gray-500">{flight.duration}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Từ:</span>
                    <span className="text-gray-900">{flight.from}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đến:</span>
                    <span className="text-gray-900">{flight.to}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Khởi hành:</span>
                    <span className="text-gray-900">{flight.departure}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-600">Từ</span>
                  <span className="text-2xl text-blue-600">
                    {flight.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Hotels */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Hotel className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl text-gray-900">Khách sạn tại {destination.name}</h2>
                <p className="text-gray-600">Chọn chỗ nghỉ lý tưởng cho chuyến đi</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("hotel", { destination: destination.name })}
              className="gap-2"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate("hotel-detail", { hotelId: hotel.id })}
              >
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({hotel.reviews} đánh giá)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-600">Từ/đêm</span>
                    <span className="text-xl text-purple-600">
                      {hotel.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Activities */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <PartyPopper className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl text-gray-900">Hoạt động vui chơi tại {destination.name}</h2>
                <p className="text-gray-600">Khám phá những trải nghiệm thú vị</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("activities", { destination: destination.name })}
              className="gap-2"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate("activity-detail", { activityId: activity.id })}
              >
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <Badge className="mb-2">{activity.type}</Badge>
                  <h3 className="text-xl text-gray-900 mb-2">{activity.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900">{activity.rating}</span>
                      <span className="text-sm text-gray-500">({activity.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{activity.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-600">Từ</span>
                    <span className="text-xl text-green-600">
                      {activity.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Travel Inspiration - Blog Posts */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">Cảm hứng du lịch {destination.name}</h2>
            <p className="text-gray-600">Những bài viết hữu ích cho chuyến đi của bạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate("travel-article", { 
                  article: { 
                    ...post, 
                    destination: destination.name,
                    category: "Cẩm nang du lịch"
                  } 
                })}
              >
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore Regions */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">
              Khám phá thế giới
            </h2>
            <p className="text-gray-600 text-lg">
              Khám phá các khu vực khác tại {destination.name}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <div
                key={region.id}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => onNavigate("guide-detail", { 
                  destination: { 
                    id: region.id, 
                    name: region.name,
                    description: `Khám phá vùng ${region.name} tại ${region.country}`
                  } 
                })}
              >
                <ImageWithFallback
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl mb-2">{region.name}</h3>
                  <p className="text-white/90">{region.country}</p>
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
