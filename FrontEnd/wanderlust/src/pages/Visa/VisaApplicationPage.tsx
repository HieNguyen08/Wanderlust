import { format } from "date-fns";
import { AlertCircle, ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { visaApplicationApi, type VisaApplicationCreateDTO } from "../../api/visaApplicationApi";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import type { PageType } from "../../MainApp";

interface VisaApplicationPageProps {
  country?: any;
  onNavigate: (page: PageType, data?: any) => void;
}

export default function VisaApplicationPage({ country, onNavigate }: VisaApplicationPageProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: undefined as Date | undefined,
    placeOfBirth: "",
    nationality: "Việt Nam",
    gender: "male",
    maritalStatus: "single",
    
    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    
    // Passport Information
    passportNumber: "",
    passportIssueDate: undefined as Date | undefined,
    passportExpiryDate: undefined as Date | undefined,
    passportIssuePlace: "",
    
    // Travel Information
    purposeOfTravel: "tourism",
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    accommodationAddress: "",
    
    // Employment Information
    occupation: "",
    companyName: "",
    companyAddress: "",
    monthlyIncome: "",
    
    // Additional Information
    previousVisits: false,
    criminalRecord: false,
    healthIssues: false,
    additionalNotes: ""
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit application
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Prepare data for API
      const applicationData: VisaApplicationCreateDTO = {
        country: country?.name || "Unknown",
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : "",
        placeOfBirth: formData.placeOfBirth,
        nationality: formData.nationality,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        passportNumber: formData.passportNumber,
        passportIssueDate: formData.passportIssueDate ? format(formData.passportIssueDate, "yyyy-MM-dd") : "",
        passportExpiryDate: formData.passportExpiryDate ? format(formData.passportExpiryDate, "yyyy-MM-dd") : "",
        passportIssuePlace: formData.passportIssuePlace,
        purposeOfTravel: formData.purposeOfTravel,
        departureDate: formData.departureDate ? format(formData.departureDate, "yyyy-MM-dd") : "",
        returnDate: formData.returnDate ? format(formData.returnDate, "yyyy-MM-dd") : "",
        accommodationAddress: formData.accommodationAddress,
        occupation: formData.occupation,
        companyName: formData.companyName || undefined,
        companyAddress: formData.companyAddress || undefined,
        monthlyIncome: formData.monthlyIncome || undefined,
        previousVisits: formData.previousVisits,
        criminalRecord: formData.criminalRecord,
        healthIssues: formData.healthIssues,
        additionalNotes: formData.additionalNotes || undefined,
      };

      const result = await visaApplicationApi.createApplication(applicationData);
      
      // Success - navigate to success page or visa documents page
      onNavigate("visa-documents", { country, formData, applicationId: result.id });
    } catch (error) {
      console.error("Error submitting visa application:", error);
      setSubmitError(error instanceof Error ? error.message : "Đã xảy ra lỗi khi nộp hồ sơ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate("visa", country);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('visa.personalInfo')}</h2>
            
            <div>
              <Label htmlFor="fullName">{t('visa.fullName')} *</Label>
              <Input
                id="fullName"
                placeholder={t('visa.fullNamePlaceholder')}
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('visa.dateOfBirth')} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "dd/MM/yyyy") : t('visa.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => handleInputChange("dateOfBirth", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="placeOfBirth">{t('visa.placeOfBirth')} *</Label>
                <Input
                  id="placeOfBirth"
                  placeholder={t('visa.placeOfBirthPlaceholder')}
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('visa.gender')} *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">{t('visa.male')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">{t('visa.female')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">{t('visa.other')}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="maritalStatus">{t('visa.maritalStatus')} *</Label>
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(value) => handleInputChange("maritalStatus", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{t('visa.single')}</SelectItem>
                    <SelectItem value="married">{t('visa.married')}</SelectItem>
                    <SelectItem value="divorced">{t('visa.divorced')}</SelectItem>
                    <SelectItem value="widowed">{t('visa.widowed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nationality">Quốc tịch *</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('visa.contactInfo')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t('common.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">{t('common.phone')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+84 xxx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">{t('visa.currentAddress')} *</Label>
              <Textarea
                id="address"
                placeholder={t('visa.streetAddress')}
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="city">{t('visa.city')}/Tỉnh *</Label>
              <Input
                id="city"
                placeholder={t('visa.cityPlaceholder')}
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="mt-1"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{t('visa.passportInfo')}</h2>
            
            <div>
              <Label htmlFor="passportNumber">{t('visa.passportNumber')} *</Label>
              <Input
                id="passportNumber"
                placeholder="B1234567"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('visa.issueDate')} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.passportIssueDate ? format(formData.passportIssueDate, "dd/MM/yyyy") : t('visa.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.passportIssueDate}
                      onSelect={(date) => handleInputChange("passportIssueDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>{t('visa.expiryDate')} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.passportExpiryDate ? format(formData.passportExpiryDate, "dd/MM/yyyy") : t('visa.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.passportExpiryDate}
                      onSelect={(date) => handleInputChange("passportExpiryDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="passportIssuePlace">{t('visa.issuePlace')} *</Label>
              <Input
                id="passportIssuePlace"
                placeholder={t('visa.issuePlacePlaceholder')}
                value={formData.passportIssuePlace}
                onChange={(e) => handleInputChange("passportIssuePlace", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('visa.travelInfo')}</h2>
            
            <div>
              <Label htmlFor="purposeOfTravel">{t('visa.purposeOfTravel')} *</Label>
              <Select
                value={formData.purposeOfTravel}
                onValueChange={(value) => handleInputChange("purposeOfTravel", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourism">{t('visa.tourism')}</SelectItem>
                  <SelectItem value="business">{t('visa.business')}</SelectItem>
                  <SelectItem value="family">{t('visa.family')}</SelectItem>
                  <SelectItem value="study">{t('visa.study')}</SelectItem>
                  <SelectItem value="medical">{t('visa.medical')}</SelectItem>
                  <SelectItem value="other">{t('common.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('visa.departureDate')} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.departureDate ? format(formData.departureDate, "dd/MM/yyyy") : t('visa.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.departureDate}
                      onSelect={(date) => handleInputChange("departureDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>{t('visa.returnDate')} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.returnDate ? format(formData.returnDate, "dd/MM/yyyy") : t('visa.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.returnDate}
                      onSelect={(date) => handleInputChange("returnDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="accommodationAddress">{t('visa.accommodationAddress')} {country?.name || t('visa.abroad')} *</Label>
              <Textarea
                id="accommodationAddress"
                placeholder={t('visa.accommodationPlaceholder')}
                value={formData.accommodationAddress}
                onChange={(e) => handleInputChange("accommodationAddress", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{t('visa.employmentInfo')}</h2>
            
            <div>
              <Label htmlFor="occupation">{t('visa.occupation')} *</Label>
              <Input
                id="occupation"
                placeholder={t('visa.occupationPlaceholder')}
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">{t('visa.companyName')}</Label>
                <Input
                  id="companyName"
                  placeholder="ABC Company"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">{t('visa.monthlyIncome')} (VNĐ)</Label>
                <Input
                  id="monthlyIncome"
                  placeholder={t('visa.incomePlaceholder')}
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyAddress">{t('visa.companyAddress')}</Label>
              <Textarea
                id="companyAddress"
                placeholder={t('visa.companyAddressPlaceholder')}
                value={formData.companyAddress}
                onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('visa.additionalInfo')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="previousVisits"
                  checked={formData.previousVisits}
                  onCheckedChange={(checked) => handleInputChange("previousVisits", checked)}
                />
                <div>
                  <Label htmlFor="previousVisits" className="cursor-pointer">
                    {t('visa.previousVisitQuestion', { country: country?.name || t('visa.thisCountry') })}
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="criminalRecord"
                  checked={formData.criminalRecord}
                  onCheckedChange={(checked) => handleInputChange("criminalRecord", checked)}
                />
                <div>
                  <Label htmlFor="criminalRecord" className="cursor-pointer">
                    {t('visa.criminalRecordQuestion')}
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="healthIssues"
                  checked={formData.healthIssues}
                  onCheckedChange={(checked) => handleInputChange("healthIssues", checked)}
                />
                <div>
                  <Label htmlFor="healthIssues" className="cursor-pointer">
                    {t('visa.healthIssuesQuestion')}
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes">{t('visa.additionalNotes')}</Label>
              <Textarea
                id="additionalNotes"
                placeholder={t('visa.additionalNotesPlaceholder')}
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                className="mt-1"
                rows={5}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">{t('visa.importantNote')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('visa.checkInfoBeforeSubmit')}</li>
                    <li>{t('visa.incorrectInfoMayReject')}</li>
                    <li>{t('visa.passportValiditySixMonths')}</li>
                    <li>{t('visa.nextStepUploadDocs')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate("visa")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('visa.backToCountryList')}
        </button>

        {/* Country Info */}
        {country && (
          <Card className="p-6 mb-8 bg-linear-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t('visa.visaApplicationFor')} {country.name}
                </h1>
                <p className="text-blue-100">
                  {t('visa.processingTimeFee', { time: country.processingTime, fee: country.price })}
                </p>
              </div>
              <div className="text-6xl">{country.flag}</div>
            </div>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t('visa.stepPersonalInfo')}</span>
            <span>{t('visa.stepContactPassport')}</span>
            <span>{t('visa.stepTravel')}</span>
            <span>{t('visa.stepComplete')}</span>
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-6">
          {renderStepContent()}
        </Card>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" />
            <div className="text-sm text-red-800">{submitError}</div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-8"
          >
            {currentStep === 1 ? t('visa.cancel') : t('visa.back')}
          </Button>
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              currentStep === totalSteps ? t('visa.continueSubmit') : t('visa.next')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
