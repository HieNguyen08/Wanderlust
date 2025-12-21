import {
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Filter,
  Search,
  XCircle
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { AdminLayout } from "../../components/AdminLayout";
import { AdminServiceReviewDialog } from "../../components/admin/AdminServiceReviewDialog";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { vendorApi, hotelApi, activityApi, carRentalApi, authenticatedFetch } from "../../utils/api";
import { AddServiceDialog, type EditingService } from "../../components/vendor/AddServiceDialog";

interface AdminPendingServicesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

type ServiceStatus = "pending" | "approved" | "needs_revision" | "rejected";
type ServiceType = "hotel" | "activity" | "car" | "room";

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ServiceStatus | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<PendingService | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [services, setServices] = useState<PendingService[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | ServiceType>("all");
  const [timeSort, setTimeSort] = useState<"newest" | "oldest">("newest");
  const [vendorNames, setVendorNames] = useState<Record<string, string>>({});
  const [actionBusyIds, setActionBusyIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [pageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditingService | null>(null);
  const [editFormType, setEditFormType] = useState<ServiceType>("hotel");
  const [editFormServiceId, setEditFormServiceId] = useState<string>("");
  const [editFormParentId, setEditFormParentId] = useState<string>("");

  // Map backend approval/status to UI buckets. "needs_revision" only when still pending.
  const mapStatus = (approvalStatus?: string, adminNote?: string): ServiceStatus => {
    if (approvalStatus === "APPROVED") return "approved";
    if (approvalStatus === "REJECTED") return "rejected";
    if (adminNote) return "needs_revision";
    return "pending";
  };

  const pickImage = (item: any): string => {
    const imgs = Array.isArray(item.images) ? item.images : [];
    if (imgs.length === 0) return "";
    const first = imgs[0];
    if (typeof first === "string") return first;
    return first?.url || "";
  };

  const normalizeNumber = (val: any) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  };

  const parseDateValue = (value?: string) => {
    if (!value) return 0;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const formatDateValue = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("vi-VN");
  };

  const mapService = (item: any, type: ServiceType): PendingService => {
    const approval = item.approvalStatus || "PENDING";
    const status = mapStatus(approval, item.adminNote);
    const price = normalizeNumber(item.lowestPrice || item.pricePerDay || item.price || item.basePrice);

    const carQuickFacts = type === "car"
      ? [
        [item.brand, item.model, item.year].filter(Boolean).join(" "),
        item.type,
        item.seats ? `${item.seats} chỗ` : undefined,
        item.transmission,
        item.fuelType,
      ].filter(Boolean).join(" • ")
      : undefined;

    const descriptionText =
      item.description ||
      item.overview ||
      item.summary ||
      (type === "car"
        ? carQuickFacts || (Array.isArray(item.features) ? item.features.slice(0, 3).join(", ") : undefined)
        : undefined) ||
      "";

    const vendorName = item.vendorName || item.businessName || item.business || item.vendorId || "Vendor";
    const fallbackName =
      item.name ||
      [item.brand, item.model].filter(Boolean).join(" ") ||
      item.slug ||
      "Dịch vụ";

    const common = {
      id: item.id || item.hotelID || item._id,
      type,
      vendorName,
      vendorId: item.vendorId || "",
      name: fallbackName,
      description: descriptionText,
      images: (Array.isArray(item.images) ? item.images.map((img: any) => typeof img === "string" ? img : img?.url).filter(Boolean) : []),
      price: price || 0,
      status,
      submittedAt: item.createdAt || item.updatedAt || new Date().toISOString(),
      reviewedAt: item.updatedAt || item.reviewedAt,
      adminNote: item.adminNote,
      details: {} as Record<string, any>,
    };

    if (type === "hotel") {
      const rooms = Array.isArray(item.rooms) ? item.rooms.map((r: any) => {
        const options = Array.isArray(r.options) ? r.options : [];
        const optionPrices = options
          .map((o: any) => Number(o.price))
          .filter((p: number) => Number.isFinite(p) && p > 0);
        const minPrice = optionPrices.length > 0 ? Math.min(...optionPrices) : Number(r.basePrice);
        const images = Array.isArray(r.images)
          ? r.images.map((img: any) => typeof img === "string" ? img : img?.url).filter(Boolean)
          : [];
        const optionSummaries = options
          .map((o: any) => {
            const price = Number(o.price);
            const priceLabel = Number.isFinite(price) ? `${price.toLocaleString("vi-VN")} đ` : undefined;
            const cap = o.capacity ? `${o.capacity} khách` : undefined;
            const name = o.name || o.type;
            return [name, cap, priceLabel].filter(Boolean).join(" • ");
          })
          .filter(Boolean);

        return {
          id: r.id,
          name: r.name,
          type: r.type || r.roomType,
          maxOccupancy: normalizeNumber(r.maxOccupancy),
          bedType: r.bedType,
          size: normalizeNumber(r.size),
          description: r.description,
          amenities: Array.isArray(r.amenities) ? r.amenities.join(", ") : r.amenities,
          basePrice: normalizeNumber(r.basePrice),
          originalPrice: normalizeNumber(r.originalPrice),
          cancellationPolicy: r.cancellationPolicy,
          breakfastIncluded: typeof r.breakfastIncluded === "boolean" ? r.breakfastIncluded : undefined,
          totalRooms: normalizeNumber(r.totalRooms),
          availableRooms: normalizeNumber(r.availableRooms),
          status: r.status || r.roomStatus,
          optionCount: options.length,
          optionSummaries,
          priceFrom: Number.isFinite(minPrice) ? minPrice : undefined,
          images,
        };
      }) : [];

      const totalRooms = item.totalRooms ?? (rooms.reduce((sum: number, r: any) => sum + (r.totalRooms || 0), 0) || (rooms.length > 0 ? rooms.length : undefined));

      common.details = {
        star: item.starRating,
        hotelType: item.hotelType,
        locationId: item.locationId,
        address: item.address,
        amenities: Array.isArray(item.amenities) ? item.amenities.join(", ") : item.amenities,
        city: item.city,
        country: item.country,
        phone: item.phone,
        email: item.email,
        website: item.website,
        cancellationPolicy: item.policies?.cancellation,
        policyPets: item.policies?.pets,
        policySmoking: item.policies?.smoking,
        lowestPrice: normalizeNumber(item.lowestPrice),
        totalRooms,
        rooms,
      };
    } else if (type === "activity") {
      common.details = {
        duration: item.duration,
        category: item.category,
        languages: item.languages?.join(", "),
        meetingPoint: item.meetingPoint,
        city: item.city,
        country: item.country,
        locationId: item.locationId,
        startDateTime: item.startDateTime,
        endDateTime: item.endDateTime,
        difficulty: item.difficulty,
      };
    } else {
      common.details = {
        locationId: item.locationId,
        brand: item.brand,
        model: item.model,
        seats: item.seats,
        transmission: item.transmission,
        fuel: item.fuelType,
        year: item.year,
        withDriver: item.withDriver,
        fuelPolicy: item.fuelPolicy,
        pricePerHour: item.pricePerHour,
        deposit: item.deposit,
        mileageLimit: item.mileageLimit,
        minRentalDays: item.minRentalDays,
        deliveryAvailable: item.deliveryAvailable,
        deliveryFee: item.deliveryFee,
        doors: item.doors,
        luggage: item.luggage,
        color: item.color,
        licensePlate: item.licensePlate,
        fuelPolicy: item.fuelPolicy,
        city: item.city,
        country: item.country,
      };
    }

    return { ...common, images: common.images.length ? common.images : [pickImage(item)] };
  };

  const fetchVendorNames = async (vendorIds: string[]) => {
    const uniqueIds = Array.from(new Set(vendorIds.filter(Boolean))).filter(id => !vendorNames[id]);
    if (uniqueIds.length === 0) return;
    const entries = await Promise.all(uniqueIds.map(async (id) => {
      try {
        const response = await authenticatedFetch(`/api/users/${id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || data.email || id;
        return [id, name] as const;
      } catch (e) {
        return [id, id] as const;
      }
    }));
    setVendorNames(prev => ({ ...prev, ...Object.fromEntries(entries) }));
  };

  const mergeIncomingServices = (incoming: PendingService[]) => {
    setServices(prev => {
      const map = new Map<string, PendingService>();
      prev.forEach(item => map.set(item.id, item));
      incoming.forEach(item => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      });
      return Array.from(map.values());
    });
    fetchVendorNames(incoming.map(m => m.vendorId));
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const [hotelsPage, activitiesPage, carsPage] = await Promise.all([
        vendorApi.getServices("hotels", { page: 0, size: pageSize }),
        vendorApi.getServices("activities", { page: 0, size: pageSize }),
        vendorApi.getServices("car-rentals", { page: 0, size: pageSize }),
      ]);

      const normalizeList = (data: any) => Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];

      const firstBatch: PendingService[] = [
        ...normalizeList(hotelsPage).map((h: any) => mapService(h, "hotel")),
        ...normalizeList(activitiesPage).map((a: any) => mapService(a, "activity")),
        ...normalizeList(carsPage).map((c: any) => mapService(c, "car")),
      ];
      setServices(firstBatch);
      fetchVendorNames(firstBatch.map(m => m.vendorId));
      setLoading(false);

      // Background load full lists (newest first) and merge without overriding local changes
      (async () => {
        try {
          const [hotelsAll, activitiesAll, carsAll] = await Promise.all([
            vendorApi.getServices("hotels"),
            vendorApi.getServices("activities"),
            vendorApi.getServices("car-rentals"),
          ]);

          const fullBatch: PendingService[] = [
            ...normalizeList(hotelsAll).map((h: any) => mapService(h, "hotel")),
            ...normalizeList(activitiesAll).map((a: any) => mapService(a, "activity")),
            ...normalizeList(carsAll).map((c: any) => mapService(c, "car")),
          ];
          mergeIncomingServices(fullBatch);
        } catch (backgroundError) {
          // Silent fail to avoid disrupting initial view
        }
      })();
    } catch (error) {
      toast.error(t('common.error')); // generic
      setLoading(false);
    } finally {
      // loading already cleared after first batch
    }
  };

  const setServiceLocally = (serviceId: string, updater: (svc: PendingService) => PendingService) => {
    setServices(prev => prev.map(s => (s.id === serviceId ? updater(s) : s)));
  };

  const withActionBusy = async (serviceId: string, fn: () => Promise<void>) => {
    setActionBusyIds(prev => new Set(prev).add(serviceId));
    try {
      await fn();
    } finally {
      setActionBusyIds(prev => {
        const next = new Set(prev);
        next.delete(serviceId);
        return next;
      });
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const debounced = debounce((val: string) => {
      setPage(0);
      setSearchTerm(val.trim());
    }, 250);
    debounced(searchQuery);
    return () => debounced.cancel();
  }, [searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, typeFilter, timeSort]);

  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case "pending":
        return { label: t('admin.pending'), className: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "approved":
        return { label: t('admin.approved'), className: "bg-green-100 text-green-700", icon: CheckCircle2 };
      case "needs_revision":
        return { label: t('admin.needsRevision'), className: "bg-orange-100 text-orange-700", icon: Edit };
      case "rejected":
        return { label: t('admin.rejected'), className: "bg-red-100 text-red-700", icon: XCircle };
    }
  };

  const getTypeLabel = (type: ServiceType) => {
    switch (type) {
      case "hotel": return t('common.hotels');
      case "activity": return t('common.activities');
      case "car": return t('admin.carRental');
    }
  };

  const stats = [
    { label: t('admin.pending'), value: services.filter(s => s.status === "pending").length, color: "yellow" },
    { label: t('admin.approved'), value: services.filter(s => s.status === "approved").length, color: "green" },
    { label: t('admin.needsRevision'), value: services.filter(s => s.status === "needs_revision").length, color: "orange" },
    { label: t('admin.rejected'), value: services.filter(s => s.status === "rejected").length, color: "red" },
  ];
  const filteredServices = useMemo(() => {
    const result = services.filter(service => {
      const query = (searchTerm || searchQuery || "").toLowerCase();
      const matchesSearch =
        (service.name || "").toLowerCase().includes(query) ||
        (service.vendorName || "").toLowerCase().includes(query);
      const matchesTab = activeTab === "all" || service.status === activeTab;
      const matchesType = typeFilter === "all" || service.type === typeFilter;
      return matchesSearch && matchesTab && matchesType;
    });

    return [...result].sort((a, b) => {
      const diff = parseDateValue(a.submittedAt) - parseDateValue(b.submittedAt);
      return timeSort === "newest" ? -diff : diff;
    });
  }, [services, searchTerm, searchQuery, activeTab, typeFilter, timeSort]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const paginatedServices = useMemo(() => {
    const start = page * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, page, pageSize]);

  const paginationRange = useMemo(() => {
    const siblingCount = 2;
    const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, 2 dots

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const leftSiblingIndex = Math.max(page + 1 - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + 1 + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const range: (number | string)[] = [];

    range.push(1);

    if (showLeftDots) {
      range.push('dots-left');
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) {
        range.push(i);
      }
    }

    for (let i = Math.max(leftSiblingIndex, 2); i <= Math.min(rightSiblingIndex, totalPages - 1); i++) {
      range.push(i);
    }

    if (showRightDots) {
      range.push('dots-right');
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [page, totalPages]);

  useEffect(() => {
    const maxPage = Math.max(0, totalPages - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredServices.length, totalPages, page]);

  const handleReview = (service: PendingService) => {
    const vendorDisplay = vendorNames[service.vendorId] || service.vendorName || service.vendorId;
    setSelectedService({ ...service, vendorName: vendorDisplay });
    setIsReviewDialogOpen(true);
  };

  const toEditingService = (svc: PendingService): EditingService => {
    const base = {
      id: svc.id,
      type: svc.type,
      name: svc.name,
      description: svc.description,
      price: svc.price,
      images: svc.images,
      locationId: (svc.details as any).locationId,
      address: (svc.details as any).address,
      city: (svc.details as any).city,
      country: (svc.details as any).country,
    } as EditingService;

    if (svc.type === "hotel") {
      return {
        ...base,
        hotelType: (svc.details as any).hotelType,
        starRating: (svc.details as any).star,
        phone: (svc.details as any).phone,
        email: (svc.details as any).email,
        website: (svc.details as any).website,
        amenities: (svc.details as any).amenities,
        policyCancellation: (svc.details as any).cancellationPolicy,
        policyPets: (svc.details as any).policyPets,
        policySmoking: (svc.details as any).policySmoking,
        lowestPrice: (svc.details as any).lowestPrice,
        totalRooms: (svc.details as any).totalRooms,
        policies: {
          cancellation: (svc.details as any).cancellationPolicy,
          pets: (svc.details as any).policyPets,
          smoking: (svc.details as any).policySmoking,
        },
      };
    }

    if (svc.type === "activity") {
      return {
        ...base,
        category: (svc.details as any).category,
        duration: (svc.details as any).duration,
        languages: (svc.details as any).languages,
        meetingPoint: (svc.details as any).meetingPoint,
        activityCancellation: (svc.details as any).cancellationPolicy,
        price: svc.price,
      };
    }

    return {
      ...base,
      brand: (svc.details as any).brand,
      model: (svc.details as any).model,
      seats: (svc.details as any).seats,
      transmission: (svc.details as any).transmission,
      fuelType: (svc.details as any).fuel,
      fuelPolicy: (svc.details as any).fuelPolicy,
      year: (svc.details as any).year,
      withDriver: (svc.details as any).withDriver,
      pricePerHour: (svc.details as any).pricePerHour,
      deposit: (svc.details as any).deposit,
      mileageLimit: (svc.details as any).mileageLimit,
      minRentalDays: (svc.details as any).minRentalDays,
      deliveryAvailable: (svc.details as any).deliveryAvailable,
      deliveryFee: (svc.details as any).deliveryFee,
      doors: (svc.details as any).doors,
      luggage: (svc.details as any).luggage,
      color: (svc.details as any).color,
      licensePlate: (svc.details as any).licensePlate,
      price: svc.price,
    };
  };

  const openEditForm = (svc: PendingService) => {
    setEditFormServiceId(svc.id);
    setEditFormType(svc.type);
    setEditFormParentId(svc.id);
    setEditFormData(toEditingService(svc));
    setIsReviewDialogOpen(false);
    setEditFormOpen(true);
  };
  const openRoomEditForm = (svc: PendingService, room: any) => {
    setEditFormServiceId(room.id || "");
    setEditFormType("room");
    setEditFormParentId(svc.id);
    setEditFormData({
      id: room.id,
      type: "room",
      name: room.name,
      description: room.description,
      price: room.basePrice ?? room.priceFrom,
      images: room.images,
      hotelId: svc.id,
      roomType: room.type,
      capacity: room.maxOccupancy,
      bedType: room.bedType,
      roomSize: room.size,
      originalPrice: room.originalPrice,
      cancellationPolicy: room.cancellationPolicy,
      breakfastIncluded: room.breakfastIncluded,
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
      amenities: room.amenities,
      locationId: (svc.details as any).locationId,
      address: (svc.details as any).address,
    } as EditingService);
    setIsReviewDialogOpen(false);
    setEditFormOpen(true);
  };

  const handleAdminEditSubmit = async ({ serviceType, data, id }: { serviceType: any; data: any; id?: string; }) => {
    const targetId = id || editFormServiceId;

    const updateAsAdmin = async (type: ServiceType, resourceId: string, payload: any) => {
      // Prefer vendor endpoint (may share auth token); fall back to admin endpoint if vendor rejects
      const tryVendor = async () => {
        try {
          return await vendorApi.updateService(type === "room" ? "room" : type, resourceId, payload);
        } catch (err: any) {
          throw { kind: "FALLBACK", err };
        }
      };

      const tryAdmin = async (url: string) => {
        const response = await authenticatedFetch(url, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(t('common.error'));
        }
        return response.json();
      };

      try {
        return await tryVendor();
      } catch (e: any) {
        if (e?.kind !== "FALLBACK") throw e;
      }

      if (type === "hotel") return tryAdmin(`/api/admin/hotels/${resourceId}`);
      if (type === "room") return tryAdmin(`/api/admin/rooms/${resourceId}`);
      return tryVendor();
    };

    // Room edit: update room only, keep admin in review flow
    if (serviceType === "room") {
      const updatedRoom = await updateAsAdmin("room", targetId, data);
      const hotelId = editFormParentId || data.hotelId;

      setServices(prev => prev.map(svc => {
        if (svc.id !== hotelId) return svc;
        const rooms = Array.isArray(svc.details.rooms) ? [...svc.details.rooms] : [];
        const idx = rooms.findIndex((r: any) => r.id === targetId);

        const mergedRoom = {
          ...rooms[idx],
          ...updatedRoom,
          id: targetId,
          name: updatedRoom?.name ?? data.name,
          type: updatedRoom?.type ?? updatedRoom?.roomType ?? data.roomType,
          maxOccupancy: updatedRoom?.maxOccupancy ?? data.capacity,
          bedType: updatedRoom?.bedType ?? data.bedType,
          size: updatedRoom?.size ?? data.roomSize,
          description: updatedRoom?.description ?? data.description,
          amenities: updatedRoom?.amenities ?? data.amenities,
          basePrice: updatedRoom?.basePrice ?? data.price,
          originalPrice: updatedRoom?.originalPrice ?? data.originalPrice,
          cancellationPolicy: updatedRoom?.cancellationPolicy ?? data.cancellationPolicy,
          breakfastIncluded: typeof updatedRoom?.breakfastIncluded === "boolean" ? updatedRoom.breakfastIncluded : data.breakfastIncluded,
          totalRooms: updatedRoom?.totalRooms ?? data.totalRooms,
          availableRooms: updatedRoom?.availableRooms ?? data.availableRooms,
          status: updatedRoom?.status ?? updatedRoom?.roomStatus,
          images: updatedRoom?.images ?? data.images,
        };

        if (idx >= 0) rooms[idx] = mergedRoom; else rooms.push(mergedRoom);

        return {
          ...svc,
          details: {
            ...svc.details,
            rooms,
            totalRooms: svc.details.totalRooms ?? rooms.length,
          },
        };
      }));

      const refreshed = services.find(s => s.id === hotelId);
      if (refreshed) {
        const rooms = Array.isArray(refreshed.details.rooms) ? refreshed.details.rooms.map((r: any) => r.id === targetId ? { ...r, ...data, ...updatedRoom } : r) : [];
        const updatedSvc = { ...refreshed, details: { ...refreshed.details, rooms } } as PendingService;
        setSelectedService(updatedSvc);
      }

      setEditFormOpen(false);
      setIsReviewDialogOpen(true);
      toast.success(t('common.saved'));
      return;
    }

    // Hotel/activity/car edit: update only, no auto-approval
    const updated = await updateAsAdmin(serviceType as ServiceType, targetId, data);
    const remapped = mapService(updated, serviceType as ServiceType);

    setServices(prev => prev.map(s => s.id === targetId ? remapped : s));
    setSelectedService(remapped);
    setEditFormOpen(false);
    setIsReviewDialogOpen(true);
    toast.success(t('common.saved'));
  };

  const callByType = async (
    serviceId: string,
    type: ServiceType,
    action: "approve" | "reject" | "revision",
    reason?: string
  ) => {
    if (action === "approve") {
      if (type === "hotel") return hotelApi.approveHotel(serviceId);
      if (type === "activity") return activityApi.approveActivity(serviceId);
      return carRentalApi.approveCar(serviceId);
    }

    if (action === "revision") {
      if (type === "hotel") return hotelApi.requestRevisionHotel(serviceId, reason);
      if (type === "activity") return activityApi.requestRevisionActivity(serviceId, reason);
      return carRentalApi.requestRevisionCar(serviceId, reason);
    }

    if (type === "hotel") return hotelApi.rejectHotel(serviceId, reason);
    if (type === "activity") return activityApi.rejectActivity(serviceId, reason);
    return carRentalApi.rejectCar(serviceId, reason);
  };

  const handleApprove = async (serviceId: string, edits?: any) => {
    const svc = services.find(s => s.id === serviceId);
    if (!svc) return;
    await withActionBusy(serviceId, async () => {
      try {
        if (edits && Object.keys(edits).length > 0) {
          await vendorApi.updateService(svc.type, serviceId, edits);
        }
        await callByType(serviceId, svc.type, "approve");
        setServiceLocally(serviceId, (s) => ({ ...s, status: "approved", adminNote: undefined }));
        toast.success(t('admin.serviceApproved'));
        setIsReviewDialogOpen(false);
      } catch (err: any) {
        toast.error(err?.message || t('common.error'));
      }
    });
  };

  const handleReject = async (serviceId: string, reason: string, asRevision = false) => {
    const svc = services.find(s => s.id === serviceId);
    if (!svc) return;
    await withActionBusy(serviceId, async () => {
      try {
        await callByType(serviceId, svc.type, asRevision ? "revision" : "reject", reason);
        const nextStatus: ServiceStatus = asRevision ? "needs_revision" : "rejected";
        setServiceLocally(serviceId, (s) => ({ ...s, status: nextStatus, adminNote: reason }));
        toast[asRevision ? 'info' : 'error'](asRevision ? t('admin.revisionRequested') : t('admin.serviceRejected'));
        setIsReviewDialogOpen(false);
      } catch (err: any) {
        toast.error(err?.message || t('common.error'));
      }
    });
  };

  const handleAdminFormSuccess = () => {
    setEditFormOpen(false);
    setEditFormData(null);
    // Keep quiet; handleAdminEditSubmit manages UX
  };

  const handleRequestRevision = async (serviceId: string, note: string) => {
    await handleReject(serviceId, note, true);
  };

  return (
    <AdminLayout currentPage="admin-pending-services" onNavigate={onNavigate} activePage="admin-pending-services">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('admin.approveServices')}</h1>
          <p className="text-gray-600">
            {t('admin.approveServicesDesc')}
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
                placeholder={t('admin.searchServiceOrVendor')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {[{ label: t('common.all'), value: "all" }, { label: t('common.hotels'), value: "hotel" }, { label: t('common.activities'), value: "activity" }, { label: t('admin.carRental'), value: "car" }].map(opt => (
                <Button
                  key={opt.value}
                  variant={typeFilter === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTypeFilter(opt.value as any);
                    setPage(0);
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Filter className="w-4 h-4" />
                {t('common.sort') || 'Sắp xếp'}
              </span>
              {[{ label: 'Mới nhất', value: 'newest' }, { label: 'Cũ nhất', value: 'oldest' }].map(opt => (
                <Button
                  key={opt.value}
                  variant={timeSort === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeSort(opt.value as "newest" | "oldest")}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                {t('admin.pending')} ({services.filter(s => s.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="needs_revision" className="gap-2">
                <Edit className="w-4 h-4" />
                {t('admin.needsRevision')}
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('admin.approved')}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="w-4 h-4" />
                {t('admin.rejected')}
              </TabsTrigger>
              <TabsTrigger value="all">
                {t('common.all')} ({services.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading && (
                <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedServices.map((service) => {
                  const statusConfig = getStatusConfig(service.status);
                  const StatusIcon = statusConfig.icon;

                  const metaChips = () => {
                    if (service.type === "hotel") {
                      return [
                        service.details.star && `${service.details.star}★`,
                        service.details.totalRooms ? `${service.details.totalRooms} phòng` : undefined,
                        service.details.address,
                        service.details.city,
                        service.details.country,
                      ].filter(Boolean);
                    }
                    if (service.type === "activity") {
                      return [service.details.duration, service.details.category, service.details.meetingPoint, service.details.city, service.details.country].filter(Boolean);
                    }
                    return [
                      [service.details.brand, service.details.model].filter(Boolean).join(" ") || undefined,
                      service.details.seats ? `${service.details.seats} chỗ` : undefined,
                      service.details.transmission,
                      service.details.fuel,
                      service.details.city,
                    ].filter(Boolean);
                  };

                  return (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={service.images[0]}
                          alt={service.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
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
                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                          <Badge variant="secondary">{t('admin.vendor')}</Badge>
                          <span className="text-gray-800">{vendorNames[service.vendorId] || service.vendorName || service.vendorId}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {service.description || "—"}
                        </p>

                        {metaChips().length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-4">
                            {metaChips().map((chip, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 rounded inline-flex items-center gap-1">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t mb-4">
                          <div>
                            <p className="text-xs text-gray-600">{t('common.price')}</p>
                            <p className="text-lg text-blue-600">
                              {service.price ? `${(service.price / 1000000).toFixed(1)}M` : "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">{t('admin.submittedAt')}</p>
                            <p className="text-sm text-gray-900">{formatDateValue(service.submittedAt)}</p>
                          </div>
                        </div>

                        <Button
                          className="w-full gap-2"
                          onClick={() => handleReview(service)}
                          variant={service.status === "pending" ? "default" : "outline"}
                          disabled={actionBusyIds.has(service.id)}
                        >
                          <Eye className="w-4 h-4" />
                          {service.status === "pending" ? t('admin.reviewAndApprove') : t('common.viewDetails')}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredServices.length > 0 && totalPages > 1 && (
                <div className="flex flex-col gap-2 mt-6">
                  <div className="text-sm text-gray-600">
                    Page {page + 1} / {totalPages} · {filteredServices.length} items
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPage((p) => Math.max(0, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={page === 0 || loading}
                    >
                      {t('common.previous') || 'Trước'}
                    </Button>

                    {paginationRange.map((item, idx) => {
                      if (typeof item === 'string') {
                        return (
                          <span key={item + idx} className="px-2 text-gray-500 select-none">...</span>
                        );
                      }
                      const pageIndex = item - 1;
                      const isActive = pageIndex === page;
                      return (
                        <Button
                          key={item}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className={isActive ? "bg-blue-600 text-white" : ""}
                          disabled={loading}
                          onClick={() => {
                            setPage(pageIndex);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {item}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPage((p) => Math.min(totalPages - 1, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={page + 1 >= totalPages || loading}
                    >
                      {t('common.next') || 'Tiếp theo'}
                    </Button>
                  </div>
                </div>
              )}

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('admin.noServicesFound')}</p>
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
        onOpenEditForm={(svc, room) => {
          const source = services.find(s => s.id === svc.id);
          if (!source) return;
          if (room) {
            openRoomEditForm(source, room);
          } else {
            openEditForm(source);
          }
        }}
      />

      <AddServiceDialog
        open={editFormOpen}
        onOpenChange={setEditFormOpen}
        onSuccess={handleAdminFormSuccess}
        onSubmit={handleAdminEditSubmit}
        editingService={editFormData || undefined}
        defaultType={editFormType}
        allowTypeChange={false}
        title="Chỉnh sửa dịch vụ"
        description="Sử dụng cùng biểu mẫu như Vendor, sau đó bấm Lưu & Phê duyệt"
        submitLabel="Lưu & Phê duyệt"
      />
    </AdminLayout>
  );
}
