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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { AdminUser, adminUserApi } from "../../api/adminUserApi";
import { AdminLayout } from "../../components/AdminLayout";
import { UserDetailDialog } from "../../components/admin/UserDetailDialog";
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

interface AdminUsersPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminUsersPage({ onNavigate }: AdminUsersPageProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Add User Form
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as "user" | "admin" | "moderator",
    password: "",
  });

  // Edit User Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as "user" | "admin" | "moderator",
    status: "active" as "active" | "banned" | "suspended",
  });

  // Ban Confirmation
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<AdminUser | null>(null);

  // Delete Confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUserApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(t('admin.cannotLoadUsers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await adminUserApi.createUser({
        ...addFormData,
        status: "active"
      });
      toast.success(t('admin.userAdded', { name: addFormData.name }));
      setIsAddUserOpen(false);
      setAddFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error(t('admin.cannotCreateUser'));
    }
  };

  const handleViewDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await adminUserApi.updateUser(editingUser.id, editFormData);
      toast.success(t('admin.userUpdated', { name: editFormData.name }));
      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(t('admin.cannotUpdateUser'));
    }
  };

  const handleBan = (user: AdminUser) => {
    setUserToBan(user);
    setIsBanDialogOpen(true);
  };

  const confirmBan = async () => {
    if (userToBan) {
      try {
        await adminUserApi.banUser(userToBan.id);
        toast.success(t('admin.userBanned', { name: userToBan.name }));
        setIsBanDialogOpen(false);
        setUserToBan(null);
        fetchUsers();
      } catch (error) {
        console.error("Failed to ban user:", error);
        toast.error(t('admin.cannotBanUser'));
      }
    }
  };

  const handleDelete = (user: AdminUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await adminUserApi.deleteUser(userToDelete.id);
        toast.success(t('admin.userDeleted', { name: userToDelete.name }));
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error(t('admin.cannotDeleteUser'));
      }
    }
  };

  const stats = [
    { label: t('admin.totalUsers'), value: users.length.toLocaleString(), color: "blue" },
    { label: t('admin.active'), value: users.filter((u: AdminUser) => u.status === "active").length.toLocaleString(), color: "green" },
    { label: t('admin.suspended'), value: users.filter((u: AdminUser) => u.status === "suspended").length.toLocaleString(), color: "yellow" },
    { label: t('admin.banned'), value: users.filter((u: AdminUser) => u.status === "banned").length.toLocaleString(), color: "red" },
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

  const filteredUsers = users.filter((user: AdminUser) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || user.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout currentPage="admin-users" onNavigate={onNavigate} activePage="admin-users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('admin.manageUsers')}</h1>
            <p className="text-gray-600">{t('admin.manageUsersDesc')}</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t('admin.addUser')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('admin.addNewUser')}</DialogTitle>
                <DialogDescription>
                  {t('admin.createUserAccount')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">{t('admin.fullName')}</Label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="mt-1"
                    value={addFormData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddFormData({ ...addFormData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="mt-1"
                    value={addFormData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddFormData({ ...addFormData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('admin.phone')}</Label>
                  <Input
                    id="phone"
                    placeholder="+84 123 456 789"
                    className="mt-1"
                    value={addFormData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">{t('admin.role')}</Label>
                  <Select
                    value={addFormData.role}
                    onValueChange={(value: string) => setAddFormData({ ...addFormData, role: value })}
                  >
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
                  <Label htmlFor="password">{t('admin.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="mt-1"
                    value={addFormData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddFormData({ ...addFormData, password: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleAddUser}>{t('admin.createAccount')}</Button>
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
                placeholder={t('admin.searchUsers')}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('admin.role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.allRoles')}</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{t('common.all')} ({users.length})</TabsTrigger>
              <TabsTrigger value="active">{t('admin.active')} ({users.filter((u: AdminUser) => u.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="suspended">{t('admin.suspended')} ({users.filter((u: AdminUser) => u.status === 'suspended').length})</TabsTrigger>
              <TabsTrigger value="banned">{t('admin.banned')} ({users.filter((u: AdminUser) => u.status === 'banned').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Users Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>{t('admin.contact')}</TableHead>
                      <TableHead>{t('admin.role')}</TableHead>
                      <TableHead>{t('admin.status')}</TableHead>
                      <TableHead>{t('admin.bookings')}</TableHead>
                      <TableHead>{t('admin.totalSpent')}</TableHead>
                      <TableHead>{t('admin.joinDate')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {t('common.loading')}
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {t('admin.noUsersFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user: AdminUser) => (
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
                                    {t('common.edit')}
                                  </DropdownMenuItem>
                                  {user.status !== "banned" && (
                                    <DropdownMenuItem
                                      className="gap-2 text-yellow-600"
                                      onClick={() => handleBan(user)}
                                    >
                                      <Ban className="w-4 h-4" />
                                      {t('admin.ban')}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="gap-2 text-red-600"
                                    onClick={() => handleDelete(user)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    {t('common.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin.editUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.updateUserInfo')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">{t('admin.fullName')}</Label>
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                className="mt-1"
                value={editFormData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="mt-1"
                value={editFormData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('admin.phone')}</Label>
              <Input
                id="phone"
                placeholder="+84 123 456 789"
                className="mt-1"
                value={editFormData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">{t('admin.role')}</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, role: value })}
              >
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
              <Label htmlFor="status">{t('admin.status')}</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('admin.active')}</SelectItem>
                  <SelectItem value="suspended">{t('admin.suspended')}</SelectItem>
                  <SelectItem value="banned">{t('admin.banned')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSaveEdit}>{t('admin.saveChanges')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmBanUser')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.banUserDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBan}>{t('admin.ban')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmDeleteUser')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteUserDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}