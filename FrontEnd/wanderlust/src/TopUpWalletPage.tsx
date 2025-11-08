import { useState } from "react";
import { ProfileLayout } from "./components/ProfileLayout";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { 
  Wallet, 
  CreditCard,
  Smartphone,
  ArrowLeft,
  CheckCircle,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";
import type { PageType } from "./MainApp";

interface TopUpWalletPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TopUpWalletPage({ onNavigate }: TopUpWalletPageProps) {
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
      name: "Thẻ tín dụng/Ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      badge: "Phổ biến",
    },
    {
      id: "momo",
      name: "Ví MoMo",
      description: "Thanh toán qua ứng dụng MoMo",
      icon: Smartphone,
      badge: "Nhanh nhất",
    },
    {
      id: "vnpay",
      name: "VNPay QR",
      description: "Quét mã QR để thanh toán",
      icon: Smartphone,
      badge: null,
    },
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = () => {
    if (!amount || !selectedMethod) {
      alert("Vui lòng nhập số tiền và chọn phương thức thanh toán");
      return;
    }

    const numAmount = parseInt(amount);
    if (numAmount < 10000) {
      alert("Số tiền nạp tối thiểu là 10.000đ");
      return;
    }
    if (numAmount > 50000000) {
      alert("Số tiền nạp tối đa là 50.000.000đ");
      return;
    }

    // Simulate payment processing
    alert(`✅ Đang xử lý nạp ${numAmount.toLocaleString('vi-VN')}đ vào ví qua ${selectedMethod}...`);
    
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
            Quay lại Ví
          </Button>
          
          <h1 className="text-3xl text-gray-900 mb-2">Nạp tiền vào Ví</h1>
          <p className="text-gray-600">
            Nạp tiền để sử dụng cho các giao dịch trên Wanderlust
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Amount & Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Input */}
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl text-gray-900 mb-4">Số tiền nạp</h2>
              
              <div className="mb-4">
                <Input
                  type="number"
                  placeholder="Nhập số tiền"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl h-14"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Tối thiểu: 10.000đ • Tối đa: 50.000.000đ
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
              <h2 className="text-xl text-gray-900 mb-4">Phương thức thanh toán</h2>
              
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
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Mã hóa SSL 256-bit</li>
                    <li>• Không lưu trữ thông tin thẻ</li>
                    <li>• Tuân thủ chuẩn PCI DSS</li>
                    <li>• Giao dịch được xác thực 3D Secure</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-xl sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Tóm tắt</h2>

              {/* Current Balance */}
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">Số dư hiện tại</p>
                <p className="text-2xl text-gray-900">
                  {currentBalance.toLocaleString('vi-VN')}đ
                </p>
              </div>

              <Separator className="my-4" />

              {/* Top-up Amount */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền nạp</span>
                  <span className="text-gray-900">
                    {amount ? `+${parseInt(amount).toLocaleString('vi-VN')}đ` : "0đ"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí giao dịch</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Miễn phí
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              {/* New Balance */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-1">Số dư sau nạp</p>
                <p className="text-3xl text-blue-600">
                  {newBalance.toLocaleString('vi-VN')}đ
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Nạp tiền ngay lập tức</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Thanh toán nhanh chóng</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Không mất phí giao dịch</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleTopUp}
                disabled={!amount || !selectedMethod}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                Nạp tiền ngay
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Bằng cách nhấn "Nạp tiền", bạn đồng ý với{" "}
                <button className="text-blue-600 hover:underline">Điều khoản dịch vụ</button>
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card className="p-6 border-0 shadow-lg">
          <h2 className="text-xl text-gray-900 mb-4">Câu hỏi thường gặp</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-900 mb-2">💳 Mất bao lâu để tiền vào ví?</h3>
              <p className="text-gray-700">
                Tiền sẽ được cộng vào ví <strong>NGAY LẬP TỨC</strong> sau khi giao dịch thành công.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 mb-2">💰 Có mất phí khi nạp tiền không?</h3>
              <p className="text-gray-700">
                <strong>KHÔNG</strong>. Wanderlust hoàn toàn miễn phí mọi giao dịch nạp tiền vào ví.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 mb-2">🔄 Có thể rút tiền từ ví không?</h3>
              <p className="text-gray-700">
                Có. Bạn có thể yêu cầu rút tiền về tài khoản ngân hàng trong mục "Ví của tôi" → "Rút tiền". Thời gian xử lý 1-3 ngày làm việc.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 mb-2">🛡️ Tiền trong ví có an toàn không?</h3>
              <p className="text-gray-700">
                Tuyệt đối an toàn. Ví được bảo vệ bằng công nghệ mã hóa cao cấp và tuân thủ các tiêu chuẩn bảo mật quốc tế.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ProfileLayout>
  );
}
