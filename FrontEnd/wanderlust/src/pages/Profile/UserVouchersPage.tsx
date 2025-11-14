import { useState, useEffect } from "react";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Ticket, Calendar, Tag, Copy, Check, Gift, AlertCircle, Loader2 } from "lucide-react";
import type { PageType } from "../../MainApp";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { userVoucherApi, tokenService } from "../../utils/api";

interface UserVouchersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function UserVouchersPage({ onNavigate }: UserVouchersPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addCodeInput, setAddCodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Real data from backend
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [usedVouchers, setUsedVouchers] = useState<any[]>([]);
  const [expiredVouchers, setExpiredVouchers] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  // Load vouchers from backend on mount
  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      
      if (!tokenService.isAuthenticated()) {
        onNavigate('login');
        return;
      }

      // Load available vouchers
      const available = await userVoucherApi.getAvailable();
      setMyVouchers(available);

      // Load used vouchers
      const used = await userVoucherApi.getUsed();
      setUsedVouchers(used);
      
      // Filter expired vouchers from available (status === 'EXPIRED' or endDate passed)
      const expired = available.filter((v: any) => 
        v.status === 'EXPIRED' || (v.endDate && new Date(v.endDate) < new Date())
      );
      setExpiredVouchers(expired);

      // Load statistics
      const stats = await userVoucherApi.getStatistics();
      setStatistics(stats);

    } catch (error: any) {
      if (error.message === 'UNAUTHORIZED') {
        toast.error('Vui lòng đăng nhập để xem voucher');
        onNavigate('login');
      } else {
        console.error('Error loading vouchers:', error);
        toast.error('Không thể tải danh sách voucher');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Đã sao chép mã voucher!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      // Fallback
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedCode(code);
        toast.success("Đã sao chép mã voucher!");
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (fallbackErr) {
        toast.error("Không thể sao chép mã");
      }
    }
  };

  const handleAddVoucher = async () => {
    const code = addCodeInput.trim().toUpperCase();
    if (!code) {
      toast.error("Vui lòng nhập mã voucher!");
      return;
    }

    try {
      setSaving(true);
      
      // Call backend API to save voucher
      await userVoucherApi.saveToWallet(code);
      
      toast.success("Đã thêm voucher vào ví!");
      setAddCodeInput("");
      
      // Reload vouchers list
      await loadVouchers();
      
    } catch (error: any) {
      // Show specific error message from backend
      toast.error(error.message || "Không thể thêm voucher");
    } finally {
      setSaving(false);
    }
  };

  const formatValue = (type: string, value: number, maxDiscount: number | null) => {
    if (type === "PERCENTAGE") {
      return `Giảm ${value}%${maxDiscount ? ` (tối đa ${maxDiscount.toLocaleString('vi-VN')}đ)` : ''}`;
    }
    return `Giảm ${value.toLocaleString('vi-VN')}đ`;
  };

  const VoucherCard = ({ voucher, showUsedInfo = false }: { voucher: any; showUsedInfo?: boolean }) => (
    <Card className={`overflow-hidden ${voucher.status === 'EXPIRED' || voucher.status === 'USED' ? 'opacity-60' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* Left side - Visual */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 md:w-48 flex flex-col items-center justify-center text-white relative">
          <Ticket className="w-12 h-12 mb-2" />
          <div className="text-center">
            <div className="text-sm opacity-90">Mã giảm giá</div>
            <code className="text-lg font-mono mt-1 block">{voucher.voucherCode || voucher.code}</code>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
          
          {voucher.giftedBy && (
            <Badge className="mt-3 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
              <Gift className="w-3 h-3 mr-1" />
              Được tặng
            </Badge>
          )}
        </div>

        {/* Right side - Details */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg text-gray-900 mb-1">{voucher.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{voucher.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-blue-600">
                  {formatValue(voucher.type, voucher.value, voucher.maxDiscount)}
                </Badge>
              </div>
            </div>
            
            {voucher.status === 'AVAILABLE' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCode(voucher.voucherCode || voucher.code)}
                className="gap-2 ml-4"
              >
                {copiedCode === (voucher.voucherCode || voucher.code) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Sao chép
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Conditions */}
          <div className="space-y-2 text-sm mb-4">
            {voucher.minSpend > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4" />
                <span>Đơn hàng tối thiểu: {voucher.minSpend.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>HSD: {voucher.startDate} - {voucher.endDate}</span>
            </div>
            {voucher.conditions && voucher.conditions.length > 0 && (
              <div className="text-gray-500 text-xs">
                {voucher.conditions.map((condition: string, idx: number) => (
                  <div key={idx}>• {condition}</div>
                ))}
              </div>
            )}
          </div>

          {/* Used Info */}
          {showUsedInfo && voucher.status === 'USED' && (
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">
                <div>Đã sử dụng: {voucher.usedDate}</div>
                <div>Đơn hàng: {voucher.orderAmount?.toLocaleString('vi-VN')}đ</div>
                <div className="text-green-600">Tiết kiệm: {voucher.discountAmount?.toLocaleString('vi-VN')}đ</div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          {voucher.status === 'EXPIRED' && (
            <Badge variant="secondary" className="mt-2">Đã hết hạn</Badge>
          )}
          {voucher.status === 'USED' && (
            <Badge className="mt-2 bg-gray-500">Đã sử dụng</Badge>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <ProfileLayout currentPage="vouchers" onNavigate={onNavigate} activePage="vouchers">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900">Ví Voucher</h1>
          <p className="text-gray-600 mt-1">
            Quản lý mã giảm giá và ưu đãi của bạn
          </p>
        </div>

        {/* Add Voucher */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Thêm mã voucher</h3>
          <div className="flex gap-3">
            <Input
              placeholder="Nhập mã voucher..."
              value={addCodeInput}
              onChange={(e) => setAddCodeInput(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddVoucher()}
              className="flex-1"
            />
            <Button onClick={handleAddVoucher}>
              Thêm vào ví
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Voucher khả dụng</p>
                <p className="text-3xl text-blue-600">{myVouchers.length}</p>
              </div>
              <Ticket className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã sử dụng</p>
                <p className="text-3xl text-gray-600">{usedVouchers.length}</p>
              </div>
              <Check className="w-10 h-10 text-gray-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng tiết kiệm</p>
                <p className="text-3xl text-green-600">
                  {usedVouchers.reduce((sum, v) => sum + (v.discountAmount || 0), 0).toLocaleString('vi-VN')}đ
                </p>
              </div>
              <Gift className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              Khả dụng ({myVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="used">
              Đã dùng ({usedVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Hết hạn ({expiredVouchers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-6">
            {myVouchers.length === 0 ? (
              <Card className="p-12 text-center">
                <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">Chưa có voucher nào</h3>
                <p className="text-gray-600 mb-4">
                  Thêm mã voucher để nhận ưu đãi khi đặt dịch vụ
                </p>
              </Card>
            ) : (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    Sao chép mã voucher và áp dụng khi thanh toán để nhận ưu đãi!
                  </AlertDescription>
                </Alert>
                {myVouchers.map((voucher) => (
                  <VoucherCard key={voucher.id} voucher={voucher} />
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="used" className="space-y-4 mt-6">
            {usedVouchers.length === 0 ? (
              <Card className="p-12 text-center">
                <Check className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">Chưa sử dụng voucher nào</h3>
                <p className="text-gray-600">
                  Lịch sử sử dụng voucher sẽ hiển thị tại đây
                </p>
              </Card>
            ) : (
              usedVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} showUsedInfo />
              ))
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4 mt-6">
            {expiredVouchers.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">Không có voucher hết hạn</h3>
                <p className="text-gray-600">
                  Các voucher đã hết hạn sẽ hiển thị tại đây
                </p>
              </Card>
            ) : (
              expiredVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProfileLayout>
  );
}
