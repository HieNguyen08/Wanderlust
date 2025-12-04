import {
  CheckCircle,
  Clock,
  Dumbbell,
  Eye,
  Heart, MapPin,
  ParkingCircle,
  Share2,
  Star,
  Utensils,
  Wifi,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { PageType } from "../../MainApp";
import { type FrontendRole } from "../../utils/roleMapper";

interface SavedItemsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: FrontendRole | null;
  onLogout?: () => void;
}

interface SavedItem {
  id: string;
  type: "hotel" | "activity" | "destination";
  title: string;
  location: string;
  image: string;
  price?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  savedDate: string;
  // Additional details for dialog
  images?: string[];
  amenities?: string[];
  highlights?: string[];
  availability?: boolean;
  duration?: string;
  included?: string[];
  excluded?: string[];
}

export default function SavedItemsPage({ onNavigate, userRole, onLogout }: SavedItemsPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const loadSavedItems = () => {
      try {
        const stored = localStorage.getItem('saved_items');
        if (stored) {
          setSavedItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load saved items:', error);
      }
    };

    loadSavedItems();

    // Listen for storage events
    window.addEventListener('storage', loadSavedItems);
    return () => window.removeEventListener('storage', loadSavedItems);
  }, []);

  const handleRemove = (id: string) => {
    const newItems = savedItems.filter(item => item.id !== id);
    setSavedItems(newItems);
    localStorage.setItem('saved_items', JSON.stringify(newItems));
    toast.success(t('profile.savedItems.removed', 'Đã xóa khỏi danh sách đã lưu'));
  };

  const handleViewDetails = (item: SavedItem) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleShare = (item: SavedItem) => {
    // Mock share functionality
    alert(`Chia sẻ: ${item.title}`);
  };

  const filteredItems = activeTab === "all"
    ? savedItems
    : savedItems.filter(item => item.type === activeTab);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hotel": return t('profile.savedItems.hotel', 'Khách sạn');
      case "activity": return t('profile.savedItems.activity', 'Hoạt động');
      case "destination": return t('profile.savedItems.destination', 'Điểm đến');
      default: return "";
    }
  };

  return (
    <ProfileLayout currentPage="saved-items" onNavigate={onNavigate} activePage="saved" userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('profile.savedItems.title')}</h1>
          <p className="text-gray-600">
            {t('profile.savedItems.subtitle')} ({savedItems.length} {t('profile.savedItems.items', 'mục')})
          </p>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-xl">
              <TabsTrigger value="all">{t('profile.savedItems.all')} ({savedItems.length})</TabsTrigger>
              <TabsTrigger value="hotel">{t('profile.savedItems.hotel', 'Khách sạn')} ({savedItems.filter(i => i.type === 'hotel').length})</TabsTrigger>
              <TabsTrigger value="activity">{t('profile.savedItems.activity', 'Hoạt động')} ({savedItems.filter(i => i.type === 'activity').length})</TabsTrigger>
              <TabsTrigger value="destination">{t('profile.savedItems.destination', 'Điểm đến')} ({savedItems.filter(i => i.type === 'destination').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">{t('profile.savedItems.noItemsTitle')}</p>
                  <p className="text-gray-400 mb-6">
                    {t('profile.savedItems.noItemsDesc', 'Lưu các địa điểm và dịch vụ yêu thích để dễ dàng tìm lại sau này')}
                  </p>
                  <Button onClick={() => onNavigate("home")}>
                    {t('profile.savedItems.exploreNow')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors z-10"
                        >
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </button>
                        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white/90">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>

                        <h3 className="text-lg text-gray-900 mb-2 line-clamp-1">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        )}

                        {item.rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{item.rating}</span>
                            </div>
                            <span className="text-sm text-gray-600">({item.reviews} {t('profile.savedItems.reviews', 'đánh giá')})</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t">
                          {item.price ? (
                            <div>
                              <p className="text-xl text-blue-600">
                                {item.price.toLocaleString('vi-VN')}đ
                              </p>
                              {item.type === "hotel" && (
                                <p className="text-sm text-gray-600">{t('profile.savedItems.perNight')}</p>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              {t('profile.savedItems.savedOn', 'Đã lưu')} {new Date(item.savedDate).toLocaleDateString('vi-VN')}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare(item)}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {t('profile.savedItems.viewDetails', 'Xem chi tiết')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedItem?.title}</span>
              {selectedItem && (
                <Badge variant="outline">
                  {getTypeLabel(selectedItem.type)}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" />
              {selectedItem?.location}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              {/* Images Gallery */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 row-span-2">
                    <ImageWithFallback
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  {selectedItem.images.slice(1, 3).map((img, idx) => (
                    <div key={idx}>
                      <ImageWithFallback
                        src={img}
                        alt={`${selectedItem.title} ${idx + 2}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Rating & Price */}
              <div className="flex items-center justify-between">
                {selectedItem.rating && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl">{selectedItem.rating}</span>
                    </div>
                    <span className="text-gray-600">({selectedItem.reviews} {t('profile.savedItems.reviews', 'đánh giá')})</span>
                  </div>
                )}
                {selectedItem.price && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('profile.savedItems.priceFrom', 'Giá từ')}</p>
                    <p className="text-3xl text-blue-600">
                      {selectedItem.price.toLocaleString('vi-VN')}đ
                    </p>
                    {selectedItem.type === "hotel" && (
                      <p className="text-sm text-gray-600">{t('profile.savedItems.perNight')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="mb-2 text-gray-900">{t('profile.savedItems.description', 'Mô tả')}</h4>
                <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Hotel Amenities */}
              {selectedItem.amenities && selectedItem.amenities.length > 0 && (
                <div>
                  <h4 className="mb-3 text-gray-900">{t('savedItems.amenities')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedItem.amenities.map((amenity, idx) => {
                      const icons: Record<string, any> = {
                        "Wifi": Wifi,
                        "Bể bơi": <span>🏊</span>,
                        "Spa": <span>💆</span>,
                        "Nhà hàng": Utensils,
                        "Gym": Dumbbell,
                        "Bãi đỗ xe": ParkingCircle,
                        "Kids Club": <span>👶</span>,
                        "Bãi biển": <span>🏖️</span>,
                      };

                      const IconComponent = Object.keys(icons).find(key => amenity.includes(key));
                      const Icon = IconComponent ? icons[IconComponent] : CheckCircle;

                      return (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          {typeof Icon === 'object' ? Icon : <Icon className="w-5 h-5 text-blue-600" />}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activity Duration */}
              {selectedItem.duration && (
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t('savedItems.duration')}</p>
                    <p className="text-gray-900">{selectedItem.duration}</p>
                  </div>
                </div>
              )}

              {/* Included/Excluded */}
              {(selectedItem.included || selectedItem.excluded) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedItem.included && selectedItem.included.length > 0 && (
                    <Card className="p-4 bg-green-50 border-green-200">
                      <h4 className="mb-3 flex items-center gap-2 text-green-900">
                        <CheckCircle className="w-5 h-5" />
                        {t('savedItems.included')}
                      </h4>
                      <ul className="space-y-2">
                        {selectedItem.included.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-green-900">
                            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {selectedItem.excluded && selectedItem.excluded.length > 0 && (
                    <Card className="p-4 bg-red-50 border-red-200">
                      <h4 className="mb-3 flex items-center gap-2 text-red-900">
                        <X className="w-5 h-5" />
                        {t('savedItems.notIncluded')}
                      </h4>
                      <ul className="space-y-2">
                        {selectedItem.excluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              )}

              {/* Destination Highlights */}
              {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                <div>
                  <h4 className="mb-3 text-gray-900">{t('savedItems.highlights')}</h4>
                  <ul className="space-y-3">
                    {selectedItem.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Availability */}
              {selectedItem.availability !== undefined && (
                <Card className={`p-4 ${selectedItem.availability ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {selectedItem.availability ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-900">{t('savedItems.available')}</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-red-600" />
                        <span className="text-red-900">{t('savedItems.soldOut')}</span>
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => selectedItem && handleRemove(selectedItem.id)}
              className="gap-2"
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              {t('profile.savedItems.unsave')}
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedItem && handleShare(selectedItem)}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {t('profile.savedItems.share')}
            </Button>
            <Button onClick={() => {
              // Navigate to appropriate page based on type
              if (selectedItem?.type === "hotel") {
                onNavigate("hotel-detail", { id: selectedItem.id });
              } else if (selectedItem?.type === "activity") {
                onNavigate("activity-detail", { id: selectedItem.id });
              }
              setIsDetailDialogOpen(false);
            }}>
              {t('profile.savedItems.bookNow')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
}
