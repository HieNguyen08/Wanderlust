import { authenticatedFetch } from "../utils/api";

export interface VendorBooking {
  id: string;
  bookingCode: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  serviceType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  payment: "paid" | "pending";
  amount: number;
  bookingDate: string;
  vendorConfirmed?: boolean;
  userConfirmed?: boolean;
  autoCompleted?: boolean;
}

export interface VendorRefund {
  id: string;
  bookingId: string;
  bookingCode: string;
  serviceType: string;
  serviceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  vendorName: string;
  originalAmount: number;
  refundPercentage: number;
  refundAmount: number;
  penaltyAmount: number;
  requestDate: string;
  status: "pending" | "approved" | "processing" | "completed" | "rejected";
  reason: string;
  paymentMethod: string;
  transactionId?: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
}

export const vendorApi = {
  // Get vendor bookings
  getVendorBookings: async (): Promise<VendorBooking[]> => {
    const response = await authenticatedFetch("/api/vendor/bookings");
    if (!response.ok) {
      throw new Error("Failed to fetch vendor bookings");
    }
    return response.json();
  },

  // Confirm booking
  confirmBooking: async (bookingId: string): Promise<VendorBooking> => {
    const response = await authenticatedFetch(`/api/vendor/bookings/${bookingId}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to confirm booking");
    }
    return response.json();
  },

  // Reject/Cancel booking
  rejectBooking: async (bookingId: string, reason: string): Promise<VendorBooking> => {
    const response = await authenticatedFetch(`/api/vendor/bookings/${bookingId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error("Failed to reject booking");
    }
    return response.json();
  },

  // Get vendor refund requests (filterable by status)
  getVendorRefunds: async (params?: { status?: string; page?: number; size?: number }): Promise<VendorRefund[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page !== undefined) query.append("page", String(params.page));
    if (params?.size !== undefined) query.append("size", String(params.size));

    const url = `/api/vendor/refunds${query.toString() ? `?${query.toString()}` : ""}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch vendor refunds");
    }
    return response.json();
  },

  // Vendor approve refund (for vendor-created vouchers)
  approveRefund: async (refundId: string, notes?: string): Promise<VendorRefund> => {
    const response = await authenticatedFetch(`/api/vendor/refunds/${refundId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
    });
    if (!response.ok) {
      throw new Error("Failed to approve refund");
    }
    return response.json();
  },

  // Vendor reject refund
  rejectRefund: async (refundId: string, reason: string): Promise<VendorRefund> => {
    const response = await authenticatedFetch(`/api/vendor/refunds/${refundId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error("Failed to reject refund");
    }
    return response.json();
  },
};
