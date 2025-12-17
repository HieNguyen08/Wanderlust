import { MessageSquare, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { VendorLayout } from "../../components/VendorLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ReplyReviewDialog } from "../../components/vendor/ReplyReviewDialog";
import { replyReviewDialog } from "../../components/vendor/ReplyReviewDialog"; // Import might be wrong case, let's keep original if valid, or fix it.
// Actually just adding useSmartPagination
import { useSmartPagination } from "../../hooks/useSmartPagination";
import { PaginationUI } from "../../components/ui/PaginationUI";
import { reviewApi, tokenService, vendorApi } from "../../utils/api";
import { useCallback } from "react";

interface VendorReviewsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  vendorType?: "hotel" | "activity" | "car" | "airline";
}

interface Review {
  id: string;
  customer: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  responseDate?: string;
  hasResponse: boolean;
}

export default function VendorReviewsPage({
  onNavigate,
  vendorType = "hotel"
}: VendorReviewsPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  // const [loading, setLoading] = useState(true); // Handled by hook
  // const [reviews, setReviews] = useState<Review[]>([]); // Handled by hook

  // Statistics state
  const [vendorStats, setVendorStats] = useState({
    totalReviews: 0,
    unanswered: 0,
    averageRating: "0.0"
  });

  const fetchData = useCallback(async (page: number, size: number) => {
    const vendorId = tokenService.getUserData()?.id;
    if (!vendorId) return { items: [], total: 0 };

    try {
      const data = await vendorApi.getVendorReviews(vendorId, {
        page,
        size,
        search: searchQuery,
        status: activeTab === 'all' ? undefined : activeTab
      });

      // Backend returns Page<ReviewCommentDTO> or mapped equivalent from api.ts
      // api.ts returns response.json(). 
      // Wait, I updated api.ts to return { content, totalElements, totalPages }?
      // NO, I updated `api.ts` for REVIEWS to return `response.json()` directly from `ResponseEntity<Page>`.
      // So data structure is { content: [...], totalElements: ..., ... }

      const mapped = (data.content || []).map((r: any) => ({
        id: r.id,
        customer: r.userFullName || r.user || "Ẩn danh",
        service: r.targetName || `${r.targetType || ''} ${r.targetId || ''}`,
        rating: r.rating || 0,
        comment: r.content || r.comment || r.title || "", // Backend DTO likely uses 'content' not 'comment'
        date: r.createdAt || r.updatedAt || "",
        response: r.vendorResponse,
        responseDate: r.vendorRespondedAt,
        hasResponse: Boolean(r.vendorResponse),
      }));

      return {
        data: mapped,
        totalItems: data.totalElements || 0
      };
    } catch (error) {
      console.error(error);
      toast.error(t('vendor.cannotLoadReviews'));
      return { data: [], totalItems: 0 };
    }
  }, [searchQuery, activeTab, t]);

  const {
    currentItems: reviews,
    isLoading: loading,
    goToPage,
    currentPage,
    totalPages,
    refresh: reloadReviews
  } = useSmartPagination({
    fetchData,
    initialPageSize: 10
  });

  // Reset page on filter change
  useEffect(() => {
    goToPage(0);
  }, [searchQuery, activeTab]);

  // Fetch vendor review statistics
  useEffect(() => {
    const loadVendorStats = async () => {
      const vendorId = tokenService.getUserData()?.id;
      if (!vendorId) return;

      try {
        const data = await reviewApi.getVendorStats(vendorId);
        setVendorStats({
          totalReviews: data.totalReviews || 0,
          unanswered: data.unrespondedCount || 0,
          averageRating: Number(data.averageRating || 0).toFixed(1)
        });
      } catch (error) {
        console.error("Failed to load vendor stats:", error);
      }
    };
    loadVendorStats();
  }, []);

  const stats = [
    { label: t('vendor.totalReviews'), value: vendorStats.totalReviews.toString(), color: "blue" },
    { label: t('vendor.unanswered'), value: vendorStats.unanswered.toString(), color: "yellow" },
    { label: t('vendor.averageRating'), value: `${vendorStats.averageRating}★`, color: "yellow" },
  ];

  const ratingDistribution = [1, 2, 3, 4, 5].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating || 0) === stars).length;
    const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percentage };
  }).reverse();

  // Client-side filtering removed
  const filteredReviews = reviews;

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = async (reviewId: string, reply: string) => {
    try {
      await reviewApi.respondToReview(reviewId, reply);
      toast.success(`${t('vendor.replySent')} ${reviewId}`);
      reloadReviews();
    } catch (error) {
      toast.error(t('vendor.cannotSendReply'));
    }
  };

  return (
    <VendorLayout
      currentPage="vendor-reviews"
      onNavigate={onNavigate}
      activePage="vendor-reviews"
      vendorType={vendorType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('vendor.manageReviews')}</h1>
          <p className="text-gray-600">{t('vendor.manageReviewsDesc')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('vendor.ratingDistribution')}</h3>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="font-medium text-gray-900">{item.stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('vendor.searchReviews')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">{t('common.all')} ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="pending">
                    {t('vendor.unanswered')} ({vendorStats.unanswered})
                  </TabsTrigger>
                  <TabsTrigger value="responded">
                    {t('vendor.responded')} ({vendorStats.totalReviews - vendorStats.unanswered})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <div className="space-y-4">
                    {loading && <p className="text-sm text-gray-500">{t('common.loading')}</p>}
                    {!loading && filteredReviews.length === 0 && (
                      <p className="text-sm text-gray-600">{t('vendor.noReviews')}</p>
                    )}
                    {filteredReviews.map((review) => (
                      <Card key={review.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.customer}</h4>
                            <p className="text-sm text-gray-600">{review.service}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <p className="text-xs text-gray-500 mb-4">{review.date}</p>

                        {review.hasResponse ? (
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">{t('common.yourReply')}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{review.response}</p>
                            <p className="text-xs text-gray-500">{review.responseDate}</p>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleReply(review)} className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {t('common.reply')}
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex justify-center">
                <PaginationUI
                  currentPage={currentPage + 1}
                  totalPages={totalPages}
                  onPageChange={(p) => goToPage(p - 1)}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Reply Dialog */}
        <ReplyReviewDialog
          review={selectedReview}
          isOpen={isReplyDialogOpen}
          onClose={() => setIsReplyDialogOpen(false)}
          onSend={handleSendReply}
        />
      </div>
    </VendorLayout>
  );
}
