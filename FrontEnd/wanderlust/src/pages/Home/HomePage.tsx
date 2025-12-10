import { Award, ChevronLeft, ChevronRight, Clock, Compass, DollarSign, Heart, Landmark, MapPinned, Mountain, Plane, Shield, Sparkles, Star, Utensils, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { HeroSearchHub } from "../../components/HeroSearchHub";
import { SearchLoadingOverlay } from "../../components/SearchLoadingOverlay";
import { Button } from "../../components/ui/button";
import type { PageType } from "../../MainApp";
import { locationApi } from "../../utils/api";

interface HomePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  console.log("🏠 HomePage rendered!");
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<"flight" | "hotel" | "car" | "activity">("hotel");
  const [destinationsPage, setDestinationsPage] = useState(0);
  const [featuredLocations, setFeaturedLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch featured locations or just all locations for now
        // Assuming we want to show popular cities
        const data = await locationApi.getLocationsByType('CITY');
        setFeaturedLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (data: any) => {
    // Determine search type and set loading
    const typeMap: Record<string, "flight" | "hotel" | "car" | "activity"> = {
      flights: "flight",
      hotels: "hotel",
      car: "car",
      activities: "activity",
    };

    setSearchType(typeMap[data.type] || "hotel");
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="bg-white w-full min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            alt="Beautiful tropical beach"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* Header Spacer */}
          <div className="h-[60px]" />

          {/* Hero Text */}
          <div className="mt-12 md:mt-20 max-w-4xl">
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl leading-tight drop-shadow-2xl">
              {t('home.heroTitle')}
              <br />
              <span className="text-yellow-300">{t('home.heroTitleHighlight')}</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl mt-4 drop-shadow-lg">
              {t('home.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Hub - Overlapping Hero */}
      <div className="-mt-20 relative z-20">
        <HeroSearchHub onNavigate={onNavigate} onSearch={handleSearch} />
      </div>

      {/* Main Content */}
      <div className="w-full">
        {/* Featured Destinations Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl md:text-4xl text-red-600">{t('home.featuredDestinations')}</h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">{t('home.featuredDestinationsDesc')}</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setDestinationsPage(Math.max(0, destinationsPage - 1))}
                disabled={destinationsPage === 0}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDestinationsPage(Math.min(1, destinationsPage + 1))}
                disabled={destinationsPage === 1}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${destinationsPage * 100}%)` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
                {featuredLocations.slice(0, 6).map((destination) => (
                  <div
                    key={destination.id || destination.code}
                    className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                    onClick={() => onNavigate("location-detail", { id: destination.id })}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={destination.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop"}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                      {destination.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">Featured</span>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl mb-1">{destination.name}</h3>
                            <p className="text-sm text-gray-200 line-clamp-2">{destination.description}</p>
                          </div>
                          <MapPinned className="w-5 h-5 shrink-0 mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <p className="text-blue-600 text-lg">Explore</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("location-detail", { id: destination.id });
                          }}
                        >
                          {t('common.viewDetails')} →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Tours Section */}
        <div className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Compass className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl md:text-4xl text-red-600">{t('home.popularTours')}</h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">{t('home.popularToursDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 1,
                  titleKey: "home.tours.family",
                  descKey: "home.tours.familyDesc",
                  duration: "5N4Đ",
                  price: "15.900.000đ",
                  priceNumber: 15900000,
                  image: "https://images.unsplash.com/photo-1552249352-02a0817a2d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDF8fHx8MTc2MTkyNzg1MHww&ixlib=rb-4.1.0&q=80&w=1080",
                  rating: 4.8,
                  reviews: 256,
                  destination: "Phuket, Thái Lan"
                },
                {
                  id: 2,
                  titleKey: "home.tours.honeymoon",
                  descKey: "home.tours.honeymoonDesc",
                  duration: "7N6Đ",
                  price: "42.500.000đ",
                  priceNumber: 42500000,
                  image: "https://images.unsplash.com/photo-1644727783395-8bffbeba5273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leW1vb24lMjByb21hbnRpYyUyMHN1bnNldHxlbnwxfHx8fDE3NjE5ODkxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  rating: 4.9,
                  reviews: 189,
                  destination: "Maldives"
                },
                {
                  id: 3,
                  titleKey: "home.tours.safari",
                  descKey: "home.tours.safariDesc",
                  duration: "6N5Đ",
                  price: "38.900.000đ",
                  priceNumber: 38900000,
                  image: "https://images.unsplash.com/photo-1602410125631-7e736e36797c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3NjE5ODkxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  rating: 4.7,
                  reviews: 142,
                  destination: "Kenya"
                },
                {
                  id: 4,
                  titleKey: "home.tours.cruise",
                  descKey: "home.tours.cruiseDesc",
                  duration: "10N9Đ",
                  price: "65.000.000đ",
                  priceNumber: 65000000,
                  image: "https://images.unsplash.com/photo-1746900830074-baf6ddf20bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnVpc2UlMjBzaGlwJTIwb2NlYW58ZW58MXx8fHwxNzYxOTE1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
                  rating: 5.0,
                  reviews: 312,
                  destination: "Caribbean"
                }
              ].map((tour, index) => {
                // Convert to TourDetailPage format
                const tourData = {
                  id: tour.id,
                  name: t(tour.titleKey),
                  location: tour.destination,
                  image: tour.image,
                  price: tour.priceNumber,
                  rating: tour.rating,
                  reviews: tour.reviews,
                  duration: tour.duration
                };

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => onNavigate("tour-detail", tourData)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={tour.image}
                        alt={t(tour.titleKey)}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm">
                        {tour.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{tour.rating}</span>
                      </div>
                      <h3 className="text-lg mb-1">{t(tour.titleKey)}</h3>
                      <p className="text-sm text-gray-600 mb-3">{t(tour.descKey)}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">{t('common.from')}</p>
                          <p className="text-blue-600 text-lg">{tour.price}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("tour-detail", tourData);
                          }}
                        >
                          {t('common.bookNow')}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Travel Experiences Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="w-6 h-6 text-purple-600" />
              <h2 className="text-3xl md:text-4xl text-red-600">{t('home.travelExperiences')}</h2>
            </div>
            <p className="text-gray-600 text-base md:text-lg">{t('home.travelExperiencesDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Waves,
                titleKey: "home.experiences.diving",
                descKey: "home.experiences.divingDesc",
                image: "https://images.unsplash.com/photo-1628371217613-714161455f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3ViYSUyMGRpdmluZyUyMGNvcmFsfGVufDF8fHx8MTc2MTk4OTEyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
                tours: "120+ tours",
                category: "attractions"
              },
              {
                icon: Mountain,
                titleKey: "home.experiences.hiking",
                descKey: "home.experiences.hikingDesc",
                image: "https://images.unsplash.com/photo-1609373066983-cee8662ea93f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBtb3VudGFpbiUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjE4OTIyODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                tours: "85+ tours",
                category: "tours"
              },
              {
                icon: Utensils,
                titleKey: "home.experiences.culinary",
                descKey: "home.experiences.culinaryDesc",
                image: "https://images.unsplash.com/photo-1759972078854-77866a0685c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwY3VsaW5hcnklMjB0b3VyfGVufDF8fHx8MTc2MTkzOTgxMnww&ixlib=rb-4.1.0&q=80&w=1080",
                tours: "200+ tours",
                category: "food"
              },
              {
                icon: Landmark,
                titleKey: "home.experiences.heritage",
                descKey: "home.experiences.heritageDesc",
                image: "https://images.unsplash.com/photo-1690476703929-0718aba7a511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGhlcml0YWdlJTIwdGVtcGxlfGVufDF8fHx8MTc2MTk4OTEyOHww&ixlib=rb-4.1.0&q=80&w=1080",
                tours: "150+ tours",
                category: "attractions"
              }
            ].map((experience, index) => {
              const Icon = experience.icon;
              return (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => onNavigate("activities", { category: experience.category })}
                >
                  <div className="relative h-56 rounded-xl overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-all">
                    <ImageWithFallback
                      src={experience.image}
                      alt={t(experience.titleKey)}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mb-3 group-hover:bg-white/30 transition-colors">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl mb-1">{t(experience.titleKey)}</h3>
                      <p className="text-sm text-gray-200 mb-2">{t(experience.descKey)}</p>
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{experience.tours}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-blue-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-3xl md:text-4xl text-red-600">{t('home.whyChooseUs')}</h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">{t('home.whyChooseUsDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Plane,
                  titleKey: "home.features.variety",
                  descKey: "home.features.varietyDesc",
                  color: "blue"
                },
                {
                  icon: Shield,
                  titleKey: "home.features.security",
                  descKey: "home.features.securityDesc",
                  color: "green"
                },
                {
                  icon: DollarSign,
                  titleKey: "home.features.bestPrice",
                  descKey: "home.features.bestPriceDesc",
                  color: "yellow"
                },
                {
                  icon: Clock,
                  titleKey: "home.features.support247",
                  descKey: "home.features.support247Desc",
                  color: "purple"
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600",
                  green: "bg-green-100 text-green-600",
                  yellow: "bg-yellow-100 text-yellow-600",
                  purple: "bg-purple-100 text-purple-600"
                };
                return (
                  <div
                    key={index}
                    className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-gray-600 text-sm">{t(feature.descKey)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-3xl md:text-4xl text-red-600">{t('home.testimonials')}</h2>
            </div>
            <p className="text-gray-600 text-base md:text-lg">{t('home.testimonialsDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Minh Anh",
                location: "Hà Nội",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
                rating: 5,
                comment: "Trải nghiệm tuyệt vời! Dịch vụ chuyên nghiệp, giá cả hợp lý. Tôi đã có chuyến đi Paris đáng nhớ nhất đời."
              },
              {
                name: "Trần Thị Hương",
                location: "TP. Hồ Chí Minh",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                rating: 5,
                comment: "Website dễ sử dụng, booking nhanh chóng. Đội ngũ hỗ trợ nhiệt tình, tư vấn chi tiết. Rất hài lòng!"
              },
              {
                name: "Lê Văn Hùng",
                location: "Đà Nẵng",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                rating: 5,
                comment: "Tôi đã đặt tour Nhật Bản cho gia đình. Mọi thứ đều hoàn hảo từ A-Z. Chắc chắn sẽ quay lại!"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  <ImageWithFallback
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="mb-1">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Using shared component */}
      <Footer />

      {/* Search Loading Overlay */}
      <SearchLoadingOverlay
        isLoading={isSearching}
        searchType={searchType}
      />
    </div>
  );
}
