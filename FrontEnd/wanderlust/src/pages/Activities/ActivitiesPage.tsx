import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Check, ChevronDown, MapPin, Search, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Button } from "../../components/ui/button";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import type { PageType } from "../../MainApp";
import { PaginationUI } from "../../components/ui/PaginationUI";
import { useSmartPagination } from "../../hooks/useSmartPagination";
import { useCallback } from "react";
import type { PageType } from "../../MainApp";
import { activityApi, locationApi } from "../../utils/api";

// Activity Category Icons (using Lucide icons instead of imported images)
const categories = [
  { id: "all", name: "Tất cả hoạt động", icon: "grid" },
  { id: "attractions", name: "Điểm tham quan", icon: "ferris-wheel" },
  { id: "tours", name: "Tours", icon: "map" },
  { id: "spa", name: "Spa", icon: "spa" },
  { id: "food", name: "Ẩm thực", icon: "utensils" },
  { id: "music", name: "Nhạc hội", icon: "music" },
];

interface Activity {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  locationId?: string;
  duration?: string;
  description: string;
}

interface LocationItem {
  id: string;
  code: string;
  name: string;
  country: string;
}

interface ActivitiesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  initialCategory?: string;
  userRole?: any;
  onLogout?: () => void;
  searchParams?: any;
}

export default function ActivitiesPage({ onNavigate, initialCategory = "all", userRole, onLogout, searchParams }: ActivitiesPageProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  // const [activities, setActivities] = useState<Activity[]>([]); // Hook manages data
  const [loading, setLoading] = useState(true); // Keeping for initial location loading? Or just use hook loading.
  // We can use hook loading for activities.
  const [error, setError] = useState<string | null>(null);

  // Advanced Search States
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [openLocation, setOpenLocation] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  // Advanced Filters States (kept for future use or if UI elements are re-added)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");

  const totalGuests = adults + children;

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationApi.getLocationsByType('CITY');
        const locationsArray = Array.isArray(response) ? response : (response.content || []);

        const mappedLocations: LocationItem[] = locationsArray.map((loc: any) => ({
          id: loc.id,
          code: loc.code || "N/A",
          name: loc.name,
          country: loc.metadata?.country || "Việt Nam",
        }));

        if (mappedLocations.length === 0) {
          const fallbackLocations: LocationItem[] = [
            { id: "HAN", code: "HAN", name: "Hà Nội", country: "Việt Nam" },
            { id: "HCM", code: "HCM", name: "TP. Hồ Chí Minh", country: "Việt Nam" },
            { id: "DAD", code: "DAD", name: "Đà Nẵng", country: "Việt Nam" },
            { id: "PQC", code: "PQC", name: "Phú Quốc", country: "Việt Nam" },
          ];
          setLocations(fallbackLocations);
        } else {
          setLocations(mappedLocations);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    };

    fetchLocations();
  }, []);

  const fetchData = useCallback(async (page: number, size: number) => {
    try {
      const apiParams: any = {};

      // Location
      if (selectedLocation?.id) {
        apiParams.locationId = selectedLocation.id;
      } else if (searchParams?.locationId) {
        apiParams.locationId = searchParams.locationId;
      }

      // Category
      if (selectedCategory && selectedCategory !== "all") {
        // Map frontend category to backend enum
        let backendCategory = "";
        switch (selectedCategory) {
          case 'attractions': backendCategory = 'ATTRACTION'; break;
          case 'tours': backendCategory = 'TOUR'; break;
          case 'food': backendCategory = 'FOOD'; break;
          case 'spa': backendCategory = 'RELAXATION'; break;
          case 'music': backendCategory = 'ENTERTAINMENT'; break;
        }
        if (backendCategory) {
          apiParams.categories = [backendCategory];
        }
      }

      // Price
      if (priceRange[0] > 0) apiParams.minPrice = priceRange[0];
      if (priceRange[1] < 10000000) apiParams.maxPrice = priceRange[1];

      const data = await activityApi.getAllActivities({
        ...apiParams,
        page,
        size
      });

      // Map backend data to frontend format
      const mapCategory = (backendCategory: string) => {
        const cat = backendCategory?.toUpperCase();
        switch (cat) {
          case 'ATTRACTION': return 'attractions';
          case 'TOUR': return 'tours';
          case 'FOOD': return 'food';
          case 'RELAXATION': return 'spa';
          case 'ENTERTAINMENT': return 'music';
          case 'ADVENTURE': return 'tours';
          case 'CULTURE': return 'attractions';
          default: return 'other';
        }
      };

      const mappedActivities = (data.content || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.images?.[0]?.url || "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
        price: item.price,
        originalPrice: item.originalPrice,
        category: mapCategory(item.category),
        rating: item.averageRating || 0,
        reviews: item.totalReviews || 0,
        location: item.locationName || item.meetingPoint || "Vietnam",
        locationId: item.locationId,
        duration: item.duration,
        description: item.description
      }));

      return {
        data: mappedActivities,
        totalItems: data.totalElements || 0
      };

    } catch (err: any) {
      console.error("Error fetching activities:", err);
      // setError("Failed to load activities"); // Set error state if needed
      return { data: [], totalItems: 0 };
    }
  }, [selectedLocation, searchParams, selectedCategory, priceRange]); // depend on filters

  const {
    currentItems: activities,
    totalPages,
    currentPage,
    goToPage,
    isLoading: isActivitiesLoading
  } = useSmartPagination({
    fetchData,
    pageSize: 9, // Grid 3x3
    preloadRange: 1
  });

  // Reset page when filters change
  useEffect(() => {
    goToPage(0);
  }, [selectedCategory, selectedLocation, priceRange]);

  // Initialize from searchParams after locations loaded
  useEffect(() => {
    if (!searchParams) return;

    if (searchParams.locationId && locations.length > 0) {
      const found = locations.find((loc) => loc.id === searchParams.locationId);
      if (found) setSelectedLocation(found);
    } else if (searchParams.location && locations.length > 0) {
      const foundByName = locations.find((loc) => loc.name.toLowerCase() === searchParams.location.toLowerCase());
      if (foundByName) setSelectedLocation(foundByName);
    }

    if (searchParams.date) {
      setSelectedDate(new Date(searchParams.date));
    }
    if (searchParams.adults) {
      setAdults(searchParams.adults);
    }
    if (searchParams.children !== undefined) {
      setChildren(searchParams.children);
    }
  }, [searchParams, locations]);

  // Removed client-side filtered/sorted activities
  // Just use 'activities' from hook (which are the current page items)
  // If we need client-side text search (searchQuery), we can filter 'activities' here?
  // But 'activities' is only 9 items. Search should happen on backend.
  // Backend searchActivities DOES NOT support text search (name) yet!
  // It supports locationId, category, price.
  // Requirement gap: The page has a "name" search? No, only Location search bar + filters.
  // Ah, line 196: matchesSearchText = activity.name.toLowerCase().includes(searchQuery)...
  // 'searchQuery' state exists (line 59). But where is input?
  // The advanced search bar has Location, Date, Guests. No Name input.
  // Wait, line 417 "Search Button". OnClick?
  // Search button just triggers..? It's inside a div.
  // There is NO text input for name search in the UI code shown.
  // So client-side text search was likely unused or implicit?
  // Actually, 'searchQuery' state is unused except in 'filteredActivities'.
  // And there's no input setting 'setSearchQuery'.
  // So I can ignore text search for now.

  const sortedActivities = activities; // No sorting on client side for now, or sort the page items?
  // 'sortBy' state exists (line 77). If I want to sort, I should pass sort to backend.
  // Backend default sort?
  // For now, I will just render 'activities' as is (backend order).
  // If I want to support sort, I need to add 'sortBy' to api.ts and Backend.
  // For MVP integration, I will skip sort parameter update.



  const handleActivityClick = (activity: Activity) => {
    onNavigate("activity-detail", {
      activity,
      bookingInfo: {
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
        guests: {
          adults,
          children,
          total: totalGuests,
        },
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="activities" onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 pb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&h=800&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* Hero Title */}
          <div className="pt-12 md:pt-20 max-w-4xl">
            <h2 className="text-white text-3xl md:text-5xl lg:text-5xl leading-tight drop-shadow-2xl">
              {t('activitiesPage.heroTitle')}
            </h2>
          </div>
        </div>

        {/* Advanced Search Bar */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            {/* Main Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              {/* Location */}
              <Popover open={openLocation} onOpenChange={setOpenLocation}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-2 border-gray-300 hover:border-blue-500 h-14"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{t('activitiesPage.location')}</p>
                        <p className="text-sm font-medium truncate">
                          {selectedLocation ? selectedLocation.name : t('activitiesPage.selectLocation')}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t('activitiesPage.searchLocationPlaceholder') || "Tìm địa điểm..."} />
                    <CommandList>
                      <CommandEmpty>{t('activitiesPage.noLocationFound') || "Không tìm thấy."}</CommandEmpty>
                      <CommandGroup>
                        {locations.map((loc) => (
                          <CommandItem
                            key={loc.id}
                            value={loc.name}
                            onSelect={() => {
                              setSelectedLocation(loc);
                              setOpenLocation(false);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${selectedLocation?.id === loc.id ? "opacity-100" : "opacity-0"}`} />
                            <div className="flex flex-col">
                              <span>{loc.name}</span>
                              <span className="text-xs text-gray-500">{loc.country}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Date */}
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-2 border-gray-300 hover:border-blue-500 h-14"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{t('activitiesPage.participationDate')}</p>
                        <p className="text-sm font-medium truncate">
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : t('activitiesPage.selectDate')}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setOpenDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* Guests */}
              <Popover open={openGuests} onOpenChange={setOpenGuests}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-2 border-gray-300 hover:border-blue-500 h-14"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{t('activitiesPage.numberOfPeople')}</p>
                        <p className="text-sm font-medium truncate">
                          {totalGuests} {t('activitiesPage.people')}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('activitiesPage.adults')}</p>
                        <p className="text-sm text-gray-500">{t('activitiesPage.from12YearsOld')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAdults(Math.min(10, adults + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('activitiesPage.children')}</p>
                        <p className="text-sm text-gray-500">{t('activitiesPage.from2To11YearsOld')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setChildren(Math.min(10, children + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-14">
                <Search className="w-5 h-5 mr-2" />
                {t('activitiesPage.search')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          {selectedCategory !== "all" && (
            <div className="mt-2 h-1 bg-green-500 rounded-full w-32" />
          )}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl text-gray-800 mb-2">
            {categories.find(c => c.id === selectedCategory)?.name || t('activitiesPage.allActivities')}
          </h3>
          {/* 
          <p className="text-gray-600">
            {t('activitiesPage.found')} {filteredActivities.length} {t('activitiesPage.activities')}
          </p> 
          */}
        </div>

        {isActivitiesLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              {t('activitiesPage.retry')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {activity.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{Math.round((1 - activity.price / activity.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {activity.name}
                  </h4>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>

                  {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{activity.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">{activity.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({activity.reviews} {t('activitiesPage.reviews')})</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      {activity.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {activity.originalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                      <p className="text-xl font-bold text-red-600">
                        {activity.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      {t('activitiesPage.viewDetails')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isActivitiesLoading && !error && sortedActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t('activitiesPage.noActivitiesFound')}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <PaginationUI
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
