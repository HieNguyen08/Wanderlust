import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { format } from "date-fns";

interface CreateVendorVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  onVoucherCreated: (voucher: any) => void;
}

export function CreateVendorVoucherDialog({ open, onOpenChange, vendorId, onVoucherCreated }: CreateVendorVoucherDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    maxDiscount: "",
    minSpend: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    totalUsesLimit: "",
    userUseLimit: "1",
    applyToCategory: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const conditions = [
      { type: "VENDOR", value: vendorId }
    ];

    if (formData.applyToCategory) {
      conditions.push({ type: "CATEGORY", value: formData.applyToCategory });
    }

    const voucher = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      minSpend: formData.minSpend ? parseFloat(formData.minSpend) : 0,
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate, "yyyy-MM-dd"),
      totalUsesLimit: formData.totalUsesLimit ? parseInt(formData.totalUsesLimit) : null,
      userUseLimit: parseInt(formData.userUseLimit),
      totalUsed: 0,
      createdBy: "VENDOR",
      createdById: vendorId,
      status: "PAUSED",
      approvalStatus: "PENDING_APPROVAL",
      conditions: conditions,
    };

    onVoucherCreated(voucher);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      code: "",
      type: "PERCENTAGE",
      value: "",
      maxDiscount: "",
      minSpend: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      totalUsesLimit: "",
      userUseLimit: "1",
      applyToCategory: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Voucher Mới</DialogTitle>
          <DialogDescription>
            Tạo mã giảm giá cho các dịch vụ của bạn và gửi đến Admin để phê duyệt
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900">
            Voucher của bạn sẽ tự động áp dụng cho các dịch vụ do bạn cung cấp. 
            Sau khi tạo, voucher sẽ được gửi đến Admin để phê duyệt.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg">Thông tin cơ bản</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã Voucher *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: HOTEL_SALE"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Loại giảm giá *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Số tiền cố định (đ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">
                  Giá trị * {formData.type === "PERCENTAGE" ? "(%)" : "(VNĐ)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === "PERCENTAGE" ? "10" : "100000"}
                  required
                />
              </div>

              {formData.type === "PERCENTAGE" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="500000"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg">Điều kiện áp dụng</h3>

            <div className="space-y-2">
              <Label htmlFor="minSpend">Giá trị đơn hàng tối thiểu (VNĐ)</Label>
              <Input
                id="minSpend"
                type="number"
                value={formData.minSpend}
                onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Áp dụng cho danh mục (tùy chọn)</Label>
              <Select value={formData.applyToCategory} onValueChange={(value) => setFormData({ ...formData, applyToCategory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả dịch vụ của bạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả dịch vụ của bạn</SelectItem>
                  <SelectItem value="hotels">Chỉ Khách sạn</SelectItem>
                  <SelectItem value="activities">Chỉ Hoạt động vui chơi</SelectItem>
                  <SelectItem value="cars">Chỉ Thuê xe</SelectItem>
                  <SelectItem value="tours">Chỉ Tour du lịch</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Nếu không chọn, voucher sẽ áp dụng cho tất cả dịch vụ của bạn
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Điều kiện tự động:</strong> Voucher này chỉ áp dụng cho các dịch vụ do bạn cung cấp
              </p>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <h3 className="text-lg">Giới hạn sử dụng</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalUsesLimit">Tổng số lượt sử dụng</Label>
                <Input
                  id="totalUsesLimit"
                  type="number"
                  value={formData.totalUsesLimit}
                  onChange={(e) => setFormData({ ...formData, totalUsesLimit: e.target.value })}
                  placeholder="Không giới hạn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userUseLimit">Số lượt/người dùng *</Label>
                <Input
                  id="userUseLimit"
                  type="number"
                  value={formData.userUseLimit}
                  onChange={(e) => setFormData({ ...formData, userUseLimit: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg">Thời gian hiệu lực</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.startDate, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Ngày kết thúc *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.endDate, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
