import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Calendar, Users, Tag, DollarSign, Target, Activity } from "lucide-react";

interface VoucherDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: any;
}

export function VoucherDetailDialog({ open, onOpenChange, voucher }: VoucherDetailDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Đang hoạt động</Badge>;
      case "PAUSED":
        return <Badge className="bg-yellow-500">Tạm dừng</Badge>;
      case "EXPIRED":
        return <Badge variant="secondary">Hết hạn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatValue = (type: string, value: number) => {
    return type === "PERCENTAGE" 
      ? `${value}%`
      : `${value.toLocaleString('vi-VN')}đ`;
  };

  const getConditionLabel = (condition: any) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      CATEGORY: {
        flights: "Vé máy bay",
        hotels: "Khách sạn",
        activities: "Hoạt động vui chơi",
        cars: "Thuê xe",
        tours: "Tour du lịch",
      },
    };

    if (condition.type === "CATEGORY") {
      return labels.CATEGORY[condition.value] || condition.value;
    } else if (condition.type === "VENDOR") {
      return `Vendor: ${condition.value}`;
    } else if (condition.type === "USER") {
      return `User: ${condition.value}`;
    }
    return condition.value;
  };

  const usagePercentage = voucher.totalUsesLimit 
    ? (voucher.totalUsed / voucher.totalUsesLimit) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết Voucher</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và điều kiện áp dụng của voucher
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <code className="px-3 py-2 bg-gray-100 rounded text-xl font-mono">
                {voucher.code}
              </code>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(voucher.status)}
                <Badge variant={voucher.type === "PERCENTAGE" ? "outline" : "secondary"}>
                  {voucher.type === "PERCENTAGE" ? "Phần trăm" : "Số tiền cố định"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-blue-600">
                {formatValue(voucher.type, voucher.value)}
              </div>
              {voucher.maxDiscount && (
                <div className="text-sm text-gray-500">
                  Tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}đ
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Time Period */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Thời gian hiệu lực</span>
              </div>
              <div className="text-gray-900">
                <div>{voucher.startDate}</div>
                <div>đến {voucher.endDate}</div>
              </div>
            </div>

            {/* Created By */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Người tạo</span>
              </div>
              <div>
                <Badge variant={voucher.createdBy === "ADMIN" ? "default" : "secondary"}>
                  {voucher.createdBy}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">
                  ID: {voucher.createdById}
                </div>
              </div>
            </div>

            {/* Min Spend */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Đơn hàng tối thiểu</span>
              </div>
              <div className="text-gray-900">
                {voucher.minSpend > 0 
                  ? `${voucher.minSpend.toLocaleString('vi-VN')}đ`
                  : "Không yêu cầu"
                }
              </div>
            </div>

            {/* Usage Limits */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4" />
                <span className="text-sm">Giới hạn sử dụng</span>
              </div>
              <div className="text-gray-900">
                <div>Tổng: {voucher.totalUsesLimit ? voucher.totalUsesLimit.toLocaleString('vi-VN') : "Không giới hạn"}</div>
                <div className="text-sm">Mỗi người: {voucher.userUseLimit} lần</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Thống kê sử dụng</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã sử dụng</span>
                <span className="text-gray-900">
                  {voucher.totalUsed.toLocaleString('vi-VN')}
                  {voucher.totalUsesLimit && ` / ${voucher.totalUsesLimit.toLocaleString('vi-VN')}`}
                </span>
              </div>
              {voucher.totalUsesLimit && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Conditions */}
          {voucher.conditions && voucher.conditions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Điều kiện áp dụng</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {voucher.conditions.map((condition: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {getConditionLabel(condition)}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
