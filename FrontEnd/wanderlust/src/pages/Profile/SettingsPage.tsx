import { Bell, Globe, Key, Lock, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner@2.0.3";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import type { PageType } from "../../MainApp";
import { profileApi } from "../../utils/api";

interface SettingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { t } = useTranslation();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Load notification settings from backend
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const settings = await profileApi.getNotificationSettings();
        setNotifications({
          emailPromotions: settings.promotionalEmails || false,
          emailBooking: settings.emailNotifications || false,
          emailReminders: settings.bookingReminders || false,
          pushPromotions: settings.promotionalEmails || false,
          pushBooking: settings.pushNotifications || false,
          smsBooking: settings.smsNotifications || false,
        });
      } catch (error: any) {
        console.error('Failed to load notification settings:', error);
      }
    };

    loadNotificationSettings();
  }, []);

  // Handle notification change
  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      setNotifications({ ...notifications, [key]: value });
      
      // Map frontend keys to backend keys
      const settingsMap: any = {
        emailPromotions: { promotionalEmails: value },
        emailBooking: { emailNotifications: value },
        emailReminders: { bookingReminders: value },
        pushPromotions: { promotionalEmails: value },
        pushBooking: { pushNotifications: value },
        smsBooking: { smsNotifications: value },
      };
      
      await profileApi.updateNotificationSettings(settingsMap[key]);
      toast.success('Cập nhật cài đặt thành công');
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật cài đặt');
      // Revert on error
      setNotifications({ ...notifications, [key]: !value });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('profile.passwordMismatch'));
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error(t('profile.passwordTooShort'));
      return;
    }
    
    try {
      setLoading(true);
      await profileApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      
      toast.success(t('profile.passwordChangeSuccess'));
      setIsChangePasswordOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileLayout currentPage="settings" onNavigate={onNavigate} activePage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('settings.title')}</h1>
          <p className="text-gray-600">{t('settings.subtitle')}</p>
        </div>

        {/* Change Password */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl text-gray-900">{t('settings.accountSecurity')}</h2>
                <p className="text-sm text-gray-600">{t('settings.securityDesc')}</p>
              </div>
            </div>
            <Button onClick={() => setIsChangePasswordOpen(true)} className="gap-2">
              <Key className="w-4 h-4" />
              {t('settings.changePassword')}
            </Button>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">{t('settings.password')}</p>
                <p className="text-sm text-gray-600">••••••••••••</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsChangePasswordOpen(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {t('settings.change')}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">{t('settings.twoFactor')}</p>
                <p className="text-sm text-gray-600">{t('settings.twoFactorStatus')}</p>
              </div>
              <Button variant="ghost" size="sm" disabled>
                {t('settings.activate')}
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
              <h2 className="text-xl text-gray-900">{t('settings.notifications')}</h2>
              <p className="text-sm text-gray-600">{t('settings.notificationsDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6">
            {/* Email Notifications */}
            <div>
              <h3 className="text-gray-900 mb-4">{t('settings.email')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">{t('settings.bookingInfo')}</p>
                    <p className="text-sm text-gray-600">{t('settings.bookingInfoDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.emailBooking}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('emailBooking', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">{t('settings.tripReminders')}</p>
                    <p className="text-sm text-gray-600">{t('settings.tripRemindersDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('emailReminders', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">{t('settings.promotions')}</p>
                    <p className="text-sm text-gray-600">{t('settings.promotionsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.emailPromotions}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('emailPromotions', checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Push Notifications */}
            <div>
              <h3 className="text-gray-900 mb-4">{t('settings.pushNotifications')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">{t('settings.bookingInfo')}</p>
                    <p className="text-sm text-gray-600">{t('settings.bookingInfoDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.pushBooking}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('pushBooking', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">{t('settings.promotions')}</p>
                    <p className="text-sm text-gray-600">{t('settings.promotionsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.pushPromotions}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('pushPromotions', checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SMS Notifications */}
            <div>
              <h3 className="text-gray-900 mb-4">{t('settings.sms')}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">{t('settings.bookingInfo')}</p>
                  <p className="text-sm text-gray-600">{t('settings.bookingInfoDesc')}</p>
                </div>
                <Switch
                  checked={notifications.smsBooking}
                  onCheckedChange={(checked) =>
                    handleNotificationChange('smsBooking', checked)
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
              <h2 className="text-xl text-gray-900">{t('settings.languageRegion')}</h2>
              <p className="text-sm text-gray-600">{t('settings.languageRegionDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="language">{t('settings.language')}</Label>
              <select
                id="language"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vi">{t('settings.vietnamese')}</option>
                <option value="en">{t('settings.english')}</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <div>
              <Label htmlFor="currency">{t('settings.currency')}</Label>
              <select
                id="currency"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vnd">{t('settings.vnd', 'VND - Việt Nam Đồng')}</option>
                <option value="usd">{t('settings.usd', 'USD - US Dollar')}</option>
                <option value="eur">{t('settings.eur', 'EUR - Euro')}</option>
                <option value="jpy">{t('settings.jpy', 'JPY - Japanese Yen')}</option>
              </select>
            </div>

            <Button className="w-full">{t('settings.saveChanges')}</Button>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl text-gray-900">{t('settings.privacySecurity')}</h2>
              <p className="text-sm text-gray-600">{t('settings.securityDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">{t('settings.twoFactor')}</p>
                <p className="text-sm text-gray-600">{t('settings.securityDesc')}</p>
              </div>
              <Button variant="outline">{t('settings.activate')}</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">{t('settings.loginDevices', 'Thiết bị đã đăng nhập')}</p>
                <p className="text-sm text-gray-600">{t('settings.loginDevicesDesc', 'Quản lý các thiết bị có quyền truy cập')}</p>
              </div>
              <Button variant="outline">{t('settings.viewDetails', 'Xem chi tiết')}</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">{t('settings.downloadData', 'Tải dữ liệu cá nhân')}</p>
                <p className="text-sm text-gray-600">{t('settings.downloadDataDesc', 'Tải về dữ liệu của bạn')}</p>
              </div>
              <Button variant="outline">{t('settings.download', 'Tải xuống')}</Button>
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
              <h2 className="text-xl text-red-900">{t('settings.dangerZone')}</h2>
              <p className="text-sm text-gray-600">{t('settings.dangerZoneDesc', 'Các hành động không thể hoàn tác')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">{t('settings.deleteAccount')}</p>
                <p className="text-sm text-gray-600">
                  {t('settings.deleteAccountDesc')}
                </p>
              </div>
              <Button variant="destructive">{t('settings.deleteAccount')}</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.changePassword')}</DialogTitle>
            <DialogDescription>
              {t('settings.passwordDialogDesc', 'Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">{t('profile.confirmNewPassword')}</Label>
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
              {t('profile.cancel')}
            </Button>
            <Button onClick={handleChangePassword}>
              {t('settings.changePassword')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
}
