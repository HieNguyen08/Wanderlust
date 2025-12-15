import { AlertCircle, CheckCircle, Clock, Eye, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { vendorApi, type VendorRefund } from '../../api/vendorApi';
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
import { Textarea } from '../../components/ui/textarea';
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
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [refundRequests, setRefundRequests] = useState<VendorRefund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const data = await vendorApi.getVendorRefunds();

      const normalizeStatus = (status?: string): RefundStatus => {
        const lower = (status || '').toLowerCase();
        if (lower === 'refund_requested' || lower === 'pending') return 'pending';
        if (lower === 'refund_approved' || lower === 'approved') return 'approved';
        if (lower === 'refund_processing' || lower === 'processing') return 'processing';
        if (lower === 'refund_completed' || lower === 'completed') return 'completed';
        if (lower === 'refund_rejected' || lower === 'rejected') return 'rejected';
        return 'pending';
      };

      const toNumber = (value: any) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
      };

      const mapped = data.map((item: any) => {
        const guestInfo = item.guestInfo || item.metadata?.contactInfo || {};
        return {
          id: item.transactionId || item.refundId || item.id,
          bookingId: item.bookingId || item.id,
          bookingCode: item.bookingCode || '',
          serviceType: (item.serviceType || item.bookingType || 'HOTEL').toUpperCase(),
          serviceName: item.serviceName || item.metadata?.serviceName || item.flightId || '',
          userId: item.userId || '',
          userName: item.userName || guestInfo.fullName || '',
          userEmail: item.userEmail || guestInfo.email || '',
          vendorName: item.vendorName || item.vendor?.name || '',
          originalAmount: toNumber(item.originalAmount ?? item.totalPrice ?? item.amount),
          refundPercentage: item.refundPercentage || 100,
          refundAmount: toNumber(item.refundAmount ?? item.amount ?? item.totalPrice),
          penaltyAmount: toNumber(item.penaltyAmount),
          requestDate: item.requestDate || item.createdAt || item.bookingDate || new Date().toISOString(),
          status: normalizeStatus(item.status),
          reason: item.reason || item.cancellationReason || '',
          paymentMethod: item.paymentMethod || 'WALLET',
          transactionId: item.transactionId || item.id,
          processedBy: item.processedBy,
          processedAt: item.processedAt,
          rejectionReason: item.rejectionReason,
        } as VendorRefund;
      });

      setRefundRequests(mapped);
    } catch (error) {
      console.error("Failed to load refunds:", error);
      toast.error(t('vendor.cannotLoadRefunds', 'Không thể tải danh sách hoàn tiền'));
    } finally {
      setLoading(false);
    }
  };

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
  const filteredRefunds = refundRequests.filter(refund => {
    const matchStatus = activeTab === "all" || refund.status === activeTab;
    const matchSearch = searchQuery === "" || 
      refund.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

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

  const handleApproveClick = (refund: VendorRefund) => {
    setSelectedRefund(refund);
    setIsApproveDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRefund) return;
    
    try {
      await vendorApi.approveRefund(selectedRefund.id);
      toast.success(t('vendor.refundApproved', 'Đã phê duyệt yêu cầu hoàn tiền'));
      setIsApproveDialogOpen(false);
      setSelectedRefund(null);
      loadRefunds(); // Reload
    } catch (error) {
      toast.error(t('vendor.cannotApproveRefund', 'Không thể phê duyệt hoàn tiền'));
    }
  };

  const handleRejectClick = (refund: VendorRefund) => {
    setSelectedRefund(refund);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRefund) return;
    if (!rejectionReason.trim()) {
      toast.error(t('vendor.enterRejectionReason', 'Vui lòng nhập lý do từ chối'));
      return;
    }
    
    try {
      await vendorApi.rejectRefund(selectedRefund.id, rejectionReason);
      toast.success(t('vendor.refundRejected', 'Đã từ chối yêu cầu hoàn tiền'));
      setIsRejectDialogOpen(false);
      setSelectedRefund(null);
      setRejectionReason("");
      loadRefunds(); // Reload
    } catch (error) {
      toast.error(t('vendor.cannotRejectRefund', 'Không thể từ chối hoàn tiền'));
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
                                  onClick={() => handleApproveClick(refund)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRejectClick(refund)}
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

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vendor.confirmApprove', 'Xác nhận phê duyệt')}</DialogTitle>
            <DialogDescription>
              {t('vendor.confirmApproveDesc', 'Bạn có chắc chắn muốn phê duyệt yêu cầu hoàn tiền này?')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <Card className="p-4 bg-green-50">
              <p className="text-sm mb-2">
                <strong>{t('vendor.bookingCode', 'Mã Booking')}:</strong> {selectedRefund.bookingCode}
              </p>
              <p className="text-sm mb-2">
                <strong>{t('vendor.refundAmount', 'Số tiền hoàn')}:</strong>{' '}
                <span className="text-green-600 font-bold">{selectedRefund.refundAmount.toLocaleString('vi-VN')}đ</span>
              </p>
              <p className="text-sm text-gray-600 mt-3">
                {t('vendor.approveNote', 'Sau khi phê duyệt, yêu cầu sẽ được chuyển sang Admin xử lý thanh toán.')}
              </p>
            </Card>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              {t('common.cancel', 'Hủy')}
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleConfirmApprove}
            >
              {t('vendor.approve', 'Phê duyệt')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vendor.confirmReject', 'Xác nhận từ chối')}</DialogTitle>
            <DialogDescription>
              {t('vendor.confirmRejectDesc', 'Vui lòng nhập lý do từ chối yêu cầu hoàn tiền')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRefund && (
              <Card className="p-4 bg-red-50">
                <p className="text-sm mb-2">
                  <strong>{t('vendor.bookingCode', 'Mã Booking')}:</strong> {selectedRefund.bookingCode}
                </p>
                <p className="text-sm">
                  <strong>{t('vendor.customer', 'Khách hàng')}:</strong> {selectedRefund.userName}
                </p>
              </Card>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('vendor.rejectionReason', 'Lý do từ chối')}
              </label>
              <Textarea
                placeholder={t('vendor.enterRejectionReason', 'Nhập lý do từ chối...')}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              {t('common.cancel', 'Hủy')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim()}
            >
              {t('vendor.reject', 'Từ chối')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  );
}
