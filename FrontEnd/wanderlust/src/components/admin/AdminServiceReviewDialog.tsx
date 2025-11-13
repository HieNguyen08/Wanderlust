import { useState } from "react";
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
}

type ActionMode = "review" | "edit" | "reject" | "revision";

export function AdminServiceReviewDialog({
  service,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestRevision,
}: AdminServiceReviewDialogProps) {
  const [actionMode, setActionMode] = useState<ActionMode>("review");
  const [rejectReason, setRejectReason] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [editedData, setEditedData] = useState<any>({});

  if (!service) return null;

  const getTypeLabel = (type: Service["type"]) => {
    switch (type) {
      case "hotel": return "Khách sạn";
      case "activity": return "Hoạt động";
      case "car": return "Thuê xe";
    }
  };

  const handleApproveClick = () => {
    onApprove(service.id);
  };

  const handleEditAndApprove = () => {
    onApprove(service.id, editedData);
  };

  const handleRejectWithReason = () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    onReject(service.id, rejectReason);
    setRejectReason("");
    setActionMode("review");
  };

  const handleRequestRevisionSubmit = () => {
    if (!revisionNote.trim()) {
      alert("Vui lòng nhập ghi chú yêu cầu chỉnh sửa");
      return;
    }
    onRequestRevision(service.id, revisionNote);
    setRevisionNote("");
    setActionMode("review");
  };

  const resetAndClose = () => {
    setActionMode("review");
    setRejectReason("");
    setRevisionNote("");
    setEditedData({});
    onClose();
  };

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
            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <p className="text-sm text-gray-600 mb-1">Ngày nộp</p>
                <p className="text-gray-900">{service.submittedAt}</p>
              </div>
            </div>

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
                {Object.entries(service.details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-600 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-gray-900 whitespace-pre-line">{value as string}</p>
                  </div>
                ))}
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

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleApproveClick}
              >
                <CheckCircle className="w-4 h-4" />
                Duyệt & Đăng
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setActionMode("edit")}
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa & Đăng
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={() => setActionMode("revision")}
              >
                <AlertTriangle className="w-4 h-4" />
                Yêu cầu sửa
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => setActionMode("reject")}
            >
              <XCircle className="w-4 h-4" />
              Từ chối & Gửi lại
            </Button>
          </div>
        )}

        {actionMode === "edit" && (
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Lưu ý:</strong> Chỉ sửa các lỗi nhỏ như chính tả, định dạng, chọn ảnh đại diện khác. 
                Không tự ý thay đổi giá hoặc nội dung quan trọng.
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
                  onChange={(e) => setEditedData({ ...editedData, price: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Chỉ sửa nếu có lỗi đánh máy rõ ràng
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setActionMode("review")}>
                Quay lại
              </Button>
              <Button onClick={handleEditAndApprove} className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Lưu & Phê duyệt
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
              >
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
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
              >
                <AlertTriangle className="w-4 h-4" />
                Gửi yêu cầu chỉnh sửa
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
