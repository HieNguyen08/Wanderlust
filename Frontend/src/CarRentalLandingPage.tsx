import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Fuel, Users, Settings } from "lucide-react";
import { Button } from "./components/ui/button";
import { Header } from "./components/Header";
import type { PageType } from "./MainApp";
import { Footer } from "./components/Footer";

interface CarRentalLandingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarRentalLandingPage({ onNavigate }: CarRentalLandingPageProps) {
  const popularCars = [
    {
      id: 1,
      name: "Koenigsegg",
      type: "Sport",
      image: "https://images.unsplash.com/photo-1742056024244-02a093dae0b5?w=800&h=600&fit=crop",
      gasoline: "90L",
      transmission: "Manual",
      capacity: "2 People",
      price: 99,
      liked: true,
    },
    {
      id: 2,
      name: "Nissan GT - R",
      type: "Sport",
      image: "https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=800&h=600&fit=crop",
      gasoline: "80L",
      transmission: "Manual",
      capacity: "2 People",
      price: 80,
      originalPrice: 100,
      liked: false,
    },
    {
      id: 3,
      name: "Rolls-Royce",
      type: "Sedan",
      image: "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800&h=600&fit=crop",
      gasoline: "70L",
      transmission: "Manual",
      capacity: "4 People",
      price: 96,
      liked: false,
    },
    {
      id: 4,
      name: "Nissan GT - R",
      type: "Sport",
      image: "https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=800&h=600&fit=crop",
      gasoline: "80L",
      transmission: "Manual",
      capacity: "2 People",
      price: 80,
      originalPrice: 100,
      liked: false,
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
    {
      id: 4,
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
      id: 5,
      name: "MG ZX Exclusice",
      type: "Hatchback",
      image: "https://images.unsplash.com/photo-1743809809295-cfd2a2e3d40f?w=800&h=600&fit=crop",
      gasoline: "70L",
      transmission: "Manual",
      capacity: "4 People",
      price: 76,
      originalPrice: 80,
      liked: false,
    },
    {
      id: 6,
      name: "New MG ZS",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1706752986827-f784d768d4c3?w=800&h=600&fit=crop",
      gasoline: "80L",
      transmission: "Manual",
      capacity: "6 People",
      price: 80,
      liked: false,
    },
    {
      id: 7,
      name: "MG ZX Excite",
      type: "Hatchback",
      image: "https://images.unsplash.com/photo-1743809809295-cfd2a2e3d40f?w=800&h=600&fit=crop",
      gasoline: "90L",
      transmission: "Manual",
      capacity: "4 People",
      price: 74,
      liked: true,
    },
    {
      id: 8,
      name: "New MG ZS",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1706752986827-f784d768d4c3?w=800&h=600&fit=crop",
      gasoline: "80L",
      transmission: "Manual",
      capacity: "6 People",
      price: 80,
      liked: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Header */}
      <Header currentPage="car-rental" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Hero Banners */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Banner 1 */}
          <div className="relative bg-[#54a6ff] rounded-xl overflow-hidden h-[360px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="space-y-8">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-[400px] h-[1px] bg-white/20" />
                ))}
              </div>
            </div>
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-white text-3xl font-semibold mb-4 max-w-[280px]">
                  Nền tảng tốt nhất cho thuê xe
                </h2>
                <p className="text-white text-base max-w-[280px] mb-6">
                  Dễ dàng thuê xe an toàn và đáng tin cậy. Tất nhiên với giá thấp.
                </p>
                <Button onClick={() => onNavigate("car-list")} className="bg-[#3563e9] hover:bg-[#264ac6] text-white">
                  Thuê xe
                </Button>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative bg-[#3563e9] rounded-xl overflow-hidden h-[360px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="space-y-8">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-[400px] h-[1px] bg-white/20" />
                ))}
              </div>
            </div>
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-white text-3xl font-semibold mb-4 max-w-[280px]">
                  Cách dễ dàng để thuê xe với giá thấp
                </h2>
                <p className="text-white text-base max-w-[280px] mb-6">
                  Cung cấp dịch vụ thuê xe giá rẻ và tiện nghi an toàn thoải mái.
                </p>
                <Button onClick={() => onNavigate("car-list")} className="bg-[#54a6ff] hover:bg-[#4295e8] text-white">
                  Thuê xe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pick-up / Drop-off Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 relative">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-blue-600/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              </div>
              <h3 className="font-semibold">Pick - Up</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Địa điểm</label>
                <select className="w-full text-sm text-gray-500">
                  <option>Chọn thành phố</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Ngày</label>
                <select className="w-full text-sm text-gray-500">
                  <option>Chọn ngày</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Giờ</label>
                <select className="w-full text-sm text-gray-500">
                  <option>Chọn giờ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <button className="w-[60px] h-[60px] bg-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6 text-white rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-[#54a6ff]/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#54a6ff]" />
              </div>
              <h3 className="font-semibold">Drop - Off</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Địa điểm</label>
                <select className="w-full text-sm text-gray-500">
                  <option>Chọn thành phố</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Ngày</label>
                <select className="w-full text-sm text-gray-500">
                  <option>Chọn ngày</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Giờ</label>
                <select className="w-full text-sm text-gray-500">
                  <option>Chọn giờ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Cars */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-600">Xe phổ biến</h2>
            <Button variant="link" onClick={() => onNavigate("car-list")} className="text-blue-600">
              Xem tất cả
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.map((car) => (
              <CarCard key={car.id} car={car} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* Recommended Cars */}
        <section className="mb-12">
          <h2 className="text-gray-600 mb-6">Xe đề xuất</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCars.map((car) => (
              <CarCard key={car.id} car={car} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* Show More */}
        <div className="flex items-center justify-between">
          <Button onClick={() => onNavigate("car-list")} className="bg-blue-600 hover:bg-blue-700 text-white mx-auto">
            Xem thêm xe
          </Button>
          <span className="text-sm text-gray-500">120 Xe</span>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function CarCard({ car, onNavigate }: { car: any; onNavigate: (page: PageType, data?: any) => void }) {
  return (
    <div onClick={() => onNavigate("car-detail", car)} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
          <p className="text-sm text-gray-500">{car.type}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-400 hover:text-red-500">
          <svg className="w-6 h-6" fill={car.liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="mb-6 h-24 flex items-center justify-center">
        <ImageWithFallback
          src={car.image}
          alt={car.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Fuel className="w-4 h-4" />
          <span>{car.gasoline}</span>
        </div>
        <div className="flex items-center gap-1">
          <Settings className="w-4 h-4" />
          <span>{car.transmission}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{car.capacity}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">${car.price}.00/ <span className="text-sm text-gray-500">ngày</span></p>
          {car.originalPrice && (
            <p className="text-sm text-gray-400 line-through">${car.originalPrice}.00</p>
          )}
        </div>
        <Button onClick={(e) => { e.stopPropagation(); onNavigate("car-payment", car); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          Thuê ngay
        </Button>
      </div>
    </div>
  );
}
