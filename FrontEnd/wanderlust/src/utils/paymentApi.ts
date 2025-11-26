import { authenticatedFetch } from "./api";

export interface PaymentDTO {
    id?: string;
    bookingId: string;
    userId: string;
    amount: number;
    method: "CREDIT_CARD" | "BANK_TRANSFER" | "WALLET" | "MOMO" | "ZALOPAY" | "STRIPE";
    status?: string;
    transactionId?: string;
    metadata?: Record<string, any>;
}

export const initiatePayment = async (paymentData: PaymentDTO): Promise<PaymentDTO> => {
    const response = await authenticatedFetch("/api/payments/initiate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate payment");
    }

    return response.json();
};

export const verifyPayment = async (paymentId: string): Promise<PaymentDTO> => {
    const response = await authenticatedFetch(`/api/payments/${paymentId}/verify`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to verify payment");
    }

    return response.json();
};
