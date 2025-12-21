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
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, VoteType | null>>({});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const fetchReviews = async () => {
    if (!targetId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await reviewApi.getReviewsByTarget(targetType, targetId);
      let reviewsData = Array.isArray(data) ? data : [];

      // Sort by rating if requested
      if (sortByRating) {
        reviewsData = reviewsData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setReviews(reviewsData);
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError(err?.message || "Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, targetType]);

  const averageRating = useMemo(() => {
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
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
              ...r,
              helpfulCount: updated?.helpfulCount ?? r.helpfulCount ?? 0,
              notHelpfulCount: updated?.notHelpfulCount ?? r.notHelpfulCount ?? 0,
            }
            : r
        )
      );
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

  const visibleReviews = useMemo(() => {
    if (showAllReviews) {
      const startIndex = (currentPage - 1) * reviewsPerPage;
      const endIndex = startIndex + reviewsPerPage;
      return reviews.slice(startIndex, endIndex);
    }
    return limit ? reviews.slice(0, limit) : reviews;
  }, [reviews, limit, showAllReviews, currentPage]);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <Card className="p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {title || "Đánh giá từ khách"}
          </h2>
          <p className="text-sm text-gray-500">{reviews.length} đánh giá đã duyệt</p>
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

      {loading && (
        <p className="text-sm text-gray-500">Đang tải đánh giá...</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-gray-600">Chưa có đánh giá nào cho dịch vụ này.</p>
      )}

      <div className="space-y-4">
        {visibleReviews.map((review) => (
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

      {/* View All Button and Pagination */}
      {showViewAllButton && !showAllReviews && reviews.length > (limit || 0) && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setShowAllReviews(true)}
            variant="outline"
            size="lg"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Xem tất cả {reviews.length} đánh giá
          </Button>
        </div>
      )}

      {/* Pagination Controls with Page Numbers */}
      {showAllReviews && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            ««
          </Button>
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            «
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={currentPage === pageNum ? "bg-blue-600" : ""}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            »
          </Button>
          <Button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            »»
          </Button>
        </div>
      )}
    </Card>
  );
}
