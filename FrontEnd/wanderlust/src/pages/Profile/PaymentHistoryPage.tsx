import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  RefreshCw,
  Search,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getPaymentHistoryByUserId, PaymentHistoryItem } from '../../api/paymentApi';
import { ProfileLayout } from '../../components/ProfileLayout';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { PageType } from '../../MainApp';
import { tokenService } from '../../utils/api';
import { type FrontendRole } from '../../utils/roleMapper';

interface PaymentHistoryPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: FrontendRole | null;
  onLogout?: () => void;
}

export default function PaymentHistoryPage({ onNavigate, userRole, onLogout }: PaymentHistoryPageProps) {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const userData = tokenService.getUserData();
      const token = tokenService.getToken();
      
      console.log('🔍 Loading payment history for user:', userData);
      console.log('🔐 Token available:', !!token);

      if (!userData || !token) {
        toast.error(t('payment.notLoggedIn', 'Vui lòng đăng nhập để xem lịch sử'));
        return;
      }

      // Try userId first, then email (backend will resolve both)
      const userIdentifier = userData?.userId || userData?.id || userData?.email || userData?.sub;
      
      if (!userIdentifier) {
        toast.error(t('payment.notLoggedIn', 'Không tìm thấy thông tin người dùng'));
        return;
      }

      console.log('📞 Calling API with userIdentifier:', userIdentifier);
      const history = await getPaymentHistoryByUserId(userIdentifier);
      console.log('✅ Payment history loaded:', history);
      setPayments(Array.isArray(history) ? history : []);
    } catch (error: any) {
      console.error('❌ Failed to load payment history:', error);
      toast.error(t('payment.loadHistoryFailed', 'Không thể tải lịch sử thanh toán'));
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        (payment.transactionId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.bookingId || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
      COMPLETED: { label: t('payment.status.completed', 'Hoàn thành'), variant: 'default' },
      PENDING: { label: t('payment.status.pending', 'Đang xử lý'), variant: 'secondary' },
      FAILED: { label: t('payment.status.failed', 'Thất bại'), variant: 'destructive' },
      REFUNDED: { label: t('payment.status.refunded', 'Đã hoàn tiền'), variant: 'outline' },
      CANCELLED: { label: t('payment.status.cancelled', 'Đã hủy'), variant: 'outline' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REFUNDED':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case 'CANCELLED':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatAmount = (amount: string | number | undefined, currency: string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(numAmount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleViewDetails = (payment: PaymentHistoryItem) => {
    setSelectedPayment(payment);
    setShowDetailDialog(true);
  };

  return (
    <ProfileLayout
      activePage="payment-history"
      currentPage="payment-history"
      onNavigate={onNavigate}
      userRole={userRole}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('payment.history.title', 'Lịch sử thanh toán')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('payment.history.description', 'Xem tất cả các giao dịch thanh toán của bạn')}
            </p>
          </div>
          <Button onClick={loadPaymentHistory} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('payment.refresh', 'Làm mới')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('payment.search', 'Tìm theo mã giao dịch hoặc booking')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('payment.filterStatus', 'Lọc theo trạng thái')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('payment.allStatus', 'Tất cả trạng thái')}</SelectItem>
                <SelectItem value="COMPLETED">{t('payment.status.completed', 'Hoàn thành')}</SelectItem>
                <SelectItem value="PENDING">{t('payment.status.pending', 'Đang xử lý')}</SelectItem>
                <SelectItem value="FAILED">{t('payment.status.failed', 'Thất bại')}</SelectItem>
                <SelectItem value="REFUNDED">{t('payment.status.refunded', 'Đã hoàn tiền')}</SelectItem>
                <SelectItem value="CANCELLED">{t('payment.status.cancelled', 'Đã hủy')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Method Filter */}
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('payment.filterMethod', 'Lọc theo phương thức')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('payment.allMethods', 'Tất cả phương thức')}</SelectItem>
                <SelectItem value="STRIPE">Stripe</SelectItem>
                <SelectItem value="WALLET">{t('payment.wallet', 'Ví điện tử')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Payment List */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('payment.loading', 'Đang tải lịch sử...')}</p>
          </Card>
        ) : filteredPayments.length === 0 ? (
          <Card className="p-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('payment.noHistory', 'Chưa có giao dịch nào')}
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' || methodFilter !== 'all'
                ? t('payment.noResults', 'Không tìm thấy giao dịch phù hợp')
                : t('payment.noHistoryDesc', 'Các giao dịch của bạn sẽ hiển thị ở đây')}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {/* Status Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      {getStatusIcon(payment.status)}
                    </div>

                    {/* Payment Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </h3>
                        {getStatusBadge(payment.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>{payment.paymentMethod}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-mono text-xs">{payment.transactionId}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(payment.createdAt)}</span>
                          {payment.paidAt && payment.status === 'COMPLETED' && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-green-600">
                                {t('payment.paidAt', 'Thanh toán lúc')} {formatDate(payment.paidAt)}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          {t('payment.bookingId', 'Mã đặt chỗ')}: {payment.bookingId}
                        </div>
                        {payment.discountAmount ? (
                          <div className="text-xs text-green-600">
                            {t('payment.discount', 'Giảm giá')}: {formatAmount(payment.discountAmount, payment.currency)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(payment)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      {t('payment.viewDetails', 'Chi tiết')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && filteredPayments.length > 0 && (
          <Card className="p-4 bg-gray-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {t('payment.totalTransactions', 'Tổng số giao dịch')}: <strong>{filteredPayments.length}</strong>
              </span>
              <span className="text-gray-600">
                {t('payment.totalAmount', 'Tổng giá trị')}: {' '}
                <strong className="text-blue-600">
                  {formatAmount(
                    filteredPayments.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : parseFloat(p.amount)), 0),
                    'VND'
                  )}
                </strong>
              </span>
            </div>
          </Card>
        )}
      </div>

      {/* Payment Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('payment.transactionDetails', 'Chi tiết giao dịch')}</DialogTitle>
            <DialogDescription>
              {t('payment.transactionId', 'Mã giao dịch')}: {selectedPayment?.transactionId}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedPayment.status)}
                  <div>
                    <p className="text-sm text-gray-600">{t('payment.status', 'Trạng thái')}</p>
                    <p className="font-medium">{getStatusBadge(selectedPayment.status)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{t('payment.amount', 'Số tiền')}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatAmount(selectedPayment.amount ?? selectedPayment.originalAmount, selectedPayment.currency)}
                  </p>
                  {selectedPayment.discountAmount ? (
                    <p className="text-xs text-green-600">
                      {t('payment.discount', 'Giảm giá')}: {formatAmount(selectedPayment.discountAmount, selectedPayment.currency)}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('payment.bookingId', 'Mã đặt chỗ')}</p>
                  <p className="font-mono text-sm">{selectedPayment.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('payment.paymentMethod', 'Phương thức')}</p>
                  <p className="font-medium">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('payment.createdAt', 'Ngày tạo')}</p>
                  <p className="text-sm">{formatDate(selectedPayment.createdAt)}</p>
                </div>
                {selectedPayment.paidAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('payment.paidAt', 'Ngày thanh toán')}</p>
                    <p className="text-sm">{formatDate(selectedPayment.paidAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('payment.userEmail', 'Email')}</p>
                  <p className="text-sm">{selectedPayment.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('payment.currency', 'Đơn vị tiền tệ')}</p>
                  <p className="text-sm">{selectedPayment.currency}</p>
                </div>
              </div>

              {/* Gateway Transaction ID */}
              {selectedPayment.gatewayTransactionId && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    {t('payment.gatewayTransactionId', 'Mã giao dịch cổng thanh toán')}
                  </p>
                  <p className="font-mono text-xs text-blue-800 break-all">
                    {selectedPayment.gatewayTransactionId}
                  </p>
                </div>
              )}

              {/* Metadata */}
              {selectedPayment.metadata?.paymentUrl && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(selectedPayment.metadata?.paymentUrl, '_blank')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('payment.viewPaymentPage', 'Xem trang thanh toán')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
}
