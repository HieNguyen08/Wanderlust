import { Award, ChevronLeft, ChevronRight, Clock, Compass, DollarSign, Heart, Landmark, MapPinned, Mountain, Plane, Shield, Sparkles, Star, Utensils, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { HeroSearchHub } from "../../components/HeroSearchHub";
import { ReviewList } from "../../components/reviews/ReviewList";
import { SearchLoadingOverlay } from "../../components/SearchLoadingOverlay";
import { Button } from "../../components/ui/button";
import { WebsiteReviewPrompt } from "../../components/WebsiteReviewPrompt";
import type { PageType } from "../../MainApp";
import { activityApi, locationApi, reviewApi } from "../../utils/api";

interface HomePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  console.log("🏠 HomePage rendered!");
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<"flight" | "hotel" | "car" | "activity">("hotel");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [locationCache, setLocationCache] = useState<Map<number, any[]>>(new Map());
  const [featuredLocations, setFeaturedLocations] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
  const [topActivities, setTopActivities] = useState<any[]>([]);
  const [websiteReviewsCount, setWebsiteReviewsCount] = useState(0);
  
  const ITEMS_PER_PAGE = 6;

  // Smart pagination: preload adjacent pages
  const loadPages = async (pagesToLoad: number[]) => {
    const newLoadingPages = new Set(loadingPages);
    const pagesToFetch = pagesToLoad.filter(page => !locationCache.has(page) && !newLoadingPages.has(page));
    
    if (pagesToFetch.length === 0) return;
    
    pagesToFetch.forEach(page => newLoadingPages.add(page));
    setLoadingPages(newLoadingPages);
    
    try {
      const fetchPromises = pagesToFetch.map(async (page) => {
        const response = await locationApi.getAllLocations({
          page: page - 1, // API uses 0-based pagination
          size: ITEMS_PER_PAGE,
          sortBy: 'popularity',
          sortDir: 'desc'
        });
        return { page, data: response };
      });
      
      const results = await Promise.all(fetchPromises);
      
      setLocationCache(prev => {
        const newCache = new Map(prev);
        results.forEach(({ page, data }) => {
          newCache.set(page, data.content || data);
          if (data.totalPages) setTotalPages(data.totalPages);
        });
        return newCache;
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoadingPages(prev => {
        const newSet = new Set(prev);
        pagesToFetch.forEach(page => newSet.delete(page));
        return newSet;
      });
    }
  };
  
  // Calculate which pages to preload based on current page
  const getPagesToLoad = (page: number) => {
    const pages = [page];
    // Preload ±2 pages
    if (page > 1) pages.push(page - 1);
    if (page > 2) pages.push(page - 2);
    if (page < totalPages) pages.push(page + 1);
    if (page < totalPages - 1) pages.push(page + 2);
    return pages;
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initial load: fetch first 3 pages
        await loadPages([1, 2, 3]);
        
        // Fetch top-rated activities
        const activitiesResponse = await activityApi.getAllActivities();
        const activities = Array.isArray(activitiesResponse)
          ? activitiesResponse
          : activitiesResponse?.content ?? [];
        const sortedActivities = activities
          .filter((a: any) => a.averageRating > 0)
          .sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 4);
        setTopActivities(sortedActivities);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    
    initializeData();

    // Fetch website reviews count
    const fetchWebsiteReviewsCount = async () => {
      try {
        const reviews = await reviewApi.getReviewsByTarget('WEBSITE', 'WANDERLUST');
        setWebsiteReviewsCount(reviews?.length || 0);
      } catch (error) {
        console.error("Error fetching website reviews count:", error);
      }
    };
    fetchWebsiteReviewsCount();
  }, []);
  
  // Load adjacent pages when current page changes
  useEffect(() => {
    if (totalPages > 0) {
      const pagesToLoad = getPagesToLoad(currentPage);
      loadPages(pagesToLoad);
    }
  }, [currentPage, totalPages]);
  
  // Update featured locations when page or cache changes
  useEffect(() => {
    const locations = locationCache.get(currentPage) || [];
    setFeaturedLocations(locations);
  }, [currentPage, locationCache]);

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
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl md:text-4xl text-red-600">{t('home.featuredDestinations')}</h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg mb-10 text-center md:text-left">{t('home.featuredDestinationsDesc')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredLocations.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-300" />
                  <div className="p-4 bg-white">
                    <div className="h-4 bg-gray-300 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : (
              featuredLocations.map((destination) => (
                <div
                  key={destination.id}
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
                          <p className="text-sm text-gray-200 line-clamp-2">{destination.description || 'Explore this amazing destination'}</p>
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
              ))
            )}
          </div>
          
          {/* Smart Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {currentPage > 2 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="px-2 py-2 text-gray-500">...</span>}
                  </>
                )}
                
                {[currentPage - 1, currentPage, currentPage + 1].map(page => {
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        page === currentPage
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="px-2 py-2 text-gray-500">...</span>}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Popular Tours Section */}
        <div className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-10">
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Compass className="w-6 h-6 text-blue-600" />
                  <h2 className="text-3xl md:text-4xl text-red-600">{t('home.popularTours')}</h2>
                </div>
                <p className="text-gray-600 text-base md:text-lg">{t('home.popularToursDesc')}</p>
              </div>
              <Button
                onClick={() => onNavigate('activities')}
                className="bg-blue-600 hover:bg-blue-700 text-white hidden md:flex"
              >
                {t('common.viewAll')} →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topActivities.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-64 bg-gray-300" />
                    <div className="p-4 bg-white">
                      <div className="h-4 bg-gray-300 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              ) : (
                topActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => onNavigate("activity-detail", { id: activity.id })}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={activity.images?.[0]?.url || "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop"}
                        alt={activity.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      {activity.duration && (
                        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{activity.averageRating?.toFixed(1) || 0}</span>
                        <span className="text-xs text-gray-500">({activity.totalReviews || 0})</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1 line-clamp-1">{activity.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description || 'Amazing experience'}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">{t('common.from')}</p>
                          <p className="text-blue-600 text-lg font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.price)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("activity-detail", { id: activity.id });
                          }}
                        >
                          {t('common.bookNow')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Mobile View All Button */}
            <div className="flex justify-center mt-8 md:hidden">
              <Button
                onClick={() => onNavigate('activities')}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-xs"
              >
                {t('common.viewAll')} →
              </Button>
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

        {/* Customer Testimonials Section (live reviews) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-3xl md:text-4xl text-red-600">{t('home.testimonials')}</h2>
            </div>
            <p className="text-gray-600 text-base md:text-lg">
              {t('home.testimonialsDesc')}
            </p>
          </div>

          {/* Website Review Prompt - Show if user has completed bookings */}
          <WebsiteReviewPrompt className="mb-8" />

          <ReviewList
            targetType="WEBSITE"
            targetId="WANDERLUST"
            title={t('home.testimonials')}
            limit={3}
          />
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
