import { useState } from "react";
import { VendorLayout } from "./components/VendorLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Switch } from "./components/ui/switch";
import { Separator } from "./components/ui/separator";
import {
  Building2, Mail, Bell, CreditCard, Save
} from "lucide-react";
import type { PageType } from "./MainApp";

interface VendorSettingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

export default function VendorSettingsPage({ 
  onNavigate,
  vendorType = "hotel"
}: VendorSettingsPageProps) {
  const [settings, setSettings] = useState({
    hotelName: "JW Marriott Phu Quoc",
    address: "Bãi Dài, Gành Dầu, Phú Quốc",
    city: "Phú Quốc",
    country: "Việt Nam",
    phone: "+84 297 377 9999",
    email: "info@marriott.com",
    website: "https://www.marriott.com/phuquoc",
    description: "Khu nghỉ dưỡng 5 sao sang trọng bên bờ biển...",
    
    emailBookings: true,
    emailReviews: true,
    smsBookings: false,
    
    bankName: "Vietcombank",
    accountNumber: "1234567890",
    accountHolder: "Công ty TNHH Marriott Việt Nam",
  });

  return (
    <VendorLayout 
      currentPage="vendor-settings" 
      onNavigate={onNavigate} 
      activePage="vendor-settings"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Cài đặt</h1>
          <p className="text-gray-600">Quản lý thông tin và cấu hình</p>
        </div>

        {/* Business Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Thông tin doanh nghiệp</h2>
              <p className="text-sm text-gray-600">Cập nhật thông tin cơ bản</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div>
              <Label htmlFor="hotelName">Tên khách sạn</Label>
              <Input
                id="hotelName"
                value={settings.hotelName}
                onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Thành phố</Label>
                <Input
                  id="city"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">Quốc gia</Label>
                <Input
                  id="country"
                  value={settings.country}
                  onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="mt-1"
                rows={4}
              />
            </div>

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
              <p className="text-sm text-gray-600">Cấu hình nhận thông báo</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email khi có booking mới</p>
                <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
              </div>
              <Switch
                checked={settings.emailBookings}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailBookings: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email khi có review mới</p>
                <p className="text-sm text-gray-600">Nhận thông báo về đánh giá mới</p>
              </div>
              <Switch
                checked={settings.emailReviews}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailReviews: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS thông báo</p>
                <p className="text-sm text-gray-600">Nhận SMS khi có booking</p>
              </div>
              <Switch
                checked={settings.smsBookings}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsBookings: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Payment Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Thông tin thanh toán</h2>
              <p className="text-sm text-gray-600">Tài khoản nhận tiền</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div>
              <Label htmlFor="bankName">Ngân hàng</Label>
              <Input
                id="bankName"
                value={settings.bankName}
                onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Số tài khoản</Label>
              <Input
                id="accountNumber"
                value={settings.accountNumber}
                onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="accountHolder">Chủ tài khoản</Label>
              <Input
                id="accountHolder"
                value={settings.accountHolder}
                onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Lưu thông tin thanh toán
            </Button>
          </div>
        </Card>
      </div>
    </VendorLayout>
  );
}
