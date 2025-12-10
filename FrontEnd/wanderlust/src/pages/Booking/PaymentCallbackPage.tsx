import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { paymentApi } from "../../api/paymentApi";
import { Button } from "../../components/ui/button";
import type { PageType } from "../../MainApp";

const PENDING_PAYMENT_KEY = "wanderlust_pending_payment";

interface PaymentCallbackPageProps {
    onNavigate: (page: PageType, data?: any) => void;
}

export default function PaymentCallbackPage({ onNavigate }: PaymentCallbackPageProps) {
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("Đang xác thực thanh toán...");

    useEffect(() => {
        const verify = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const successFlag = urlParams.get("success") === "true" || urlParams.get("redirect_status") === "succeeded";
            const failedFlag = urlParams.get("canceled") === "true" || urlParams.get("redirect_status") === "failed";

            const bookingId = urlParams.get("booking_id") || urlParams.get("bookingId") || undefined;
            const paymentId = urlParams.get("payment_id") || urlParams.get("paymentId") || undefined;

            const pendingRaw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
            const pending = pendingRaw ? JSON.parse(pendingRaw) : {};
            const resolvedBookingId = bookingId || pending?.bookingId;
            const resolvedPaymentId = paymentId || pending?.paymentId;

            if (!successFlag && failedFlag) {
                setStatus("failed");
                setMessage("Thanh toán thất bại hoặc bị hủy.");
                sessionStorage.removeItem(PENDING_PAYMENT_KEY);
                return;
            }

            if (successFlag) {
                try {
                    if (resolvedBookingId) {
                        await paymentApi.getPaymentByBookingId(resolvedBookingId);
                    } else if (resolvedPaymentId) {
                        await paymentApi.getPaymentStatus(resolvedPaymentId);
                    }

                    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
                    setStatus("success");
                    setMessage("Thanh toán thành công!");
                    setTimeout(() => {
                        onNavigate("payment-success", {
                            bookingId: resolvedBookingId,
                            paymentId: resolvedPaymentId
                        });
                    }, 1200);
                } catch (error) {
                    setStatus("failed");
                    setMessage("Không thể xác minh thanh toán.");
                    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
                }
                return;
            }

            // No flags, treat as failure
            setStatus("failed");
            setMessage("Không tìm thấy thông tin thanh toán.");
            sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        };

        verify();
    }, [onNavigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                {status === "loading" && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Đang xử lý...</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2 text-green-600">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mb-6">Đang chuyển hướng đến trang xác nhận...</p>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2 text-red-600">Thanh toán thất bại</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Button onClick={() => onNavigate("booking")} className="w-full">
                            Thử lại
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
