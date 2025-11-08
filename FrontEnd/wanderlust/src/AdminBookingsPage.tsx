import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Search, MoreVertical, Eye, RefreshCw, X,
  Plane, Hotel, Car, Activity, Download,
  CheckCircle, XCircle, Clock
} from "lucide-react";
import type { PageType } from "./MainApp";
import { BookingDetailDialog } from "./components/admin/BookingDetailDialog";
import { toast } from "sonner";

interface AdminBookingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface Booking {
  id: string;
  customer: string;
  email: string;
  type: "flight" | "hotel" | "car" | "activity";
  service: string;
  bookingDate: string;
  travelDate: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  amount: number;
  payment: "paid" | "pending" | "refunded";
}

export default function AdminBookingsPage({ onNavigate }: AdminBookingsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleConfirm = (booking: Booking) => {
    toast.success(`Đã xác nhận booking ${booking.id}`);
    // TODO: Implement confirm logic
  };

  const handleCancel = (booking: Booking) => {
    toast.error(`Đã hủy booking ${booking.id}`);
    // TODO: Implement cancel logic
  };

  const handleRefund = (booking: Booking) => {
    toast.success(`Đã hoàn tiền cho booking ${booking.id}`);
    // TODO: Implement refund logic
  };

  const bookings: Booking[] = [
    {
      id: "BK001",
      customer: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      type: "hotel",
      service: "JW Marriott Phu Quoc - Deluxe Ocean View",
      bookingDate: "2025-01-15",
      travelDate: "2025-02-20",
      status: "confirmed",
      amount: 10500000,
      payment: "paid",
    },
    {
      id: "BK002",
      customer: "Trần Thị B",
      email: "tranthib@email.com",
      type: "flight",
      service: "HAN → SGN - Vietnam Airlines VN117",
      bookingDate: "2025-01-15",
      travelDate: "2025-01-20",
      status: "pending",
      amount: 2500000,
      payment: "pending",
    },
    {
      id: "BK003",
      customer: "Lê Văn C",
      email: "levanc@email.com",
      type: "activity",
      service: "Tour Thái Lan trọn gói (Bangkok, Pattaya)",
      bookingDate: "2025-01-14",
      travelDate: "2025-03-10",
      status: "confirmed",
      amount: 6690000,
      payment: "paid",
    },
    {
      id: "BK004",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      type: "car",
      service: "Toyota Camry 2024 - 3 ngày",
      bookingDate: "2025-01-14",
      travelDate: "2025-01-18",
      status: "cancelled",
      amount: 1800000,
      payment: "refunded",
    },
    {
      id: "BK005",
      customer: "Hoàng Văn E",
      email: "hoangvane@email.com",
      type: "hotel",
      service: "InterContinental Danang - Premium Ocean View",
      bookingDate: "2025-01-13",
      travelDate: "2025-01-25",
      status: "confirmed",
      amount: 8400000,
      payment: "paid",
    },
    {
      id: "BK006",
      customer: "Võ Thị F",
      email: "vothif@email.com",
      type: "flight",
      service: "SGN → SIN - VietJet Air VJ651",
      bookingDate: "2025-01-12",
      travelDate: "2025-02-05",
      status: "completed",
      amount: 3200000,
      payment: "paid",
    },
  ];

  const stats = [
    { label: "Tổng bookings", value: "1,245", color: "blue", icon: CheckCircle },
    { label: "Chờ xử lý", value: "127", color: "yellow", icon: Clock },
    { label: "Đã hủy", value: "85", color: "red", icon: XCircle },
    { label: "Doanh thu", value: "₫523M", color: "green", icon: CheckCircle },
  ];

  const getTypeBadge = (type: string) => {
    const config = {
      flight: { label: "Vé máy bay", icon: Plane, color: "blue" },
      hotel: { label: "Khách sạn", icon: Hotel, color: "green" },
      car: { label: "Thuê xe", icon: Car, color: "purple" },
      activity: { label: "Hoạt động", icon: Activity, color: "orange" },
    };
    const { label, icon: Icon, color } = config[type as keyof typeof config];
    return (
      <Badge className={`bg-${color}-100 text-${color}-700 gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700">Đã xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ xử lý</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">Hoàn thành</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Đã thanh toán</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ thanh toán</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-700">Đã hoàn tiền</Badge>;
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || booking.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout currentPage="admin-bookings" onNavigate={onNavigate} activePage="admin-bookings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Quản lý Bookings</h1>
          <p className="text-gray-600">Quản lý tất cả đơn đặt chỗ và giao dịch</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Search & Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mã booking, khách hàng, dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tất cả ({bookings.length})</TabsTrigger>
              <TabsTrigger value="flight">Vé máy bay</TabsTrigger>
              <TabsTrigger value="hotel">Khách sạn</TabsTrigger>
              <TabsTrigger value="car">Thuê xe</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã booking</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Ngày đi</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{booking.customer}</p>
                            <p className="text-sm text-gray-500">{booking.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(booking.type)}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-900 truncate">{booking.service}</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {booking.bookingDate}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {booking.travelDate}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{getPaymentBadge(booking.payment)}</TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {(booking.amount / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleViewDetail(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <Download className="w-4 h-4" />
                                  Tải hóa đơn
                                </DropdownMenuItem>
                                {booking.status === "pending" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-green-600"
                                    onClick={() => handleConfirm(booking)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Xác nhận
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "cancelled" && booking.status !== "completed" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-red-600"
                                    onClick={() => handleCancel(booking)}
                                  >
                                    <X className="w-4 h-4" />
                                    Hủy booking
                                  </DropdownMenuItem>
                                )}
                                {booking.payment === "paid" && booking.status === "cancelled" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-blue-600"
                                    onClick={() => handleRefund(booking)}
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Hoàn tiền
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Booking Detail Dialog */}
      <BookingDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        booking={selectedBooking}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onRefund={handleRefund}
      />
    </AdminLayout>
  );
}
