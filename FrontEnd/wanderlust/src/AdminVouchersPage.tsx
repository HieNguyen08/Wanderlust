import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Plus, Search, Edit, Trash2, Copy, Pause, Play, Eye } from "lucide-react";
import { CreateVoucherDialog } from "./components/admin/CreateVoucherDialog";
import { VoucherDetailDialog } from "./components/admin/VoucherDetailDialog";
import type { PageType } from "./MainApp";
import { toast } from "sonner@2.0.3";

interface AdminVouchersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminVouchersPage({ onNavigate }: AdminVouchersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Mock vouchers data
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "BLACKFRIDAY",
      type: "PERCENTAGE",
      value: 20,
      maxDiscount: 500000,
      minSpend: 1000000,
      startDate: "2025-11-01",
      endDate: "2025-11-30",
      totalUsesLimit: 1000,
      userUseLimit: 1,
      totalUsed: 342,
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: "ACTIVE",
      conditions: [
        { type: "CATEGORY", value: "activities" }
      ]
    },
    {
      id: 2,
      code: "WELCOME100K",
      type: "FIXED_AMOUNT",
      value: 100000,
      maxDiscount: null,
      minSpend: 500000,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      totalUsesLimit: null,
      userUseLimit: 1,
      totalUsed: 1253,
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: "ACTIVE",
      conditions: []
    },
    {
      id: 3,
      code: "HOTEL50",
      type: "PERCENTAGE",
      value: 10,
      maxDiscount: 300000,
      minSpend: 2000000,
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      totalUsesLimit: 500,
      userUseLimit: 1,
      totalUsed: 489,
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: "ACTIVE",
      conditions: [
        { type: "CATEGORY", value: "hotels" }
      ]
    },
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
      createdById: "vendor_abc",
      status: "ACTIVE",
      conditions: [
        { type: "VENDOR", value: "vendor_abc" }
      ]
    },
    {
      id: 5,
      code: "SUMMER2025",
      type: "PERCENTAGE",
      value: 25,
      maxDiscount: 1000000,
      minSpend: 3000000,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      totalUsesLimit: 2000,
      userUseLimit: 1,
      totalUsed: 0,
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: "PAUSED",
      conditions: []
    },
    {
      id: 6,
      code: "EXPIRED_CODE",
      type: "FIXED_AMOUNT",
      value: 50000,
      maxDiscount: null,
      minSpend: 0,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      totalUsesLimit: 100,
      userUseLimit: 1,
      totalUsed: 98,
      createdBy: "ADMIN",
      createdById: "admin_001",
      status: "EXPIRED",
      conditions: []
    },
  ]);

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || voucher.status === statusFilter;
    const matchesType = typeFilter === "ALL" || voucher.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleToggleStatus = (voucherId: number) => {
    setVouchers(vouchers.map(v => {
      if (v.id === voucherId) {
        const newStatus = v.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
        toast.success(`Voucher ${v.code} đã ${newStatus === "ACTIVE" ? "kích hoạt" : "tạm dừng"}`);
        return { ...v, status: newStatus };
      }
      return v;
    }));
  };

  const handleDuplicateVoucher = (voucher: any) => {
    const newVoucher = {
      ...voucher,
      id: Math.max(...vouchers.map(v => v.id)) + 1,
      code: `${voucher.code}_COPY`,
      totalUsed: 0,
      status: "PAUSED"
    };
    setVouchers([...vouchers, newVoucher]);
    toast.success(`Đã nhân bản voucher ${voucher.code}`);
  };

  const handleDeleteVoucher = (voucherId: number) => {
    const voucher = vouchers.find(v => v.id === voucherId);
    if (voucher && confirm(`Bạn có chắc muốn xóa voucher ${voucher.code}?`)) {
      setVouchers(vouchers.filter(v => v.id !== voucherId));
      toast.success("Đã xóa voucher");
    }
  };

  const handleViewDetails = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDetailDialogOpen(true);
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
      value: vouchers.filter(v => v.status === "ACTIVE").length,
      color: "text-green-600"
    },
    {
      label: "Tổng lượt sử dụng",
      value: vouchers.reduce((sum, v) => sum + v.totalUsed, 0).toLocaleString('vi-VN'),
      color: "text-purple-600"
    },
    {
      label: "Hết hạn",
      value: vouchers.filter(v => v.status === "EXPIRED").length,
      color: "text-gray-600"
    },
  ];

  return (
    <AdminLayout currentPage="admin-vouchers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">Quản lý Vouchers</h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý mã giảm giá cho toàn hệ thống
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo Voucher Mới
          </Button>
        </div>

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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Loại voucher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả loại</SelectItem>
                <SelectItem value="PERCENTAGE">Phần trăm</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Số tiền cố định</SelectItem>
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
                <TableHead>Người tạo</TableHead>
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
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {voucher.code}
                        </code>
                      </div>
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
                        {voucher.conditions.length > 0 && (
                          <div className="text-blue-600">
                            {voucher.conditions.length} điều kiện
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
                        <div className="text-xs text-gray-500">
                          lượt sử dụng
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-600">{voucher.startDate}</div>
                        <div className="text-gray-600">đến {voucher.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={voucher.createdBy === "ADMIN" ? "default" : "secondary"}>
                        {voucher.createdBy}
                      </Badge>
                    </TableCell>
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
                        {voucher.status !== "EXPIRED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(voucher.id)}
                          >
                            {voucher.status === "ACTIVE" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateVoucher(voucher)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
      <CreateVoucherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onVoucherCreated={(newVoucher) => {
          setVouchers([...vouchers, { ...newVoucher, id: Math.max(...vouchers.map(v => v.id)) + 1 }]);
          toast.success("Đã tạo voucher mới thành công!");
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
    </AdminLayout>
  );
}
