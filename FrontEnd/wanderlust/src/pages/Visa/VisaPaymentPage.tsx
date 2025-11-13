import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";
import { 
  ArrowLeft, 
  CreditCard, 
  Building2,
  Smartphone,
  CheckCircle2,
  FileText,
  Calendar,
  User
} from "lucide-react";
import type { PageType } from "../../MainApp";

interface VisaPaymentPageProps {
  country?: any;
  formData?: any;
  documents?: any;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function VisaPaymentPage({ country, formData, documents, onNavigate }: VisaPaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const serviceFee = parseInt(country?.price?.replace(/[^0-9]/g, '') || "0");
  const processingFee = Math.round(serviceFee * 0.05);
  const total = serviceFee + processingFee;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      onNavigate("visa-confirmation", { 
        country, 
        formData, 
        documents,
        paymentMethod,
        total 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate("visa-documents", { country, formData })}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại upload hồ sơ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Phương Thức Thanh Toán
              </h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                    <div>
                      <div className="font-semibold">Thẻ tín dụng/Ghi nợ</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, JCB</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer" className="flex items-center cursor-pointer flex-1">
                    <Building2 className="w-6 h-6 mr-3 text-green-600" />
                    <div>
                      <div className="font-semibold">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-500">Vietcombank, Techcombank, VPBank</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <RadioGroupItem value="e-wallet" id="e-wallet" />
                  <Label htmlFor="e-wallet" className="flex items-center cursor-pointer flex-1">
                    <Smartphone className="w-6 h-6 mr-3 text-purple-600" />
                    <div>
                      <div className="font-semibold">Ví điện tử</div>
                      <div className="text-sm text-gray-500">MoMo, ZaloPay, VNPay</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-6" />

              {paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Thông Tin Thẻ</h3>
                  
                  <div>
                    <Label htmlFor="cardNumber">Số thẻ *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardName">Tên chủ thẻ *</Label>
                    <Input
                      id="cardName"
                      placeholder="NGUYEN VAN A"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength={5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "bank-transfer" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-blue-900">
                    Thông Tin Chuyển Khoản
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Ngân hàng:</span>
                      <span className="font-semibold">Vietcombank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Số tài khoản:</span>
                      <span className="font-semibold">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Chủ tài khoản:</span>
                      <span className="font-semibold">WANDERLUST TRAVEL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Nội dung:</span>
                      <span className="font-semibold">VISA {country?.name} {formData?.fullName}</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "e-wallet" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                  <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Quét Mã QR</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Sau khi nhấn "Thanh toán", bạn sẽ được chuyển đến ứng dụng ví điện tử
                  </p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Tóm Tắt Đơn Hàng
              </h3>

              {country && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl">{country.flag}</span>
                    <span className="font-semibold text-lg">{country.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{country.type}</p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{formData?.fullName || "Chưa có tên"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Xử lý: {country?.processingTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{Object.keys(documents || {}).length} tài liệu đã upload</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="font-semibold">{serviceFee.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí xử lý (5%)</span>
                  <span className="font-semibold">{processingFee.toLocaleString()} VNĐ</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="font-bold text-blue-600">{total.toLocaleString()} VNĐ</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Thanh toán ngay
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng việc thanh toán, bạn đồng ý với{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Điều khoản dịch vụ
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
