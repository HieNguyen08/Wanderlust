import {
    Calendar,
    Check,
    Clock,
    Heart,
    MapPin,
    RefreshCw,
    Share2,
    Shield,
    Star,
    Ticket,
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
import type { PageType } from "../../MainApp";
import { activityApi } from "../../utils/api";

interface ActivityDetailPageProps {
  activity?: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    duration?: string;
    description: string;
  };
  activityId?: string; // Allow passing just ID to load from API
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: any;
  onLogout?: () => void;
  data?: {
    activity?: ActivityDetailPageProps["activity"];
    bookingInfo?: {
      date?: string;
      guests?: { adults?: number; children?: number; total?: number };
    };
  };
}

export default function ActivityDetailPage({ activity: initialActivityProp, activityId, onNavigate, userRole, onLogout, data }: ActivityDetailPageProps) {
  const { t } = useTranslation();
  const initialActivity = data?.activity ?? initialActivityProp ?? (data && !data.activity ? data : undefined);
  const [activity, setActivity] = useState(initialActivity);
  const [loading, setLoading] = useState(!initialActivity && !!activityId);
  const [selectedDate, setSelectedDate] = useState<string>(data?.bookingInfo?.date || "");
  const [guestCount, setGuestCount] = useState(data?.bookingInfo?.guests?.total || 1);
  const [isLiked, setIsLiked] = useState(false);

  // Load activity details if only ID is provided
  useEffect(() => {
    const loadActivityDetails = async () => {
      if (!initialActivity && activityId) {
        try {
          setLoading(true);
          const data = await activityApi.getActivityById(activityId);
          
          // Map backend data to frontend format
          const mapCategory = (backendCategory: string) => {
            const cat = backendCategory?.toUpperCase();
            switch (cat) {
              case 'ATTRACTION': return 'attractions';
              case 'TOUR': return 'tours';
              case 'FOOD': return 'food';
              case 'RELAXATION': return 'spa';
              case 'ENTERTAINMENT': return 'music';
              case 'ADVENTURE': return 'tours';
              case 'CULTURE': return 'attractions';
              default: return 'other';
            }
          };

          const mappedActivity = {
            id: data.id,
            name: data.name,
            image: data.images?.[0]?.url || "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
            price: data.price,
            originalPrice: data.originalPrice,
            category: mapCategory(data.category),
            rating: data.averageRating || 0,
            reviews: data.totalReviews || 0,
            location: data.meetingPoint || "Vietnam",
            duration: data.duration,
            description: data.description
          };

          setActivity(mappedActivity);
        } catch (error) {
          console.error("Error loading activity details:", error);
          toast.error(t('activitiesPage.failedToLoadActivity') || "Không thể tải thông tin hoạt động");
          onNavigate("activities");
        } finally {
          setLoading(false);
        }
      }
    };

    loadActivityDetails();
  }, [activityId, initialActivity, onNavigate, t]);

  // Show loading state
  if (loading || !activity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="activities" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />
        <div className="flex justify-center items-center h-[calc(100vh-60px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading') || 'Đang tải...'}</p>
          </div>
        </div>
      </div>
    );
  }

  const highlights = [
    "Hủy miễn phí trước 24 giờ",
    "Xác nhận tức thì",
    "Hướng dẫn viên chuyên nghiệp",
    "Đón tại khách sạn (nếu áp dụng)",
    "Bảo hiểm du lịch",
  ];

  const included = [
    "Vé tham quan",
    "Hướng dẫn viên tiếng Việt",
    "Xe đưa đón (tùy gói)",
    "Bữa ăn (tùy gói)",
    "Nước uống",
  ];

  const relatedImages = [
    activity.image,
    "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
  ];

  const handleBooking = () => {
    // Navigate to activity review page
    onNavigate("activity-review", {
      activity: {
        id: activity.id,
        name: activity.name,
        image: activity.image,
        category: activity.category,
        location: activity.location,
        duration: activity.duration || "Cả ngày",
        vendor: "Travel Partner Co., Ltd",
        includes: included
      },
      booking: {
        date: selectedDate,
        time: "09:00",
        participants: guestCount,
        adults: Math.floor(guestCount * 0.7) || 1,
        children: Math.floor(guestCount * 0.3),
        hasPickup: true
      },
      pricing: {
        unitPrice: activity.price,
        totalPrice: activity.price * guestCount,
        fees: 0,
        insurance: 50000
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="activities" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      {/* Breadcrumb */}
      <div className="bg-white border-b pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate("home")} className="hover:text-blue-600">{t('activitiesPage.home')}</button>
            <span>/</span>
            <button onClick={() => onNavigate("activities")} className="hover:text-blue-600">{t('activitiesPage.activitiesMenu')}</button>
            <span>/</span>
            <span className="text-gray-900">{activity.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 row-span-2">
                <ImageWithFallback
                  src={relatedImages[0]}
                  alt={activity.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
              {relatedImages.slice(1).map((img, index) => (
                <ImageWithFallback
                  key={index}
                  src={img}
                  alt={`${activity.name} ${index + 2}`}
                  className="w-full h-48 object-cover rounded-xl"
                />
              ))}
            </div>

            {/* Title & Actions */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-600">{activity.category}</Badge>
                  {activity.originalPrice && (
                    <Badge variant="destructive">
                      {t('activitiesPage.discount')} {Math.round((1 - activity.price / activity.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {activity.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{activity.rating}</span>
                    <span className="text-sm">({activity.reviews} {t('activitiesPage.reviews')})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{activity.location}</span>
                  </div>
                  {activity.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      <span>{activity.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('activitiesPage.aboutThisActivity')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {activity.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('activitiesPage.activityDescription')}
              </p>
            </Card>

            {/* Highlights */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('activitiesPage.highlights')}</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Included */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('activitiesPage.included')}</h2>
              <div className="space-y-2">
                {included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cancellation Policy */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('activitiesPage.flexibleCancellation')}</h3>
                  <p className="text-gray-700">
                    {t('activitiesPage.cancellationPolicy')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  {activity.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {activity.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>
                <div className="text-4xl font-bold text-red-600">
                  {activity.price.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-sm text-gray-600 mt-1">/ {t('activitiesPage.perPerson')}</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {t('activitiesPage.selectDate')}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    {t('activitiesPage.numberOfGuests')}
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    >
                      -
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{guestCount}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuestCount(guestCount + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {activity.price.toLocaleString('vi-VN')}đ x {guestCount} {t('activitiesPage.guests')}
                  </span>
                  <span className="font-semibold">
                    {(activity.price * guestCount).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t('activitiesPage.total')}</span>
                  <span className="text-red-600">
                    {(activity.price * guestCount).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                onClick={handleBooking}
                disabled={!selectedDate}
              >
                {t('activitiesPage.bookNow')}
              </Button>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <p>
                  {t('activitiesPage.securePayment')}
                </p>
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