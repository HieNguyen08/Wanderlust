import { authenticatedFetch } from "../utils/api";

const ADMIN_BOOKINGS_BASE = "/api/v1/admin/bookings";

export type BookingType = "FLIGHT" | "HOTEL" | "CAR_RENTAL" | "ACTIVITY";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUND_REQUESTED";
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface AdminBooking {
  id: string;
  bookingCode: string;
  userId: string;
  vendorId?: string;
  bookingType: BookingType;
  status: BookingStatus;
  bookingDate: string;

  // Service IDs
  flightId?: string;
  hotelId?: string;
  roomId?: string;
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
  totalPrice: number;
  currency: string;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  
  // Cancellation
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  vendorConfirmed?: boolean;

  createdAt?: string;
  updatedAt?: string;
  
  // Extended info (loaded separately)
  serviceDetails?: ServiceDetails;
}

export interface ServiceDetails {
  name: string;
  description?: string;
  provider?: string;
  location?: string;
  details?: any; // Full service object
}

export interface BookingStatistics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

export const adminBookingApi = {
  getAllBookings: async (): Promise<AdminBooking[]> => {
    const response = await authenticatedFetch(ADMIN_BOOKINGS_BASE);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const data = await response.json();
    return data;
  },

  getBookingById: async (id: string): Promise<AdminBooking> => {
    const response = await authenticatedFetch(`${ADMIN_BOOKINGS_BASE}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch booking");
    }
    return response.json();
  },

  getStatistics: async (): Promise<BookingStatistics> => {
    const response = await authenticatedFetch(`${ADMIN_BOOKINGS_BASE}/statistics`);
    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }
    return response.json();
  },

  getRefundRequests: async (): Promise<AdminBooking[]> => {
    const response = await authenticatedFetch(`${ADMIN_BOOKINGS_BASE}/refund-requests`);
    if (!response.ok) {
      throw new Error("Failed to fetch refund requests");
    }
    return response.json();
  },

  approveRefundRequest: async (bookingId: string): Promise<AdminBooking> => {
    const response = await authenticatedFetch(`/api/bookings/${bookingId}/approve-refund`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to approve refund request");
    }
    return response.json();
  },

  rejectRefundRequest: async (bookingId: string, reason?: string): Promise<AdminBooking> => {
    const response = await authenticatedFetch(`/api/bookings/${bookingId}/reject-refund`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error("Failed to reject refund request");
    }
    return response.json();
  },

  updateBooking: async (id: string, bookingData: Partial<AdminBooking>): Promise<AdminBooking> => {
    const response = await authenticatedFetch(`${ADMIN_BOOKINGS_BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to update booking");
    }
    return response.json();
  },

  deleteBooking: async (id: string): Promise<string> => {
    const response = await authenticatedFetch(`${ADMIN_BOOKINGS_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to delete booking");
    }
    return response.text();
  },

  confirmBooking: async (id: string): Promise<AdminBooking> => {
    return adminBookingApi.updateBooking(id, { status: "CONFIRMED" });
  },

  cancelBooking: async (id: string, reason?: string): Promise<AdminBooking> => {
    return adminBookingApi.updateBooking(id, { 
      status: "CANCELLED",
      cancellationReason: reason 
    });
  },

  // Load service details for a booking
  loadServiceDetails: async (booking: AdminBooking): Promise<ServiceDetails | null> => {
    try {
      switch (booking.bookingType) {
        case "FLIGHT":
          if (booking.flightId) {
            const response = await authenticatedFetch(`/api/v1/flights/${booking.flightId}`);
            if (response.ok) {
              const flight = await response.json();
              return {
                name: `${flight.departure?.city || 'N/A'} → ${flight.arrival?.city || 'N/A'} - ${flight.airline || 'N/A'} ${flight.flightNumber || ''}`,
                description: `${flight.departure?.airport || ''} → ${flight.arrival?.airport || ''}`,
                provider: flight.airline,
                location: `${flight.departure?.city || ''} - ${flight.arrival?.city || ''}`,
                details: flight
              };
            }
          }
          break;
        
        case "HOTEL":
          if (booking.hotelId) {
            const response = await authenticatedFetch(`/api/v1/hotels/${booking.hotelId}`);
            if (response.ok) {
              const hotel = await response.json();
              return {
                name: hotel.name || 'N/A',
                description: hotel.description,
                provider: hotel.brandName,
                location: `${hotel.address?.city || ''}, ${hotel.address?.country || ''}`,
                details: hotel
              };
            }
          }
          break;
        
        case "CAR_RENTAL":
          if (booking.carRentalId) {
            const response = await authenticatedFetch(`/api/v1/car-rentals/${booking.carRentalId}`);
            if (response.ok) {
              const car = await response.json();
              return {
                name: `${car.make || ''} ${car.model || ''} ${car.year || ''}`,
                description: `${car.category || ''} - ${car.transmission || ''}`,
                provider: car.rentalCompany,
                location: car.location,
                details: car
              };
            }
          }
          break;
        
        case "ACTIVITY":
          if (booking.activityId) {
            const response = await authenticatedFetch(`/api/v1/activities/${booking.activityId}`);
            if (response.ok) {
              const activity = await response.json();
              return {
                name: activity.name || 'N/A',
                description: activity.description,
                provider: activity.provider,
                location: `${activity.location?.city || ''}, ${activity.location?.country || ''}`,
                details: activity
              };
            }
          }
          break;
      }
    } catch (error) {
      console.error('Failed to load service details:', error);
    }
    return null;
  },
};
