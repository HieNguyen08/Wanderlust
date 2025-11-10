import { Footer } from "../../components/Footer";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  Globe, 
  Shield,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Flame
} from "lucide-react";
import type { PageType } from "../../MainApp";

interface VisaLandingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

const VISA_HOT = [
  {
    id: 1,
    title: "Hướng dẫn làm Visa Nhật Bản 2025",
    country: "Nhật Bản",
    flag: "🇯🇵",
    continent: "Châu Á",
    excerpt: "Tìm hiểu chi tiết về quy trình, hồ sơ cần thiết và thời gian xử lý visa du lịch Nhật Bản.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    readTime: "5 phút",
    category: "Hướng dẫn",
    processingTime: "7-10 ngày",
    popular: true
  },
  {
    id: 2,
    title: "Visa Hàn Quốc: Thủ tục và yêu cầu",
    country: "Hàn Quốc",
    flag: "🇰🇷",
    continent: "Châu Á",
    excerpt: "Những điều bạn cần biết về visa du lịch Hàn Quốc, từ giấy tờ đến phí dịch vụ.",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=400&fit=crop",
    readTime: "4 phút",
    category: "Hướng dẫn",
    processingTime: "5-7 ngày",
    popular: true
  },
  {
    id: 3,
    title: "Làm Visa Mỹ: Bí quyết thành công",
    country: "Mỹ",
    flag: "🇺🇸",
    continent: "Châu Mỹ",
    excerpt: "Kinh nghiệm và hướng dẫn chi tiết để tăng tỷ lệ đậu visa Mỹ.",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop",
    readTime: "8 phút",
    category: "Kinh nghiệm",
    processingTime: "15-30 ngày",
    popular: true
  }
];

const VISA_CHAU_A = [
  {
    id: 4,
    title: "Hướng dẫn làm Visa Nhật Bản 2025",
    country: "Nhật Bản",
    flag: "🇯🇵",
    continent: "Châu Á",
    excerpt: "Tìm hiểu chi tiết về quy trình, hồ sơ cần thiết và thời gian xử lý visa du lịch Nhật Bản.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    readTime: "5 phút",
    category: "Hướng dẫn",
    processingTime: "7-10 ngày"
  },
  {
    id: 5,
    title: "Visa Hàn Quốc: Thủ tục và yêu cầu",
    country: "Hàn Quốc",
    flag: "🇰🇷",
    continent: "Châu Á",
    excerpt: "Những điều bạn cần biết về visa du lịch Hàn Quốc, từ giấy tờ đến phí dịch vụ.",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=400&fit=crop",
    readTime: "4 phút",
    category: "Hướng dẫn",
    processingTime: "5-7 ngày"
  },
  {
    id: 6,
    title: "Visa Singapore - Điều kiện xin visa",
    country: "Singapore",
    flag: "🇸🇬",
    continent: "Châu Á",
    excerpt: "Hướng dẫn chi tiết về visa Singapore cho người Việt Nam, thủ tục đơn giản và nhanh chóng.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop",
    readTime: "3 phút",
    category: "Hướng dẫn",
    processingTime: "3-5 ngày"
  },
  {
    id: 7,
    title: "Visa Thái Lan: Hồ sơ và quy trình",
    country: "Thái Lan",
    flag: "🇹🇭",
    continent: "Châu Á",
    excerpt: "Hướng dẫn làm visa Thái Lan nhanh chóng, đơn giản cho người Việt Nam.",
    image: "https://images.unsplash.com/photo-1688032406789-138fbe9a98b9?w=600&h=400&fit=crop",
    readTime: "3 phút",
    category: "Hướng dẫn",
    processingTime: "3-5 ngày"
  }
];

const VISA_CHAU_AU = [
  {
    id: 8,
    title: "Visa Schengen: Du lịch châu Âu",
    country: "Schengen",
    flag: "🇪🇺",
    continent: "Châu Âu",
    excerpt: "Hướng dẫn xin visa Schengen để du lịch 26 quốc gia châu Âu.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    readTime: "7 phút",
    category: "Hướng dẫn",
    processingTime: "10-15 ngày"
  },
  {
    id: 9,
    title: "Visa Anh Quốc: Thủ tục và hồ sơ",
    country: "Anh",
    flag: "🇬🇧",
    continent: "Châu Âu",
    excerpt: "Hướng dẫn chi tiết làm visa Anh cho người Việt Nam, visa du lịch và công tác.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
    readTime: "6 phút",
    category: "Hướng dẫn",
    processingTime: "15-20 ngày"
  },
  {
    id: 10,
    title: "Visa Pháp: Kinh nghiệm xin visa",
    country: "Pháp",
    flag: "🇫🇷",
    continent: "Châu Âu",
    excerpt: "Chia sẻ kinh nghiệm làm visa Pháp thành công, hồ sơ cần chuẩn bị.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    readTime: "6 phút",
    category: "Kinh nghiệm",
    processingTime: "10-15 ngày"
  }
];

const VISA_CHAU_MY = [
  {
    id: 11,
    title: "Làm Visa Mỹ: Bí quyết thành công",
    country: "Mỹ",
    flag: "🇺🇸",
    continent: "Châu Mỹ",
    excerpt: "Kinh nghiệm và hướng dẫn chi tiết để tăng tỷ lệ đậu visa Mỹ.",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop",
    readTime: "8 phút",
    category: "Kinh nghiệm",
    processingTime: "15-30 ngày"
  },
  {
    id: 12,
    title: "Visa Canada: Hướng dẫn chi tiết",
    country: "Canada",
    flag: "🇨🇦",
    continent: "Châu Mỹ",
    excerpt: "Quy trình xin visa Canada du lịch và thăm thân cho người Việt Nam.",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&h=400&fit=crop",
    readTime: "7 phút",
    category: "Hướng dẫn",
    processingTime: "10-20 ngày"
  },
  {
    id: 13,
    title: "Visa Brazil: Thủ tục và yêu cầu",
    country: "Brazil",
    flag: "🇧🇷",
    continent: "Châu Mỹ",
    excerpt: "Hướng dẫn làm visa Brazil, điều kiện và hồ sơ cần thiết.",
    image: "https://images.unsplash.com/photo-1655700628980-e483109c1b88?w=600&h=400&fit=crop",
    readTime: "5 phút",
    category: "Hướng dẫn",
    processingTime: "10-15 ngày"
  }
];

const VISA_CHAU_UC = [
  {
    id: 14,
    title: "Visa Úc: Hồ sơ và quy trình",
    country: "Úc",
    flag: "🇦🇺",
    continent: "Châu Úc",
    excerpt: "Tất tần tật về visa du lịch Úc, visa thăm thân và các loại visa phổ biến khác.",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop",
    readTime: "6 phút",
    category: "Hướng dẫn",
    processingTime: "10-15 ngày"
  },
  {
    id: 15,
    title: "Visa New Zealand: Hướng dẫn đầy đủ",
    country: "New Zealand",
    flag: "🇳🇿",
    continent: "Châu Úc",
    excerpt: "Quy trình làm visa New Zealand du lịch, công tác và học tập.",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&h=400&fit=crop",
    readTime: "6 phút",
    category: "Hướng dẫn",
    processingTime: "10-15 ngày"
  }
];

const VISA_CHAU_PHI = [
  {
    id: 16,
    title: "Visa Nam Phi: Du lịch châu Phi",
    country: "Nam Phi",
    flag: "🇿🇦",
    continent: "Châu Phi",
    excerpt: "Hướng dẫn làm visa Nam Phi, khám phá vẻ đẹp hoang dã châu Phi.",
    image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600&h=400&fit=crop",
    readTime: "5 phút",
    category: "Hướng dẫn",
    processingTime: "10-15 ngày"
  },
  {
    id: 17,
    title: "Visa Ai Cập: Hồ sơ và thủ tục",
    country: "Ai Cập",
    flag: "🇪🇬",
    continent: "Châu Phi",
    excerpt: "Làm visa Ai Cập để khám phá Kim Tự Tháp và nền văn minh cổ đại.",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&h=400&fit=crop",
    readTime: "4 phút",
    category: "Hướng dẫn",
    processingTime: "7-10 ngày"
  }
];

const WHY_CHOOSE_US = [
  {
    icon: Users,
    title: "Tư vấn chuyên nghiệp",
    description: "Đội ngũ chuyên viên giàu kinh nghiệm, tư vấn tận tình"
  },
  {
    icon: CheckCircle2,
    title: "Tỷ lệ phê duyệt cao",
    description: "Hơn 95% hồ sơ được chúng tôi xử lý đều thành công"
  },
  {
    icon: Clock,
    title: "Xử lý nhanh chóng",
    description: "Cam kết xử lý hồ sơ trong thời gian ngắn nhất"
  },
  {
    icon: Shield,
    title: "Bảo mật tuyệt đối",
    description: "Thông tin cá nhân được bảo vệ nghiêm ngặt"
  }
];

const ArticleCard = ({ article, onNavigate }: { article: any; onNavigate: (page: PageType, data?: any) => void }) => (
  <Card 
    className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
    onClick={() => onNavigate("visa-article", article)}
  >
    <div className="relative h-48 overflow-hidden">
      <ImageWithFallback
        src={article.image}
        alt={article.country}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute top-4 left-4 flex gap-2">
        <Badge className="bg-gray-900/70 text-white border-0 backdrop-blur-sm">
          {article.category}
        </Badge>
        {article.popular && (
          <Badge className="bg-red-500 text-white border-0">
            <Flame className="w-3 h-3 mr-1" />
            Hot
          </Badge>
        )}
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <div className="text-2xl mb-1">{article.flag}</div>
        <h3 className="line-clamp-2">{article.title}</h3>
      </div>
    </div>
    
    <div className="p-4">
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
      
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {article.readTime}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {article.processingTime}
        </div>
      </div>

      <Button 
        className="w-full"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate("visa-consultation", { countryId: article.id, country: article.country });
        }}
      >
        Liên hệ tư vấn
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </Card>
);

export default function VisaLandingPage({ onNavigate }: VisaLandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1743193143977-bc57e2c100ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXNhJTIwcGFzc3BvcnQlMjB0cmF2ZWwlMjBkb2N1bWVudHN8ZW58MXx8fHwxNzYxOTk3NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Visa Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <Badge className="bg-blue-500/90 text-white border-0 mb-4 px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Dịch vụ Visa uy tín
            </Badge>
            <h1 className="text-5xl md:text-6xl mb-6">
              Tư Vấn Làm Visa Chuyên Nghiệp
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Hướng dẫn chi tiết - Tư vấn tận tâm - Tỷ lệ thành công cao
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-8 text-lg"
                onClick={() => onNavigate("visa-consultation")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Đăng ký tư vấn ngay
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 h-14 px-8 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Hotline: 1900-xxxx
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Visa Hot */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl">Visa Hot</h2>
              <p className="text-gray-600">Thông tin visa được quan tâm nhất</p>
            </div>
            <Badge className="bg-red-500 text-white border-0 px-4 py-2 ml-auto">
              <TrendingUp className="w-4 h-4 mr-1" />
              Hot
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VISA_HOT.map((article) => (
              <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Visa Châu Á */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-5xl">🌏</div>
            <div>
              <h2 className="text-4xl">Visa Châu Á</h2>
              <p className="text-gray-600">Thông tin visa các nước châu Á</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VISA_CHAU_A.map((article) => (
              <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Visa Châu Âu */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-5xl">🇪🇺</div>
            <div>
              <h2 className="text-4xl">Visa Châu Âu</h2>
              <p className="text-gray-600">Thông tin visa các nước châu Âu</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VISA_CHAU_AU.map((article) => (
              <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Visa Châu Mỹ */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-5xl">🌎</div>
            <div>
              <h2 className="text-4xl">Visa Châu Mỹ</h2>
              <p className="text-gray-600">Thông tin visa các nước châu Mỹ</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VISA_CHAU_MY.map((article) => (
              <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Visa Châu Úc */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-5xl">🦘</div>
            <div>
              <h2 className="text-4xl">Visa Châu Úc</h2>
              <p className="text-gray-600">Thông tin visa các nước châu Úc</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VISA_CHAU_UC.map((article) => (
              <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Visa Châu Phi */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-5xl">🦁</div>
            <div>
              <h2 className="text-4xl">Visa Châu Phi</h2>
              <p className="text-gray-600">Thông tin visa các nước châu Phi</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VISA_CHAU_PHI.map((article) => (
              <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-gray-700 text-lg">Dịch vụ tư vấn visa uy tín hàng đầu Việt Nam</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl mb-4">Bạn cần hỗ trợ làm visa?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Đăng ký ngay để được tư vấn miễn phí bởi đội ngũ chuyên viên giàu kinh nghiệm
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 h-14 px-8 text-lg"
              onClick={() => onNavigate("visa-consultation")}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Đăng ký tư vấn miễn phí
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20 h-14 px-8 text-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email: visa@wanderlust.vn
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6" />
                <div>
                  <div className="text-2xl">95%</div>
                  <div className="text-sm text-orange-100">Tỷ lệ thành công</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div>
                  <div className="text-2xl">10,000+</div>
                  <div className="text-sm text-orange-100">Khách hàng tin tưởng</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6" />
                <div>
                  <div className="text-2xl">50+</div>
                  <div className="text-sm text-orange-100">Quốc gia hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
