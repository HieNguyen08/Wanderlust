import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Download,
    FileText,
    Home,
    Mail,
    Phone
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import type { PageType } from "../../MainApp";

interface VisaConfirmationPageProps {
  country?: any;
  formData?: any;
  documents?: any;
  paymentMethod?: string;
  total?: number;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function VisaConfirmationPage({ 
  country, 
  formData, 
  documents,
  paymentMethod,
  total,
  onNavigate 
}: VisaConfirmationPageProps) {
  const { t } = useTranslation();
  const applicationNumber = `VISA-${Date.now().toString().slice(-8)}`;
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + 
    parseInt(country?.processingTime?.match(/\d+/)?.[0] || "7"));

  const handleDownloadReceipt = () => {
    // Simulate download
    alert(t('visa.downloadingReceipt'));
  };

  const handleDownloadInvoice = () => {
    // Simulate download
    alert(t('visa.downloadingInvoice'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 pt-[calc(60px+3rem)]">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('visa.applicationSuccess')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('visa.applicationSuccessMessage')}
          </p>
        </div>

        {/* Application Details */}
        <Card className="p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {t('visa.orderCode')}
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {applicationNumber}
              </p>
            </div>
            {country && (
              <div className="text-6xl">{country.flag}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('visa.orderInformation')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('visa.destinationCountry')}:</span>
                  <span className="font-semibold">{country?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('visa.visaType')}:</span>
                  <span className="font-semibold">{country?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('visa.fullName')}:</span>
                  <span className="font-semibold">{formData?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('visa.passportNumber')}:</span>
                  <span className="font-semibold">{formData?.passportNumber}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('visa.payment')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('common.paymentMethod')}:</span>
                  <span className="font-semibold">
                    {paymentMethod === "credit-card" ? t('visa.creditDebitCard') : 
                     paymentMethod === "bank-transfer" ? t('visa.bankTransfer') : 
                     t('visa.eWallet')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('common.totalAmount')}:</span>
                  <span className="font-semibold text-blue-600">
                    {(total || 0).toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('common.status')}:</span>
                  <span className="font-semibold text-green-600">{t('common.paid')}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">{t('visa.processingTime')}</h4>
                <p className="text-sm text-blue-800">
                  {t('visa.estimatedCompletion')}: <span className="font-semibold">
                    {estimatedCompletionDate.toLocaleDateString('vi-VN')}
                  </span>
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  {t('visa.processingTimeLabel')}: {country?.processingTime}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('visa.nextSteps')}</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t('visa.confirmationEmail')}</h4>
                <p className="text-sm text-gray-600">
                  {t('visa.confirmationEmailDesc', { email: formData?.email })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t('visa.trackProgress')}</h4>
                <p className="text-sm text-gray-600">
                  {t('visa.trackProgressDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t('visa.receiveVisa')}</h4>
                <p className="text-sm text-gray-600">
                  Khi visa được phê duyệt, chúng tôi sẽ liên hệ bạn để gửi hộ chiếu có visa đã dán.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={handleDownloadReceipt}
          >
            <Download className="w-5 h-5 mr-2" />
            Tải biên nhận
          </Button>
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={handleDownloadInvoice}
          >
            <FileText className="w-5 h-5 mr-2" />
            Tải hóa đơn
          </Button>
        </div>

        {/* Contact Support */}
        <Card className="p-6 mb-6 bg-linear-to-r from-blue-600 to-blue-700 text-white">
          <h3 className="text-xl font-bold mb-4">Cần Hỗ Trợ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3" />
              <div>
                <div className="font-semibold">Hotline</div>
                <div>1900 xxxx (24/7)</div>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3" />
              <div>
                <div className="font-semibold">Email</div>
                <div>visa@wanderlust.vn</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 py-6"
            onClick={() => onNavigate("home")}
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-6"
            onClick={() => onNavigate("visa")}
          >
            Đăng ký visa khác
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
