import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

interface CreateVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoucherCreated: (voucher: any) => void;
}

export function CreateVoucherDialog({ open, onOpenChange, onVoucherCreated }: CreateVoucherDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    category: "ALL",
    type: "PERCENTAGE",
    value: "",
    maxDiscount: "",
    minSpend: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
    totalUsesLimit: "",
    status: "ACTIVE",
    conditions: [] as { type: string; value: string; label: string }[],
    image: "",
  });

  const [newCondition, setNewCondition] = useState({ type: "", value: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const voucher = {
      code: formData.code.toUpperCase(),
      title: formData.title.trim() || formData.code.toUpperCase(),
      description: formData.description.trim() || `Promotion ${formData.code.toUpperCase()}`,
      category: formData.category,
      type: formData.type,
      value: parseFloat(formData.value),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      minSpend: formData.minSpend ? parseFloat(formData.minSpend) : 0,
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate, "yyyy-MM-dd"),
      totalUsesLimit: formData.totalUsesLimit ? parseInt(formData.totalUsesLimit) : null,
      totalUsed: 0,
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: formData.status,
      conditions: formData.conditions.map(c => ({ type: c.type, value: c.value })),
      image: formData.image || undefined,
    };

    onVoucherCreated(voucher);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      code: "",
      title: "",
      description: "",
      category: "ALL",
      type: "PERCENTAGE",
      value: "",
      maxDiscount: "",
      minSpend: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      totalUsesLimit: "",
      status: "ACTIVE",
      conditions: [],
      image: "",
    });
  };

  const handleAddCondition = () => {
    if (newCondition.type && newCondition.value) {
      let label = newCondition.value;
      if (newCondition.type === 'VENDOR') {
        label = `Vendor: ${newCondition.value}`;
      } else if (newCondition.type === 'USER') {
        label = `User: ${newCondition.value}`;
      }

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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề voucher *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Bay quốc tế giảm 10%"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả voucher *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả ngắn gọn về chương trình ưu đãi"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Link ảnh voucher</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500">Ảnh sẽ xuất hiện ở banner và danh sách khuyến mãi (có thể bỏ trống để dùng ảnh mặc định).</p>
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
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục áp dụng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả dịch vụ</SelectItem>
                  <SelectItem value="FLIGHT">Vé máy bay</SelectItem>
                  <SelectItem value="HOTEL">Khách sạn</SelectItem>
                  <SelectItem value="ACTIVITY">Hoạt động vui chơi</SelectItem>
                  <SelectItem value="CAR">Thuê xe</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Danh mục này giúp voucher hiển thị đúng bộ lọc ở trang Khuyến mãi.</p>
            </div>

            <div className="space-y-2">
              <Label>Điều kiện bổ sung</Label>
              <div className="flex gap-2">
                <Select
                  value={newCondition.type}
                  onValueChange={(value) => setNewCondition({ ...newCondition, type: value, value: "" })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn loại điều kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VENDOR">Vendor cụ thể</SelectItem>
                    <SelectItem value="USER">User cụ thể</SelectItem>
                  </SelectContent>
                </Select>

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

            <div className="space-y-2">
              <Label htmlFor="totalUsesLimit">Tổng số lượt sử dụng</Label>
              <Input
                id="totalUsesLimit"
                type="number"
                value={formData.totalUsesLimit}
                onChange={(e) => setFormData({ ...formData, totalUsesLimit: e.target.value })}
                placeholder="Không giới hạn"
              />
              <p className="text-xs text-gray-500">
                Để trống nếu không giới hạn tổng số lần sử dụng voucher
              </p>
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
