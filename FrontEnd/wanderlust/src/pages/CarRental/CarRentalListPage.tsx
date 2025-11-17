import { ArrowLeft, ArrowUpDown, Filter, Fuel, Heart, Settings, SlidersHorizontal, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import type { PageType } from "../../MainApp";
import { carRentalApi } from "../../utils/api";

interface CarRentalListPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarRentalListPage({ onNavigate }: CarRentalListPageProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCars, setVisibleCars] = useState(9);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");

  // Backend data state
  const [allCars, setAllCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cars from backend
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const cars = await carRentalApi.search({
          minPrice: 0,
          maxPrice: maxPrice,
          type: selectedTypes.length > 0 ? selectedTypes[0] : undefined,
        });
        setAllCars(cars);
      } catch (error) {
        console.error('Failed to load cars:', error);
        toast.error('Không thể tải danh sách xe');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [maxPrice, selectedTypes]);

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

  const swapPickupDropoff = () => {
    const tempLocation = pickupLocation;
    const tempDate = pickupDate;
    const tempTime = pickupTime;

    setPickupLocation(dropoffLocation);
    setPickupDate(dropoffDate);
    setPickupTime(dropoffTime);

    setDropoffLocation(tempLocation);
    setDropoffDate(tempDate);
    setDropoffTime(tempTime);
  };

  // Filter cars based on selected criteria
  const filteredCars = allCars.filter(car => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(car.type);
    const capacityMatch = selectedCapacities.length === 0 || selectedCapacities.includes(car.capacity);
    const priceMatch = car.price <= maxPrice;
    
    return typeMatch && capacityMatch && priceMatch;
  });

  const displayedCars = filteredCars.slice(0, visibleCars);
  const hasMoreCars = visibleCars < filteredCars.length;

  const handleLoadMore = () => {
    setVisibleCars(prev => Math.min(prev + 6, filteredCars.length));
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedCapacities([]);
    setMaxPrice(100);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        {/* Pick-up / Drop-off Section */}
        <Card className="p-6 mb-8 shadow-lg border-0">
          <h3 className="text-xl mb-6 text-gray-900">Thông tin thuê xe</h3>
          
          <div className="grid md:grid-cols-2 gap-6 relative">
            {/* Pick-up */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <h4 className="text-gray-900">Pick - Up</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm mb-2 block text-gray-700">Địa điểm</label>
                  <Input 
                    placeholder="Chọn thành phố" 
                    className="bg-white border-blue-200"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-gray-700">Ngày</label>
                  <Input 
                    type="date" 
                    className="bg-white border-blue-200"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-gray-700">Giờ</label>
                  <Input 
                    type="time" 
                    className="bg-white border-blue-200"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
              <button 
                onClick={swapPickupDropoff}
                className="w-14 h-14 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95"
              >
                <ArrowUpDown className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Drop-off */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <h4 className="text-gray-900">Drop - Off</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm mb-2 block text-gray-700">Địa điểm</label>
                  <Input 
                    placeholder="Chọn thành phố" 
                    className="bg-white border-purple-200"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-gray-700">Ngày</label>
                  <Input 
                    type="date" 
                    className="bg-white border-purple-200"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-gray-700">Giờ</label>
                  <Input 
                    type="time" 
                    className="bg-white border-purple-200"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate("car-rental")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <Card className="p-6 sticky top-24 shadow-lg border-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg text-gray-900">Bộ lọc</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs"
                >
                  Xóa
                </Button>
              </div>

              <div className="mb-8">
                <h4 className="text-sm mb-4 text-gray-900">LOẠI XE</h4>
                <div className="space-y-3">
                  {[
                    { label: "Sport", count: allCars.filter(c => c.type === "Sport").length },
                    { label: "SUV", count: allCars.filter(c => c.type === "SUV").length },
                    { label: "Sedan", count: allCars.filter(c => c.type === "Sedan").length },
                    { label: "Hatchback", count: allCars.filter(c => c.type === "Hatchback").length },
                  ].map((type) => (
                    <div key={type.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Checkbox
                        checked={selectedTypes.includes(type.label)}
                        onCheckedChange={() => toggleType(type.label)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <label className="text-sm text-gray-700 cursor-pointer flex-1">
                        {type.label}
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {type.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm mb-4 text-gray-900">SỨC CHỨA</h4>
                <div className="space-y-3">
                  {[
                    { label: "2 Person", count: allCars.filter(c => c.capacity === "2 Person").length },
                    { label: "4 Person", count: allCars.filter(c => c.capacity === "4 Person").length },
                    { label: "6 Person", count: allCars.filter(c => c.capacity === "6 Person").length },
                    { label: "8 or More", count: allCars.filter(c => c.capacity === "8 or More").length },
                  ].map((capacity) => (
                    <div key={capacity.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Checkbox
                        checked={selectedCapacities.includes(capacity.label)}
                        onCheckedChange={() => toggleCapacity(capacity.label)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <label className="text-sm text-gray-700 cursor-pointer flex-1">
                        {capacity.label}
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {capacity.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-4 text-gray-900">GIÁ TỐI ĐA</h4>
                <Slider
                  value={[maxPrice]}
                  onValueChange={([value]) => setMaxPrice(value)}
                  max={100}
                  step={1}
                  className="mb-3"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">$0</span>
                  <Badge className="bg-linear-to-r from-blue-600 to-indigo-600">
                    ${maxPrice}.00
                  </Badge>
                  <span className="text-sm text-gray-600">$100</span>
                </div>
              </div>
            </Card>
          </aside>

          {/* Car Grid */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-1">Danh sách xe</h2>
                <p className="text-gray-600">
                  {filteredCars.length} xe phù hợp {selectedTypes.length > 0 || selectedCapacities.length > 0 || maxPrice < 100 ? '(đã lọc)' : ''}
                </p>
              </div>
            </div>

            {displayedCars.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl mb-2">Không tìm thấy xe phù hợp</h3>
                  <p className="text-gray-500 mb-4">Vui lòng thử điều chỉnh bộ lọc của bạn</p>
                  <Button onClick={handleResetFilters} variant="outline">
                    Xóa bộ lọc
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedCars.map((car) => (
                    <Card 
                      key={car.id}
                      onClick={() => onNavigate("car-detail", car)} 
                      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {car.name}
                            </h3>
                            <p className="text-sm text-gray-500">{car.type}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); }} 
                            className="transition-transform hover:scale-110"
                          >
                            <Heart 
                              className={`w-6 h-6 ${car.liked ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-500'}`} 
                            />
                          </button>
                        </div>

                        <div className="mb-6 h-32 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 group-hover:scale-105 transition-transform">
                          <ImageWithFallback
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Fuel className="w-4 h-4 text-blue-600" />
                            <span>{car.gasoline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4 text-blue-600" />
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>{car.capacity}</span>
                          </div>
                        </div>

                        {car.rating && (
                          <div className="flex items-center gap-1 mb-4">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{car.rating}</span>
                            <span className="text-sm text-gray-500">(Tuyệt vời)</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl text-blue-600">${car.price}</span>
                              <span className="text-sm text-gray-500">/ngày</span>
                            </div>
                            {car.originalPrice && (
                              <p className="text-sm text-gray-400 line-through">${car.originalPrice}</p>
                            )}
                          </div>
                          <Button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onNavigate("car-review", {
                                car: { id: car.id, name: car.name, type: car.type, image: car.image, transmission: car.transmission, capacity: car.capacity },
                                rental: { pickupDate: "Thứ 7, 8/11/2025", pickupTime: "09:00", dropoffDate: "Thứ 2, 10/11/2025", dropoffTime: "09:00", pickupLocation: "Pool Bandara CGK", dropoffLocation: "Pool Bandara CGK", days: 2 },
                                pricing: { carPrice: car.price * 2, fees: 0, deposit: car.price * 1.5 }
                              });
                            }} 
                            size="sm"
                            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          >
                            Thuê ngay
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                {hasMoreCars && (
                  <div className="mt-12 text-center">
                    <Button 
                      size="lg" 
                      onClick={handleLoadMore}
                      className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                    >
                      Xem thêm xe
                      <Badge className="bg-white/20">
                        +{filteredCars.length - visibleCars}
                      </Badge>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
