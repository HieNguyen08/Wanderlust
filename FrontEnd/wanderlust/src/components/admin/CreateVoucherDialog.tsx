import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface CreateVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoucherCreated: (voucher: any) => void;
}

export function CreateVoucherDialog({ open, onOpenChange, onVoucherCreated }: CreateVoucherDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    maxDiscount: "",
    minSpend: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
    totalUsesLimit: "",
    userUseLimit: "1",
    status: "ACTIVE",
    conditions: [] as { type: string; value: string; label: string }[],
  });

  const [newCondition, setNewCondition] = useState({ type: "", value: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: formData.status,
      conditions: formData.conditions.map(c => ({ type: c.type, value: c.value })),
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
      status: "ACTIVE",
      conditions: [],
    });
  };

  const handleAddCondition = () => {
    if (newCondition.type && newCondition.value) {
      const conditionLabels: { [key: string]: { [key: string]: string } } = {
        CATEGORY: {
          flights: "Vé máy bay",
          hotels: "Khách sạn",
          activities: "Hoạt động vui chơi",
          cars: "Thuê xe",
          tours: "Tour du lịch",
        },
      };

      const label = conditionLabels[newCondition.type]?.[newCondition.value] || newCondition.value;

      setFormData({
        ...formData,
        conditions: [...formData.conditions, { ...newCondition, label }],
      });
      setNewCondition({ type: "", value: "" });
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Voucher Mới</DialogTitle>
          <DialogDescription>
            Tạo mã giảm giá mới cho toàn hệ thống hoặc dành riêng cho người dùng cụ thể
          </DialogDescription>
        </DialogHeader>

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
                  placeholder="VD: BLACKFRIDAY"
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
              <Label>Áp dụng cho danh mục</Label>
              <div className="flex gap-2">
                <Select
                  value={newCondition.type}
                  onValueChange={(value) => setNewCondition({ ...newCondition, type: value, value: "" })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn loại điều kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CATEGORY">Danh mục dịch vụ</SelectItem>
                    <SelectItem value="VENDOR">Vendor cụ thể</SelectItem>
                    <SelectItem value="USER">User cụ thể</SelectItem>
                  </SelectContent>
                </Select>

                {newCondition.type === "CATEGORY" && (
                  <Select value={newCondition.value} onValueChange={(value) => setNewCondition({ ...newCondition, value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flights">Vé máy bay</SelectItem>
                      <SelectItem value="hotels">Khách sạn</SelectItem>
                      <SelectItem value="activities">Hoạt động vui chơi</SelectItem>
                      <SelectItem value="cars">Thuê xe</SelectItem>
                      <SelectItem value="tours">Tour du lịch</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {(newCondition.type === "VENDOR" || newCondition.type === "USER") && (
                  <Input
                    placeholder={`Nhập ID ${newCondition.type === "VENDOR" ? "Vendor" : "User"}`}
                    value={newCondition.value}
                    onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                    className="flex-1"
                  />
                )}

                <Button type="button" onClick={handleAddCondition} disabled={!newCondition.type || !newCondition.value}>
                  Thêm
                </Button>
              </div>

              {formData.conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {condition.label}
                      <button type="button" onClick={() => handleRemoveCondition(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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

          {/* Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Trạng thái khi tạo</Label>
                <p className="text-sm text-gray-500">Voucher có hoạt động ngay sau khi tạo không?</p>
              </div>
              <Switch
                checked={formData.status === "ACTIVE"}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "ACTIVE" : "PAUSED" })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo Voucher
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
