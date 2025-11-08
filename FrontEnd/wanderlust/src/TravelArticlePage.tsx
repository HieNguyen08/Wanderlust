import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import type { PageType } from "./MainApp";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { toast } from "sonner@2.0.3";

interface TravelArticlePageProps {
  article: {
    id: number;
    title: string;
    image: string;
    readTime: string;
    category?: string;
    destination?: string;
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TravelArticlePage({ article, onNavigate }: TravelArticlePageProps) {
  // Mock content sections
  const sections = [
    {
      heading: "Giới thiệu chung",
      content: `${article.destination || "Điểm đến"} là một trong những địa điểm du lịch hấp dẫn nhất khu vực, nơi kết hợp hoàn hảo giữa vẻ đẹp tự nhiên và nền văn hóa lâu đời. Với hàng triệu du khách đến thăm mỗi năm, đây thực sự là điểm đến không thể bỏ lỡ trong hành trình khám phá của bạn.`,
    },
    {
      heading: "Thời điểm lý tưởng để ghé thăm",
      content: `Thời điểm tốt nhất để du lịch ${article.destination || "điểm đến này"} là vào mùa xuân (tháng 3-5) và mùa thu (tháng 9-11). Trong những tháng này, thời tiết ôn hòa, không quá nóng hay quá lạnh, rất phù hợp cho việc tham quan và khám phá. Đặc biệt, vào mùa xuân, bạn sẽ được chiêm ngưỡng cảnh sắc thiên nhiên tuyệt đẹp với hoa nở rộ khắp nơi.`,
    },
    {
      heading: "Các điểm tham quan nổi bật",
      content: `Có rất nhiều địa điểm thú vị để khám phá tại ${article.destination || "đây"}. Từ những di tích lịch sử cổ kính, các bảo tàng nghệ thuật, cho đến những khu phố sôi động và các trung tâm mua sắm hiện đại. Mỗi địa điểm đều mang một nét đặc trưng riêng, tạo nên bức tranh văn hóa đa dạng và phong phú.`,
    },
    {
      heading: "Ẩm thực địa phương",
      content: `Một trong những trải nghiệm không thể bỏ qua khi du lịch là thưởng thức ẩm thực địa phương. ${article.destination || "Nơi đây"} nổi tiếng với nhiều món ăn đặc sản độc đáo, từ các món ăn đường phố giá rẻ cho đến các nhà hàng cao cấp phục vụ món ăn truyền thống được chế biến tinh tế. Đừng quên thử các món đặc sản và ghé thăm các khu chợ địa phương để cảm nhận không khí ẩm thực sôi động.`,
    },
    {
      heading: "Kinh nghiệm di chuyển",
      content: `Hệ thống giao thông công cộng tại ${article.destination || "đây"} khá phát triển với nhiều phương tiện như tàu điện ngầm, xe buýt, và taxi. Bạn cũng có thể thuê xe máy hoặc xe đạp để di chuyển linh hoạt hơn. Nếu có điều kiện, việc mua thẻ giao thông theo ngày hoặc theo tuần sẽ giúp bạn tiết kiệm chi phí và thời gian.`,
    },
    {
      heading: "Lưu ý quan trọng",
      content: `Trước khi đi, hãy kiểm tra kỹ các thủ tục cần thiết như visa, bảo hiểm du lịch. Mang theo đầy đủ giấy tờ tùy thân, sạc dự phòng cho điện thoại, và một ít tiền mặt địa phương. Tôn trọng văn hóa và phong tục địa phương, ăn mặc lịch sự khi tham quan các địa điểm tôn giáo. Cuối cùng, hãy luôn giữ an toàn cho tài sản cá nhân và cẩn thận với đồ ăn đường phố nếu dạ dày bạn nhạy cảm.`,
    },
  ];

  // Related articles
  const relatedArticles = [
    {
      id: 101,
      title: `10 điều phải làm khi đến ${article.destination || "điểm đến này"}`,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      readTime: "6 phút đọc",
    },
    {
      id: 102,
      title: `Khám phá ẩm thực ${article.destination || "địa phương"}`,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      readTime: "8 phút đọc",
    },
    {
      id: 103,
      title: `Hành trình 7 ngày khám phá ${article.destination || "đầy đủ"}`,
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
      readTime: "12 phút đọc",
    },
  ];

  const handleShare = (platform: string) => {
    toast.success(`Đã chia sẻ bài viết lên ${platform}!`);
  };

  const handleSave = () => {
    toast.success("Đã lưu bài viết!");
  };

  const handleCopyLink = async () => {
    try {
      // Try using the Clipboard API first
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link!");
    } catch (err) {
      // Fallback method using a temporary textarea
      try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success("Đã sao chép link!");
        } else {
          toast.error("Không thể sao chép link. Vui lòng thử lại!");
        }
      } catch (fallbackErr) {
        toast.error("Không thể sao chép link. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="travel-guide" onNavigate={onNavigate} />

      {/* Hero Image */}
      <div className="w-full h-[400px] md:h-[500px] bg-gray-100">
        <ImageWithFallback
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("travel-guide")}
            className="gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại cẩm nang
          </Button>
        </div>

        {/* Article Header */}
        <article>
          {/* Category Badge */}
          {article.category && (
            <Badge className="mb-4">{article.category}</Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Wanderlust Travel</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2"
            >
              <Bookmark className="w-4 h-4" />
              Lưu bài viết
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Chia sẻ:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("Facebook")}
                className="w-9 h-9 p-0"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("Twitter")}
                className="w-9 h-9 p-0"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="w-9 h-9 p-0"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl md:text-3xl text-gray-900 mb-4">
                  {section.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="my-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <h3 className="text-2xl text-gray-900 mb-4">
              Sẵn sàng cho chuyến đi?
            </h3>
            <p className="text-gray-700 mb-6">
              Đặt vé máy bay, khách sạn và hoạt động vui chơi ngay hôm nay để nhận ưu đãi tốt nhất!
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onNavigate("flights", { destination: article.destination })}
                className="gap-2"
              >
                Đặt vé máy bay
              </Button>
              <Button
                onClick={() => onNavigate("hotel", { destination: article.destination })}
                variant="outline"
                className="gap-2"
              >
                Tìm khách sạn
              </Button>
              <Button
                onClick={() => onNavigate("activities", { destination: article.destination })}
                variant="outline"
                className="gap-2"
              >
                Xem hoạt động
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-3xl text-gray-900 mb-8">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card
                key={relatedArticle.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate("travel-article", { 
                  article: { 
                    ...relatedArticle, 
                    destination: article.destination,
                    category: article.category 
                  } 
                })}
              >
                <div className="h-40 overflow-hidden">
                  <ImageWithFallback
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {relatedArticle.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{relatedArticle.readTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
