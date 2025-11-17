import {
    Ban,
    Calendar,
    Edit,
    Eye,
    Mail,
    MoreVertical,
    Phone,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { AdminLayout } from "../../components/AdminLayout";
import { UserDetailDialog } from "../../components/admin/UserDetailDialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { adminApi } from "../../utils/api";

interface AdminUsersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "moderator";
  status: "active" | "banned" | "suspended";
  joinDate: string;
  lastLogin: string;
  bookings: number;
  totalSpent: number;
}

export default function AdminUsersPage({ onNavigate }: AdminUsersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
        toast.error('Không thể tải danh sách users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleEdit = (user: User) => {
    toast.success(`Chỉnh sửa user: ${user.name}`);
    // TODO: Open edit dialog
  };

  const handleBan = (user: User) => {
    toast.error(`Đã chặn user: ${user.name}`);
    // TODO: Implement ban logic
  };

  const handleDelete = async (user: User) => {
    try {
      await adminApi.deleteUser(user.id);
      toast.success(`Đã xóa user: ${user.name}`);
      // Reload users
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Không thể xóa user');
    }
  };

  const filteredUsers = users.filter(user => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by active tab
    const matchesTab = activeTab === "all" || user.role === activeTab;

    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: "Tổng users", value: "2,450", color: "blue" },
    { label: "Active", value: "2,340", color: "green" },
    { label: "Suspended", value: "85", color: "yellow" },
    { label: "Banned", value: "25", color: "red" },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-700">Moderator</Badge>;
      case "user":
        return <Badge className="bg-gray-100 text-gray-700">User</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-700">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-700">Banned</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="admin-users" onNavigate={onNavigate} activePage="admin-users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Quản lý Users</h1>
            <p className="text-gray-600">Quản lý tài khoản người dùng và phân quyền</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm User mới</DialogTitle>
                <DialogDescription>
                  Tạo tài khoản người dùng mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" placeholder="Nguyễn Văn A" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="+84 123 456 789" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="role">Quyền</Label>
                  <Select defaultValue="user">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" placeholder="********" className="mt-1" />
                </div>
                <Button className="w-full">Tạo tài khoản</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Search & Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Quyền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quyền</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tất cả ({users.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({users.filter(u => u.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="suspended">Suspended ({users.filter(u => u.status === 'suspended').length})</TabsTrigger>
              <TabsTrigger value="banned">Banned ({users.filter(u => u.status === 'banned').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Users Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Liên hệ</TableHead>
                      <TableHead>Quyền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Tổng chi tiêu</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="font-medium">{user.bookings}</TableCell>
                        <TableCell className="font-medium">
                          {(user.totalSpent / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {user.joinDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleViewDetail(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="gap-2"
                                  onClick={() => handleEdit(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                {user.status !== "banned" && (
                                  <DropdownMenuItem 
                                    className="gap-2 text-yellow-600"
                                    onClick={() => handleBan(user)}
                                  >
                                    <Ban className="w-4 h-4" />
                                    Chặn
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="gap-2 text-red-600"
                                  onClick={() => handleDelete(user)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* User Detail Dialog */}
      <UserDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        user={selectedUser}
        onEdit={handleEdit}
        onBan={handleBan}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
}
