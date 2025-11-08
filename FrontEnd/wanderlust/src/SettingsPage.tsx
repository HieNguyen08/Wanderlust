import { useState } from "react";
import { ProfileLayout } from "./components/ProfileLayout";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card } from "./components/ui/card";
import { Switch } from "./components/ui/switch";
import { Separator } from "./components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./components/ui/dialog";
import { Lock, Bell, Globe, Shield, Trash2, Key } from "lucide-react";
import type { PageType } from "./MainApp";
import { toast } from "sonner@2.0.3";

interface SettingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [notifications, setNotifications] = useState({
    emailPromotions: true,
    emailBooking: true,
    emailReminders: true,
    pushPromotions: false,
    pushBooking: true,
    smsBooking: false,
  });

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    // Mock success
    toast.success("Đổi mật khẩu thành công!");
    setIsChangePasswordOpen(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <ProfileLayout currentPage="settings" onNavigate={onNavigate} activePage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Cài đặt tài khoản</h1>
          <p className="text-gray-600">Quản lý cài đặt bảo mật và thông báo</p>
        </div>

        {/* Change Password */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl text-gray-900">Bảo mật tài khoản</h2>
                <p className="text-sm text-gray-600">Quản lý mật khẩu và bảo mật</p>
              </div>
            </div>
            <Button onClick={() => setIsChangePasswordOpen(true)} className="gap-2">
              <Key className="w-4 h-4" />
              Đổi mật khẩu
            </Button>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">Mật khẩu</p>
                <p className="text-sm text-gray-600">••••••••••••</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsChangePasswordOpen(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Thay đổi
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">Xác thực hai yếu tố (2FA)</p>
                <p className="text-sm text-gray-600">Chưa kích hoạt</p>
              </div>
              <Button variant="ghost" size="sm" disabled>
                Kích hoạt
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl text-gray-900">Thông báo</h2>
              <p className="text-sm text-gray-600">Quản lý thông báo bạn muốn nhận</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6">
            {/* Email Notifications */}
            <div>
              <h3 className="text-gray-900 mb-4">Email</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Thông tin đặt chỗ</p>
                    <p className="text-sm text-gray-600">Nhận email xác nhận booking</p>
                  </div>
                  <Switch
                    checked={notifications.emailBooking}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailBooking: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Nhắc nhở chuyến đi</p>
                    <p className="text-sm text-gray-600">Nhận email nhắc nhở trước chuyến đi</p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Khuyến mãi</p>
                    <p className="text-sm text-gray-600">Nhận email về ưu đãi và khuyến mãi</p>
                  </div>
                  <Switch
                    checked={notifications.emailPromotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailPromotions: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Push Notifications */}
            <div>
              <h3 className="text-gray-900 mb-4">Thông báo đẩy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Thông tin đặt chỗ</p>
                    <p className="text-sm text-gray-600">Nhận thông báo về booking của bạn</p>
                  </div>
                  <Switch
                    checked={notifications.pushBooking}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushBooking: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Khuyến mãi</p>
                    <p className="text-sm text-gray-600">Nhận thông báo về ưu đãi mới</p>
                  </div>
                  <Switch
                    checked={notifications.pushPromotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushPromotions: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SMS Notifications */}
            <div>
              <h3 className="text-gray-900 mb-4">SMS</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Thông tin đặt chỗ</p>
                  <p className="text-sm text-gray-600">Nhận SMS xác nhận booking</p>
                </div>
                <Switch
                  checked={notifications.smsBooking}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, smsBooking: checked })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Language & Region */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl text-gray-900">Ngôn ngữ & Khu vực</h2>
              <p className="text-sm text-gray-600">Tùy chỉnh ngôn ngữ và tiền tệ</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="language">Ngôn ngữ</Label>
              <select
                id="language"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <div>
              <Label htmlFor="currency">Tiền tệ</Label>
              <select
                id="currency"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vnd">VND - Việt Nam Đồng</option>
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="jpy">JPY - Japanese Yen</option>
              </select>
            </div>

            <Button className="w-full">Lưu thay đổi</Button>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl text-gray-900">Bảo mật & Quyền riêng tư</h2>
              <p className="text-sm text-gray-600">Quản lý cài đặt bảo mật tài khoản</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Xác thực hai yếu tố</p>
                <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
              </div>
              <Button variant="outline">Kích hoạt</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Thiết bị đã đăng nhập</p>
                <p className="text-sm text-gray-600">Quản lý các thiết bị có quyền truy cập</p>
              </div>
              <Button variant="outline">Xem chi tiết</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Tải dữ liệu cá nhân</p>
                <p className="text-sm text-gray-600">Tải về dữ liệu của bạn</p>
              </div>
              <Button variant="outline">Tải xuống</Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl text-red-900">Vùng nguy hiểm</h2>
              <p className="text-sm text-gray-600">Các hành động không thể hoàn tác</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Xóa tài khoản</p>
                <p className="text-sm text-gray-600">
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn
                </p>
              </div>
              <Button variant="destructive">Xóa tài khoản</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
}
