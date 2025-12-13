import { ArrowLeft, Home, MessageCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../utils/api';

const PaymentCancel: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Lấy session_id và booking_id từ URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    const booking = urlParams.get('booking_id');
    
    if (session) {
      setSessionId(session);
    }
    const isTopUpFlow = booking?.startsWith('TOPUP-') ?? false;
    if (booking && !isTopUpFlow) {
      setBookingId(booking);
      
      // Cập nhật trạng thái booking thành FAILED
      markBookingAsFailed(booking);
    }
    
    // Log cancel event for analytics
    if (session || booking) {
      console.warn('Payment cancelled - Session ID:', session, 'Booking ID:', booking);
      
      try {
        const cancelData = {
          sessionId: session,
          bookingId: booking,
          timestamp: new Date().toISOString(),
          page: 'stripe-payment-cancel'
        };
        localStorage.setItem('last_payment_cancel', JSON.stringify(cancelData));
      } catch (error) {
        console.error('Failed to log cancel event:', error);
      }
    }
  }, []);

  const markBookingAsFailed = async (bookingCode: string) => {
    try {
      await bookingApi.updateBooking(bookingCode, {
        paymentStatus: 'FAILED',
        status: 'PENDING', // Giữ status là PENDING (có thể retry thanh toán)
        paymentMethod: 'STRIPE'
      });
      console.log('✅ Booking payment status updated to FAILED, status kept as PENDING');
    } catch (error) {
      console.error('❌ Failed to update booking payment status:', error);
    }
  };

  const handleRetryPayment = () => {
    // Quay lại trang nạp tiền
    window.location.href = '/profile/topup-wallet';
  };

  const handleContactSupport = () => {
    // Liên hệ hỗ trợ
    window.location.href = '/contact-support';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
            <XCircle className="w-16 h-16 text-red-500 relative" />
          </div>
        </div>

        {/* Title and Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nạp Tiền Bị Hủy
        </h1>
        <p className="text-gray-600 mb-6">
          Giao dịch nạp tiền ví của bạn chưa được hoàn tất. Bạn có thể thử lại hoặc liên hệ hỗ trợ.
        </p>

        {/* Session ID (if available) */}
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">ID Phiên Thanh Toán:</p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Reasons Box */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Lý do hủy có thể là:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Bạn đã hủy giao dịch</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Kết nối bị gián đoạn</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Vấn đề về phương thức thanh toán</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Hết thời gian phiên làm việc</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Thử Lại Thanh Toán
          </button>
          <button
            onClick={handleContactSupport}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Liên Hệ Hỗ Trợ
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Quay Lại Trang Chủ
          </button>
        </div>

        {/* Support Note */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6 text-left">
          <p className="text-sm text-blue-900">
            <strong>Cần giúp đỡ?</strong> Đội hỗ trợ của chúng tôi sẵn sàng giúp bạn 24/7.
            Vui lòng liên hệ qua email hoặc chat trực tiếp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
