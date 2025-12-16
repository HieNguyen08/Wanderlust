import {
  Activity,
  AlertCircle,
  Car,
  CheckCircle,
  Eye,
  Hotel,
  Search,
  Star,
  Trash2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import type { PageType } from "../../MainApp";
import { AdminLayout } from "../../components/AdminLayout";
import { ReviewDetailDialog } from "../../components/admin/ReviewDetailDialog";
import { PaginationUI } from "../../components/ui/PaginationUI";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useSmartPagination } from "../../hooks/useSmartPagination";
import { reviewApi } from "../../utils/api";

interface AdminReviewsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface Review {
  id: string;
  user: string;
  userImage?: string;
  service: string;
  serviceType: "hotel" | "activity" | "car" | "flight" | "other";
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminReviewsPage({ onNavigate }: AdminReviewsPageProps) {
  const { t } = useTranslation();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    items: reviews,
    loading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    pagination,
    handlePageChange,
    reloadItems: reloadReviews,
    totalElements // optional if we want to use it for counts
  } = useSmartPagination<Review>({
    key: 'admin-reviews',
    fetchData: async (page, size, query, tab) => {
      const apiStatus = tab === 'all' ? '' : tab;
      const response = await reviewApi.getAllReviewsForAdmin({
        page,
        size,
        search: query,
        status: apiStatus
      });

      const content = response?.content ?? [];
      const mappedItems = content.map((review: any) => {
        const status = (review.status || '').toString().toLowerCase();
        const targetType = (review.targetType || 'hotel').toString().toLowerCase();
        const serviceLabel = review.targetName || review.title || `${review.targetType || ''} ${review.targetId || ''}`;
        return {
          id: review.id || review.reviewId,
          user: review.userFullName || review.user || 'Ẩn danh',
          userImage: review.userAvatar,
          service: serviceLabel,
          serviceType: ['hotel', 'activity', 'car', 'flight'].includes(targetType) ? (targetType as any) : 'other',
          rating: review.rating || 0,
          comment: review.comment || review.content || '',
          images: (review.images || []).map((img: any) => img?.url || img).filter(Boolean),
          date: review.createdAt || review.updatedAt || new Date().toISOString(),
          status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending',
        } as Review;
      });

      return {
        items: mappedItems,
        total: response?.totalElements ?? mappedItems.length,
        totalPages: response?.totalPages ?? 1
      };
    },
    defaultTab: 'pending'
  });

  const displayReviews = reviews || [];

  // Note: Counts are tricky with server-side pagination. 
  // We either need a separate stats endpoint or accept that we don't know the exact counts of other tabs.
  // For now, we can show '...' or remove counts, OR use totalElements when that tab is active.
  const counts = { pending: '...', approved: '...', rejected: '...' };

  const handleViewDetail = (review: Review) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleApprove = async (review: Review) => {
    try {
      await reviewApi.moderateReview(review.id, {
        status: 'APPROVED',
        moderatorNotes: 'Approved by admin',
      });
      toast.success(t('admin.reviewApproved', { id: review.id }));
      reloadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error(t('admin.cannotApproveReview'));
    }
  };

  const handleReject = async (review: Review) => {
    try {
      await reviewApi.moderateReview(review.id, {
        status: 'REJECTED',
        moderatorNotes: 'Rejected by admin'
      });
      toast.error(t('admin.reviewRejected', { id: review.id }));
      reloadReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error(t('admin.cannotRejectReview'));
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(t('admin.confirmDeleteReview'))) return;

    try {
      await reviewApi.deleteReviewByAdmin(review.id);
      toast.success(t('admin.reviewDeleted', { id: review.id }));
      reloadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(t('admin.cannotDeleteReview'));
    }
  };

  const stats = [
    { label: t('admin.pendingReviews'), value: counts.pending.toString(), color: "yellow", icon: AlertCircle },
    { label: t('admin.approvedReviews'), value: counts.approved.toString(), color: "green", icon: CheckCircle },
    { label: t('admin.rejectedReviews'), value: counts.rejected.toString(), color: "red", icon: XCircle },
    { label: t('admin.averageRating'), value: `~`, color: "yellow", icon: Star },
  ];

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return <Hotel className="w-4 h-4" />;
      case "activity":
        return <Activity className="w-4 h-4" />;
      case "car":
        return <Car className="w-4 h-4" />;
      default:
        return null; // Flight icon not imported yet?
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{t('admin.pending')}</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-700">{t('admin.approved')}</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">{t('admin.rejected')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="admin-reviews" onNavigate={onNavigate} activePage="admin-reviews">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('admin.manageReviews')}</h1>
          <p className="text-gray-600">{t('admin.manageReviewsDesc')}</p>
        </div>

        {/* Stats - Reduced functionality as we don't have global stats endpoint yet */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Search & Tabs */}
        <Card className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t('admin.searchReviews')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">{t('admin.pending')}</TabsTrigger>
              <TabsTrigger value="approved">{t('admin.approved')}</TabsTrigger>
              <TabsTrigger value="rejected">{t('admin.rejected')}</TabsTrigger>
              <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {loading && <p className="text-sm text-gray-500">{t('common.loading')}</p>}
                {!loading && displayReviews.length === 0 && (
                  <p className="text-sm text-gray-600">{t('admin.noReviews')}</p>
                )}
                {displayReviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold shrink-0">
                          {review.user ? review.user.charAt(0) : 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                            <span className="text-sm text-gray-500">{t('admin.reviewed')}</span>
                            <div className="flex items-center gap-1">
                              {getServiceTypeIcon(review.serviceType)}
                              <span className="text-sm font-medium text-gray-700">
                                {review.service}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
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
                            <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.map((img, i) => (
                                <div key={i} className="w-24 h-20 rounded-lg overflow-hidden">
                                  <ImageWithFallback
                                    src={img}
                                    alt={`Review image ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(review.status)}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">ID: {review.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleViewDetail(review)}
                        >
                          <Eye className="w-4 h-4" />
                          {t('common.details')}
                        </Button>
                        {review.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-red-600 hover:text-red-700"
                              onClick={() => handleReject(review)}
                            >
                              <XCircle className="w-4 h-4" />
                              {t('admin.reject')}
                            </Button>
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => handleApprove(review)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              {t('admin.approve')}
                            </Button>
                          </>
                        )}
                        {review.status === "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-red-600 hover:text-red-700"
                            onClick={() => handleReject(review)}
                          >
                            <XCircle className="w-4 h-4" />
                            {t('admin.remove')}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(review)}
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <PaginationUI
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Review Detail Dialog */}
      <ReviewDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        review={selectedReview}
        onApprove={async (r) => { await handleApprove(r); setIsDetailOpen(false); }}
        onReject={async (r) => { await handleReject(r); setIsDetailOpen(false); }}
        onDelete={async (r) => { await handleDelete(r); setIsDetailOpen(false); }}
      />
    </AdminLayout>
  );
}
