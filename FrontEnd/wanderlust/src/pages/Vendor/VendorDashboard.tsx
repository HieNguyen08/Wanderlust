import {
    ArrowDown,
    ArrowUp,
    BookOpen,
    Calendar,
    DollarSign,
    Eye,
    Package,
    Star, TrendingUp,
    Users
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { VendorLayout } from "../../components/VendorLayout";
import type { PageType } from "../../MainApp";

interface VendorDashboardProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

export default function VendorDashboard({ onNavigate, vendorType = "hotel" }: VendorDashboardProps) {
  const { t } = useTranslation();
  const stats = [
    {
      title: t('vendor.monthlyRevenue'),
      value: "₫157.5M",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: t('vendor.newBookings'),
      value: "45",
      change: "+12.5%",
      trend: "up",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: t('vendor.averageRating'),
      value: "4.9",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "yellow",
    },
    {
      title: t('vendor.occupancyRate'),
      value: "87%",
      change: "+5.3%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const recentBookings = [
    {
      id: "BK001",
      customer: "Nguyễn Văn A",
      service: "Deluxe Ocean View Room",
      checkIn: "2025-01-20",
      checkOut: "2025-01-23",
      status: "confirmed",
      amount: 10500000,
    },
    {
      id: "BK002",
      customer: "Trần Thị B",
      service: "Premium Suite",
      checkIn: "2025-01-22",
      checkOut: "2025-01-25",
      status: "pending",
      amount: 15600000,
    },
    {
      id: "BK003",
      customer: "Lê Văn C",
      service: "Standard Room",
      checkIn: "2025-01-18",
      checkOut: "2025-01-20",
      status: "completed",
      amount: 5200000,
    },
    {
      id: "BK004",
      customer: "Phạm Thị D",
      service: "Family Suite",
      checkIn: "2025-01-25",
      checkOut: "2025-01-28",
      status: "confirmed",
      amount: 12800000,
    },
  ];

  const pendingReviews = [
    {
      customer: "Nguyễn Văn A",
      service: "Deluxe Ocean View",
      rating: 5,
      comment: "Phòng tuyệt vời, view đẹp, dịch vụ chuyên nghiệp...",
      date: "2 giờ trước",
    },
    {
      customer: "Trần Thị B",
      service: "Premium Suite",
      rating: 4,
      comment: "Rất hài lòng với chất lượng phòng...",
      date: "5 giờ trước",
    },
    {
      customer: "Lê Văn C",
      service: "Standard Room",
      rating: 5,
      comment: "Giá cả hợp lý, phòng sạch sẽ...",
      date: "1 ngày trước",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700">{t('common.confirmed')}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('common.pending')}</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">{t('common.completed')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <VendorLayout 
      currentPage="vendor-dashboard" 
      onNavigate={onNavigate} 
      activePage="vendor-dashboard"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('vendor.dashboard')}</h1>
          <p className="text-gray-600">{t('vendor.dashboardOverview')}</p>
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
                  <TrendIcon className={`w-5 h-5 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">{t('vendor.comparedToLastMonth')}</span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('vendor.recentBookings')}</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("vendor-bookings")}>
                {t('common.viewAll')}
              </Button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{booking.customer}</span>
                        <span className="text-sm text-gray-500">#{booking.id}</span>
                      </div>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.checkIn} → {booking.checkOut}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold text-gray-900">
                      {booking.amount.toLocaleString('vi-VN')}đ
                    </span>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      {t('common.details')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Reviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('vendor.newReviews')}</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("vendor-reviews")}>
                {t('common.viewAll')}
              </Button>
            </div>
            <div className="space-y-4">
              {pendingReviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.customer}</h4>
                      <p className="text-sm text-gray-600">{review.service}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{review.date}</span>
                    <Button size="sm" variant="outline">
                      {t('vendor.reply')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t('vendor.totalRooms')}</p>
                <p className="text-2xl font-bold text-gray-900">120</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{t('vendor.customers')}</p>
                <p className="text-2xl font-bold text-gray-900">2,345</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">{t('vendor.reviews')}</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{t('vendor.growth')}</p>
                <p className="text-2xl font-bold text-gray-900">+23%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('vendor.quickActions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate("vendor-services")}
            >
              <Package className="w-6 h-6" />
              <span>{t('vendor.addNewRoom')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate("vendor-bookings")}
            >
              <BookOpen className="w-6 h-6" />
              <span>{t('vendor.viewBookings')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate("vendor-reviews")}
            >
              <Star className="w-6 h-6" />
              <span>{t('vendor.manageReviews')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate("vendor-reports")}
            >
              <TrendingUp className="w-6 h-6" />
              <span>{t('admin.reports')}</span>
            </Button>
          </div>
        </Card>
      </div>
    </VendorLayout>
  );
}
