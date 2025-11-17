import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    TrendingUp
} from "lucide-react";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

interface VisaArticleDetailPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  article: {
    id: number;
    title: string;
    country: string;
    flag: string;
    continent: string;
    excerpt: string;
    image: string;
    readTime: string;
    category: string;
    processingTime: string;
  };
}

export default function VisaArticleDetailPage({ onNavigate, article }: VisaArticleDetailPageProps) {
  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => onNavigate("visa")}
            className="gap-2 text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
                  {article.category}
                </Badge>
                <Badge className="bg-white/10 backdrop-blur-sm text-white border-0 px-4 py-2">
                  {article.continent}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{article.flag}</span>
                <h1 className="text-5xl">{article.title}</h1>
              </div>

              <p className="text-xl text-blue-100 mb-6">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Đọc {article.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Xử lý: {article.processingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Tỷ lệ thành công: 90-95%</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={article.image}
                  alt={article.country}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Now on left */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info */}
            <Card className="p-6 bg-linear-to-br from-orange-50 to-orange-100 border-orange-200 sticky top-4">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Thông tin quan trọng
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Quốc gia</p>
                      <p className="font-medium">{article.country}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Thời gian xử lý</p>
                      <p className="font-medium">{article.processingTime}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tỷ lệ thành công</p>
                      <p className="font-medium text-green-600">90-95%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Loại phổ biến</p>
                      <p className="font-medium">Du lịch, Công tác</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
                onClick={() => onNavigate("visa-consultation", { 
                  countryId: article.id, 
                  country: article.country 
                })}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Đăng ký tư vấn ngay
              </Button>

              <div className="mt-4 pt-4 border-t border-orange-200 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span>Hotline: 1900-xxxx-xxx</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>visa@wanderlust.vn</span>
                </div>
              </div>
            </Card>

            {/* Checklist */}
            <Card className="p-6">
              <h3 className="text-xl mb-4">✓ Checklist hồ sơ</h3>
              
              <div className="space-y-3">
                {[
                  "Hộ chiếu còn hạn",
                  "Ảnh thẻ 4x6 cm",
                  "Đơn xin visa",
                  "Sao kê tài chính",
                  "Vé máy bay",
                  "Bảo hiểm du lịch",
                  "Giấy xác nhận công việc",
                  "Booking khách sạn"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                <h2>📋 Tổng quan về visa {article.country}</h2>
                <p className="text-lg text-gray-700">
                  Visa {article.country} là loại giấy phép nhập cảnh được cấp cho công dân nước ngoài muốn 
                  đến {article.country} với các mục đích khác nhau như du lịch, công tác, thăm thân, học tập. 
                  Đây là tài liệu bắt buộc để bạn có thể hợp pháp nhập cảnh và lưu trú tại {article.country}.
                </p>

                <h2>🎯 Các loại visa {article.country}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Visa du lịch</h4>
                    <p className="text-sm text-blue-700">Dành cho người muốn tham quan, nghỉ dưỡng</p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                    <h4 className="font-medium text-green-900 mb-1">Visa công tác</h4>
                    <p className="text-sm text-green-700">Cho các chuyến công tác ngắn hạn</p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
                    <h4 className="font-medium text-orange-900 mb-1">Visa thăm thân</h4>
                    <p className="text-sm text-orange-700">Dành cho người có thân nhân tại {article.country}</p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Visa học tập</h4>
                    <p className="text-sm text-purple-700">Dành cho du học sinh</p>
                  </div>
                </div>

                <h2>📄 Hồ sơ cần chuẩn bị</h2>
                <div className="bg-gray-50 rounded-xl p-6 not-prose">
                  <div className="space-y-4">
                    {[
                      { title: "Hộ chiếu", desc: "Còn hiệu lực tối thiểu 6 tháng, có ít nhất 2 trang trống" },
                      { title: "Ảnh thẻ", desc: "4x6 cm, chụp trong vòng 6 tháng, nền trắng" },
                      { title: "Đơn xin visa", desc: "Điền đầy đủ, chính xác thông tin bằng tiếng Anh" },
                      { title: "Chứng minh tài chính", desc: "Sao kê ngân hàng 6 tháng gần nhất" },
                      { title: "Vé máy bay", desc: "Vé khứ hồi hoặc đặt chỗ tạm thời" },
                      { title: "Booking khách sạn", desc: "Xác nhận đặt phòng trong thời gian lưu trú" },
                      { title: "Bảo hiểm du lịch", desc: "Bảo hiểm y tế quốc tế" },
                      { title: "Giấy xác nhận công việc", desc: "Từ công ty hoặc giấy phép kinh doanh" }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h2>🔄 Quy trình xin visa 7 bước</h2>
                <div className="space-y-4 not-prose">
                  {[
                    { step: "01", title: "Chuẩn bị hồ sơ", desc: "Thu thập và chuẩn bị đầy đủ các giấy tờ theo yêu cầu" },
                    { step: "02", title: "Điền đơn", desc: "Hoàn thiện đơn xin visa chính xác và đầy đủ bằng tiếng Anh" },
                    { step: "03", title: "Đặt lịch hẹn", desc: "Đặt lịch phỏng vấn tại đại sứ quán/lãnh sự quán qua website" },
                    { step: "04", title: "Nộp hồ sơ", desc: "Mang hồ sơ gốc đến nộp tại địa điểm đã hẹn, đầy đủ và đúng giờ" },
                    { step: "05", title: "Phỏng vấn", desc: "Tham gia phỏng vấn nếu có yêu cầu, trả lời trung thực" },
                    { step: "06", title: "Chờ kết quả", desc: `Thời gian xử lý: ${article.processingTime}` },
                    { step: "07", title: "Nhận visa", desc: "Nhận hộ chiếu đã có visa hoặc thông báo kết quả" }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-linear-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 transition-colors">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h2>⚠️ Lưu ý quan trọng</h2>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg not-prose">
                  <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <p className="font-medium text-amber-900">Những điều cần lưu ý khi xin visa:</p>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Chuẩn bị hồ sơ đầy đủ, chính xác để tránh bị từ chối</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Nộp hồ sơ sớm trước ngày dự kiến xuất phát ít nhất 1-2 tháng</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Trung thực trong quá trình khai báo thông tin và phỏng vấn</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Chuẩn bị tốt câu trả lời cho buổi phỏng vấn (nếu có)</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Không nên đặt vé máy bay chính thức trước khi có visa</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Kiểm tra kỹ thông tin trên visa sau khi nhận</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2>💰 Chi phí ước tính</h2>
                <p className="text-gray-700">
                  Chi phí làm visa {article.country} bao gồm lệ phí lãnh sự và phí dịch vụ (nếu làm qua đơn vị tư vấn).
                  Mức phí có thể thay đổi tùy theo loại visa và thời điểm nộp hồ sơ. Ngoài ra còn có các chi phí phát sinh 
                  như phí dịch thuật công chứng, phí chụp ảnh, phí vận chuyển hồ sơ...
                </p>

                <h2>📊 Tỷ lệ thành công</h2>
                <div className="bg-green-50 rounded-xl p-6 not-prose">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900 mb-2">Tỷ lệ đậu visa cao</h4>
                      <p className="text-sm text-green-800 mb-3">
                        Tỷ lệ đậu visa {article.country} phụ thuộc vào nhiều yếu tố như hồ sơ tài chính, 
                        mục đích chuyến đi, lịch sử xuất nh���p cảnh, tình trạng hôn nhân và công việc...
                      </p>
                      <p className="text-sm text-green-800">
                        Với hồ sơ chuẩn bị kỹ càng và hướng dẫn đúng cách từ chuyên gia, 
                        tỷ lệ thành công có thể lên đến <strong>90-95%</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <h2>✨ Kết luận</h2>
                <p className="text-lg text-gray-700">
                  Việc xin visa {article.country} không quá khó khăn nếu bạn chuẩn bị hồ sơ đầy đủ, chính xác 
                  và hiểu rõ quy trình. Tuy nhiên, để tăng tỷ lệ thành công và tiết kiệm thời gian, 
                  bạn nên cân nhắc sử dụng dịch vụ tư vấn chuyên nghiệp.
                </p>

                <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl p-8 not-prose">
                  <div className="text-center">
                    <h3 className="text-2xl mb-3">Cần hỗ trợ làm visa {article.country}?</h3>
                    <p className="text-orange-100 mb-6">
                      Đội ngũ chuyên viên của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn hoàn toàn miễn phí
                    </p>
                    <Button 
                      size="lg"
                      className="bg-white text-orange-600 hover:bg-gray-100"
                      onClick={() => onNavigate("visa-consultation", { 
                        countryId: article.id, 
                        country: article.country 
                      })}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Đăng ký tư vấn ngay
                    </Button>
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
