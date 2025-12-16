import { Edit, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { bookingApi, reviewApi, tokenService } from "../utils/api";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface WebsiteReviewPromptProps {
  className?: string;
}

export function WebsiteReviewPrompt({ className = "" }: WebsiteReviewPromptProps) {
  const { t } = useTranslation();
  const [hasCompletedBookings, setHasCompletedBookings] = useState(false);
  const [hasReviewedWebsite, setHasReviewedWebsite] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    checkUserEligibility();
  }, []);

  const checkUserEligibility = async () => {
    try {
      const token = tokenService.getToken();
      if (!token) {
        return; // User not logged in
      }

      // Check if user has any completed bookings
      const bookingsResponse = await bookingApi.getMyBookings();
      const bookings = Array.isArray(bookingsResponse)
        ? bookingsResponse
        : bookingsResponse?.content ?? [];
      const completedBookings = bookings.filter(
        (booking: any) => booking.status === "COMPLETED"
      );
      
      setHasCompletedBookings(completedBookings.length > 0);

      if (completedBookings.length > 0) {
        // Check if user already reviewed the website
        const myReviewsResponse = await reviewApi.getMyReviews();
        const myReviews = Array.isArray(myReviewsResponse)
          ? myReviewsResponse
          : myReviewsResponse?.content ?? [];
        const websiteReview = myReviews.find(
          (review: any) => review.targetType === "WEBSITE"
        );
        
        if (websiteReview) {
          setHasReviewedWebsite(true);
          setExistingReview(websiteReview);
          // Pre-fill form with existing review
          setRating(websiteReview.rating);
          setTitle(websiteReview.title || "");
          setComment(websiteReview.comment || "");
        }
      }
    } catch (error) {
      console.error("Error checking user eligibility for website review:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert(t("reviews.pleaseSelectRating") || "Vui lòng chọn đánh giá từ 1-5 sao");
      return;
    }

    if (!title.trim()) {
      alert(t("reviews.pleaseFillTitle") || "Vui lòng nhập tiêu đề đánh giá");
      return;
    }

    if (!comment.trim()) {
      alert(t("reviews.pleaseFillComment") || "Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setIsSubmitting(true);

      if (hasReviewedWebsite && existingReview) {
        // Update existing review
        await reviewApi.updateReview(existingReview.id, {
          rating,
          title,
          comment,
        });
        alert(t("reviews.updateSuccess") || "Cập nhật đánh giá thành công!");
      } else {
        // Create new review for website
        // We need to get any completed booking ID to associate with the review
        const bookingsResponse = await bookingApi.getMyBookings();
        const bookings = Array.isArray(bookingsResponse)
          ? bookingsResponse
          : bookingsResponse?.content ?? [];
        const completedBooking = bookings.find(
          (booking: any) => booking.status === "COMPLETED"
        );

        if (!completedBooking) {
          alert(t("reviews.noCompletedBookings") || "Không tìm thấy booking đã hoàn thành");
          return;
        }

        await reviewApi.createReview({
          bookingId: completedBooking.id,
          targetType: "WEBSITE",
          targetId: "WANDERLUST",
          rating,
          title,
          comment,
        });
        alert(t("reviews.createSuccess") || "Gửi đánh giá thành công!");
      }

      setIsDialogOpen(false);
      // Refresh eligibility to update button state
      await checkUserEligibility();
      
      // Reload page to show new review in the list
      window.location.reload();
    } catch (error: any) {
      console.error("Error submitting website review:", error);
      alert(error.message || (t("reviews.submitError") || "Có lỗi xảy ra khi gửi đánh giá"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Don't render if user hasn't completed any bookings
  if (!hasCompletedBookings) {
    return null;
  }

  return (
    <>
      <div className={`flex justify-center ${className}`}>
        {hasReviewedWebsite ? (
          <Button
            onClick={handleOpenDialog}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all"
          >
            <Edit className="w-5 h-5 mr-2" />
            {t("reviews.updateWebsiteReview") || "Cập nhật đánh giá của bạn"}
          </Button>
        ) : (
          <Button
            onClick={handleOpenDialog}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all animate-pulse"
          >
            <Star className="w-5 h-5 mr-2 fill-white" />
            {t("reviews.rateWebsite") || "Đánh giá trải nghiệm của bạn"}
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {hasReviewedWebsite
                ? (t("reviews.updateWebsiteReview") || "Cập nhật đánh giá")
                : (t("reviews.rateWebsite") || "Đánh giá trải nghiệm của bạn")}
            </DialogTitle>
            <DialogDescription>
              {t("reviews.websiteReviewDesc") || 
                "Chia sẻ trải nghiệm sử dụng Wanderlust của bạn để chúng tôi có thể phục vụ tốt hơn!"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("reviews.overallRating") || "Đánh giá tổng quan"} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-semibold">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("reviews.reviewTitle") || "Tiêu đề"} <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("reviews.titlePlaceholder") || "Ví dụ: Trải nghiệm tuyệt vời!"}
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("reviews.yourReview") || "Đánh giá của bạn"} <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("reviews.commentPlaceholder") || "Chia sẻ trải nghiệm của bạn về dịch vụ, giao diện, tính năng..."}
                rows={6}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 text-right">
                {comment.length}/1000
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              {t("common.cancel") || "Hủy"}
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
            >
              {isSubmitting ? (
                t("common.submitting") || "Đang gửi..."
              ) : hasReviewedWebsite ? (
                t("common.update") || "Cập nhật"
              ) : (
                t("common.submit") || "Gửi đánh giá"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
