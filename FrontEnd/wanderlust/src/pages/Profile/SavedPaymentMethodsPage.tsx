import { useState } from "react";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  CreditCard, Plus, Trash2, Edit, Check, X, 
  Smartphone, Wallet, Shield, AlertCircle
} from "lucide-react";
import type { PageType } from "../../MainApp";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

interface SavedPaymentMethodsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface PaymentMethod {
  id: string;
  type: "card" | "ewallet" | "bank";
  name: string;
  lastFour?: string;
  cardBrand?: "visa" | "mastercard" | "jcb" | "amex";
  expiryDate?: string;
  isDefault: boolean;
  ewalletProvider?: "momo" | "zalopay" | "vnpay" | "shopeepay";
  bankName?: string;
  accountNumber?: string;
}

export default function SavedPaymentMethodsPage({ onNavigate }: SavedPaymentMethodsPageProps) {
  // Mock saved payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Thẻ Visa chính",
      cardBrand: "visa",
      lastFour: "4242",
      expiryDate: "12/2026",
      isDefault: true
    },
    {
      id: "2",
      type: "card",
      name: "Mastercard phụ",
      cardBrand: "mastercard",
      lastFour: "5555",
      expiryDate: "08/2025",
      isDefault: false
    },
    {
      id: "3",
      type: "ewallet",
      name: "Ví MoMo",
      ewalletProvider: "momo",
      lastFour: "9876",
      isDefault: false
    },
    {
      id: "4",
      type: "bank",
      name: "Tài khoản Vietcombank",
      bankName: "Vietcombank",
      accountNumber: "1234567890",
      isDefault: false
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [addType, setAddType] = useState<"card" | "ewallet" | "bank">("card");

  // New payment method form
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    isDefault: false
  });

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      }))
    );
    toast.success("Đã đặt làm phương thức mặc định");
  };

  const handleDelete = () => {
    if (!selectedMethod) return;
    
    if (selectedMethod.isDefault) {
      toast.error("Không thể xóa phương thức thanh toán mặc định");
      return;
    }

    setPaymentMethods(prev => prev.filter(pm => pm.id !== selectedMethod.id));
    toast.success("Đã xóa phương thức thanh toán");
    setShowDeleteDialog(false);
    setSelectedMethod(null);
  };

  const handleAddCard = () => {
    // Validate
    if (!newCardData.cardNumber || newCardData.cardNumber.length < 16) {
      toast.error("Số thẻ không hợp lệ");
      return;
    }
    if (!newCardData.cardName) {
      toast.error("Vui lòng nhập tên chủ thẻ");
      return;
    }
    if (!newCardData.expiryDate || !/^\d{2}\/\d{4}$/.test(newCardData.expiryDate)) {
      toast.error("Ngày hết hạn không hợp lệ (MM/YYYY)");
      return;
    }
    if (!newCardData.cvv || newCardData.cvv.length < 3) {
      toast.error("CVV không hợp lệ");
      return;
    }

    // Determine card brand from card number
    const firstDigit = newCardData.cardNumber[0];
    let cardBrand: "visa" | "mastercard" | "jcb" | "amex" = "visa";
    if (firstDigit === "4") cardBrand = "visa";
    else if (firstDigit === "5") cardBrand = "mastercard";
    else if (firstDigit === "3") cardBrand = "amex";

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      name: newCardData.cardName,
      cardBrand,
      lastFour: newCardData.cardNumber.slice(-4),
      expiryDate: newCardData.expiryDate,
      isDefault: newCardData.isDefault || paymentMethods.length === 0
    };

    setPaymentMethods(prev => {
      if (newCardData.isDefault) {
        return [...prev.map(pm => ({ ...pm, isDefault: false })), newMethod];
      }
      return [...prev, newMethod];
    });

    toast.success("Đã thêm thẻ thanh toán mới");
    setShowAddDialog(false);
    setNewCardData({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      isDefault: false
    });
  };

  const getCardBrandIcon = (brand?: string) => {
    const brandLogos: Record<string, string> = {
      visa: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
      mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      jcb: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
      amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
    };
    return brand && brandLogos[brand] ? brandLogos[brand] : null;
  };

  const getEwalletIcon = (provider?: string) => {
    const providerLogos: Record<string, string> = {
      momo: "https://developers.momo.vn/v3/img/logo.png",
      zalopay: "https://cdn.zalopay.com.vn/v2/img/logo.png",
      vnpay: "https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png",
      shopeepay: "https://down-cvs-vn.img.susercontent.com/vn-11134513-7qukw-lf2e81tgfxjt9e"
    };
    return provider && providerLogos[provider] ? providerLogos[provider] : null;
  };

  return (
    <ProfileLayout 
      activePage="saved-payment-methods"
      currentPage="saved-payment-methods"
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Phương thức thanh toán</h1>
            <p className="text-gray-600 mt-1">Quản lý thẻ và tài khoản thanh toán của bạn</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-900 font-medium">Thông tin của bạn được bảo mật</p>
              <p className="text-blue-700 mt-1">
                Chúng tôi sử dụng mã hóa SSL 256-bit và tuân thủ chuẩn PCI-DSS để bảo vệ thông tin thanh toán của bạn.
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {method.type === "card" && <CreditCard className="w-8 h-8 text-white" />}
                    {method.type === "ewallet" && <Smartphone className="w-8 h-8 text-white" />}
                    {method.type === "bank" && <Wallet className="w-8 h-8 text-white" />}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Mặc định
                        </Badge>
                      )}
                    </div>

                    {/* Card details */}
                    {method.type === "card" && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {method.cardBrand && getCardBrandIcon(method.cardBrand) && (
                            <img 
                              src={getCardBrandIcon(method.cardBrand)!} 
                              alt={method.cardBrand}
                              className="h-6 w-auto"
                            />
                          )}
                          <span className="text-gray-600">•••• •••• •••• {method.lastFour}</span>
                        </div>
                        {method.expiryDate && (
                          <p className="text-sm text-gray-500">Hết hạn: {method.expiryDate}</p>
                        )}
                      </div>
                    )}

                    {/* E-wallet details */}
                    {method.type === "ewallet" && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {method.ewalletProvider && getEwalletIcon(method.ewalletProvider) && (
                            <img 
                              src={getEwalletIcon(method.ewalletProvider)!} 
                              alt={method.ewalletProvider}
                              className="h-6 w-auto"
                            />
                          )}
                          <span className="text-gray-600">****{method.lastFour}</span>
                        </div>
                      </div>
                    )}

                    {/* Bank details */}
                    {method.type === "bank" && (
                      <div className="space-y-1">
                        <p className="text-gray-600">{method.bankName}</p>
                        <p className="text-sm text-gray-500">STK: {method.accountNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMethod(method);
                      setShowDeleteDialog(true);
                    }}
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {paymentMethods.length === 0 && (
            <Card className="p-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có phương thức thanh toán
              </h3>
              <p className="text-gray-600 mb-4">
                Thêm thẻ hoặc tài khoản để thanh toán nhanh hơn
              </p>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm phương thức thanh toán
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
            <DialogDescription>
              Thêm thẻ hoặc tài khoản thanh toán mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={addType === "card" ? "default" : "outline"}
                onClick={() => setAddType("card")}
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Thẻ
              </Button>
              <Button
                variant={addType === "ewallet" ? "default" : "outline"}
                onClick={() => setAddType("ewallet")}
                className="gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Ví điện tử
              </Button>
              <Button
                variant={addType === "bank" ? "default" : "outline"}
                onClick={() => setAddType("bank")}
                className="gap-2"
              >
                <Wallet className="w-4 h-4" />
                Ngân hàng
              </Button>
            </div>

            {/* Card form */}
            {addType === "card" && (
              <div className="space-y-4">
                <div>
                  <Label>Số thẻ</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={newCardData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').slice(0, 16);
                      setNewCardData({ ...newCardData, cardNumber: value });
                    }}
                    maxLength={16}
                  />
                </div>
                <div>
                  <Label>Tên chủ thẻ</Label>
                  <Input
                    placeholder="NGUYEN VAN A"
                    value={newCardData.cardName}
                    onChange={(e) => setNewCardData({ ...newCardData, cardName: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ngày hết hạn</Label>
                    <Input
                      placeholder="MM/YYYY"
                      value={newCardData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 6);
                        }
                        setNewCardData({ ...newCardData, expiryDate: value });
                      }}
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input
                      type="password"
                      placeholder="123"
                      value={newCardData.cvv}
                      onChange={(e) => setNewCardData({ ...newCardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="setDefault"
                    checked={newCardData.isDefault}
                    onChange={(e) => setNewCardData({ ...newCardData, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="setDefault" className="cursor-pointer">
                    Đặt làm phương thức mặc định
                  </Label>
                </div>
              </div>
            )}

            {/* E-wallet form */}
            {addType === "ewallet" && (
              <div className="text-center py-8">
                <Smartphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Tính năng liên kết ví điện tử đang được phát triển</p>
              </div>
            )}

            {/* Bank form */}
            {addType === "bank" && (
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Tính năng liên kết ngân hàng đang được phát triển</p>
              </div>
            )}

            {/* Actions */}
            {addType === "card" && (
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Hủy
                </Button>
                <Button onClick={handleAddCard} className="flex-1">
                  Thêm thẻ
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phương thức thanh toán "{selectedMethod?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProfileLayout>
  );
}
