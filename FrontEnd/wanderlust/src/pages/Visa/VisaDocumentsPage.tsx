import { AlertCircle, ArrowLeft, CheckCircle2, FileText, Upload, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";

interface VisaDocumentsPageProps {
  country?: any;
  formData?: any;
  onNavigate: (page: PageType, data?: any) => void;
}

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  file: File | null;
}

export default function VisaDocumentsPage({ country, formData, onNavigate }: VisaDocumentsPageProps) {
  const { t } = useTranslation();
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, DocumentFile>>({});

  const REQUIRED_DOCUMENTS = [
    {
      id: "passport",
      name: t('visa.passportScan'),
      description: t('visa.passportScanDesc'),
      required: true
    },
    {
      id: "photo",
      name: t('visa.photo4x6'),
      description: t('visa.photoDesc'),
      required: true
    },
    {
      id: "id-card",
      name: t('visa.idCard'),
      description: t('visa.idCardDesc'),
      required: true
    },
    {
      id: "bank-statement",
      name: t('visa.bankStatement'),
      description: t('visa.bankStatementDesc'),
      required: true
    },
    {
      id: "employment-letter",
      name: t('visa.employmentLetter'),
      description: t('visa.employmentLetterDesc'),
      required: false
    },
    {
      id: "hotel-booking",
      name: t('visa.hotelBooking'),
      description: t('visa.hotelBookingDesc'),
      required: false
    },
    {
      id: "flight-ticket",
      name: t('visa.flightTicket'),
      description: t('visa.flightTicketDesc'),
      required: false
    },
    {
      id: "insurance",
      name: t('visa.insurance'),
      description: t('visa.insuranceDesc'),
      required: false
    }
  ];

  const handleFileUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('visa.fileSizeExceeded'));
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('visa.onlyJpgPngPdfAllowed'));
        return;
      }

      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          id: docId,
          name: file.name,
          size: file.size,
          file: file
        }
      }));
    }
  };

  const handleRemoveFile = (docId: string) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docId];
      return newDocs;
    });
  };

  const handleSubmit = () => {
    // Check required documents
    const requiredDocs = REQUIRED_DOCUMENTS.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !uploadedDocs[doc.id]);

    if (missingDocs.length > 0) {
      alert(`${t('visa.uploadRequiredDocs')}:\n${missingDocs.map(d => `- ${d.name}`).join('\n')}`);
      return;
    }

    // Proceed to payment
    onNavigate("visa-payment", { country, formData, documents: uploadedDocs });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const requiredDocsUploaded = REQUIRED_DOCUMENTS
    .filter(doc => doc.required)
    .every(doc => uploadedDocs[doc.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 pt-[calc(60px+2rem)]">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate("visa-application", { country })}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('visa.backToForm')}
        </button>

        {/* Country Info */}
        {country && (
          <Card className="p-6 mb-8 bg-linear-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t('visa.uploadDocuments')} {country.name}
                </h1>
                <p className="text-blue-100">
                  {t('visa.step2Of3')}
                </p>
              </div>
              <div className="text-6xl">{country.flag}</div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">{t('visa.uploadInstructions')}</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>{t('visa.onlyJpgPngPdf')}</li>
                <li>{t('visa.maxFileSize5mb')}</li>
                <li>{t('visa.clearScans')}</li>
                <li>{t('visa.requiredFieldsMarked')}</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('visa.uploadProgress')}: {Object.keys(uploadedDocs).length}/{REQUIRED_DOCUMENTS.length}
            </span>
            <span className="text-sm text-gray-600">
              {requiredDocsUploaded ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {t('visa.allRequiredDocsUploaded')}
                </span>
              ) : (
                <span className="text-orange-600">
                  {t('visa.missingRequiredDocs', { count: REQUIRED_DOCUMENTS.filter(d => d.required && !uploadedDocs[d.id]).length })}
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(Object.keys(uploadedDocs).length / REQUIRED_DOCUMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4 mb-8">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const uploaded = uploadedDocs[doc.id];
            
            return (
              <Card key={doc.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {doc.name}
                      {doc.required && <span className="text-red-600 ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                  {uploaded && (
                    <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 ml-4" />
                  )}
                </div>

                {uploaded ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center flex-1">
                      <FileText className="w-8 h-8 text-green-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900">{uploaded.name}</p>
                        <p className="text-sm text-green-700">{formatFileSize(uploaded.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id={`file-${doc.id}`}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload(doc.id, e)}
                    />
                    <label
                      htmlFor={`file-${doc.id}`}
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700 mb-1">
                        {t('visa.clickToUpload')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t('visa.onlyJpgPngPdf')}
                      </span>
                    </label>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 sticky bottom-0 bg-white p-4 border-t shadow-lg">
          <Button
            variant="outline"
            onClick={() => onNavigate("visa-application", { country })}
            className="px-8"
          >
            {t('visa.back')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!requiredDocsUploaded}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {t('visa.continueToPayment')}
          </Button>
        </div>
      </div>
    </div>
  );
}
