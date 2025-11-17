import {
    ArrowLeft,
    CheckCircle,
    CreditCard,
    Shield,
    Smartphone,
    TrendingUp,
    Zap
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import type { PageType } from "../../MainApp";

interface TopUpWalletPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TopUpWalletPage({ onNavigate }: TopUpWalletPageProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "momo" | "vnpay" | null>(null);
  const [currentBalance] = useState(2450000);

  const quickAmounts = [
    { value: 100000, label: "100.000đ" },
    { value: 200000, label: "200.000đ" },
    { value: 500000, label: "500.000đ" },
    { value: 1000000, label: "1.000.000đ" },
    { value: 2000000, label: "2.000.000đ" },
    { value: 5000000, label: "5.000.000đ" },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: t('topUp.creditCard'),
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      badge: t('topUp.popular'),
    },
    {
      id: "momo",
      name: t('topUp.momo'),
      description: t('topUp.momoDesc', 'Thanh toán qua ứng dụng MoMo'),
      icon: Smartphone,
      badge: t('topUp.fastest'),
    },
    {
      id: "vnpay",
      name: t('topUp.vnpay'),
      description: t('topUp.vnpayDesc', 'Quét mã QR để thanh toán'),
      icon: Smartphone,
      badge: null,
    },
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = () => {
    if (!amount || !selectedMethod) {
      alert(t('topUp.selectAmountAndMethod', 'Vui lòng nhập số tiền và chọn phương thức thanh toán'));
      return;
    }

    const numAmount = parseInt(amount);
    if (numAmount < 10000) {
      alert(t('topUp.minAmountError', 'Số tiền nạp tối thiểu là 10.000đ'));
      return;
    }
    if (numAmount > 50000000) {
      alert(t('topUp.maxAmountError', 'Số tiền nạp tối đa là 50.000.000đ'));
      return;
    }

    // Simulate payment processing
    alert(`✅ ${t('topUp.processingPayment', 'Đang xử lý nạp')} ${numAmount.toLocaleString('vi-VN')}đ ${t('topUp.toWalletVia', 'vào ví qua')} ${selectedMethod}...`);
    
    // In real app, redirect to payment gateway
    // Then return to wallet page with success message
    setTimeout(() => {
      onNavigate("wallet");
    }, 1000);
  };

  const newBalance = amount ? currentBalance + parseInt(amount) : currentBalance;

  return (
    <ProfileLayout currentPage="wallet" onNavigate={onNavigate} activePage="wallet">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => onNavigate("wallet")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('topUp.backToWallet')}
          </Button>
          
          <h1 className="text-3xl text-gray-900 mb-2">{t('topUp.title')}</h1>
          <p className="text-gray-600">
            {t('topUp.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Amount & Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Input */}
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl text-gray-900 mb-4">{t('topUp.amount')}</h2>
              
              <div className="mb-4">
                <Input
                  type="number"
                  placeholder={t('topUp.enterAmount')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl h-14"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {t('topUp.minMax')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((item) => (
                  <Button
                    key={item.value}
                    variant="outline"
                    onClick={() => handleQuickAmount(item.value)}
                    className={amount === item.value.toString() ? "border-blue-600 bg-blue-50" : ""}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl text-gray-900 mb-4">{t('topUp.paymentMethod')}</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`w-full p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-blue-600" : "bg-gray-100"
                        }`}>
                          <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-600"}`} />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-gray-900">{method.name}</h3>
                            {method.badge && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                {method.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>

                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Security Info */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-2">{t('topUp.securityTitle')}</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• {t('topUp.security1', 'Mã hóa SSL 256-bit')}</li>
                    <li>• {t('topUp.security2', 'Không lưu trữ thông tin thẻ')}</li>
                    <li>• {t('topUp.security3', 'Tuân thủ chuẩn PCI DSS')}</li>
                    <li>• {t('topUp.security4', 'Giao dịch được xác thực 3D Secure')}</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-xl sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">{t('topUp.summary')}</h2>

              {/* Current Balance */}
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">{t('topUp.currentBalance')}</p>
                <p className="text-2xl text-gray-900">
                  {currentBalance.toLocaleString('vi-VN')}đ
                </p>
              </div>

              <Separator className="my-4" />

              {/* Top-up Amount */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('topUp.topUpAmount')}</span>
                  <span className="text-gray-900">
                    {amount ? `+${parseInt(amount).toLocaleString('vi-VN')}đ` : "0đ"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('topUp.transactionFee')}</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {t('topUp.free')}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              {/* New Balance */}
              <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-1">{t('topUp.newBalance')}</p>
                <p className="text-3xl text-blue-600">
                  {newBalance.toLocaleString('vi-VN')}đ
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>{t('topUp.benefit1', 'Nạp tiền ngay lập tức')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>{t('topUp.benefit2', 'Thanh toán nhanh chóng')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>{t('topUp.benefit3', 'Không mất phí giao dịch')}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleTopUp}
                disabled={!amount || !selectedMethod}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {t('topUp.topUpNow')}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                {t('topUp.termsAgreement', 'Bằng cách nhấn "Nạp tiền", bạn đồng ý với')}{" "}
                <button className="text-blue-600 hover:underline">{t('topUp.termsOfService', 'Điều khoản dịch vụ')}</button>
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card className="p-6 border-0 shadow-lg">
          <h2 className="text-xl text-gray-900 mb-4">{t('topUp.faqTitle')}</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-900 mb-2">{t('topUp.faq1Question', '💳 Mất bao lâu để tiền vào ví?')}</h3>
              <p className="text-gray-700">
                {t('topUp.faq1Answer', 'Tiền sẽ được cộng vào ví')} <strong>{t('topUp.instantly', 'NGAY LẬP TỨC')}</strong> {t('topUp.afterSuccess', 'sau khi giao dịch thành công')}.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 mb-2">{t('topUp.faq2Question', '💰 Có mất phí khi nạp tiền không?')}</h3>
              <p className="text-gray-700">
                <strong>{t('topUp.no', 'KHÔNG')}</strong>. {t('topUp.faq2Answer', 'Wanderlust hoàn toàn miễn phí mọi giao dịch nạp tiền vào ví')}.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 mb-2">{t('topUp.faq3Question', '🔄 Có thể rút tiền từ ví không?')}</h3>
              <p className="text-gray-700">
                {t('topUp.faq3Answer', 'Có. Bạn có thể yêu cầu rút tiền về tài khoản ngân hàng trong mục "Ví của tôi" → "Rút tiền". Thời gian xử lý 1-3 ngày làm việc')}.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 mb-2">{t('topUp.faq4Question', '🛡️ Tiền trong ví có an toàn không?')}</h3>
              <p className="text-gray-700">
                {t('topUp.faq4Answer', 'Tuyệt đối an toàn. Ví được bảo vệ bằng công nghệ mã hóa cao cấp và tuân thủ các tiêu chuẩn bảo mật quốc tế')}.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ProfileLayout>
  );
}
