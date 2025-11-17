import {
    Activity,
    BookOpen,
    DollarSign,
    Download,
    TrendingDown,
    TrendingUp,
    Users
} from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { PageType } from "../../MainApp";

interface AdminReportsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminReportsPage({ onNavigate }: AdminReportsPageProps) {
  const revenueData = [
    { month: "Tháng 1", revenue: 450000000, bookings: 245, users: 189 },
    { month: "Tháng 2", revenue: 520000000, bookings: 298, users: 234 },
    { month: "Tháng 3", revenue: 680000000, bookings: 356, users: 289 },
    { month: "Tháng 4", revenue: 590000000, bookings: 312, users: 256 },
    { month: "Tháng 5", revenue: 720000000, bookings: 398, users: 321 },
    { month: "Tháng 6", revenue: 850000000, bookings: 445, users: 378 },
  ];

  const topServices = [
    { name: "JW Marriott Phu Quoc", type: "Khách sạn", bookings: 156, revenue: 546000000 },
    { name: "Tour Thái Lan 4N3Đ", type: "Tour", bookings: 89, revenue: 595410000 },
    { name: "InterContinental Danang", type: "Khách sạn", bookings: 134, revenue: 375200000 },
    { name: "Vé VinWonders", type: "Hoạt động", bookings: 234, revenue: 128700000 },
    { name: "Toyota Camry Rental", type: "Thuê xe", bookings: 67, revenue: 120600000 },
  ];

  const stats = [
    {
      label: "Doanh thu tháng này",
      value: "₫523M",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Bookings tháng này",
      value: "1,245",
      change: "+18.2%",
      trend: "up",
      icon: BookOpen,
    },
    {
      label: "Users mới",
      value: "387",
      change: "+12.8%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Tỷ lệ hủy",
      value: "6.8%",
      change: "-2.3%",
      trend: "down",
      icon: Activity,
    },
  ];

  return (
    <AdminLayout currentPage="admin-reports" onNavigate={onNavigate} activePage="admin-reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Báo cáo & Thống kê</h1>
            <p className="text-gray-600">Phân tích dữ liệu và xu hướng kinh doanh</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="this-month">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="this-week">Tuần này</SelectItem>
                <SelectItem value="this-month">Tháng này</SelectItem>
                <SelectItem value="last-month">Tháng trước</SelectItem>
                <SelectItem value="this-year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600";
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${trendColor}`}>{stat.change}</span>
                  <span className="text-sm text-gray-500">so với tháng trước</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Biểu đồ doanh thu 6 tháng</h3>
              
              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">{data.month}</div>
                    <div className="flex-1 relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-end px-4"
                        style={{ width: `${(data.revenue / 850000000) * 100}%` }}
                      >
                        <span className="text-white font-semibold text-sm">
                          {(data.revenue / 1000000).toFixed(0)}M
                        </span>
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <p className="font-semibold text-gray-900">
                        {data.bookings} bookings
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">₫3.81B</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trung bình/tháng</p>
                    <p className="text-2xl font-bold text-gray-900">₫635M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tăng trưởng</p>
                    <p className="text-2xl font-bold text-green-600">+89.2%</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Top dịch vụ được đặt nhiều nhất</h3>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.type}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{service.bookings}</p>
                      <p className="text-xs text-gray-600">bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {(service.revenue / 1000000).toFixed(0)}M
                      </p>
                      <p className="text-xs text-gray-600">doanh thu</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Thống kê người dùng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Người dùng mới theo tháng</h4>
                  <div className="space-y-3">
                    {revenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{data.month}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${(data.users / 378) * 100}%` }}
                            />
                          </div>
                          <span className="w-12 text-right font-semibold text-gray-900">
                            {data.users}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Tổng quan</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tổng người dùng</p>
                      <p className="text-3xl font-bold text-blue-600">2,450</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Users active</p>
                      <p className="text-3xl font-bold text-green-600">1,867</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tỷ lệ quay lại</p>
                      <p className="text-3xl font-bold text-purple-600">68.3%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
