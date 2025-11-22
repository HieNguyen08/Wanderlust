import { AlertCircle, Calendar, Check, Copy, Gift, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { PageType } from "../../MainApp";
import { tokenService, userVoucherApi } from "../../utils/api";
import { type FrontendRole } from "../../utils/roleMapper";

interface UserVouchersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: FrontendRole | null;
  onLogout?: () => void;
}

export default function UserVouchersPage({ onNavigate, userRole, onLogout }: UserVouchersPageProps) {
  const { t } = useTranslation();
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
        toast.error(t('vouchers.loginRequired', 'Vui lòng đăng nhập để xem voucher'));
        onNavigate('login');
      } else {
        console.error('Error loading vouchers:', error);
        toast.error(t('vouchers.loadError', 'Không thể tải danh sách voucher'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(t('vouchers.copySuccess'));
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
        toast.success(t('vouchers.copySuccess'));
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (fallbackErr) {
        toast.error(t('vouchers.copyError', 'Không thể sao chép mã'));
      }
    }
  };

  const handleAddVoucher = async () => {
    const code = addCodeInput.trim().toUpperCase();
    if (!code) {
      toast.error(t('vouchers.enterCodeError', 'Vui lòng nhập mã voucher!'));
      return;
    }

    try {
      setSaving(true);
      
      // Call backend API to save voucher
      await userVoucherApi.saveToWallet(code);
      
      toast.success(t('vouchers.addSuccess'));
      setAddCodeInput("");
      
      // Reload vouchers list
      await loadVouchers();
      
    } catch (error: any) {
      // Show specific error message from backend
      toast.error(error.message || t('vouchers.addError', 'Không thể thêm voucher'));
    } finally {
      setSaving(false);
    }
  };

  const formatValue = (type: string, value: number, maxDiscount: number | null) => {
    if (type === "PERCENTAGE") {
      return t('vouchers.discountPercent', { value, max: maxDiscount ? ` (${t('vouchers.maxDiscount', 'tối đa')} ${maxDiscount.toLocaleString('vi-VN')}đ)` : '' });
    }
    return t('vouchers.discountAmount', { value: value.toLocaleString('vi-VN') });
  };

  const VoucherCard = ({ voucher, showUsedInfo = false }: { voucher: any; showUsedInfo?: boolean }) => (
    <Card className={`overflow-hidden ${voucher.status === 'EXPIRED' || voucher.status === 'USED' ? 'opacity-60' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* Left side - Visual */}
        <div className="bg-linear-to-br from-blue-500 to-purple-600 p-6 md:w-48 flex flex-col items-center justify-center text-white relative">
          <Ticket className="w-12 h-12 mb-2" />
          <div className="text-center">
            <div className="text-sm opacity-90">{t('profile.vouchers.discountCode')}</div>
            <code className="text-lg font-mono mt-1 block">{voucher.voucherCode || voucher.code}</code>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
          
          {voucher.giftedBy && (
            <Badge className="mt-3 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
              <Gift className="w-3 h-3 mr-1" />
              {t('profile.vouchers.gifted', 'Được tặng')}
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
                    {t('profile.vouchers.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {t('profile.vouchers.copy')}
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
                <span>{t('profile.vouchers.minOrder')}: {voucher.minSpend.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{t('profile.vouchers.expiry', 'HSD')}: {voucher.startDate} - {voucher.endDate}</span>
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
                <div>{t('profile.vouchers.usedDate', 'Đã sử dụng')}: {voucher.usedDate}</div>
                <div>{t('profile.vouchers.orderAmount', 'Đơn hàng')}: {voucher.orderAmount?.toLocaleString('vi-VN')}đ</div>
                <div className="text-green-600">{t('profile.vouchers.savings', 'Tiết kiệm')}: {voucher.discountAmount?.toLocaleString('vi-VN')}đ</div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          {voucher.status === 'EXPIRED' && (
            <Badge variant="secondary" className="mt-2">{t('profile.vouchers.expired')}</Badge>
          )}
          {voucher.status === 'USED' && (
            <Badge className="mt-2 bg-gray-500">{t('profile.vouchers.used')}</Badge>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <ProfileLayout currentPage="vouchers" onNavigate={onNavigate} activePage="vouchers" userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900">{t('profile.vouchers.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('profile.vouchers.subtitle')}
          </p>
        </div>

        {/* Add Voucher */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">{t('profile.vouchers.addVoucher')}</h3>
          <div className="flex gap-3">
            <Input
              placeholder={t('profile.vouchers.enterCode')}
              value={addCodeInput}
              onChange={(e) => setAddCodeInput(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddVoucher()}
              className="flex-1"
            />
            <Button onClick={handleAddVoucher}>
              {t('profile.vouchers.addToWallet')}
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('profile.vouchers.available')}</p>
                <p className="text-3xl text-blue-600">{myVouchers.length}</p>
              </div>
              <Ticket className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('profile.vouchers.used')}</p>
                <p className="text-3xl text-gray-600">{usedVouchers.length}</p>
              </div>
              <Check className="w-10 h-10 text-gray-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('profile.vouchers.totalSaved')}</p>
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
              {t('profile.vouchers.available')} ({myVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="used">
              {t('profile.vouchers.used')} ({usedVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              {t('profile.vouchers.expired')} ({expiredVouchers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-6">
            {myVouchers.length === 0 ? (
              <Card className="p-12 text-center">
                <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">{t('profile.vouchers.noVouchers')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('profile.vouchers.noVouchersDesc', 'Thêm mã voucher để nhận ưu đãi khi đặt dịch vụ')}
                </p>
              </Card>
            ) : (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    {t('profile.vouchers.applyHint', 'Sao chép mã voucher và áp dụng khi thanh toán để nhận ưu đãi!')}
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
                <h3 className="text-lg text-gray-900 mb-2">{t('profile.vouchers.noUsedVouchers', 'Chưa sử dụng voucher nào')}</h3>
                <p className="text-gray-600">
                  {t('profile.vouchers.noUsedVouchersDesc', 'Lịch sử sử dụng voucher sẽ hiển thị tại đây')}
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
                <h3 className="text-lg text-gray-900 mb-2">{t('profile.vouchers.noExpiredVouchers', 'Không có voucher hết hạn')}</h3>
                <p className="text-gray-600">
                  {t('profile.vouchers.noExpiredVouchersDesc', 'Các voucher đã hết hạn sẽ hiển thị tại đây')}
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
