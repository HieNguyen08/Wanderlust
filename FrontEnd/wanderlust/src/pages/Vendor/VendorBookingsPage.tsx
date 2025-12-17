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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { vendorApi, type VendorBooking } from "../../api/vendorApi";
import { useSmartPagination } from "../../hooks/useSmartPagination";
import { useCallback } from "react";
import { PaginationUI } from "../../components/ui/PaginationUI";
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

interface VendorBookingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

export default function VendorBookingsPage({
  onNavigate,
  vendorType = "hotel"
}: VendorBookingsPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<VendorBooking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<VendorBooking | null>(null);
  // const [bookings, setBookings] = useState<VendorBooking[]>([]);
  // const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (page: number, size: number) => {
    try {
      const data: any = await vendorApi.getVendorBookings({
        page,
        size,
        search: searchQuery,
        status: activeTab === 'all' ? undefined : activeTab
      });

      const list = (Array.isArray(data?.content) ? data.content : []).map((item: any) => ({
        id: item.id,
        bookingCode: item.bookingCode || item.id,
        customer: item.customer || item.customerName || item.guestInfo?.firstName + ' ' + item.guestInfo?.lastName || "Guest",
        service: item.service || item.serviceName || item.productName || "Service",
        date: item.date || item.bookingDate || item.createdAt || new Date().toISOString(),
        amount: item.amount || item.totalPrice || 0,
        status: (item.status || "pending").toLowerCase(),
        payment: (item.paymentStatus || item.payment || "pending").toLowerCase(),
        // Keep original object for details if needed
        ...item
      })) as VendorBooking[];

      return {
        data: list,
        totalItems: data.totalElements || 0
      };
    } catch (error) {
      toast.error(t('vendor.cannotLoadBookings'));
      return { data: [], totalItems: 0 };
    }
  }, [activeTab, searchQuery, t]);

  const {
    currentItems: bookings,
    isLoading: loading,
    goToPage,
    currentPage,
    totalPages,
    refresh: reloadBookings
  } = useSmartPagination({
    fetchData,
    initialPageSize: 10
  });

  // Reset to first page when parameters change
  useEffect(() => {
    goToPage(0);
  }, [activeTab, searchQuery]);

  // Removed manual loadBookings
  // useEffect load removed as managed by pagination hook

  const stats = useMemo(() => {
    const pending = bookings.filter(b => b.status === "pending").length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;
    const revenue = bookings
      .filter(b => b.payment === "paid")
      .reduce((acc, b) => acc + (b.amount || 0), 0);

    const formatMillions = (value: number) => {
      if (!value || Number.isNaN(value)) return "0";
      const millions = value / 1_000_000;
      return `${millions.toFixed(millions >= 100 ? 0 : 1)}M`;
    };

    return [
      { label: t('vendor.totalBookings'), value: bookings.length.toString(), color: "blue" },
      { label: t('vendor.pendingApproval'), value: pending.toString(), color: "yellow" },
      { label: t('vendor.cancelled'), value: cancelled.toString(), color: "red" },
      { label: t('vendor.revenue'), value: formatMillions(revenue), color: "green" },
    ];
  }, [bookings, t]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700">{t('common.confirmed')}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('common.pending')}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">{t('common.cancelled')}</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">{t('common.completed')}</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">{t('common.paid')}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('common.pendingPayment')}</Badge>;
      default:
        return null;
    }
  };

  const filteredBookings = bookings; // Already filtered by API

  const handleViewDetail = (booking: VendorBooking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await vendorApi.confirmBooking(bookingId);
      reloadBookings(); // Reload data
    } catch (error) {
      toast.error(t('vendor.cannotConfirmBooking'));
    }
  };

  const handleOpenCancelDialog = (booking: VendorBooking) => {
    setBookingToCancel(booking);
    setIsCancelDialogOpen(true);
  };

  const handleCancelBooking = async (reason: string) => {
    if (bookingToCancel) {
      try {
        await vendorApi.rejectBooking(bookingToCancel.id, reason);
        toast.error(`${t('vendor.bookingCancelled')} ${bookingToCancel.id}`);
        setIsCancelDialogOpen(false);
        setBookingToCancel(null);
        reloadBookings(); // Reload data
      } catch (error) {
        toast.error(t('vendor.cannotCancelBooking'));
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
          <h1 className="text-3xl text-gray-900 mb-2">{t('vendor.manageBookings')}</h1>
          <p className="text-gray-600">{t('vendor.manageBookingsDesc')}</p>
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
                placeholder={t('vendor.searchBookings')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {t('vendor.export')}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
              <TabsTrigger value="pending">{t('vendor.pendingProcessing')}</TabsTrigger>
              <TabsTrigger value="confirmed">{t('common.confirmed')}</TabsTrigger>
              <TabsTrigger value="completed">{t('common.completed')}</TabsTrigger>
              <TabsTrigger value="cancelled">{t('common.cancelled')}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('vendor.bookingCode')}</TableHead>
                      <TableHead>{t('vendor.customer')}</TableHead>
                      <TableHead>{t('vendor.service')}</TableHead>
                      <TableHead>{t('vendor.checkIn')}</TableHead>
                      <TableHead>{t('vendor.checkOut')}</TableHead>
                      <TableHead>{t('vendor.guests')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('vendor.paymentStatus')}</TableHead>
                      <TableHead>{t('vendor.amount')}</TableHead>
                      <TableHead className="text-right">{t('vendor.actions')}</TableHead>
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
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          {t('vendor.noBookingsFound', 'No bookings found')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
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
                              {booking.checkIn || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {booking.checkOut || '-'}
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
                            {(((booking.amount || 0) / 1000000)).toFixed(1)}M
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
                                  {t('vendor.viewDetails')}
                                </DropdownMenuItem>
                                {booking.status === "pending" && (
                                  <DropdownMenuItem
                                    className="gap-2 text-green-600"
                                    onClick={() => handleConfirmBooking(booking.id)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('vendor.confirm')}
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "cancelled" && booking.status !== "completed" && (
                                  <DropdownMenuItem
                                    className="gap-2 text-red-600"
                                    onClick={() => handleOpenCancelDialog(booking)}
                                  >
                                    <X className="w-4 h-4" />
                                    {t('vendor.cancelBooking')}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="gap-2">
                                  <Download className="w-4 h-4" />
                                  {t('vendor.downloadInvoice')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination UI */}
          <div className="mt-8 flex justify-center">
            <PaginationUI
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(p) => goToPage(p - 1)}
            />
          </div>
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
      {
        bookingToCancel && (
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
        )
      }
    </VendorLayout >
  );
}
