import {
    Activity,
    AlertCircle,
    Ban,
    Calendar,
    Car,
    CheckCircle,
    CreditCard,
    Download, Eye,
    FileText,
    Hotel,
    Mail,
    MapPin,
    Phone,
    Plane,
    Printer,
    QrCode,
    Star,
    Users,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { useNotification } from "../../contexts/NotificationContext";
import type { PageType } from "../../MainApp";
import { bookingApi, tokenService } from "../../utils/api";
import { type FrontendRole } from "../../utils/roleMapper";

interface BookingHistoryPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: FrontendRole | null;
  onLogout?: () => void;
}

interface Booking {
  id: string;
  type: "flight" | "hotel" | "car" | "activity";
  status: "completed" | "upcoming" | "cancelled";
  title: string;
  subtitle: string;
  date: string;
  endDate?: string;
  location: string;
  image: string;
  price: number;
  bookingCode: string;
  details?: string;
  participants?: {
    name: string;
    email: string;
    phone: string;
  }[];
  paymentDetails?: {
    method: string;
    transactionId: string;
    paidAt: string;
  };
  cancellationPolicy?: {
    refundPercentage: number;
    deadline: string;
    refundAmount: number;
  };
  vendorInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  hasReview?: boolean;
  // Original backend data
  rawData?: any;
}

export default function BookingHistoryPage({ onNavigate, userRole, onLogout }: BookingHistoryPageProps) {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [serviceFilter, setServiceFilter] = useState<"all" | "flight" | "hotel" | "car" | "activity">("all");

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Review form states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Transform backend booking data to UI format
  const transformBookingData = (apiBooking: any): Booking => {
    // Map backend status to UI status
    const statusMap: Record<string, "upcoming" | "completed" | "cancelled"> = {
      'PENDING': 'upcoming',
      'CONFIRMED': 'upcoming',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'REFUND_REQUESTED': 'cancelled'
    };

    // Map backend bookingType to UI type
    const typeMap: Record<string, "flight" | "hotel" | "car" | "activity"> = {
      'FLIGHT': 'flight',
      'HOTEL': 'hotel',
      'CAR_RENTAL': 'car',
      'ACTIVITY': 'activity'
    };

    const bookingType = typeMap[apiBooking.bookingType] || 'flight';

    // Extract location and subtitle based on type
    let location = 'N/A';
    let subtitle = '';
    let imageUrl = '';
    let title = '';

    if (bookingType === 'flight') {
      const flightMatch = apiBooking.specialRequests?.match(/Flight: (.*?) to (.*?)\./);
      location = flightMatch?.[1] || 'N/A';
      subtitle = flightMatch ? `${flightMatch[1]} → ${flightMatch[2]}` : 'Flight Booking';
      title = 'Vé máy bay';
      imageUrl = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop";
    } else if (bookingType === 'hotel') {
      const hotelMatch = apiBooking.specialRequests?.match(/Hotel: (.*?)\./);
      const roomMatch = apiBooking.specialRequests?.match(/Room: (.*?)\./);
      title = hotelMatch?.[1] || 'Khách sạn';
      subtitle = roomMatch?.[1] || 'Hotel Room';
      location = hotelMatch?.[1] || 'N/A';
      imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
    } else if (bookingType === 'car') {
      const carMatch = apiBooking.specialRequests?.match(/Car: (.*?)\./);
      const locationMatch = apiBooking.specialRequests?.match(/Location: (.*?)\./);
      title = carMatch?.[1] || 'Thuê xe';
      subtitle = carMatch?.[1] || 'Car Rental';
      location = locationMatch?.[1] || 'N/A';
      imageUrl = "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop";
    } else if (bookingType === 'activity') {
      const activityMatch = apiBooking.specialRequests?.match(/Activity: (.*?)\./);
      title = activityMatch?.[1] || 'Hoạt động';
      subtitle = activityMatch?.[1] || 'Activity';
      location = 'Activity Location';
      imageUrl = "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop";
    }

    // Format dates
    const startDate = apiBooking.startDate ? new Date(apiBooking.startDate) : new Date();
    const endDate = apiBooking.endDate ? new Date(apiBooking.endDate) : null;

    return {
      id: apiBooking.id,
      type: bookingType,
      status: statusMap[apiBooking.status] || 'upcoming',
      title: title,
      subtitle: subtitle,
      date: startDate.toLocaleDateString('vi-VN'),
      endDate: endDate ? endDate.toLocaleDateString('vi-VN') : undefined,
      location: location,
      image: imageUrl,
      price: apiBooking.totalPrice || 0,
      bookingCode: apiBooking.bookingCode || apiBooking.id.substring(0, 8).toUpperCase(),
      details: apiBooking.specialRequests || '',
      participants: apiBooking.guestInfo ? [
        {
          name: `${apiBooking.guestInfo.firstName || ''} ${apiBooking.guestInfo.lastName || ''}`.trim(),
          email: apiBooking.guestInfo.email || '',
          phone: apiBooking.guestInfo.phone || ''
        }
      ] : [],
      paymentDetails: {
        method: apiBooking.paymentMethod || 'Chưa thanh toán',
        transactionId: apiBooking.id,
        paidAt: apiBooking.bookingDate ? new Date(apiBooking.bookingDate).toLocaleString('vi-VN') : 'N/A'
      },
      cancellationPolicy: {
        refundPercentage: 80,
        deadline: '48 giờ trước',
        refundAmount: (apiBooking.totalPrice || 0) * 0.8
      },
      vendorInfo: {
        name: 'Wanderlust Travel',
        phone: '1900 xxxx',
        email: 'support@wanderlust.vn'
      },
      hasReview: false,
      rawData: apiBooking
    };
  };

  // Load bookings from backend
  useEffect(() => {
    const loadBookings = async () => {
      // Check authentication first
      if (!tokenService.isAuthenticated()) {
        toast.error('Vui lòng đăng nhập để xem lịch sử đặt chỗ');
        onNavigate('login');
        return;
      }

      try {
        setLoading(true);
        const bookingsData = await bookingApi.getMyBookings();

        // Transform API data to UI format
        const transformedBookings = Array.isArray(bookingsData)
          ? bookingsData.map(transformBookingData)
          : [];

        setBookings(transformedBookings);

        // Check for new bookings
        if (transformedBookings.length > 0) {
          // Sort by bookingDate descending
          const sortedByDate = [...transformedBookings].sort((a, b) => {
            const dateA = new Date(a.rawData.bookingDate || 0).getTime();
            const dateB = new Date(b.rawData.bookingDate || 0).getTime();
            return dateB - dateA;
          });

          const latestBooking = sortedByDate[0];
          const latestDate = new Date(latestBooking.rawData.bookingDate || 0).getTime();
          const lastCheck = parseInt(localStorage.getItem('last_booking_check') || '0');

          if (latestDate > lastCheck) {
            addNotification({
              type: 'booking',
              title: t('notifications.newBooking', 'Đặt chỗ mới thành công'),
              message: t('notifications.newBookingDesc', 'Bạn có đơn đặt chỗ mới: {{title}}', { title: latestBooking.title }),
              link: '/booking-history',
              data: { bookingId: latestBooking.id }
            });
            localStorage.setItem('last_booking_check', latestDate.toString());
          }
        }
      } catch (error: any) {
        console.error('Failed to load bookings:', error);

        // Handle authentication error
        if (error.message === 'UNAUTHORIZED') {
          toast.error('Phiên đăng nhập đã hết hạn');
          tokenService.clearAuth();
          onNavigate('login');
          return;
        }

        toast.error('Không thể tải lịch sử đặt chỗ');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      setIsCancelling(true);
      await bookingApi.cancelBooking(selectedBooking.id, cancelReason);

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
        )
      );

      toast.success('Đã hủy đặt chỗ thành công');
      setIsCancelDialogOpen(false);
      setCancelReason("");
      setSelectedBooking(null);

      // Reload bookings to get updated data
      const bookingsData = await bookingApi.getMyBookings();
      const transformedBookings = Array.isArray(bookingsData)
        ? bookingsData.map(transformBookingData)
        : [];
      setBookings(transformedBookings);
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      toast.error('Không thể hủy đặt chỗ. Vui lòng thử lại.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle refund request
  const handleRequestRefund = async (bookingId: string) => {
    try {
      await bookingApi.requestRefund(bookingId);
      toast.success('Đã gửi yêu cầu hoàn tiền thành công');

      // Reload bookings
      const bookingsData = await bookingApi.getMyBookings();
      const transformedBookings = Array.isArray(bookingsData)
        ? bookingsData.map(transformBookingData)
        : [];
      setBookings(transformedBookings);
    } catch (error: any) {
      console.error('Failed to request refund:', error);
      toast.error('Không thể gửi yêu cầu hoàn tiền');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flight": return Plane;
      case "hotel": return Hotel;
      case "car": return Car;
      case "activity": return Activity;
      default: return Hotel;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "flight": return t('profile.bookingHistory.flight', 'Vé máy bay');
      case "hotel": return t('profile.bookingHistory.hotel', 'Khách sạn');
      case "car": return t('profile.bookingHistory.car', 'Thuê xe');
      case "activity": return t('profile.bookingHistory.activity', 'Hoạt động');
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{t('profile.bookingHistory.upcoming')}</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{t('profile.bookingHistory.completed')}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{t('profile.bookingHistory.cancelled')}</Badge>;
      default:
        return null;
    }
  };

  // Filter bookings by tab and service type, then sort newest first
  const filteredBookings = bookings
    .filter(b => {
      const matchStatus = b.status === activeTab;
      const matchService = serviceFilter === "all" || b.type === serviceFilter;
      return matchStatus && matchService;
    })
    .sort((a, b) => {
      const dateA = new Date(a.rawData?.bookingDate || a.rawData?.createdAt || 0).getTime();
      const dateB = new Date(b.rawData?.bookingDate || b.rawData?.createdAt || 0).getTime();
      return dateB - dateA;
    });

  const stats = [
    {
      label: t('profile.bookingHistory.upcoming'),
      value: bookings.filter(b => b.status === "upcoming").length,
      icon: AlertCircle,
      color: "text-blue-600"
    },
    {
      label: t('profile.bookingHistory.completed'),
      value: bookings.filter(b => b.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: t('profile.bookingHistory.cancelled'),
      value: bookings.filter(b => b.status === "cancelled").length,
      icon: XCircle,
      color: "text-red-600"
    }
  ];

  // Handler functions
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleWriteReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setReviewText("");
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert(t('profile.bookingHistory.pleaseSelectRating', 'Vui lòng chọn số sao đánh giá'));
      return;
    }
    // Mock submit
    alert(t('profile.bookingHistory.reviewSubmitted', `Đã gửi đánh giá {{rating}} sao cho {{title}}`, { rating, title: selectedBooking?.title }));
    setIsReviewDialogOpen(false);
    // Update booking to mark as reviewed
    if (selectedBooking) {
      selectedBooking.hasReview = true;
    }
  };

  const handleRequestCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;

    // Mock cancel request - in real app, would trigger backend process
    alert(t('profile.bookingHistory.cancelRequestSent', `Đã gửi yêu cầu hủy booking {{code}}.\n\nTheo chính sách, bạn sẽ được hoàn {{percent}}% ({{amount}}đ).\n\nTrạng thái: Đang chờ xử lý hoàn tiền.\nThời gian hoàn tiền dự kiến: 5-7 ngày làm việc.`, {
      code: selectedBooking.bookingCode,
      percent: selectedBooking.cancellationPolicy?.refundPercentage,
      amount: selectedBooking.cancellationPolicy?.refundAmount.toLocaleString('vi-VN')
    }));

    setIsCancelDialogOpen(false);

    // In real app, this would update the booking status to "cancelled - pending refund"
    // and create a refund request for admin to process
  };

  // Handle booking completion confirmation
  const handleConfirmCompletion = async (booking: Booking) => {
    try {
      await bookingApi.completeBooking(booking.id);
      toast.success('Đã xác nhận hoàn thành chuyến đi');

      // Reload bookings to get updated data
      const bookingsData = await bookingApi.getMyBookings();
      const transformedBookings = Array.isArray(bookingsData)
        ? bookingsData.map(transformBookingData)
        : [];
      setBookings(transformedBookings);
    } catch (error: any) {
      console.error('Failed to confirm completion:', error);
      toast.error('Không thể xác nhận hoàn thành');
    }
  };

  return (
    <ProfileLayout currentPage="booking-history" onNavigate={onNavigate} activePage="bookings" userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('profile.bookingHistory.title')}</h1>
          <p className="text-gray-600">{t('profile.bookingHistory.subtitle', 'Quản lý tất cả các booking của bạn')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Card className="p-6">
          {/* Tabs for Status */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-3 w-full max-w-xl mb-6">
              <TabsTrigger value="upcoming">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('profile.bookingHistory.upcoming')}
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('profile.bookingHistory.completed')}
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                <XCircle className="w-4 h-4 mr-2" />
                {t('profile.bookingHistory.cancelled')}
              </TabsTrigger>
            </TabsList>

            {/* Filter by Service Type */}
            <div className="mb-6">
              <p className="text-sm mb-2 text-gray-700">{t('profile.bookingHistory.filterByService', 'Lọc theo loại dịch vụ')}:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={serviceFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("all")}
                >
                  {t('profile.bookingHistory.all', 'Tất cả')}
                </Button>
                <Button
                  variant={serviceFilter === "flight" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("flight")}
                >
                  <Plane className="w-4 h-4 mr-1" />
                  {t('profile.bookingHistory.flight')}
                </Button>
                <Button
                  variant={serviceFilter === "hotel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("hotel")}
                >
                  <Hotel className="w-4 h-4 mr-1" />
                  {t('profile.bookingHistory.hotel')}
                </Button>
                <Button
                  variant={serviceFilter === "car" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("car")}
                >
                  <Car className="w-4 h-4 mr-1" />
                  {t('profile.bookingHistory.car')}
                </Button>
                <Button
                  variant={serviceFilter === "activity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("activity")}
                >
                  <Activity className="w-4 h-4 mr-1" />
                  {t('profile.bookingHistory.activity')}
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">{t('profile.bookingHistory.noBookings', 'Không có booking nào')}</p>
                  </div>
                ) : (
                  filteredBookings.map((booking) => {
                    const Icon = getTypeIcon(booking.type);
                    return (
                      <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-48 h-48 md:h-auto shrink-0">
                            <ImageWithFallback
                              src={booking.image}
                              alt={booking.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                  <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg text-gray-900">{booking.title}</h3>
                                    <Badge variant="outline" className="text-xs">
                                      {getTypeLabel(booking.type)}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600">{booking.subtitle}</p>
                                </div>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{booking.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-sm">{t('profile.bookingHistory.bookingCode', 'Mã đặt chỗ')}: <span className="text-gray-900">{booking.bookingCode}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-sm">{booking.details}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-sm text-gray-600">{t('profile.bookingHistory.totalPrice', 'Tổng giá')}</p>
                                <p className="text-2xl text-blue-600">
                                  {booking.price.toLocaleString('vi-VN')}đ
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleViewDetails(booking)}
                                >
                                  <Eye className="w-4 h-4" />
                                  {t('profile.bookingHistory.viewDetails', 'Xem chi tiết')}
                                </Button>

                                {booking.status === "completed" && !booking.hasReview && (
                                  <Button
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => handleWriteReview(booking)}
                                  >
                                    <Star className="w-4 h-4" />
                                    {t('profile.bookingHistory.writeReview', 'Viết đánh giá')}
                                  </Button>
                                )}

                                {booking.status === "completed" && booking.hasReview && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    disabled
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('profile.bookingHistory.reviewed', 'Đã đánh giá')}
                                  </Button>
                                )}

                                {booking.status === "upcoming" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => handleRequestCancel(booking)}
                                  >
                                    <Ban className="w-4 h-4" />
                                    {t('profile.bookingHistory.requestCancel', 'Yêu cầu hủy')}
                                  </Button>
                                )}

                                {/* Show Confirm Completion for upcoming bookings past endDate */}
                                {booking.status === "upcoming" && booking.endDate &&
                                  new Date() > new Date(booking.endDate) && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="gap-2 bg-green-600 hover:bg-green-700"
                                      onClick={() => handleConfirmCompletion(booking)}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      {t('profile.bookingHistory.confirmCompletion', 'Xác nhận hoàn thành')}
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('profile.bookingHistory.orderDetails', 'Chi tiết đơn hàng')} - {selectedBooking?.bookingCode}</DialogTitle>
            <DialogDescription>
              {t('profile.bookingHistory.orderDetailsDesc', 'Thông tin chi tiết về booking của bạn')}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl mb-1">Wanderlust</h2>
                    <p className="text-blue-100">{t('profile.bookingHistory.eTicket', 'E-Ticket / Vé điện tử')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">{t('profile.bookingHistory.bookingNumber', 'Booking Number')}</p>
                    <p className="text-xl">{selectedBooking.bookingCode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-100">{t('profile.bookingHistory.serviceType', 'Loại dịch vụ')}</p>
                    <p>{getTypeLabel(selectedBooking.type)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">{t('profile.bookingHistory.status', 'Trạng thái')}</p>
                    <p>{selectedBooking.status === "upcoming" ? t('profile.bookingHistory.upcoming') : selectedBooking.status === "completed" ? t('profile.bookingHistory.completed') : t('profile.bookingHistory.cancelled')}</p>
                  </div>
                </div>
              </div>

              {/* Participants Info */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {t('profile.bookingHistory.participantInfo', 'Thông tin người tham gia')}
                </h3>
                <div className="space-y-4">
                  {selectedBooking.participants?.map((participant, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.bookingHistory.fullName', 'Họ và tên')}</p>
                        <p>{participant.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.bookingHistory.email', 'Email')}</p>
                        <p className="text-sm">{participant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.bookingHistory.phone', 'Số điện thoại')}</p>
                        <p>{participant.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Booking Details */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {t('profile.bookingHistory.detailsTitle', 'Chi tiết')} {getTypeLabel(selectedBooking.type)}
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2">{selectedBooking.title}</h4>
                    <p className="text-gray-600">{selectedBooking.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">{t('profile.bookingHistory.startDate', 'Ngày bắt đầu')}</p>
                      <p>{selectedBooking.date}</p>
                    </div>
                    {selectedBooking.endDate && (
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.bookingHistory.endDate', 'Ngày kết thúc')}</p>
                        <p>{selectedBooking.endDate}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">{t('profile.bookingHistory.location', 'Địa điểm')}</p>
                      <p>{selectedBooking.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">{t('profile.bookingHistory.details', 'Chi tiết')}</p>
                      <p className="whitespace-pre-line">{selectedBooking.details}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Info */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  {t('profile.bookingHistory.paymentInfo', 'Thông tin thanh toán')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('profile.bookingHistory.paymentMethod', 'Phương thức thanh toán')}</span>
                    <span>{selectedBooking.paymentDetails?.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('profile.bookingHistory.transactionId', 'Mã giao dịch')}</span>
                    <span className="text-sm">{selectedBooking.paymentDetails?.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('profile.bookingHistory.paymentTime', 'Thời gian thanh toán')}</span>
                    <span>{selectedBooking.paymentDetails?.paidAt}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span>{t('profile.bookingHistory.totalAmount', 'Tổng cộng')}</span>
                    <span className="text-xl text-blue-600">{selectedBooking.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span>{t('profile.bookingHistory.paid', 'Đã thanh toán')}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Vendor Info */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  {t('profile.bookingHistory.contactSupport', 'Thông tin liên hệ / Hỗ trợ')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{t('profile.bookingHistory.vendor', 'Nhà cung cấp')}:</span>
                    <span>{selectedBooking.vendorInfo?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span>{selectedBooking.vendorInfo?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{selectedBooking.vendorInfo?.email}</span>
                  </div>
                </div>
              </Card>

              {/* Cancellation Policy */}
              {selectedBooking.status === "upcoming" && selectedBooking.cancellationPolicy && (
                <Card className="p-6 bg-amber-50 border-amber-200">
                  <h3 className="mb-3 flex items-center gap-2 text-amber-900">
                    <AlertCircle className="w-5 h-5" />
                    {t('profile.bookingHistory.refundPolicy', 'Chính sách Hủy & Hoàn tiền')}
                  </h3>
                  <div className="space-y-2 text-sm text-amber-900">
                    <p>• {t('profile.bookingHistory.refundInfo', 'Hoàn {{percent}}% nếu hủy {{deadline}}', {
                      percent: selectedBooking.cancellationPolicy.refundPercentage,
                      deadline: selectedBooking.cancellationPolicy.deadline
                    })}</p>
                    <p>• {t('profile.bookingHistory.refundAmount2', 'Số tiền hoàn')}: <span className="font-semibold">{selectedBooking.cancellationPolicy.refundAmount.toLocaleString('vi-VN')}đ</span></p>
                    <p>• {t('profile.bookingHistory.refundDuration', 'Thời gian hoàn tiền: 5-7 ngày làm việc')}</p>
                  </div>
                </Card>
              )}

              {/* QR Code */}
              <Card className="p-6 text-center">
                <h3 className="mb-4 flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  {t('profile.bookingHistory.qrCode', 'Mã QR cho check-in nhanh')}
                </h3>
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  {t('profile.bookingHistory.bookingCodeLabel', 'Mã booking')}: {selectedBooking.bookingCode}
                </p>
              </Card>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePrintTicket}>
              <Printer className="w-4 h-4 mr-2" />
              {t('profile.bookingHistory.print', 'In vé')}
            </Button>
            <Button onClick={() => alert(t('profile.bookingHistory.downloadPDF', 'Tải xuống PDF'))}>
              <Download className="w-4 h-4 mr-2" />
              {t('profile.bookingHistory.download', 'Tải xuống')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Viết đánh giá</DialogTitle>
            <DialogDescription>
              Chia sẻ trải nghiệm của bạn về {selectedBooking?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <Label>Đánh giá của bạn</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {rating === 1 && t('profile.bookingHistory.veryBad', 'Rất tệ')}
                  {rating === 2 && t('profile.bookingHistory.bad', 'Tệ')}
                  {rating === 3 && t('profile.bookingHistory.average', 'Bình thường')}
                  {rating === 4 && t('profile.bookingHistory.good', 'Tốt')}
                  {rating === 5 && t('profile.bookingHistory.excellent', 'Tuyệt vời')}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="review">{t('profile.bookingHistory.yourReview', 'Nhận xét của bạn')}</Label>
              <Textarea
                id="review"
                placeholder={t('profile.bookingHistory.shareExperience', 'Chia sẻ trải nghiệm của bạn...')}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              {t('profile.bookingHistory.cancel', 'Hủy')}
            </Button>
            <Button onClick={handleSubmitReview}>
              {t('profile.bookingHistory.submitReview', 'Gửi đánh giá')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.bookingHistory.confirmCancel', 'Xác nhận hủy đơn hàng')}</DialogTitle>
            <DialogDescription>
              {t('profile.bookingHistory.confirmCancelDesc', 'Bạn có chắc chắn muốn hủy booking này?')}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && selectedBooking.cancellationPolicy && (
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="mb-2">{t('profile.bookingHistory.bookingInfo', 'Thông tin booking')}</h4>
                <p className="text-sm"><span className="text-gray-600">{t('profile.bookingHistory.bookingCode')}:</span> {selectedBooking.bookingCode}</p>
                <p className="text-sm"><span className="text-gray-600">{t('profile.bookingHistory.service', 'Dịch vụ')}:</span> {selectedBooking.title}</p>
                <p className="text-sm"><span className="text-gray-600">{t('profile.bookingHistory.value', 'Giá trị')}:</span> {selectedBooking.price.toLocaleString('vi-VN')}đ</p>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="mb-2 text-green-900">{t('profile.bookingHistory.refundPolicy')}</h4>
                <p className="text-sm text-green-900">
                  • {t('profile.bookingHistory.policyRefund', 'Theo chính sách, bạn sẽ được hoàn')}{" "}
                  <span className="font-semibold">{selectedBooking.cancellationPolicy.refundPercentage}%</span>
                </p>
                <p className="text-sm text-green-900">
                  • {t('profile.bookingHistory.refundAmount2')}:{" "}
                  <span className="text-lg font-semibold">{selectedBooking.cancellationPolicy.refundAmount.toLocaleString('vi-VN')}đ</span>
                </p>
                <p className="text-sm text-green-900 mt-2">
                  • {t('profile.bookingHistory.refundDuration')}
                </p>
              </Card>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <p className="text-sm text-amber-900">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {t('profile.bookingHistory.cancelNote', 'Sau khi xác nhận, yêu cầu hủy sẽ được gửi đến hệ thống. Bạn sẽ nhận được email xác nhận và cập nhật về quá trình hoàn tiền.')}
                </p>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="cancelReason">{t('profile.bookingHistory.cancelReason', 'Lý do hủy')}</Label>
              <Textarea
                id="cancelReason"
                placeholder={t('profile.bookingHistory.enterCancelReason', 'Nhập lý do hủy booking...')}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isCancelling}>
              {t('profile.bookingHistory.keepBooking', 'Không, giữ lại')}
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={isCancelling}>
              {isCancelling ? t('profile.bookingHistory.cancelling', 'Đang hủy...') : t('profile.bookingHistory.confirmCancelButton', 'Xác nhận hủy')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
}
