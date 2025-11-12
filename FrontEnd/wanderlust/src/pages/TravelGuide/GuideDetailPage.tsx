import { useState, useEffect } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ArrowLeft, Plane, Hotel, PartyPopper, MapPin, Star, Clock, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";
// Sử dụng API thật kết nối MongoDB local:
import { travelGuideApi } from "../../utils/api";
// Test API (không dùng nữa):
// import { testTravelGuideApi as travelGuideApi } from "../../utils/testApi";
import type { TravelGuide } from "../../types/travelGuide";

interface GuideDetailPageProps {
  guide: TravelGuide;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function GuideDetailPage({ guide: initialGuide, onNavigate }: GuideDetailPageProps) {
  const [guide, setGuide] = useState<TravelGuide | null>(initialGuide || null);
  const [relatedGuides, setRelatedGuides] = useState<TravelGuide[]>([]);
  const [blogPosts, setBlogPosts] = useState<TravelGuide[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        setLoading(true);
        
        // Nếu có ID, fetch lại guide để có dữ liệu đầy đủ và tăng views
        if (initialGuide?.id) {
          try {
            const fullGuide = await travelGuideApi.getById(initialGuide.id);
            setGuide(fullGuide);
            
            // Fetch related guides cùng country
            if (fullGuide.country) {
              const related = await travelGuideApi.getByCountry(fullGuide.country);
              setRelatedGuides(
                related.filter((g: TravelGuide) => g.id !== fullGuide.id && g.type === "destination").slice(0, 3)
              );
            }
          } catch (error) {
            console.error("Error fetching guide by ID:", error);
            // Nếu fetch fail, vẫn dùng initialGuide
            setGuide(initialGuide);
          }
        } else {
          // Nếu không có ID, dùng luôn initialGuide
          setGuide(initialGuide);
        }
        
        // Fetch blog posts
        try {
          const blogs = await travelGuideApi.getByType("blog");
          setBlogPosts(blogs.slice(0, 3));
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
        
      } catch (error) {
        console.error("Error fetching guide details:", error);
        // Fallback to initial guide
        setGuide(initialGuide);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [initialGuide]);

  // Loading or error state
  if (!guide) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin cẩm nang...</p>
        </div>
      </div>
    );
  }

  // Mock data cho flights, hotels, activities (sẽ được thay thế sau)
  const flights: any[] = [];
  const hotels: any[] = [];
  const activities: any[] = [];

  // Hero images - sử dụng từ guide hoặc fallback
  const heroImages = guide.images && guide.images.length > 0 
    ? guide.images 
    : [guide.coverImage];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}      {/* Hero Image Gallery */}
      <div className="w-full bg-gray-100 pt-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 max-h-[600px]">
          {/* Large image on left */}
          <div className="w-full h-[300px] md:h-[600px]">
            <ImageWithFallback
              src={heroImages[0] || guide.coverImage}
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Two smaller images on right */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
            <div className="w-full h-[150px] md:h-[298px]">
              <ImageWithFallback
                src={heroImages[1] || guide.coverImage}
                alt={`${guide.title} 2`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full h-[150px] md:h-[298px]">
              <ImageWithFallback
                src={heroImages[2] || guide.coverImage}
                alt={`${guide.title} 3`}
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
            {guide.title}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            {guide.description || `${guide.title} là một điểm đến tuyệt vời với nhiều trải nghiệm thú vị đang chờ bạn khám phá.`}
          </p>
        </section>

        {/* Tourist Attractions */}
        <section className="mb-16">
          <h2 className="text-3xl text-gray-900 mb-8">
            Điểm tham quan du lịch {guide.title} nổi tiếng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guide.attractions && guide.attractions.length > 0 ? (
              guide.attractions.map((attraction, index) => (
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
              ))
            ) : (
              <p className="text-gray-500 col-span-3">Chưa có thông tin điểm tham quan</p>
            )}
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
                <h2 className="text-3xl text-gray-900">Vé máy bay đến {guide.title}</h2>
                <p className="text-gray-600">Tìm chuyến bay phù hợp với bạn</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("flights", { destination: guide.title })}
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
                onClick={() => onNavigate("search", { destination: guide.title })}
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
                <h2 className="text-3xl text-gray-900">Khách sạn tại {guide.title}</h2>
                <p className="text-gray-600">Chọn chỗ nghỉ lý tưởng cho chuyến đi</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("hotel", { destination: guide.title })}
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
                <h2 className="text-3xl text-gray-900">Hoạt động vui chơi tại {guide.title}</h2>
                <p className="text-gray-600">Khám phá những trải nghiệm thú vị</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("activities", { destination: guide.title })}
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
            <h2 className="text-3xl text-gray-900 mb-2">Cảm hứng du lịch {guide.title}</h2>
            <p className="text-gray-600">Những bài viết hữu ích cho chuyến đi của bạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate("guide-detail", { guide: post })}
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
              Khám phá các điểm đến khác
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedGuides && relatedGuides.length > 0 ? (
              relatedGuides.map((relatedGuide) => (
                <div
                  key={relatedGuide.id}
                  className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => onNavigate("guide-detail", { guide: relatedGuide })}
                >
                  <ImageWithFallback
                    src={relatedGuide.coverImage}
                    alt={relatedGuide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl mb-2">{relatedGuide.title}</h3>
                    <p className="text-white/90">{relatedGuide.country}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3">Chưa có cẩm nang liên quan</p>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
