import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Clock, CheckCircle2, AlertCircle, XCircle,
  Edit, RefreshCw, Trash2, Eye, DollarSign, MapPin, Star, Phone, Mail, Globe
} from "lucide-react";
import { useEffect, useState } from "react";
import { vendorApi } from "../../utils/api";

interface Service {
  id: string;
  type: "hotel" | "activity" | "car";
  name: string;
  description: string;
  image: string;
  price?: number;
  lowestPrice?: number;
  pricePerHour?: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "PENDING_REVIEW";
  status: "ACTIVE" | "PAUSED" | "PENDING_REVIEW" | "REJECTED";
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

interface ServiceDetailDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (service: Service) => void;
  onResubmit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServiceDetailDialog({
  service,
  isOpen,
  onClose,
  onEdit,
  onResubmit,
  onDelete,
}: ServiceDetailDialogProps) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const getStatusConfig = (approval: Service["approvalStatus"], status: Service["status"]) => {
    if (approval === "REJECTED") {
      return {
        label: "Bị từ chối",
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-200",
        description: "Yêu cầu bị từ chối. Vui lòng xem ghi chú và nộp lại."
      };
    }
    if (approval !== "APPROVED") {
      return {
        label: "Đang chờ duyệt",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        description: "Yêu cầu của bạn đang chờ Admin xem xét và duyệt."
      };
    }
    if (status === "PAUSED") {
      return {
        label: "Tạm dừng",
        icon: AlertCircle,
        className: "bg-orange-100 text-orange-700 border-orange-200",
        description: "Dịch vụ đã duyệt nhưng đang tạm dừng hiển thị."
      };
    }
    if (status === "ACTIVE") {
      return {
        label: "Đã duyệt / Live",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-700 border-green-200",
        description: "Dịch vụ đã được duyệt và đang hiển thị cho khách hàng."
      };
    }
    return {
      label: "Đang chờ kích hoạt",
      icon: Clock,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      description: "Dịch vụ đã duyệt, chờ kích hoạt hoặc thông tin bổ sung."
    };
  };

  const getTypeLabel = (type: Service["type"]) => {
    switch (type) {
      case "hotel": return "Khách sạn";
      case "activity": return "Hoạt động";
      case "car": return "Thuê xe";
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (!isOpen || !service || service.type !== "hotel") return;
      try {
        setLoadingRooms(true);
        const data = await vendorApi.getServices("rooms");
        const list = Array.isArray((data as any)?.content)
          ? (data as any).content
          : Array.isArray(data)
            ? data
            : [];
        const filtered = list.filter((room: any) => room.hotelId === service.id);
        setRooms(filtered);
      } catch (err) {
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [isOpen, service]);

  if (!service) return null;

  const statusConfig = getStatusConfig(service.approvalStatus, service.status);
  const StatusIcon = statusConfig.icon;

  const priceValue = service.price ?? service.lowestPrice;
  const priceLabel = service.type === "hotel"
    ? "Giá thấp nhất (VND/đêm)"
    : service.type === "activity"
      ? "Giá (VND/người)"
      : "Giá thuê/ngày (VND)";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết dịch vụ</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và trạng thái của dịch vụ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <Alert className={`${statusConfig.className} border`}>
            <StatusIcon className="h-5 w-5" />
            <AlertDescription>
              <p className="mb-1">
                <strong>Trạng thái: {statusConfig.label}</strong>
              </p>
              <p className="text-sm">{statusConfig.description}</p>
            </AlertDescription>
          </Alert>

          {/* Admin Note - For needs_revision or rejected */}
          {(service.approvalStatus === "REJECTED" || service.adminNote) && service.adminNote && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                <p className="mb-2">
                  <strong>Ghi chú từ Admin:</strong>
                </p>
                <p className="text-sm whitespace-pre-line">
                  {service.adminNote}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Service Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <ImageWithFallback
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Service Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-gray-100 text-gray-700">{getTypeLabel(service.type)}</Badge>
                  {service.starRating ? (
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                      <Star className="w-4 h-4" />
                      {service.starRating}*
                    </span>
                  ) : null}
                </div>
                <h3 className="text-2xl text-gray-900 leading-snug break-words">{service.name}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                  {service.locationName && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {service.locationName}
                    </span>
                  )}
                  {service.address && (
                    <span className="inline-flex items-center gap-1">{service.address}</span>
                  )}
                  {service.hotelType && (
                    <span className="inline-flex items-center gap-1">{service.hotelType}</span>
                  )}
                  {service.duration && (
                    <span className="inline-flex items-center gap-1">{service.duration}</span>
                  )}
                  {service.seats && (
                    <span className="inline-flex items-center gap-1">{service.seats} chỗ</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">{priceLabel}</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {priceValue !== undefined && priceValue !== null ? `₫${priceValue.toLocaleString()}` : "Chưa có giá"}
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.description}</p>

            {/* Contact & info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-800">
              {service.phone && (
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" />{service.phone}</div>
              )}
              {service.email && (
                <div className="flex items-center gap-2 break-all"><Mail className="w-4 h-4 text-gray-500" />{service.email}</div>
              )}
              {service.website && (
                <div className="flex items-center gap-2 break-all"><Globe className="w-4 h-4 text-gray-500" />{service.website}</div>
              )}
            </div>

            {service.type === "activity" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Thông tin tour</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
                  {service.category && <p><strong>Danh mục:</strong> {service.category}</p>}
                  {service.duration && <p><strong>Thời lượng:</strong> {service.duration}</p>}
                  {service.meetingPoint && <p><strong>Điểm hẹn:</strong> {service.meetingPoint}</p>}
                  {service.ageRestriction && <p><strong>Giới hạn tuổi:</strong> {service.ageRestriction}</p>}
                  {service.cancellationPolicy && <p><strong>Chính sách hủy:</strong> {service.cancellationPolicy}</p>}
                </div>
                {service.languages?.length ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Ngôn ngữ</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                      {service.languages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded">{lang}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {service.highlights?.length ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Điểm nhấn</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                      {service.highlights.map((h, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded">{h}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {service.included?.length ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Bao gồm</p>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
                      {service.included.map((inc, idx) => <li key={idx}>{inc}</li>)}
                    </ul>
                  </div>
                ) : null}
                {service.notIncluded?.length ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Không bao gồm</p>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
                      {service.notIncluded.map((exc, idx) => <li key={idx}>{exc}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {service.type === "hotel" && service.amenities?.length ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Tiện nghi</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  {service.amenities.map((a, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded">{a}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {service.type === "car" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Thông tin xe</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
                  {service.brand && <p><strong>Hãng:</strong> {service.brand}</p>}
                  {service.model && <p><strong>Dòng xe:</strong> {service.model}</p>}
                  {service.year && <p><strong>Năm:</strong> {service.year}</p>}
                  {service.carType && <p><strong>Phân khúc:</strong> {service.carType}</p>}
                  {service.transmission && <p><strong>Hộp số:</strong> {service.transmission}</p>}
                  {service.fuelType && <p><strong>Nhiên liệu:</strong> {service.fuelType}</p>}
                  {service.fuelPolicy && <p><strong>Chính sách nhiên liệu:</strong> {service.fuelPolicy}</p>}
                  {service.color && <p><strong>Màu:</strong> {service.color}</p>}
                  {service.licensePlate && <p><strong>Biển số:</strong> {service.licensePlate}</p>}
                  {service.seats && <p><strong>Ghế:</strong> {service.seats} chỗ</p>}
                  {service.doors && <p><strong>Số cửa:</strong> {service.doors}</p>}
                  {service.luggage && <p><strong>Cốp:</strong> {service.luggage} vali</p>}
                  {service.availableQuantity && <p><strong>Số xe khả dụng:</strong> {service.availableQuantity}</p>}
                  {service.mileageLimit !== undefined && service.mileageLimit !== null && (
                    <p><strong>Giới hạn km/ngày:</strong> {service.mileageLimit || "Không giới hạn"}</p>
                  )}
                  {service.minRentalDays && <p><strong>Số ngày thuê tối thiểu:</strong> {service.minRentalDays}</p>}
                  {service.deposit && <p><strong>Tiền cọc:</strong> ₫{service.deposit.toLocaleString()}</p>}
                  {service.pricePerHour && <p><strong>Giá theo giờ:</strong> ₫{service.pricePerHour.toLocaleString()}</p>}
                  {service.withDriver !== undefined && (
                    <p><strong>Kèm tài xế:</strong> {service.withDriver ? "Có" : "Không"}</p>
                  )}
                  {service.driverPrice && <p><strong>Phụ phí tài xế:</strong> ₫{service.driverPrice.toLocaleString()}</p>}
                  {service.deliveryAvailable !== undefined && (
                    <p><strong>Giao xe tận nơi:</strong> {service.deliveryAvailable ? "Có" : "Không"}</p>
                  )}
                  {service.deliveryFee && <p><strong>Phí giao:</strong> ₫{service.deliveryFee.toLocaleString()}</p>}
                </div>

                {service.features?.length ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Tính năng</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                      {service.features.map((f, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {service.type === "hotel" && service.policies && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Chính sách</p>
                <div className="text-sm text-gray-800 space-y-1">
                  {service.policies.cancellation && <p>Hủy: {service.policies.cancellation}</p>}
                  {service.policies.pets !== undefined && <p>Thú cưng: {service.policies.pets ? "Cho phép" : "Không"}</p>}
                  {service.policies.smoking !== undefined && <p>Hút thuốc: {service.policies.smoking ? "Cho phép" : "Không"}</p>}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Statistics */}
          {(service.views || service.bookings || service.revenue) && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onDelete(service)}>
                <Trash2 className="w-4 h-4" />
                Xóa
              </Button>
            </div>
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-gray-600">Doanh thu</p>
                  </div>
                  <p className="text-2xl text-gray-900">
                    {service.revenue ? `${(service.revenue / 1000000).toFixed(0)}M` : "—"}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Rooms for hotel */}
          {service.type === "hotel" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-gray-900">Phòng</h4>
                <span className="text-xs text-gray-500">{loadingRooms ? "Đang tải..." : `${rooms.length} phòng`}</span>
              </div>
              <div className="space-y-3">
                {rooms.length === 0 && !loadingRooms && (
                  <p className="text-sm text-gray-600">Chưa có phòng hoặc đang chờ duyệt.</p>
                )}
                {rooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 line-clamp-1">{room.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-gray-500">Giá/đêm</p>
                        <p className="text-blue-600 font-semibold">{room.basePrice ? `₫${Number(room.basePrice).toLocaleString()}` : "—"}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                      <span className="px-2 py-1 bg-gray-100 rounded">{room.type}</span>
                      {room.size && <span className="px-2 py-1 bg-gray-100 rounded">{room.size} m²</span>}
                      {room.bedType && <span className="px-2 py-1 bg-gray-100 rounded">{room.bedType}</span>}
                      {room.maxOccupancy && <span className="px-2 py-1 bg-gray-100 rounded">{room.maxOccupancy} khách</span>}
                      {room.cancellationPolicy && <span className="px-2 py-1 bg-gray-100 rounded">Hủy: {room.cancellationPolicy}</span>}
                      {room.breakfastIncluded !== undefined && <span className="px-2 py-1 bg-gray-100 rounded">BF: {room.breakfastIncluded ? "Có" : "Không"}</span>}
                    </div>
                    {room.amenities?.length ? (
                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-600">
                        {room.amenities.slice(0, 8).map((a: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 rounded border border-gray-100">{a}</span>
                        ))}
                        {room.amenities.length > 8 && <span className="text-gray-500">+{room.amenities.length - 8} nữa</span>}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-gray-900">Thời gian</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ngày nộp:</span>
                <span className="text-gray-900">{service.submittedAt}</span>
              </div>
              {service.reviewedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ngày duyệt:</span>
                  <span className="text-gray-900">{service.reviewedAt}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => {
                onEdit(service);
                onClose();
              }}
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
            {(service.status === "PENDING_REVIEW" || service.status === "REJECTED") && (
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  onResubmit(service);
                  onClose();
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Nộp lại
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                onDelete(service);
                onClose();
              }}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
