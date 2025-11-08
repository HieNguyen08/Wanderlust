import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { 
  User, Mail, Phone, Calendar, Clock, 
  ShoppingBag, DollarSign, Shield, Ban, Edit
} from "lucide-react";

interface UserData {
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

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  onEdit?: (user: UserData) => void;
  onBan?: (user: UserData) => void;
  onDelete?: (user: UserData) => void;
}

export function UserDetailDialog({ 
  open, 
  onOpenChange, 
  user,
  onEdit,
  onBan,
  onDelete
}: UserDetailDialogProps) {
  if (!user) return null;

  const roleColors = {
    user: "bg-blue-100 text-blue-700",
    admin: "bg-purple-100 text-purple-700",
    moderator: "bg-green-100 text-green-700",
  };

  const statusColors = {
    active: "bg-green-100 text-green-700",
    banned: "bg-red-100 text-red-700",
    suspended: "bg-yellow-100 text-yellow-700",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Chi tiết người dùng</DialogTitle>
            <div className="flex gap-2">
              <Badge className={roleColors[user.role]}>
                {user.role === "user" ? "User" : user.role === "admin" ? "Admin" : "Moderator"}
              </Badge>
              <Badge className={statusColors[user.status]}>
                {user.status === "active" ? "Hoạt động" : user.status === "banned" ? "Đã chặn" : "Tạm ngưng"}
              </Badge>
            </div>
          </div>
          <DialogDescription>Mã người dùng: {user.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin cá nhân
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Họ tên</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-semibold">{user.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </p>
                <p className="font-semibold">{user.phone}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Vai trò
                </p>
                <Badge className={roleColors[user.role]}>
                  {user.role === "user" ? "User" : user.role === "admin" ? "Admin" : "Moderator"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Thông tin hoạt động
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày tham gia
                </p>
                <p className="font-semibold">{user.joinDate}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Đăng nhập gần nhất
                </p>
                <p className="font-semibold">{user.lastLogin}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              Thống kê
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tổng bookings</p>
                <p className="text-3xl font-bold text-blue-600">{user.bookings}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                <p className="text-3xl font-bold text-green-600">
                  {(user.totalSpent / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            {onEdit && (
              <Button 
                className="flex-1 gap-2"
                onClick={() => {
                  onEdit(user);
                  onOpenChange(false);
                }}
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            )}
            {onBan && user.status !== "banned" && (
              <Button 
                variant="destructive"
                className="gap-2"
                onClick={() => {
                  onBan(user);
                  onOpenChange(false);
                }}
              >
                <Ban className="w-4 h-4" />
                Chặn
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
