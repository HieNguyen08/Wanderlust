import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { locationApi } from "../../utils/api";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

export type ServiceType = "hotel" | "room" | "activity" | "car";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "SUITE", "FAMILY"];
const CANCELLATION_POLICIES = ["FLEXIBLE", "MODERATE", "STRICT"];

export interface EditingService {
  id: string;
  type: ServiceType;
  name?: string;
  description?: string;
  price?: number | string;
  images?: string[];
  locationId?: string;
  address?: string;
  hotelType?: string;
  starRating?: number | string;
  phone?: string;
  email?: string;
  website?: string;
  policyCancellation?: string;
  policyPets?: boolean | string;
  policySmoking?: boolean | string;
  roomType?: string;
  capacity?: number | string;
  amenities?: string[] | string;
  hotelId?: string;
  bedType?: string;
  roomSize?: number | string;
  originalPrice?: number | string;
  cancellationPolicy?: string;
  breakfastIncluded?: boolean;
  totalRooms?: number | string;
  availableRooms?: number | string;
  duration?: string;
  groupSize?: string;
  includes?: string[] | string;
  excludes?: string[] | string;
  itinerary?: string;
  category?: string;
  activityType?: string;
  highlights?: string[] | string;
  languages?: string[] | string;
  meetingPoint?: string;
  ageRestriction?: string;
  minParticipants?: number | string;
  maxParticipants?: number | string;
  cancellationPolicy?: string;
  featured?: boolean;
  brand?: string;
  model?: string;
  seats?: number | string;
  year?: number | string;
  features?: string[] | string;
  fuelPolicy?: string;
  doors?: number | string;
  luggage?: number | string;
  color?: string;
  licensePlate?: string;
  pricePerHour?: number | string;
  withDriver?: boolean | string;
  driverPrice?: number | string;
  deposit?: number | string;
  mileageLimit?: number | string;
  minRentalDays?: number | string;
  deliveryAvailable?: boolean | string;
  deliveryFee?: number | string;
}

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onSubmit: (payload: { serviceType: ServiceType; data: any; id?: string }) => Promise<void>;
  editingService?: EditingService | null;
  defaultType?: ServiceType;
  allowTypeChange?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export function AddServiceDialog({ open, onOpenChange, onSuccess, onSubmit, editingService, defaultType = "hotel", allowTypeChange = true, title, description, submitLabel }: AddServiceDialogProps) {
  const emptyForm = {
    // Common fields
    name: "",
    description: "",
    price: "",
    images: [] as string[],
    locationId: "",
    address: "",
    hotelType: "",
    starRating: "",
    phone: "",
    email: "",
    website: "",
    lowestPrice: "",
    policyCancellation: "",
    policyPets: "",
    policySmoking: "",

    // Hotel specific
    roomType: "SINGLE",
    capacity: "",
    amenities: "",
    hotelId: "",
    bedType: "",
    roomSize: "",
    originalPrice: "",
    cancellationPolicy: "FLEXIBLE",
    breakfastIncluded: "no",
    totalRooms: "",
    availableRooms: "",

    // Activity specific
    duration: "",
    groupSize: "",
    includes: "",
    excludes: "",
    itinerary: "",
    category: "TOUR",
    activityType: "",
    highlights: "",
    languages: "",
    meetingPoint: "",
    ageRestriction: "",
    minParticipants: "",
    maxParticipants: "",
    activityCancellation: "",
    originalActivityPrice: "",
    difficulty: "EASY",

    // Car specific
    brand: "",
    model: "",
    seats: "",
    year: "",
    features: "",
    carType: "SEDAN",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    fuelPolicy: "FULL_TO_FULL",
    availableQuantity: "1",
    carStatus: "PENDING_REVIEW",
    doors: "",
    luggage: "",
    color: "",
    licensePlate: "",
    pricePerHour: "",
    withDriver: "no",
    driverPrice: "",
    deposit: "",
    mileageLimit: "",
    minRentalDays: "",
    deliveryAvailable: "no",
    deliveryFee: "",
  };

  const [serviceType, setServiceType] = useState<ServiceType>(editingService?.type || defaultType);
  const [formData, setFormData] = useState(emptyForm);

  const [activitySchedule, setActivitySchedule] = useState<{ day: number; title: string; activities: string; }[]>([]);

  const [imageUrl, setImageUrl] = useState("");
  const [locations, setLocations] = useState<any[]>([]);

  const toCommaString = (value?: string[] | string) => {
    if (Array.isArray(value)) return value.join(", ");
    return value || "";
  };

  const toNewLineString = (value?: string[] | string) => {
    if (Array.isArray(value)) return value.join("\n");
    return value || "";
  };

  useEffect(() => {
    if (!editingService) return;
    setServiceType(editingService.type);
    setFormData((prev) => ({
      ...prev,
      name: editingService.name || "",
      description: editingService.description || "",
      price: editingService.price?.toString() || "",
      images: editingService.images || [],
      locationId: editingService.locationId || "",
      address: editingService.address || "",
      hotelType: editingService.hotelType || "",
      starRating: editingService.starRating?.toString() || "",
      phone: editingService.phone || "",
      email: editingService.email || "",
      website: editingService.website || "",
      lowestPrice: (editingService as any)?.lowestPrice?.toString?.() || "",
      policyCancellation: (editingService as any)?.policies?.cancellation || editingService.policyCancellation || "",
      policyPets:
        typeof editingService.policyPets === "boolean"
          ? editingService.policyPets
            ? "yes"
            : "no"
          : (editingService as any)?.policies?.pets === true
            ? "yes"
            : (editingService as any)?.policies?.pets === false
              ? "no"
              : "",
      policySmoking:
        typeof editingService.policySmoking === "boolean"
          ? editingService.policySmoking
            ? "yes"
            : "no"
          : (editingService as any)?.policies?.smoking === true
            ? "yes"
            : (editingService as any)?.policies?.smoking === false
              ? "no"
              : "",
      roomType: editingService.roomType || "",
      capacity: editingService.capacity?.toString() || "",
      amenities: toCommaString(editingService.amenities),
      hotelId: editingService.hotelId || "",
      bedType: editingService.bedType || "",
      roomSize: editingService.roomSize?.toString() || "",
      originalPrice: editingService.originalPrice?.toString() || "",
      cancellationPolicy: editingService.cancellationPolicy || "FLEXIBLE",
      breakfastIncluded: editingService.breakfastIncluded ? "yes" : "no",
      totalRooms: editingService.totalRooms?.toString() || "",
      availableRooms: editingService.availableRooms?.toString() || "",
      duration: editingService.duration || "",
      groupSize: editingService.groupSize || "",
      includes: toNewLineString(editingService.includes),
      excludes: toNewLineString(editingService.excludes),
      itinerary: editingService.itinerary || "",
      category: (editingService as any)?.category || "TOUR",
      activityType: (editingService as any)?.type || "",
      highlights: toCommaString((editingService as any)?.highlights),
      languages: toCommaString((editingService as any)?.languages),
      meetingPoint: (editingService as any)?.meetingPoint || "",
      ageRestriction: (editingService as any)?.ageRestriction || "",
      minParticipants: (editingService as any)?.minParticipants?.toString?.() || "",
      maxParticipants: (editingService as any)?.maxParticipants?.toString?.() || "",
      activityCancellation: (editingService as any)?.cancellationPolicy || "",
      originalActivityPrice: (editingService as any)?.originalPrice?.toString?.() || "",
      difficulty: (editingService as any)?.difficulty || "EASY",
      brand: editingService.brand || "",
      model: editingService.model || "",
      seats: editingService.seats?.toString() || "",
      year: editingService.year?.toString() || "",
      features: toCommaString(editingService.features),
      carType: (editingService as any)?.carType || "SEDAN",
      transmission: (editingService as any)?.transmission || "AUTOMATIC",
      fuelType: (editingService as any)?.fuelType || "PETROL",
      fuelPolicy: (editingService as any)?.fuelPolicy || "FULL_TO_FULL",
      availableQuantity: (editingService as any)?.availableQuantity?.toString() || "1",
      carStatus: (editingService as any)?.status || "PENDING_REVIEW",
      doors: (editingService as any)?.doors?.toString?.() || "",
      luggage: (editingService as any)?.luggage?.toString?.() || "",
      color: (editingService as any)?.color || "",
      licensePlate: (editingService as any)?.licensePlate || "",
      pricePerHour: (editingService as any)?.pricePerHour?.toString?.() || "",
      withDriver:
        typeof (editingService as any)?.withDriver === "boolean"
          ? (editingService as any).withDriver
            ? "yes"
            : "no"
          : "no",
      driverPrice: (editingService as any)?.driverPrice?.toString?.() || "",
      deposit: (editingService as any)?.deposit?.toString?.() || "",
      mileageLimit: (editingService as any)?.mileageLimit?.toString?.() || "",
      minRentalDays: (editingService as any)?.minRentalDays?.toString?.() || "",
      deliveryAvailable:
        typeof (editingService as any)?.deliveryAvailable === "boolean"
          ? (editingService as any).deliveryAvailable
            ? "yes"
            : "no"
          : "no",
      deliveryFee: (editingService as any)?.deliveryFee?.toString?.() || "",
    }));
    setActivitySchedule([]);
  }, [editingService]);

  useEffect(() => {
    if (open && !editingService) {
      setServiceType(defaultType);
      setFormData(emptyForm);
      setImageUrl("");
      setActivitySchedule([]);
    }
  }, [open, editingService, defaultType]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationApi.getLocationsByType('CITY');
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleAddImage = () => {
    if (imageUrl && formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl("");
    } else if (formData.images.length >= 5) {
      toast.error("Tối đa 5 ảnh");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const parseCommaList = (value: string) => value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const parseNewLineList = (value: string) => value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);

  const addActivitySession = () => {
    setActivitySchedule((prev) => [...prev, { day: prev.length + 1, title: "", activities: "" }]);
  };

  const updateActivitySession = (index: number, key: "day" | "title" | "activities", value: string) => {
    setActivitySchedule((prev) => prev.map((item, idx) => (idx === index ? { ...item, [key]: key === "day" ? Number(value) : value } : item)));
  };

  const removeActivitySession = (index: number) => {
    setActivitySchedule((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || formData.images.length === 0) {
      toast.error("Vui lòng điền tên, mô tả và ít nhất 1 ảnh");
      return;
    }

    const images = formData.images.map((url, index) => ({ url, caption: "", order: index }));

    const buildHotelPayload = () => {
      if (!formData.locationId || !formData.address || !formData.hotelType) {
        toast.error("Vui lòng chọn địa điểm, địa chỉ và loại khách sạn");
        return null;
      }
      return {
        name: formData.name,
        description: formData.description,
        locationId: formData.locationId,
        address: formData.address,
        hotelType: formData.hotelType,
        starRating: formData.starRating ? Number(formData.starRating) : null,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        lowestPrice: formData.lowestPrice ? Number(formData.lowestPrice) : undefined,
        amenities: parseCommaList(formData.amenities),
        images,
        policies: {
          cancellation: formData.policyCancellation || undefined,
          pets: formData.policyPets === "yes" ? true : formData.policyPets === "no" ? false : undefined,
          smoking: formData.policySmoking === "yes" ? true : formData.policySmoking === "no" ? false : undefined,
        },
      };
    };

    const buildRoomPayload = () => {
      if (!formData.hotelId || !formData.roomType || !formData.capacity || !formData.price) {
        toast.error("Vui lòng nhập khách sạn, loại phòng, sức chứa và giá");
        return null;
      }
      const totalRooms = formData.totalRooms ? Number(formData.totalRooms) : undefined;
      const availableRooms = formData.availableRooms ? Number(formData.availableRooms) : totalRooms;
      return {
        hotelId: formData.hotelId,
        name: formData.name,
        type: formData.roomType,
        maxOccupancy: Number(formData.capacity),
        bedType: formData.bedType,
        description: formData.description,
        amenities: parseCommaList(formData.amenities),
        images,
        basePrice: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        size: formData.roomSize ? Number(formData.roomSize) : undefined,
        cancellationPolicy: formData.cancellationPolicy || undefined,
        breakfastIncluded: formData.breakfastIncluded === "yes",
        totalRooms,
        availableRooms,
        status: "PENDING_REVIEW",
      };
    };

    const buildActivityPayload = () => {
      if (!formData.locationId || !formData.price || !formData.category) {
        toast.error("Vui lòng chọn địa điểm, danh mục và giá");
        return null;
      }
      const schedule = activitySchedule.map((item, index) => ({
        day: item.day || index + 1,
        title: item.title,
        activities: parseNewLineList(item.activities),
      }));
      return {
        name: formData.name,
        description: formData.description,
        locationId: formData.locationId,
        category: formData.category,
        type: formData.activityType || undefined,
        duration: formData.duration,
        minParticipants: formData.minParticipants
          ? Number(formData.minParticipants)
          : formData.groupSize
            ? Number(formData.groupSize)
            : undefined,
        maxParticipants: formData.maxParticipants
          ? Number(formData.maxParticipants)
          : formData.groupSize
            ? Number(formData.groupSize)
            : undefined,
        included: parseNewLineList(formData.includes),
        notIncluded: parseNewLineList(formData.excludes),
        highlights: parseCommaList(formData.highlights),
        languages: parseCommaList(formData.languages),
        meetingPoint: formData.meetingPoint || undefined,
        ageRestriction: formData.ageRestriction || undefined,
        difficulty: formData.difficulty || undefined,
        cancellationPolicy: formData.activityCancellation || undefined,
        price: Number(formData.price),
        originalPrice: formData.originalActivityPrice ? Number(formData.originalActivityPrice) : undefined,
        images,
        schedule,
      };
    };

    const buildCarPayload = () => {
      if (!formData.locationId || !formData.brand || !formData.model || !formData.price) {
        toast.error("Vui lòng nhập địa điểm, hãng xe, dòng xe và giá");
        return null;
      }
      return {
        locationId: formData.locationId,
        brand: formData.brand,
        model: formData.model,
        year: formData.year ? Number(formData.year) : undefined,
        type: formData.carType || "SEDAN",
        transmission: formData.transmission || "AUTOMATIC",
        fuelType: formData.fuelType || "PETROL",
        fuelPolicy: formData.fuelPolicy || "FULL_TO_FULL",
        seats: formData.seats ? Number(formData.seats) : undefined,
        doors: formData.doors ? Number(formData.doors) : undefined,
        luggage: formData.luggage ? Number(formData.luggage) : undefined,
        color: formData.color || undefined,
        licensePlate: formData.licensePlate || undefined,
        images,
        features: parseCommaList(formData.features),
        pricePerDay: Number(formData.price),
        pricePerHour: formData.pricePerHour ? Number(formData.pricePerHour) : undefined,
        withDriver: formData.withDriver === "yes",
        driverPrice: formData.driverPrice ? Number(formData.driverPrice) : undefined,
        deposit: formData.deposit ? Number(formData.deposit) : undefined,
        mileageLimit: formData.mileageLimit ? Number(formData.mileageLimit) : undefined,
        minRentalDays: formData.minRentalDays ? Number(formData.minRentalDays) : undefined,
        deliveryAvailable: formData.deliveryAvailable === "yes",
        deliveryFee: formData.deliveryFee ? Number(formData.deliveryFee) : undefined,
        availableQuantity: formData.availableQuantity ? Number(formData.availableQuantity) : 1,
        status: formData.carStatus || "PENDING_REVIEW",
      };
    };

    let payload: any = null;
    if (serviceType === "hotel") payload = buildHotelPayload();
    else if (serviceType === "room") payload = buildRoomPayload();
    else if (serviceType === "activity") payload = buildActivityPayload();
    else if (serviceType === "car") payload = buildCarPayload();

    if (!payload) return;

    try {
      await onSubmit({ serviceType, data: payload, id: editingService?.id });
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Không thể gửi yêu cầu, vui lòng thử lại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || "Thêm dịch vụ mới"}</DialogTitle>
          <DialogDescription>
            {description || "Điền đầy đủ thông tin dịch vụ. Admin sẽ duyệt trong 1-2 ngày làm việc."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Type Selection */}
          {allowTypeChange && (
            <div>
              <Label>Loại dịch vụ <span className="text-red-600">*</span></Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)} disabled={!!editingService}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Khách sạn / Phòng</SelectItem>
                  <SelectItem value="room">Phòng (thuộc khách sạn)</SelectItem>
                  <SelectItem value="activity">Hoạt động / Tour</SelectItem>
                  <SelectItem value="car">Thuê xe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location Selection */}
          <div>
            <Label>Địa điểm <span className="text-red-600">*</span></Label>
            <Select value={formData.locationId} onValueChange={(v) => setFormData({ ...formData, locationId: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={serviceType} className="w-full">
            {/* Hotel Form */}
            <TabsContent value="hotel" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Tên khách sạn <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Sunlight Resort Danang"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Địa chỉ <span className="text-red-600">*</span></Label>
                  <Input
                    id="address"
                    placeholder="Số nhà, đường, quận/huyện"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="hotelType">Loại khách sạn <span className="text-red-600">*</span></Label>
                  <Select value={formData.hotelType} onValueChange={(v) => setFormData({ ...formData, hotelType: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOTEL">Hotel</SelectItem>
                      <SelectItem value="RESORT">Resort</SelectItem>
                      <SelectItem value="VILLA">Villa</SelectItem>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="HOSTEL">Hostel</SelectItem>
                      <SelectItem value="MOTEL">Motel</SelectItem>
                      <SelectItem value="GUEST_HOUSE">Guest House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="starRating">Hạng sao</Label>
                  <Input
                    id="starRating"
                    type="number"
                    min={1}
                    max={5}
                    placeholder="4"
                    value={formData.starRating}
                    onChange={(e) => setFormData({ ...formData, starRating: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lowestPrice">Giá thấp nhất (VND/đêm)</Label>
                  <Input
                    id="lowestPrice"
                    type="number"
                    placeholder="Nhập giá min dự kiến"
                    value={formData.lowestPrice}
                    onChange={(e) => setFormData({ ...formData, lowestPrice: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    placeholder="(+84)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="booking@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="amenities">Tiện nghi <span className="text-red-600">*</span></Label>
                  <Input
                    id="amenities"
                    placeholder="VD: WiFi miễn phí, TV, Điều hòa, Mini bar, Bồn tắm"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ngăn cách bằng dấu phẩy</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về phòng, view, diện tích, v.v..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="policyCancellation">Chính sách hủy</Label>
                  <Textarea
                    id="policyCancellation"
                    placeholder="Mô tả điều kiện hủy / hoàn tiền"
                    value={formData.policyCancellation}
                    onChange={(e) => setFormData({ ...formData, policyCancellation: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Cho phép thú cưng?</Label>
                  <Select value={formData.policyPets} onValueChange={(v) => setFormData({ ...formData, policyPets: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Có</SelectItem>
                      <SelectItem value="no">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cho phép hút thuốc?</Label>
                  <Select value={formData.policySmoking} onValueChange={(v) => setFormData({ ...formData, policySmoking: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Có</SelectItem>
                      <SelectItem value="no">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Room Form */}
            <TabsContent value="room" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="hotelId">Thuộc khách sạn (ID) <span className="text-red-600">*</span></Label>
                  <Input
                    id="hotelId"
                    placeholder="Nhập ID khách sạn"
                    value={formData.hotelId}
                    onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="name">Tên phòng <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Deluxe Ocean View Room"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="roomType">Loại phòng <span className="text-red-600">*</span></Label>
                  <Select value={formData.roomType} onValueChange={(v) => setFormData({ ...formData, roomType: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((rt) => (
                        <SelectItem key={rt} value={rt}>
                          {rt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Sức chứa (người) <span className="text-red-600">*</span></Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="2"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bedType">Loại giường</Label>
                  <Input
                    id="bedType"
                    placeholder="VD: Queen, King"
                    value={formData.bedType}
                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Giá/đêm (VND) <span className="text-red-600">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="3500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Giá gốc (nếu đang giảm)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="4200000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="roomSize">Diện tích (m²)</Label>
                  <Input
                    id="roomSize"
                    type="number"
                    placeholder="30"
                    value={formData.roomSize}
                    onChange={(e) => setFormData({ ...formData, roomSize: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Chính sách hủy</Label>
                  <Select
                    value={formData.cancellationPolicy}
                    onValueChange={(v) => setFormData({ ...formData, cancellationPolicy: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCELLATION_POLICIES.map((cp) => (
                        <SelectItem key={cp} value={cp}>
                          {cp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bao gồm bữa sáng?</Label>
                  <Select
                    value={formData.breakfastIncluded}
                    onValueChange={(v) => setFormData({ ...formData, breakfastIncluded: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Có</SelectItem>
                      <SelectItem value="no">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="totalRooms">Tổng số phòng</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    placeholder="10"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="availableRooms">Số phòng còn trống</Label>
                  <Input
                    id="availableRooms"
                    type="number"
                    placeholder="10"
                    value={formData.availableRooms}
                    onChange={(e) => setFormData({ ...formData, availableRooms: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="amenities">Tiện nghi <span className="text-red-600">*</span></Label>
                  <Input
                    id="amenities"
                    placeholder="VD: WiFi miễn phí, TV, Điều hòa"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ngăn cách bằng dấu phẩy</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về phòng, view, diện tích, v.v..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Activity Form */}
            <TabsContent value="activity" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Tên hoạt động / Tour <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Tour Hướng đạo sinh Phú Quốc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Danh mục <span className="text-red-600">*</span></Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOUR">Tour</SelectItem>
                      <SelectItem value="ADVENTURE">Phiêu lưu</SelectItem>
                      <SelectItem value="CULTURE">Văn hóa</SelectItem>
                      <SelectItem value="FOOD">Ẩm thực</SelectItem>
                      <SelectItem value="ENTERTAINMENT">Giải trí</SelectItem>
                      <SelectItem value="RELAXATION">Nghỉ dưỡng</SelectItem>
                      <SelectItem value="ATTRACTION">Tham quan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Thời gian <span className="text-red-600">*</span></Label>
                  <Input
                    id="duration"
                    placeholder="VD: 1 ngày, 3 giờ, 2 ngày 1 đêm"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="activityType">Loại hình</Label>
                  <Input
                    id="activityType"
                    placeholder="City tour, water sport..."
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Khách tối thiểu</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={formData.minParticipants}
                    onChange={(e) => setFormData({ ...formData, minParticipants: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Khách tối đa</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="price">Giá/người (VND) <span className="text-red-600">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="1500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="originalActivityPrice">Giá gốc (nếu đang giảm)</Label>
                  <Input
                    id="originalActivityPrice"
                    type="number"
                    placeholder="1800000"
                    value={formData.originalActivityPrice}
                    onChange={(e) => setFormData({ ...formData, originalActivityPrice: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả tổng quan <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn gọn về hoạt động này..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Độ khó</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Dễ</SelectItem>
                      <SelectItem value="MODERATE">Trung bình</SelectItem>
                      <SelectItem value="HARD">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="meetingPoint">Điểm hẹn</Label>
                  <Input
                    id="meetingPoint"
                    placeholder="Sảnh khách sạn, điểm đón..."
                    value={formData.meetingPoint}
                    onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ageRestriction">Giới hạn tuổi</Label>
                  <Input
                    id="ageRestriction"
                    placeholder="5+, 12+..."
                    value={formData.ageRestriction}
                    onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="highlights">Điểm nhấn (phẩy)</Label>
                  <Input
                    id="highlights"
                    placeholder="Check-in đồi cát, Ăn hải sản..."
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Ngôn ngữ (phẩy)</Label>
                  <Input
                    id="languages"
                    placeholder="English, Vietnamese"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="itinerary">Lịch trình chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="itinerary"
                    placeholder="8:00 - Đón khách tại khách sạn&#10;9:00 - Khởi hành...&#10;12:00 - Ăn trưa..."
                    value={formData.itinerary}
                    onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="activityCancellation">Chính sách hủy</Label>
                  <Textarea
                    id="activityCancellation"
                    placeholder="Miễn phí hủy trước 48h..."
                    value={formData.activityCancellation}
                    onChange={(e) => setFormData({ ...formData, activityCancellation: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="includes">Bao gồm <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="includes"
                    placeholder="VD: Vé tham quan, Bữa trưa, Hướng dẫn viên, Bảo hiểm"
                    value={formData.includes}
                    onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mỗi dòng là 1 mục</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="excludes">Không bao gồm</Label>
                  <Textarea
                    id="excludes"
                    placeholder="VD: Chi phí cá nhân, Đồ uống ngoài"
                    value={formData.excludes}
                    onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
                    rows={2}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mỗi dòng là 1 mục</p>
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Lịch trình / các phiên</Label>
                    <Button variant="outline" size="sm" type="button" onClick={addActivitySession}>
                      Thêm phiên
                    </Button>
                  </div>
                  {activitySchedule.length === 0 && (
                    <p className="text-xs text-gray-500">Chưa có phiên nào. Bấm "Thêm phiên" để bắt đầu.</p>
                  )}
                  {activitySchedule.map((session, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="w-24">Ngày</Label>
                        <Input
                          type="number"
                          value={session.day}
                          onChange={(e) => updateActivitySession(index, "day", e.target.value)}
                        />
                        <Label className="w-24">Tiêu đề</Label>
                        <Input
                          value={session.title}
                          onChange={(e) => updateActivitySession(index, "title", e.target.value)}
                          placeholder="City tour buổi sáng"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => removeActivitySession(index)}
                        >
                          Xóa
                        </Button>
                      </div>
                      <div>
                        <Label>Hoạt động (mỗi dòng một mục)</Label>
                        <Textarea
                          rows={3}
                          value={session.activities}
                          onChange={(e) => updateActivitySession(index, "activities", e.target.value)}
                          placeholder="08:00 - Đón khách\n09:00 - Tham quan bảo tàng"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Car Form */}
            <TabsContent value="car" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Hãng xe <span className="text-red-600">*</span></Label>
                  <Input
                    id="brand"
                    placeholder="VD: Toyota, Honda, Ford"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Dòng xe <span className="text-red-600">*</span></Label>
                  <Input
                    id="model"
                    placeholder="VD: Fortuner, CR-V, Everest"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="carType">Loại xe</Label>
                  <Select value={formData.carType} onValueChange={(v) => setFormData({ ...formData, carType: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEDAN">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="VAN">Van</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                      <SelectItem value="SPORT">Sport</SelectItem>
                      <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                      <SelectItem value="ELECTRIC">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transmission">Hộp số</Label>
                  <Select value={formData.transmission} onValueChange={(v) => setFormData({ ...formData, transmission: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTOMATIC">Tự động</SelectItem>
                      <SelectItem value="MANUAL">Số sàn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuelType">Nhiên liệu</Label>
                  <Select value={formData.fuelType} onValueChange={(v) => setFormData({ ...formData, fuelType: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETROL">Xăng</SelectItem>
                      <SelectItem value="DIESEL">Dầu</SelectItem>
                      <SelectItem value="ELECTRIC">Điện</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuelPolicy">Chính sách nhiên liệu</Label>
                  <Select value={formData.fuelPolicy} onValueChange={(v) => setFormData({ ...formData, fuelPolicy: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TO_FULL">Nhận đầy, trả đầy</SelectItem>
                      <SelectItem value="SAME_TO_SAME">Nhận sao trả vậy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seats">Số chỗ <span className="text-red-600">*</span></Label>
                  <Select value={formData.seats} onValueChange={(v) => setFormData({ ...formData, seats: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn số chỗ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 chỗ</SelectItem>
                      <SelectItem value="5">5 chỗ</SelectItem>
                      <SelectItem value="7">7 chỗ</SelectItem>
                      <SelectItem value="9">9 chỗ</SelectItem>
                      <SelectItem value="16">16 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="doors">Số cửa</Label>
                  <Input
                    id="doors"
                    type="number"
                    placeholder="4"
                    value={formData.doors}
                    onChange={(e) => setFormData({ ...formData, doors: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="luggage">Hành lý (va-li)</Label>
                  <Input
                    id="luggage"
                    type="number"
                    placeholder="2"
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Năm sản xuất <span className="text-red-600">*</span></Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Màu xe</Label>
                  <Input
                    id="color"
                    placeholder="Đen, trắng..."
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="licensePlate">Biển số</Label>
                  <Input
                    id="licensePlate"
                    placeholder="43A-123.45"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="name">Tên hiển thị <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Toyota Fortuner 7 chỗ 2023"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="availableQuantity">Số xe sẵn sàng</Label>
                  <Input
                    id="availableQuantity"
                    type="number"
                    placeholder="1"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="carStatus">Trạng thái</Label>
                  <Select value={formData.carStatus} onValueChange={(v) => setFormData({ ...formData, carStatus: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING_REVIEW">Chờ duyệt</SelectItem>
                      <SelectItem value="AVAILABLE">Hoạt động</SelectItem>
                      <SelectItem value="PAUSED">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="price">Giá thuê/ngày (VND) <span className="text-red-600">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2000000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerHour">Giá theo giờ (VND)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    placeholder="200000"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Tiền cọc</Label>
                  <Input
                    id="deposit"
                    type="number"
                    placeholder="1000000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="withDriver">Thuê kèm tài xế?</Label>
                  <Select value={formData.withDriver} onValueChange={(v) => setFormData({ ...formData, withDriver: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Không</SelectItem>
                      <SelectItem value="yes">Có</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="driverPrice">Phụ phí tài xế</Label>
                  <Input
                    id="driverPrice"
                    type="number"
                    placeholder="500000"
                    value={formData.driverPrice}
                    onChange={(e) => setFormData({ ...formData, driverPrice: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mileageLimit">Giới hạn km/ngày</Label>
                  <Input
                    id="mileageLimit"
                    type="number"
                    placeholder="200"
                    value={formData.mileageLimit}
                    onChange={(e) => setFormData({ ...formData, mileageLimit: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="minRentalDays">Số ngày thuê tối thiểu</Label>
                  <Input
                    id="minRentalDays"
                    type="number"
                    placeholder="1"
                    value={formData.minRentalDays}
                    onChange={(e) => setFormData({ ...formData, minRentalDays: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAvailable">Giao xe tận nơi?</Label>
                  <Select value={formData.deliveryAvailable} onValueChange={(v) => setFormData({ ...formData, deliveryAvailable: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Không</SelectItem>
                      <SelectItem value="yes">Có</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryFee">Phí giao xe</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    placeholder="100000"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="features">Tính năng xe <span className="text-red-600">*</span></Label>
                  <Input
                    id="features"
                    placeholder="VD: Điều hòa, GPS, Camera lùi, Cửa sổ trời"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ngăn cách bằng dấu phẩy</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả tình trạng xe, chính sách thuê, điều khoản..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Image Upload Section - Common for all types */}
          <div className="space-y-3">
            <Label>Hình ảnh <span className="text-red-600">*</span> (Tối đa 5 ảnh)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập URL hình ảnh từ Unsplash hoặc nguồn khác"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddImage()}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Lưu ý: Ảnh phải rõ nét, chất lượng cao. Ảnh đầu tiên sẽ là ảnh đại diện.
            </p>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <ImageWithFallback
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        Ảnh đại diện
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {submitLabel || "Gửi yêu cầu duyệt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
