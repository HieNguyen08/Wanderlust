import { useState } from "react";
import { VendorLayout } from "./components/VendorLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Star, Search, MessageSquare } from "lucide-react";
import type { PageType } from "./MainApp";
import { ReplyReviewDialog } from "./components/vendor/ReplyReviewDialog";
import { toast } from "sonner";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const reviews: Review[] = [
    {
      id: "R001",
      customer: "Nguyễn Văn A",
      service: "Deluxe Ocean View",
      rating: 5,
      comment: "Phòng tuyệt vời! View biển đẹp, dịch vụ chuyên nghiệp. Nhân viên rất thân thiện và nhiệt tình. Chắc chắn sẽ quay lại.",
      date: "2 giờ trước",
      hasResponse: false,
    },
    {
      id: "R002",
      customer: "Trần Thị B",
      service: "Premium Suite",
      rating: 4,
      comment: "Rất hài lòng với chất lượng phòng. Giường ngủ thoải mái, phòng tắm sạch sẽ. Chỉ có điều giá hơi cao một chút.",
      date: "5 giờ trước",
      hasResponse: false,
    },
    {
      id: "R003",
      customer: "Lê Văn C",
      service: "Standard Room",
      rating: 5,
      comment: "Giá cả hợp lý, phòng sạch sẽ. Vị trí thuận tiện. Sẽ giới thiệu cho bạn bè.",
      date: "1 ngày trước",
      hasResponse: false,
    },
    {
      id: "R004",
      customer: "Phạm Thị D",
      service: "Family Suite",
      rating: 3,
      comment: "Phòng khá tốt nhưng hơi ồn vào buổi tối. AC hơi yếu. Cần cải thiện thêm.",
      date: "2 ngày trước",
      response: "Cảm ơn quý khách đã góp ý. Chúng tôi sẽ kiểm tra và khắc phục vấn đề AC. Rất mong được đón tiếp quý khách lần sau.",
      responseDate: "1 ngày trước",
      hasResponse: true,
    },
    {
      id: "R005",
      customer: "Hoàng Văn E",
      service: "Presidential Suite",
      rating: 5,
      comment: "Xuất sắc! Phòng sang trọng, dịch vụ 5 sao. Đáng đồng tiền bát gạo. Highly recommended!",
      date: "3 ngày trước",
      response: "Cảm ơn quý khách rất nhiều! Chúng tôi rất vinh dự được phục vụ quý khách. Hy vọng sẽ được đón tiếp quý khách trong thời gian tới!",
      responseDate: "2 ngày trước",
      hasResponse: true,
    },
  ];

  const stats = [
    { label: "Tổng reviews", value: "234", color: "blue" },
    { label: "Chưa phản hồi", value: "3", color: "yellow" },
    { label: "Đánh giá TB", value: "4.9★", color: "yellow" },
    { label: "Tháng này", value: "+23", color: "green" },
  ];

  const ratingDistribution = [
    { stars: 5, count: 187, percentage: 80 },
    { stars: 4, count: 32, percentage: 14 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 1, percentage: 0.4 },
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "pending" && !review.hasResponse) ||
      (activeTab === "responded" && review.hasResponse);
    return matchesSearch && matchesTab;
  });

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = (reviewId: string, reply: string) => {
    // TODO: Call API to send reply
    toast.success(`Đã gửi phản hồi cho review ${reviewId}`);
    console.log("Reply sent:", { reviewId, reply });
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
          <h1 className="text-3xl text-gray-900 mb-2">Quản lý Đánh giá</h1>
          <p className="text-gray-600">Xem và phản hồi đánh giá từ khách hàng</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
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
                  placeholder="Tìm kiếm đánh giá..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Tất cả ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="pending">
                    Chưa phản hồi ({reviews.filter(r => !r.hasResponse).length})
                  </TabsTrigger>
                  <TabsTrigger value="responded">
                    Đã phản hồi ({reviews.filter(r => r.hasResponse).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <div className="space-y-4">
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
                                className={`w-4 h-4 ${
                                  i < review.rating
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
                              <span className="font-medium text-blue-900">Phản hồi của bạn</span>
                            </div>
                            <p className="text-gray-700 mb-2">{review.response}</p>
                            <p className="text-xs text-gray-500">{review.responseDate}</p>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleReply(review)} className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Phản hồi
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
