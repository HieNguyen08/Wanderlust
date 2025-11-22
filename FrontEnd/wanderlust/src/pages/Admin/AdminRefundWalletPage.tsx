import {
    AlertTriangle,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Filter,
    Search,
    User,
    Wallet,
    XCircle
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import type { PageType } from "../../MainApp";

interface AdminRefundWalletPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface RefundRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerId: string;
  vendorName: string;
  vendorId: string;
  serviceName: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  vendorStrikes: number;
}

export default function AdminRefundWalletPage({ onNavigate }: AdminRefundWalletPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: "REF001",
      orderId: "#56789",
      customerName: "Nguyễn Văn A",
      customerId: "USER001",
      vendorName: "Golden Tours",
      vendorId: "VEN001",
      serviceName: "Tour Đà Lạt 3N2Đ",
      amount: 1000000,
      reason: "Dịch vụ không khả dụng do sự cố bất ngờ",
      status: "pending",
      createdAt: "2025-11-05 14:30:00",
      vendorStrikes: 2,
    },
    {
      id: "REF002",
      orderId: "#56787",
      customerName: "Trần Thị B",
      customerId: "USER002",
      vendorName: "Sky Travel",
      vendorId: "VEN002",
      serviceName: "Tour Phú Quốc 4N3Đ",
      amount: 1200000,
      reason: "Vượt quá khả năng phục vụ",
      status: "pending",
      createdAt: "2025-11-01 09:20:00",
      vendorStrikes: 1,
    },
    {
      id: "REF003",
      orderId: "#56785",
      customerName: "Lê Văn C",
      customerId: "USER003",
      vendorName: "Golden Tours",
      vendorId: "VEN001",
      serviceName: "Tour Sapa 2N1Đ",
      amount: 800000,
      reason: "Điều kiện thời tiết không cho phép",
      status: "approved",
      createdAt: "2025-10-28 16:45:00",
      processedAt: "2025-10-28 17:00:00",
      processedBy: "Admin Nguyen",
      vendorStrikes: 3,
    },
  ]);

  const filteredRequests = refundRequests.filter(req => {
    const matchesSearch = 
      req.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const pendingCount = refundRequests.filter(r => r.status === "pending").length;

  const handleViewDetails = (request: RefundRequest) => {
    setSelectedRequest(request);
    setActionType(null);
    setIsDialogOpen(true);
  };

  const handleApprove = (request: RefundRequest) => {
    setSelectedRequest(request);
    setActionType("approve");
    setIsDialogOpen(true);
  };

  const handleReject = (request: RefundRequest) => {
    setSelectedRequest(request);
    setActionType("reject");
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    setRefundRequests(prev => prev.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: actionType === "approve" ? "approved" : "rejected",
          processedAt: new Date().toLocaleString('vi-VN'),
          processedBy: "Admin (Bạn)",
        };
      }
      return req;
    }));

    // Simulate notification
    if (actionType === "approve") {
      alert(`✅ Đã duyệt hoàn tiền ${selectedRequest.amount.toLocaleString('vi-VN')}đ vào ví của ${selectedRequest.customerName}`);
    } else {
      alert(`❌ Đã từ chối yêu cầu hoàn tiền ${selectedRequest.orderId}`);
    }

    setIsDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />{t('admin.pending')}</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />{t('admin.approved')}</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />{t('admin.rejected')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="refund-wallet" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('admin.refundToWallet')}</h1>
            <p className="text-gray-600">
              {t('admin.refundToWalletDesc')}
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-red-600 text-lg px-4 py-2">
              {pendingCount} {t('admin.pendingRequests')}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('admin.pending')}</p>
                <p className="text-2xl text-gray-900">{refundRequests.filter(r => r.status === "pending").length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('admin.approved')}</p>
                <p className="text-2xl text-gray-900">{refundRequests.filter(r => r.status === "approved").length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('admin.rejected')}</p>
                <p className="text-2xl text-gray-900">{refundRequests.filter(r => r.status === "rejected").length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('admin.totalRefunded')}</p>
                <p className="text-2xl text-gray-900">
                  {(refundRequests.filter(r => r.status === "approved").reduce((sum, r) => sum + r.amount, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t('admin.searchOrderCustomerVendor')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('common.all')}
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                className={filterStatus === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                {t('admin.pending')}
              </Button>
              <Button
                variant={filterStatus === "approved" ? "default" : "outline"}
                onClick={() => setFilterStatus("approved")}
                className={filterStatus === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {t('admin.approved')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Refund Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-lg">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('admin.noRequests')}</p>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card 
                key={request.id} 
                className={`p-6 border-0 shadow-lg ${
                  request.status === "pending" ? "border-l-4 border-l-yellow-500" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-gray-900">{request.orderId}</h3>
                      {getStatusBadge(request.status)}
                      {request.status === "pending" && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {t('admin.urgent')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">{request.serviceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">{t('admin.refundAmount')}</p>
                    <p className="text-3xl text-blue-600">{request.amount.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">{t('admin.customer')}</p>
                      <p className="text-gray-900">{request.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">{t('admin.vendor')}</p>
                      <p className="text-gray-900">{request.vendorName}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {request.vendorStrikes} {t('admin.violations')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.cancellationReason')}:</p>
                  <p className="text-gray-900">{request.reason}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{request.createdAt}</span>
                    {request.processedAt && (
                      <>
                        <span>•</span>
                        <span>{t('admin.approved')}: {request.processedAt}</span>
                        <span>•</span>
                        <span>{request.processedBy}</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(request)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('common.details')}
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {t('admin.reject')}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('admin.approveRefund')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className={actionType === "approve" ? "text-green-600" : actionType === "reject" ? "text-red-600" : ""}>
              {actionType === "approve" && t('admin.confirmWalletRefund')}
              {actionType === "reject" && t('admin.confirmRejectRefund')}
              {!actionType && t('admin.refundRequestDetails')}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && t('admin.walletRefundNote')}
              {actionType === "reject" && t('admin.rejectRefundNote')}
              {!actionType && t('admin.refundRequestDetailsDesc')}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.orderId')}</p>
                  <p className="text-gray-900">{selectedRequest.orderId}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{t('common.service')}</p>
                  <p className="text-gray-900">{selectedRequest.serviceName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.customer')}</p>
                  <p className="text-gray-900">{selectedRequest.customerName}</p>
                  <p className="text-xs text-gray-500">ID: {selectedRequest.customerId}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.vendor')}</p>
                  <p className="text-gray-900">{selectedRequest.vendorName}</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedRequest.vendorStrikes} {t('admin.violations')}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">{t('admin.walletRefundAmount')}</p>
                <p className="text-3xl text-blue-600">{selectedRequest.amount.toLocaleString('vi-VN')}đ</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">{t('admin.cancellationReason')}:</p>
                <p className="text-gray-900">{selectedRequest.reason}</p>
              </div>

              {actionType === "approve" && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-green-900 mb-2">
                        <strong>{t('admin.walletRefundProcess')}:</strong>
                      </p>
                      <ol className="text-sm text-green-800 space-y-1">
                        <li>{t('admin.walletStep1')}</li>
                        <li>{t('admin.walletStep2')}</li>
                        <li>{t('admin.walletStep3')}</li>
                        <li>{t('admin.walletStep4')}</li>
                        <li>{t('admin.walletStep5')}</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {actionType ? t('common.cancel') : t('common.close')}
            </Button>
            {actionType && (
              <Button 
                onClick={confirmAction}
                className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                {actionType === "approve" ? t('admin.confirmApprove') : t('admin.confirmReject')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
