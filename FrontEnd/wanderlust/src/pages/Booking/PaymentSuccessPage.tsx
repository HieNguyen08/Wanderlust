import { CheckCircle, Home, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { paymentApi } from "../../api/paymentApi";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";

interface PaymentSuccessPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  sessionId?: string; // From URL query param
  bookingId?: string; // From URL query param
}

export default function PaymentSuccessPage({
  onNavigate,
  sessionId,
  bookingId
}: PaymentSuccessPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get query params from URL
    const params = new URLSearchParams(window.location.search);
    const urlSessionId = params.get('session_id') || sessionId;
    const urlBookingId = params.get('booking_id') || bookingId;

    if (urlBookingId) {
      verifyPayment(urlBookingId);
    } else {
      setLoading(false);
    }
  }, [sessionId, bookingId]);

  const verifyPayment = async (bookingId: string) => {
    try {
      const payment = await paymentApi.getPaymentByBookingId(bookingId);
      setPaymentInfo(payment);
    } catch (err: any) {
      console.error('Failed to verify payment:', err);
      setError(err.message || 'Không thể xác minh thanh toán');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {t('payment.verifying', 'Đang xác minh thanh toán...')}
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('payment.verificationError', 'Không thể xác minh thanh toán')}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => onNavigate('profile-bookings')}>
              {t('payment.viewBookings', 'Xem đặt chỗ')}
            </Button>
            <Button variant="outline" onClick={() => onNavigate('home')}>
              {t('common.backHome', 'Về trang chủ')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="p-8 text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('payment.success', 'Thanh toán thành công!')} 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {t(
            'payment.successDesc',
            'Đặt chỗ của bạn đã được xác nhận. Bạn sẽ nhận được email xác nhận trong giây lát.'
          )}
        </p>

        {/* Payment Details */}
        {paymentInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('payment.transactionId', 'Mã giao dịch')}:
                </span>
                <span className="font-medium">{paymentInfo.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('payment.amount', 'Số tiền')}:
                </span>
                <span className="font-medium">
                  {paymentInfo.amount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('payment.method', 'Phương thức')}:
                </span>
                <span className="font-medium">
                  {paymentInfo.paymentMethod === 'STRIPE' && 'Stripe'}
                  {paymentInfo.paymentMethod === 'WALLET' && 'Ví Wanderlust'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <p className="font-medium text-blue-900 mb-3">
            {t('payment.nextSteps', 'Bước tiếp theo:')}
          </p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                {t('payment.step1', 'Kiểm tra email để xem thông tin chi tiết')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                {t('payment.step2', 'Chuẩn bị giấy tờ cần thiết theo yêu cầu')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                {t(
                  'payment.step3',
                  'Theo dõi trạng thái đặt chỗ trong mục "Lịch sử đặt chỗ"'
                )}
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1"
            onClick={() => onNavigate('profile-bookings')}
          >
            <Receipt className="w-4 h-4 mr-2" />
            {t('payment.viewBookings', 'Xem đặt chỗ của tôi')}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onNavigate('home')}
          >
            <Home className="w-4 h-4 mr-2" />
            {t('common.backHome', 'Về trang chủ')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
