import { authenticatedFetch } from "../utils/api";

export interface RefundRequest {
  id: string;
  bookingId: string;
  userId: string;
  vendorId?: string;
  bookingCode: string;
  serviceType: string;
  serviceName: string;
  userName: string;
  userEmail: string;
  vendorName?: string;
  originalAmount: number;
  refundPercentage: number;
  refundAmount: number;
  penaltyAmount: number;
  reason: string;
  requestDate: string;
  status: RefundStatus;
  paymentMethod: string;
  transactionId?: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  adminResponse?: string;
  isAdminApproved?: boolean;
}

export type RefundStatus = "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "REJECTED";

export const adminRefundApi = {
  // Get all refund requests
  getAllRefunds: async (): Promise<RefundRequest[]> => {
    const response = await authenticatedFetch("/api/admin/refunds");
    if (!response.ok) {
      throw new Error("Failed to fetch refunds");
    }
    return response.json();
  },

  // Get pending refunds
  getPendingRefunds: async (): Promise<RefundRequest[]> => {
    const response = await authenticatedFetch("/api/refunds/pending");
    if (!response.ok) {
      throw new Error("Failed to fetch pending refunds");
    }
    return response.json();
  },

  // Approve refund
  approveRefund: async (refundId: string, response?: string): Promise<RefundRequest> => {
    const res = await authenticatedFetch(`/api/refunds/${refundId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response: response || "Approved" }),
    });
    if (!res.ok) {
      throw new Error("Failed to approve refund");
    }
    return res.json();
  },

  // Reject refund
  rejectRefund: async (refundId: string, response: string): Promise<RefundRequest> => {
    const res = await authenticatedFetch(`/api/refunds/${refundId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response }),
    });
    if (!res.ok) {
      throw new Error("Failed to reject refund");
    }
    return res.json();
  },

  // Get refund by ID
  getRefundById: async (refundId: string): Promise<RefundRequest> => {
    const response = await authenticatedFetch(`/api/admin/refunds/${refundId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch refund");
    }
    return response.json();
  },
};
