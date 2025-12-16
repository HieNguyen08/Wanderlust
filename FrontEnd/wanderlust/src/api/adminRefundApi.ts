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
  // Get all refund requests (Admin)
  getAllRefunds: async (params?: { page?: number; size?: number; search?: string; status?: string }): Promise<{ items: RefundRequest[]; total: number }> => {
    const query = new URLSearchParams({
      page: (params?.page || 0).toString(),
      size: (params?.size || 10).toString(),
      search: params?.search || "",
      status: params?.status === "all" ? "" : (params?.status || ""),
    });

    const response = await authenticatedFetch(`/api/refunds/admin?${query.toString()}`);
    if (!response.ok) {
      // Fallback or throw
      throw new Error("Failed to fetch refunds");
    }

    const data = await response.json();
    const content = data.content || [];

    // Map backend to frontend
    const items = content.map((item: any) => {
      // Extract needed fields, similar to what we did in the page previously
      return item; // The page component will handle detailed mapping or we can do it here. 
      // Let's do a basic pass-through and let component map it for consistency with current code,
      // OR map it here. The current page maps it manually.
      // The component expects "RefundRequest" interface.
      // Let's return raw data and map in component to avoid duplicating mapping logic or breaking changes.
    });

    return {
      items: content, // We return content directly, component needs to handle it.
      total: data.totalElements || 0
    };
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
