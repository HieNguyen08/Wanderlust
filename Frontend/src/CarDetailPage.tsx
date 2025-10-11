import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ChevronDown, ArrowLeft, Star, Fuel, Settings, Users, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Slider } from "./components/ui/slider";
import type { PageType } from "./MainApp";
import { MoreDropdown } from "./TravelGuidePage";
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
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarDetailPage({ car, onNavigate }: CarDetailPageProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Sport", "SUV"]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(["2 Person", "8 or More"]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isLiked, setIsLiked] = useState(false);

  const carImages = [
    car.image,
    "https://images.unsplash.com/photo-1648799833118-c989da6907d7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=400&h=300&fit=crop",
  ];

  const reviews = [
    {
      id: 1,
      name: "Alex Stanton",
      role: "CEO at Bukalapak",
      date: "21 July 2022",
      rating: 4,
      content: "We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.",
      avatar: "https://images.unsplash.com/photo-1724435811349-32d27f4d5806?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Skylar Dias",
      role: "CEO at Amazon",
      date: "20 July 2022",
      rating: 4,
      content: "We are greatly helped by the services of the MORENT Application. Morent has low prices and also a wide variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.",
      avatar: "https://images.unsplash.com/photo-1724435811349-32d27f4d5806?w=100&h=100&fit=crop",
    },
  ];

  const recommendedCars = [
    {
      id: 1,
      name: "All New Rush",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800&h=600&fit=crop",
      gasoline: "70L",
      transmission: "Manual",
      capacity: "6 People",
      price: 72,
      originalPrice: 80,
      liked: false,
    },
    {
      id: 2,
      name: "CR - V",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1706752986827-f784d768d4c3?w=800&h=600&fit=crop",
      gasoline: "80L",
      transmission: "Manual",
      capacity: "6 People",
      price: 80,
      liked: true,
    },
    {
      id: 3,
      name: "All New Terios",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800&h=600&fit=crop",
      gasoline: "90L",
      transmission: "Manual",
      capacity: "6 People",
      price: 74,
      liked: false,
    },
  ];

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCapacity = (capacity: string) => {
    setSelectedCapacities(prev =>
      prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
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
            <button className="text-yellow-300 font-semibold">Thuê xe</button>
            <button onClick={() => onNavigate("activities")} className="hover:text-yellow-300 transition-colors">Hoạt động vui chơi</button>
            <button onClick={() => onNavigate("travel-guide")} className="hover:text-yellow-300 transition-colors">Cẩm nang du lịch</button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate("car-list")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="bg-white rounded-xl p-6 h-fit">
            <div className="mb-8">
              <h3 className="text-xs text-gray-500 mb-6 tracking-wider">LOẠI XE</h3>
              <div className="space-y-4">
                {[
                  { label: "Sport", count: 10 },
                  { label: "SUV", count: 12 },
                  { label: "MPV", count: 16 },
                  { label: "Sedan", count: 20 },
                  { label: "Coupe", count: 14 },
                  { label: "Hatchback", count: 14 },
                ].map((type) => (
                  <div key={type.label} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedTypes.includes(type.label)}
                      onCheckedChange={() => toggleType(type.label)}
                    />
                    <label className="text-base font-semibold text-gray-700 cursor-pointer flex-1">
                      {type.label} <span className="text-gray-400">({type.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs text-gray-500 mb-6 tracking-wider">SỨC CHỨA</h3>
              <div className="space-y-4">
                {[
                  { label: "2 Person", count: 10 },
                  { label: "4 Person", count: 14 },
                  { label: "6 Person", count: 12 },
                  { label: "8 or More", count: 16 },
                ].map((capacity) => (
                  <div key={capacity.label} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCapacities.includes(capacity.label)}
                      onCheckedChange={() => toggleCapacity(capacity.label)}
                    />
                    <label className="text-base font-semibold text-gray-700 cursor-pointer flex-1">
                      {capacity.label} <span className="text-gray-400">({capacity.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs text-gray-500 mb-6 tracking-wider">GIÁ</h3>
              <Slider
                value={[maxPrice]}
                onValueChange={(value) => setMaxPrice(value[0])}
                max={100}
                step={1}
                className="mb-3"
              />
              <p className="font-semibold text-lg text-gray-700">Max. ${maxPrice}.00</p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Car Detail Card */}
            <div className="bg-white rounded-xl p-6">
              {/* Hero Banner */}
              <div className="bg-blue-600 rounded-xl p-6 mb-6 relative overflow-hidden h-[360px]">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="space-y-8">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-[400px] h-[1px] bg-white/20" />
                    ))}
                  </div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-white text-3xl font-semibold mb-4 max-w-[280px]">
                    Sports car with the best design and acceleration
                  </h2>
                  <p className="text-white text-base max-w-[280px] mb-6">
                    Safety and comfort while driving a futuristic and elegant sports car
                  </p>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {carImages.map((img, idx) => (
                  <div key={idx} className={`rounded-xl overflow-hidden ${idx === 0 ? 'border-2 border-blue-600' : ''}`}>
                    <ImageWithFallback
                      src={img}
                      alt={`${car.name} ${idx + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Car Info */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-600">440+ Reviewer</span>
                  </div>
                </div>
                <button onClick={() => setIsLiked(!isLiked)}>
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                NISMO has become the embodiment of Nissan's outstanding performance, inspired by the most unforgiving proving ground, the "race track".
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Type Car</span>
                  <span className="font-semibold text-gray-700">{car.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-gray-700">{car.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Steering</span>
                  <span className="font-semibold text-gray-700">{car.transmission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Gasoline</span>
                  <span className="font-semibold text-gray-700">{car.gasoline}</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  <p className="text-2xl font-bold">${car.price}.00/ <span className="text-sm text-gray-500">ngày</span></p>
                  {car.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">${car.originalPrice}.00</p>
                  )}
                </div>
                <Button onClick={() => onNavigate("car-payment", car)} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Rent Now
                </Button>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Reviews</h2>
                <span className="bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded">13</span>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                          <ImageWithFallback
                            src={review.avatar}
                            alt={review.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">{review.name}</h3>
                          <p className="text-sm text-gray-500">{review.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">Not helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-6">
                Show All
              </Button>
            </div>

            {/* Recommended Cars */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-600">Xe đề xuất</h2>
                <Button variant="link" className="text-blue-600">
                  View All
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedCars.map((recCar) => (
                  <div key={recCar.id} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{recCar.name}</h3>
                        <p className="text-sm text-gray-500">{recCar.type}</p>
                      </div>
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className={`w-6 h-6 ${recCar.liked ? 'fill-current text-red-500' : ''}`} />
                      </button>
                    </div>

                    <div className="mb-6 h-24 flex items-center justify-center">
                      <ImageWithFallback
                        src={recCar.image}
                        alt={recCar.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span>{recCar.gasoline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>{recCar.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{recCar.capacity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">${recCar.price}.00/ <span className="text-sm text-gray-500">ngày</span></p>
                        {recCar.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">${recCar.originalPrice}.00</p>
                        )}
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Thuê ngay
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
