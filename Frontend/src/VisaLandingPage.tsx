import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Globe, 
  Plane, 
  Shield,
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from "lucide-react";
import type { PageType } from "./MainApp";

interface VisaLandingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

const POPULAR_COUNTRIES = [
  {
    name: "Nhật Bản",
    flag: "🇯🇵",
    processingTime: "7-10 ngày",
    price: "1,200,000 VNĐ",
    type: "Du lịch / Công tác",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop"
  },
  {
    name: "Hàn Quốc",
    flag: "🇰🇷",
    processingTime: "5-7 ngày",
    price: "900,000 VNĐ",
    type: "Du lịch / Công tác",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=250&fit=crop"
  },
  {
    name: "Singapore",
    flag: "🇸🇬",
    processingTime: "3-5 ngày",
    price: "800,000 VNĐ",
    type: "Du lịch",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop"
  },
  {
    name: "Úc",
    flag: "🇦🇺",
    processingTime: "10-15 ngày",
    price: "2,500,000 VNĐ",
    type: "Du lịch / Thăm thân",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=250&fit=crop"
  },
  {
    name: "Mỹ",
    flag: "🇺🇸",
    processingTime: "15-30 ngày",
    price: "3,500,000 VNĐ",
    type: "Du lịch / Công tác",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=250&fit=crop"
  },
  {
    name: "Anh",
    flag: "🇬🇧",
    processingTime: "15-20 ngày",
    price: "3,200,000 VNĐ",
    type: "Du lịch / Công tác",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop"
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    processingTime: "10-20 ngày",
    price: "2,800,000 VNĐ",
    type: "Du lịch / Thăm thân",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=250&fit=crop"
  },
  {
    name: "Đức",
    flag: "🇩🇪",
    processingTime: "10-15 ngày",
    price: "2,200,000 VNĐ",
    type: "Du lịch / Schengen",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=250&fit=crop"
  }
];

const WHY_CHOOSE_US = [
  {
    icon: Clock,
    title: "Xử lý nhanh chóng",
    description: "Cam kết xử lý hồ sơ trong thời gian ngắn nhất"
  },
  {
    icon: CheckCircle2,
    title: "Tỷ lệ phê duyệt cao",
    description: "98% hồ sơ được phê duyệt thành công"
  },
  {
    icon: Shield,
    title: "An toàn bảo mật",
    description: "Thông tin cá nhân được bảo mật tuyệt đối"
  },
  {
    icon: Users,
    title: "Tư vấn chuyên nghiệp",
    description: "Đội ngũ chuyên viên giàu kinh nghiệm hỗ trợ 24/7"
  }
];

const VISA_TYPES = [
  { name: "Visa du lịch", icon: Plane, description: "Dành cho mục đích du lịch, nghỉ dưỡng" },
  { name: "Visa công tác", icon: FileText, description: "Dành cho công tác, hội nghị, hội thảo" },
  { name: "Visa thăm thân", icon: Users, description: "Thăm gia đình, người thân tại nước ngoài" },
  { name: "Visa học tập", icon: Globe, description: "Du học, trao đổi sinh viên" }
];

export default function VisaLandingPage({ onNavigate }: VisaLandingPageProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleApplyVisa = (country: any) => {
    onNavigate("visa-application", { country });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="visa" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="relative h-[500px]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=500&fit=crop"
          alt="Visa Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/70" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Dịch Vụ Làm Visa<br />Nhanh Chóng & Uy Tín
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Hỗ trợ làm visa hơn 50 quốc gia với tỷ lệ thành công 98%
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-lg px-8 py-6"
                  onClick={() => document.getElementById('countries')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Đăng ký ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8 py-6"
                >
                  Tư vấn miễn phí
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Quốc gia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Tỷ lệ thành công</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">7-15</div>
              <div className="text-gray-600">Ngày xử lý</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visa Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Các Loại Visa
            </h2>
            <p className="text-xl text-gray-600">
              Chúng tôi hỗ trợ đầy đủ các loại visa theo nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VISA_TYPES.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500"
                  onClick={() => setSelectedType(type.name)}
                >
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600">
                    {type.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section id="countries" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quốc Gia Phổ Biến
            </h2>
            <p className="text-xl text-gray-600">
              Lựa chọn quốc gia bạn muốn xin visa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_COUNTRIES.map((country, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 text-4xl">
                    {country.flag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {country.name}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{country.processingTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm">{country.type}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {country.price}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleApplyVisa(country)}
                  >
                    Đăng ký ngay
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-blue-100">
              Wanderlust - Đối tác tin cậy cho hành trình của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-blue-100">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy Trình Làm Visa
            </h2>
            <p className="text-xl text-gray-600">
              4 bước đơn giản để có visa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Chọn quốc gia", desc: "Chọn quốc gia và loại visa phù hợp" },
              { step: 2, title: "Điền thông tin", desc: "Hoàn thành form đăng ký trực tuyến" },
              { step: 3, title: "Nộp hồ sơ", desc: "Upload hồ sơ và thanh toán phí dịch vụ" },
              { step: 4, title: "Nhận visa", desc: "Nhận visa sau khi được phê duyệt" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Sẵn Sàng Cho Chuyến Đi?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Đăng ký ngay hôm nay và nhận tư vấn miễn phí từ chuyên gia của chúng tôi
          </p>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-12 py-6"
            onClick={() => document.getElementById('countries')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Bắt đầu ngay
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
