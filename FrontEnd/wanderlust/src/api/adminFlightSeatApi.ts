import { authenticatedFetch } from "../utils/api";

/**
 * Configuration cho một loại ghế (vd: hàng "A-B" là ECONOMY/WINDOW)
 */
export interface SeatConfiguration {
    columns: string[];  // ["A", "B"]
    cabinClass: "ECONOMY" | "BUSINESS" | "FIRST";
    seatType: "WINDOW" | "MIDDLE" | "AISLE";
    price?: number;
    features?: string[];  // ["wifi", "power"]
    isExitRow?: boolean;
    extraLegroom?: boolean;
}

/**
 * Request để tạo hàng loạt ghế
 */
export interface BulkFlightSeatRequest {
    flightId: string;
    rows: number;
    columns: string[];  // ["A", "B", "C", "D", "E", "F"]
    seatConfigurations: SeatConfiguration[];
}

/**
 * Entity FlightSeat
 */
export interface FlightSeat {
    id: string;
    flightId: string;
    seatNumber: string;  // "1A", "2B"
    seatType: "WINDOW" | "MIDDLE" | "AISLE";
    row: number;
    position: string;
    cabinClass: "ECONOMY" | "BUSINESS" | "FIRST";
    isExitRow: boolean;
    extraLegroom: boolean;
    price: number;
    features: string[];
    status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
    createdAt: string;
    updatedAt: string;
}

export const adminFlightSeatApi = {
    /**
     * Lấy tất cả ghế
     */
    getAllFlightSeats: async (): Promise<FlightSeat[]> => {
        const response = await authenticatedFetch("/api/flight-seats");
        if (!response.ok) {
            throw new Error("Failed to fetch flight seats");
        }
        return response.json();
    },

    /**
     * Lấy ghế theo ID
     */
    getFlightSeatById: async (id: string): Promise<FlightSeat> => {
        const response = await authenticatedFetch(`/api/flight-seats/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch flight seat");
        }
        return response.json();
    },

    /**
     * Lấy tất cả ghế của một chuyến bay
     */
    getFlightSeatsForFlight: async (flightId: string): Promise<FlightSeat[]> => {
        const response = await authenticatedFetch(`/api/flight-seats/flight/${flightId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch flight seats for flight");
        }
        return response.json();
    },

    /**
     * Tạo một ghế đơn
     */
    createFlightSeat: async (seatData: Omit<FlightSeat, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlightSeat> => {
        const response = await authenticatedFetch("/api/flight-seats", {
            method: "POST",
            body: JSON.stringify(seatData),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to create flight seat");
        }
        return response.json();
    },

    /**
     * Tạo hàng loạt ghế cho một chuyến bay
     * Cách sử dụng:
     * 
     * const request: BulkFlightSeatRequest = {
     *   flightId: "flight-123",
     *   rows: 18,
     *   columns: ["A", "B", "C", "D", "E", "F"],
     *   seatConfigurations: [
     *     {
     *       columns: ["A", "B"],
     *       cabinClass: "ECONOMY",
     *       seatType: "WINDOW",
     *       price: 0,
     *     },
     *     {
     *       columns: ["C", "D"],
     *       cabinClass: "ECONOMY",
     *       seatType: "MIDDLE",
     *       price: 0,
     *     },
     *     {
     *       columns: ["E", "F"],
     *       cabinClass: "ECONOMY",
     *       seatType: "AISLE",
     *       price: 0,
     *     },
     *   ],
     * };
     * 
     * const seats = await adminFlightSeatApi.bulkCreateFlightSeats(request);
     */
    bulkCreateFlightSeats: async (request: BulkFlightSeatRequest): Promise<FlightSeat[]> => {
        const response = await authenticatedFetch("/api/flight-seats/bulk", {
            method: "POST",
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to create flight seats");
        }
        return response.json();
    },

    /**
     * Cập nhật một ghế
     */
    updateFlightSeat: async (id: string, seatData: Partial<FlightSeat>): Promise<FlightSeat> => {
        const response = await authenticatedFetch(`/api/flight-seats/${id}`, {
            method: "PUT",
            body: JSON.stringify(seatData),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to update flight seat");
        }
        return response.json();
    },

    /**
     * Xóa một ghế
     */
    deleteFlightSeat: async (id: string): Promise<boolean> => {
        const response = await authenticatedFetch(`/api/flight-seats/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to delete flight seat");
        }
        return true;
    },

    /**
     * Xóa tất cả ghế của một chuyến bay
     */
    deleteFlightSeatsForFlight: async (flightId: string): Promise<boolean> => {
        const response = await authenticatedFetch(`/api/flight-seats/flight/${flightId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to delete flight seats");
        }
        return true;
    },
};
