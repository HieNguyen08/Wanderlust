import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Alert, AlertDescription } from "../ui/alert";
import {
  CheckCircle, XCircle, Edit, AlertTriangle, Info
} from "lucide-react";

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-gray-900 whitespace-pre-line">{value}</p>
  </div>
);

interface Service {
  id: string;
  type: "hotel" | "activity" | "car";
  vendorName: string;
  vendorId: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  status: "pending" | "approved" | "needs_revision" | "rejected";
  submittedAt: string;
  details: Record<string, any>;
  adminNote?: string;
}

interface AdminServiceReviewDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (serviceId: string, editedData?: any) => void;
  onReject: (serviceId: string, reason: string) => void;
  onRequestRevision: (serviceId: string, note: string) => void;
  onOpenEditForm?: (service: Service, room?: any) => void;
}

type ActionMode = "review" | "edit" | "reject" | "revision";

export function AdminServiceReviewDialog({
  service,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestRevision,
  onOpenEditForm,
}: AdminServiceReviewDialogProps) {
  const [actionMode, setActionMode] = useState<ActionMode>("review");
  const [rejectReason, setRejectReason] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [editedData, setEditedData] = useState<any>({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setActionMode("review");
    setRejectReason("");
    setRevisionNote("");
    setEditedData({});
    setActionLoading(false);
  }, [service?.id]);

  if (!service) return null;

  const getTypeLabel = (type: Service["type"]) => {
    switch (type) {
      case "hotel": return "Khách sạn";
      case "activity": return "Hoạt động";
      case "car": return "Thuê xe";
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Có" : "Không";
    if (Array.isArray(value)) return value.map(String).join(", ");
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return String(value);
  };

  const runWithLoading = async (fn: () => any) => {
    setActionLoading(true);
    try {
      await Promise.resolve(fn());
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveClick = () => {
    return runWithLoading(() => onApprove(service.id));
  };

  const handleEditAndApprove = () => {
    return runWithLoading(() => onApprove(service.id, editedData));
  };

  const handleRejectWithReason = () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    return runWithLoading(() => {
      onReject(service.id, rejectReason);
      setRejectReason("");
      setActionMode("review");
    });
  };

  const handleRequestRevisionSubmit = () => {
    if (!revisionNote.trim()) {
      alert("Vui lòng nhập ghi chú yêu cầu chỉnh sửa");
      return;
    }
    return runWithLoading(() => {
      onRequestRevision(service.id, revisionNote);
      setRevisionNote("");
      setActionMode("review");
    });
  };

  const resetAndClose = () => {
    setActionMode("review");
    setRejectReason("");
    setRevisionNote("");
    setEditedData({});
    setActionLoading(false);
    onClose();
  };

  const isReadOnly = service.status === "approved";

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {actionMode === "review" && "Xem xét yêu cầu dịch vụ"}
            {actionMode === "edit" && "Chỉnh sửa & Phê duyệt"}
            {actionMode === "reject" && "Từ chối yêu cầu"}
            {actionMode === "revision" && "Yêu cầu chỉnh sửa"}
          </DialogTitle>
          <DialogDescription>
            {actionMode === "review" && "Xem chi tiết và quyết định phê duyệt"}
            {actionMode === "edit" && "Sửa các lỗi nhỏ trước khi phê duyệt"}
            {actionMode === "reject" && "Từ chối và gửi lý do cho Vendor"}
            {actionMode === "revision" && "Yêu cầu Vendor chỉnh sửa và nộp lại"}
          </DialogDescription>
        </DialogHeader>

        {actionMode === "review" && (
          <div className="space-y-6">
            {/* Service Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vendor</p>
                <p className="text-gray-900">{service.vendorName}</p>
                <p className="text-sm text-gray-500">{service.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Loại dịch vụ</p>
                <Badge className="bg-blue-100 text-blue-700">
                  {getTypeLabel(service.type)}
                </Badge>
              </div>
            </div>

            {/* Type-specific highlights */}
            {service.type === "hotel" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.details.star && <DetailItem label="Hạng sao" value={`${service.details.star}★`} />}
                {service.details.address && <DetailItem label="Địa chỉ" value={service.details.address} />}
                {service.details.amenities && <DetailItem label="Tiện nghi" value={service.details.amenities} />}
                {Number.isFinite(service.details.totalRooms) && (
                  <DetailItem label="Tổng phòng" value={`${service.details.totalRooms}`} />
                )}
                {Array.isArray(service.details.rooms) && service.details.rooms.length > 0 && (
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-gray-600">Phòng đã liên kết</p>
                    <div className="space-y-3 max-h-72 overflow-auto border rounded-md p-3 bg-gray-50">
                      {service.details.rooms.map((room: any) => {
                        const maxOcc = Number.isFinite(room.maxOccupancy) ? `${room.maxOccupancy} khách` : "—";
                        const bed = room.bedType ? String(room.bedType) : "—";
                        const sizeText = Number.isFinite(room.size) ? `${room.size} m²` : "";
                        const priceFromText = Number.isFinite(room.priceFrom)
                          ? `Giá từ ${Number(room.priceFrom).toLocaleString("vi-VN")} đ`
                          : undefined;
                        const basePriceText = Number.isFinite(room.basePrice)
                          ? `Giá niêm yết ${Number(room.basePrice).toLocaleString("vi-VN")} đ`
                          : undefined;
                        const optionText = Number.isFinite(room.optionCount) && room.optionCount > 0 ? `${room.optionCount} lựa chọn` : "";

                        const fieldPairs = [
                          { label: "Loại", value: room.type },
                          { label: "Sức chứa", value: maxOcc },
                          { label: "Giường", value: bed },
                          { label: "Diện tích", value: sizeText },
                          { label: "Tình trạng", value: room.status },
                          { label: "Chính sách hủy", value: room.cancellationPolicy },
                          { label: "Bữa sáng", value: typeof room.breakfastIncluded === "boolean" ? (room.breakfastIncluded ? "Có" : "Không") : "" },
                          { label: "Tổng phòng", value: formatValue(room.totalRooms) },
                          { label: "Còn trống", value: formatValue(room.availableRooms) },
                          { label: "Giá gốc", value: Number.isFinite(room.originalPrice) ? `${Number(room.originalPrice).toLocaleString("vi-VN")} đ` : "" },
                        ].filter(pair => pair.value);

                        return (
                          <div key={room.id || room.name} className="border rounded-md bg-white shadow-sm p-3 space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-900">{room.name ? String(room.name) : "Phòng"}</p>
                                <p className="text-xs text-gray-600">Mã: {room.id || "—"}</p>
                              </div>
                              <div className="text-right text-xs text-gray-700">
                                {optionText && <p>{optionText}</p>}
                                {priceFromText && <p>{priceFromText}</p>}
                                {!priceFromText && basePriceText && <p>{basePriceText}</p>}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-700">
                              {fieldPairs.map((pair) => (
                                <div key={`${room.id || room.name}-${pair.label}`} className="flex gap-1">
                                  <span className="text-gray-600">{pair.label}:</span>
                                  <span className="text-gray-900">{pair.value}</span>
                                </div>
                              ))}
                            </div>

                            {room.amenities && (
                              <p className="text-xs text-gray-700"><span className="text-gray-600">Tiện nghi:</span> <span className="text-gray-900">{formatValue(room.amenities)}</span></p>
                            )}
                            {room.description && (
                              <p className="text-xs text-gray-700 whitespace-pre-line"><span className="text-gray-600">Mô tả:</span> <span className="text-gray-900">{formatValue(room.description)}</span></p>
                            )}
                            {Array.isArray(room.optionSummaries) && room.optionSummaries.length > 0 && (
                              <div className="text-xs text-gray-700 space-y-1">
                                <p className="text-gray-600">Các lựa chọn:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {room.optionSummaries.map((opt: string, idx: number) => (
                                    <li key={idx} className="text-gray-900">{opt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {!isReadOnly && onOpenEditForm && (
                              <div className="pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-700 border-blue-200 hover:bg-blue-50"
                                  onClick={() => onOpenEditForm(service, room)}
                                >
                                  Chỉnh sửa phòng
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {service.type === "activity" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.details.duration && <DetailItem label="Thời lượng" value={service.details.duration} />}
                {service.details.category && <DetailItem label="Danh mục" value={service.details.category} />}
                {service.details.languages && <DetailItem label="Ngôn ngữ" value={service.details.languages} />}
                {service.details.meetingPoint && <DetailItem label="Điểm hẹn" value={service.details.meetingPoint} />}
              </div>
            )}
            {service.type === "car" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.details.brand && <DetailItem label="Hãng" value={service.details.brand} />}
                {service.details.model && <DetailItem label="Dòng xe" value={service.details.model} />}
                {service.details.seats && <DetailItem label="Ghế" value={`${service.details.seats} chỗ`} />}
                {service.details.transmission && <DetailItem label="Hộp số" value={service.details.transmission} />}
                {service.details.fuel && <DetailItem label="Nhiên liệu" value={service.details.fuel} />}
              </div>
            )}
            {service.adminNote && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Ghi chú trước đây</p>
                <p className="text-red-700 whitespace-pre-line">{service.adminNote}</p>
              </div>
            )}
            <Separator />

            {/* Images */}
            <div>
              <h4 className="text-sm mb-3 text-gray-900">Hình ảnh ({service.images.length})</h4>
              <div className="grid grid-cols-4 gap-3">
                {service.images.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <ImageWithFallback
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 text-xs bg-blue-600">
                        Ảnh đại diện
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Service Details */}
            <div>
              <h4 className="text-sm mb-3 text-gray-900">Thông tin dịch vụ</h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tên dịch vụ</p>
                  <p className="text-gray-900">{service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mô tả</p>
                  <p className="text-gray-900">{service.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giá</p>
                  <p className="text-xl text-blue-600">
                    {service.price.toLocaleString('vi-VN')} VND
                  </p>
                </div>

                {/* Thông tin vendor nhập (chỉ hiển thị giá trị đơn giản) */}
                {Object.entries(service.details)
                  .filter(([key, value]) => key !== "rooms")
                  .map(([key, value]) => {
                    // normalize values: arrays -> comma string, objects -> JSON string
                    let display: string;
                    if (value === null || value === undefined) {
                      display = "";
                    } else if (Array.isArray(value)) {
                      display = value.join(", ");
                    } else if (typeof value === "object") {
                      try {
                        display = JSON.stringify(value);
                      } catch {
                        display = "";
                      }
                    } else {
                      display = String(value);
                    }

                    if (!display) return null;

                    return (
                      <div key={key}>
                        <p className="text-sm text-gray-600 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-gray-900 whitespace-pre-line">{display}</p>
                      </div>
                    );
                  })}

                {service.adminNote && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ghi chú trước đây</p>
                    <p className="text-red-700 whitespace-pre-line">{service.adminNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quality Check Guide */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription>
                <p className="mb-2 text-blue-900">
                  <strong>Hướng dẫn kiểm duyệt:</strong>
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Kiểm tra ảnh: Rõ nét, đúng dịch vụ, không vi phạm bản quyền</li>
                  <li>✓ Kiểm tra giá: Rõ ràng, hợp lý, không có phí ẩn</li>
                  <li>✓ Kiểm tra mô tả: Đầy đủ, chính xác, không gây hiểu lầm</li>
                  <li>✓ Lỗi nhỏ (chính tả, định dạng): Chọn "Chỉnh sửa & Đăng"</li>
                  <li>✗ Lỗi lớn (giá sai, ảnh xấu, thiếu info): Chọn "Từ chối & Gửi lại"</li>
                </ul>
              </AlertDescription>
            </Alert>

            {!isReadOnly && (
              <>
                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    className="gap-2 bg-green-600 hover:bg-green-700"
                    onClick={handleApproveClick}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {actionLoading ? "Đang duyệt..." : "Duyệt & Đăng"}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      if (onOpenEditForm) {
                        onOpenEditForm(service);
                      } else {
                        setActionMode("edit");
                      }
                    }}
                    disabled={actionLoading}
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa & Đăng
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                    onClick={() => setActionMode("revision")}
                    disabled={actionLoading}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Yêu cầu sửa
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => setActionMode("reject")}
                  disabled={actionLoading}
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối & Gửi lại
                </Button>
              </>
            )}
          </div>
        )}

        {actionMode === "edit" && (
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Lưu ý:</strong> Chỉnh sửa giống form Vendor, sau đó bấm “Lưu & Phê duyệt”.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Tên dịch vụ</Label>
                <Input
                  defaultValue={service.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea
                  defaultValue={service.description}
                  onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Giá (VND)</Label>
                <Input
                  type="number"
                  defaultValue={service.price}
                  onChange={(e) => setEditedData({ ...editedData, price: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            {service.type === "hotel" && (
              <div className="space-y-4">
                <h4 className="text-sm text-gray-800">Thông tin khách sạn</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Hạng sao</Label>
                    <Input
                      type="number"
                      defaultValue={service.details.star}
                      onChange={(e) => setEditedData({ ...editedData, starRating: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Địa chỉ</Label>
                    <Input
                      defaultValue={service.details.address}
                      onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Thành phố</Label>
                    <Input
                      defaultValue={service.details.city}
                      onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Quốc gia</Label>
                    <Input
                      defaultValue={service.details.country}
                      onChange={(e) => setEditedData({ ...editedData, country: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tiện nghi (phân cách bởi dấu phẩy)</Label>
                    <Textarea
                      defaultValue={service.details.amenities}
                      rows={2}
                      onChange={(e) => setEditedData({ ...editedData, amenities: e.target.value.split(",").map(a => a.trim()).filter(Boolean) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <Input
                      defaultValue={service.details.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      defaultValue={service.details.website}
                      onChange={(e) => setEditedData({ ...editedData, website: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Chính sách hủy</Label>
                    <Textarea
                      defaultValue={service.details.cancellationPolicy}
                      rows={2}
                      onChange={(e) => setEditedData({ ...editedData, policies: { cancellation: e.target.value } })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {service.type === "activity" && (
              <div className="space-y-4">
                <h4 className="text-sm text-gray-800">Thông tin hoạt động</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Thời lượng</Label>
                    <Input
                      defaultValue={service.details.duration}
                      onChange={(e) => setEditedData({ ...editedData, duration: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Danh mục</Label>
                    <Input
                      defaultValue={service.details.category}
                      onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Điểm hẹn</Label>
                    <Input
                      defaultValue={service.details.meetingPoint}
                      onChange={(e) => setEditedData({ ...editedData, meetingPoint: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Ngôn ngữ (phân cách bởi dấu phẩy)</Label>
                    <Textarea
                      defaultValue={service.details.languages}
                      rows={2}
                      onChange={(e) => setEditedData({ ...editedData, languages: e.target.value.split(",").map(l => l.trim()).filter(Boolean) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Thành phố</Label>
                    <Input
                      defaultValue={service.details.city}
                      onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Quốc gia</Label>
                    <Input
                      defaultValue={service.details.country}
                      onChange={(e) => setEditedData({ ...editedData, country: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Thời gian bắt đầu</Label>
                    <Input
                      type="datetime-local"
                      defaultValue={service.details.startDateTime}
                      onChange={(e) => setEditedData({ ...editedData, startDateTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Thời gian kết thúc</Label>
                    <Input
                      type="datetime-local"
                      defaultValue={service.details.endDateTime}
                      onChange={(e) => setEditedData({ ...editedData, endDateTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Độ khó</Label>
                    <Input
                      defaultValue={service.details.difficulty}
                      onChange={(e) => setEditedData({ ...editedData, difficulty: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {service.type === "car" && (
              <div className="space-y-4">
                <h4 className="text-sm text-gray-800">Thông tin xe</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Hãng</Label>
                    <Input
                      defaultValue={service.details.brand}
                      onChange={(e) => setEditedData({ ...editedData, brand: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Dòng xe</Label>
                    <Input
                      defaultValue={service.details.model}
                      onChange={(e) => setEditedData({ ...editedData, model: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Số ghế</Label>
                    <Input
                      type="number"
                      defaultValue={service.details.seats}
                      onChange={(e) => setEditedData({ ...editedData, seats: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Hộp số</Label>
                    <Input
                      defaultValue={service.details.transmission}
                      onChange={(e) => setEditedData({ ...editedData, transmission: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Nhiên liệu</Label>
                    <Input
                      defaultValue={service.details.fuel}
                      onChange={(e) => setEditedData({ ...editedData, fuelType: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Năm sản xuất</Label>
                    <Input
                      type="number"
                      defaultValue={service.details.year}
                      onChange={(e) => setEditedData({ ...editedData, year: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Chính sách nhiên liệu</Label>
                    <Input
                      defaultValue={service.details.fuelPolicy}
                      onChange={(e) => setEditedData({ ...editedData, fuelPolicy: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      defaultChecked={service.details.withDriver}
                      onChange={(e) => setEditedData({ ...editedData, withDriver: e.target.checked })}
                    />
                    <Label>Có tài xế</Label>
                  </div>
                  <div>
                    <Label>Thành phố</Label>
                    <Input
                      defaultValue={service.details.city}
                      onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Quốc gia</Label>
                    <Input
                      defaultValue={service.details.country}
                      onChange={(e) => setEditedData({ ...editedData, country: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setActionMode("review") } disabled={actionLoading}>
                Quay lại
              </Button>
              <Button onClick={handleEditAndApprove} className="gap-2" disabled={actionLoading}>
                <CheckCircle className="w-4 h-4" />
                {actionLoading ? "Đang lưu..." : "Lưu & Phê duyệt"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {actionMode === "reject" && (
          <div className="space-y-6">
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>Từ chối yêu cầu:</strong> Dịch vụ sẽ KHÔNG được đăng. Vendor sẽ nhận thông báo 
                và cần nộp lại yêu cầu mới sau khi khắc phục.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm mb-2 text-gray-900">Dịch vụ bị từ chối:</h4>
              <p className="text-gray-900">{service.name}</p>
              <p className="text-sm text-gray-600">Vendor: {service.vendorName}</p>
            </div>

            <div>
              <Label htmlFor="rejectReason">
                Lý do từ chối <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="rejectReason"
                placeholder="VD: Ảnh xe không rõ biển số&#10;Thiếu giấy đăng kiểm xe&#10;Thiếu bảo hiểm&#10;Mô tả không rõ chính sách nhiên liệu"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={8}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-2">
                Hãy mô tả rõ ràng các vấn đề để Vendor biết cách khắc phục
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setActionMode("review")}>
                Quay lại
              </Button>
              <Button 
                onClick={handleRejectWithReason}
                className="gap-2 bg-red-600 hover:bg-red-700"
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4" />
                {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {actionMode === "revision" && (
          <div className="space-y-6">
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-900">
                <strong>Yêu cầu chỉnh sửa:</strong> Dịch vụ sẽ chuyển về trạng thái "Cần chỉnh sửa". 
                Vendor sẽ thấy ghi chú của bạn và có thể sửa & nộp lại.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm mb-2 text-gray-900">Dịch vụ cần chỉnh sửa:</h4>
              <p className="text-gray-900">{service.name}</p>
              <p className="text-sm text-gray-600">Vendor: {service.vendorName}</p>
            </div>

            <div>
              <Label htmlFor="revisionNote">
                Ghi chú yêu cầu chỉnh sửa <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="revisionNote"
                placeholder="VD: Vui lòng bổ sung thêm:&#10;1. Lịch trình chi tiết từng giờ&#10;2. Chính sách hủy tour rõ ràng hơn&#10;3. Tải ảnh chất lượng cao hơn (hiện tại ảnh hơi mờ)&#10;4. Làm rõ giá đã bao gồm bữa trưa chưa?"
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                rows={8}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-2">
                Liệt kê cụ thể các điểm cần chỉnh sửa để Vendor dễ thực hiện
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setActionMode("review")}>
                Quay lại
              </Button>
              <Button 
                onClick={handleRequestRevisionSubmit}
                className="gap-2 bg-orange-600 hover:bg-orange-700"
                disabled={actionLoading}
              >
                <AlertTriangle className="w-4 h-4" />
                {actionLoading ? "Đang gửi..." : "Gửi yêu cầu chỉnh sửa"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
