import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Switch } from "./components/ui/switch";
import { Separator } from "./components/ui/separator";
import {
  Globe, DollarSign, Mail, Shield, Bell,
  CreditCard, Database, Save
} from "lucide-react";
import type { PageType } from "./MainApp";

interface AdminSettingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminSettingsPage({ onNavigate }: AdminSettingsPageProps) {
  const [settings, setSettings] = useState({
    siteName: "Wanderlust",
    siteDescription: "Nền tảng du lịch hàng đầu Việt Nam",
    contactEmail: "support@wanderlust.vn",
    contactPhone: "+84 28 1234 5678",
    currency: "VND",
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    
    stripeEnabled: true,
    stripePublicKey: "pk_test_...",
    paypalEnabled: false,
    momoEnabled: true,
    vnpayEnabled: true,
  });

  return (
    <AdminLayout currentPage="admin-settings" onNavigate={onNavigate} activePage="admin-settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý cấu hình và thiết lập website</p>
        </div>

        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cài đặt chung</h2>
              <p className="text-sm text-gray-600">Thông tin cơ bản về website</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div>
              <Label htmlFor="siteName">Tên website</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="siteDescription">Mô tả website</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email liên hệ</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Số điện thoại</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency">Tiền tệ</Label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="VND">VND - Việt Nam Đồng</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Ngôn ngữ</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">Múi giờ</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                  <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                  <option value="Asia/Singapore">Singapore (GMT+8)</option>
                </select>
              </div>
            </div>

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
              <p className="text-sm text-gray-600">Cấu hình hệ thống thông báo</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email thông báo</p>
                <p className="text-sm text-gray-600">Gửi thông báo qua email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS thông báo</p>
                <p className="text-sm text-gray-600">Gửi thông báo qua SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push notification</p>
                <p className="text-sm text-gray-600">Gửi thông báo đẩy đến app/browser</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bảo mật</h2>
              <p className="text-sm text-gray-600">Cài đặt bảo mật hệ thống</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Chế độ bảo trì</p>
                <p className="text-sm text-gray-600">Tạm khóa website cho người dùng thường</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Cho phép đăng ký</p>
                <p className="text-sm text-gray-600">Người dùng mới có thể tạo tài khoản</p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowRegistration: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Yêu cầu xác thực email</p>
                <p className="text-sm text-gray-600">Users phải xác thực email khi đăng ký</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireEmailVerification: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Payment Gateway Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cổng thanh toán</h2>
              <p className="text-sm text-gray-600">Cấu hình các phương thức thanh toán</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6 max-w-2xl">
            {/* Stripe */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Stripe</h4>
                <Switch
                  checked={settings.stripeEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, stripeEnabled: checked })
                  }
                />
              </div>
              {settings.stripeEnabled && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="stripePublic">Public Key</Label>
                    <Input
                      id="stripePublic"
                      value={settings.stripePublicKey}
                      onChange={(e) =>
                        setSettings({ ...settings, stripePublicKey: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeSecret">Secret Key</Label>
                    <Input
                      id="stripeSecret"
                      type="password"
                      placeholder="sk_test_..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* VNPay */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">VNPay</h4>
                <Switch
                  checked={settings.vnpayEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, vnpayEnabled: checked })
                  }
                />
              </div>
              {settings.vnpayEnabled && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="vnpayTmnCode">TMN Code</Label>
                    <Input id="vnpayTmnCode" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="vnpayHashSecret">Hash Secret</Label>
                    <Input id="vnpayHashSecret" type="password" className="mt-1" />
                  </div>
                </div>
              )}
            </div>

            {/* MoMo */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">MoMo</h4>
                <Switch
                  checked={settings.momoEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, momoEnabled: checked })
                  }
                />
              </div>
              {settings.momoEnabled && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="momoPartnerCode">Partner Code</Label>
                    <Input id="momoPartnerCode" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="momoAccessKey">Access Key</Label>
                    <Input id="momoAccessKey" type="password" className="mt-1" />
                  </div>
                </div>
              )}
            </div>

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Lưu cấu hình thanh toán
            </Button>
          </div>
        </Card>

        {/* Database Backup */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Sao lưu dữ liệu</h2>
              <p className="text-sm text-gray-600">Backup và restore database</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Backup gần nhất</p>
                <p className="text-sm text-gray-600">15/01/2025 10:30 AM</p>
              </div>
              <Button variant="outline">Download</Button>
            </div>

            <div className="flex gap-3">
              <Button className="gap-2">
                <Database className="w-4 h-4" />
                Backup ngay
              </Button>
              <Button variant="outline" className="gap-2">
                <Database className="w-4 h-4" />
                Restore
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
