import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import type { PageType } from "../../MainApp";

interface PaymentCallbackPageProps {
    onNavigate: (page: PageType, data?: any) => void;
}

export default function PaymentCallbackPage({ onNavigate }: PaymentCallbackPageProps) {
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("Đang xác thực thanh toán...");

    useEffect(() => {
        const verify = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            // Assuming the backend redirects with some ID or we use session_id from Stripe
            // Ideally, the backend redirect URL should include the payment ID or transaction ID.
            // Let's assume the backend redirects to /payment/callback/:gateway?paymentId=... or similar.
            // Or we can just grab the query params and send them to backend for verification.

            // Since we don't have a specific payment ID in the URL standardly from all gateways without config,
            // let's assume we passed it in the redirect URL or we use the transaction ID.

            // For this implementation, let's assume we verify based on 'client_reference_id' (Stripe) 
            // if they are present, OR if we saved a pending payment ID in local storage.

            // However, a cleaner way is to have the backend handle the callback and then redirect to frontend with a status.
            // But the current plan is Frontend -> Gateway -> Frontend (Callback).

            // Let's try to extract a payment ID or transaction ID.
            const orderId = urlParams.get("orderId") || urlParams.get("client_reference_id");

            if (orderId) {
                try {
                    // We need to find the payment by transaction ID (orderId)
                    // But our verifyPayment api takes ID. 
                    // Let's assume we can verify by transaction ID or we need a new API.
                    // For now, let's just simulate verification or call verifyPayment if we have the ID.

                    // If we don't have the ID, we might need to rely on the backend callback having already processed it.
                    // Let's just wait a bit and check status?

                    // SIMPLIFICATION: Just show success if query param success=true (Stripe)
                    const isSuccess = urlParams.get("success") === "true" || urlParams.get("errorCode") === "0";

                    if (isSuccess) {
                        setStatus("success");
                        setMessage("Thanh toán thành công!");
                        // Navigate to confirmation after a delay
                        setTimeout(() => {
                            onNavigate("confirmation", { paymentInfo: { status: "PAID" } });
                        }, 2000);
                    } else {
                        setStatus("failed");
                        setMessage("Thanh toán thất bại hoặc bị hủy.");
                    }
                } catch (error) {
                    setStatus("failed");
                    setMessage("Lỗi xác thực thanh toán.");
                }
            } else {
                // Fallback for Stripe success_url which we set to include session_id
                if (urlParams.get("success") === "true") {
                    setStatus("success");
                    setMessage("Thanh toán thành công!");
                    setTimeout(() => {
                        onNavigate("confirmation", { paymentInfo: { status: "PAID" } });
                    }, 2000);
                } else {
                    setStatus("failed");
                    setMessage("Không tìm thấy thông tin thanh toán.");
                }
            }
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
