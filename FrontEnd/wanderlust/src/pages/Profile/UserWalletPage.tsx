import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  TrendingUp,
  Wallet,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useNotification } from "../../contexts/NotificationContext";
import type { PageType } from "../../MainApp";
import { tokenService, transactionApi, walletApi } from "../../utils/api";
import { type FrontendRole } from "../../utils/roleMapper";

interface UserWalletPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: FrontendRole | null;
  onLogout?: () => void;
}

interface WalletTransaction {
  transactionId: string;
  type: "CREDIT" | "DEBIT" | "REFUND" | "WITHDRAW";
  amount: number;
  description: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
  bookingId?: string;
  relatedUserId?: string;
  fromWalletId?: string;
  toWalletId?: string;
  commissionAmount?: number;
  voucherCode?: string;
  voucherDiscount?: number;
}

export default function UserWalletPage({ onNavigate, userRole, onLogout }: UserWalletPageProps) {
  const { t } = useTranslation();
  const { addNotification } = useNotification();

  const [balance, setBalance] = useState(0);
  const [totalTopUp, setTotalTopUp] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadWalletData = async () => {
      setLoading(true);
      try {
        try {
          const walletData = await walletApi.getWallet();
          setWalletId(walletData.walletId || null);
          setBalance(walletData.balance ?? walletData.amount ?? 0);
          setTotalTopUp(walletData.totalTopUp ?? 0);
          setTotalSpent(walletData.totalSpent ?? 0);
          setTotalRefund(walletData.totalRefund ?? 0);
        } catch (walletError: any) {
          if (walletError.message === "UNAUTHORIZED") {
            tokenService.clearAuth();
            onNavigate("login");
            return;
          }
          console.warn("Wallet API not available, using default values");
          setBalance(0);
          setTotalTopUp(0);
          setTotalSpent(0);
          setTotalRefund(0);
        }

        try {
          const transactionData = await transactionApi.getTransactions({
            page,
            size: 10,
          });

          const mappedTransactions: WalletTransaction[] = transactionData.content.map((txn: any) => ({
            transactionId: txn.transactionId,
            type: txn.type,
            amount: txn.amount,
            description: txn.description,
            status: txn.status,
            createdAt: txn.createdAt,
            bookingId: txn.bookingId,
            relatedUserId: txn.relatedUserId,
            fromWalletId: txn.fromWalletId,
            toWalletId: txn.toWalletId,
            commissionAmount: txn.commissionAmount,
            voucherCode: txn.voucherCode,
            voucherDiscount: txn.voucherDiscount,
          }));

          setTransactions(mappedTransactions);
          setTotalPages(transactionData.totalPages || 0);

          if (transactionData.content.length > 0) {
            const sortedTxns = [...transactionData.content].sort((a: any, b: any) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const latestTxn = sortedTxns[0];
            const latestDate = new Date(latestTxn.createdAt).getTime();
            const lastCheck = parseInt(localStorage.getItem("last_transaction_check") || "0");

            if (latestDate > lastCheck) {
              addNotification({
                type: "wallet",
                title: t("notifications.newTransaction", "Giao dịch ví mới"),
                message: t("notifications.newTransactionDesc", "Bạn có giao dịch mới: {{amount}}đ", {
                  amount: latestTxn.amount.toLocaleString("vi-VN"),
                }),
                link: "/wallet",
                data: { transactionId: latestTxn.transactionId },
              });
              localStorage.setItem("last_transaction_check", latestDate.toString());
            }
          }
        } catch (txnError: any) {
          if (txnError.message === "UNAUTHORIZED") {
            toast.error("Phiên đăng nhập đã hết hạn");
            tokenService.clearAuth();
            onNavigate("login");
            return;
          }
          console.warn("Transaction API not available, showing empty list");
          setTransactions([]);
          setTotalPages(0);
        }
      } catch (error: any) {
        console.error("Failed to load wallet data:", error);
        if (!error.message?.includes("ERR_CONNECTION_REFUSED")) {
          toast.error(error.message || t("profile.wallet.loadError", "Không thể tải dữ liệu ví"));
        }
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [page, t, onNavigate, addNotification]);

  const getTypeIcon = (isDebitLike: boolean) => {
    if (isDebitLike) return <ArrowUpRight className="w-5 h-5 text-red-600" />;
    return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "CREDIT":
        return t("profile.wallet.deposit");
      case "DEBIT":
        return t("profile.wallet.payment");
      case "REFUND":
        return t("profile.wallet.refund");
      case "WITHDRAW":
        return t("profile.wallet.withdraw");
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("profile.wallet.completed")}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            {t("profile.wallet.pending")}
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            {t("profile.wallet.failed")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderTransactionRow = (transaction: WalletTransaction) => {
    const incoming = walletId && transaction.toWalletId === walletId;
    const outgoing = walletId && transaction.fromWalletId === walletId;
    const isDebitLike = Boolean(outgoing || (!incoming && (transaction.type === "DEBIT" || transaction.type === "WITHDRAW")));
    const amountValue = isDebitLike ? -transaction.amount : transaction.amount;
    const amountColor = isDebitLike ? "text-red-600" : "text-green-600";
    const badgeBg = isDebitLike ? "bg-red-50" : "bg-green-50";

    return (
      <Card key={transaction.transactionId} className="p-4 hover:shadow-md transition-shadow border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badgeBg}`}>
              {getTypeIcon(isDebitLike)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">{transaction.description}</h3>
                {transaction.bookingId && (
                  <Badge variant="outline" className="text-xs">
                    {transaction.bookingId}
                  </Badge>
                )}
                {transaction.voucherCode && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                    {transaction.voucherCode}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{getTypeLabel(transaction.type)}</span>
                <span>•</span>
                <span>{new Date(transaction.createdAt).toLocaleString("vi-VN")}</span>
                {transaction.voucherDiscount && (
                  <>
                    <span>•</span>
                    <span className="text-purple-600">
                      Giảm {transaction.voucherDiscount.toLocaleString("vi-VN")}đ
                    </span>
                  </>
                )}
                {transaction.commissionAmount && (
                  <>
                    <span>•</span>
                    <span className="text-orange-600">
                      Hoa hồng: {transaction.commissionAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {getStatusBadge(transaction.status)}
            <div className="text-right">
              <p className={`text-xl ${amountColor}`}>
                {amountValue > 0 ? "+" : ""}
                {amountValue.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        {transaction.type === "REFUND" && transaction.status === "PENDING" && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>
                {t(
                  "profile.wallet.refundProcessing",
                  "Yêu cầu hoàn tiền đang được xử lý bởi Admin. Dự kiến 1-3 ngày làm việc."
                )}
              </span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <ProfileLayout currentPage="wallet" onNavigate={onNavigate} activePage="wallet" userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t("profile.wallet.title")}</h1>
          <p className="text-gray-600">{t("profile.wallet.subtitle")}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <Card className="bg-linear-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">{t("profile.wallet.balance")}</p>
                      <h2 className="text-4xl mt-1">{balance.toLocaleString("vi-VN")}đ</h2>
                    </div>
                  </div>
                  <Button className="bg-white text-blue-600 hover:bg-white/90" onClick={() => onNavigate("topup-wallet")}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("profile.wallet.topUp")}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm text-white/80">{t("profile.wallet.totalDeposit")}</span>
                    </div>
                    <p className="text-xl">{totalTopUp.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm text-white/80">{t("profile.wallet.totalSpent")}</span>
                    </div>
                    <p className="text-xl">{totalSpent.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownLeft className="w-4 h-4" />
                      <span className="text-sm text-white/80">{t("profile.wallet.totalRefund")}</span>
                    </div>
                    <p className="text-xl">{totalRefund.toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0" onClick={() => onNavigate("topup-wallet")}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t("profile.wallet.topUp")}</h3>
                    <p className="text-sm text-gray-600">{t("profile.wallet.addMoney", "Thêm tiền vào ví")}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0" onClick={() => onNavigate("booking-history")}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t("profile.wallet.history")}</h3>
                    <p className="text-sm text-gray-600">{t("profile.wallet.viewTransactions", "Xem giao dịch")}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0" onClick={() => alert("Chức năng sẽ được cập nhật")}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t("profile.wallet.statistics")}</h3>
                    <p className="text-sm text-gray-600">{t("profile.wallet.viewReport", "Xem báo cáo")}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">{t("profile.wallet.transactionHistory")}</h2>
                <Badge variant="outline">
                  {transactions.length} {t("profile.wallet.transactions", "giao dịch")}
                </Badge>
              </div>

              <div className="space-y-4">{transactions.map(renderTransactionRow)}</div>

              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">{t("profile.wallet.noTransactions")}</p>
                  <p className="text-gray-400">
                    {t("profile.wallet.noTransactionsDesc", "Lịch sử giao dịch của bạn sẽ hiển thị ở đây")}
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">{t("profile.wallet.aboutWallet")}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• {t("profile.wallet.aboutPoint1", "Sử dụng ví để thanh toán nhanh chóng cho các dịch vụ")}</li>
                    <li>• {t("profile.wallet.aboutPoint2", "Nhận hoàn tiền tự động khi vendor hủy đơn")}</li>
                    <li>• {t("profile.wallet.aboutPoint3", "Tiền trong ví có thể rút về tài khoản ngân hàng")}</li>
                    <li>• {t("profile.wallet.aboutPoint4", "Bảo mật tuyệt đối với công nghệ mã hóa cao cấp")}</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </ProfileLayout>
  );
}
