import { AlertCircle, CheckCircle, Clock, Eye, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { vendorApi, type VendorRefund } from '../../api/vendorApi';
import { useSmartPagination } from '../../hooks/useSmartPagination';
import { PaginationUI } from '../../components/ui/PaginationUI';
import { useCallback } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { VendorLayout } from '../../components/VendorLayout';
import type { PageType } from '../../MainApp';

interface VendorRefundsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

type RefundStatus = "pending" | "approved" | "processing" | "completed" | "rejected";

export default function VendorRefundsPage({
  onNavigate,
  vendorType = "hotel"
}: VendorRefundsPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<RefundStatus | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<VendorRefund | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);



  const fetchData = useCallback(async (page: number, size: number) => {
    try {
      const data = await vendorApi.getVendorRefunds({
        page,
        size,
        search: searchQuery,
        status: activeTab === 'all' ? undefined : activeTab
      });

      // Status Normalizer (moved inside for safety or kept here)
      // Since mapping is partially done in API, we just need to ensure frontend status is correct
      // But API returns status "pending" mostly. The page had normalizeStatus function locally.
      // Let's rely on the API returning `rawStatus` which we can use or just trust the status logic.
      // Actually, API returns "pending" hardcoded. We should fix API or rely on local normalization if rawStatus exists.
      // Let's assume the API change passed `rawStatus` (I added it).

      const normalizeStatus = (status?: string): RefundStatus => {
        const lower = (status || '').toLowerCase();
        if (lower === 'refund_requested' || lower === 'pending') return 'pending';
        if (lower === 'refund_approved' || lower === 'approved') return 'approved';
        if (lower === 'refund_processing' || lower === 'processing') return 'processing';
        if (lower === 'refund_completed' || lower === 'completed') return 'completed';
        if (lower === 'refund_rejected' || lower === 'rejected') return 'rejected';
        return 'pending'; // Default fallback
      };

      const mapped = data.content.map((item: any) => ({
        ...item,
        status: normalizeStatus(item.rawStatus || item.status)
      }));

      return {
        data: mapped,
        totalItems: data.totalElements
      };
    } catch (error) {
      console.error("Failed to load refunds:", error);
      toast.error(t('vendor.cannotLoadRefunds', 'Không thể tải danh sách hoàn tiền'));
      return { data: [], totalItems: 0 };
    }
  }, [activeTab, searchQuery, t]);

  const {
    currentItems: refundRequests,
    isLoading: loading,
    goToPage,
    currentPage,
    totalPages,
    refresh: reloadRefunds
  } = useSmartPagination({
    fetchData,
    initialPageSize: 10
  });

  // Reset to first page when parameters change
  useEffect(() => {
    goToPage(0);
  }, [activeTab, searchQuery]);

  const STATUS_CONFIG: Record<RefundStatus, { label: string; color: string; icon: any }> = {
    pending: {
      label: t('vendor.pending', 'Chờ xử lý'),
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock
    },
    approved: {
      label: t('vendor.approved', 'Đã duyệt'),
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle
    },
    processing: {
      label: t('vendor.processing', 'Đang xử lý'),
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: AlertCircle
    },
    completed: {
      label: t('vendor.completed', 'Hoàn thành'),
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle
    },
    rejected: {
      label: t('vendor.rejected', 'Đã từ chối'),
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle
    }
  };

  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      FLIGHT: "✈️",
      HOTEL: "🏨",
      CAR_RENTAL: "🚗",
      ACTIVITY: "🎫",
    };
    return icons[type] || "📦";
  };

  // Filter refunds
  // Filter refunds - already done by API
  const filteredRefunds = refundRequests;

  // Calculate stats
  const stats = [
    {
      label: t('vendor.pendingApproval', 'Chờ phê duyệt'),
      value: refundRequests.filter(r => r.status === "pending").length,
      amount: refundRequests.filter(r => r.status === "pending").reduce((sum, r) => sum + r.refundAmount, 0),
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      label: t('vendor.processing', 'Đang xử lý'),
      value: refundRequests.filter(r => r.status === "approved" || r.status === "processing").length,
      amount: refundRequests.filter(r => r.status === "approved" || r.status === "processing").reduce((sum, r) => sum + r.refundAmount, 0),
      icon: AlertCircle,
      color: "text-blue-600"
    },
    {
      label: t('vendor.completed', 'Hoàn thành'),
      value: refundRequests.filter(r => r.status === "completed").length,
      amount: refundRequests.filter(r => r.status === "completed").reduce((sum, r) => sum + r.refundAmount, 0),
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: t('vendor.rejected', 'Đã từ chối'),
      value: refundRequests.filter(r => r.status === "rejected").length,
      amount: 0,
      icon: XCircle,
      color: "text-red-600"
    }
  ];

  // Handlers
  const handleViewDetails = (refund: VendorRefund) => {
    setSelectedRefund(refund);
    setIsDetailDialogOpen(true);
  };

  const handleDecision = async (refund: VendorRefund, approved: boolean) => {
    setSelectedRefund(refund);
    try {
      await vendorApi.setRefundDecision(refund.id, approved);
      toast.success(
        approved
          ? t('vendor.refundApproved', 'Đã đồng ý hoàn tiền')
          : t('vendor.refundRejected', 'Đã không đồng ý hoàn tiền')
      );
      setIsDetailDialogOpen(false);
      setSelectedRefund(null);
      await reloadRefunds();
    } catch (error) {
      toast.error(t('vendor.cannotApproveRefund', 'Không thể cập nhật quyết định hoàn tiền'));
    }
  };

  return (
    <VendorLayout
      currentPage="vendor-refunds"
      onNavigate={onNavigate}
      activePage="vendor-refunds"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('vendor.refundsManagement', 'Quản lý Hoàn tiền')}</h1>
          <p className="text-gray-600">{t('vendor.refundsSubtitle', 'Xử lý các yêu cầu hoàn tiền từ khách hàng')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              {stat.amount > 0 && (
                <div className="text-sm text-gray-600">
                  {stat.amount.toLocaleString('vi-VN')}đ
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('vendor.searchRefunds', 'Tìm kiếm theo mã booking, tên khách hàng...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending", "approved", "processing", "completed", "rejected"] as const).map((status) => (
                <Button
                  key={status}
                  variant={activeTab === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(status)}
                >
                  {status === "all" ? t('common.all', 'Tất cả') : STATUS_CONFIG[status as RefundStatus].label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Refund List */}
        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">{t('common.loading', 'Đang tải...')}</div>
          ) : filteredRefunds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('vendor.noRefunds', 'Không có yêu cầu hoàn tiền nào')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3">{t('vendor.bookingCode', 'Mã Booking')}</th>
                    <th className="pb-3">{t('vendor.service', 'Dịch vụ')}</th>
                    <th className="pb-3">{t('vendor.customer', 'Khách hàng')}</th>
                    <th className="pb-3">{t('vendor.amount', 'Số tiền')}</th>
                    <th className="pb-3">{t('vendor.requestDate', 'Ngày yêu cầu')}</th>
                    <th className="pb-3">{t('vendor.status', 'Trạng thái')}</th>
                    <th className="pb-3">{t('common.actions', 'Thao tác')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund) => {
                    const statusConfig = STATUS_CONFIG[refund.status];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={refund.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium">{refund.bookingCode}</div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span>{getServiceIcon(refund.serviceType)}</span>
                            <span className="text-sm">{refund.serviceName}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm">
                            <div className="font-medium">{refund.userName}</div>
                            <div className="text-gray-500">{refund.userEmail}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <div className="font-medium">{refund.refundAmount.toLocaleString('vi-VN')}đ</div>
                            <div className="text-xs text-gray-500">
                              {t('vendor.original', 'Gốc')}: {refund.originalAmount.toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm">
                            {new Date(refund.requestDate).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={`${statusConfig.color} flex items-center gap-1 w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </Badge>
                          {refund.vendorRefundApproved === true && (
                            <div className="text-xs text-green-600 mt-1">{t('vendor.vendorApproved', 'Bạn đã đồng ý hoàn tiền')}</div>
                          )}
                          {refund.vendorRefundApproved === false && (
                            <div className="text-xs text-red-600 mt-1">{t('vendor.vendorRejected', 'Bạn không đồng ý hoàn tiền')}</div>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(refund)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {refund.status === "pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={refund.vendorRefundApproved === true}
                                  onClick={() => handleDecision(refund, true)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={refund.vendorRefundApproved === false}
                                  onClick={() => handleDecision(refund, false)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <PaginationUI
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(p) => goToPage(p - 1)}
            />
          </div>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('vendor.refundDetails', 'Chi tiết yêu cầu hoàn tiền')}</DialogTitle>
            <DialogDescription>
              {t('vendor.refundDetailsDesc', 'Thông tin chi tiết về yêu cầu hoàn tiền')}
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('vendor.bookingCode', 'Mã Booking')}</p>
                    <p className="font-medium">{selectedRefund.bookingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('vendor.service', 'Dịch vụ')}</p>
                    <p className="font-medium">{selectedRefund.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('vendor.customer', 'Khách hàng')}</p>
                    <p className="font-medium">{selectedRefund.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('vendor.email', 'Email')}</p>
                    <p className="font-medium">{selectedRefund.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('vendor.originalAmount', 'Số tiền gốc')}</p>
                    <p className="font-medium">{selectedRefund.originalAmount.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('vendor.refundAmount', 'Số tiền hoàn')}</p>
                    <p className="font-medium text-green-600">{selectedRefund.refundAmount.toLocaleString('vi-VN')}đ</p>
                  </div>
                  {selectedRefund.penaltyAmount > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">{t('vendor.penaltyAmount', 'Phí phạt')}</p>
                      <p className="font-medium text-red-600">{selectedRefund.penaltyAmount.toLocaleString('vi-VN')}đ</p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-gray-600 mb-2">{t('vendor.reason', 'Lý do')}</p>
                <p className="text-sm">{selectedRefund.reason}</p>
              </Card>

              {selectedRefund.rejectionReason && (
                <Card className="p-4 bg-red-50">
                  <p className="text-sm text-gray-600 mb-2">{t('vendor.rejectionReason', 'Lý do từ chối')}</p>
                  <p className="text-sm text-red-900">{selectedRefund.rejectionReason}</p>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              {t('common.close', 'Đóng')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  );
}
