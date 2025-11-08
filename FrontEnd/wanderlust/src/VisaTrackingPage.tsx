import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  User,
  MapPin,
  FileText,
  ArrowLeft,
  MessageSquare
} from "lucide-react";
import type { PageType } from "./MainApp";

interface VisaTrackingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  trackingData?: {
    requestId?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    country?: string;
    visaType?: string;
    numberOfPeople?: string;
    expectedDate?: string;
    note?: string;
    contactMethod?: string;
  };
}

export default function VisaTrackingPage({ onNavigate, trackingData }: VisaTrackingPageProps) {
  if (!trackingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="visa" onNavigate={onNavigate} />

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl mb-4">Gửi yêu cầu thành công!</h1>
          <p className="text-xl text-green-100 mb-6">
            Cảm ơn bạn đã tin tưởng dịch vụ tư vấn visa của chúng tôi
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-sm text-green-100 mb-1">Mã yêu cầu của bạn</p>
            <p className="text-2xl font-mono">{trackingData.requestId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* What's Next */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl mb-6 text-center">Bước tiếp theo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2">1. Chúng tôi sẽ liên hệ</h3>
              <p className="text-gray-600">
                Chuyên viên tư vấn sẽ liên hệ với bạn trong vòng <strong>24 giờ</strong>
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">2. Tư vấn chi tiết</h3>
              <p className="text-gray-600">
                Hướng dẫn chi tiết về hồ sơ và quy trình làm visa
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">3. Hỗ trợ làm hồ sơ</h3>
              <p className="text-gray-600">
                Đồng hành cùng bạn đến khi có kết quả visa
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 mb-2">Email xác nhận đã được gửi</p>
                <p className="text-sm text-blue-800">
                  Chúng tôi đã gửi email xác nhận đến <strong>{trackingData.email}</strong> với 
                  thông tin chi tiết về yêu cầu tư vấn của bạn. Vui lòng kiểm tra hộp thư đến 
                  hoặc thư mục spam.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Request Summary */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl mb-6">Thông tin yêu cầu</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Họ và tên</p>
                <p className="font-medium">{trackingData.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{trackingData.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{trackingData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Quốc gia</p>
                <p className="font-medium">{trackingData.country}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Loại visa</p>
                <p className="font-medium">{trackingData.visaType}</p>
              </div>
            </div>

            {trackingData.numberOfPeople && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Số người</p>
                  <p className="font-medium">{trackingData.numberOfPeople} người</p>
                </div>
              </div>
            )}

            {trackingData.expectedDate && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Ngày dự kiến xuất phát</p>
                  <p className="font-medium">
                    {new Date(trackingData.expectedDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {trackingData.note && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                  <p className="text-gray-700">{trackingData.note}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Contact Info */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100">
          <h2 className="text-2xl mb-6">Thông tin liên hệ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium mb-1">Hotline</p>
                  <p className="text-blue-600 text-lg">1900-xxxx-xxx</p>
                  <p className="text-sm text-gray-500">Thời gian: 8:00 - 20:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium mb-1">Email</p>
                  <p className="text-green-600 text-lg">visa@wanderlust.vn</p>
                  <p className="text-sm text-gray-500">Phản hồi trong 24h</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi
          </p>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-8">
          <Button 
            size="lg"
            onClick={() => onNavigate("visa")}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang Visa
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => onNavigate("home")}
            className="gap-2"
          >
            Về trang chủ
          </Button>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
