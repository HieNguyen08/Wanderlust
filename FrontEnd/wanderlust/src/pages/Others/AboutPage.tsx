import { ArrowLeft, Award, Globe, Target, Users } from "lucide-react";
import DangThanhAnhImage from "../../assets/images/Đặng Thành Anh.jpg";
import BuiHoangQuangHuyImage from "../../assets/images/Bùi Hoàng Quang Huy.jpg";
import NguyenMinhHieuImage from "../../assets/images/Nguyễn Minh Hiếu.jpg";
import WanderlustImage1 from "../../assets/images/wanderlust1.jpg";
import WanderlustImage2 from "../../assets/images/wanderlust2.jpg";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { PageType } from "../../MainApp";
interface AboutPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const { t } = useTranslation();
  const values = [
    {
      icon: Target,
      title: t('about.missionTitle'),
      description: t('about.missionDesc'),
    },
    {
      icon: Users,
      title: t('about.teamTitle'),
      description: t('about.teamDesc'),
    },
    {
      icon: Award,
      title: t('about.qualityTitle'),
      description: t('about.qualityDesc'),
    },
    {
      icon: Globe,
      title: t('about.globalTitle'),
      description: t('about.globalDesc'),
    },
  ];

  const stats = [
    { number: "1M+", label: t('about.satisfiedCustomers') },
    { number: "10K+", label: t('about.destinations') },
    { number: "500+", label: t('about.partners') },
    { number: "24/7", label: t('about.support') },
  ];

  const team = [
    {
      name: "Đặng Thành Anh",
      role: "Developer & Founder",
      image: DangThanhAnhImage,
    },
    {
      name: "Bùi Hoàng Quang Huy",
      role: "Developer & Founder",
      image: BuiHoangQuangHuyImage,
    },
    {
      name: "Nguyễn Minh Hiếu",
      role: "Developer & Founder",
      image: NguyenMinhHieuImage,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=800&fit=crop"
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('about.backToHome')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Story Section */}
        {/* Story Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('about.aboutWanderlust')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              {t('about.heroSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
              <ImageWithFallback
                src={WanderlustImage1}
                alt="Traveler"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-gray-700 text-lg leading-relaxed text-justify">
                {t('about.storyPara1')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
                {t('about.storyPara2')}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
                {t('about.storyPara3')}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed font-medium text-justify">
                {t('about.storyPara4')}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] order-1 md:order-2">
              <ImageWithFallback
                src={WanderlustImage2}
                alt="Experience"
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
            {t('about.coreValues')}
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
            {t('about.ourTeam')}
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group w-64">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
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
