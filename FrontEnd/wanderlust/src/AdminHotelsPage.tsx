import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
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
import { Textarea } from "./components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Search, Plus, MoreVertical, Edit, Trash2, Eye,
  Star, MapPin, Building2, TrendingUp
} from "lucide-react";
import type { PageType } from "./MainApp";
import { HotelDetailDialog } from "./components/admin/HotelDetailDialog";
import { toast } from "sonner";

interface AdminHotelsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  rooms: number;
  bookings: number;
  revenue: number;
  status: "active" | "inactive";
}

export default function AdminHotelsPage({ onNavigate }: AdminHotelsPageProps) {
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const hotels: Hotel[] = [
    {
      id: "H001",
      name: "JW Marriott Phu Quoc",
      location: "Phú Quốc, Việt Nam",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 234,
      price: 3500000,
      rooms: 120,
      bookings: 45,
      revenue: 157500000,
      status: "active",
    },
    {
      id: "H002",
      name: "InterContinental Danang",
      location: "Đà Nẵng, Việt Nam",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 456,
      price: 2800000,
      rooms: 95,
      bookings: 38,
      revenue: 106400000,
      status: "active",
    },
    {
      id: "H003",
      name: "Vinpearl Resort Nha Trang",
      location: "Nha Trang, Việt Nam",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 189,
      price: 2500000,
      rooms: 150,
      bookings: 32,
      revenue: 80000000,
      status: "active",
    },
    {
      id: "H004",
      name: "Azerai La Residence Hue",
      location: "Huế, Việt Nam",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 321,
      price: 3200000,
      rooms: 80,
      bookings: 28,
      revenue: 89600000,
      status: "active",
    },
    {
      id: "H005",
      name: "Sheraton Grand Hanoi",
      location: "Hà Nội, Việt Nam",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 567,
      price: 2200000,
      rooms: 110,
      bookings: 42,
      revenue: 92400000,
      status: "active",
    },
    {
      id: "H006",
      name: "Rex Hotel Saigon",
      location: "TP. Hồ Chí Minh, Việt Nam",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 412,
      price: 1800000,
      rooms: 90,
      bookings: 15,
      revenue: 27000000,
      status: "inactive",
    },
  ];

  const stats = [
    { label: "Tổng khách sạn", value: "156", icon: Building2 },
    { label: "Đang hoạt động", value: "142", icon: Building2 },
    { label: "Bookings tháng này", value: "523", icon: TrendingUp },
    { label: "Doanh thu", value: "₫892M", icon: TrendingUp },
  ];

  const handleViewDetail = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsDetailOpen(true);
  };

  const handleEdit = (hotel: Hotel) => {
    toast.success(`Chỉnh sửa ${hotel.name}`);
    // TODO: Open edit dialog or navigate to edit page
  };

  const handleDelete = (hotel: Hotel) => {
    toast.error(`Xóa ${hotel.name}`);
    // TODO: Show delete confirmation
  };

  const handleManageRooms = (hotel: Hotel) => {
    toast.info(`Quản lý phòng cho ${hotel.name}`);
    // TODO: Navigate to rooms management page
  };

  return (
    <AdminLayout currentPage="admin-hotels" onNavigate={onNavigate} activePage="admin-hotels">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Quản lý Khách sạn</h1>
            <p className="text-gray-600">Quản lý thông tin khách sạn và phòng</p>
          </div>
          <Dialog open={isAddHotelOpen} onOpenChange={setIsAddHotelOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm khách sạn
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm khách sạn mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin khách sạn mới vào hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="hotelName">Tên khách sạn</Label>
                  <Input id="hotelName" placeholder="JW Marriott..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" placeholder="Phú Quốc, Việt Nam" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="rooms">Số phòng</Label>
                  <Input id="rooms" type="number" placeholder="120" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="price">Giá/đêm (VND)</Label>
                  <Input id="price" type="number" placeholder="3500000" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="stars">Hạng sao</Label>
                  <Input id="stars" type="number" min="1" max="5" placeholder="5" className="mt-1" />
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
                  <Button className="w-full">Thêm khách sạn</Button>
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

        {/* Hotels Grid */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      hotel.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {hotel.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{hotel.rating}</span>
                    <span className="text-sm text-gray-600">({hotel.reviews} đánh giá)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Số phòng</p>
                      <p className="font-semibold text-gray-900">{hotel.rooms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Bookings</p>
                      <p className="font-semibold text-gray-900">{hotel.bookings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Giá/đêm</p>
                      <p className="font-semibold text-blue-600">
                        {(hotel.price / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Doanh thu</p>
                      <p className="font-semibold text-green-600">
                        {(hotel.revenue / 1000000).toFixed(0)}M
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleViewDetail(hotel)}
                    >
                      <Eye className="w-4 h-4" />
                      Xem
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
                          onClick={() => handleEdit(hotel)}
                        >
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleManageRooms(hotel)}
                        >
                          <Building2 className="w-4 h-4" />
                          Quản lý phòng
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-red-600"
                          onClick={() => handleDelete(hotel)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Hotel Detail Dialog */}
      <HotelDetailDialog
        hotel={selectedHotel}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageRooms={handleManageRooms}
      />
    </AdminLayout>
  );
}
