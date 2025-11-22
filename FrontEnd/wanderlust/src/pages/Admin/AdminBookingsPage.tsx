import {
    Activity,
    Calendar,
    Car,
    CheckCircle,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    Hotel,
    MoreVertical,
    Plane,
    RefreshCw,
    Search,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { AdminLayout } from "../../components/AdminLayout";
import { BookingDetailDialog } from "../../components/admin/BookingDetailDialog";
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
import { adminApi } from "../../utils/api";

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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        toast.error(t('admin.cannotLoadBookings'));
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleConfirm = (booking: Booking) => {
    toast.success(t('admin.bookingConfirmed', { id: booking.id }));
    // TODO: Implement confirm logic
  };

  const handleCancel = (booking: Booking) => {
    toast.error(t('admin.bookingCancelled', { id: booking.id }));
    // TODO: Implement cancel logic
  };

  const handleRefund = async (booking: Booking) => {
    try {
      await adminApi.deleteBooking(booking.id);
      toast.success(t('admin.refundProcessed', { id: booking.id }));
      // Reload bookings
      const data = await adminApi.getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error(t('admin.cannotProcessRefund'));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchQuery === "" ||
      booking.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && booking.status === activeTab;
  });

  const stats = [
    {
      label: t('admin.totalBookings'),
      value: bookings.length,
      change: "+12.5%",
      icon: Calendar,
      color: "blue"
    },
    {
      label: t('admin.confirmed'),
      value: bookings.filter(b => b.status === "confirmed").length,
      change: "+8.2%",
      icon: CheckCircle2,
      color: "green"
    },
    {
      label: t('admin.pending'),
      value: bookings.filter(b => b.status === "pending").length,
      change: "-3.1%",
      icon: Clock,
      color: "orange"
    },
    {
      label: t('admin.cancelled'),
      value: bookings.filter(b => b.status === "cancelled").length,
      change: "+1.8%",
      icon: XCircle,
      color: "red"
    },
  ];

  const mockBookings = [
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

  const getTypeBadge = (type: string) => {
    const config = {
      flight: { label: t('admin.flightTicket'), icon: Plane, color: "blue" },
      hotel: { label: t('admin.hotel'), icon: Hotel, color: "green" },
      car: { label: t('admin.carRental'), icon: Car, color: "purple" },
      activity: { label: t('admin.activity'), icon: Activity, color: "orange" },
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
        return <Badge className="bg-green-100 text-green-700">{t('admin.confirmed')}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('admin.pending')}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">{t('admin.cancelled')}</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">{t('admin.completed')}</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">{t('admin.paid')}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('admin.pendingPayment')}</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-700">{t('admin.refunded')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="admin-bookings" onNavigate={onNavigate} activePage="admin-bookings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('admin.manageBookings')}</h1>
          <p className="text-gray-600">{t('admin.manageBookingsDesc')}</p>
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
                placeholder={t('admin.searchBookings')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {t('admin.exportExcel')}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{t('common.all')} ({bookings.length})</TabsTrigger>
              <TabsTrigger value="flight">{t('admin.flightTicket')}</TabsTrigger>
              <TabsTrigger value="hotel">{t('admin.hotel')}</TabsTrigger>
              <TabsTrigger value="car">{t('admin.carRental')}</TabsTrigger>
              <TabsTrigger value="activity">{t('admin.activity')}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.bookingCode')}</TableHead>
                      <TableHead>{t('admin.customer')}</TableHead>
                      <TableHead>{t('admin.type')}</TableHead>
                      <TableHead>{t('admin.service')}</TableHead>
                      <TableHead>{t('admin.bookingDate')}</TableHead>
                      <TableHead>{t('admin.travelDate')}</TableHead>
                      <TableHead>{t('admin.status')}</TableHead>
                      <TableHead>{t('admin.payment')}</TableHead>
                      <TableHead>{t('admin.amount')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions')}</TableHead>
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
                                  {t('admin.downloadInvoice')}
                                </DropdownMenuItem>
                                {booking.status === "pending" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-green-600"
                                    onClick={() => handleConfirm(booking)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('admin.confirm')}
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "cancelled" && booking.status !== "completed" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-red-600"
                                    onClick={() => handleCancel(booking)}
                                  >
                                    <X className="w-4 h-4" />
                                    {t('admin.cancelBooking')}
                                  </DropdownMenuItem>
                                )}
                                {booking.payment === "paid" && booking.status === "cancelled" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-blue-600"
                                    onClick={() => handleRefund(booking)}
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    {t('admin.refund')}
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
