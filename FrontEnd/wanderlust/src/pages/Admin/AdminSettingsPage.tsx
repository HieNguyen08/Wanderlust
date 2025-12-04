import {
    Bell,
    CreditCard, Database,
    Globe,
    Save,
    Shield
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import type { PageType } from "../../MainApp";

interface AdminSettingsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminSettingsPage({ onNavigate }: AdminSettingsPageProps) {
  const { t } = useTranslation();
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
    vnpayEnabled: true,
  });

  return (
    <AdminLayout currentPage="admin-settings" onNavigate={onNavigate} activePage="admin-settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('admin.systemSettings')}</h1>
          <p className="text-gray-600">{t('admin.systemSettingsDesc')}</p>
        </div>

        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.generalSettings')}</h2>
              <p className="text-sm text-gray-600">{t('admin.generalSettingsDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div>
              <Label htmlFor="siteName">{t('admin.websiteName')}</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="siteDescription">{t('admin.websiteDescription')}</Label>
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
                <Label htmlFor="contactEmail">{t('admin.contactEmail')}</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">{t('admin.contactPhone')}</Label>
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
                <Label htmlFor="currency">{t('admin.currency')}</Label>
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
                <Label htmlFor="language">{t('admin.language')}</Label>
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
                <Label htmlFor="timezone">{t('admin.timezone')}</Label>
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
              {t('admin.saveChanges')}
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
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.notifications')}</h2>
              <p className="text-sm text-gray-600">{t('admin.notificationsDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('admin.emailNotifications')}</p>
                <p className="text-sm text-gray-600">{t('admin.emailNotificationsDesc')}</p>
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
                <p className="font-medium text-gray-900">{t('admin.smsNotifications')}</p>
                <p className="text-sm text-gray-600">{t('admin.smsNotificationsDesc')}</p>
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
                <p className="font-medium text-gray-900">{t('admin.pushNotifications')}</p>
                <p className="text-sm text-gray-600">{t('admin.pushNotificationsDesc')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.security')}</h2>
              <p className="text-sm text-gray-600">{t('admin.securityDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('admin.maintenanceMode')}</p>
                <p className="text-sm text-gray-600">{t('admin.maintenanceModeDesc')}</p>
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
                <p className="font-medium text-gray-900">{t('admin.allowRegistration')}</p>
                <p className="text-sm text-gray-600">{t('admin.allowRegistrationDesc')}</p>
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
                <p className="font-medium text-gray-900">{t('admin.requireEmailVerification')}</p>
                <p className="text-sm text-gray-600">{t('admin.requireEmailVerificationDesc')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.paymentGateway')}</h2>
              <p className="text-sm text-gray-600">{t('admin.paymentGatewayDesc')}</p>
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

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              {t('admin.savePaymentConfig')}
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
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.dataBackup')}</h2>
              <p className="text-sm text-gray-600">{t('admin.dataBackupDesc')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t('admin.latestBackup')}</p>
                <p className="text-sm text-gray-600">15/01/2025 10:30 AM</p>
              </div>
              <Button variant="outline">{t('common.download')}</Button>
            </div>

            <div className="flex gap-3">
              <Button className="gap-2">
                <Database className="w-4 h-4" />
                {t('admin.backupNow')}
              </Button>
              <Button variant="outline" className="gap-2">
                <Database className="w-4 h-4" />
                {t('admin.restore')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
