import { useState } from "react";
import { ProfileLayout } from "./components/ProfileLayout";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import type { PageType } from "./MainApp";

interface UserWalletPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "refund";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
  orderId?: string;
  vendorName?: string;
}

export default function UserWalletPage({ onNavigate }: UserWalletPageProps) {
  const [balance] = useState(2450000);
  const [transactions] = useState<WalletTransaction[]>([
    {
      id: "TXN001",
      type: "refund",
      amount: 1000000,
      description: "Hoàn tiền - Vendor hủy đơn hàng",
      status: "completed",
      date: "2025-11-05 14:30",
      orderId: "#56789",
      vendorName: "Golden Tours",
    },
    {
      id: "TXN002",
      type: "credit",
      amount: 500000,
      description: "Nạp tiền vào ví",
      status: "completed",
      date: "2025-11-03 10:15",
    },
    {
      id: "TXN003",
      type: "debit",
      amount: 850000,
      description: "Thanh toán đặt phòng khách sạn",
      status: "completed",
      date: "2025-11-02 16:45",
      orderId: "#56788",
    },
    {
      id: "TXN004",
      type: "refund",
      amount: 1200000,
      description: "Hoàn tiền - Hủy tour du lịch",
      status: "pending",
      date: "2025-11-01 09:20",
      orderId: "#56787",
    },
    {
      id: "TXN005",
      type: "credit",
      amount: 600000,
      description: "Hoàn tiền từ hủy vé máy bay",
      status: "completed",
      date: "2025-10-30 11:30",
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "credit":
      case "refund":
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case "debit":
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case "credit": return "Nạp tiền";
      case "debit": return "Thanh toán";
      case "refund": return "Hoàn tiền";
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Hoàn tất</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return null;
    }
  };

  return (
    <ProfileLayout currentPage="wallet" onNavigate={onNavigate} activePage="wallet">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Ví của tôi</h1>
          <p className="text-gray-600">
            Quản lý số dư và lịch sử giao dịch
          </p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Số dư khả dụng</p>
                  <h2 className="text-4xl mt-1">{balance.toLocaleString('vi-VN')}đ</h2>
                </div>
              </div>
              <Button 
                className="bg-white text-blue-600 hover:bg-white/90"
                onClick={() => onNavigate("topup-wallet")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nạp tiền
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm text-white/80">Tổng nạp</span>
                </div>
                <p className="text-xl">1.100.000đ</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm text-white/80">Tổng chi</span>
                </div>
                <p className="text-xl">850.000đ</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownLeft className="w-4 h-4" />
                  <span className="text-sm text-white/80">Hoàn tiền</span>
                </div>
                <p className="text-xl">2.200.000đ</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0"
            onClick={() => onNavigate("topup-wallet")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Nạp tiền</h3>
                <p className="text-sm text-gray-600">Thêm tiền vào ví</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0"
            onClick={() => onNavigate("booking-history")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Lịch sử</h3>
                <p className="text-sm text-gray-600">Xem giao dịch</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0"
            onClick={() => alert("Chức năng sẽ được cập nhật")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Thống kê</h3>
                <p className="text-sm text-gray-600">Xem báo cáo</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">Lịch sử giao dịch</h2>
            <Badge variant="outline">{transactions.length} giao dịch</Badge>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card 
                key={transaction.id} 
                className="p-4 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'debit' ? 'bg-red-50' : 'bg-green-50'
                    }`}>
                      {getTypeIcon(transaction.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{transaction.description}</h3>
                        {transaction.orderId && (
                          <Badge variant="outline" className="text-xs">
                            {transaction.orderId}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{getTypeLabel(transaction.type)}</span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                        {transaction.vendorName && (
                          <>
                            <span>•</span>
                            <span>{transaction.vendorName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(transaction.status)}
                    <div className="text-right">
                      <p className={`text-xl ${
                        transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'debit' ? '-' : '+'}
                        {transaction.amount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>

                {transaction.type === 'refund' && transaction.status === 'pending' && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>Yêu cầu hoàn tiền đang được xử lý bởi Admin. Dự kiến 1-3 ngày làm việc.</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Chưa có giao dịch nào</p>
              <p className="text-gray-400">
                Lịch sử giao dịch của bạn sẽ hiển thị ở đây
              </p>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">Về ví Wanderlust</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Sử dụng ví để thanh toán nhanh chóng cho các dịch vụ</li>
                <li>• Nhận hoàn tiền tự động khi vendor hủy đơn</li>
                <li>• Tiền trong ví có thể rút về tài khoản ngân hàng</li>
                <li>• Bảo mật tuyệt đối với công nghệ mã hóa cao cấp</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </ProfileLayout>
  );
}
