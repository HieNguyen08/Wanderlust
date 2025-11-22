import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    Search,
    User,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AdminLayout } from "../../components/AdminLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import type { PageType } from "../../MainApp";
import { adminWalletApi } from "../../utils/api";

interface AdminRefundsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

type RefundStatus = "pending" | "approved" | "processing" | "completed" | "rejected";

interface RefundRequest {
  id: string;
  bookingId: string;
  bookingCode: string;
  serviceType: string;
  serviceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  vendorName: string;
  originalAmount: number;
  refundPercentage: number;
  refundAmount: number;
  requestDate: string;
  status: RefundStatus;
  cancellationReason?: string;
  paymentMethod: string;
  transactionId: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  estimatedCompletionDate?: string;
}

export default function AdminRefundsPage({ onNavigate }: AdminRefundsPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<RefundStatus | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const data = await adminWalletApi.getPendingRefunds(0, 100);
      // Map backend data to frontend format
      const mappedRefunds = data.content?.map((item: any) => ({
        id: item.transactionId || item.id,
        bookingId: item.bookingId || '',
        bookingCode: item.bookingCode || '',
        serviceType: item.serviceType || 'hotel',
        serviceName: item.serviceName || '',
        userId: item.userId || '',
        userName: item.userName || '',
        userEmail: item.userEmail || '',
        vendorName: item.vendorName || '',
        originalAmount: item.originalAmount || item.amount || 0,
        refundPercentage: item.refundPercentage || 100,
        refundAmount: item.refundAmount || item.amount || 0,
        requestDate: item.requestDate || item.createdAt || new Date().toISOString(),
        status: (item.status?.toLowerCase() || 'pending') as RefundStatus,
        cancellationReason: item.reason || item.cancellationReason,
        paymentMethod: item.paymentMethod || 'VNPay',
        transactionId: item.transactionId || item.id,
        processedBy: item.processedBy,
        processedAt: item.processedAt,
        rejectionReason: item.rejectionReason,
        estimatedCompletionDate: item.estimatedCompletionDate,
      })) || [];
      setRefundRequests(mappedRefunds);
    } catch (error) {
      console.error('Error loading refunds:', error);
      toast.error(t('admin.cannotLoadRefunds'));
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  const STATUS_CONFIG: Record<RefundStatus, { label: string; color: string; icon: any }> = {
    pending: {
      label: t('admin.pending'),
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock
    },
    approved: {
      label: t('admin.approved'),
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle
    },
    processing: {
      label: t('admin.processing'),
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: AlertCircle
    },
    completed: {
      label: t('admin.completed'),
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle
    },
    rejected: {
      label: t('admin.rejected'),
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle
    }
  };

  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      flight: "✈️",
      hotel: "🏨",
      car: "🚗",
      activity: "🎫",
      visa: "📄"
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
      label: t('admin.pendingApproval'),
      value: refundRequests.filter(r => r.status === "pending").length,
      amount: refundRequests.filter(r => r.status === "pending").reduce((sum, r) => sum + r.refundAmount, 0),
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      label: t('admin.processing'),
      value: refundRequests.filter(r => r.status === "approved" || r.status === "processing").length,
      amount: refundRequests.filter(r => r.status === "approved" || r.status === "processing").reduce((sum, r) => sum + r.refundAmount, 0),
      icon: AlertCircle,
      color: "text-blue-600"
    },
    {
      label: t('admin.completed'),
      value: refundRequests.filter(r => r.status === "completed").length,
      amount: refundRequests.filter(r => r.status === "completed").reduce((sum, r) => sum + r.refundAmount, 0),
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: t('admin.rejected'),
      value: refundRequests.filter(r => r.status === "rejected").length,
      amount: 0,
      icon: XCircle,
      color: "text-red-600"
    }
  ];

  // Handlers
  const handleViewDetails = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsDetailDialogOpen(true);
  };

  const handleApproveClick = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsApproveDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRefund) return;
    
    try {
      await adminWalletApi.approveRefund(
        selectedRefund.transactionId,
        `Approved by admin - Booking ${selectedRefund.bookingCode}`
      );
      toast.success(t('admin.refundApproved', { code: selectedRefund.bookingCode }));
      setIsApproveDialogOpen(false);
      loadRefunds(); // Reload data
    } catch (error) {
      console.error('Error approving refund:', error);
      toast.error(t('admin.cannotApproveRefund'));
    }
  };

  const handleRejectClick = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRefund) return;
    if (!rejectionReason.trim()) {
      toast.error(t('admin.pleaseEnterRejectionReason'));
      return;
    }
    
    try {
      await adminWalletApi.rejectRefund(selectedRefund.transactionId, rejectionReason);
      toast.success(t('admin.refundRejected', { code: selectedRefund.bookingCode }));
      setIsRejectDialogOpen(false);
      loadRefunds(); // Reload data
    } catch (error) {
      console.error('Error rejecting refund:', error);
      toast.error(t('admin.cannotRejectRefund'));
    }
  };

  const handleExport = () => {
    alert("Đang xuất báo cáo hoàn tiền...");
  };

  return (
    <AdminLayout currentPage="admin-refunds" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('admin.manageRefunds')}</h1>
            <p className="text-gray-600">{t('admin.manageRefundsDesc')}</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('admin.exportReport')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                {stat.amount > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">{t('admin.totalValue')}</p>
                    <p className="text-sm">{stat.amount.toLocaleString('vi-VN')}đ</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t('admin.searchRefunds')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full mb-6">
              <TabsTrigger value="all">
                {t('common.all')} ({refundRequests.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                <Clock className="w-4 h-4 mr-1" />
                {t('admin.pending')}
              </TabsTrigger>
              <TabsTrigger value="approved">
                <CheckCircle className="w-4 h-4 mr-1" />
                {t('admin.approved')}
              </TabsTrigger>
              <TabsTrigger value="processing">
                <AlertCircle className="w-4 h-4 mr-1" />
                {t('admin.processing')}
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="w-4 h-4 mr-1" />
                {t('admin.completed')}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                <XCircle className="w-4 h-4 mr-1" />
                {t('admin.rejected')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredRefunds.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">{t('admin.noRefundRequests')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs text-gray-600">{t('admin.bookingCode')}</th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600">{t('common.service')}</th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600">{t('admin.customer')}</th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600">{t('admin.refundAmount')}</th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600">{t('admin.requestDate')}</th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600">{t('common.status')}</th>
                          <th className="px-4 py-3 text-right text-xs text-gray-600">{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredRefunds.map((refund) => {
                          const StatusIcon = STATUS_CONFIG[refund.status].icon;
                          return (
                            <tr key={refund.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{getServiceIcon(refund.serviceType)}</span>
                                  <div>
                                    <p className="text-sm">{refund.bookingCode}</p>
                                    <p className="text-xs text-gray-500">{refund.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm max-w-xs truncate">{refund.serviceName}</p>
                                <p className="text-xs text-gray-500">{refund.vendorName}</p>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm">{refund.userName}</p>
                                <p className="text-xs text-gray-500">{refund.userEmail}</p>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <p className="text-sm">{refund.refundAmount.toLocaleString('vi-VN')}đ</p>
                                  <p className="text-xs text-gray-500">
                                    {refund.refundPercentage}% / {refund.originalAmount.toLocaleString('vi-VN')}đ
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm">{refund.requestDate}</p>
                              </td>
                              <td className="px-4 py-4">
                                <Badge className={`${STATUS_CONFIG[refund.status].color} border`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {STATUS_CONFIG[refund.status].label}
                                </Badge>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetails(refund)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {refund.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApproveClick(refund)}
                                      >
                                        {t('admin.approve')}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRejectClick(refund)}
                                      >
                                        {t('admin.reject')}
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
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.refundRequestDetails')} - {selectedRefund?.id}</DialogTitle>
            <DialogDescription>
              {t('admin.refundRequestDetailsDesc')}
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              {/* Status */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('common.status')}</p>
                    <Badge className={`${STATUS_CONFIG[selectedRefund.status].color} border mt-1`}>
                      {STATUS_CONFIG[selectedRefund.status].label}
                    </Badge>
                  </div>
                  {selectedRefund.estimatedCompletionDate && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{t('admin.estimatedCompletion')}</p>
                      <p className="text-sm">{selectedRefund.estimatedCompletionDate}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Booking Info */}
              <Card className="p-4">
                <h4 className="mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {t('admin.bookingInfo')}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">{t('admin.bookingCode')}</p>
                    <p>{selectedRefund.bookingCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('admin.serviceType')}</p>
                    <p>{getServiceIcon(selectedRefund.serviceType)} {selectedRefund.serviceType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">{t('admin.serviceName')}</p>
                    <p>{selectedRefund.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('admin.vendor')}</p>
                    <p>{selectedRefund.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('admin.requestDate')}</p>
                    <p>{selectedRefund.requestDate}</p>
                  </div>
                </div>
              </Card>

              {/* Customer Info */}
              <Card className="p-4">
                <h4 className="mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  {t('admin.customerInfo')}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">{t('admin.fullName')}</p>
                    <p>{selectedRefund.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('common.email')}</p>
                    <p>{selectedRefund.userEmail}</p>
                  </div>
                </div>
              </Card>

              {/* Payment Info */}
              <Card className="p-4">
                <h4 className="mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  {t('admin.paymentAndRefundInfo')}
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">{t('admin.paymentMethod')}</p>
                      <p>{selectedRefund.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('admin.transactionId')}</p>
                      <p className="text-xs">{selectedRefund.transactionId}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('admin.originalBookingValue')}</span>
                      <span>{selectedRefund.originalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('admin.refundPercentage')}</span>
                      <span>{selectedRefund.refundPercentage}%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span>{t('admin.refundAmount')}</span>
                      <span className="text-xl text-green-600">
                        {selectedRefund.refundAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Processing Info */}
              {(selectedRefund.processedBy || selectedRefund.rejectionReason) && (
                <Card className="p-4">
                  <h4 className="mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    {t('admin.processingInfo')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {selectedRefund.processedBy && (
                      <>
                        <div>
                          <p className="text-gray-600">{t('admin.processedBy')}</p>
                          <p>{selectedRefund.processedBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('admin.processingTime')}</p>
                          <p>{selectedRefund.processedAt}</p>
                        </div>
                      </>
                    )}
                    {selectedRefund.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                        <p className="text-gray-600 mb-1">{t('admin.rejectionReason')}</p>
                        <p className="text-red-900">{selectedRefund.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Important Notes */}
              <Card className="p-4 bg-amber-50 border-amber-200">
                <h4 className="mb-2 flex items-center gap-2 text-amber-900">
                  <AlertCircle className="w-4 h-4" />
                  {t('admin.importantNotes')}
                </h4>
                <ul className="space-y-1 text-sm text-amber-900">
                  <li>• {t('admin.refundNote1')}</li>
                  <li>• {t('admin.refundNote2', { amount: selectedRefund.refundAmount.toLocaleString('vi-VN') })}</li>
                  <li>• {t('admin.refundNote3')}</li>
                  <li>• {t('admin.refundNote4')}</li>
                </ul>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.confirmApproveRefund')}</DialogTitle>
            <DialogDescription>
              {t('admin.confirmApproveRefundDesc')}
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm mb-2">{t('admin.bookingCode')}: {selectedRefund.bookingCode}</p>
                <p className="text-sm mb-2">{t('admin.customer')}: {selectedRefund.userName}</p>
                <p className="text-sm">{t('admin.refundAmount')}: <span className="text-lg">{selectedRefund.refundAmount.toLocaleString('vi-VN')}đ</span></p>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <p className="text-sm text-green-900 mb-2">{t('admin.systemWillAutoExecute')}:</p>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>✓ {t('admin.approveAction1', { method: selectedRefund.paymentMethod })}</li>
                  <li>✓ {t('admin.approveAction2')}</li>
                  <li>✓ {t('admin.approveAction3', { vendor: selectedRefund.vendorName })}</li>
                  <li>✓ {t('admin.approveAction4', { amount: selectedRefund.refundAmount.toLocaleString('vi-VN') })}</li>
                  <li>✓ {t('admin.approveAction5')}</li>
                </ul>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmApprove}>
              {t('admin.confirmApprove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.rejectRefundRequest')}</DialogTitle>
            <DialogDescription>
              {t('admin.rejectRefundRequestDesc')}
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              <Card className="p-4 bg-red-50 border-red-200">
                <p className="text-sm mb-2">{t('admin.bookingCode')}: {selectedRefund.bookingCode}</p>
                <p className="text-sm">{t('admin.customer')}: {selectedRefund.userName}</p>
              </Card>

              <div>
                <Label htmlFor="rejection-reason">{t('admin.rejectionReason')} *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder={t('admin.enterRejectionReason')}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject}>
              {t('admin.confirmReject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
