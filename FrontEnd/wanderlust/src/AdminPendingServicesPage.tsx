import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  Clock, CheckCircle2, Edit, XCircle, Eye, Search, Filter
} from "lucide-react";
import type { PageType } from "./MainApp";
import { AdminServiceReviewDialog } from "./components/admin/AdminServiceReviewDialog";
import { toast } from "sonner";

interface AdminPendingServicesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

type ServiceStatus = "pending" | "approved" | "needs_revision" | "rejected";
type ServiceType = "hotel" | "activity" | "car";

interface PendingService {
  id: string;
  type: ServiceType;
  vendorName: string;
  vendorId: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  status: ServiceStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
  // Type-specific fields
  details: Record<string, any>;
}

export default function AdminPendingServicesPage({ onNavigate }: AdminPendingServicesPageProps) {
  const [activeTab, setActiveTab] = useState<ServiceStatus | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<PendingService | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Mock data
  const services: PendingService[] = [
    {
      id: "SVC001",
      type: "hotel",
      vendorName: "Seaside Resort Vietnam",
      vendorId: "V001",
      name: "Presidential Suite Ocean View",
      description: "Phòng tổng thống sang trọng với view toàn cảnh biển, diện tích 120m2",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      ],
      price: 8500000,
      status: "pending",
      submittedAt: "2025-01-15 14:30",
      details: {
        roomType: "presidential",
        capacity: 4,
        amenities: "WiFi miễn phí, TV 65 inch, Mini bar, Bồn tắm jacuzzi, Ban công riêng",
      },
    },
    {
      id: "SVC002",
      type: "activity",
      name: "Tour Hướng đạo sinh Phú Quốc",
      vendorName: "Adventure Tours Co.",
      vendorId: "V002",
      description: "Tour khám phá thiên nhiên hoang dã 1 ngày với hoạt động leo núi, trekking",
      images: [
        "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&h=400&fit=crop",
      ],
      price: 1500000,
      status: "pending",
      submittedAt: "2025-01-16 09:15",
      details: {
        duration: "1 ngày (8:00 - 17:00)",
        groupSize: "5-15 người",
        includes: "Hướng dẫn viên, Bữa trưa, Nước uống, Bảo hiểm",
        excludes: "Chi phí cá nhân, Đồ uống có cồn",
        itinerary: "8:00 - Đón khách\n9:00 - Bắt đầu leo núi\n12:00 - Ăn trưa\n14:00 - Trekking rừng\n17:00 - Trả khách",
      },
    },
    {
      id: "SVC003",
      type: "car",
      vendorName: "Premium Car Rental",
      vendorId: "V003",
      name: "Mercedes-Benz E-Class 2024",
      description: "Xe sang cao cấp, tài xế chuyên nghiệp, phù hợp công tác và sự kiện",
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop",
      ],
      price: 3500000,
      status: "pending",
      submittedAt: "2025-01-16 11:00",
      details: {
        brand: "Mercedes-Benz",
        model: "E-Class",
        year: 2024,
        seats: "5 chỗ",
        features: "Ghế da cao cấp, Hệ thống âm thanh Burmester, Điều hòa tự động 3 vùng, Camera 360",
      },
    },
    {
      id: "SVC004",
      type: "activity",
      vendorName: "Adventure Tours Co.",
      vendorId: "V002",
      name: "Lặn biển Nha Trang khám phá san hô",
      description: "Trải nghiệm lặn biển với hướng dẫn viên chuyên nghiệp",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      ],
      price: 1200000,
      status: "needs_revision",
      submittedAt: "2025-01-14 10:00",
      reviewedAt: "2025-01-15 16:30",
      adminNote: "Vui lòng bổ sung:\n1. Chứng chỉ lặn của hướng dẫn viên\n2. Chính sách an toàn chi tiết\n3. Yêu cầu sức khỏe của khách tham gia\n4. Làm rõ giá đã bao gồm thuê đồ lặn chưa",
      details: {
        duration: "4 giờ",
        groupSize: "2-8 người",
        includes: "Hướng dẫn viên, Thiết bị lặn, Bảo hiểm",
      },
    },
    {
      id: "SVC005",
      type: "car",
      vendorName: "Budget Car Rentals",
      vendorId: "V004",
      name: "Toyota Vios 2020",
      description: "Xe 4 chỗ tiết kiệm, phù hợp gia đình nhỏ",
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
      ],
      price: 800000,
      status: "rejected",
      submittedAt: "2025-01-13 14:00",
      reviewedAt: "2025-01-14 09:30",
      adminNote: "Yêu cầu từ chối:\n1. Ảnh xe quá mờ, không thấy rõ biển số\n2. Thiếu giấy đăng kiểm xe\n3. Thiếu bảo hiểm trách nhiệm dân sự\n4. Mô tả không rõ về chính sách nhiên liệu\n\nVui lòng chuẩn bị đầy đủ giấy tờ và chụp ảnh rõ nét hơn, sau đó nộp lại.",
      details: {
        brand: "Toyota",
        model: "Vios",
        year: 2020,
        seats: "4 chỗ",
      },
    },
    {
      id: "SVC006",
      type: "hotel",
      vendorName: "City Boutique Hotel",
      vendorId: "V005",
      name: "Deluxe City View Room",
      description: "Phòng cao cấp view thành phố, gần trung tâm",
      images: [
        "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=600&h=400&fit=crop",
      ],
      price: 2500000,
      status: "approved",
      submittedAt: "2025-01-12 10:00",
      reviewedAt: "2025-01-12 15:00",
      details: {
        roomType: "deluxe",
        capacity: 2,
        amenities: "WiFi, TV, Minibar, Điều hòa, Phòng tắm riêng",
      },
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || service.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case "pending":
        return { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "approved":
        return { label: "Đã duyệt", className: "bg-green-100 text-green-700", icon: CheckCircle2 };
      case "needs_revision":
        return { label: "Cần sửa", className: "bg-orange-100 text-orange-700", icon: Edit };
      case "rejected":
        return { label: "Từ chối", className: "bg-red-100 text-red-700", icon: XCircle };
    }
  };

  const getTypeLabel = (type: ServiceType) => {
    switch (type) {
      case "hotel": return "Khách sạn";
      case "activity": return "Hoạt động";
      case "car": return "Thuê xe";
    }
  };

  const stats = [
    { label: "Chờ duyệt", value: services.filter(s => s.status === "pending").length, color: "yellow" },
    { label: "Đã duyệt", value: services.filter(s => s.status === "approved").length, color: "green" },
    { label: "Cần sửa", value: services.filter(s => s.status === "needs_revision").length, color: "orange" },
    { label: "Từ chối", value: services.filter(s => s.status === "rejected").length, color: "red" },
  ];

  const handleReview = (service: PendingService) => {
    setSelectedService(service);
    setIsReviewDialogOpen(true);
  };

  const handleApprove = (serviceId: string, editedData?: any) => {
    console.log("Approve service:", serviceId, editedData);
    toast.success("Đã duyệt và đăng dịch vụ");
    setIsReviewDialogOpen(false);
    // TODO: Call API
  };

  const handleReject = (serviceId: string, reason: string) => {
    console.log("Reject service:", serviceId, reason);
    toast.error("Đã từ chối và gửi lại cho Vendor");
    setIsReviewDialogOpen(false);
    // TODO: Call API
  };

  const handleRequestRevision = (serviceId: string, note: string) => {
    console.log("Request revision:", serviceId, note);
    toast.info("Đã yêu cầu Vendor chỉnh sửa");
    setIsReviewDialogOpen(false);
    // TODO: Call API
  };

  return (
    <AdminLayout currentPage="admin-pending-services" onNavigate={onNavigate} activePage="admin-pending-services">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Duyệt Dịch vụ</h1>
          <p className="text-gray-600">
            Xem xét và phê duyệt các yêu cầu thêm dịch v�� từ Vendor
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl text-${stat.color}-600`}>
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên dịch vụ hoặc vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Chờ duyệt ({services.filter(s => s.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="needs_revision" className="gap-2">
                <Edit className="w-4 h-4" />
                Cần sửa
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Đã duyệt
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="w-4 h-4" />
                Từ chối
              </TabsTrigger>
              <TabsTrigger value="all">
                Tất cả ({services.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const statusConfig = getStatusConfig(service.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={service.images[0]}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${statusConfig.className} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </Badge>
                        <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                          {getTypeLabel(service.type)}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg text-gray-900 mb-1 line-clamp-1">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Vendor: {service.vendorName}
                        </p>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {service.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t mb-4">
                          <div>
                            <p className="text-xs text-gray-600">Giá</p>
                            <p className="text-lg text-blue-600">
                              {(service.price / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Nộp lúc</p>
                            <p className="text-sm text-gray-900">{service.submittedAt}</p>
                          </div>
                        </div>

                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleReview(service)}
                          variant={service.status === "pending" ? "default" : "outline"}
                        >
                          <Eye className="w-4 h-4" />
                          {service.status === "pending" ? "Xem xét & Duyệt" : "Xem chi tiết"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không tìm thấy dịch vụ nào</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Review Dialog */}
      <AdminServiceReviewDialog
        service={selectedService}
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevision={handleRequestRevision}
      />
    </AdminLayout>
  );
}
