import {
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
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { VendorLayout } from "../../components/VendorLayout";
import { StatusBadge } from "../../components/admin/StatusBadge";
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
import { HotelWizardDialog } from "../../components/vendor/HotelWizardDialog";
import { ServiceDetailDialog } from "../../components/vendor/ServiceDetailDialog";
import { activityApi, carRentalApi, hotelApi, vendorApi } from "../../utils/api";

interface VendorServicesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PENDING_REVIEW";
type OperationalStatus = "ACTIVE" | "PAUSED" | "PENDING_REVIEW" | "REJECTED";
type ServiceTab = "all" | "approved" | "pending" | "rejected";
type ServiceType = "hotel" | "activity" | "car";
type LegacyServiceStatus = "pending" | "approved" | "needs_revision" | "rejected";

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
  address?: string;
  locationName?: string;
  hotelType?: string;
  starRating?: number;
  seats?: number;
  doors?: number;
  luggage?: number;
  duration?: string;
  phone?: string;
  email?: string;
  website?: string;
  amenities?: string[];
  policies?: any;
  brand?: string;
  model?: string;
  year?: number;
  carType?: string;
  transmission?: string;
  fuelType?: string;
  fuelPolicy?: string;
  color?: string;
  licensePlate?: string;
  features?: string[];
  withDriver?: boolean;
  driverPrice?: number;
  deposit?: number;
  mileageLimit?: number;
  minRentalDays?: number;
  availableQuantity?: number;
  deliveryAvailable?: boolean;
  deliveryFee?: number;
  category?: string;
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  languages?: string[];
  meetingPoint?: string;
  ageRestriction?: string;
  cancellationPolicy?: string;
}

interface LegacyService {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  image: string;
  price: number;
  status: LegacyServiceStatus;
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
  const { t } = useTranslation();
  const initialType: ServiceType = vendorType === "activity" ? "activity" : vendorType === "car" ? "car" : "hotel";
  const [activeTab, setActiveTab] = useState<ServiceTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHotelWizardOpen, setIsHotelWizardOpen] = useState(false);
  const [addDialogType, setAddDialogType] = useState<ServiceType | null>(null);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceType, setServiceType] = useState<ServiceType>(initialType);

  useEffect(() => {
    loadServices();
  }, [serviceType]);

  const servicePath = serviceType === "car" ? "car-rentals" : serviceType === "activity" ? "activities" : "hotels";
  const defaultServiceType: ServiceType = serviceType;

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

    const numberOrUndefined = (val: any) => {
      const num = Number(val);
      return Number.isFinite(num) && num > 0 ? num : undefined;
    };

    const priceCandidate = numberOrUndefined(item.price)
      ?? numberOrUndefined(item.pricePerNight)
      ?? numberOrUndefined(item.pricePerDay)
      ?? numberOrUndefined(item.basePrice)
      ?? numberOrUndefined(item.originalPrice)
      ?? numberOrUndefined(item.startingPrice)
      ?? numberOrUndefined(item.lowestPrice)
      ?? minRoomPrice
      ?? undefined;

    const normalizeStatus = (val: any): OperationalStatus => {
      const raw = String(val || "").toUpperCase();
      if (raw === "AVAILABLE") return "ACTIVE";
      if (raw === "ACTIVE") return "ACTIVE";
      if (raw === "PAUSED") return "PAUSED";
      if (raw === "REJECTED") return "REJECTED";
      if (raw === "PENDING" || raw === "PENDING_REVIEW") return "PENDING_REVIEW";
      return "PENDING_REVIEW";
    };

    const carNameFallback = [item.brand, item.model, item.year].filter(Boolean).join(" ");

    return {
      id: item.id,
      type: serviceType as ServiceType,
      name: item.name || carNameFallback,
      description: item.description || item.overview || item.summary || carNameFallback,
      image: normalizedImage,
      price: priceCandidate,
      pricePerHour: item.pricePerHour ? Number(item.pricePerHour) : undefined,
      lowestPrice: item.lowestPrice ? Number(item.lowestPrice) : undefined,
      approvalStatus: (item.approvalStatus || "PENDING") as ApprovalStatus,
      status: normalizeStatus(item.status),
      submittedAt: item.createdAt || new Date().toISOString(),
      reviewedAt: item.reviewedAt,
      adminNote: item.adminNote,
      views: item.views,
      bookings: item.bookings,
      revenue: item.revenue,
      address: item.address,
      locationName: item.location?.name || item.locationName,
      hotelType: item.hotelType,
      starRating: item.starRating,
      seats: item.seats,
      doors: item.doors,
      luggage: item.luggage,
      duration: item.duration,
      phone: item.phone,
      email: item.email,
      website: item.website,
      amenities: item.amenities,
      policies: item.policies,
      brand: item.brand,
      model: item.model,
      year: item.year ? Number(item.year) : undefined,
      carType: item.type || item.carType,
      transmission: item.transmission,
      fuelType: item.fuelType,
      fuelPolicy: item.fuelPolicy,
      color: item.color,
      licensePlate: item.licensePlate,
      features: item.features,
      withDriver: item.withDriver,
      driverPrice: item.driverPrice ? Number(item.driverPrice) : undefined,
      deposit: item.deposit ? Number(item.deposit) : undefined,
      mileageLimit: item.mileageLimit ? Number(item.mileageLimit) : undefined,
      minRentalDays: item.minRentalDays ? Number(item.minRentalDays) : undefined,
      availableQuantity: item.availableQuantity ? Number(item.availableQuantity) : undefined,
      deliveryAvailable: item.deliveryAvailable,
      deliveryFee: item.deliveryFee ? Number(item.deliveryFee) : undefined,
      category: item.category,
      highlights: item.highlights,
      included: item.included,
      notIncluded: item.notIncluded,
      languages: item.languages,
      meetingPoint: item.meetingPoint,
      ageRestriction: item.ageRestriction,
      cancellationPolicy: item.cancellationPolicy,
    };
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await vendorApi.getServices(servicePath);
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setServices(list.map(mapService));
    } catch (error) {
      toast.error(t('vendor.errorLoadingServices'));
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const name = service.name || "";
    const desc = service.description || "";
    const query = (searchQuery || "").toLowerCase();
    const matchesSearch = name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "approved" && service.approvalStatus === "APPROVED") ||
      (activeTab === "pending" && service.approvalStatus !== "APPROVED") ||
      (activeTab === "rejected" && service.approvalStatus === "REJECTED");
    return matchesSearch && matchesTab;
  });

  const getTypeLabel = (type: ServiceType) => {
    switch (type) {
      case "hotel": return t('vendor.hotel');
      case "activity": return t('vendor.activity');
      case "car": return t('vendor.car');
    }
  };

  const stats = [
    { 
      label: t('vendor.activeServices'), 
      value: services.filter(s => s.approvalStatus === "APPROVED" && s.status === "ACTIVE").length,
      color: "green"
    },
    { 
      label: t('vendor.pendingApproval'), 
      value: services.filter(s => s.approvalStatus !== "APPROVED").length,
      color: "yellow"
    },
    { 
      label: t('vendor.needsRevision'), 
      value: services.filter(s => s.approvalStatus === "REJECTED").length,
      color: "orange"
    },
    { 
      label: t('vendor.totalRevenue'), 
      value: `₫${(services.reduce((sum, s) => sum + (s.revenue || 0), 0) / 1000000).toFixed(0)}M`,
      color: "blue"
    },
  ];

  const handleViewDetail = (service: Service) => {
    setSelectedService(service);
    setIsDetailOpen(true);
  };

  const handleEdit = (service: Service) => {
    if (service.approvalStatus === "REJECTED") {
      toast.info(t('vendor.rejectedViewOnly') || 'Dịch vụ đã bị từ chối, chỉ xem được chi tiết.');
      return;
    }
    if (serviceType === "hotel") {
      setEditingHotelId(service.id);
      setIsHotelWizardOpen(true);
    } else {
      setEditingService(service);
      setAddDialogType(service.type);
      setIsAddDialogOpen(true);
    }
  };

  const handlePause = async (service: Service) => {
    if (service.approvalStatus === "REJECTED") {
      toast.info(t('vendor.rejectedViewOnly') || 'Dịch vụ bị từ chối, không thể tạm dừng.');
      return;
    }
    try {
      if (serviceType === "car") await carRentalApi.pauseCar(service.id);
      else if (serviceType === "activity") await activityApi.pauseActivity(service.id);
      else await hotelApi.pauseHotel(service.id);
      toast.success(t('vendor.pausedService'));
      loadServices();
    } catch (err) {
      toast.error(t('vendor.errorLoadingServices'));
    }
  };

  const handleResume = async (service: Service) => {
    if (service.approvalStatus === "REJECTED") {
      toast.info(t('vendor.rejectedViewOnly') || 'Dịch vụ bị từ chối, không thể kích hoạt.');
      return;
    }
    if (service.approvalStatus !== "APPROVED") {
      toast.info(t('vendor.pendingApproval'));
      return;
    }
    if (service.status !== "PAUSED") {
      toast.info(t('vendor.resume') || "Tiếp tục");
      return;
    }
    try {
      if (serviceType === "car") await carRentalApi.resumeCar(service.id);
      else if (serviceType === "activity") await activityApi.resumeActivity(service.id);
      else await hotelApi.resumeHotel(service.id);
      toast.success(t('vendor.resumedService'));
      loadServices();
    } catch (err) {
      toast.error(t('vendor.errorLoadingServices'));
    }
  };

  const handleResubmit = (service?: Service | null) => {
    if (!service) {
      toast.info(t('vendor.pendingApproval'));
      return;
    }
    if (service.approvalStatus === "REJECTED") {
      toast.info(t('vendor.rejectedViewOnly') || 'Dịch vụ đã bị từ chối, chỉ xem được chi tiết.');
      return;
    }
    setEditingService(service);
    setIsAddDialogOpen(true);
  };

  const toLegacyService = (service: Service): LegacyService => ({
    id: service.id,
    type: service.type,
    name: service.name,
    description: service.description,
    image: service.image,
    price: service.price,
    submittedAt: service.submittedAt,
    reviewedAt: service.reviewedAt,
    adminNote: service.adminNote,
    views: service.views,
    bookings: service.bookings,
    revenue: service.revenue,
    status:
      service.approvalStatus === "APPROVED"
        ? "approved"
        : service.approvalStatus === "REJECTED"
          ? "rejected"
          : "pending",
  });

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(t('vendor.confirmDelete') || 'Xóa dịch vụ này?');
    if (!confirmed) return;
    try {
      await vendorApi.deleteService(servicePath, service.id);
      toast.success(t('vendor.deletedService'));
      loadServices();
    } catch (err) {
      toast.error(t('vendor.errorLoadingServices'));
    }
  };

  const handleSubmitService = async ({ serviceType, data, id }: { serviceType: ServiceType; data: any; id?: string; }) => {
    const targetPath = serviceType === "car" ? "car-rentals" : serviceType === "activity" ? "activities" : "hotels";
    if (id) {
      await vendorApi.updateService(targetPath, id, data);
    } else {
      await vendorApi.createService(targetPath, data);
    }
    await loadServices();
  };

  return (
    <VendorLayout 
      currentPage="vendor-services" 
      onNavigate={onNavigate} 
      activePage="vendor-services"
      vendorType={serviceType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('vendor.manageServices')}</h1>
            <p className="text-gray-600">{t('vendor.manageServicesDesc')}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border bg-white shadow-sm overflow-hidden">
              {[{ label: "Khách sạn", value: "hotel" }, { label: "Hoạt động", value: "activity" }, { label: "Thuê xe", value: "car" }].map((opt) => (
                <button
                  key={opt.value}
                  className={`px-3 py-2 text-sm border-r last:border-r-0 ${serviceType === opt.value ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => {
                    setServiceType(opt.value as ServiceType);
                    setActiveTab("all");
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setEditingService(null);
                setIsHotelWizardOpen(true);
              }}
            >
              Wizard khách sạn + phòng
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
              Thêm hoạt động / tour
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
              Thêm xe cho thuê
            </Button>
          </div>
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
                placeholder={t('vendor.searchServices')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ServiceTab)}>
            <TabsList>
              <TabsTrigger value="all">
                {t('common.all')} ({services.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('vendor.activeServices')}
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                {t('vendor.pendingApproval')}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="w-4 h-4" />
                {t('vendor.rejected')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading && (
                <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredServices.map((service) => {
                   const priceLabel = service.type === "hotel"
                     ? "Giá thấp nhất (VND/đêm)"
                     : service.type === "activity"
                       ? "Giá (VND/người)"
                       : "Giá thuê/ngày (VND)";
                   const priceValue = service.price ?? service.lowestPrice;

                   const metaChips = () => {
                     if (service.type === "hotel") {
                       return [
                         service.locationName || service.address,
                         service.hotelType,
                         service.starRating ? `${service.starRating}★` : null,
                       ].filter(Boolean);
                     }
                     if (service.type === "activity") {
                       return [
                         service.locationName,
                         service.duration,
                         service.category,
                         service.meetingPoint,
                       ].filter(Boolean);
                     }
                      return [
                        service.brand && service.model ? `${service.brand} ${service.model}` : service.brand || service.model,
                        service.year ? `Đời ${service.year}` : null,
                        service.seats ? `${service.seats} chỗ` : null,
                        service.doors ? `${service.doors} cửa` : null,
                        service.luggage ? `${service.luggage} vali` : null,
                        service.transmission,
                        service.fuelType,
                      ].filter(Boolean);
                   };

                   return (
                     <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                       <div className="relative h-48">
                         <ImageWithFallback
                           src={service.image}
                           alt={service.name}
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute top-3 right-3 flex gap-2">
                           <StatusBadge type="approval" kind={service.approvalStatus} />
                           <StatusBadge type="status" kind={service.status} />
                         </div>
                         <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                           {getTypeLabel(service.type)}
                         </Badge>
                       </div>

                       <div className="p-4 space-y-3">
                         <div className="flex items-start justify-between gap-3">
                           <div className="min-w-0">
                             <h3 className="text-lg text-gray-900 mb-1 line-clamp-1">{service.name}</h3>
                             {service.description && (
                               <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                             )}
                           </div>
                           <div className="text-right">
                             <p className="text-[11px] text-gray-500">{priceLabel}</p>
                             <p className="text-xl font-semibold text-blue-600 leading-tight">
                               {priceValue !== undefined && priceValue !== null ? `₫${priceValue.toLocaleString()}` : "Chưa có giá"}
                             </p>
                           </div>
                         </div>

                         {metaChips().length > 0 && (
                           <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                             {metaChips().map((chip, idx) => (
                               <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                                 {chip}
                               </span>
                             ))}
                           </div>
                         )}

                         {(service.views || service.bookings || service.revenue) && (
                           <div className="grid grid-cols-3 gap-2 pt-3 border-t text-xs">
                             <div>
                               <p className="text-gray-500">{t('vendor.views')}</p>
                               <p className="text-gray-900 font-medium">{service.views ?? 0}</p>
                             </div>
                             <div>
                               <p className="text-gray-500">{t('vendor.bookings')}</p>
                               <p className="text-gray-900 font-medium">{service.bookings ?? 0}</p>
                             </div>
                             <div>
                               <p className="text-gray-500">{t('vendor.revenue')}</p>
                               <p className="text-green-600 font-medium">{service.revenue ? `${(service.revenue / 1000000).toFixed(0)}M` : "—"}</p>
                             </div>
                           </div>
                         )}

                         <div className="flex items-center justify-between pt-3 border-t">
                           <div className="text-xs text-gray-500 space-y-1">
                             <p>{t('vendor.submitted')}: {service.submittedAt}</p>
                             {service.reviewedAt && <p>{t('vendor.reviewed')}: {service.reviewedAt}</p>}
                           </div>
                           <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={() => handleViewDetail(service)}>
                               <Eye className="w-4 h-4" />
                             </Button>
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="sm">
                                   <MoreVertical className="w-4 h-4" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                {service.approvalStatus !== "REJECTED" && (
                                  <DropdownMenuItem className="gap-2" onClick={() => handleEdit(service)}>
                                    <Edit className="w-4 h-4" />
                                    {t('vendor.edit')}
                                  </DropdownMenuItem>
                                )}
                                {service.approvalStatus !== "REJECTED" && (
                                  <DropdownMenuItem className="gap-2" onClick={() => handlePause(service)}>
                                    <Clock className="w-4 h-4" />
                                    {t('vendor.pause')}
                                  </DropdownMenuItem>
                                )}
                                {service.approvalStatus !== "REJECTED" && (
                                  <DropdownMenuItem className="gap-2" onClick={() => handleResume(service)}>
                                    <RefreshCw className="w-4 h-4" />
                                    {t('vendor.resume')}
                                  </DropdownMenuItem>
                                )}
                                 <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDelete(service)}>
                                   <Trash2 className="w-4 h-4" />
                                   {t('vendor.delete')}
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                           </div>
                         </div>
                       </div>
                     </Card>
                   );
                 })}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('vendor.noServicesFound')}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Add Service Dialog */}
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
            toast.success(editingService 
              ? t('vendor.editServiceSuccess')
              : t('vendor.addServiceSuccess')
            );
          }}
          onSubmit={handleSubmitService}
          editingService={editingService}
          defaultType={addDialogType}
          allowTypeChange={false}
        />
      )}

      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        service={selectedService}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(svc) => {
          const original = services.find((s) => s.id === svc.id);
          if (original) handleEdit(original);
        }}
        onResubmit={(svc) => {
          const original = services.find((s) => s.id === svc.id);
          handleResubmit(original);
        }}
        onDelete={(svc) => {
          const original = services.find((s) => s.id === svc.id);
          if (original) handleDelete(original);
        }}
      />
    </VendorLayout>
  );
}