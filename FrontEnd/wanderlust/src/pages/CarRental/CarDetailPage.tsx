import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Fuel,
    Heart,
    MapPin,
    Settings,
    Shield,
    Star,
    ThumbsUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import type { PageType } from "../../MainApp";
import { carRentalApi } from "../../utils/api";

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
  userRole?: any;
  onLogout?: () => void;
}

export default function CarDetailPage({ car, onNavigate, userRole, onLogout }: CarDetailPageProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [recommendedCars, setRecommendedCars] = useState<any[]>([]);

  // Rental form states
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<string>("");

  // Scroll to top when car changes (when user clicks on recommended car)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [car.id]);

  // Fetch recommended cars from backend
  useEffect(() => {
    const fetchRecommendedCars = async () => {
      try {
        // Fetch ALL cars instead of just popular ones
        const response = await carRentalApi.getAllCars();

        // Response is directly an array, not wrapped in .data
        const backendCars = Array.isArray(response) ? response : [];

        // Map backend data to frontend format
        const allMappedCars = backendCars.map((backendCar: any) => ({
          id: backendCar.id,
          name: `${backendCar.brand} ${backendCar.model}`,
          brand: backendCar.brand,
          model: backendCar.model,
          type: backendCar.type || "SUV",
          image: backendCar.images?.[0]?.url || "https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800&h=600&fit=crop",
          gasoline: backendCar.fuelType || "Gasoline",
          transmission: backendCar.transmission || "Manual",
          capacity: `${backendCar.seats || 5} People`,
          seats: backendCar.seats,
          price: backendCar.pricePerDay ? Math.round(backendCar.pricePerDay / 24000) : 0,
          originalPrice: undefined,
          liked: false,
          rating: backendCar.averageRating || (4.5 + Math.random() * 0.5),
        }));

        // Filter out current car
        const otherCars = allMappedCars.filter((c: any) => c.id !== car.id);

        // Prioritize same type, then shuffle
        const sameTypeCars = otherCars.filter((c: any) => c.type === car.type);
        const differentTypeCars = otherCars.filter((c: any) => c.type !== car.type);

        // Shuffle both arrays
        const shuffledSameType = sameTypeCars.sort(() => Math.random() - 0.5);
        const shuffledDifferentType = differentTypeCars.sort(() => Math.random() - 0.5);

        // Combine: prefer same type first, then others, take 3
        const recommended = [...shuffledSameType, ...shuffledDifferentType].slice(0, 3);

        setRecommendedCars(recommended);
      } catch (error) {
        console.error("Failed to fetch recommended cars:", error);
        // Keep empty array on error
      }
    };

    fetchRecommendedCars();
  }, [car.id]);

  // Handle booking
  const handleBooking = () => {
    // Validate required fields
    if (!pickupDate) {
      toast.error(t('carDetail.selectPickupDate'));
      return;
    }
    if (!dropoffDate) {
      toast.error(t('carDetail.selectDropoffDate'));
      return;
    }
    if (!pickupLocation) {
      toast.error(t('carDetail.enterPickupLocation'));
      return;
    }

    // Validate dates
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    if (pickup >= dropoff) {
      toast.error(t('carDetail.dropoffAfterPickup'));
      return;
    }

    // Calculate rental days
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Navigate to review page with rental data
    onNavigate("car-review", {
      car: {
        id: car.id,
        name: car.name,
        type: car.type,
        image: car.image,
        transmission: car.transmission,
        capacity: car.capacity
      },
      rental: {
        pickupDate: format(pickup, "EEEE, dd/MM/yyyy", { locale: vi }),
        pickupTime: "09:00",
        dropoffDate: format(dropoff, "EEEE, dd/MM/yyyy", { locale: vi }),
        dropoffTime: "09:00",
        pickupLocation: pickupLocation,
        dropoffLocation: pickupLocation, // Same location
        days: diffDays
      },
      pricing: {
        carPrice: car.price * diffDays,
        fees: 0,
        deposit: car.price * 1.5
      }
    });
  };

  const carImages = [
    car.image,
    "https://images.unsplash.com/photo-1648799833118-c989da6907d7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=800&h=600&fit=crop",
  ];

  const features = [
    { icon: Shield, label: t('carDetail.comprehensiveInsurance'), desc: t('carDetail.fullyInsured') },
    { icon: MapPin, label: t('carDetail.homeDelivery'), desc: t('carDetail.freeCityDelivery') },
    { icon: Calendar, label: t('carDetail.flexibleBooking'), desc: t('carDetail.freeCancellation24hShort') },
    { icon: CheckCircle, label: t('carDetail.verifiedCar'), desc: t('carDetail.safetyGuaranteed') },
  ];

  const specifications = [
    { label: t('carDetail.carType'), value: car.type },
    { label: t('carDetail.capacity'), value: car.capacity },
    { label: t('carDetail.transmission'), value: car.transmission },
    { label: t('carDetail.fuel'), value: car.gasoline },
    { label: t('carDetail.year'), value: "2023" },
    { label: t('carDetail.color'), value: "Đen" },
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

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Header currentPage="car-rental" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        <Button
          variant="ghost"
          onClick={() => onNavigate("car-list")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('carDetail.backToList')}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Images */}
            <Card className="p-6 border-0 shadow-lg">
              {/* Main Image */}
              <div className="relative bg-linear-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4">
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
                    className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-blue-600 shadow-lg' : 'border-transparent hover:border-gray-300'
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
                      <span className="text-sm text-gray-600">{car.rating}/5 • 440+ {t('carDetail.reviews')}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg mb-3 text-gray-900">{t('carDetail.description')}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('carDetail.carDescription', { name: car.name, type: car.type?.toLowerCase() || t('carDetail.premium') })}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="text-lg mb-4 text-gray-900">{t('carDetail.specifications')}</h3>
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
                <h3 className="text-lg mb-4 text-gray-900">{t('carDetail.features')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <feature.icon className="w-6 h-6 text-blue-600 shrink-0" />
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
                <h2 className="text-xl text-gray-900">{t('carDetail.reviews')}</h2>
                <Badge className="bg-linear-to-r from-blue-600 to-indigo-600">
                  {reviews.length} {t('carDetail.reviews')}
                </Badge>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
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
                          <span className="text-sm">{t('carDetail.helpful')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Cars */}
            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">{t('carDetail.recommendedCars')}</h2>
                  <p className="text-gray-600">Các lựa chọn tuyệt vời khác cho bạn</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("car-list")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {t('carDetail.viewAll')} →
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

                      <div className="mb-6 h-32 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 group-hover:scale-105 transition-transform">
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
                          className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {t('carDetail.rentNow')}
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
                      {t('carDetail.save')} ${car.originalPrice - car.price}
                    </Badge>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">{t('carDetail.pickupDate')}</label>
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">{t('carDetail.dropoffDate')}</label>
                  <Input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">{t('carDetail.pickupLocation')}</label>
                  <Input
                    placeholder={t('carDetail.enterLocation')}
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mb-4"
                size="lg"
              >
                {t('carDetail.bookNow')}
              </Button>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('carDetail.freeCancellation24h')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('carDetail.comprehensiveInsurance')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('carDetail.support247')}</span>
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










