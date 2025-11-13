import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Star, Send } from "lucide-react";

interface Review {
  id: string;
  customer: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReplyReviewDialogProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (reviewId: string, reply: string) => void;
}

export function ReplyReviewDialog({
  review,
  isOpen,
  onClose,
  onSend,
}: ReplyReviewDialogProps) {
  const [reply, setReply] = useState("");

  const handleSend = () => {
    if (review && reply.trim()) {
      onSend(review.id, reply);
      setReply("");
      onClose();
    }
  };

  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá</DialogTitle>
          <DialogDescription>
            Gửi phản hồi đến {review.customer}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Original Review */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
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
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>

          {/* Reply Input */}
          <div>
            <Label htmlFor="reply">Phản hồi của bạn</Label>
            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Cảm ơn quý khách đã đánh giá. Chúng tôi rất vui khi..."
              className="mt-1 min-h-[120px]"
              rows={5}
            />
            <p className="text-sm text-gray-500 mt-2">
              {reply.length}/500 ký tự
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Gợi ý phản hồi:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Cảm ơn khách hàng đã dành thời gian đánh giá</li>
              <li>• Giải thích hoặc xin lỗi nếu có vấn đề</li>
              <li>• Mời khách hàng quay lại trong tương lai</li>
              <li>• Giữ thái độ chuyên nghiệp và thân thiện</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!reply.trim()}
              className="flex-1 gap-2"
            >
              <Send className="w-4 h-4" />
              Gửi phản hồi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
