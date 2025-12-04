import {
    ArrowLeft,
    CreditCard,
    Loader2,
    ShieldCheck,
    Wallet
} from "lucide-react";
import { useState } from "react";
import { initiatePayment } from "../../api/paymentApi";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import type { PageType } from "../../MainApp";
import { tokenService } from "../../utils/api";

interface CheckoutPageProps {
    onNavigate: (page: PageType, data?: any) => void;
    bookingData: any;
}

export default function CheckoutPage({ onNavigate, bookingData }: CheckoutPageProps) {
    const [selectedMethod, setSelectedMethod] = useState<"WALLET" | "STRIPE">("WALLET");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalAmount = bookingData?.totalPrice || 0;
    const user = tokenService.getUserData();

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const paymentPayload = {
                bookingId: bookingData.id || "TEMP_ID", // Assuming booking is created before or we pass temp ID
                userId: user?.id || "",
                amount: totalAmount,
                paymentMethod: selectedMethod,
                // Add other necessary fields from bookingData
            };

            // Note: In a real flow, we might need to create the booking first if it doesn't exist.
            // For now, assuming bookingData contains a booking ID or we create one.
            // If booking is not created yet, we might need to call booking API first.
            // Let's assume bookingData has everything needed.

            const response = await initiatePayment(paymentPayload);

            if (response.metadata?.paymentUrl) {
                // Redirect to payment gateway
                window.location.href = response.metadata.paymentUrl;
            } else {
                // If no URL (e.g. Wallet), navigate to confirmation
                onNavigate("confirmation", { ...bookingData, paymentInfo: { totalAmount, paymentMethod: selectedMethod } });
            }
        } catch (err: any) {
            setError(err.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-12 pt-[calc(60px+3rem)]">
                <Button
                    variant="ghost"
                    onClick={() => onNavigate("booking")}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>

                <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Chọn phương thức thanh toán</h3>

                            <div className="space-y-4">
                                {/* Wallet */}
                                <div
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === "WALLET" ? "border-blue-600 bg-blue-50" : "hover:border-gray-300"
                                        }`}
                                    onClick={() => setSelectedMethod("WALLET")}
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <Wallet className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">Ví Wanderlust</p>
                                        <p className="text-sm text-gray-500">Thanh toán nhanh chóng, không cần nhập thẻ</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === "WALLET" ? "border-blue-600" : "border-gray-300"
                                        }`}>
                                        {selectedMethod === "WALLET" && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                    </div>
                                </div>

                                {/* Stripe */}
                                <div
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === "STRIPE" ? "border-indigo-600 bg-indigo-50" : "hover:border-gray-300"
                                        }`}
                                    onClick={() => setSelectedMethod("STRIPE")}
                                >
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                        <CreditCard className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">Thẻ quốc tế (Stripe)</p>
                                        <p className="text-sm text-gray-500">Visa, MasterCard, JCB</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === "STRIPE" ? "border-indigo-600" : "border-gray-300"
                                        }`}>
                                        {selectedMethod === "STRIPE" && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h3 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                                </div>
                                {/* Add discounts/fees if any */}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                className="w-full py-6 text-lg"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        Thanh toán ngay
                                        <ShieldCheck className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Bằng việc thanh toán, bạn đồng ý với Điều khoản & Điều kiện của Wanderlust.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer onNavigate={onNavigate} />
        </div>
    );
}
