import {
    Calendar,
    CheckCircle,
    Download,
    Eye,
    Mail,
    MoreVertical,
    Phone,
    Search,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { VendorCancelOrderDialog } from "../../components/VendorCancelOrderDialog";
import { VendorLayout } from "../../components/VendorLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BookingDetailDialog } from "../../components/vendor/BookingDetailDialog";
import { vendorApi } from "../../utils/api";

interface VendorBookingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  payment: "paid" | "pending";
  amount: number;
  bookingDate: string;
}

export default function VendorBookingsPage({ 
  onNavigate,
  vendorType = "hotel"
}: VendorBookingsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await vendorApi.getVendorBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Không thể tải danh sách booking');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Tổng bookings", value: "186", color: "blue" },
    { label: "Chờ xác nhận", value: "12", color: "yellow" },
    { label: "Đã hủy", value: "8", color: "red" },
    { label: "Doanh thu", value: "₫523M", color: "green" },
  ];

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
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await vendorApi.confirmBooking(bookingId);
      toast.success(`Đã xác nhận booking ${bookingId}`);
      loadBookings(); // Reload data
    } catch (error) {
      toast.error('Không thể xác nhận booking');
    }
  };

  const handleOpenCancelDialog = (booking: Booking) => {
    setBookingToCancel(booking);
    setIsCancelDialogOpen(true);
  };

  const handleCancelBooking = async (reason: string) => {
    if (bookingToCancel) {
      try {
        await vendorApi.rejectBooking(bookingToCancel.id, reason);
        toast.error(`Đã hủy booking ${bookingToCancel.id}`);
        setIsCancelDialogOpen(false);
        setBookingToCancel(null);
        loadBookings(); // Reload data
      } catch (error) {
        toast.error('Không thể hủy booking');
      }
    }
  };

  return (
    <VendorLayout 
      currentPage="vendor-bookings" 
      onNavigate={onNavigate} 
      activePage="vendor-bookings"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Quản lý Đơn đặt chỗ</h1>
          <p className="text-gray-600">Quản lý tất cả đơn đặt phòng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Search & Tabs */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mã booking, khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tất cả ({bookings.length})</TabsTrigger>
              <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
              <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã booking</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Khách</TableHead>
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
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Mail className="w-3 h-3" />
                              {booking.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              {booking.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-900 truncate">{booking.service}</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {booking.checkIn}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {booking.checkOut}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">{booking.guests}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{getPaymentBadge(booking.payment)}</TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {(booking.amount / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => handleViewDetail(booking)}
                              >
                                <Eye className="w-4 h-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <DropdownMenuItem 
                                  className="gap-2 text-green-600"
                                  onClick={() => handleConfirmBooking(booking.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Xác nhận
                                </DropdownMenuItem>
                              )}
                              {booking.status !== "cancelled" && booking.status !== "completed" && (
                                <DropdownMenuItem 
                                  className="gap-2 text-red-600"
                                  onClick={() => handleOpenCancelDialog(booking)}
                                >
                                  <X className="w-4 h-4" />
                                  Hủy booking
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="gap-2">
                                <Download className="w-4 h-4" />
                                Tải hóa đơn
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
        booking={selectedBooking}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onConfirm={handleConfirmBooking}
        onCancel={(bookingId) => {
          const booking = bookings.find(b => b.id === bookingId);
          if (booking) handleOpenCancelDialog(booking);
        }}
      />

      {/* Cancel Order Dialog - 3 Steps */}
      {bookingToCancel && (
        <VendorCancelOrderDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          order={{
            id: bookingToCancel.id,
            customerName: bookingToCancel.customer,
            serviceName: bookingToCancel.service,
            amount: bookingToCancel.amount,
          }}
          onConfirm={handleCancelBooking}
        />
      )}
    </VendorLayout>
  );
}
