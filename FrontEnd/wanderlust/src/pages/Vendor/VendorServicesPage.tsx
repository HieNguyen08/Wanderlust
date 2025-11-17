import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Edit,
    Eye,
    MoreVertical,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { VendorLayout } from "../../components/VendorLayout";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { AddServiceDialog } from "../../components/vendor/AddServiceDialog";
import { ServiceDetailDialog } from "../../components/vendor/ServiceDetailDialog";
import { vendorApi } from "../../utils/api";

interface VendorServicesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

type ServiceStatus = "pending" | "approved" | "needs_revision" | "rejected";
type ServiceType = "hotel" | "activity" | "car";

interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  image: string;
  price: number;
  status: ServiceStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
  views: number;
  bookings: number;
  revenue: number;
}

export default function VendorServicesPage({ 
  onNavigate, 
  vendorType = "hotel" 
}: VendorServicesPageProps) {
  const [activeTab, setActiveTab] = useState<ServiceStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await vendorApi.getVendorHotels();
      // Map hotel data to service format
      const mappedServices = data.map((hotel: any) => ({
        id: hotel.id,
        type: 'hotel' as ServiceType,
        name: hotel.name,
        description: hotel.description || '',
        image: hotel.images?.[0] || hotel.image || '',
        price: hotel.price || 0,
        status: 'approved' as ServiceStatus,
        submittedAt: hotel.createdAt || new Date().toISOString(),
        views: 0,
        bookings: 0,
        revenue: 0,
      }));
      setServices(mappedServices);
    } catch (error) {
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || service.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Đang chờ duyệt",
          icon: Clock,
          className: "bg-yellow-100 text-yellow-700 border-yellow-200",
          iconColor: "text-yellow-600"
        };
      case "approved":
        return {
          label: "Đã duyệt / Live",
          icon: CheckCircle2,
          className: "bg-green-100 text-green-700 border-green-200",
          iconColor: "text-green-600"
        };
      case "needs_revision":
        return {
          label: "Cần chỉnh sửa",
          icon: AlertCircle,
          className: "bg-orange-100 text-orange-700 border-orange-200",
          iconColor: "text-orange-600"
        };
      case "rejected":
        return {
          label: "Bị từ chối",
          icon: XCircle,
          className: "bg-red-100 text-red-700 border-red-200",
          iconColor: "text-red-600"
        };
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
    { 
      label: "Đang hoạt động", 
      value: services.filter(s => s.status === "approved").length,
      color: "green"
    },
    { 
      label: "Chờ duyệt", 
      value: services.filter(s => s.status === "pending").length,
      color: "yellow"
    },
    { 
      label: "Cần sửa", 
      value: services.filter(s => s.status === "needs_revision").length,
      color: "orange"
    },
    { 
      label: "Tổng doanh thu", 
      value: `₫${(services.reduce((sum, s) => sum + s.revenue, 0) / 1000000).toFixed(0)}M`,
      color: "blue"
    },
  ];

  const handleViewDetail = (service: Service) => {
    setSelectedService(service);
    setIsDetailOpen(true);
  };

  const handleEdit = (service: Service) => {
    toast.info(`Chỉnh sửa ${service.name}`);
    // TODO: Open edit dialog
  };

  const handleResubmit = (service: Service) => {
    toast.success(`Đã nộp lại ${service.name} để Admin duyệt`);
    // TODO: Call API to resubmit
  };

  const handleDelete = (service: Service) => {
    toast.error(`Đã xóa ${service.name}`);
    // TODO: Show delete confirmation
  };

  return (
    <VendorLayout 
      currentPage="vendor-services" 
      onNavigate={onNavigate} 
      activePage="vendor-services"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Quản lý Dịch vụ</h1>
            <p className="text-gray-600">
              Quản lý tất cả dịch vụ của bạn - Khách sạn, Hoạt động, Thuê xe
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Thêm dịch vụ mới
          </Button>
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

        {/* Tabs & Search */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">
                Tất cả ({services.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Đang hoạt động
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Chờ duyệt
              </TabsTrigger>
              <TabsTrigger value="needs_revision" className="gap-2">
                <AlertCircle className="w-4 h-4" />
                Cần chỉnh sửa
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="w-4 h-4" />
                Bị từ chối
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
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${statusConfig.className} border flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </Badge>
                        <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                          {getTypeLabel(service.type)}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg text-gray-900 mb-2 line-clamp-1">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Admin Note - Only show for needs_revision or rejected */}
                        {(service.status === "needs_revision" || service.status === "rejected") && service.adminNote && (
                          <div className={`mb-4 p-3 rounded-lg border ${
                            service.status === "needs_revision" 
                              ? "bg-orange-50 border-orange-200" 
                              : "bg-red-50 border-red-200"
                          }`}>
                            <p className={`text-xs mb-1 flex items-center gap-1 ${
                              service.status === "needs_revision" 
                                ? "text-orange-700" 
                                : "text-red-700"
                            }`}>
                              <AlertCircle className="w-3 h-3" />
                              Ghi chú từ Admin:
                            </p>
                            <p className="text-xs text-gray-700 whitespace-pre-line line-clamp-3">
                              {service.adminNote}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-600">Lượt xem</p>
                            <p className="text-sm text-gray-900">{service.views}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Bookings</p>
                            <p className="text-sm text-gray-900">{service.bookings}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Doanh thu</p>
                            <p className="text-sm text-green-600">
                              {(service.revenue / 1000000).toFixed(0)}M
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-600">Giá</p>
                            <p className="text-lg text-blue-600">
                              {(service.price / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetail(service)}
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
                                  onClick={() => handleEdit(service)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                {(service.status === "needs_revision" || service.status === "rejected") && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-blue-600"
                                    onClick={() => handleResubmit(service)}
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Nộp lại
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="gap-2 text-red-600"
                                  onClick={() => handleDelete(service)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Submission Info */}
                        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                          <p>Nộp: {service.submittedAt}</p>
                          {service.reviewedAt && (
                            <p>Duyệt: {service.reviewedAt}</p>
                          )}
                        </div>
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

      {/* Add Service Dialog */}
      <AddServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          toast.success("Đã gửi yêu cầu thêm dịch vụ mới. Admin sẽ duyệt trong 1-2 ngày làm việc.");
        }}
      />

      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        service={selectedService}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onResubmit={handleResubmit}
        onDelete={handleDelete}
      />
    </VendorLayout>
  );
}
