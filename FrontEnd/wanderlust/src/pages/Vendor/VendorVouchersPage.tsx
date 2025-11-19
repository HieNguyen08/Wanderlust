import { useState } from "react";
import { VendorLayout } from "../../components/VendorLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Plus, Search, Eye, Trash2, AlertCircle, Pause, Play } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { VoucherDetailDialog } from "../../components/admin/VoucherDetailDialog";
import type { PageType } from "../../MainApp";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { CalendarIcon } from "lucide-react";
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

    if (formData.applyToCategory && formData.applyToCategory !== "all") {
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

// ===== MAIN PAGE COMPONENT =====

interface VendorVouchersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function VendorVouchersPage({ onNavigate }: VendorVouchersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Mock vendor vouchers data
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "HOTEL_LUXURY50",
      type: "PERCENTAGE",
      value: 15,
      maxDiscount: 300000,
      minSpend: 2000000,
      startDate: "2025-11-01",
      endDate: "2025-12-31",
      totalUsesLimit: 100,
      userUseLimit: 1,
      totalUsed: 23,
      createdBy: "VENDOR",
      vendorId: "vendor_001",
      status: "PENDING",
      applyToCategory: "hotels"
    },
    {
      id: 2,
      code: "ACTIVITY_WEEKEND",
      type: "FIXED_AMOUNT",
      value: 50000,
      maxDiscount: null,
      minSpend: 200000,
      startDate: "2025-11-15",
      endDate: "2025-11-30",
      totalUsesLimit: 50,
      userUseLimit: 1,
      totalUsed: 12,
      createdBy: "VENDOR",
      vendorId: "vendor_001",
      status: "ACTIVE",
      applyToCategory: "activities"
    },
    {
      id: 3,
      code: "CAR_SALE20",
      type: "PERCENTAGE",
      value: 20,
      maxDiscount: 200000,
      minSpend: 500000,
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      totalUsesLimit: 30,
      userUseLimit: 1,
      totalUsed: 30,
      createdBy: "VENDOR",
      vendorId: "vendor_001",
      status: "EXPIRED",
      applyToCategory: "cars"
    },
  ]);

  const vendorId = "vendor_001"; // Mock vendor ID

  const handleVoucherCreated = (newVoucher: any) => {
    setVouchers([newVoucher, ...vouchers]);
    toast.success("Voucher đã được tạo và gửi đến Admin để phê duyệt!");
  };

  const handleViewDetail = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDetailDialogOpen(true);
  };

  const handlePauseVoucher = (voucherId: number) => {
    setVouchers(vouchers.map(v => 
      v.id === voucherId ? { ...v, status: "PAUSED" } : v
    ));
    toast.success("Đã tạm dừng voucher");
  };

  const handleActivateVoucher = (voucherId: number) => {
    setVouchers(vouchers.map(v => 
      v.id === voucherId ? { ...v, status: "ACTIVE" } : v
    ));
    toast.success("Đã kích hoạt voucher");
  };

  const handleDeleteVoucher = (voucherId: number) => {
    setVouchers(vouchers.filter(v => v.id !== voucherId));
    toast.success("Đã xóa voucher");
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      ACTIVE: { label: "Đang hoạt động", variant: "default" },
      PENDING: { label: "Chờ duyệt", variant: "secondary" },
      PAUSED: { label: "Tạm dừng", variant: "outline" },
      EXPIRED: { label: "Đã hết hạn", variant: "destructive" },
    };
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "hotels": "Khách sạn",
      "activities": "Hoạt động",
      "cars": "Thuê xe",
      "flights": "Chuyến bay",
      "all": "Tất cả dịch vụ"
    };
    return categories[category] || category;
  };

  return (
    <VendorLayout currentPage="vendor-vouchers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý voucher cho các dịch vụ của bạn</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Voucher Mới
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Voucher bạn tạo sẽ được gửi đến Admin để phê duyệt. Sau khi được duyệt, 
            voucher sẽ tự động áp dụng cho các dịch vụ do bạn cung cấp.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm mã voucher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="PAUSED">Tạm dừng</SelectItem>
                <SelectItem value="EXPIRED">Đã hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Tổng voucher</div>
            <div className="text-2xl font-bold mt-1">{vouchers.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Đang hoạt động</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {vouchers.filter(v => v.status === "ACTIVE").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Chờ duyệt</div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">
              {vouchers.filter(v => v.status === "PENDING").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Tổng lượt sử dụng</div>
            <div className="text-2xl font-bold mt-1">
              {vouchers.reduce((sum, v) => sum + v.totalUsed, 0)}
            </div>
          </Card>
        </div>

        {/* Vouchers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Voucher</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Áp dụng cho</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Đã dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-mono font-semibold">
                    {voucher.code}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {voucher.type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {voucher.type === "PERCENTAGE" 
                      ? `${voucher.value}%` 
                      : `₫${voucher.value.toLocaleString()}`}
                    {voucher.maxDiscount && (
                      <div className="text-xs text-gray-500">
                        Tối đa: ₫{voucher.maxDiscount.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getCategoryLabel(voucher.applyToCategory)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(voucher.startDate).toLocaleDateString('vi-VN')}
                      <br />
                      đến {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {voucher.totalUsed} / {voucher.totalUsesLimit || "∞"}
                    </div>
                    {voucher.totalUsesLimit && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(voucher.totalUsed / voucher.totalUsesLimit) * 100}%` }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(voucher)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {voucher.status === "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePauseVoucher(voucher.id)}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {voucher.status === "PAUSED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleActivateVoucher(voucher.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {voucher.status === "PENDING" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredVouchers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy voucher nào
            </div>
          )}
        </Card>
      </div>

      {/* Dialogs */}
      <CreateVendorVoucherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        vendorId={vendorId}
        onVoucherCreated={handleVoucherCreated}
      />

      <VoucherDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        voucher={selectedVoucher}
      />
    </VendorLayout>
  );
}