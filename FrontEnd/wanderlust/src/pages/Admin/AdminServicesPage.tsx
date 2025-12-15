import {
    Activity,
    Building2,
    Car,
    Eye,
    MapPin,
    MoreVertical,
    Pause,
    Play,
    Plus,
    Search,
    Trash2,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { AdminLayout } from "../../components/AdminLayout";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { AddServiceDialog } from "../../components/vendor/AddServiceDialog";
import { HotelWizardDialog } from "../../components/vendor/HotelWizardDialog";
import { adminApi, vendorApi } from "../../utils/api";

interface AdminServicesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PENDING_REVIEW";
type OperationalStatus = "ACTIVE" | "PAUSED" | "PENDING_REVIEW" | "REJECTED";
type ServiceTab = "all" | "approved" | "pending" | "rejected";
type ServiceType = "hotel" | "activity" | "car";

interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  image: string;
  price?: number;
  lowestPrice?: number;
  pricePerHour?: number;
  approvalStatus: ApprovalStatus;
  status: OperationalStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
  views?: number;
  bookings?: number;
  revenue?: number;
  vendorName?: string;
  vendorId?: string;
  address?: string;
  locationName?: string;
  hotelType?: string;
  starRating?: number;
  seats?: number;
  doors?: number;
  luggage?: number;
  duration?: string;
  category?: string;
}

export default function AdminServicesPage({ onNavigate }: AdminServicesPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ServiceTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewingService, setReviewingService] = useState<Service | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [adminNote, setAdminNote] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceType, setServiceType] = useState<ServiceType>("hotel");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHotelWizardOpen, setIsHotelWizardOpen] = useState(false);
  const [addDialogType, setAddDialogType] = useState<ServiceType | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  // Mock data - replace with API calls
  useEffect(() => {
    loadServices();
  }, [serviceType]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const servicePath = serviceType === "car" ? "car-rentals" : serviceType === "activity" ? "activities" : "hotels";
      const data = await vendorApi.getServices(servicePath, { size: 200 });
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];

      const numberOrUndefined = (val: any) => {
        const num = Number(val);
        return Number.isFinite(num) ? num : undefined;
      };

      const normalizeStatus = (val: any): OperationalStatus => {
        const raw = String(val || "").toUpperCase();
        if (raw === "AVAILABLE") return "ACTIVE";
        if (raw === "ACTIVE") return "ACTIVE";
        if (raw === "PAUSED") return "PAUSED";
        if (raw === "REJECTED") return "REJECTED";
        if (raw === "PENDING" || raw === "PENDING_REVIEW") return "PENDING_REVIEW";
        return "PENDING_REVIEW";
      };

      const mapService = (item: any): Service => {
        const images = Array.isArray(item.images)
          ? item.images
          : Array.isArray(item.roomImages)
            ? item.roomImages
            : item.image
              ? [item.image]
              : [];
        const normalizedImage = images.length > 0
          ? (typeof images[0] === "string" ? images[0] : images[0]?.url || "")
          : "";

        const roomsArray = Array.isArray(item.rooms) ? item.rooms : [];
        const roomBasePrices = roomsArray
          .map((r: any) => Number(r.basePrice || r.pricePerNight || r.price))
          .filter((v: number) => !Number.isNaN(v) && v > 0);
        const minRoomPrice = roomBasePrices.length > 0 ? Math.min(...roomBasePrices) : undefined;

        const priceCandidate = numberOrUndefined(item.price)
          ?? numberOrUndefined(item.pricePerNight)
          ?? numberOrUndefined(item.pricePerDay)
          ?? numberOrUndefined(item.basePrice)
          ?? numberOrUndefined(item.originalPrice)
          ?? numberOrUndefined(item.startingPrice)
          ?? numberOrUndefined(item.lowestPrice)
          ?? minRoomPrice;

        return {
          id: item.id,
          type: serviceType,
          name: item.name,
          description: item.description || item.overview || item.summary,
          image: normalizedImage,
          price: priceCandidate,
          pricePerHour: numberOrUndefined(item.pricePerHour),
          lowestPrice: numberOrUndefined(item.lowestPrice),
          approvalStatus: (item.approvalStatus || "PENDING") as ApprovalStatus,
          status: normalizeStatus(item.status),
          submittedAt: item.createdAt || new Date().toISOString(),
          reviewedAt: item.reviewedAt,
          adminNote: item.adminNote,
          views: item.views,
          bookings: item.bookings,
          revenue: item.revenue,
          vendorName: item.vendorName || item.vendor?.name,
          vendorId: item.vendorId,
          locationName: item.location?.name || item.locationName,
          starRating: numberOrUndefined(item.starRating),
          seats: numberOrUndefined(item.seats),
          doors: numberOrUndefined(item.doors),
          duration: item.duration,
          category: item.category,
        };
      };

      setServices(list.map(mapService));
    } catch (error) {
      toast.error(t('admin.errorLoadingServices'));
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const name = service.name || "";
    const desc = service.description || "";
    const vendor = service.vendorName || "";
    const query = (searchQuery || "").toLowerCase();
    const matchesSearch = 
      name.toLowerCase().includes(query) || 
      desc.toLowerCase().includes(query) ||
      vendor.toLowerCase().includes(query);
    
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "approved" && service.approvalStatus === "APPROVED") ||
      (activeTab === "pending" && service.approvalStatus === "PENDING") ||
      (activeTab === "rejected" && service.approvalStatus === "REJECTED");
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    { 
      label: t('admin.activeServices'), 
      value: services.filter(s => s.approvalStatus === "APPROVED" && s.status === "ACTIVE").length,
      color: "green"
    },
    { 
      label: t('admin.pendingApproval'), 
      value: services.filter(s => s.approvalStatus === "PENDING").length,
      color: "yellow"
    },
    { 
      label: t('admin.rejected'), 
      value: services.filter(s => s.approvalStatus === "REJECTED").length,
      color: "red"
    },
    { 
      label: t('admin.totalRevenue'), 
      value: `₫${(services.reduce((sum, s) => sum + (s.revenue || 0), 0) / 1000000).toFixed(0)}M`,
      color: "blue"
    },
  ];

  const getTypeIcon = (type: ServiceType) => {
    switch (type) {
      case "hotel": return Building2;
      case "activity": return Activity;
      case "car": return Car;
    }
  };

  const getTypeLabel = (type: ServiceType) => {
    switch (type) {
      case "hotel": return t('admin.hotels');
      case "activity": return t('admin.activities');
      case "car": return t('admin.carRentals');
    }
  };

  const adminServicesLabel = `${t('admin.manageServices')} (${getTypeLabel(serviceType)})`;

  const getStatusBadge = (service: Service) => {
    if (service.approvalStatus === "APPROVED") {
      if (service.status === "ACTIVE") {
        return <Badge className="bg-green-100 text-green-700">{t('admin.active')}</Badge>;
      } else if (service.status === "PAUSED") {
        return <Badge className="bg-gray-100 text-gray-700">{t('admin.paused')}</Badge>;
      }
      return <Badge className="bg-green-100 text-green-700">{t('admin.approved')}</Badge>;
    } else if (service.approvalStatus === "PENDING" || service.approvalStatus === "PENDING_REVIEW") {
      return <Badge className="bg-yellow-100 text-yellow-700">{t('admin.pendingApproval')}</Badge>;
    } else if (service.approvalStatus === "REJECTED") {
      return <Badge className="bg-red-100 text-red-700">{t('admin.rejected')}</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">{t('admin.unknown')}</Badge>;
  };

  const formatPrice = (service: Service) => {
    const price = service.lowestPrice || service.price || service.pricePerHour;
    if (!price) return t('common.contactForPrice');
    
    if (service.pricePerHour) {
      return `₫${(price / 1000).toFixed(0)}K/${t('common.hour')}`;
    }
    return `₫${(price / 1000000).toFixed(1)}M`;
  };

  const handleViewDetail = (service: Service) => {
    setSelectedService(service);
    setIsDetailOpen(true);
  };

  const handleApprove = (service: Service) => {
    setReviewingService(service);
    setReviewAction("approve");
    setAdminNote("");
    setIsReviewDialogOpen(true);
  };

  const handleReject = (service: Service) => {
    setReviewingService(service);
    setReviewAction("reject");
    setAdminNote("");
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewingService) return;
    
    try {
      const serviceId = reviewingService.id;
      if (reviewAction === "approve") {
        if (serviceType === "hotel") await adminApi.approveHotel(serviceId);
        else if (serviceType === "car") await adminApi.approveCar(serviceId);
        else await adminApi.approveActivity(serviceId);
        toast.success(t('admin.serviceApproved'));
      } else {
        if (serviceType === "hotel") await adminApi.rejectHotel(serviceId, adminNote || undefined);
        else if (serviceType === "car") await adminApi.rejectCar(serviceId, adminNote || undefined);
        else await adminApi.rejectActivity(serviceId, adminNote || undefined);
        toast.success(t('admin.serviceRejected'));
      }

      setIsReviewDialogOpen(false);
      setReviewingService(null);
      setAdminNote("");
      loadServices();
    } catch (error) {
      toast.error(t('admin.errorReviewingService'));
    }
  };

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(t('admin.confirmDeleteService'));
    if (!confirmed) return;
    
    try {
      const servicePath = service.type === "car" ? "car-rentals" : service.type === "activity" ? "activities" : "hotels";
      await vendorApi.deleteService(servicePath, service.id);
      toast.success(t('admin.serviceDeleted'));
      loadServices();
    } catch (error) {
      toast.error(t('admin.errorDeletingService'));
    }
  };

  const handleSubmitService = async ({ serviceType: svcType, data, id }: { serviceType: ServiceType; data: any; id?: string; }) => {
    try {
      const targetPath = svcType === "car" ? "car-rentals" : svcType === "activity" ? "activities" : svcType;
      if (id) await vendorApi.updateService(targetPath, id, data);
      else await vendorApi.createService(targetPath, data);
      toast.success(id ? t('admin.serviceUpdated') : t('admin.serviceCreated'));
      setIsAddDialogOpen(false);
      setEditingService(null);
      setAddDialogType(null);
      setServiceType(svcType);
      loadServices();
    } catch (error) {
      toast.error(t('admin.errorSavingService'));
    }
  };

  return (
    <AdminLayout currentPage="admin-services" onNavigate={onNavigate} activePage="admin-services" adminServicesLabel={adminServicesLabel}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('admin.manageServices')}</h1>
            <p className="text-gray-600">{t('admin.manageServicesDesc')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setEditingService(null);
                setEditingHotelId(null);
                setServiceType("hotel");
                setIsHotelWizardOpen(true);
              }}
            >
              {t('admin.hotelWizard') || 'Wizard khách sạn + phòng'}
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingService(null);
                setServiceType("activity");
                setAddDialogType("activity");
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {t('admin.addActivity') || 'Thêm hoạt động / tour'}
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingService(null);
                setServiceType("car");
                setAddDialogType("car");
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {t('admin.addCarRental') || 'Thêm xe cho thuê'}
            </Button>
          </div>
        </div>

        {/* Service Type Tabs */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">{t('admin.serviceType')}:</span>
            <Tabs value={serviceType} onValueChange={(value) => setServiceType(value as ServiceType)}>
              <TabsList>
                <TabsTrigger value="hotel" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  {t('admin.hotels')}
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <Activity className="w-4 h-4" />
                  {t('admin.activities')}
                </TabsTrigger>
                <TabsTrigger value="car" className="gap-2">
                  <Car className="w-4 h-4" />
                  {t('admin.carRentals')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('admin.searchServices')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceTab)}>
              <TabsList>
                <TabsTrigger value="all">{t('admin.all')}</TabsTrigger>
                <TabsTrigger value="approved">{t('admin.approved')}</TabsTrigger>
                <TabsTrigger value="pending">{t('admin.pending')}</TabsTrigger>
                <TabsTrigger value="rejected">{t('admin.rejected')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Services Grid */}
        <Card className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('admin.noServicesFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(service)}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 flex-1">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Vendor Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>{service.vendorName}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{service.locationName}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-600">{t('admin.views')}</p>
                        <p className="font-semibold text-gray-900">{service.views || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t('admin.bookings')}</p>
                        <p className="font-semibold text-gray-900">{service.bookings || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t('admin.revenue')}</p>
                        <p className="font-semibold text-green-600">
                          ₫{((service.revenue || 0) / 1000000).toFixed(0)}M
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(service)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => handleViewDetail(service)}
                      >
                        <Eye className="w-4 h-4" />
                        {t('common.view')}
                      </Button>
                      
                      {service.approvalStatus === "PENDING" && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(service)}
                          >
                            {t('admin.approve')}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(service)}
                          >
                            {t('admin.reject')}
                          </Button>
                        </>
                      )}
                      
                      {service.approvalStatus !== "PENDING" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {service.approvalStatus === "REJECTED" && (
                              <DropdownMenuItem 
                                className="gap-2 text-green-600"
                                onClick={() => handleApprove(service)}
                              >
                                <Play className="w-4 h-4" />
                                {t('admin.approve')}
                              </DropdownMenuItem>
                            )}
                            {service.approvalStatus === "APPROVED" && (
                              <DropdownMenuItem 
                                className="gap-2 text-red-600"
                                onClick={() => handleReject(service)}
                              >
                                <Pause className="w-4 h-4" />
                                {t('admin.reject')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="gap-2 text-red-600"
                              onClick={() => handleDelete(service)}
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Admin Note */}
                    {service.adminNote && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs text-yellow-800">
                          <strong>{t('admin.adminNote')}:</strong> {service.adminNote}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Service Dialogs */}
      <HotelWizardDialog
        open={isHotelWizardOpen}
        onOpenChange={(open) => {
          setIsHotelWizardOpen(open);
          if (!open) setEditingHotelId(null);
        }}
        onCompleted={() => {
          setIsHotelWizardOpen(false);
          setEditingHotelId(null);
          loadServices();
        }}
        editingHotelId={editingHotelId || undefined}
      />

      {addDialogType && (
        <AddServiceDialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingService(null);
              setAddDialogType(null);
            }
          }}
          onSuccess={() => {
            setIsAddDialogOpen(false);
            setEditingService(null);
            setAddDialogType(null);
            toast.success(t('admin.serviceCreated'));
            loadServices();
          }}
          onSubmit={handleSubmitService}
          editingService={editingService}
          defaultType={addDialogType}
          allowTypeChange={false}
        />
      )}

      {/* Service Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedService?.name}</DialogTitle>
            <DialogDescription>
              {t('admin.serviceId')}: {selectedService?.id} | {t('admin.vendor')}: {selectedService?.vendorName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              {/* Image */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.serviceType')}</p>
                  <p className="font-semibold">{getTypeLabel(selectedService.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('admin.status')}</p>
                  <div className="mt-1">{getStatusBadge(selectedService)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('admin.location')}</p>
                  <p className="font-semibold">{selectedService.locationName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('admin.price')}</p>
                  <p className="font-semibold text-blue-600">{formatPrice(selectedService)}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-2">{t('admin.description')}</p>
                <p className="text-gray-900">{selectedService.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.views')}</p>
                  <p className="text-xl font-bold text-gray-900">{selectedService.views || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('admin.bookings')}</p>
                  <p className="text-xl font-bold text-gray-900">{selectedService.bookings || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('admin.revenue')}</p>
                  <p className="text-xl font-bold text-green-600">
                    ₫{((selectedService.revenue || 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>

              {/* Review Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.submittedAt')}</p>
                  <p className="font-semibold">
                    {new Date(selectedService.submittedAt).toLocaleString()}
                  </p>
                </div>
                {selectedService.reviewedAt && (
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.reviewedAt')}</p>
                    <p className="font-semibold">
                      {new Date(selectedService.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Note */}
              {selectedService.adminNote && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.adminNote')}</p>
                  <p className="text-gray-900">{selectedService.adminNote}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                {selectedService.approvalStatus === "PENDING" && (
                  <>
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setIsDetailOpen(false);
                        handleApprove(selectedService);
                      }}
                    >
                      {t('admin.approve')}
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        setIsDetailOpen(false);
                        handleReject(selectedService);
                      }}
                    >
                      {t('admin.reject')}
                    </Button>
                  </>
                )}
                {selectedService.approvalStatus === "REJECTED" && (
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleApprove(selectedService);
                    }}
                  >
                    {t('admin.reapprove')}
                  </Button>
                )}
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleDelete(selectedService);
                  }}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" 
                ? t('admin.approveService') 
                : t('admin.rejectService')}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? t('admin.approveServiceDesc')
                : t('admin.rejectServiceDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t('admin.serviceName')}
              </p>
              <p className="text-gray-900">{reviewingService?.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t('admin.adminNote')} {reviewAction === "reject" && "*"}
              </p>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={
                  reviewAction === "approve"
                    ? t('admin.adminNoteOptional')
                    : t('admin.adminNoteRequired')
                }
                rows={4}
                required={reviewAction === "reject"}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={handleSubmitReview}
              disabled={reviewAction === "reject" && !adminNote.trim()}
            >
              {reviewAction === "approve" ? t('admin.approve') : t('admin.reject')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
