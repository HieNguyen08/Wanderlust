import { useState } from "react";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { 
  Plane, Hotel, Car, Activity, 
  Calendar, MapPin, Clock, 
  Download, Eye, Star, CheckCircle, 
  XCircle, AlertCircle, QrCode, Users,
  Mail, Phone, CreditCard, FileText,
  Printer, Ban, StarIcon
} from "lucide-react";
import type { PageType } from "../../MainApp";

interface BookingHistoryPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface Booking {
  id: string;
  type: "flight" | "hotel" | "car" | "activity" | "visa";
  status: "completed" | "upcoming" | "cancelled";
  title: string;
  subtitle: string;
  date: string;
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
}

export default function BookingHistoryPage({ onNavigate }: BookingHistoryPageProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [serviceFilter, setServiceFilter] = useState<"all" | "flight" | "hotel" | "car" | "activity" | "visa">("all");
  
  // Dialog states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  // Review form states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const bookings: Booking[] = [
    {
      id: "FL001",
      type: "flight",
      status: "upcoming",
      title: "Hà Nội → Đà Nẵng",
      subtitle: "Vietnam Airlines VN117",
      date: "15/11/2025, 08:30",
      location: "Sân bay Nội Bài",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
      price: 2500000,
      bookingCode: "VN117ABC",
      details: "1 người lớn, Hạng Phổ thông",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" }
      ],
      paymentDetails: {
        method: "Momo",
        transactionId: "MOMO20241101001",
        paidAt: "01/11/2025 14:30"
      },
      cancellationPolicy: {
        refundPercentage: 100,
        deadline: "48 giờ trước giờ khởi hành",
        refundAmount: 2500000
      },
      vendorInfo: {
        name: "Vietnam Airlines",
        phone: "1900 1100",
        email: "support@vietnamairlines.com"
      }
    },
    {
      id: "HT001",
      type: "hotel",
      status: "upcoming",
      title: "JW Marriott Phu Quoc",
      subtitle: "Deluxe Ocean View Room",
      date: "20/11/2025 - 23/11/2025",
      location: "Phú Quốc, Việt Nam",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
      price: 10500000,
      bookingCode: "HTL20251120",
      details: "3 đêm, 2 người lớn",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" },
        { name: "Trần Thị B", email: "tranthib@email.com", phone: "+84 987 654 321" }
      ],
      paymentDetails: {
        method: "VNPay",
        transactionId: "VNPAY20241101002",
        paidAt: "01/11/2025 15:20"
      },
      cancellationPolicy: {
        refundPercentage: 80,
        deadline: "7 ngày trước ngày nhận phòng",
        refundAmount: 8400000
      },
      vendorInfo: {
        name: "JW Marriott Phu Quoc",
        phone: "+84 297 377 7999",
        email: "reservations@jwmarriott-phuquoc.com"
      }
    },
    {
      id: "VS001",
      type: "visa",
      status: "upcoming",
      title: "Visa Nhật Bản - Du lịch",
      subtitle: "Visa 90 ngày, Một lần",
      date: "Dự kiến: 25/11/2025",
      location: "Đại sứ quán Nhật Bản",
      image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop",
      price: 1500000,
      bookingCode: "VISA20251101",
      details: "1 người, Hồ sơ chuẩn",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" }
      ],
      paymentDetails: {
        method: "Chuyển khoản",
        transactionId: "BANK20241101003",
        paidAt: "01/11/2025 10:00"
      },
      cancellationPolicy: {
        refundPercentage: 50,
        deadline: "Trước khi nộp hồ sơ",
        refundAmount: 750000
      },
      vendorInfo: {
        name: "Wanderlust Visa Services",
        phone: "1900 1234",
        email: "visa@wanderlust.vn"
      }
    },
    {
      id: "CR001",
      type: "car",
      status: "completed",
      title: "Toyota Camry 2024",
      subtitle: "Sedan cao cấp",
      date: "01/10/2025 - 03/10/2025",
      location: "Sân bay Tân Sơn Nhất",
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop",
      price: 1800000,
      bookingCode: "CAR20251001",
      details: "2 ngày, Tự lái",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" }
      ],
      paymentDetails: {
        method: "Momo",
        transactionId: "MOMO20241001001",
        paidAt: "30/09/2025 14:00"
      },
      vendorInfo: {
        name: "Premium Car Rental",
        phone: "+84 28 1234 5678",
        email: "support@premiumcar.vn"
      },
      hasReview: false
    },
    {
      id: "AC001",
      type: "activity",
      status: "completed",
      title: "Vé VinWonders Nha Trang",
      subtitle: "Vé cả ngày",
      date: "15/09/2025",
      location: "Nha Trang, Việt Nam",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop",
      price: 550000,
      bookingCode: "ACT20250915",
      details: "2 người lớn",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" },
        { name: "Trần Thị B", email: "tranthib@email.com", phone: "+84 987 654 321" }
      ],
      paymentDetails: {
        method: "VNPay",
        transactionId: "VNPAY20240915001",
        paidAt: "14/09/2025 16:00"
      },
      vendorInfo: {
        name: "VinWonders Nha Trang",
        phone: "1900 6677",
        email: "customercare@vinwonders.com"
      },
      hasReview: true
    },
    {
      id: "FL002",
      type: "flight",
      status: "completed",
      title: "TP.HCM → Singapore",
      subtitle: "VietJet Air VJ651",
      date: "05/09/2025, 14:20",
      location: "Sân bay Tân Sơn Nhất",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
      price: 3200000,
      bookingCode: "VJ651XYZ",
      details: "2 người lớn, Hạng Phổ thông",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" },
        { name: "Trần Thị B", email: "tranthib@email.com", phone: "+84 987 654 321" }
      ],
      paymentDetails: {
        method: "Credit Card",
        transactionId: "VISA20240905001",
        paidAt: "04/09/2025 10:30"
      },
      vendorInfo: {
        name: "VietJet Air",
        phone: "1900 1886",
        email: "customerservice@vietjetair.com"
      },
      hasReview: false
    },
    {
      id: "HT002",
      type: "hotel",
      status: "cancelled",
      title: "InterContinental Danang",
      subtitle: "Premium Ocean View",
      date: "10/08/2025 - 12/08/2025",
      location: "Đà Nẵng, Việt Nam",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      price: 8400000,
      bookingCode: "HTL20250810",
      details: "2 đêm, 2 người lớn",
      participants: [
        { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "+84 123 456 789" },
        { name: "Trần Thị B", email: "tranthib@email.com", phone: "+84 987 654 321" }
      ],
      paymentDetails: {
        method: "Momo",
        transactionId: "MOMO20240801001",
        paidAt: "01/08/2025 11:00"
      },
      cancellationPolicy: {
        refundPercentage: 100,
        deadline: "7 ngày trước ngày nhận phòng",
        refundAmount: 8400000
      },
      vendorInfo: {
        name: "InterContinental Danang",
        phone: "+84 236 393 8888",
        email: "reservations@icdanang.com"
      }
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flight": return Plane;
      case "hotel": return Hotel;
      case "car": return Car;
      case "activity": return Activity;
      case "visa": return FileText;
      default: return Activity;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "flight": return "Vé máy bay";
      case "hotel": return "Khách sạn";
      case "car": return "Thuê xe";
      case "activity": return "Hoạt động";
      case "visa": return "Visa";
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sắp tới</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Đã hủy</Badge>;
      default:
        return null;
    }
  };

  // Filter bookings by tab and service type
  const filteredBookings = bookings.filter(b => {
    const matchStatus = b.status === activeTab;
    const matchService = serviceFilter === "all" || b.type === serviceFilter;
    return matchStatus && matchService;
  });

  const stats = [
    { 
      label: "Sắp tới", 
      value: bookings.filter(b => b.status === "upcoming").length, 
      icon: AlertCircle,
      color: "text-blue-600"
    },
    { 
      label: "Đã hoàn thành", 
      value: bookings.filter(b => b.status === "completed").length, 
      icon: CheckCircle,
      color: "text-green-600"
    },
    { 
      label: "Đã hủy", 
      value: bookings.filter(b => b.status === "cancelled").length, 
      icon: XCircle,
      color: "text-red-600"
    },
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
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }
    // Mock submit
    alert(`Đã gửi đánh giá ${rating} sao cho ${selectedBooking?.title}`);
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
    alert(`Đã gửi yêu cầu hủy booking ${selectedBooking.bookingCode}.\n\nTheo chính sách, bạn sẽ được hoàn ${selectedBooking.cancellationPolicy?.refundPercentage}% (${selectedBooking.cancellationPolicy?.refundAmount.toLocaleString('vi-VN')}đ).\n\nTrạng thái: Đang chờ xử lý hoàn tiền.\nThời gian hoàn tiền dự kiến: 5-7 ngày làm việc.`);
    
    setIsCancelDialogOpen(false);
    
    // In real app, this would update the booking status to "cancelled - pending refund"
    // and create a refund request for admin to process
  };

  return (
    <ProfileLayout currentPage="booking-history" onNavigate={onNavigate} activePage="bookings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Lịch sử đặt chỗ</h1>
          <p className="text-gray-600">Quản lý tất cả các booking của bạn</p>
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
                Sắp tới
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="w-4 h-4 mr-2" />
                Đã hoàn thành
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                <XCircle className="w-4 h-4 mr-2" />
                Đã hủy
              </TabsTrigger>
            </TabsList>

            {/* Filter by Service Type */}
            <div className="mb-6">
              <p className="text-sm mb-2 text-gray-700">Lọc theo loại dịch vụ:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={serviceFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("all")}
                >
                  Tất cả
                </Button>
                <Button 
                  variant={serviceFilter === "flight" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("flight")}
                >
                  <Plane className="w-4 h-4 mr-1" />
                  Vé máy bay
                </Button>
                <Button 
                  variant={serviceFilter === "hotel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("hotel")}
                >
                  <Hotel className="w-4 h-4 mr-1" />
                  Khách sạn
                </Button>
                <Button 
                  variant={serviceFilter === "car" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("car")}
                >
                  <Car className="w-4 h-4 mr-1" />
                  Thuê xe
                </Button>
                <Button 
                  variant={serviceFilter === "activity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("activity")}
                >
                  <Activity className="w-4 h-4 mr-1" />
                  Hoạt động
                </Button>
                <Button 
                  variant={serviceFilter === "visa" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter("visa")}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Visa
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Không có booking nào</p>
                  </div>
                ) : (
                  filteredBookings.map((booking) => {
                    const Icon = getTypeIcon(booking.type);
                    return (
                      <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
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
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                                <span className="text-sm">Mã đặt chỗ: <span className="text-gray-900">{booking.bookingCode}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-sm">{booking.details}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-sm text-gray-600">Tổng giá</p>
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
                                  Xem chi tiết
                                </Button>
                                
                                {booking.status === "completed" && !booking.hasReview && (
                                  <Button 
                                    size="sm" 
                                    className="gap-2"
                                    onClick={() => handleWriteReview(booking)}
                                  >
                                    <Star className="w-4 h-4" />
                                    Viết đánh giá
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
                                    Đã đánh giá
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
                                    Yêu cầu hủy
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
            <DialogTitle>Chi tiết đơn hàng - {selectedBooking?.bookingCode}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về booking của bạn
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl mb-1">Wanderlust</h2>
                    <p className="text-blue-100">E-Ticket / Vé điện tử</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Booking Number</p>
                    <p className="text-xl">{selectedBooking.bookingCode}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-100">Loại dịch vụ</p>
                    <p>{getTypeLabel(selectedBooking.type)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Trạng thái</p>
                    <p>{selectedBooking.status === "upcoming" ? "Sắp tới" : selectedBooking.status === "completed" ? "Hoàn thành" : "Đã hủy"}</p>
                  </div>
                </div>
              </div>

              {/* Participants Info */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Thông tin người tham gia
                </h3>
                <div className="space-y-4">
                  {selectedBooking.participants?.map((participant, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Họ và tên</p>
                        <p>{participant.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-sm">{participant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Số điện thoại</p>
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
                  Chi tiết {getTypeLabel(selectedBooking.type)}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2">{selectedBooking.title}</h4>
                    <p className="text-gray-600">{selectedBooking.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Ngày sử dụng</p>
                      <p>{selectedBooking.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Địa điểm</p>
                      <p>{selectedBooking.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Chi tiết</p>
                      <p>{selectedBooking.details}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Info */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Thông tin thanh toán
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức thanh toán</span>
                    <span>{selectedBooking.paymentDetails?.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch</span>
                    <span className="text-sm">{selectedBooking.paymentDetails?.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian thanh toán</span>
                    <span>{selectedBooking.paymentDetails?.paidAt}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span>Tổng cộng</span>
                    <span className="text-xl text-blue-600">{selectedBooking.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span>Đã thanh toán</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Vendor Info */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Thông tin liên hệ / Hỗ trợ
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Nhà cung cấp:</span>
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
                    Chính sách Hủy & Hoàn tiền
                  </h3>
                  <div className="space-y-2 text-sm text-amber-900">
                    <p>• Hoàn {selectedBooking.cancellationPolicy.refundPercentage}% nếu hủy {selectedBooking.cancellationPolicy.deadline}</p>
                    <p>• Số tiền hoàn: <span className="font-semibold">{selectedBooking.cancellationPolicy.refundAmount.toLocaleString('vi-VN')}đ</span></p>
                    <p>• Thời gian hoàn tiền: 5-7 ngày làm việc</p>
                  </div>
                </Card>
              )}

              {/* QR Code */}
              <Card className="p-6 text-center">
                <h3 className="mb-4 flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  Mã QR cho check-in nhanh
                </h3>
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Mã booking: {selectedBooking.bookingCode}
                </p>
              </Card>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePrintTicket}>
              <Printer className="w-4 h-4 mr-2" />
              In vé
            </Button>
            <Button onClick={() => alert("Tải xuống PDF")}>
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
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
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {rating === 1 && "Rất tệ"}
                  {rating === 2 && "Tệ"}
                  {rating === 3 && "Bình thường"}
                  {rating === 4 && "Tốt"}
                  {rating === 5 && "Tuyệt vời"}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="review">Nhận xét của bạn</Label>
              <Textarea
                id="review"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitReview}>
              Gửi đánh giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy booking này?
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && selectedBooking.cancellationPolicy && (
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="mb-2">Thông tin booking</h4>
                <p className="text-sm"><span className="text-gray-600">Mã đặt chỗ:</span> {selectedBooking.bookingCode}</p>
                <p className="text-sm"><span className="text-gray-600">Dịch vụ:</span> {selectedBooking.title}</p>
                <p className="text-sm"><span className="text-gray-600">Giá trị:</span> {selectedBooking.price.toLocaleString('vi-VN')}đ</p>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="mb-2 text-green-900">Chính sách hoàn tiền</h4>
                <p className="text-sm text-green-900">
                  • Theo chính sách, bạn sẽ được hoàn{" "}
                  <span className="font-semibold">{selectedBooking.cancellationPolicy.refundPercentage}%</span>
                </p>
                <p className="text-sm text-green-900">
                  • Số tiền hoàn lại:{" "}
                  <span className="text-lg font-semibold">{selectedBooking.cancellationPolicy.refundAmount.toLocaleString('vi-VN')}đ</span>
                </p>
                <p className="text-sm text-green-900 mt-2">
                  • Thời gian hoàn tiền: 5-7 ngày làm việc
                </p>
              </Card>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <p className="text-sm text-amber-900">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Sau khi xác nhận, yêu cầu hủy sẽ được gửi đến hệ thống. Bạn sẽ nhận được email xác nhận và cập nhật về quá trình hoàn tiền.
                </p>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Không, giữ lại
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
}
