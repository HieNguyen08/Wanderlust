import { Copy, Eye, Pause, Play, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner@2.0.3";
import { CreateVoucherDialog } from "../../components/admin/CreateVoucherDialog";
import { VoucherDetailDialog } from "../../components/admin/VoucherDetailDialog";
import { AdminLayout } from "../../components/AdminLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
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
import type { PageType } from "../../MainApp";
import { promotionApi } from "../../utils/api";

interface AdminVouchersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminVouchersPage({ onNavigate }: AdminVouchersPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const data = await promotionApi.getAll();
      // Map backend Promotion to frontend voucher format
      const mappedVouchers = data.map((promo: any) => {
        const daysLeft = promo.daysLeft || 0;
        const isExpired = daysLeft < 0;
        const isExhausted = promo.totalUsesLimit && promo.usedCount >= promo.totalUsesLimit;

        const parsedConditions = (promo.conditions || []).map((condition: any) => {
          if (typeof condition === 'string') {
            const [type, ...rest] = condition.split(':');
            return { type, value: rest.join(':') };
          }
          return condition;
        });
        
        let status = 'INACTIVE';
        if (isExpired) {
          status = 'EXPIRED';
        } else if (isExhausted) {
          status = 'EXHAUSTED';
        } else if (promo.isActive) {
          status = 'ACTIVE';
        }

        return {
          id: promo.id || promo.promotionId,
          code: promo.code,
          type: promo.type || 'PERCENTAGE',
          value: promo.value || 0,
          maxDiscount: promo.maxDiscount,
          minSpend: promo.minSpend || 0,
          startDate: promo.startDate,
          endDate: promo.endDate,
          totalUsesLimit: promo.totalUsesLimit,
          userUseLimit: 1,
          totalUsed: promo.usedCount || 0,
          createdBy: 'ADMIN',
          createdById: 'admin_001',
          status: status,
          daysLeft: daysLeft,
          isExpired: isExpired,
          isExhausted: isExhausted,
          canToggle: !isExpired && !isExhausted,
          conditions: parsedConditions,
        };
      });
      setVouchers(mappedVouchers);
    } catch (error) {
      console.error('Error loading vouchers:', error);
      toast.error(t('admin.cannotLoadVouchers'));
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || voucher.status === statusFilter;
    const matchesType = typeFilter === "ALL" || voucher.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleToggleStatus = async (voucherId: number) => {
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return;
    
    // Check if voucher can be toggled
    if (voucher.isExpired) {
      toast.error(t('admin.voucherExpiredCannotToggle', { code: voucher.code }));
      return;
    }
    
    if (voucher.isExhausted) {
      toast.error(t('admin.voucherExhaustedCannotToggle', { code: voucher.code }));
      return;
    }
    
    try {
      const newStatus = voucher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      
      // Map to backend format (don't send id in body)
      const promotionData = {
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        maxDiscount: voucher.maxDiscount,
        minSpend: voucher.minSpend,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        totalUsesLimit: voucher.totalUsesLimit,
        usedCount: voucher.totalUsed,
        conditions: voucher.conditions,
        isActive: newStatus === "ACTIVE"
      };

      console.log('Updating voucher:', voucher.id, promotionData);
      const result = await promotionApi.update(String(voucher.id), promotionData);
      console.log('Update result:', result);
      toast.success(t(newStatus === "ACTIVE" ? 'admin.voucherActivated' : 'admin.voucherDeactivated', { code: voucher.code }));
      await loadVouchers(); // Reload data
    } catch (error: any) {
      console.error('Error toggling voucher status:', error);
      toast.error(error?.message || t('admin.cannotUpdateVoucherStatus'));
    }
  };

  const handleDuplicateVoucher = (voucher: any) => {
    const newVoucher = {
      ...voucher,
      id: Math.max(...vouchers.map(v => v.id)) + 1,
      code: `${voucher.code}_COPY`,
      totalUsed: 0,
      status: "PAUSED"
    };
    setVouchers([...vouchers, newVoucher]);
    toast.success(t('admin.voucherDuplicated', { code: voucher.code }));
  };

  const handleDeleteVoucher = async (voucherId: number) => {
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return;
    
    if (confirm(t('admin.confirmDeleteVoucher', { code: voucher.code }))) {
      try {
        console.log('Deleting voucher:', voucher.id);
        const result = await promotionApi.delete(String(voucher.id));
        console.log('Delete result:', result);
        toast.success(t('admin.voucherDeleted'));
        await loadVouchers(); // Reload data
      } catch (error: any) {
        console.error('Error deleting voucher:', error);
        toast.error(error?.message || t('admin.cannotDeleteVoucher'));
      }
    }
  };

  const handleViewDetails = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">{t('admin.active')}</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-500">{t('admin.inactive')}</Badge>;
      case "EXPIRED":
        return <Badge className="bg-red-500">{t('admin.expired')}</Badge>;
      case "EXHAUSTED":
        return <Badge className="bg-orange-500">{t('admin.exhausted')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "PERCENTAGE" 
      ? <Badge variant="outline">{t('admin.percentage')}</Badge>
      : <Badge variant="outline">{t('admin.fixedAmount')}</Badge>;
  };

  const formatValue = (type: string, value: number) => {
    return type === "PERCENTAGE" 
      ? `${value}%`
      : `${value.toLocaleString('vi-VN')}đ`;
  };

  const stats = [
    {
      label: t('admin.totalVouchers'),
      value: vouchers.length,
      color: "text-blue-600"
    },
    {
      label: t('admin.active'),
      value: vouchers.filter(v => v.status === "ACTIVE").length,
      color: "text-green-600"
    },
    {
      label: t('admin.totalUsage'),
      value: vouchers.reduce((sum, v) => sum + v.totalUsed, 0).toLocaleString('vi-VN'),
      color: "text-purple-600"
    },
    {
      label: t('admin.expiredOrExhausted'),
      value: vouchers.filter(v => v.status === "EXPIRED" || v.status === "EXHAUSTED").length,
      color: "text-red-600"
    },
  ];

  return (
    <AdminLayout currentPage="admin-vouchers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">{t('admin.manageVouchers')}</h1>
            <p className="text-gray-600 mt-1">
              {t('admin.manageVouchersDesc')}
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('admin.createNewVoucher')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('admin.searchByVoucherCode')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('admin.allStatuses')}</SelectItem>
                <SelectItem value="ACTIVE">{t('admin.active')}</SelectItem>
                <SelectItem value="PAUSED">{t('admin.paused')}</SelectItem>
                <SelectItem value="EXPIRED">{t('admin.expired')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('admin.voucherType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('admin.allTypes')}</SelectItem>
                <SelectItem value="PERCENTAGE">{t('admin.percentage')}</SelectItem>
                <SelectItem value="FIXED_AMOUNT">{t('admin.fixedAmount')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Vouchers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.voucherCode')}</TableHead>
                <TableHead>{t('common.type')}</TableHead>
                <TableHead>{t('admin.value')}</TableHead>
                <TableHead>{t('admin.conditions')}</TableHead>
                <TableHead>{t('admin.usage')}</TableHead>
                <TableHead>{t('admin.validity')}</TableHead>
                <TableHead>{t('admin.createdBy')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {t('admin.noVouchersFound')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {voucher.code}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(voucher.type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-gray-900">
                          {formatValue(voucher.type, voucher.value)}
                        </div>
                        {voucher.maxDiscount && (
                          <div className="text-xs text-gray-500">
                            {t('admin.maxDiscount')} {voucher.maxDiscount.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voucher.minSpend > 0 && (
                          <div className="text-gray-600">
                            {t('admin.minOrder')} {voucher.minSpend.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                        {voucher.conditions.length > 0 && (
                          <div className="text-blue-600">
                            {voucher.conditions.length} {t('admin.conditions')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {voucher.totalUsed.toLocaleString('vi-VN')}
                          {voucher.totalUsesLimit && ` / ${voucher.totalUsesLimit.toLocaleString('vi-VN')}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t('admin.usages')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-600">{voucher.startDate}</div>
                        <div className="text-gray-600">{t('admin.to')} {voucher.endDate}</div>
                        {voucher.daysLeft !== undefined && (
                          <div className={`text-xs font-medium ${voucher.daysLeft < 0 ? 'text-red-600' : voucher.daysLeft < 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                            {voucher.daysLeft < 0 
                              ? t('admin.expiredDaysAgo', { days: Math.abs(voucher.daysLeft) })
                              : t('admin.daysLeft', { days: voucher.daysLeft })
                            }
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={voucher.createdBy === "ADMIN" ? "default" : "secondary"}>
                        {voucher.createdBy}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(voucher)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!voucher.isExpired && !voucher.isExhausted ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(voucher.id)}
                            title={voucher.status === "ACTIVE" ? t('admin.deactivateVoucher') : t('admin.activateVoucher')}
                          >
                            {voucher.status === "ACTIVE" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            title={
                              voucher.isExpired 
                                ? t('admin.cannotToggleExpired')
                                : t('admin.cannotToggleExhausted')
                            }
                            className="opacity-50 cursor-not-allowed"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateVoucher(voucher)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                          className="text-red-600 hover:text-red-700"
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
      </div>

      {/* Create Voucher Dialog */}
      <CreateVoucherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onVoucherCreated={async (newVoucher) => {
          try {
            // Map frontend voucher to backend Promotion format
            const mappedConditions = (newVoucher.conditions || []).map((condition: any) => {
              if (!condition?.type) return condition?.value || '';
              return `${condition.type}:${condition.value}`;
            }).filter(Boolean);

            const promotionData = {
              code: newVoucher.code,
              title: newVoucher.title || newVoucher.code,
              description: newVoucher.description || `Promotion ${newVoucher.code}`,
              category: newVoucher.category || 'ALL',
              type: newVoucher.type,
              value: newVoucher.value,
              maxDiscount: newVoucher.maxDiscount,
              minSpend: newVoucher.minSpend,
              startDate: newVoucher.startDate,
              endDate: newVoucher.endDate,
              totalUsesLimit: newVoucher.totalUsesLimit,
              usedCount: 0,
              isActive: newVoucher.status === 'ACTIVE',
              conditions: mappedConditions,
              image: newVoucher.image || undefined
            };
            
            await promotionApi.create(promotionData);
            toast.success(t('admin.voucherCreatedSuccess'));
            loadVouchers(); // Reload from backend
          } catch (error) {
            console.error('Error creating voucher:', error);
            toast.error(t('admin.cannotCreateVoucher'));
          }
        }}
      />

      {/* Voucher Detail Dialog */}
      {selectedVoucher && (
        <VoucherDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          voucher={selectedVoucher}
        />
      )}
    </AdminLayout>
  );
}
