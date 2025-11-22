import { format } from "date-fns";
import { AlertCircle, CalendarIcon, Eye, Pause, Play, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { VoucherDetailDialog } from "../../components/admin/VoucherDetailDialog";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Card } from "../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { VendorLayout } from "../../components/VendorLayout";
import type { PageType } from "../../MainApp";

interface CreateVendorVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  onVoucherCreated: (voucher: any) => void;
}

export function CreateVendorVoucherDialog({ open, onOpenChange, vendorId, onVoucherCreated }: CreateVendorVoucherDialogProps) {
  const { t } = useTranslation();
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
          <DialogTitle>{t('vendor.createVoucher')}</DialogTitle>
          <DialogDescription>
            {t('vendor.voucherApprovalInfo')}
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
            <h3 className="text-lg">{t('vendor.basicInfo')}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('vendor.voucherCode')} *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: HOTEL_SALE"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t('vendor.discountType')} *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">{t('vendor.percentage')} (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">{t('vendor.fixedAmount')} (đ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">
                  {t('vendor.value')} * {formData.type === "PERCENTAGE" ? "(%)" : "(VNĐ)"}
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
                  <Label htmlFor="maxDiscount">{t('vendor.maxDiscount')} (VNĐ)</Label>
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
            <h3 className="text-lg">{t('vendor.applyConditions')}</h3>

            <div className="space-y-2">
              <Label htmlFor="minSpend">{t('vendor.minSpend')} (VNĐ)</Label>
              <Input
                id="minSpend"
                type="number"
                value={formData.minSpend}
                onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('vendor.applyToCategory')} (tùy chọn)</Label>
              <Select value={formData.applyToCategory} onValueChange={(value) => setFormData({ ...formData, applyToCategory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('vendor.allServices')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('vendor.allServices')}</SelectItem>
                  <SelectItem value="hotels">{t('vendor.onlyHotels')}</SelectItem>
                  <SelectItem value="activities">{t('vendor.onlyActivities')}</SelectItem>
                  <SelectItem value="cars">{t('vendor.onlyCars')}</SelectItem>
                  <SelectItem value="tours">{t('vendor.onlyTours')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {t('vendor.categoryNote')}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{t('vendor.autoCondition')}</strong>
              </p>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <h3 className="text-lg">{t('vendor.usageLimits')}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalUsesLimit">{t('vendor.totalUsageLimit')}</Label>
                <Input
                  id="totalUsesLimit"
                  type="number"
                  value={formData.totalUsesLimit}
                  onChange={(e) => setFormData({ ...formData, totalUsesLimit: e.target.value })}
                  placeholder={t('vendor.unlimited')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userUseLimit">{t('vendor.limitsPerUser')} *</Label>
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
            <h3 className="text-lg">{t('vendor.validityPeriod')}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('vendor.startDate')} *</Label>
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
                <Label>{t('vendor.endDate')} *</Label>
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
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('vendor.createVoucherBtn')}
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
  const { t } = useTranslation();
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
    toast.success(t('vendor.voucherCreated'));
  };

  const handleViewDetail = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDetailDialogOpen(true);
  };

  const handlePauseVoucher = (voucherId: number) => {
    setVouchers(vouchers.map(v => 
      v.id === voucherId ? { ...v, status: "PAUSED" } : v
    ));
    toast.success(t('vendor.voucherPaused'));
  };

  const handleActivateVoucher = (voucherId: number) => {
    setVouchers(vouchers.map(v => 
      v.id === voucherId ? { ...v, status: "ACTIVE" } : v
    ));
    toast.success(t('vendor.voucherActivated'));
  };

  const handleDeleteVoucher = (voucherId: number) => {
    setVouchers(vouchers.filter(v => v.id !== voucherId));
    toast.success(t('vendor.voucherDeleted'));
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      ACTIVE: { label: t('vendor.active'), variant: "default" },
      PENDING: { label: t('vendor.pendingApproval'), variant: "secondary" },
      PAUSED: { label: t('vendor.paused'), variant: "outline" },
      EXPIRED: { label: t('vendor.expired'), variant: "destructive" },
    };
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "hotels": t('vendor.hotels'),
      "activities": t('vendor.activities'),
      "cars": t('vendor.cars'),
      "flights": t('vendor.flights'),
      "all": t('vendor.allServices')
    };
    return categories[category] || category;
  };

  return (
    <VendorLayout currentPage="vendor-vouchers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('vendor.manageVouchers')}</h1>
            <p className="text-gray-600 mt-1">{t('vendor.createPromotionsDesc')}</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('vendor.createVoucher')}
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            {t('vendor.voucherApprovalInfo')}
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('vendor.searchVouchers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('common.all')} {t('common.status')}</SelectItem>
                <SelectItem value="ACTIVE">{t('vendor.active')}</SelectItem>
                <SelectItem value="PENDING">{t('vendor.pendingApproval')}</SelectItem>
                <SelectItem value="PAUSED">{t('vendor.paused')}</SelectItem>
                <SelectItem value="EXPIRED">{t('vendor.expired')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.totalVouchers')}</div>
            <div className="text-2xl font-bold mt-1">{vouchers.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.active')}</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {vouchers.filter(v => v.status === "ACTIVE").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.pendingApproval')}</div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">
              {vouchers.filter(v => v.status === "PENDING").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.totalUsage')}</div>
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
                <TableHead>{t('vendor.voucherCode')}</TableHead>
                <TableHead>{t('vendor.type')}</TableHead>
                <TableHead>{t('vendor.value')}</TableHead>
                <TableHead>{t('vendor.applyToCategory')}</TableHead>
                <TableHead>{t('vendor.duration')}</TableHead>
                <TableHead>{t('vendor.used')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('vendor.actions')}</TableHead>
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
                      {voucher.type === "PERCENTAGE" ? t('vendor.percentage') : t('vendor.fixedAmount')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {voucher.type === "PERCENTAGE" 
                      ? `${voucher.value}%` 
                      : `₫${voucher.value.toLocaleString()}`}
                    {voucher.maxDiscount && (
                      <div className="text-xs text-gray-500">
                        {t('vendor.max')}: ₫{voucher.maxDiscount.toLocaleString()}
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
                      {t('vendor.to')} {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
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