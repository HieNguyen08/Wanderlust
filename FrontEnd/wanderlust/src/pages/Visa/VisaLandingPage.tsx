import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    Flame,
    Globe,
    Mail,
    MessageCircle,
    Phone,
    Shield,
    Star,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { Footer } from "../../components/Footer";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { visaArticleApi } from "../../utils/api";

interface VisaLandingPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

const WHY_CHOOSE_US = [
  {
    icon: Users,
    title: "Tư vấn chuyên nghiệp",
    description: "Đội ngũ chuyên viên giàu kinh nghiệm, tư vấn tận tâm"
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
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
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
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisaArticles = async () => {
      try {
        setLoading(true);
        const data = await visaArticleApi.getAll();
        setAllArticles(data);
      } catch (error) {
        console.error('Error fetching visa articles:', error);
        toast.error('Không thể tải danh sách visa');
      } finally {
        setLoading(false);
      }
    };
    fetchVisaArticles();
  }, []);

  const VISA_HOT = allArticles.filter(article => article.popular);
  const VISA_CHAU_A = allArticles.filter(article => article.continent === 'Châu Á');
  const VISA_CHAU_AU = allArticles.filter(article => article.continent === 'Châu Âu');
  const VISA_CHAU_MY = allArticles.filter(article => article.continent === 'Châu Mỹ');
  const VISA_CHAU_UC = allArticles.filter(article => article.continent === 'Châu Úc');
  const VISA_CHAU_PHI = allArticles.filter(article => article.continent === 'Châu Phi');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách visa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1743193143977-bc57e2c100ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXNhJTIwcGFzc3BvcnQlMjB0cmF2ZWwlMjBkb2N1bWVudHN8ZW58MXx8fHwxNzYxOTk3NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Visa Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70" />
        
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
        {VISA_HOT.length > 0 && (
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
        )}

        {/* Visa Châu Á */}
        {VISA_CHAU_A.length > 0 && (
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
        )}

        {/* Visa Châu Âu */}
        {VISA_CHAU_AU.length > 0 && (
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
        )}

        {/* Visa Châu Mỹ */}
        {VISA_CHAU_MY.length > 0 && (
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
        )}

        {/* Visa Châu Úc */}
        {VISA_CHAU_UC.length > 0 && (
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
        )}

        {/* Visa Châu Phi */}
        {VISA_CHAU_PHI.length > 0 && (
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
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-linear-to-br from-blue-50 to-blue-100 py-16">
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
      <div className="bg-linear-to-r from-orange-500 to-orange-600 py-16">
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
