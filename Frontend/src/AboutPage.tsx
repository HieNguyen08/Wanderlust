import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowLeft, Target, Users, Award, Globe } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import type { PageType } from "./MainApp";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

interface AboutPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const values = [
    {
      icon: Target,
      title: "Sứ mệnh",
      description: "Mang đến trải nghiệm du lịch tuyệt vời và dễ dàng cho mọi người, kết nối bạn với thế giới.",
    },
    {
      icon: Users,
      title: "Đội ngũ",
      description: "Đội ngũ chuyên nghiệp với nhiều năm kinh nghiệm trong ngành du lịch và công nghệ.",
    },
    {
      icon: Award,
      title: "Chất lượng",
      description: "Cam kết chất lượng dịch vụ hàng đầu với giá cả cạnh tranh nhất thị trường.",
    },
    {
      icon: Globe,
      title: "Toàn cầu",
      description: "Kết nối hơn 10,000 điểm đến trên toàn thế giới, từ Đông Nam Á đến châu Âu, Mỹ.",
    },
  ];

  const stats = [
    { number: "1M+", label: "Khách hàng hài lòng" },
    { number: "10K+", label: "Điểm đến" },
    { number: "500+", label: "Đối tác" },
    { number: "24/7", label: "Hỗ trợ" },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    },
    {
      name: "Trần Thị B",
      role: "Chief Marketing Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    },
    {
      name: "Lê Văn C",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    },
    {
      name: "Phạm Thị D",
      role: "Customer Success Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="about" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=800&fit=crop"
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Về Wanderlust
            </h2>
            <p className="text-xl md:text-2xl">
              Từ Đông Nam Á đến thế giới, trong tầm tay bạn
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Story Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Wanderlust được thành lập với sứ mệnh đơn giản: Làm cho việc du lịch trở nên dễ dàng và phải chăng cho mọi người. Chúng tôi tin rằng mỗi người đều xứng đáng được khám phá thế giới.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong ngành du lịch, chúng tôi đã phục vụ hơn 1 triệu khách hàng, giúp họ tạo ra những kỷ niệm đáng nhớ trên khắp thế giới.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Giá trị cốt lõi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Đội ngũ của chúng tôi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
