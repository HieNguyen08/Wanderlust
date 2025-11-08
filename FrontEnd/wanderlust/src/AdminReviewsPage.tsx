import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  Search, CheckCircle, XCircle, Trash2, Star,
  Hotel, Activity, Car, AlertCircle, Eye
} from "lucide-react";
import type { PageType } from "./MainApp";
import { ReviewDetailDialog } from "./components/admin/ReviewDetailDialog";
import { toast } from "sonner";

interface AdminReviewsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

interface Review {
  id: string;
  user: string;
  userImage?: string;
  service: string;
  serviceType: "hotel" | "activity" | "car";
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminReviewsPage({ onNavigate }: AdminReviewsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (review: Review) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleApprove = (review: Review) => {
    toast.success(`Đã duyệt đánh giá ${review.id}`);
    // TODO: Implement approve logic
  };

  const handleReject = (review: Review) => {
    toast.error(`Đã từ chối đánh giá ${review.id}`);
    // TODO: Implement reject logic
  };

  const handleDelete = (review: Review) => {
    toast.error(`Đã xóa đánh giá ${review.id}`);
    // TODO: Implement delete logic
  };

  const reviews: Review[] = [
    {
      id: "R001",
      user: "Nguyễn Văn A",
      service: "JW Marriott Phu Quoc",
      serviceType: "hotel",
      rating: 5,
      comment: "Khách sạn tuyệt vời! Dịch vụ chuyên nghiệp, phòng sạch sẽ, view biển đẹp. Nhân viên rất thân thiện và nhiệt tình. Chắc chắn sẽ quay lại.",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&h=150&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop",
      ],
      date: "2 giờ trước",
      status: "pending",
    },
    {
      id: "R002",
      user: "Trần Thị B",
      service: "InterContinental Danang",
      serviceType: "hotel",
      rating: 4,
      comment: "Phòng đẹp, view biển tuyệt vời. Buffet sáng đa dạng. Giá hơi cao so với chất lượng.",
      date: "5 giờ trước",
      status: "pending",
    },
    {
      id: "R003",
      user: "Lê Văn C",
      service: "Vé VinWonders Nha Trang",
      serviceType: "activity",
      rating: 5,
      comment: "Trải nghiệm tuyệt vời! Trò chơi đa dạng, phù hợp cả gia đình. Giá vé hợp lý.",
      date: "1 ngày trước",
      status: "pending",
    },
    {
      id: "R004",
      user: "Phạm Thị D",
      service: "Toyota Camry 2024",
      serviceType: "car",
      rating: 4,
      comment: "Xe mới, sạch sẽ. Thủ tục thuê nhanh gọn. Tuy nhiên giá thuê hơi cao.",
      date: "2 ngày trước",
      status: "approved",
    },
    {
      id: "R005",
      user: "Hoàng Văn E",
      service: "Vinpearl Nha Trang",
      serviceType: "hotel",
      rating: 3,
      comment: "Tạm ổn nhưng giá hơi cao so với chất lượng. Phòng cần được bảo trì thêm.",
      date: "3 ngày trước",
      status: "approved",
    },
    {
      id: "R006",
      user: "Võ Thị F",
      service: "Tour Thái Lan",
      serviceType: "activity",
      rating: 1,
      comment: "Rất thất vọng. Hướng dẫn viên không chuyên nghiệp, lịch trình không đúng như quảng cáo.",
      date: "5 ngày trước",
      status: "rejected",
    },
  ];

  const stats = [
    { label: "Chờ duyệt", value: "15", color: "yellow", icon: AlertCircle },
    { label: "Đã duyệt", value: "1,234", color: "green", icon: CheckCircle },
    { label: "Từ chối", value: "45", color: "red", icon: XCircle },
    { label: "Đánh giá TB", value: "4.6★", color: "yellow", icon: Star },
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
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>;
      default:
        return null;
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || review.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout currentPage="admin-reviews" onNavigate={onNavigate} activePage="admin-reviews">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Quản lý Đánh giá</h1>
          <p className="text-gray-600">Duyệt và quản lý đánh giá từ khách hàng</p>
        </div>

        {/* Stats */}
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
              placeholder="Tìm kiếm đánh giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">
                Chờ duyệt ({reviews.filter(r => r.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Đã duyệt ({reviews.filter(r => r.status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Từ chối ({reviews.filter(r => r.status === 'rejected').length})
              </TabsTrigger>
              <TabsTrigger value="all">Tất cả ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                          {review.user.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                            <span className="text-sm text-gray-500">đánh giá</span>
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
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
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
                          Chi tiết
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
                              Từ chối
                            </Button>
                            <Button 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleApprove(review)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Duyệt
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
                            Gỡ bỏ
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(review)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
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
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
}
