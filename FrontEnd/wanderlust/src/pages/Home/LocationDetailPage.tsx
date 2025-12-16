import { ArrowLeft, Camera, Car, ChevronLeft, ChevronRight, Hotel, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Button } from "../../components/ui/button";
import { PageType } from "../../MainApp";
import { API_BASE_URL, locationApi } from "../../utils/api";

interface LocationDetailPageProps {
    locationId: string;
    onNavigate: (page: PageType, data?: any) => void;
}

interface LocationData {
    id: string;
    name: string;
    description: string;
    image: string;
    type: string;
    parentLocationId?: string;
}

interface ChildLocation {
    id: string;
    name: string;
    image: string;
    description: string;
    type: string;
}

interface ServiceData {
    id: string;
    name: string;
    image: string;
    price?: number;
    rating?: number;
    averageRating?: number;
    type: 'hotel' | 'car' | 'activity';
}

export default function LocationDetailPage({ locationId, onNavigate }: LocationDetailPageProps) {
    const { t } = useTranslation();
    const [location, setLocation] = useState<LocationData | null>(null);
    const [childLocations, setChildLocations] = useState<ChildLocation[]>([]);
    const [hotels, setHotels] = useState<ServiceData[]>([]);
    const [cars, setCars] = useState<ServiceData[]>([]);
    const [activities, setActivities] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    // Smart pagination states for each service type
    const ITEMS_PER_PAGE = 4;
    
    // Hotels pagination
    const [hotelCurrentPage, setHotelCurrentPage] = useState(1);
    const [hotelTotalPages, setHotelTotalPages] = useState(0);
    const [hotelCache, setHotelCache] = useState<Map<number, ServiceData[]>>(new Map());
    const [hotelLoadingPages, setHotelLoadingPages] = useState<Set<number>>(new Set());
    const [displayedHotels, setDisplayedHotels] = useState<ServiceData[]>([]);

    // Cars pagination
    const [carCurrentPage, setCarCurrentPage] = useState(1);
    const [carTotalPages, setCarTotalPages] = useState(0);
    const [carCache, setCarCache] = useState<Map<number, ServiceData[]>>(new Map());
    const [carLoadingPages, setCarLoadingPages] = useState<Set<number>>(new Set());
    const [displayedCars, setDisplayedCars] = useState<ServiceData[]>([]);

    // Activities pagination
    const [activityCurrentPage, setActivityCurrentPage] = useState(1);
    const [activityTotalPages, setActivityTotalPages] = useState(0);
    const [activityCache, setActivityCache] = useState<Map<number, ServiceData[]>>(new Map());
    const [activityLoadingPages, setActivityLoadingPages] = useState<Set<number>>(new Set());
    const [displayedActivities, setDisplayedActivities] = useState<ServiceData[]>([]);

    // Helper function to get pages to load
    const getPagesToLoad = (currentPage: number, totalPages: number) => {
        const pages = [currentPage];
        if (currentPage > 1) pages.push(currentPage - 1);
        if (currentPage > 2) pages.push(currentPage - 2);
        if (currentPage < totalPages) pages.push(currentPage + 1);
        if (currentPage < totalPages - 1) pages.push(currentPage + 2);
        return pages;
    };

    // Load hotels with smart pagination
    const loadHotelPages = async (pagesToLoad: number[]) => {
        const newLoadingPages = new Set(hotelLoadingPages);
        const pagesToFetch = pagesToLoad.filter(page => !hotelCache.has(page) && !newLoadingPages.has(page));
        
        if (pagesToFetch.length === 0) return;
        
        pagesToFetch.forEach(page => newLoadingPages.add(page));
        setHotelLoadingPages(newLoadingPages);
        
        try {
            const allPageData = await Promise.all(
                pagesToFetch.map(async (page) => {
                    const startIdx = (page - 1) * ITEMS_PER_PAGE;
                    const endIdx = page * ITEMS_PER_PAGE;
                    return { page, data: hotels.slice(startIdx, endIdx) };
                })
            );
            
            setHotelCache(prev => {
                const newCache = new Map(prev);
                allPageData.forEach(({ page, data }) => {
                    newCache.set(page, data);
                });
                return newCache;
            });
        } finally {
            setHotelLoadingPages(prev => {
                const newSet = new Set(prev);
                pagesToFetch.forEach(page => newSet.delete(page));
                return newSet;
            });
        }
    };

    // Load cars with smart pagination
    const loadCarPages = async (pagesToLoad: number[]) => {
        const newLoadingPages = new Set(carLoadingPages);
        const pagesToFetch = pagesToLoad.filter(page => !carCache.has(page) && !newLoadingPages.has(page));
        
        if (pagesToFetch.length === 0) return;
        
        pagesToFetch.forEach(page => newLoadingPages.add(page));
        setCarLoadingPages(newLoadingPages);
        
        try {
            const allPageData = await Promise.all(
                pagesToFetch.map(async (page) => {
                    const startIdx = (page - 1) * ITEMS_PER_PAGE;
                    const endIdx = page * ITEMS_PER_PAGE;
                    return { page, data: cars.slice(startIdx, endIdx) };
                })
            );
            
            setCarCache(prev => {
                const newCache = new Map(prev);
                allPageData.forEach(({ page, data }) => {
                    newCache.set(page, data);
                });
                return newCache;
            });
        } finally {
            setCarLoadingPages(prev => {
                const newSet = new Set(prev);
                pagesToFetch.forEach(page => newSet.delete(page));
                return newSet;
            });
        }
    };

    // Load activities with smart pagination
    const loadActivityPages = async (pagesToLoad: number[]) => {
        const newLoadingPages = new Set(activityLoadingPages);
        const pagesToFetch = pagesToLoad.filter(page => !activityCache.has(page) && !newLoadingPages.has(page));
        
        if (pagesToFetch.length === 0) return;
        
        pagesToFetch.forEach(page => newLoadingPages.add(page));
        setActivityLoadingPages(newLoadingPages);
        
        try {
            const allPageData = await Promise.all(
                pagesToFetch.map(async (page) => {
                    const startIdx = (page - 1) * ITEMS_PER_PAGE;
                    const endIdx = page * ITEMS_PER_PAGE;
                    return { page, data: activities.slice(startIdx, endIdx) };
                })
            );
            
            setActivityCache(prev => {
                const newCache = new Map(prev);
                allPageData.forEach(({ page, data }) => {
                    newCache.set(page, data);
                });
                return newCache;
            });
        } finally {
            setActivityLoadingPages(prev => {
                const newSet = new Set(prev);
                pagesToFetch.forEach(page => newSet.delete(page));
                return newSet;
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch location details
                const locData = await locationApi.getLocationById(locationId);
                setLocation(locData);

                // If COUNTRY type, fetch child CITY locations
                if (locData.type === 'COUNTRY' || locData.type === 'CONTRY') {
                    try {
                        const allLocations = await locationApi.getAllLocations({});
                        const children = (allLocations.content || allLocations).filter(
                            (loc: any) => loc.parentLocationId === locationId && loc.type === 'CITY'
                        );
                        setChildLocations(children);
                    } catch (error) {
                        console.error("Error fetching child locations:", error);
                    }
                }

                // Fetch related services
                const [hotelsRes, carsRes, activitiesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/hotels?location=${locData.name}`),
                    fetch(`${API_BASE_URL}/api/car-rentals?locationId=${locationId}`),
                    fetch(`${API_BASE_URL}/api/activities?locationId=${locationId}`)
                ]);

                if (hotelsRes.ok) {
                    const data = await hotelsRes.json();
                    const mappedHotels = data
                        .map((h: any) => ({ 
                            ...h, 
                            type: 'hotel' as const, 
                            image: h.images?.[0]?.url || h.images?.[0] || h.image,
                            rating: h.averageRating || h.rating || 0
                        }))
                        .sort((a: ServiceData, b: ServiceData) => (b.rating || 0) - (a.rating || 0));
                    setHotels(mappedHotels);
                    setHotelTotalPages(Math.ceil(mappedHotels.length / ITEMS_PER_PAGE));
                }
                if (carsRes.ok) {
                    const data = await carsRes.json();
                    const mappedCars = data
                        .map((c: any) => ({ 
                            ...c, 
                            type: 'car' as const, 
                            image: c.image || c.images?.[0],
                            rating: c.averageRating || c.rating || 0
                        }))
                        .sort((a: ServiceData, b: ServiceData) => (b.rating || 0) - (a.rating || 0));
                    setCars(mappedCars);
                    setCarTotalPages(Math.ceil(mappedCars.length / ITEMS_PER_PAGE));
                }
                if (activitiesRes.ok) {
                    const data = await activitiesRes.json();
                    const mappedActivities = data
                        .map((a: any) => ({ 
                            ...a, 
                            type: 'activity' as const, 
                            image: a.images?.[0]?.url || a.image,
                            rating: a.averageRating || a.rating || 0
                        }))
                        .sort((a: ServiceData, b: ServiceData) => (b.rating || 0) - (a.rating || 0));
                    setActivities(mappedActivities);
                    setActivityTotalPages(Math.ceil(mappedActivities.length / ITEMS_PER_PAGE));
                }

            } catch (error) {
                console.error("Error fetching location data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (locationId) {
            fetchData();
        }
    }, [locationId]);

    // Initialize pagination when data is loaded
    useEffect(() => {
        if (hotels.length > 0 && hotelTotalPages > 0) {
            loadHotelPages([1, 2, 3]);
        }
    }, [hotels.length, hotelTotalPages]);

    useEffect(() => {
        if (cars.length > 0 && carTotalPages > 0) {
            loadCarPages([1, 2, 3]);
        }
    }, [cars.length, carTotalPages]);

    useEffect(() => {
        if (activities.length > 0 && activityTotalPages > 0) {
            loadActivityPages([1, 2, 3]);
        }
    }, [activities.length, activityTotalPages]);

    // Load adjacent pages when current page changes
    useEffect(() => {
        if (hotelTotalPages > 0) {
            const pagesToLoad = getPagesToLoad(hotelCurrentPage, hotelTotalPages);
            loadHotelPages(pagesToLoad);
        }
    }, [hotelCurrentPage, hotelTotalPages]);

    useEffect(() => {
        if (carTotalPages > 0) {
            const pagesToLoad = getPagesToLoad(carCurrentPage, carTotalPages);
            loadCarPages(pagesToLoad);
        }
    }, [carCurrentPage, carTotalPages]);

    useEffect(() => {
        if (activityTotalPages > 0) {
            const pagesToLoad = getPagesToLoad(activityCurrentPage, activityTotalPages);
            loadActivityPages(pagesToLoad);
        }
    }, [activityCurrentPage, activityTotalPages]);

    // Update displayed items when page or cache changes
    useEffect(() => {
        const items = hotelCache.get(hotelCurrentPage) || [];
        setDisplayedHotels(items);
    }, [hotelCurrentPage, hotelCache]);

    useEffect(() => {
        const items = carCache.get(carCurrentPage) || [];
        setDisplayedCars(items);
    }, [carCurrentPage, carCache]);

    useEffect(() => {
        const items = activityCache.get(activityCurrentPage) || [];
        setDisplayedActivities(items);
    }, [activityCurrentPage, activityCache]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Location not found</h2>
                <Button onClick={() => onNavigate("home")}>Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header currentPage="home" onNavigate={onNavigate} />

            {/* Hero Section */}
            <div className="relative h-[400px] w-full">
                <ImageWithFallback
                    src={location.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=400&fit=crop"}
                    alt={location.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{location.name}</h1>
                    <p className="text-lg md:text-xl max-w-2xl">{location.description}</p>
                </div>
                <Button
                    variant="ghost"
                    className="absolute top-24 left-4 text-white hover:bg-white/20"
                    onClick={() => onNavigate("home")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Child Locations Section (if COUNTRY type) */}
                {childLocations.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="h-6 w-6 text-purple-600" />
                            <h2 className="text-2xl font-bold">Cities in {location.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {childLocations.map((city) => (
                                <div
                                    key={city.id}
                                    className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                                    onClick={() => onNavigate("location-detail", { id: city.id })}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <ImageWithFallback
                                            src={city.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop"}
                                            alt={city.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                                            <p className="text-sm text-gray-200 line-clamp-2">{city.description || 'Explore this city'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hotels Section */}
                {hotels.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Hotel className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold">Hotels in {location.name}</h2>
                            </div>
                            <Button
                                onClick={() => onNavigate("hotel-list", { destinationId: locationId, destination: location.name })}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {t('common.viewAll')} →
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {displayedHotels.length === 0 ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                                        <div className="h-48 bg-gray-300" />
                                        <div className="p-4 bg-white">
                                            <div className="h-4 bg-gray-300 rounded mb-2" />
                                            <div className="h-3 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                displayedHotels.map((hotel) => (
                                    <ServiceCard key={hotel.id} service={hotel} onNavigate={onNavigate} />
                                ))
                            )}
                        </div>
                        {hotelTotalPages > 1 && (
                            <PaginationControls
                                currentPage={hotelCurrentPage}
                                totalPages={hotelTotalPages}
                                onPageChange={setHotelCurrentPage}
                            />
                        )}
                    </div>
                )}

                {/* Activities Section */}
                {activities.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Camera className="h-6 w-6 text-green-600" />
                                <h2 className="text-2xl font-bold">Activities in {location.name}</h2>
                            </div>
                            <Button
                                onClick={() => onNavigate("activities", { locationId: locationId })}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {t('common.viewAll')} →
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {displayedActivities.length === 0 ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                                        <div className="h-48 bg-gray-300" />
                                        <div className="p-4 bg-white">
                                            <div className="h-4 bg-gray-300 rounded mb-2" />
                                            <div className="h-3 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                displayedActivities.map((activity) => (
                                    <ServiceCard key={activity.id} service={activity} onNavigate={onNavigate} />
                                ))
                            )}
                        </div>
                        {activityTotalPages > 1 && (
                            <PaginationControls
                                currentPage={activityCurrentPage}
                                totalPages={activityTotalPages}
                                onPageChange={setActivityCurrentPage}
                            />
                        )}
                    </div>
                )}

                {/* Cars Section */}
                {cars.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Car className="h-6 w-6 text-orange-600" />
                                <h2 className="text-2xl font-bold">Car Rentals in {location.name}</h2>
                            </div>
                            <Button
                                onClick={() => onNavigate("car-list", { searchData: { pickupLocationId: locationId, pickupLocation: location.name } })}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {t('common.viewAll')} →
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {displayedCars.length === 0 ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                                        <div className="h-48 bg-gray-300" />
                                        <div className="p-4 bg-white">
                                            <div className="h-4 bg-gray-300 rounded mb-2" />
                                            <div className="h-3 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                displayedCars.map((car) => (
                                    <ServiceCard key={car.id} service={car} onNavigate={onNavigate} />
                                ))
                            )}
                        </div>
                        {carTotalPages > 1 && (
                            <PaginationControls
                                currentPage={carCurrentPage}
                                totalPages={carTotalPages}
                                onPageChange={setCarCurrentPage}
                            />
                        )}
                    </div>
                )}

                {hotels.length === 0 && activities.length === 0 && cars.length === 0 && childLocations.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No services found for this location yet.</p>
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
}

function PaginationControls({ currentPage, totalPages, onPageChange }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
}) {
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
                {currentPage > 2 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
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
                            onClick={() => onPageChange(page)}
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
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>
            
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}

function ServiceCard({ service, onNavigate }: { service: ServiceData, onNavigate: (page: PageType, data?: any) => void }) {
    const handleClick = () => {
        if (service.type === 'hotel') onNavigate("hotel-detail", { id: service.id });
        else if (service.type === 'activity') onNavigate("activity-detail", { id: service.id });
        else if (service.type === 'car') onNavigate("car-detail", { id: service.id });
    };

    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={handleClick}
        >
            <div className="h-48 overflow-hidden">
                <ImageWithFallback
                    src={service.image || "https://via.placeholder.com/400x300"}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate">{service.name}</h3>
                <div className="flex items-center justify-between">
                    {service.price && (
                        <span className="text-blue-600 font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                        </span>
                    )}
                    {service.rating && (
                        <span className="text-sm text-gray-500 flex items-center">
                            ★ {service.rating}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
