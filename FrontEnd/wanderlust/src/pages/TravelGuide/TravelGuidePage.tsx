import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import type { PageType } from "../../MainApp";
// Sử dụng API thật kết nối MongoDB local:
import { travelGuideApi } from "../../utils/api";
// Test API (không dùng nữa):
// import { testTravelGuideApi as travelGuideApi } from "../../utils/testApi";
import type { TravelGuide } from "../../types/travelGuide";

interface TravelGuidePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TravelGuidePage({ onNavigate }: TravelGuidePageProps) {
  const { t } = useTranslation();
  const [vietnamDestinations, setVietnamDestinations] = useState<TravelGuide[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<TravelGuide[]>([]);
  const [blogPosts, setBlogPosts] = useState<TravelGuide[]>([]);
  const [loading, setLoading] = useState(true);

  const continents = [
    {
      id: "asia",
      name: "Asia",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop",
    },
    {
      id: "australia",
      name: "Australia & Oceania",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=400&fit=crop",
    },
    {
      id: "europe",
      name: "Europe",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    },
    {
      id: "america",
      name: "North America",
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy guides Việt Nam (type = destination, country = Việt Nam)
        const vietnamGuides = await travelGuideApi.getByCountry("Việt Nam");
        setVietnamDestinations(vietnamGuides.filter((g: TravelGuide) => g.type === "destination").slice(0, 4));
        
        // Lấy featured destinations (không phải Việt Nam)
        const featuredGuides = await travelGuideApi.getFeatured();
        setPopularDestinations(
          featuredGuides
            .filter((g: TravelGuide) => g.type === "destination" && g.country !== "Việt Nam")
            .slice(0, 4)
        );
        
        // Lấy blog posts
        const blogs = await travelGuideApi.getByType("blog");
        setBlogPosts(blogs.slice(0, 3));
        
      } catch (error) {
        console.error("Error fetching travel guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDestinationClick = (guide: TravelGuide) => {
    onNavigate("guide-detail", { guide });
  };

  const handleContinentClick = async (continent: string) => {
    try {
      const guides = await travelGuideApi.getByContinent(continent);
      onNavigate("travel-guide-list", { continent, guides });
    } catch (error) {
      console.error("Error fetching continent guides:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=1920&h=800&fit=crop"
          alt="Hạ Long Bay, Vietnam"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Find travel inspirations, your way!
            </h2>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 text-white text-xl">
          Hạ Long Bay, Vietnam
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
          {t('common.back')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Vietnam Travel Guide */}
        <section className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('travelGuide.title')}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {t('travelGuide.subtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vietnamDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleDestinationClick(dest)}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={dest.coverImage}
                  alt={dest.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <h4 className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                  {dest.destination}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('travelGuide.popularDestinations')}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {t('travelGuide.popularDestinationsSubtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleDestinationClick(dest)}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={dest.coverImage}
                  alt={dest.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-white text-2xl font-bold mb-1">{dest.country}</h4>
                  <p className="text-white/90 text-sm">{dest.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Inspiration Blog */}
        <section className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('travelGuide.blogTitle')}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {t('travelGuide.blogSubtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => handleDestinationClick(post)}
              >
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 leading-relaxed group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </p>
                  {post.readTime && (
                    <p className="text-sm text-gray-500 mt-2">{post.readTime}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Explore the World */}
        <section>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('travelGuide.exploreWorld')}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {t('travelGuide.exploreWorldSubtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {continents.map((continent) => (
              <div
                key={continent.id}
                className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => onNavigate("guide-detail", { 
                  id: continent.id, 
                  name: continent.name,
                  image: continent.image,
                  description: `Khám phá vẻ đẹp và văn hóa độc đáo của châu ${continent.name}`
                })}
              >
                <ImageWithFallback
                  src={continent.image}
                  alt={continent.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <h4 className="absolute bottom-6 left-6 text-white text-xl font-bold">
                  {continent.name}
                </h4>
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
