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
  getVendorBookings: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append("page", params.page.toString());
    if (params?.size !== undefined) queryParams.append("size", params.size.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const response = await authenticatedFetch(`/api/vendor/bookings?${queryParams.toString()}`);
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

  // Get vendor refund requests (paginated)
  getVendorRefunds: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }): Promise<{ content: VendorRefund[]; totalElements: number; totalPages: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append("page", params.page.toString());
    if (params?.size !== undefined) queryParams.append("size", params.size.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `/api/vendor/refunds${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await authenticatedFetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch vendor refunds");
    }

    const data = await response.json();
    // Support both Page response and List response (fallback)
    const rawItems = data.content || (Array.isArray(data) ? data : []);
    const totalElements = data.totalElements || rawItems.length;
    const totalPages = data.totalPages || 1;

    const mappedItems = rawItems.map((item: any) => {
      const amount = Number(item.totalPrice ?? item.refundAmount ?? 0);
      const serviceName = item.serviceName || item.metadata?.serviceName || item.bookingType || "";
      const guestInfo = item.guestInfo || item.metadata?.contactInfo || {};

      return {
        id: item.id,
        bookingId: item.id,
        bookingCode: item.bookingCode || "",
        serviceType: (item.bookingType || "").toString().toUpperCase(),
        serviceName,
        userId: item.userId,
        userName: guestInfo.fullName || "",
        userEmail: guestInfo.email || "",
        vendorName: item.vendorName || "",
        originalAmount: amount,
        refundPercentage: 100,
        refundAmount: amount,
        penaltyAmount: 0,
        requestDate: item.bookingDate || item.createdAt || new Date().toISOString(),
        status: "pending", // Default, will be overridden by component logic or we can map it here if needed.
        // Actually the component ignores api-status and calculates it? 
        // No, component uses `normalizeStatus`.
        // Let's pass the status through if available.
        // Actually, let's map status correctly if possible.
        // Backend booking status: REFUND_REQUESTED, CANCELLED, etc.
        // We can map backend status to frontend status string here to be safe.
        // But for now, let's keep it minimal and let component handle it or pass rough status.
        reason: item.cancellationReason || "",
        paymentMethod: item.paymentMethod || "",
        transactionId: item.transactionId,
        vendorRefundApproved: item.vendorRefundApproved,
        // Pass original status so component can normalize
        rawStatus: item.status
      } as VendorRefund;
    });

    return {
      content: mappedItems,
      totalElements,
      totalPages
    };
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
