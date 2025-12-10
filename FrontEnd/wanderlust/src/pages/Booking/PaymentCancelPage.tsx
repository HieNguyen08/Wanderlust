import { ArrowLeft, Home, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";

const PENDING_PAYMENT_KEY = "wanderlust_pending_payment";

interface PaymentCancelPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function PaymentCancelPage({ onNavigate }: PaymentCancelPageProps) {
  const { t } = useTranslation();

  useEffect(() => {
    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="p-8 text-center max-w-md w-full">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-yellow-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('payment.cancelled', 'Thanh toán đã bị hủy')}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {t(
            'payment.cancelledDesc',
            'Giao dịch của bạn đã bị hủy. Đừng lo, không có khoản phí nào được thu.'
          )}
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-3">
            {t('payment.cancelReasons', 'Một số lý do có thể khiến thanh toán bị hủy:')}
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{t('payment.cancelReason1', 'Bạn đã chọn hủy giao dịch')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{t('payment.cancelReason2', 'Thời gian thanh toán đã hết')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>
                {t('payment.cancelReason3', 'Có lỗi xảy ra trong quá trình thanh toán')}
              </span>
            </li>
          </ul>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-600 mb-6">
          {t(
            'payment.cancelHelp',
            'Nếu bạn muốn tiếp tục đặt chỗ, vui lòng thử lại hoặc chọn phương thức thanh toán khác.'
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('payment.tryAgain', 'Thử lại')}
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

        {/* Support */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600">
            {t('payment.needHelp', 'Cần hỗ trợ?')}{' '}
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                // Navigate to support page or open support dialog
                onNavigate('home'); // Replace with actual support page
              }}
            >
              {t('payment.contactSupport', 'Liên hệ với chúng tôi')}
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
