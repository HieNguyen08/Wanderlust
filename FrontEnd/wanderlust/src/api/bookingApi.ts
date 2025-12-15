import { authenticatedFetch } from "../utils/api";

export type BookingType = "FLIGHT" | "HOTEL" | "CAR_RENTAL" | "ACTIVITY";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUND_REQUESTED";
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface BookingData {
  id: string;
  bookingCode: string;
  userId: string;
  vendorId?: string;
  bookingType: BookingType;
  status: BookingStatus;
  bookingDate: string;

  // Service IDs
  flightId?: string;
  flightSeatIds?: string[];
  seatCount?: number;
  hotelId?: string;
  roomIds?: string[];
  carRentalId?: string;
  activityId?: string;

  // Dates
  startDate?: string;
  endDate?: string;

  // Guest Info
  guestInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    passportNumber?: string;
    dob?: string;
  };
  numberOfGuests?: {
    adults?: number;
    children?: number;
    infants?: number;
  };
  specialRequests?: string;

  // Pricing
  basePrice?: number;
  taxes?: number;
  fees?: number;
  discount?: number;
  voucherCode?: string;
  voucherDiscount?: number;
  totalPrice: number;
  currency: string;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  
  // Cancellation & Refund
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  
  // Vendor Confirmation
  vendorConfirmed?: boolean;
  
  // Completion Tracking
  userConfirmed?: boolean;
  autoCompleted?: boolean;

  // Metadata
  metadata?: Record<string, any>;

  createdAt?: string;
  updatedAt?: string;
}

export const bookingApi = {
  // Get all bookings for current user
  getMyBookings: async (): Promise<BookingData[]> => {
    const response = await authenticatedFetch("/api/bookings");
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  },

  // Get specific booking by ID
  getBookingById: async (id: string): Promise<BookingData> => {
    const response = await authenticatedFetch(`/api/bookings/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch booking");
    }
    return response.json();
  },

  // Create new booking
  createBooking: async (bookingData: Partial<BookingData>): Promise<BookingData> => {
    const response = await authenticatedFetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error("Failed to create booking");
    }
    return response.json();
  },

  // Update booking
  updateBooking: async (id: string, updates: Partial<BookingData>): Promise<BookingData> => {
    const response = await authenticatedFetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update booking");
    }
    return response.json();
  },

  // Cancel booking
  cancelBooking: async (id: string, reason: string): Promise<BookingData> => {
    const response = await authenticatedFetch(`/api/bookings/${id}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error("Failed to cancel booking");
    }
    return response.json();
  },

  // Request refund
  requestRefund: async (id: string, reason: string): Promise<BookingData> => {
    const response = await authenticatedFetch(`/api/bookings/${id}/request-refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error("Failed to request refund");
    }
    return response.json();
  },

  // User confirms booking completion (after endDate)
  confirmCompletion: async (id: string): Promise<BookingData> => {
    const response = await authenticatedFetch(`/api/bookings/${id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to confirm completion");
    }
    return response.json();
  },

  // Check if booking can be refunded (within 24h of endDate)
  canRequestRefund: (booking: BookingData): boolean => {
    if (!booking.endDate || booking.status === "COMPLETED") {
      return false;
    }
    
    const endDate = new Date(booking.endDate);
    const now = new Date();
    const twentyFourHoursAfterEnd = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    
    return now <= twentyFourHoursAfterEnd && booking.status !== "CANCELLED" && booking.status !== "REFUND_REQUESTED";
  },

  // Check if user can confirm completion (after endDate, within 24h)
  canConfirmCompletion: (booking: BookingData): boolean => {
    if (!booking.endDate || booking.status === "COMPLETED" || booking.userConfirmed) {
      return false;
    }
    
    const endDate = new Date(booking.endDate);
    const now = new Date();
    
    return now >= endDate && booking.status === "CONFIRMED";
  },
};
