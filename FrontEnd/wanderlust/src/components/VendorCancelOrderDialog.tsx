import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface VendorCancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    customerName: string;
    serviceName: string;
    amount: number;
  };
  onConfirm: (reason: string) => void;
}

export function VendorCancelOrderDialog({
  open,
  onOpenChange,
  order,
  onConfirm,
}: VendorCancelOrderDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [step, setStep] = useState<"warning" | "reason" | "confirm">("warning");

  const predefinedReasons = [
    "Dịch vụ không khả dụng do sự cố bất ngờ",
    "Vượt quá khả năng phục vụ",
    "Điều kiện thời tiết không cho phép",
    "Vấn đề về nhân sự",
    "Lý do khác",
  ];

  const handleNext = () => {
    if (step === "warning") {
      setStep("reason");
    } else if (step === "reason" && (selectedReason || customReason)) {
      setStep("confirm");
    }
  };

  const handleConfirmCancel = () => {
    const finalReason = selectedReason === "Lý do khác" ? customReason : selectedReason;
    onConfirm(finalReason);
    // Reset state
    setStep("warning");
    setSelectedReason("");
    setCustomReason("");
  };

  const handleClose = () => {
    setStep("warning");
    setSelectedReason("");
    setCustomReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {step === "warning" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                Cảnh báo: Hủy đơn hàng
              </DialogTitle>
              <DialogDescription>
                Bạn đang thực hiện hành động HỦY ĐỢN HÀNG. Vui lòng đọc kỹ các thông tin bên dưới.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Order Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm mb-3 text-gray-900">Thông tin đơn hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn:</span>
                    <span className="text-gray-900">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Khách hàng:</span>
                    <span className="text-gray-900">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dịch vụ:</span>
                    <span className="text-gray-900">{order.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="text-xl text-blue-600">{order.amount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <AlertDescription className="text-red-900">
                  <p className="mb-3">Hậu quả khi hủy đơn:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span><strong>Bạn sẽ bị ghi nhận 1 VI PHẠM</strong> trong hệ thống</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Khách hàng sẽ được <strong>hoàn 100% số tiền</strong> ({order.amount.toLocaleString('vi-VN')}đ)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Khách hàng sẽ nhận được thông báo <strong>NGAY LẬP TỨC</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Uy tín của bạn có thể bị ảnh hưởng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Nhiều vi phạm có thể dẫn đến <strong>TẠM NGƯNG TÀI KHOẢN</strong></span>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Refund Process */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm mb-3 text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  Quy trình hoàn tiền
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</div>
                    <span>Hệ thống tự động thông báo cho khách hàng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</div>
                    <span>Tạo yêu cầu hoàn tiền khẩn cấp gửi Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</div>
                    <span>Admin duyệt và hoàn tiền vào Ví khách hàng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">4</div>
                    <span>Khách hàng nhận tiền trong 1-3 ngày làm việc</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Không, giữ đơn hàng
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-red-600 hover:bg-red-700"
              >
                Tôi hiểu, tiếp tục hủy
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "reason" && (
          <>
            <DialogHeader>
              <DialogTitle>Lý do hủy đơn</DialogTitle>
              <DialogDescription>
                Vui lòng chọn hoặc nhập lý do hủy đơn hàng. Thông tin này sẽ được gửi cho khách hàng.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-3">
                {predefinedReasons.map((reason) => (
                  <div
                    key={reason}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedReason === reason
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedReason(reason)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedReason === reason
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedReason === reason && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-gray-900">{reason}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedReason === "Lý do khác" && (
                <div>
                  <label className="block text-sm mb-2 text-gray-900">
                    Nhập lý do cụ thể <span className="text-red-600">*</span>
                  </label>
                  <Textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết lý do hủy đơn..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("warning")}>
                Quay lại
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!selectedReason || (selectedReason === "Lý do khác" && !customReason)}
              >
                Tiếp tục
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-600">Xác nhận hủy đơn hàng</DialogTitle>
              <DialogDescription>
                Đây là bước cuối cùng. Vui lòng kiểm tra lại thông tin trước khi xác nhận.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <AlertDescription className="text-yellow-900">
                  <strong>Lưu ý:</strong> Hành động này KHÔNG THỂ HOÀN TÁC. Khách hàng sẽ nhận được thông báo ngay lập tức.
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Đơn hàng:</span>
                  <p className="text-gray-900">{order.id} - {order.serviceName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Khách hàng:</span>
                  <p className="text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Số tiền hoàn:</span>
                  <p className="text-xl text-blue-600">{order.amount.toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Lý do:</span>
                  <p className="text-gray-900">{selectedReason === "Lý do khác" ? customReason : selectedReason}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 mb-2">
                    <strong>Tài khoản của bạn sẽ nhận 1 vi phạm</strong>
                  </p>
                  <p className="text-sm text-red-800">
                    Vi phạm này sẽ được ghi nhận vào hồ sơ của bạn. Tích lũy nhiều vi phạm có thể dẫn đến hạn chế hoặc tạm ngưng tài khoản.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("reason")}>
                Quay lại
              </Button>
              <Button 
                onClick={handleConfirmCancel}
                className="bg-red-600 hover:bg-red-700"
              >
                XÁC NHẬN HỦY ĐƠN
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
