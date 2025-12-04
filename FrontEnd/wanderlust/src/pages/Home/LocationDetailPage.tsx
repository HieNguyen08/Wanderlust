import { ArrowLeft, Camera, Car, Hotel } from "lucide-react";
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
}

interface ServiceData {
    id: string;
    name: string;
    image: string;
    price?: number;
    rating?: number;
    type: 'hotel' | 'car' | 'activity';
}

export default function LocationDetailPage({ locationId, onNavigate }: LocationDetailPageProps) {
    const { t } = useTranslation();
    const [location, setLocation] = useState<LocationData | null>(null);
    const [hotels, setHotels] = useState<ServiceData[]>([]);
    const [cars, setCars] = useState<ServiceData[]>([]);
    const [activities, setActivities] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch location details
                const locData = await locationApi.getLocationById(locationId);
                setLocation(locData);

                // Fetch related services
                const [hotelsRes, carsRes, activitiesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/hotels?location=${locationId}`),
                    fetch(`${API_BASE_URL}/api/car-rentals?locationId=${locationId}`),
                    fetch(`${API_BASE_URL}/api/activities?locationId=${locationId}`)
                ]);

                if (hotelsRes.ok) {
                    const data = await hotelsRes.json();
                    setHotels(data.map((h: any) => ({ ...h, type: 'hotel', image: h.images?.[0] || h.image })));
                }
                if (carsRes.ok) {
                    const data = await carsRes.json();
                    setCars(data.map((c: any) => ({ ...c, type: 'car', image: c.image })));
                }
                if (activitiesRes.ok) {
                    const data = await activitiesRes.json();
                    setActivities(data.map((a: any) => ({ ...a, type: 'activity', image: a.image })));
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
            <Header onNavigate={onNavigate} />

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

                {/* Hotels Section */}
                {hotels.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Hotel className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold">Hotels in {location.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {hotels.map((hotel) => (
                                <ServiceCard key={hotel.id} service={hotel} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Activities Section */}
                {activities.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Camera className="h-6 w-6 text-green-600" />
                            <h2 className="text-2xl font-bold">Activities in {location.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {activities.map((activity) => (
                                <ServiceCard key={activity.id} service={activity} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Cars Section */}
                {cars.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Car className="h-6 w-6 text-orange-600" />
                            <h2 className="text-2xl font-bold">Car Rentals in {location.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {cars.map((car) => (
                                <ServiceCard key={car.id} service={car} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                )}

                {hotels.length === 0 && activities.length === 0 && cars.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No services found for this location yet.</p>
                    </div>
                )}

            </div>
            <Footer />
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
