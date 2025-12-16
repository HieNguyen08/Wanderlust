import {
  Calendar,
  MapPin,
  Star,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { reviewApi, tokenService } from "../../utils/api";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useSmartPagination } from "../../hooks/useSmartPagination";
import { PaginationUI } from "../ui/PaginationUI";

export type ReviewTargetType = "HOTEL" | "CAR_RENTAL" | "CAR" | "ACTIVITY" | "FLIGHT" | "WEBSITE" | "ALL";
export type VoteType = "HELPFUL" | "NOT_HELPFUL";

type ReviewImage = { url: string; caption?: string };

type ReviewItem = {
  id: string;
  userFullName?: string;
  userAvatar?: string;
  userCity?: string;
  rating?: number;
  title?: string;
  comment?: string;
  detailedRatings?: Record<string, number>;
  images?: ReviewImage[];
  travelDate?: string;
  travelType?: string;
  helpfulCount?: number;
  notHelpfulCount?: number;
  vendorResponse?: string;
  createdAt?: string;
};

type ReviewListProps = {
  targetType: ReviewTargetType;
  targetId?: string;
  title?: string;
  limit?: number;
  showViewAllButton?: boolean;
  sortByRating?: boolean;
};

const travelTypeLabels: Record<string, string> = {
  SOLO: "Đi một mình",
  COUPLE: "Cặp đôi",
  FAMILY: "Gia đình",
  FRIENDS: "Bạn bè",
  BUSINESS: "Công tác",
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN");
};

export function ReviewList({ targetType, targetId, title, limit, showViewAllButton = false, sortByRating = false }: ReviewListProps) {
  // const [reviews, setReviews] = useState<ReviewItem[]>([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, VoteType | null>>({});
  // const [showAllReviews, setShowAllReviews] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const reviewsPerPage = 10;

  const fetchData = async (page: number, size: number) => {
    if (!targetId) return { data: [], totalItems: 0 };
    try {
      const data = await reviewApi.getReviewsByTarget(targetType, targetId, page, size);
      let reviewsData: ReviewItem[] = [];

      if (data && Array.isArray(data.content)) {
        reviewsData = data.content;
      } else if (Array.isArray(data)) {
        reviewsData = data;
      }

      // Sort by rating if requested (client side sort if backend doesn't support)
      // Ideally backend should support sort. For now we sort the page.
      if (sortByRating) {
        reviewsData = reviewsData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return {
        data: reviewsData,
        totalItems: data.totalElements || reviewsData.length
      };
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError(err?.message || "Không thể tải đánh giá");
      return { data: [], totalItems: 0 };
    }
  };

  const {
    currentItems: reviews,
    totalPages,
    currentPage,
    goToPage,
    isLoading: loading,
    totalItems
  } = useSmartPagination({
    fetchData,
    pageSize: limit || 5, // Default review limit per page
    preloadRange: 1
  });

  const averageRating = useMemo(() => {
    // Note: This average rating is only based on CURRENT PAGE reviews if we don't have total stats.
    // Ideally we should get avg rating from hotel details or a separate stats endpoint.
    // For now, if reviews is empty, return 0. 
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const handleVote = async (reviewId: string, voteType: VoteType) => {
    if (!tokenService.isAuthenticated()) {
      toast.info("Vui lòng đăng nhập để bình chọn hữu ích");
      return;
    }
    try {
      const updated = await reviewApi.voteReview(reviewId, voteType);
      // We can't easily update 'reviews' state directly as it's managed by hook.
      // But we can force refresh or just update local vote state visually if needed.
      // However, hook re-fetch might overwrite. 
      // For now, let's just update local vote state map.
      // To update the counters in UI, we might need a way to mutate the list in hook or refetch.
      // Simpler: Just refresh the page data.
      goToPage(currentPage);

      setUserVotes((prev) => ({
        ...prev,
        [reviewId]: prev[reviewId] === voteType ? null : voteType,
      }));
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") {
        toast.info("Vui lòng đăng nhập để bình chọn hữu ích");
        return;
      }
      toast.error(err?.message || "Không thể gửi bình chọn");
    }
  };

  if (!targetId) {
    return null;
  }

  // If using 'limit' prop (e.g. preview 3 reviews), we might want to hide pagination?
  // But typically ReviewList is full list. If it is a preview, we pass limit.
  // If limit is passed and showViewAllButton is true, maybe we behave differently?
  // Current logic: useSmartPagination uses 'limit' as pageSize. 
  // If showViewAllButton is true, maybe we want to show only first page and a button?
  // But refactoring completely to full pagination means users can verify everything.

  return (
    <Card className="p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {title || "Đánh giá từ khách"}
          </h2>
          <p className="text-sm text-gray-500">{totalItems} đánh giá đã duyệt</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-800">{averageRating}/5</span>
        </div>
      </div>

      {loading && reviews.length === 0 && (
        <p className="text-sm text-gray-500">Đang tải đánh giá...</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-gray-600">Chưa có đánh giá nào cho dịch vụ này.</p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4 border border-gray-100">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <ImageWithFallback
                  src={review.userAvatar || "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=U"}
                  alt={review.userFullName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{review.userFullName || "Khách ẩn danh"}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                      {review.userCity && (
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{review.userCity}</span>
                      )}
                      {review.travelDate && (
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(review.travelDate)}</span>
                      )}
                      {review.travelType && (
                        <Badge variant="outline" className="text-xs border-gray-200">
                          {travelTypeLabels[review.travelType] || review.travelType}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    {review.rating && (
                      <span className="text-sm text-gray-700 ml-1">{review.rating}/5</span>
                    )}
                  </div>
                </div>

                {review.title && <p className="text-gray-900 font-medium mt-2">{review.title}</p>}
                {review.comment && <p className="text-gray-700 mt-1">{review.comment}</p>}

                {review.detailedRatings && Object.keys(review.detailedRatings).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(review.detailedRatings).map(([aspect, score]) => (
                      <span key={aspect} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {aspect}: {score}/5
                      </span>
                    ))}
                  </div>
                )}

                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border">
                        <ImageWithFallback src={img.url} alt={img.caption || `Review image ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {review.vendorResponse && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-xs text-gray-500 mb-1">Phản hồi từ đối tác</p>
                    <p className="text-gray-800">{review.vendorResponse}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className={userVotes[review.id] === "HELPFUL" ? "border-blue-500 text-blue-600" : ""}
                    onClick={() => handleVote(review.id, "HELPFUL")}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Hữu ích ({review.helpfulCount ?? 0})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={userVotes[review.id] === "NOT_HELPFUL" ? "border-red-500 text-red-600" : ""}
                    onClick={() => handleVote(review.id, "NOT_HELPFUL")}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Chưa hài lòng ({review.notHelpfulCount ?? 0})
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <PaginationUI
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </Card>
  );
}
