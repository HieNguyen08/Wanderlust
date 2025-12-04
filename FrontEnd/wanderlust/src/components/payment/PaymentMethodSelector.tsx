import { CreditCard, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PaymentMethod } from "../../api/paymentApi";
import { walletApi } from "../../utils/api";
import { Card } from "../ui/card";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  amount: number;
  showWallet?: boolean; // For wallet top-up, don't show wallet as payment option
  disabled?: boolean;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  amount,
  showWallet = true,
  disabled = false
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loadingWallet, setLoadingWallet] = useState(true);

  useEffect(() => {
    if (showWallet) {
      loadWalletBalance();
    }
  }, [showWallet]);

  const loadWalletBalance = async () => {
    try {
      const wallet = await walletApi.getMyWallet();
      setWalletBalance(wallet.balance || 0);
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const hasInsufficientBalance = showWallet && walletBalance < amount;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {t('payment.selectMethod', 'Chọn phương thức thanh toán')}
      </h3>

      {/* Wallet */}
      {showWallet && (
        <Card
          className={`p-4 cursor-pointer transition-all ${
            selectedMethod === 'WALLET'
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
              : 'hover:border-gray-300'
          } ${hasInsufficientBalance ? 'opacity-50 cursor-not-allowed' : ''} ${disabled ? 'pointer-events-none opacity-60' : ''}`}
          onClick={() => {
            if (!disabled && !hasInsufficientBalance) {
              onMethodChange('WALLET');
            }
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t('payment.wallet', 'Ví Wanderlust')}
              </p>
              <p className="text-sm text-gray-500">
                {loadingWallet
                  ? t('payment.loadingBalance', 'Đang tải...')
                  : t('payment.balance', 'Số dư: {{amount}}', {
                      amount: walletBalance.toLocaleString('vi-VN') + 'đ'
                    })}
              </p>
              {hasInsufficientBalance && (
                <p className="text-sm text-red-500 mt-1">
                  {t('payment.insufficientBalance', 'Số dư không đủ. Vui lòng nạp thêm tiền.')}
                </p>
              )}
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedMethod === 'WALLET' ? 'border-blue-600' : 'border-gray-300'
              }`}
            >
              {selectedMethod === 'WALLET' && (
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
              )}
            </div>
          </div>
        </Card>
      )}

      {/* MoMo */}
      <Card
        className={`p-4 cursor-pointer transition-all ${
          selectedMethod === 'MOMO'
            ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200'
            : 'hover:border-gray-300'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        onClick={() => !disabled && onMethodChange('MOMO')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" fill="#A50064" />
              <text
                x="24"
                y="30"
                fontSize="16"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
              >
                M
              </text>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">{t('payment.momo', 'MoMo E-Wallet')}</p>
            <p className="text-sm text-gray-500">
              {t('payment.momoDesc', 'Thanh toán qua ví MoMo (Test Mode)')}
            </p>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'MOMO' ? 'border-pink-600' : 'border-gray-300'
            }`}
          >
            {selectedMethod === 'MOMO' && (
              <div className="w-3 h-3 bg-pink-600 rounded-full" />
            )}
          </div>
        </div>
      </Card>

      {/* Stripe */}
      <Card
        className={`p-4 cursor-pointer transition-all ${
          selectedMethod === 'STRIPE'
            ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
            : 'hover:border-gray-300'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        onClick={() => !disabled && onMethodChange('STRIPE')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {t('payment.stripe', 'Credit / Debit Card (Stripe)')}
            </p>
            <p className="text-sm text-gray-500">
              {t('payment.stripeDesc', 'Thanh toán bằng thẻ quốc tế (Demo Mode)')}
            </p>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'STRIPE' ? 'border-purple-600' : 'border-gray-300'
            }`}
          >
            {selectedMethod === 'STRIPE' && (
              <div className="w-3 h-3 bg-purple-600 rounded-full" />
            )}
          </div>
        </div>
      </Card>

      {/* Test Card Info for Stripe (only in development) */}
      {selectedMethod === 'STRIPE' && process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 mb-2">
            ⚠️ {t('payment.testMode', 'Chế độ Test')}
          </p>
          <p className="text-xs text-yellow-700">
            {t('payment.testCardInfo', 'Dùng thẻ test: 4242 4242 4242 4242, Expiry: 12/28, CVC: 123')}
          </p>
        </div>
      )}

      {/* Test Info for MoMo */}
      {selectedMethod === 'MOMO' && process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
          <p className="text-sm font-medium text-pink-800 mb-2">
            ⚠️ {t('payment.testMode', 'Chế độ Test')}
          </p>
          <p className="text-xs text-pink-700">
            {t('payment.testMomoInfo', 'Đây là môi trường test MoMo. Giao dịch sẽ được giả lập.')}
          </p>
        </div>
      )}
    </div>
  );
}
