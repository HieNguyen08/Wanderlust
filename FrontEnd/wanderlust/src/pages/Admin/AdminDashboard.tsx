import {
    ArrowDown,
    ArrowUp,
    BookOpen,
    DollarSign,
    Eye, MoreVertical,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
import { AdminLayout } from "../../components/AdminLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";
import { adminApi } from "../../utils/api";

interface AdminDashboardProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [statistics, setStatistics] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, allBookings] = await Promise.all([
          adminApi.getBookingStatistics(),
          adminApi.getAllBookings()
        ]);
        setStatistics(stats);
        setBookings(allBookings.slice(0, 5)); // Top 5 recent
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Tổng người dùng",
      value: "2,450",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Doanh thu tháng này",
      value: "₫245.5M",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Booking mới",
      value: "127",
      change: "-4.3%",
      trend: "down",
      icon: BookOpen,
      color: "purple",
    },
    {
      title: "Tăng trưởng",
      value: "18.2%",
      change: "+2.4%",
      trend: "up",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const topHotels = [
    { name: "JW Marriott Phu Quoc", bookings: 45, revenue: 157500000 },
    { name: "InterContinental Danang", bookings: 38, revenue: 106400000 },
    { name: "Vinpearl Resort Nha Trang", bookings: 32, revenue: 80000000 },
    { name: "Azerai La Residence Hue", bookings: 28, revenue: 89600000 },
  ];

  const pendingReviews = [
    {
      user: "Nguyễn Văn A",
      hotel: "JW Marriott Phu Quoc",
      rating: 5,
      comment: "Khách sạn tuyệt vời, dịch vụ chuyên nghiệp...",
      date: "2 giờ trước",
    },
    {
      user: "Trần Thị B",
      hotel: "InterContinental Danang",
      rating: 4,
      comment: "Phòng đẹp, view biển tuyệt...",
      date: "5 giờ trước",
    },
    {
      user: "Lê Văn C",
      hotel: "Vinpearl Nha Trang",
      rating: 3,
      comment: "Tạm ổn nhưng giá hơi cao...",
      date: "1 ngày trước",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700">Xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ xử lý</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="admin-dashboard" onNavigate={onNavigate} activePage="admin-dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động hệ thống</p>
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
                  <span className="text-sm text-gray-500">so với tháng trước</span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Booking gần đây</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("admin-bookings")}>
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{booking.customer}</span>
                      <span className="text-sm text-gray-500">#{booking.id}</span>
                    </div>
                    <p className="text-sm text-gray-600">{booking.type}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold text-gray-900">
                      {booking.amount.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-xs text-gray-500">{booking.date}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          </Card>

          {/* Top Hotels */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Khách sạn hàng đầu</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("admin-hotels")}>
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-4">
              {topHotels.map((hotel, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(hotel.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Reviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Đánh giá chờ duyệt</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("admin-reviews")}>
              Xem tất cả
            </Button>
          </div>
          <div className="space-y-4">
            {pendingReviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{review.user}</h4>
                    <p className="text-sm text-gray-600">{review.hotel}</p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{review.date}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Từ chối</Button>
                    <Button size="sm">Duyệt</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("admin-users")}
          >
            <Users className="w-6 h-6" />
            <span>Thêm User</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("admin-hotels")}
          >
            <Eye className="w-6 h-6" />
            <span>Thêm Khách sạn</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("admin-bookings")}
          >
            <BookOpen className="w-6 h-6" />
            <span>Xem Bookings</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("admin-reports")}
          >
            <TrendingUp className="w-6 h-6" />
            <span>Báo cáo</span>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
