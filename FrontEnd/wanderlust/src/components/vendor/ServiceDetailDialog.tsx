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
  Edit, RefreshCw, Trash2, Eye, DollarSign
} from "lucide-react";

interface Service {
  id: string;
  type: "hotel" | "activity" | "car";
  name: string;
  description: string;
  image: string;
  price: number;
  status: "pending" | "approved" | "needs_revision" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
  views: number;
  bookings: number;
  revenue: number;
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
  if (!service) return null;

  const getStatusConfig = (status: Service["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Đang chờ duyệt",
          icon: Clock,
          className: "bg-yellow-100 text-yellow-700 border-yellow-200",
          description: "Yêu cầu của bạn đang chờ Admin xem xét và duyệt."
        };
      case "approved":
        return {
          label: "Đã duyệt / Live",
          icon: CheckCircle2,
          className: "bg-green-100 text-green-700 border-green-200",
          description: "Dịch vụ đã được duyệt và đang hiển thị cho khách hàng."
        };
      case "needs_revision":
        return {
          label: "Cần chỉnh sửa",
          icon: AlertCircle,
          className: "bg-orange-100 text-orange-700 border-orange-200",
          description: "Admin yêu cầu chỉnh sửa một số thông tin trước khi duyệt."
        };
      case "rejected":
        return {
          label: "Bị từ chối",
          icon: XCircle,
          className: "bg-red-100 text-red-700 border-red-200",
          description: "Yêu cầu bị từ chối. Vui lòng xem ghi chú và nộp lại."
        };
    }
  };

  const getTypeLabel = (type: Service["type"]) => {
    switch (type) {
      case "hotel": return "Khách sạn";
      case "activity": return "Hoạt động";
      case "car": return "Thuê xe";
    }
  };

  const statusConfig = getStatusConfig(service.status);
  const StatusIcon = statusConfig.icon;

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
          {(service.status === "needs_revision" || service.status === "rejected") && service.adminNote && (
            <Alert className={service.status === "needs_revision" 
              ? "bg-orange-50 border-orange-200" 
              : "bg-red-50 border-red-200"
            }>
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
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl text-gray-900 mb-2">{service.name}</h3>
                <Badge className="bg-gray-100 text-gray-700">
                  {getTypeLabel(service.type)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Giá</p>
                <p className="text-2xl text-blue-600">
                  {(service.price / 1000000).toFixed(1)}M VND
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
          </div>

          <Separator />

          {/* Statistics - Only show if approved */}
          {service.status === "approved" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-gray-600">Lượt xem</p>
                  </div>
                  <p className="text-2xl text-gray-900">{service.views}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-gray-600">Bookings</p>
                  </div>
                  <p className="text-2xl text-gray-900">{service.bookings}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-gray-600">Doanh thu</p>
                  </div>
                  <p className="text-2xl text-gray-900">
                    {(service.revenue / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>
              <Separator />
            </>
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
            {(service.status === "needs_revision" || service.status === "rejected") && (
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
