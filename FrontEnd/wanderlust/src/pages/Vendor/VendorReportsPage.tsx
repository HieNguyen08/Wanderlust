import {
    BookOpen,
    DollarSign,
    Download,
    Star,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PageType } from "../../MainApp";
import { VendorLayout } from "../../components/VendorLayout";
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

interface VendorReportsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

export default function VendorReportsPage({ 
  onNavigate,
  vendorType = "hotel"
}: VendorReportsPageProps) {
  const { t } = useTranslation();
  
  const revenueData = [
    { month: "Tháng 7", revenue: 120000000, bookings: 32, occupancy: 75 },
    { month: "Tháng 8", revenue: 145000000, bookings: 38, occupancy: 82 },
    { month: "Tháng 9", revenue: 135000000, bookings: 35, occupancy: 78 },
    { month: "Tháng 10", revenue: 162000000, bookings: 42, occupancy: 85 },
    { month: "Tháng 11", revenue: 178000000, bookings: 48, occupancy: 89 },
    { month: "Tháng 12", revenue: 195000000, bookings: 52, occupancy: 92 },
  ];

  const topRooms = [
    { name: "Deluxe Ocean View", bookings: 45, revenue: 157500000, rating: 4.9 },
    { name: "Premium Suite", bookings: 32, revenue: 166400000, rating: 4.8 },
    { name: "Standard Room", bookings: 78, revenue: 140400000, rating: 4.6 },
    { name: "Family Suite", bookings: 28, revenue: 117600000, rating: 4.7 },
  ];

  const stats = [
    {
      label: t('vendor.sixMonthRevenue'),
      value: "₫935M",
      change: "+24.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: t('vendor.totalBookings'),
      value: "247",
      change: "+18.2%",
      trend: "up",
      icon: BookOpen,
    },
    {
      label: t('vendor.averageOccupancy'),
      value: "83.5%",
      change: "+7.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: t('vendor.averageRating'),
      value: "4.8★",
      change: "+0.3",
      trend: "up",
      icon: Star,
    },
  ];

  return (
    <VendorLayout 
      currentPage="vendor-reports" 
      onNavigate={onNavigate} 
      activePage="vendor-reports"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('vendor.reportsAnalytics')}</h1>
            <p className="text-gray-600">{t('vendor.analyzeBusinessPerformance')}</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">{t('vendor.thisMonth')}</SelectItem>
                <SelectItem value="last-month">{t('vendor.lastMonth')}</SelectItem>
                <SelectItem value="3months">{t('vendor.threeMonths')}</SelectItem>
                <SelectItem value="6months">{t('vendor.sixMonths')}</SelectItem>
                <SelectItem value="this-year">{t('vendor.thisYear')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {t('vendor.export')}
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
                  <span className="text-sm text-gray-500">{t('vendor.comparedToPrevious')}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">{t('vendor.revenueTab')}</TabsTrigger>
            <TabsTrigger value="bookings">{t('vendor.bookingsTab')}</TabsTrigger>
            <TabsTrigger value="occupancy">{t('vendor.occupancyTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('vendor.sixMonthRevenueChart')}</h3>
              
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">{data.month}</div>
                    <div className="flex-1 relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-green-500 to-green-600 flex items-center justify-end px-4"
                        style={{ width: `${(data.revenue / 195000000) * 100}%` }}
                      >
                        <span className="text-white font-semibold text-sm">
                          {(data.revenue / 1000000).toFixed(0)}M
                        </span>
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <p className="font-semibold text-gray-900">{data.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('vendor.totalRevenue')}</p>
                    <p className="text-2xl font-bold text-gray-900">₫935M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('vendor.averagePerMonth')}</p>
                    <p className="text-2xl font-bold text-gray-900">₫156M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('vendor.growth')}</p>
                    <p className="text-2xl font-bold text-green-600">+62.5%</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('vendor.topBookedRooms')}</h3>
              <div className="space-y-4">
                {topRooms.map((room, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{room.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{room.rating}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{room.bookings}</p>
                      <p className="text-xs text-gray-600">bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {(room.revenue / 1000000).toFixed(0)}M
                      </p>
                      <p className="text-xs text-gray-600">doanh thu</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('vendor.monthlyOccupancy')}</h3>
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">{data.month}</div>
                    <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-purple-500 to-purple-600 flex items-center justify-end px-4"
                        style={{ width: `${data.occupancy}%` }}
                      >
                        <span className="text-white font-semibold text-sm">
                          {data.occupancy}%
                        </span>
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <p className="text-sm text-gray-600">{data.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{t('vendor.averageRate')}</p>
                    <p className="text-3xl font-bold text-purple-600">83.5%</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{t('vendor.highestMonth')}</p>
                    <p className="text-3xl font-bold text-green-600">92%</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VendorLayout>
  );
}
