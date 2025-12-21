import { authenticatedFetch } from "../utils/api";

export interface VendorBooking {
  id: string;
  bookingCode?: string;
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
  vendorRefundApproved?: boolean;
}

export const vendorApi = {
  // Get vendor bookings
  getVendorBookings: async (): Promise<VendorBooking[]> => {
    const response = await authenticatedFetch("/api/vendor/bookings");
    if (!response.ok) {
      throw new Error("Failed to fetch vendor bookings");
    }
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      ...item,
      amount: typeof item.amount === "string" ? Number(item.amount) : item.amount,
    }));
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
    const data = await response.json();
    return {
      ...data,
      amount: typeof data.amount === "string" ? Number(data.amount) : data.amount,
    };
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
    const data = await response.json();
    return {
      ...data,
      amount: typeof data.amount === "string" ? Number(data.amount) : data.amount,
    };
  },

  // Get vendor refund requests (only bookings of this vendor with payment completed & refund requested)
  getVendorRefunds: async (): Promise<VendorRefund[]> => {
    const response = await authenticatedFetch("/api/vendor/refunds");
    if (!response.ok) {
      throw new Error("Failed to fetch vendor refunds");
    }
    const raw = await response.json();
    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      const amount = Number(item.totalPrice ?? item.refundAmount ?? 0);
      const serviceName = item.serviceName || item.metadata?.serviceName || item.bookingType || "";
      return {
        id: item.id,
        bookingId: item.id,
        bookingCode: item.bookingCode || "",
        serviceType: (item.bookingType || "").toString().toUpperCase(),
        serviceName,
        userId: item.userId,
        userName: item.guestInfo?.fullName || item.metadata?.contactInfo?.fullName || "",
        userEmail: item.guestInfo?.email || item.metadata?.contactInfo?.email || "",
        vendorName: item.vendorName || "",
        originalAmount: amount,
        refundPercentage: 100,
        refundAmount: amount,
        penaltyAmount: 0,
        requestDate: item.bookingDate || item.createdAt || new Date().toISOString(),
        status: "pending",
        reason: item.cancellationReason || "",
        paymentMethod: item.paymentMethod || "",
        transactionId: item.transactionId,
        vendorRefundApproved: item.vendorRefundApproved,
      } as VendorRefund;
    });
  },

  // Vendor records refund decision
  setRefundDecision: async (bookingId: string, approved: boolean): Promise<VendorRefund> => {
    const response = await authenticatedFetch(`/api/vendor/refunds/${bookingId}/approval`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approved }),
    });

    if (!response.ok) {
      throw new Error("Failed to update refund decision");
    }
    return response.json();
  },
};
