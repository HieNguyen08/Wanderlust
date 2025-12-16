import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  DollarSign,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AdminLayout } from "../../components/AdminLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";
import { adminApi, hotelApi } from "../../utils/api";

interface AdminDashboardProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [topHotels, setTopHotels] = useState<any[]>([]);
  const [latestReviews, setLatestReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, allBookings, hotelsResponse, reviews] = await Promise.all([
          adminApi.getBookingStatistics(),
          adminApi.getAllBookings(),
          hotelApi.searchHotels(),
          adminApi.getAllReviews()
        ]);
        
        setStatistics(stats);
        
        // Lấy 5 booking mới nhất
        const bookingsArray = Array.isArray(allBookings) ? allBookings : allBookings?.content ?? [];
        const sortedBookings = bookingsArray
          .sort((a: any, b: any) => new Date(b.bookingDate || b.createdAt || 0).getTime() - new Date(a.bookingDate || a.createdAt || 0).getTime())
          .slice(0, 5);
        setRecentBookings(sortedBookings);
        
        // Sắp xếp khách sạn theo đánh giá (averageRating) từ cao đến thấp
        const hotels = Array.isArray(hotelsResponse)
          ? hotelsResponse
          : hotelsResponse?.content ?? [];
        const sortedHotels = hotels
          .filter((h: any) => h.averageRating && h.averageRating > 0)
          .sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 4);
        setTopHotels(sortedHotels);
        
        // Lấy 3 review mới nhất
        const reviewsArray = Array.isArray(reviews) ? reviews : reviews?.content ?? [];
        const sortedReviews = reviewsArray
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 3);
        setLatestReviews(sortedReviews);
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error(t('admin.cannotLoadDashboard'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [t]);

  // Tính toán các chỉ số từ statistics
  const totalUsers = statistics?.totalUsers || 0;
  const userGrowth = statistics?.userGrowth || 0;
  
  const currentMonthRevenue = statistics?.currentMonthRevenue || 0;
  const previousMonthRevenue = statistics?.previousMonthRevenue || 0;
  const revenueGrowth = previousMonthRevenue > 0 
    ? (((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)
    : "0.0";
  
  const currentMonthBookings = statistics?.currentMonthBookings || 0;
  const previousMonthBookings = statistics?.previousMonthBookings || 0;
  const bookingGrowth = previousMonthBookings > 0
    ? (((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100).toFixed(1)
    : "0.0";
  
  const overallGrowth = statistics?.overallGrowth || parseFloat(revenueGrowth);

  const stats = [
    {
      title: t('admin.totalUsers'),
      value: totalUsers.toLocaleString('vi-VN'),
      change: `${userGrowth >= 0 ? '+' : ''}${userGrowth.toFixed(1)}%`,
      trend: userGrowth >= 0 ? "up" : "down",
      icon: Users,
      color: "blue",
    },
    {
      title: t('admin.monthlyRevenue'),
      value: `₫${(currentMonthRevenue / 1000000).toFixed(1)}M`,
      change: `${parseFloat(revenueGrowth) >= 0 ? '+' : ''}${revenueGrowth}%`,
      trend: parseFloat(revenueGrowth) >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "green",
    },
    {
      title: t('admin.newBookings'),
      value: currentMonthBookings.toString(),
      change: `${parseFloat(bookingGrowth) >= 0 ? '+' : ''}${bookingGrowth}%`,
      trend: parseFloat(bookingGrowth) >= 0 ? "up" : "down",
      icon: BookOpen,
      color: "purple",
    },
    {
      title: t('admin.growth'),
      value: `${Math.abs(overallGrowth).toFixed(1)}%`,
      change: `${overallGrowth >= 0 ? '+' : ''}${overallGrowth.toFixed(1)}%`,
      trend: overallGrowth >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('common.justNow', 'Vừa xong');
    if (diffInHours < 24) return t('common.hoursAgo', `${diffInHours} giờ trước`, { hours: diffInHours });
    if (diffInHours < 48) return t('common.yesterday', '1 ngày trước');
    return t('common.daysAgo', `${Math.floor(diffInHours / 24)} ngày trước`, { days: Math.floor(diffInHours / 24) });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      "PENDING": { label: t('admin.pending'), className: "bg-yellow-100 text-yellow-700" },
      "CONFIRMED": { label: t('admin.confirmed'), className: "bg-blue-100 text-blue-700" },
      "COMPLETED": { label: t('admin.completed'), className: "bg-green-100 text-green-700" },
      "CANCELLED": { label: t('admin.cancelled'), className: "bg-red-100 text-red-700" },
    };
    
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <AdminLayout currentPage="admin-dashboard" onNavigate={onNavigate} activePage="admin-dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('admin.dashboard')}</h1>
          <p className="text-gray-600">{t('admin.systemOverview')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <TrendIcon
                    className={`w-5 h-5 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">{t('admin.comparedToLastMonth')}</span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.recentBookings')}</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("admin-bookings")}>
                {t('common.viewAll')}
              </Button>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {booking.user?.name || booking.user?.email || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500">#{booking.id}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {booking.hotel?.name || booking.room?.hotel?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold text-gray-900">
                      {booking.totalPrice ? booking.totalPrice.toLocaleString('vi-VN') + 'đ' : '0đ'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.bookingDate ? formatDate(booking.bookingDate) : 'N/A'}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  {t('admin.noRecentBookings', 'Không có đơn đặt gần đây')}
                </div>
              )}
            </div>
          </Card>

          {/* Top Hotels by Rating */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.topHotels')}</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("admin-dashboard")}>
                {t('common.viewAll')}
              </Button>
            </div>
            <div className="space-y-4">
              {topHotels.length > 0 ? topHotels.map((hotel, index) => (
                <div key={hotel.hotelID} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{hotel.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.floor(hotel.averageRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {hotel.totalReviews || 0} {t('admin.reviews', 'đánh giá')}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  {t('admin.noHotels', 'Không có khách sạn')}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Latest Reviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{t('admin.latestReviews', 'Đánh giá mới nhất')}</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("admin-reviews")}>
              {t('common.viewAll')}
            </Button>
          </div>
          <div className="space-y-4">
            {latestReviews.length > 0 ? latestReviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.user?.name || review.user?.email || 'N/A'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {review.hotel?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < (review.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {review.comment || t('admin.noComment', 'Không có bình luận')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {review.createdAt ? formatDate(review.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                {t('admin.noReviews', 'Không có đánh giá')}
              </div>
            )}
          </div>
        </Card>
      </div>
      )}
    </AdminLayout>
  );
}
