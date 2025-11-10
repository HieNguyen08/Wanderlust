import { useState } from "react";
import { VendorLayout } from "../../components/VendorLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Plus, Search, Eye, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CreateVendorVoucherDialog } from "../../components/vendor/CreateVendorVoucherDialog";
import { VoucherDetailDialog } from "../../components/admin/VoucherDetailDialog";
import type { PageType } from "../../MainApp";
import { toast } from "sonner@2.0.3";

interface VendorVouchersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function VendorVouchersPage({ onNavigate }: VendorVouchersPageProps) {
  const vendorId = "vendor_abc"; // Current vendor ID
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Mock vouchers data - only vouchers created by this vendor
  const [vouchers, setVouchers] = useState([
    {
      id: 4,
      code: "VENDOR_ABC_SALE",
      type: "PERCENTAGE",
      value: 15,
      maxDiscount: 200000,
      minSpend: 800000,
      startDate: "2025-11-10",
      endDate: "2025-11-20",
      totalUsesLimit: 200,
      userUseLimit: 1,
      totalUsed: 45,
      createdBy: "VENDOR",
      createdById: vendorId,
      status: "ACTIVE",
      approvalStatus: "APPROVED",
      conditions: [
        { type: "VENDOR", value: vendorId }
      ]
    },
    {
      id: 10,
      code: "HOTEL_SPECIAL",
      type: "FIXED_AMOUNT",
      value: 150000,
      maxDiscount: null,
      minSpend: 1500000,
      startDate: "2025-11-15",
      endDate: "2025-12-15",
      totalUsesLimit: 100,
      userUseLimit: 1,
      totalUsed: 0,
      createdBy: "VENDOR",
      createdById: vendorId,
      status: "PAUSED",
      approvalStatus: "PENDING_APPROVAL",
      conditions: [
        { type: "VENDOR", value: vendorId },
        { type: "CATEGORY", value: "hotels" }
      ]
    },
    {
      id: 11,
      code: "ACTIVITY_DISCOUNT",
      type: "PERCENTAGE",
      value: 20,
      maxDiscount: 300000,
      minSpend: 500000,
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      totalUsesLimit: 50,
      userUseLimit: 1,
      totalUsed: 50,
      createdBy: "VENDOR",
      createdById: vendorId,
      status: "EXPIRED",
      approvalStatus: "APPROVED",
      conditions: [
        { type: "VENDOR", value: vendorId },
        { type: "CATEGORY", value: "activities" }
      ]
    },
  ]);

  // Pending approval vouchers
  const pendingVouchers = vouchers.filter(v => v.approvalStatus === "PENDING_APPROVAL");

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDetailDialogOpen(true);
  };

  const handleDeleteVoucher = (voucherId: number) => {
    const voucher = vouchers.find(v => v.id === voucherId);
    if (voucher && confirm(`Bạn có chắc muốn xóa voucher ${voucher.code}?`)) {
      setVouchers(vouchers.filter(v => v.id !== voucherId));
      toast.success("Đã xóa voucher");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Đang hoạt động</Badge>;
      case "PAUSED":
        return <Badge className="bg-yellow-500">Tạm dừng</Badge>;
      case "EXPIRED":
        return <Badge variant="secondary">Hết hạn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case "PENDING_APPROVAL":
        return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "PERCENTAGE" 
      ? <Badge variant="outline">Phần trăm</Badge>
      : <Badge variant="outline">Số tiền cố định</Badge>;
  };

  const formatValue = (type: string, value: number) => {
    return type === "PERCENTAGE" 
      ? `${value}%`
      : `${value.toLocaleString('vi-VN')}đ`;
  };

  const stats = [
    {
      label: "Tổng vouchers",
      value: vouchers.length,
      color: "text-blue-600"
    },
    {
      label: "Đang hoạt động",
      value: vouchers.filter(v => v.status === "ACTIVE" && v.approvalStatus === "APPROVED").length,
      color: "text-green-600"
    },
    {
      label: "Chờ duyệt",
      value: pendingVouchers.length,
      color: "text-yellow-600"
    },
    {
      label: "Tổng lượt sử dụng",
      value: vouchers.reduce((sum, v) => sum + v.totalUsed, 0).toLocaleString('vi-VN'),
      color: "text-purple-600"
    },
  ];

  return (
    <VendorLayout currentPage="vendor-vouchers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">Quản lý Vouchers</h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý mã giảm giá cho dịch vụ của bạn
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo Voucher Mới
          </Button>
        </div>

        {/* Pending Alert */}
        {pendingVouchers.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bạn có <strong>{pendingVouchers.length}</strong> voucher đang chờ Admin duyệt.
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Lưu ý:</strong> Voucher của bạn chỉ áp dụng cho các dịch vụ do bạn cung cấp. 
            Tất cả voucher mới cần được Admin phê duyệt trước khi có thể sử dụng.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm theo mã voucher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="PAUSED">Tạm dừng</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Vouchers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Voucher</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Điều kiện</TableHead>
                <TableHead>Sử dụng</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Phê duyệt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Không tìm thấy voucher nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {voucher.code}
                      </code>
                    </TableCell>
                    <TableCell>{getTypeBadge(voucher.type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-gray-900">
                          {formatValue(voucher.type, voucher.value)}
                        </div>
                        {voucher.maxDiscount && (
                          <div className="text-xs text-gray-500">
                            Tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voucher.minSpend > 0 && (
                          <div className="text-gray-600">
                            Đơn từ {voucher.minSpend.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {voucher.totalUsed.toLocaleString('vi-VN')}
                          {voucher.totalUsesLimit && ` / ${voucher.totalUsesLimit.toLocaleString('vi-VN')}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-600">{voucher.startDate}</div>
                        <div className="text-gray-600">đến {voucher.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getApprovalBadge(voucher.approvalStatus)}</TableCell>
                    <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(voucher)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {voucher.approvalStatus === "PENDING_APPROVAL" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create Voucher Dialog */}
      <CreateVendorVoucherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        vendorId={vendorId}
        onVoucherCreated={(newVoucher) => {
          setVouchers([...vouchers, { ...newVoucher, id: Math.max(...vouchers.map(v => v.id)) + 1 }]);
          toast.success("Đã gửi yêu cầu tạo voucher! Chờ Admin phê duyệt.");
        }}
      />

      {/* Voucher Detail Dialog */}
      {selectedVoucher && (
        <VoucherDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          voucher={selectedVoucher}
        />
      )}
    </VendorLayout>
  );
}
