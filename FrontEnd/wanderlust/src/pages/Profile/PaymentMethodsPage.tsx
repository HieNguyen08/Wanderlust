import { useState, useEffect } from "react";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { 
  Plane, Clock, MapPin, Calendar, Users, Car, Settings,
  CreditCard, Wallet, Smartphone, AlertCircle, Tag, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import type { PageType } from "../../MainApp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface PaymentMethodsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  bookingData?: any;
}

interface SavedPaymentMethod {
  id: string;
  type: "card" | "ewallet";
  name: string;
  lastFour?: string;
  icon?: string;
}

interface VoucherType {
  id: string;
  code: string;
  discount: number;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  minOrderValue: number;
  description: string;
}

export default function PaymentMethodsPage({ onNavigate, bookingData }: PaymentMethodsPageProps) {
  // State management
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherType | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isVoucherListOpen, setIsVoucherListOpen] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  
  // New card form
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  // Mock data - In real app, these come from backend
  const walletBalance = 2450000;
  const savedPaymentMethods: SavedPaymentMethod[] = [
    { id: "1", type: "card", name: "Visa", lastFour: "4242" },
    { id: "2", type: "ewallet", name: "MoMo", icon: "momo" },
  ];

  const availableVouchers: VoucherType[] = [
    {
      id: "1",
      code: "SALE100K",
      discount: 100000,
      type: "FIXED_AMOUNT",
      minOrderValue: 500000,
      description: "Giảm 100.000đ cho đơn từ 500.000đ"
    },
    {
      id: "2",
      code: "DISCOUNT10",
      discount: 10,
      type: "PERCENTAGE",
      minOrderValue: 1000000,
      description: "Giảm 10% cho đơn từ 1.000.000đ (tối đa 200.000đ)"
    },
  ];

  // Extract booking info from props
  const bookingType = bookingData?.type || "flight";
  const totalAmount = bookingData?.totalPrice || 2000000;

  // Calculate discount
  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;
    
    if (appliedVoucher.type === "FIXED_AMOUNT") {
      return appliedVoucher.discount;
    } else {
      // PERCENTAGE
      const discountAmount = (totalAmount * appliedVoucher.discount) / 100;
      const maxDiscount = 200000; // Max discount for percentage vouchers
      return Math.min(discountAmount, maxDiscount);
    }
  };

  const voucherDiscount = calculateDiscount();
  const amountAfterVoucher = totalAmount - voucherDiscount;
  const walletUsed = useWallet ? Math.min(walletBalance, amountAfterVoucher) : 0;
  const finalAmount = amountAfterVoucher - walletUsed;

  // Auto-select saved payment if wallet covers full amount
  useEffect(() => {
    if (finalAmount === 0) {
      setSelectedPaymentMethod("");
    }
  }, [finalAmount]);

  // Handle voucher application
  const handleApplyVoucher = () => {
    const voucher = availableVouchers.find(v => v.code === voucherCode.toUpperCase());
    
    if (!voucher) {
      alert("Mã giảm giá không hợp lệ");
      return;
    }
    
    if (totalAmount < voucher.minOrderValue) {
      alert(`Đơn hàng phải từ ${voucher.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này`);
      return;
    }
    
    setAppliedVoucher(voucher);
    setVoucherCode("");
    alert("✅ Áp dụng mã giảm giá thành công!");
  };

  const handleSelectVoucherFromList = (voucher: VoucherType) => {
    if (totalAmount < voucher.minOrderValue) {
      alert(`Đơn hàng phải từ ${voucher.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này`);
      return;
    }
    
    setAppliedVoucher(voucher);
    setIsVoucherListOpen(false);
    alert("✅ Áp dụng mã giảm giá thành công!");
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  // Handle payment
  const handlePayment = () => {
    // Validation
    if (finalAmount > 0 && !selectedPaymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (selectedPaymentMethod === "new-card") {
      if (!newCardData.cardNumber || !newCardData.cardName || !newCardData.expiryDate || !newCardData.cvv) {
        alert("Vui lòng điền đầy đủ thông tin thẻ");
        return;
      }
    }

    // Simulate payment processing
    const paymentInfo = {
      bookingType,
      totalAmount,
      voucherDiscount,
      walletUsed,
      finalAmount,
      paymentMethod: finalAmount === 0 ? "wallet" : selectedPaymentMethod
    };

    console.log("Processing payment:", paymentInfo);

    // Navigate to confirmation page
    onNavigate("confirmation", {
      ...bookingData,
      paymentInfo
    });
  };

  // Render order summary based on booking type
  const renderOrderSummary = () => {
    switch (bookingType) {
      case "flight":
        return <FlightSummary data={bookingData} />;
      case "hotel":
        return <HotelSummary data={bookingData} />;
      case "car-rental":
        return <CarRentalSummary data={bookingData} />;
      case "activity":
        return <ActivitySummary data={bookingData} />;
      default:
        return <FlightSummary data={bookingData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">      <div className="max-w-7xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">Xem lại thông tin</span>
            <span>/</span>
            <span className="text-gray-900">Thanh toán</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Block 1: Voucher */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl text-gray-900">Mã giảm giá</h2>
                  <p className="text-sm text-gray-600">Nhập hoặc chọn mã để được giảm giá</p>
                </div>
              </div>

              {appliedVoucher ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-600 hover:bg-green-600">
                          {appliedVoucher.code}
                        </Badge>
                        <span className="text-green-900">
                          -{calculateDiscount().toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className="text-sm text-green-800">{appliedVoucher.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveVoucher}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      className="flex-1 uppercase"
                    />
                    <Button onClick={handleApplyVoucher} className="whitespace-nowrap">
                      Áp dụng
                    </Button>
                  </div>

                  <button
                    onClick={() => setIsVoucherListOpen(!isVoucherListOpen)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <span>Chọn từ Ví Voucher của bạn</span>
                    {isVoucherListOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isVoucherListOpen && (
                    <div className="space-y-2 pt-2">
                      {availableVouchers.map((voucher) => (
                        <button
                          key={voucher.id}
                          onClick={() => handleSelectVoucherFromList(voucher)}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline">{voucher.code}</Badge>
                            <span className="text-sm text-gray-900">
                              -{voucher.type === "FIXED_AMOUNT" 
                                ? voucher.discount.toLocaleString('vi-VN') + "đ"
                                : voucher.discount + "%"
                              }
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{voucher.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Block 2: Payment Methods */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl text-gray-900">Phương thức thanh toán</h2>
                  <p className="text-sm text-gray-600">Chọn cách bạn muốn thanh toán</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Option 1: System Wallet (Checkbox) */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="use-wallet"
                      checked={useWallet}
                      onCheckedChange={(checked) => setUseWallet(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="use-wallet" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-900">Sử dụng Ví hệ thống</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-50">
                          {walletBalance.toLocaleString('vi-VN')}đ
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {walletBalance >= amountAfterVoucher
                          ? "Đủ số dư để thanh toán toàn bộ"
                          : `Thanh toán một phần ${Math.min(walletBalance, amountAfterVoucher).toLocaleString('vi-VN')}đ`
                        }
                      </p>
                    </label>
                  </div>
                </div>

                {/* Option 2: Main Payment Methods (Only show if finalAmount > 0) */}
                {finalAmount > 0 && (
                  <div>
                    <Separator className="my-6" />
                    
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <div className="space-y-3">
                        {/* Saved Payment Methods */}
                        {savedPaymentMethods.length > 0 && (
                          <div>
                            <h3 className="text-sm text-gray-700 mb-3">Phương thức đã lưu</h3>
                            <div className="space-y-2">
                              {savedPaymentMethods.map((method) => (
                                <div
                                  key={method.id}
                                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                    selectedPaymentMethod === method.id
                                      ? "border-blue-600 bg-blue-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <RadioGroupItem value={method.id} id={method.id} />
                                    <label htmlFor={method.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        {method.type === "card" ? (
                                          <CreditCard className="w-5 h-5 text-white" />
                                        ) : (
                                          <Smartphone className="w-5 h-5 text-white" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-gray-900">{method.name}</p>
                                        {method.lastFour && (
                                          <p className="text-sm text-gray-600">•••• {method.lastFour}</p>
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add New Card */}
                        <div>
                          {savedPaymentMethods.length > 0 && (
                            <Separator className="my-4" />
                          )}
                          
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedPaymentMethod === "new-card"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="new-card" id="new-card" />
                              <label htmlFor="new-card" className="flex items-center gap-3 flex-1 cursor-pointer">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <CreditCard className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-gray-900">Thêm Thẻ Tín dụng/Ghi nợ mới</span>
                              </label>
                            </div>
                          </div>

                          {selectedPaymentMethod === "new-card" && (
                            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                              <div>
                                <Label htmlFor="cardNumber">Số thẻ <span className="text-red-600">*</span></Label>
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  value={newCardData.cardNumber}
                                  onChange={(e) => setNewCardData({ ...newCardData, cardNumber: e.target.value })}
                                  className="mt-1"
                                  maxLength={19}
                                />
                              </div>

                              <div>
                                <Label htmlFor="cardName">Tên trên thẻ <span className="text-red-600">*</span></Label>
                                <Input
                                  id="cardName"
                                  placeholder="NGUYEN VAN A"
                                  value={newCardData.cardName}
                                  onChange={(e) => setNewCardData({ ...newCardData, cardName: e.target.value })}
                                  className="mt-1 uppercase"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiryDate">Ngày hết hạn <span className="text-red-600">*</span></Label>
                                  <Input
                                    id="expiryDate"
                                    placeholder="MM/YY"
                                    value={newCardData.expiryDate}
                                    onChange={(e) => setNewCardData({ ...newCardData, expiryDate: e.target.value })}
                                    className="mt-1"
                                    maxLength={5}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="cvv">CVV <span className="text-red-600">*</span></Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    value={newCardData.cvv}
                                    onChange={(e) => setNewCardData({ ...newCardData, cvv: e.target.value })}
                                    className="mt-1"
                                    maxLength={4}
                                    type="password"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* E-Wallets / QR Code */}
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedPaymentMethod === "ewallet"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="ewallet" id="ewallet" />
                            <label htmlFor="ewallet" className="flex items-center gap-3 flex-1 cursor-pointer">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-gray-600" />
                              </div>
                              <span className="text-gray-900">Ví điện tử / QR Code</span>
                            </label>
                          </div>
                        </div>

                        {selectedPaymentMethod === "ewallet" && (
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            {["MoMo", "VNPay", "ZaloPay"].map((wallet) => (
                              <button
                                key={wallet}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Smartphone className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-center text-gray-900">{wallet}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </Card>

            {/* Security Notice */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-sm text-green-900">
                  <p className="mb-1">
                    <strong>Thanh toán an toàn & bảo mật</strong>
                  </p>
                  <p className="text-green-800">
                    Mọi giao dịch được mã hóa SSL 256-bit và tuân thủ chuẩn PCI DSS. 
                    Chúng tôi không lưu trữ thông tin CVV của bạn.
                  </p>
                </div>
              </div>
            </Card>

            {/* Block 3: Action Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handlePayment}
              disabled={finalAmount > 0 && !selectedPaymentMethod}
            >
              {finalAmount === 0 
                ? "XÁC NHẬN ĐẶT CHỖ"
                : `THANH TOÁN ${finalAmount.toLocaleString('vi-VN')}đ`
              }
            </Button>

            <p className="text-xs text-center text-gray-500">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <button className="text-blue-600 hover:underline">Điều khoản Sử dụng</button> và{" "}
              <button className="text-blue-600 hover:underline">Chính sách Bảo mật</button>
            </p>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                {renderOrderSummary()}

                <Separator className="my-6" />

                {/* Price Details - Dynamic */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 mb-3">Chi tiết Giá</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="text-gray-900">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {appliedVoucher && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá (Voucher)</span>
                      <span className="text-green-600">
                        -{voucherDiscount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}

                  {useWallet && walletUsed > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đã dùng Ví</span>
                      <span className="text-blue-600">
                        -{walletUsed.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-gray-900">TỔNG CỘNG PHẢI TRẢ</span>
                    <span className="text-2xl text-blue-600">
                      {finalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {finalAmount === 0 && (
                    <div className="bg-green-50 rounded-lg p-3 mt-4">
                      <p className="text-sm text-green-900 text-center">
                        ✅ Thanh toán toàn bộ bằng Ví
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// Summary Components for each booking type
function FlightSummary({ data }: { data: any }) {
  const outbound = data?.flightData?.outbound || {
    airline: "Vietnam Airlines",
    flightNumber: "VN210",
    from: "SGN",
    to: "HAN",
    departure: "08:00",
    arrival: "10:15",
    date: "08/11/2025"
  };

  return (
    <>
      <h2 className="text-xl text-gray-900 mb-6">Chuyến bay của bạn</h2>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Plane className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-600">Chiều đi</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs">VN</span>
          </div>
          <div>
            <p className="text-sm text-gray-900">{outbound.airline}</p>
            <p className="text-xs text-gray-600">{outbound.flightNumber}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl text-gray-900">{outbound.departure}</p>
            <p className="text-sm text-gray-600">{outbound.from}</p>
          </div>
          <div className="flex-1 mx-4">
            <div className="border-t border-gray-300 relative">
              <Clock className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl text-gray-900">{outbound.arrival}</p>
            <p className="text-sm text-gray-600">{outbound.to}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function HotelSummary({ data }: { data: any }) {
  const hotel = data?.hotelData?.hotel || {
    name: "Grand Saigon Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
  };

  const booking = data?.hotelData?.booking || {
    checkIn: "Thứ 6, 7/11/2025",
    checkOut: "Thứ 7, 8/11/2025",
    nights: 1,
    roomType: "Superior Twin Room"
  };

  return (
    <>
      <h2 className="text-xl text-gray-900 mb-6">Đặt phòng của bạn</h2>
      
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <ImageWithFallback
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-lg text-gray-900 mb-3">{hotel.name}</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Check-in:</span>
          <span className="text-gray-900">{booking.checkIn}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Check-out:</span>
          <span className="text-gray-900">{booking.checkOut}</span>
        </div>
        <p className="text-gray-600">
          {booking.roomType} • {booking.nights} đêm
        </p>
      </div>
    </>
  );
}

function CarRentalSummary({ data }: { data: any }) {
  const car = data?.carData?.car || {
    name: "Toyota Agya",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400",
    transmission: "Tự động"
  };

  const rental = data?.carData?.rental || {
    pickup: "Thứ 7, 8/11/2025 - 09:00",
    dropoff: "Thứ 2, 10/11/2025 - 09:00",
    days: 2
  };

  return (
    <>
      <h2 className="text-xl text-gray-900 mb-6">Chi tiết Thuê xe</h2>
      
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <ImageWithFallback
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-lg text-gray-900 mb-3">{car.name}</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Nhận xe:</span>
          <span className="text-gray-900">{rental.pickup}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Trả xe:</span>
          <span className="text-gray-900">{rental.dropoff}</span>
        </div>
        <p className="text-gray-600">
          {car.transmission} • {rental.days} ngày
        </p>
      </div>
    </>
  );
}

function ActivitySummary({ data }: { data: any }) {
  const activity = data?.activityData?.activity || {
    name: "Tour 1 ngày Cù Lao Chàm",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
  };

  const booking = data?.activityData?.booking || {
    date: "Thứ 7, 8/11/2025",
    adults: 2,
    children: 1
  };

  return (
    <>
      <h2 className="text-xl text-gray-900 mb-6">Chi tiết Đặt chỗ</h2>
      
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <ImageWithFallback
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-lg text-gray-900 mb-3">{activity.name}</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Ngày:</span>
          <span className="text-gray-900">{booking.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-gray-900">
            {booking.adults} Người lớn, {booking.children} Trẻ em
          </span>
        </div>
      </div>
    </>
  );
}
