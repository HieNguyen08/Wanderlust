import { format } from "date-fns";
import { AlertCircle, CalendarIcon, Eye, Pause, Play, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
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
import { tokenService, vendorPromotionApi } from "../../utils/api";

interface CreateVendorVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  onVoucherCreated: (voucher: any) => void;
}

export function CreateVendorVoucherDialog({ open, onOpenChange, vendorId, onVoucherCreated }: CreateVendorVoucherDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    type: "PERCENTAGE",
    value: "",
    maxDiscount: "",
    minSpend: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    totalUsesLimit: "",
    applyToCategory: "",
    images: []
  });
  const [imageInput, setImageInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = formData.applyToCategory && formData.applyToCategory !== "ALL"
      ? formData.applyToCategory
      : "ALL";

    const images = formData.images.filter(Boolean).slice(0, 5);

    const voucher = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      minSpend: formData.minSpend ? parseFloat(formData.minSpend) : 0,
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate, "yyyy-MM-dd"),
      totalUsesLimit: formData.totalUsesLimit ? parseInt(formData.totalUsesLimit) : null,
      category,
      vendorId,
      adminCreateCheck: false,
      images,
      image: images[0] || undefined,
      conditions: [],
      isActive: true,
      isActiveManual: true,
      usedCount: 0,
    };

    onVoucherCreated(voucher);
    onOpenChange(false);

    // Reset form
    setFormData({
      title: "",
      description: "",
      code: "",
      type: "PERCENTAGE",
      value: "",
      maxDiscount: "",
      minSpend: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      totalUsesLimit: "",
      applyToCategory: "",
      images: []
    });
    setImageInput("");
  };

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (formData.images.filter(Boolean).length >= 5) {
      toast.error(t('vendor.imageLimit', 'Tối đa 5 ảnh'));
      return;
    }
    setFormData({ ...formData, images: [...formData.images.filter(Boolean), url] });
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    const next = formData.images.filter((_, idx) => idx !== index);
    setFormData({ ...formData, images: next });
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
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg">{t('vendor.basicInfo')}</h3>

            <div className="space-y-2">
              <Label htmlFor="title">{t('vendor.title', 'Tiêu đề')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('vendor.titlePlaceholder', 'Nhập tiêu đề ngắn gọn')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('vendor.description', 'Mô tả')}</Label>
              <textarea
                id="description"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('vendor.descriptionPlaceholder', 'Mô tả ngắn gọn về voucher')}
                rows={3}
              />
            </div>

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

            <div className="space-y-3">
              <Label>{t('vendor.voucherImages', 'Ảnh Voucher (tối đa 5)')}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('vendor.imageUrlPlaceholder', 'URL ảnh')}
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddImage}>
                  {t('vendor.add', 'Thêm')}
                </Button>
              </div>
              {formData.images.filter(Boolean).length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {formData.images.filter(Boolean).map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border bg-gray-50">
                      <img src={img} alt={`voucher-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow"
                        onClick={() => handleRemoveImage(idx)}
                        aria-label={t('common.remove', 'Xóa ảnh') as string}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                            {t('vendor.coverImage', 'Ảnh đại diện')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                {t('vendor.imageNote', 'Hình ảnh đầu tiên sẽ làm ảnh đại diện. Tối đa 5 ảnh.')}
              </p>
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
                  <SelectItem value="ALL">{t('vendor.allServices')}</SelectItem>
                  <SelectItem value="HOTEL">{t('vendor.onlyHotels')}</SelectItem>
                  <SelectItem value="ACTIVITY">{t('vendor.onlyActivities')}</SelectItem>
                  <SelectItem value="CAR">{t('vendor.onlyCars')}</SelectItem>
                  <SelectItem value="FLIGHT">{t('vendor.onlyFlights', 'Chỉ chuyến bay')}</SelectItem>
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

            <div className="space-y-2">
              <Label htmlFor="totalUsesLimit">{t('vendor.totalUsageLimit')}</Label>
              <Input
                id="totalUsesLimit"
                type="number"
                value={formData.totalUsesLimit}
                onChange={(e) => setFormData({ ...formData, totalUsesLimit: e.target.value })}
                placeholder={t('vendor.unlimited')}
              />
              <p className="text-xs text-gray-500">
                Để trống nếu không giới hạn tổng số lần sử dụng
              </p>
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
  const userData = tokenService.getUserData();
  const vendorId = userData?.userId || userData?.id || "";

  const computeStatus = (promo: any) => {
    const now = new Date();
    const startOk = !promo.startDate || new Date(promo.startDate) <= now;
    const endOk = !promo.endDate || new Date(promo.endDate) >= now;
    const exhausted = promo.totalUsesLimit && promo.usedCount >= promo.totalUsesLimit;
    if (!endOk) return "EXPIRED";
    if (exhausted) return "EXHAUSTED";
    const manual = promo.isActive ?? promo.isActiveManual;
    return manual && startOk ? "ACTIVE" : "INACTIVE";
  };
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, page]);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const res = await vendorPromotionApi.list({
        search: searchQuery,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        page,
        size: pageSize,
      });
      const content = res?.content || [];
      const mapped = content.map((promo: any) => {
        const status = promo.computedStatus || promo.status || computeStatus(promo);
        const daysLeft = promo.daysLeft ?? (promo.endDate ? Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null);
        const isExpired = status === "EXPIRED";
        const isExhausted = status === "EXHAUSTED" || (promo.totalUsesLimit && promo.usedCount >= promo.totalUsesLimit);
        return {
          id: promo.id,
          code: promo.code,
          title: promo.title,
          description: promo.description,
          type: promo.type || "PERCENTAGE",
          value: promo.value || 0,
          maxDiscount: promo.maxDiscount,
          minSpend: promo.minSpend || 0,
          startDate: promo.startDate,
          endDate: promo.endDate,
          totalUsesLimit: promo.totalUsesLimit,
          totalUsed: promo.usedCount || 0,
          status,
          daysLeft,
          isExpired,
          isExhausted,
          category: promo.category,
          vendorId: promo.vendorId,
          isActive: promo.isActive ?? promo.isActiveManual,
          isActiveManual: promo.isActiveManual,
        };
      });
      setVouchers(mapped);
      setTotal(res?.totalElements ?? mapped.length);
    } catch (error: any) {
      console.error("Failed to load vendor vouchers", error);
      toast.error(error?.message || t('vendor.cannotLoadVouchers'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherCreated = async (voucher: any) => {
    try {
      await vendorPromotionApi.create(voucher);
      toast.success(t('vendor.voucherCreated'));
      await loadVouchers();
    } catch (error: any) {
      console.error('Failed to create voucher', error);
      toast.error(error?.message || t('vendor.cannotCreateVoucher'));
    }
  };

  const handleViewDetail = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDetailDialogOpen(true);
  };

  const handleToggleVoucher = async (voucherId: string, activate: boolean) => {
    try {
      await vendorPromotionApi.toggle(voucherId, activate);
      toast.success(activate ? t('vendor.voucherActivated') : t('vendor.voucherPaused'));
      await loadVouchers();
    } catch (error: any) {
      console.error('Failed to toggle voucher', error);
      toast.error(error?.message || t('vendor.cannotUpdateVoucher'));
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    try {
      await vendorPromotionApi.delete(voucherId);
      toast.success(t('vendor.voucherDeleted'));
      await loadVouchers();
    } catch (error: any) {
      console.error('Failed to delete voucher', error);
      toast.error(error?.message || t('vendor.cannotDeleteVoucher'));
    }
  };

  const filteredVouchers = vouchers;
  const pagedVouchers = vouchers;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: t('vendor.active'), className: 'bg-green-100 text-green-700' },
      INACTIVE: { label: t('vendor.paused'), className: 'bg-gray-100 text-gray-700' },
      PENDING: { label: t('vendor.pendingApproval'), className: 'bg-yellow-100 text-yellow-800' },
      PAUSED: { label: t('vendor.paused'), className: 'bg-gray-100 text-gray-700' },
      EXPIRED: { label: t('vendor.expired'), className: 'bg-red-100 text-red-700' },
      EXHAUSTED: { label: t('vendor.exhausted', 'Đã hết lượt'), className: 'bg-orange-100 text-orange-700' },
    };
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      HOTEL: t('vendor.hotels'),
      ACTIVITY: t('vendor.activities'),
      CAR: t('vendor.cars'),
      FLIGHT: t('vendor.flights'),
      ALL: t('vendor.allServices'),
    };
    const key = (category || 'ALL').toUpperCase();
    return categories[key] || t('vendor.allServices');
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
            <div className="text-2xl font-bold mt-1">{filteredVouchers.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.active')}</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {filteredVouchers.filter(v => v.status === "ACTIVE").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.pendingApproval')}</div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">
              {filteredVouchers.filter(v => v.status === "PENDING").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('vendor.totalUsage')}</div>
            <div className="text-2xl font-bold mt-1">
              {filteredVouchers.reduce((sum, v) => sum + v.totalUsed, 0)}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : filteredVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    {t('vendor.noVouchersFound')}
                  </TableCell>
                </TableRow>
              ) : (
                pagedVouchers.map((voucher) => (
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
                      {getCategoryLabel(voucher.category || "ALL")}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voucher.startDate}
                        <br />
                        {t('vendor.to')} {voucher.endDate}
                        {voucher.daysLeft !== null && (
                          <div className={`text-xs ${voucher.daysLeft < 0 ? "text-red-600" : voucher.daysLeft < 7 ? "text-orange-600" : "text-gray-500"}`}>
                            {voucher.daysLeft < 0
                              ? t('admin.expiredDaysAgo', { days: Math.abs(voucher.daysLeft) })
                              : t('admin.daysLeft', { days: voucher.daysLeft })}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voucher.totalUsed} / {voucher.totalUsesLimit || "∞"}
                      </div>
                      {voucher.totalUsesLimit && voucher.totalUsesLimit > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (voucher.totalUsed / voucher.totalUsesLimit) * 100)}%` }}
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
                        {voucher.status !== "EXPIRED" && voucher.status !== "EXHAUSTED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVoucher(String(voucher.id), voucher.status !== "ACTIVE")}
                          >
                            {voucher.status === "ACTIVE" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVoucher(String(voucher.id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('common.showing')} {filteredVouchers.length === 0 ? 0 : page * pageSize + 1}-{Math.min(total, (page + 1) * pageSize)} {t('common.of')} {total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))}>{t('common.prev')}</Button>
            <Button variant="outline" disabled={(page + 1) * pageSize >= total} onClick={() => setPage(page + 1)}>{t('common.next')}</Button>
          </div>
        </div>
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