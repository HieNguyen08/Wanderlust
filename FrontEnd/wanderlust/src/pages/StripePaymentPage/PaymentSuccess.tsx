import { CheckCircle, Home, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNotification } from '../../contexts/NotificationContext';
import { transactionApi } from '../../utils/api';

interface TransactionInfo {
  amount: number;
  type: string;
  description: string;
  status: string;
}

const PaymentSuccess: React.FC = () => {
  const { addNotification } = useNotification();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | null>(null);

  useEffect(() => {
    // Lấy session_id từ URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    
    if (session) {
      setSessionId(session);
      // Đợi webhook xử lý xong (2-5 giây) rồi verify transaction
      setTimeout(async () => {
        try {
          // Lấy transaction mới nhất để verify
          const response = await transactionApi.getTransactions({ page: 0, size: 1 });
          if (response.content && response.content.length > 0) {
            const latestTxn = response.content[0];
            setTransactionInfo({
              amount: latestTxn.amount,
              type: latestTxn.type,
              description: latestTxn.description,
              status: latestTxn.status
            });

            // Tạo notification khi nạp tiền thành công
            if (latestTxn.type === 'CREDIT' && latestTxn.status === 'COMPLETED') {
              addNotification({
                type: 'wallet',
                title: 'Nạp Tiền Thành Công',
                message: `Bạn đã nạp ${latestTxn.amount.toLocaleString('vi-VN')}đ vào ví thành công!`,
                link: '/profile/wallet',
                data: {
                  transactionId: latestTxn.transactionId,
                  amount: latestTxn.amount
                }
              });
              
              // Update last transaction check
              localStorage.setItem('last_transaction_check', new Date().toISOString());
            }
          }
        } catch (error) {
          console.error('Failed to verify transaction:', error);
          toast.error('Không thể xác thực giao dịch, vui lòng kiểm tra ví của bạn');
        } finally {
          setIsProcessing(false);
        }
      }, 3000);
    } else {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
            <CheckCircle className="w-16 h-16 text-green-500 relative" />
          </div>
        </div>

        {/* Title and Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nạp Tiền Thành Công!
        </h1>
        <p className="text-gray-600 mb-6">
          {isProcessing 
            ? 'Đang xử lý giao dịch của bạn...'
            : 'Số tiền đã được cộng vào ví của bạn thành công!'
          }
        </p>

        {/* Transaction Info */}
        {transactionInfo && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Số tiền:</span>
              <span className="text-lg font-bold text-blue-600">
                {transactionInfo.amount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Loại giao dịch:</span>
              <span className="text-sm font-medium text-gray-800">
                {transactionInfo.type === 'CREDIT' ? 'Nạp tiền' : transactionInfo.description}
              </span>
            </div>
          </div>
        )}

        {/* Session ID (if available) */}
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">ID Phiên Thanh Toán:</p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Details Box */}
        <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Tiếp theo:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Số dư ví của bạn đã được cập nhật</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Giao dịch đã được lưu vào lịch sử</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Bạn có thể sử dụng ví để thanh toán ngay</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/profile/wallet'}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Xem Ví Của Tôi
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Quay Lại Trang Chủ
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-6">
          🔒 Giao dịch được bảo mật bởi Stripe. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
