import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { locationApi, vendorApi } from "../../utils/api";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface HotelWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void;
  editingHotelId?: string;
}

interface RoomPayload {
  id?: string;
  name: string;
  type: string;
  maxOccupancy: number;
  bedType?: string;
  description?: string;
  amenities: string[];
  basePrice: number;
  originalPrice?: number;
  size?: number;
  cancellationPolicy?: string;
  breakfastIncluded?: boolean;
  status?: string;
  totalRooms?: number;
  availableRooms?: number;
  images: { url: string; caption: string; order: number }[];
  options?: RoomOptionPayload[];
}

interface RoomOptionPayload {
  id?: string;
  name?: string;
  bedType?: string;
  breakfast?: boolean;
  cancellation?: boolean;
  price?: number;
  originalPrice?: number;
  roomsLeft?: number;
  earnPoints?: number;
}

const hotelTypes = [
  "HOTEL",
  "RESORT",
  "VILLA",
  "APARTMENT",
  "HOSTEL",
  "MOTEL",
  "GUEST_HOUSE",
];

const roomTypes = ["SINGLE", "DOUBLE", "SUITE", "FAMILY"];
const cancellationPolicies = ["FLEXIBLE", "MODERATE", "STRICT"];

function StepIndicator({ step, current, label }: { step: number; current: number; label: string }) {
  const isActive = step === current;
  const isDone = step < current;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border ${
          isDone ? "bg-green-100 text-green-700 border-green-200" : isActive ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-500 border-gray-200"
        }`}
      >
        {isDone ? "✓" : step}
      </div>
      <span className={`text-sm ${isActive ? "text-gray-900" : "text-gray-600"}`}>{label}</span>
    </div>
  );
}

function RoomModal({
  open,
  onClose,
  hotelId,
  onSaved,
  editingRoom,
}: {
  open: boolean;
  onClose: () => void;
  hotelId: string;
  onSaved: (room: RoomPayload) => void;
  editingRoom?: RoomPayload | null;
}) {
  type OptionForm = {
    tempId: string;
    id?: string;
    name: string;
    bedType: string;
    breakfast: string;
    cancellation: string;
    price: string;
    originalPrice: string;
    roomsLeft: string;
    earnPoints: string;
  };

  const makeTempId = () => `opt-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const toOptionForm = (opt?: RoomOptionPayload): OptionForm => ({
    tempId: opt?.id || makeTempId(),
    id: opt?.id,
    name: opt?.name || "",
    bedType: opt?.bedType || "",
    breakfast: opt?.breakfast ? "yes" : "no",
    cancellation: opt?.cancellation ? "yes" : "no",
    price: opt?.price !== undefined && opt?.price !== null ? String(opt.price) : "",
    originalPrice:
      opt?.originalPrice !== undefined && opt?.originalPrice !== null ? String(opt.originalPrice) : "",
    roomsLeft: opt?.roomsLeft !== undefined && opt?.roomsLeft !== null ? String(opt.roomsLeft) : "",
    earnPoints: opt?.earnPoints !== undefined && opt?.earnPoints !== null ? String(opt.earnPoints) : "",
  });

  const empty = {
    name: "",
    type: "SINGLE",
    maxOccupancy: "2",
    bedType: "",
    description: "",
    amenities: "",
    basePrice: "",
    originalPrice: "",
    size: "",
    cancellationPolicy: "FLEXIBLE",
    breakfastIncluded: "no",
    totalRooms: "",
    availableRooms: "",
    images: [] as string[],
    options: [] as OptionForm[],
  };
  const [form, setForm] = useState(empty);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setImageUrl("");
      if (editingRoom) {
        setForm({
          name: editingRoom.name,
          type: editingRoom.type,
          maxOccupancy: editingRoom.maxOccupancy?.toString() || "2",
          bedType: editingRoom.bedType || "",
          description: editingRoom.description || "",
          amenities: (editingRoom.amenities || []).join(", "),
          basePrice: editingRoom.basePrice?.toString() || "",
          originalPrice: editingRoom.originalPrice?.toString() || "",
          size: editingRoom.size?.toString() || "",
          cancellationPolicy: editingRoom.cancellationPolicy || "FLEXIBLE",
          breakfastIncluded: editingRoom.breakfastIncluded ? "yes" : "no",
          totalRooms: editingRoom.totalRooms?.toString() || "",
          availableRooms: editingRoom.availableRooms?.toString() || "",
          images: (editingRoom.images || []).map((img) => (typeof img === "string" ? img : img.url)),
          options: (editingRoom.options || []).map((opt) => toOptionForm(opt)),
        });
      } else {
        setForm(empty);
      }
    }
  }, [open, editingRoom]);

  const parseCommaList = (value: string) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleAddImage = () => {
    if (!imageUrl) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
    setImageUrl("");
  };

  const handleAddOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, toOptionForm()] }));
  };

  const updateOption = (index: number, key: keyof OptionForm, value: string) => {
    setForm((prev) => {
      const next = [...prev.options];
      next[index] = { ...next[index], [key]: value } as OptionForm;
      return { ...prev, options: next };
    });
  };

  const removeOption = (index: number) => {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));
  };

  const submit = async () => {
    if (!form.name || !form.basePrice || !form.maxOccupancy) {
      toast.error("Điền đầy đủ tên, sức chứa và giá phòng");
      return;
    }

    const optionsPayload = (form.options || []).map((opt) => ({
      id: opt.id,
      name: opt.name || undefined,
      bedType: opt.bedType || undefined,
      breakfast: opt.breakfast === "yes",
      cancellation: opt.cancellation === "yes",
      price: opt.price ? Number(opt.price) : undefined,
      originalPrice: opt.originalPrice ? Number(opt.originalPrice) : undefined,
      roomsLeft: opt.roomsLeft ? Number(opt.roomsLeft) : undefined,
      earnPoints: opt.earnPoints ? Number(opt.earnPoints) : undefined,
    }));

    const payload = {
      hotelId,
      name: form.name,
      type: form.type,
      maxOccupancy: Number(form.maxOccupancy),
      bedType: form.bedType || undefined,
      description: form.description,
      amenities: parseCommaList(form.amenities),
      images: form.images.map((url, idx) => ({ url, caption: "", order: idx })),
      basePrice: Number(form.basePrice),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      size: form.size ? Number(form.size) : undefined,
      cancellationPolicy: form.cancellationPolicy || undefined,
      breakfastIncluded: form.breakfastIncluded === "yes",
      totalRooms: form.totalRooms ? Number(form.totalRooms) : undefined,
      availableRooms: form.availableRooms ? Number(form.availableRooms) : form.totalRooms ? Number(form.totalRooms) : undefined,
      status: "PENDING_REVIEW",
      options: optionsPayload,
    };

    try {
      setSubmitting(true);
      if (editingRoom?.id) {
        await vendorApi.updateService("rooms", editingRoom.id, payload);
        onSaved({ ...payload, id: editingRoom.id });
        toast.success("Đã cập nhật phòng");
      } else {
        const created = await vendorApi.createService("rooms", payload);
        onSaved({ ...payload, id: created?.id });
        toast.success("Đã thêm phòng");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Không thể thêm phòng");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng"}</DialogTitle>
          <DialogDescription>Điền thông tin phòng thuộc khách sạn đã tạo.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Tên phòng</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Loại phòng</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((rt) => (
                  <SelectItem key={rt} value={rt}>
                    {rt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Sức chứa</Label>
            <Input
              type="number"
              value={form.maxOccupancy}
              onChange={(e) => setForm({ ...form, maxOccupancy: e.target.value })}
            />
          </div>
          <div>
            <Label>Loại giường</Label>
            <Input value={form.bedType} onChange={(e) => setForm({ ...form, bedType: e.target.value })} />
          </div>
          <div>
            <Label>Giá/đêm (VND)</Label>
            <Input
              type="number"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            />
          </div>
          <div>
            <Label>Giá gốc (nếu đang giảm)</Label>
            <Input
              type="number"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            />
          </div>
          <div>
            <Label>Diện tích (m²)</Label>
            <Input
              type="number"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />
          </div>
          <div>
            <Label>Tổng phòng</Label>
            <Input
              type="number"
              value={form.totalRooms}
              onChange={(e) => setForm({ ...form, totalRooms: e.target.value })}
            />
          </div>
          <div>
            <Label>Phòng trống</Label>
            <Input
              type="number"
              value={form.availableRooms}
              onChange={(e) => setForm({ ...form, availableRooms: e.target.value })}
            />
          </div>
          <div>
            <Label>Chính sách hủy</Label>
            <Select value={form.cancellationPolicy} onValueChange={(v) => setForm({ ...form, cancellationPolicy: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cancellationPolicies.map((cp) => (
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
              value={form.breakfastIncluded}
              onValueChange={(v) => setForm({ ...form, breakfastIncluded: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Có</SelectItem>
                <SelectItem value="no">Không</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Option giá phòng (có thể thêm nhiều)</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="gap-1">
                <Plus className="w-4 h-4" /> Thêm option
              </Button>
            </div>
            {form.options.length === 0 && (
              <p className="text-sm text-gray-500">Chưa có option nào. Bấm "Thêm option" để bắt đầu.</p>
            )}
            <div className="space-y-3">
              {form.options.map((opt, idx) => (
                <Card key={opt.tempId || idx} className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800">Option {idx + 1}</div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tên option</Label>
                      <Input value={opt.name} onChange={(e) => updateOption(idx, "name", e.target.value)} placeholder="VD: Có bữa sáng" />
                    </div>
                    <div>
                      <Label>Loại giường</Label>
                      <Input value={opt.bedType} onChange={(e) => updateOption(idx, "bedType", e.target.value)} placeholder="Queen / Twin" />
                    </div>
                    <div>
                      <Label>Bao gồm bữa sáng?</Label>
                      <Select value={opt.breakfast} onValueChange={(v) => updateOption(idx, "breakfast", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Có</SelectItem>
                          <SelectItem value="no">Không</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Hủy miễn phí?</Label>
                      <Select value={opt.cancellation} onValueChange={(v) => updateOption(idx, "cancellation", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Có</SelectItem>
                          <SelectItem value="no">Không</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Giá option (VND)</Label>
                      <Input
                        type="number"
                        value={opt.price}
                        onChange={(e) => updateOption(idx, "price", e.target.value)}
                        placeholder="Giá áp dụng cho option"
                      />
                    </div>
                    <div>
                      <Label>Giá gốc (nếu có)</Label>
                      <Input
                        type="number"
                        value={opt.originalPrice}
                        onChange={(e) => updateOption(idx, "originalPrice", e.target.value)}
                        placeholder="Giá trước khuyến mãi"
                      />
                    </div>
                    <div>
                      <Label>Phòng còn lại</Label>
                      <Input
                        type="number"
                        value={opt.roomsLeft}
                        onChange={(e) => updateOption(idx, "roomsLeft", e.target.value)}
                        placeholder="Số phòng cho option này"
                      />
                    </div>
                    <div>
                      <Label>Điểm thưởng</Label>
                      <Input
                        type="number"
                        value={opt.earnPoints}
                        onChange={(e) => updateOption(idx, "earnPoints", e.target.value)}
                        placeholder="Điểm tích lũy"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <Label>Tiện nghi (phẩy)</Label>
            <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Mô tả</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Ảnh (tối đa 5)</Label>
            <div className="flex gap-2">
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL ảnh" />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                Thêm
              </Button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <ImageWithFallback src={img} alt={`img-${idx}`} className="h-24 w-full object-cover rounded" />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-white border rounded-full px-1 text-xs"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button onClick={submit} disabled={submitting}>
            Lưu phòng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HotelWizardDialog({ open, onOpenChange, onCompleted, editingHotelId }: HotelWizardDialogProps) {
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState<any[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomPayload[]>([]);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomPayload | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [savingHotel, setSavingHotel] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const emptyHotel = useMemo(
    () => ({
      name: "",
      description: "",
      locationId: "",
      address: "",
      hotelType: "HOTEL",
      starRating: "",
      phone: "",
      email: "",
      website: "",
      lowestPrice: "",
      amenities: "",
      policyCancellation: "",
      policyPets: "",
      policySmoking: "",
      images: [] as string[],
    }),
    []
  );
  const [hotelForm, setHotelForm] = useState(emptyHotel);

  useEffect(() => {
    if (open) {
      setStep(1);
      setRooms([]);
      setImageUrl("");
      setEditingRoom(null);
      if (editingHotelId) {
        setHotelId(editingHotelId);
        fetchHotel(editingHotelId);
        fetchRooms(editingHotelId);
        setStep(1);
      } else {
        setHotelId(null);
        setHotelForm(emptyHotel);
      }
    }
  }, [open, emptyHotel, editingHotelId]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationApi.getLocationsByType("CITY");
        setLocations(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  const addImage = () => {
    if (!imageUrl) return;
    setHotelForm((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
    setImageUrl("");
  };

  const parseCommaList = (value: string) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const submitHotel = async () => {
    if (!hotelForm.name || !hotelForm.description || !hotelForm.locationId || !hotelForm.address || hotelForm.images.length === 0) {
      toast.error("Điền đủ tên, mô tả, địa điểm, địa chỉ và ít nhất 1 ảnh");
      return;
    }

    const payload = {
      name: hotelForm.name,
      description: hotelForm.description,
      locationId: hotelForm.locationId,
      address: hotelForm.address,
      hotelType: hotelForm.hotelType,
      starRating: hotelForm.starRating ? Number(hotelForm.starRating) : null,
      phone: hotelForm.phone,
      email: hotelForm.email,
      website: hotelForm.website,
      lowestPrice: hotelForm.lowestPrice ? Number(hotelForm.lowestPrice) : undefined,
      amenities: parseCommaList(hotelForm.amenities),
      images: hotelForm.images.map((url, idx) => ({ url, caption: "", order: idx })),
      policies: {
        cancellation: hotelForm.policyCancellation || undefined,
        pets: hotelForm.policyPets === "yes" ? true : hotelForm.policyPets === "no" ? false : undefined,
        smoking: hotelForm.policySmoking === "yes" ? true : hotelForm.policySmoking === "no" ? false : undefined,
      },
    };

    try {
      setSavingHotel(true);
      let targetId = hotelId;
      if (hotelId) {
        await vendorApi.updateService("hotels", hotelId, payload);
        toast.success("Đã cập nhật khách sạn");
      } else {
        const created = await vendorApi.createService("hotels", payload);
        targetId = created?.id;
        setHotelId(created?.id);
        toast.success("Đã lưu khách sạn, thêm phòng tiếp theo");
      }
      setStep(2);
      if (targetId) {
        fetchRooms(targetId);
      }
    } catch (err: any) {
      toast.error(err?.message || "Không thể lưu khách sạn");
    } finally {
      setSavingHotel(false);
    }
  };

  const fetchHotel = async (id: string) => {
    try {
      const data = await vendorApi.getServices("hotels");
      const list = Array.isArray((data as any)?.content)
        ? (data as any).content
        : Array.isArray(data)
          ? data
          : [];
      const hotel = list.find((h: any) => h.id === id);
      if (!hotel) {
        toast.error("Không tìm thấy khách sạn của bạn");
        return;
      }
      setHotelForm({
        name: hotel.name || "",
        description: hotel.description || "",
        locationId: hotel.locationId || hotel.location?.id || "",
        address: hotel.address || "",
        hotelType: hotel.hotelType || "HOTEL",
        starRating: hotel.starRating?.toString() || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        website: hotel.website || "",
        lowestPrice: hotel.lowestPrice?.toString() || "",
        amenities: (hotel.amenities || []).join(", "),
        policyCancellation: hotel.policies?.cancellation || "",
        policyPets: hotel.policies?.pets === true ? "yes" : hotel.policies?.pets === false ? "no" : "",
        policySmoking: hotel.policies?.smoking === true ? "yes" : hotel.policies?.smoking === false ? "no" : "",
        images: (hotel.images || []).map((img: any) => img.url || img),
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Không thể tải khách sạn (cần đăng nhập?)");
    }
  };

  const fetchRooms = async (id: string) => {
    if (!id) return;
    try {
      setLoadingRooms(true);
      const data = await vendorApi.getServices("rooms");
      const list = Array.isArray((data as any)?.content)
        ? (data as any).content
        : Array.isArray(data)
          ? data
          : [];

      const mapped = list
        .filter((r: any) => r.hotelId === id)
        .map((r: any, idx: number) => ({
          id: r.id,
          hotelId: r.hotelId,
          name: r.name,
          type: r.type,
          maxOccupancy: r.maxOccupancy,
          bedType: r.bedType,
          description: r.description,
          amenities: r.amenities || [],
          basePrice: Number(r.basePrice || r.pricePerNight || r.price || 0),
          originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
          size: r.size ? Number(r.size) : undefined,
          cancellationPolicy: r.cancellationPolicy,
          breakfastIncluded: r.breakfastIncluded,
          totalRooms: r.totalRooms,
          availableRooms: r.availableRooms,
          options: (r.options || []).map((opt: any) => ({
            id: opt.id,
            name: opt.name,
            bedType: opt.bedType,
            breakfast: opt.breakfast,
            cancellation: opt.cancellation,
            price: opt.price ? Number(opt.price) : undefined,
            originalPrice: opt.originalPrice ? Number(opt.originalPrice) : undefined,
            roomsLeft: opt.roomsLeft,
            earnPoints: opt.earnPoints,
          })),
          images: (r.images || []).map((img: any, imageIndex: number) => ({
            url: img.url || img,
            caption: img.caption || "",
            order: img.order ?? imageIndex,
          })),
          approvalStatus: r.approvalStatus,
          status: r.status,
        }));
      setRooms(mapped);
    } catch (err) {
      console.error(err);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleRoomSaved = (room: RoomPayload) => {
    setRooms((prev) => {
      const exists = prev.find((r) => r.id === room.id);
      if (exists) {
        return prev.map((r) => (r.id === room.id ? room : r));
      }
      return [...prev, room];
    });
  };

  const finish = () => {
    onOpenChange(false);
    onCompleted();
    toast.success("Đã gửi yêu cầu, admin sẽ duyệt sớm");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đăng ký khách sạn & phòng</DialogTitle>
          <DialogDescription>Hoàn tất 2 bước: tạo khách sạn và thêm phòng. Bấm "Hoàn tất đăng ký" để gửi duyệt.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-6 pb-6 border-b">
          <StepIndicator step={1} current={step} label="Thông tin khách sạn" />
          <div className="h-px flex-1 bg-gray-200" />
          <StepIndicator step={2} current={step} label="Thêm phòng" />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tên khách sạn</Label>
                <Input
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  placeholder="VD: Sunlight Resort Danang"
                />
              </div>
              <div className="col-span-2">
                <Label>Mô tả</Label>
                <Textarea
                  rows={4}
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                  placeholder="Tổng quan, tiện ích, vị trí..."
                />
              </div>
              <div>
                <Label>Địa điểm</Label>
                <Select value={hotelForm.locationId} onValueChange={(v) => setHotelForm({ ...hotelForm, locationId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Địa chỉ</Label>
                <Input
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                  placeholder="Số nhà, đường, quận"
                />
              </div>
              <div>
                <Label>Loại khách sạn</Label>
                <Select value={hotelForm.hotelType} onValueChange={(v) => setHotelForm({ ...hotelForm, hotelType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hotelTypes.map((ht) => (
                      <SelectItem key={ht} value={ht}>
                        {ht}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hạng sao</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={hotelForm.starRating}
                  onChange={(e) => setHotelForm({ ...hotelForm, starRating: e.target.value })}
                  placeholder="4"
                />
              </div>
              <div>
                <Label>Giá thấp nhất (VND/đêm)</Label>
                <Input
                  type="number"
                  value={hotelForm.lowestPrice}
                  onChange={(e) => setHotelForm({ ...hotelForm, lowestPrice: e.target.value })}
                  placeholder="Nhập giá min dự kiến"
                />
              </div>
              <div>
                <Label>Điện thoại</Label>
                <Input value={hotelForm.phone} onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={hotelForm.email} onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Website</Label>
                <Input value={hotelForm.website} onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Tiện nghi (phẩy)</Label>
                <Input
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  placeholder="Wifi, Hồ bơi, Gym"
                />
              </div>
              <div className="col-span-2">
                <Label>Chính sách hủy</Label>
                <Textarea
                  rows={3}
                  value={hotelForm.policyCancellation}
                  onChange={(e) => setHotelForm({ ...hotelForm, policyCancellation: e.target.value })}
                  placeholder="Mô tả điều kiện hủy / hoàn tiền"
                />
              </div>
              <div>
                <Label>Cho phép thú cưng?</Label>
                <Select value={hotelForm.policyPets} onValueChange={(v) => setHotelForm({ ...hotelForm, policyPets: v })}>
                  <SelectTrigger>
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
                <Select
                  value={hotelForm.policySmoking}
                  onValueChange={(v) => setHotelForm({ ...hotelForm, policySmoking: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Có</SelectItem>
                    <SelectItem value="no">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Ảnh khách sạn (tối đa 5)</Label>
                <div className="flex gap-2">
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL ảnh" />
                  <Button type="button" variant="outline" onClick={addImage}>
                    Thêm
                  </Button>
                </div>
                {hotelForm.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {hotelForm.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <ImageWithFallback src={img} alt={`hotel-${idx}`} className="h-24 w-full object-cover rounded" />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white border rounded-full px-1 text-xs"
                          onClick={() =>
                            setHotelForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
                          }
                        >
                          ×
                        </button>
                        {idx === 0 && (
                          <Badge className="absolute bottom-1 left-1">Ảnh đại diện</Badge>
                        )}
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
              <Button onClick={submitHotel} disabled={savingHotel}>
                Lưu & sang bước phòng
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Khách sạn</p>
                <p className="font-semibold text-gray-900">{hotelForm.name}</p>
                {hotelId && <p className="text-xs text-gray-500">ID: {hotelId}</p>}
              </div>
              <Button
                onClick={() => {
                  setEditingRoom(null);
                  setRoomModalOpen(true);
                }}
                disabled={!hotelId}
              >
                Thêm phòng
              </Button>
            </div>

            <Card className="p-4">
              {loadingRooms ? (
                <p className="text-gray-500">Đang tải phòng...</p>
              ) : rooms.length === 0 ? (
                <p className="text-gray-500">Chưa có phòng nào. Bấm "Thêm phòng".</p>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div key={room.id || room.name} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <p className="font-semibold text-gray-900">{room.name}</p>
                        <p className="text-sm text-gray-600">
                          {room.type} • {room.maxOccupancy} khách • {room.basePrice.toLocaleString()} VND/đêm
                        </p>
                        {room.amenities?.length > 0 && (
                          <p className="text-xs text-gray-500 line-clamp-1">{room.amenities.join(", ")}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{room.totalRooms || 0} phòng</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRoom(room);
                            setRoomModalOpen(true);
                          }}
                        >
                          Sửa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Quay lại
              </Button>
              <Button onClick={finish} disabled={!hotelId}>
                Hoàn tất đăng ký
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>

      {hotelId && (
        <RoomModal
          open={roomModalOpen}
          onClose={() => {
            setRoomModalOpen(false);
            setEditingRoom(null);
          }}
          hotelId={hotelId}
          onSaved={handleRoomSaved}
          editingRoom={editingRoom}
        />
      )}
    </Dialog>
  );
}
