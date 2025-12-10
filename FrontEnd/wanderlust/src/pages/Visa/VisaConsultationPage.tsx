import { ArrowLeft, CheckCircle2, Clock, Mail, Phone, Send, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

interface VisaConsultationPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  requestData?: {
    countryId?: number;
    country?: string;
  };
}

const COUNTRIES = [
  "Nhật Bản",
  "Hàn Quốc",
  "Singapore",
  "Úc",
  "Mỹ",
  "Anh",
  "Canada",
  "Đức",
  "Pháp",
  "Ý",
  "Thái Lan",
  "Malaysia",
  "Khác"
];

const VISA_TYPES = [
  "Du lịch",
  "Công tác",
  "Thăm thân",
  "Học tập",
  "Định cư",
  "Khác"
];

export default function VisaConsultationPage({ onNavigate, requestData }: VisaConsultationPageProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: requestData?.country || "",
    visaType: "",
    numberOfPeople: "1",
    expectedDate: "",
    note: "",
    contactMethod: "phone"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create consultation request
    const requestId = `VCR-${Date.now()}`;
    onNavigate("visa-tracking", {
      requestId,
      status: "pending",
      ...formData
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">      {/* Breadcrumb */}
      <div className="bg-white border-b pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("visa")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('visa.backToVisa')}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl mb-2">{t('visa.consultationTitle')}</h1>
                <p className="text-gray-600">
                  {t('visa.consultationSubtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-base mb-2 block">
                    {t('visa.fullName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-base mb-2 block">
                      {t('visa.phoneNumber')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base mb-2 block">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Country & Visa Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country" className="text-base mb-2 block">
                      {t('visa.country')} <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.country} onValueChange={(val) => handleChange("country", val)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t('visa.selectCountry')} />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="visaType" className="text-base mb-2 block">
                      {t('visa.visaType')} <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.visaType} onValueChange={(val) => handleChange("visaType", val)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t('visa.selectVisaType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {VISA_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Number of People & Expected Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numberOfPeople" className="text-base mb-2 block">
                      {t('visa.numberOfPeople')}
                    </Label>
                    <Input
                      id="numberOfPeople"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.numberOfPeople}
                      onChange={(e) => handleChange("numberOfPeople", e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedDate" className="text-base mb-2 block">
                      {t('visa.departureDatePlan')}
                    </Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) => handleChange("expectedDate", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Contact Method */}
                <div>
                  <Label className="text-base mb-3 block">
                    {t('visa.preferredContactMethod')}
                  </Label>
                  <RadioGroup
                    value={formData.contactMethod}
                    onValueChange={(val) => handleChange("contactMethod", val)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone-contact" />
                      <Label htmlFor="phone-contact" className="cursor-pointer">{t('visa.contactPhone')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-contact" />
                      <Label htmlFor="email-contact" className="cursor-pointer">{t('visa.contactEmail')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both-contact" />
                      <Label htmlFor="both-contact" className="cursor-pointer">{t('visa.contactBoth')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Note */}
                <div>
                  <Label htmlFor="note" className="text-base mb-2 block">
                    {t('visa.additionalNotes')}
                  </Label>
                  <Textarea
                    id="note"
                    placeholder={t('visa.additionalNotesPlaceholder')}
                    value={formData.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg"
                    size="lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {t('visa.submitRequest')}
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-3">
                    {t('visa.termsAgreement')}
                  </p>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-xl mb-4">{t('visa.directContact')}</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('visa.hotline')}</p>
                    <p className="text-blue-600">1900-xxxx-xxx</p>
                    <p className="text-xs text-gray-500">{t('visa.workingHours')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('visa.emailSupport')}</p>
                    <p className="text-green-600">visa@wanderlust.vn</p>
                    <p className="text-xs text-gray-500">{t('visa.replyWithin24h')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Process */}
            <Card className="p-6 bg-linear-to-br from-blue-50 to-blue-100">
              <h3 className="text-xl mb-4">{t('visa.consultationProcess')}</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">{t('visa.processStep1Title')}</p>
                    <p className="text-sm text-gray-600">{t('visa.processStep1Desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">{t('visa.processStep2Title')}</p>
                    <p className="text-sm text-gray-600">{t('visa.processStep2Desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">{t('visa.processStep3Title')}</p>
                    <p className="text-sm text-gray-600">{t('visa.processStep3Desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">{t('visa.processStep4Title')}</p>
                    <p className="text-sm text-gray-600">{t('visa.processStep4Desc')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="text-2xl">95%</div>
                    <div className="text-sm text-gray-600">{t('visa.successRate')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-2xl">10,000+</div>
                    <div className="text-sm text-gray-600">{t('visa.customers')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-2xl">24h</div>
                    <div className="text-sm text-gray-600">{t('visa.fastResponse')}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
