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
import { AdminBooking, adminBookingApi, BookingStatus, BookingType, PaymentStatus } from "../../api/adminBookingApi";
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

interface AdminBookingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

// Using AdminBooking from API
type Booking = AdminBooking;

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
        const data = await adminBookingApi.getAllBookings();
        
        // Load service details for each booking
        const bookingsWithDetails = await Promise.all(
          data.map(async (booking) => {
            const serviceDetails = await adminBookingApi.loadServiceDetails(booking);
            return { ...booking, serviceDetails: serviceDetails || undefined };
          })
        );
        
        setBookings(bookingsWithDetails);
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

  const handleConfirm = async (booking: Booking) => {
    try {
      await adminBookingApi.confirmBooking(booking.id);
      toast.success(t('admin.bookingConfirmed', { id: booking.bookingCode }));
      // Reload bookings
      const data = await adminBookingApi.getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error(t('admin.cannotConfirmBooking'));
    }
  };

  const handleCancel = async (booking: Booking) => {
    try {
      await adminBookingApi.cancelBooking(booking.id, 'Cancelled by admin');
      toast.success(t('admin.bookingCancelled', { id: booking.bookingCode }));
      // Reload bookings
      const data = await adminBookingApi.getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error(t('admin.cannotCancelBooking'));
    }
  };

  const handleRefund = async (booking: Booking) => {
    try {
      await adminBookingApi.updateBooking(booking.id, { paymentStatus: 'REFUNDED' });
      toast.success(t('admin.refundProcessed', { id: booking.bookingCode }));
      // Reload bookings
      const data = await adminBookingApi.getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error(t('admin.cannotProcessRefund'));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.guestInfo?.fullName || '';
    const customerEmail = booking.guestInfo?.email || '';
    const matchesSearch = searchQuery === "" ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "confirmed" || activeTab === "pending" || activeTab === "cancelled" || activeTab === "completed") {
      return matchesSearch && booking.status === activeTab.toUpperCase();
    }
    // Filter by booking type
    return matchesSearch && booking.bookingType === activeTab.toUpperCase();
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
      value: bookings.filter(b => b.status === "CONFIRMED").length,
      change: "+8.2%",
      icon: CheckCircle2,
      color: "green"
    },
    {
      label: t('admin.pending'),
      value: bookings.filter(b => b.status === "PENDING").length,
      change: "-3.1%",
      icon: Clock,
      color: "orange"
    },
    {
      label: t('admin.cancelled'),
      value: bookings.filter(b => b.status === "CANCELLED").length,
      change: "+1.8%",
      icon: XCircle,
      color: "red"
    },
  ];

  const getTypeBadge = (type: BookingType) => {
    const config: Record<BookingType, { label: string; icon: any; color: string }> = {
      FLIGHT: { label: t('admin.flightTicket'), icon: Plane, color: "blue" },
      HOTEL: { label: t('admin.hotel'), icon: Hotel, color: "green" },
      CAR_RENTAL: { label: t('admin.carRental'), icon: Car, color: "purple" },
      ACTIVITY: { label: t('admin.activity'), icon: Activity, color: "orange" },
    };
    const typeConfig = config[type];
    if (!typeConfig) return null;
    const { label, icon: Icon, color } = typeConfig;
    return (
      <Badge className={`bg-${color}-100 text-${color}-700 gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-700">{t('admin.confirmed')}</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('admin.pending')}</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-700">{t('admin.cancelled')}</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-700">{t('admin.completed')}</Badge>;
      case "REFUND_REQUESTED":
        return <Badge className="bg-orange-100 text-orange-700">{t('admin.refundRequested')}</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (payment: PaymentStatus) => {
    switch (payment) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-700">{t('admin.paid')}</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('admin.pendingPayment')}</Badge>;
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-700">{t('admin.processing')}</Badge>;
      case "REFUNDED":
        return <Badge className="bg-gray-100 text-gray-700">{t('admin.refunded')}</Badge>;
      case "FAILED":
        return <Badge className="bg-red-100 text-red-700">{t('admin.failed')}</Badge>;
      default:
        return null;
    }
  };

  // Helper to get service name based on booking type
  const getServiceName = (booking: Booking): string => {
    if (booking.serviceDetails) {
      return booking.serviceDetails.name;
    }
    // Fallback to IDs if service details not loaded
    if (booking.flightId) return `Flight: ${booking.flightId}`;
    if (booking.hotelId) return `Hotel: ${booking.hotelId}`;
    if (booking.carRentalId) return `Car: ${booking.carRentalId}`;
    if (booking.activityId) return `Activity: ${booking.activityId}`;
    return 'N/A';
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
              <TabsTrigger value="confirmed">{t('admin.confirmed')} ({bookings.filter(b => b.status === 'CONFIRMED').length})</TabsTrigger>
              <TabsTrigger value="pending">{t('admin.pending')} ({bookings.filter(b => b.status === 'PENDING').length})</TabsTrigger>
              <TabsTrigger value="cancelled">{t('admin.cancelled')} ({bookings.filter(b => b.status === 'CANCELLED').length})</TabsTrigger>
              <TabsTrigger value="completed">{t('admin.completed')} ({bookings.filter(b => b.status === 'COMPLETED').length})</TabsTrigger>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          {t('common.loading')}
                        </TableCell>
                      </TableRow>
                    ) : filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          {t('admin.noBookingsFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.bookingCode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{booking.guestInfo?.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{booking.guestInfo?.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(booking.bookingType)}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">{getServiceName(booking)}</p>
                          {booking.serviceDetails?.location && (
                            <p className="text-xs text-gray-500 truncate">{booking.serviceDetails.location}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {booking.startDate || 'N/A'}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {booking.totalPrice ? (booking.totalPrice / 1000000).toFixed(1) + 'M' : 'N/A'}
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
                                {booking.status === "PENDING" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-green-600"
                                    onClick={() => handleConfirm(booking)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('admin.confirm')}
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-red-600"
                                    onClick={() => handleCancel(booking)}
                                  >
                                    <X className="w-4 h-4" />
                                    {t('admin.cancelBooking')}
                                  </DropdownMenuItem>
                                )}
                                {booking.paymentStatus === "COMPLETED" && booking.status === "CANCELLED" && (
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
                    ))
                    )}
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
