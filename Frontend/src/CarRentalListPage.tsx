import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ChevronDown, Fuel, Users, Settings, ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Slider } from "./components/ui/slider";
import type { PageType } from "./MainApp";
import { MoreDropdown } from "./TravelGuidePage";
import { Footer } from "./components/Footer";

interface CarRentalListPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarRentalListPage({ onNavigate }: CarRentalListPageProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Sport", "SUV"]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(["2 Person", "8 or More"]);
  const [maxPrice, setMaxPrice] = useState(100);

  const allCars = [
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
      type: "Sport",
      image: "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800&h=600&fit=crop",
      gasoline: "70L",
      transmission: "Manual",
      capacity: "4 People",
      price: 96,
      liked: false,
    },
    {
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
    {
      id: 9,
      name: "MG ZX Excite",
      type: "Hatchback",
      image: "https://images.unsplash.com/photo-1743809809295-cfd2a2e3d40f?w=800&h=600&fit=crop",
      gasoline: "90L",
      transmission: "Manual",
      capacity: "4 People",
      price: 74,
      liked: true,
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
        {/* Pick-up / Drop-off Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 relative">
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
                <select className="w-full text-sm text-gray-500 border rounded p-2">
                  <option>Chọn thành phố</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Ngày</label>
                <select className="w-full text-sm text-gray-500 border rounded p-2">
                  <option>Chọn ngày</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Giờ</label>
                <select className="w-full text-sm text-gray-500 border rounded p-2">
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
                <select className="w-full text-sm text-gray-500 border rounded p-2">
                  <option>Chọn thành phố</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Ngày</label>
                <select className="w-full text-sm text-gray-500 border rounded p-2">
                  <option>Chọn ngày</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Giờ</label>
                <select className="w-full text-sm text-gray-500 border rounded p-2">
                  <option>Chọn giờ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => onNavigate("car-rental")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
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

          {/* Car Grid */}
          <div className="md:col-span-3">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {allCars.map((car) => (
                <CarCard key={car.id} car={car} onNavigate={onNavigate} />
              ))}
            </div>

            {/* Show More */}
            <div className="flex items-center justify-between">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white mx-auto">
                Xem thêm xe
              </Button>
              <span className="text-sm text-gray-500">120 Xe</span>
            </div>
          </div>
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
