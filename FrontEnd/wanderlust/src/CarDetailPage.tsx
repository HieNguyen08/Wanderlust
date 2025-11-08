import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowLeft, Star, Fuel, Settings, Users, ThumbsUp, Heart, MapPin, Calendar, Shield, CheckCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Input } from "./components/ui/input";
import type { PageType } from "./MainApp";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

interface CarDetailPageProps {
  car: {
    id: number;
    name: string;
    type: string;
    image: string;
    gasoline: string;
    transmission: string;
    capacity: string;
    price: number;
    originalPrice?: number;
    rating?: number;
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarDetailPage({ car, onNavigate }: CarDetailPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const carImages = [
    car.image,
    "https://images.unsplash.com/photo-1648799833118-c989da6907d7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=800&h=600&fit=crop",
  ];

  const features = [
    { icon: Shield, label: "Bảo hiểm toàn diện", desc: "Được bảo hiểm đầy đủ" },
    { icon: MapPin, label: "Giao xe tận nơi", desc: "Miễn phí trong thành phố" },
    { icon: Calendar, label: "Đặt xe linh hoạt", desc: "Hủy miễn phí trong 24h" },
    { icon: CheckCircle, label: "Xe đã kiểm tra", desc: "Đảm bảo an toàn" },
  ];

  const specifications = [
    { label: "Loại xe", value: car.type },
    { label: "Sức chứa", value: car.capacity },
    { label: "Hộp số", value: car.transmission },
    { label: "Nhiên liệu", value: car.gasoline },
    { label: "Năm sản xuất", value: "2023" },
    { label: "Màu sắc", value: "Đen" },
  ];

  const reviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Khách hàng VIP",
      date: "21/10/2024",
      rating: 5,
      content: "Dịch vụ tuyệt vời! Xe sạch sẽ, tiện nghi đầy đủ. Nhân viên hỗ trợ rất nhiệt tình. Chắc chắn sẽ quay lại sử dụng dịch vụ.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Khách hàng",
      date: "18/10/2024",
      rating: 5,
      content: "Xe đẹp, giá cả hợp lý. Quy trình thuê xe nhanh chóng, tiện lợi. Rất hài lòng với trải nghiệm này!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Khách hàng",
      date: "15/10/2024",
      rating: 4,
      content: "Xe tốt, dịch vụ chuyên nghiệp. Có thể cải thiện thêm về thời gian giao xe để nhanh hơn.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ];

  const recommendedCars = [
    {
      id: 101,
      name: "All New Rush",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800&h=600&fit=crop",
      gasoline: "70L",
      transmission: "Manual",
      capacity: "6 People",
      price: 72,
      originalPrice: 80,
      liked: false,
      rating: 4.7,
    },
    {
      id: 102,
      name: "CR - V",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1706752986827-f784d768d4c3?w=800&h=600&fit=crop",
      gasoline: "80L",
      transmission: "Manual",
      capacity: "6 People",
      price: 80,
      liked: true,
      rating: 4.8,
    },
    {
      id: 103,
      name: "All New Terios",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800&h=600&fit=crop",
      gasoline: "90L",
      transmission: "Manual",
      capacity: "6 People",
      price: 74,
      liked: false,
      rating: 4.6,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header currentPage="car-rental" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        <Button
          variant="ghost"
          onClick={() => onNavigate("car-list")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Images */}
            <Card className="p-6 border-0 shadow-lg">
              {/* Main Image */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4">
                <ImageWithFallback
                  src={carImages[selectedImage]}
                  alt={car.name}
                  className="w-full h-[400px] object-contain"
                />
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-3">
                {carImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-blue-600 shadow-lg' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${car.name} ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* Car Info */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl text-gray-900 mb-2">{car.name}</h1>
                  <Badge variant="outline" className="mb-3">{car.type}</Badge>
                  {car.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(car.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{car.rating}/5 • 440+ Đánh giá</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg mb-3 text-gray-900">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">
                  {car.name} là một chiếc xe {car.type.toLowerCase()} cao cấp, mang đến sự kết hợp hoàn hảo 
                  giữa hiệu suất mạnh mẽ và sự thoải mái tuyệt đối. Với thiết kế hiện đại và trang bị 
                  tiện nghi đầy đủ, xe phù hợp cho c��� chuyến đi công tác lẫn du lịch gia đình.
                </p>
              </div>

              <Separator className="my-4" />

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="text-lg mb-4 text-gray-900">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-2 gap-4">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Features */}
              <div>
                <h3 className="text-lg mb-4 text-gray-900">Tiện ích</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <feature.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1">{feature.label}</p>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-gray-900">Đánh giá</h2>
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  {reviews.length} đánh giá
                </Badge>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={review.avatar}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-gray-900">{review.name}</h4>
                            <p className="text-sm text-gray-500">{review.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">{review.date}</p>
                            <div className="flex gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">Hữu ích</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Cars */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">Xe đề xuất</h2>
                  <p className="text-gray-600">Xe tương tự bạn có thể thích</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate("car-list")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Xem tất cả →
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedCars.map((recCar) => (
                  <Card 
                    key={recCar.id} 
                    onClick={() => onNavigate("car-detail", recCar)}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {recCar.name}
                          </h3>
                          <p className="text-sm text-gray-500">{recCar.type}</p>
                        </div>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="transition-transform hover:scale-110"
                        >
                          <Heart className={`w-6 h-6 ${recCar.liked ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                        </button>
                      </div>

                      <div className="mb-6 h-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 group-hover:scale-105 transition-transform">
                        <ImageWithFallback
                          src={recCar.image}
                          alt={recCar.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Fuel className="w-4 h-4 text-blue-600" />
                          <span>{recCar.gasoline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings className="w-4 h-4 text-blue-600" />
                          <span>{recCar.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>{recCar.capacity}</span>
                        </div>
                      </div>

                      {recCar.rating && (
                        <div className="flex items-center gap-1 mb-4">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{recCar.rating}</span>
                          <span className="text-sm text-gray-500">(Tuyệt vời)</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl text-blue-600">${recCar.price}</span>
                            <span className="text-sm text-gray-500">/ngày</span>
                          </div>
                          {recCar.originalPrice && (
                            <p className="text-sm text-gray-400 line-through">${recCar.originalPrice}</p>
                          )}
                        </div>
                        <Button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onNavigate("car-review", {
                              car: { id: recCar.id, name: recCar.name, type: recCar.type, image: recCar.image, transmission: recCar.transmission, capacity: recCar.capacity },
                              rental: { pickupDate: "Thứ 7, 8/11/2025", pickupTime: "09:00", dropoffDate: "Thứ 2, 10/11/2025", dropoffTime: "09:00", pickupLocation: "Pool Bandara CGK", dropoffLocation: "Pool Bandara CGK", days: 2 },
                              pricing: { carPrice: recCar.price * 2, fees: 0, deposit: recCar.price * 1.5 }
                            });
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          Thuê ngay
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-xl sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl text-blue-600">${car.price}</span>
                  <span className="text-gray-500">/ngày</span>
                </div>
                {car.originalPrice && (
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-gray-400 line-through">${car.originalPrice}</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Tiết kiệm ${car.originalPrice - car.price}
                    </Badge>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Ngày nhận xe</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Ngày trả xe</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Địa điểm nhận xe</label>
                  <Input placeholder="Nhập địa điểm" />
                </div>
              </div>

              <Button 
                onClick={() => onNavigate("car-review", {
                  car: { id: car.id, name: car.name, type: car.type, image: car.image, transmission: car.transmission, capacity: car.capacity },
                  rental: { pickupDate: "Thứ 7, 8/11/2025", pickupTime: "09:00", dropoffDate: "Thứ 2, 10/11/2025", dropoffTime: "09:00", pickupLocation: "Pool Bandara CGK", dropoffLocation: "Pool Bandara CGK", days: 2 },
                  pricing: { carPrice: car.price * 2, fees: 0, deposit: car.price * 1.5 }
                })} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mb-4"
                size="lg"
              >
                Đặt xe ngay
              </Button>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Miễn phí hủy trong 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Bảo hiểm toàn diện</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
