import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Plus, MoreVertical, Edit, Trash2, Eye,
  Star, MapPin, Users, TrendingUp, Activity
} from "lucide-react";
import type { PageType } from "./MainApp";
import { toast } from "sonner";

interface AdminActivitiesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface ActivityItem {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  participants: number;
  bookings: number;
  revenue: number;
  status: "active" | "inactive";
  category: string;
}

export default function AdminActivitiesPage({ onNavigate }: AdminActivitiesPageProps) {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const activities: ActivityItem[] = [
    {
      id: "A001",
      name: "Lặn biển ngắm san hô",
      location: "Nha Trang, Việt Nam",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 234,
      price: 850000,
      duration: "4 giờ",
      participants: 15,
      bookings: 145,
      revenue: 123250000,
      status: "active",
      category: "Thể thao nước",
    },
    {
      id: "A002",
      name: "Tour Phố cổ Hội An",
      location: "Hội An, Việt Nam",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 456,
      price: 450000,
      duration: "3 giờ",
      participants: 25,
      bookings: 289,
      revenue: 130050000,
      status: "active",
      category: "Tham quan",
    },
    {
      id: "A003",
      name: "Bay dù lượn ngắm biển",
      location: "Đà Nẵng, Việt Nam",
      image: "https://images.unsplash.com/photo-1483918793747-5adbf82956c4?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 189,
      price: 1200000,
      duration: "30 phút",
      participants: 2,
      bookings: 98,
      revenue: 117600000,
      status: "active",
      category: "Mạo hiểm",
    },
    {
      id: "A004",
      name: "Cooking Class Việt Nam",
      location: "TP. Hồ Chí Minh, Việt Nam",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 321,
      price: 650000,
      duration: "2.5 giờ",
      participants: 12,
      bookings: 178,
      revenue: 115700000,
      status: "active",
      category: "Ẩm thực",
    },
    {
      id: "A005",
      name: "Massage & Spa truyền thống",
      location: "Hà Nội, Việt Nam",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 267,
      price: 550000,
      duration: "90 phút",
      participants: 5,
      bookings: 234,
      revenue: 128700000,
      status: "active",
      category: "Thư giãn",
    },
    {
      id: "A006",
      name: "Tour Vịnh Hạ Long",
      location: "Quảng Ninh, Việt Nam",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 512,
      price: 950000,
      duration: "8 giờ",
      participants: 30,
      bookings: 203,
      revenue: 192850000,
      status: "active",
      category: "Tham quan",
    },
  ];

  const stats = [
    { label: "Tổng hoạt động", value: "285", icon: Activity },
    { label: "Đang hoạt động", value: "267", icon: Activity },
    { label: "Bookings tháng này", value: "1,347", icon: TrendingUp },
    { label: "Doanh thu", value: "₫808M", icon: TrendingUp },
  ];

  const handleViewDetail = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setIsDetailOpen(true);
  };

  const handleEdit = (activity: ActivityItem) => {
    toast.success(`Chỉnh sửa ${activity.name}`);
    // TODO: Open edit dialog or navigate to edit page
  };

  const handleDelete = (activity: ActivityItem) => {
    toast.error(`Xóa ${activity.name}`);
    // TODO: Show delete confirmation
  };

  return (
    <AdminLayout currentPage="admin-activities" onNavigate={onNavigate} activePage="admin-activities">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Quản lý Hoạt động vui chơi</h1>
            <p className="text-gray-600">Quản lý thông tin hoạt động và dịch vụ vui chơi</p>
          </div>
          <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm hoạt động
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm hoạt động mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin hoạt động vui chơi mới vào hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="activityName">Tên hoạt động</Label>
                  <Input id="activityName" placeholder="Lặn biển ngắm san hô..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" placeholder="Nha Trang, Việt Nam" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Input id="category" placeholder="Thể thao nước" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="duration">Thời lượng</Label>
                  <Input id="duration" placeholder="4 giờ" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="participants">Số người</Label>
                  <Input id="participants" type="number" placeholder="15" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="price">Giá (VND)</Label>
                  <Input id="price" type="number" placeholder="850000" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="stars">Đánh giá</Label>
                  <Input id="stars" type="number" min="1" max="5" step="0.1" placeholder="4.8" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea id="description" placeholder="Mô tả chi tiết..." className="mt-1" rows={3} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image">URL hình ảnh</Label>
                  <Input id="image" placeholder="https://..." className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Button className="w-full">Thêm hoạt động</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Activities Grid */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      activity.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {activity.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                  <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                    {activity.category}
                  </Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {activity.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{activity.rating}</span>
                    <span className="text-sm text-gray-600">({activity.reviews} đánh giá)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Thời lượng</p>
                      <p className="font-semibold text-gray-900">{activity.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Số người</p>
                      <p className="font-semibold text-gray-900">{activity.participants}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Bookings</p>
                      <p className="font-semibold text-gray-900">{activity.bookings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Doanh thu</p>
                      <p className="font-semibold text-green-600">
                        {(activity.revenue / 1000000).toFixed(0)}M
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Giá</p>
                      <p className="text-xl font-bold text-blue-600">
                        {(activity.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleViewDetail(activity)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleEdit(activity)}
                          >
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-600"
                            onClick={() => handleDelete(activity)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedActivity?.name || "Chi tiết hoạt động"}</DialogTitle>
            <DialogDescription>Mã hoạt động: {selectedActivity?.id || "N/A"}</DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <>


              <div className="space-y-6 py-4">
                {/* Image & Status */}
                <div className="relative">
                  <ImageWithFallback
                    src={selectedActivity.image}
                    alt={selectedActivity.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      selectedActivity.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedActivity.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                  <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                    {selectedActivity.category}
                  </Badge>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-lg">{selectedActivity.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-gray-900">{selectedActivity.rating}</span>
                  </div>
                  <span className="text-gray-600">({selectedActivity.reviews} đánh giá)</span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Số người</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedActivity.participants}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Thời lượng</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedActivity.duration}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedActivity.bookings}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(selectedActivity.revenue / 1000000).toFixed(0)}M
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1">
                    Đóng
                  </Button>
                  <Button 
                    onClick={() => {
                      handleEdit(selectedActivity);
                      setIsDetailOpen(false);
                    }}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </Button>
                  <Button 
                    onClick={() => {
                      handleDelete(selectedActivity);
                      setIsDetailOpen(false);
                    }}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
