import { authenticatedFetch } from "../utils/api";

export interface Flight {
    id: string;
    flightNumber: string;
    airlineCode: string;
    airlineName: string;
    departureAirportCode: string;
    departureCity: string;
    departureTerminal?: string;
    departureTime: string;
    arrivalAirportCode: string;
    arrivalCity: string;
    arrivalTerminal?: string;
    arrivalTime: string;
    durationDisplay: string;
    isDirect: boolean;
    aircraftType: string;
    status: string;
    availableSeats: number;
    totalSeats: number;
    cabinClasses: {
        economy?: {
            fromPrice: number;
            available: boolean;
        };
        premiumEconomy?: {
            fromPrice: number;
            available: boolean;
        };
        business?: {
            fromPrice: number;
            available: boolean;
        };
        first?: {
            fromPrice: number;
            available: boolean;
        };
    };
}

export interface FlightSearchParams {
    from: string;
    to: string;
    date: string; // Format: YYYY-MM-DD
    directOnly?: boolean;
    airlines?: string[];
}

export const flightApi = {
    /**
     * Tìm kiếm chuyến bay
     */
    searchFlights: async (params: FlightSearchParams): Promise<Flight[]> => {
        const queryParams = new URLSearchParams({
            from: params.from,
            to: params.to,
            date: params.date,
        });

        if (params.directOnly !== undefined) {
            queryParams.append('directOnly', params.directOnly.toString());
        }

        if (params.airlines && params.airlines.length > 0) {
            params.airlines.forEach(airline => {
                queryParams.append('airlines', airline);
            });
        }

        const response = await authenticatedFetch(`/api/flights/search?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error("Không thể tìm kiếm chuyến bay");
        }

        return response.json();
    },

    /**
     * Lấy thông tin chi tiết một chuyến bay
     */
    getFlightById: async (id: string): Promise<Flight> => {
        const response = await authenticatedFetch(`/api/flights/${id}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Không tìm thấy chuyến bay");
            }
            throw new Error("Không thể tải thông tin chuyến bay");
        }

        return response.json();
    },

    /**
     * Lấy danh sách tất cả chuyến bay (dùng cho trang danh sách)
     */
    getAllFlights: async (): Promise<Flight[]> => {
        const response = await authenticatedFetch("/api/flights");
        
        if (!response.ok) {
            throw new Error("Không thể tải danh sách chuyến bay");
        }

        return response.json();
    },

    /**
     * Tìm kiếm chuyến bay theo khoảng thời gian
     */
    searchFlightsByDateRange: async (
        from: string,
        to: string,
        startDate: string,
        endDate: string
    ): Promise<Flight[]> => {
        const queryParams = new URLSearchParams({
            from,
            to,
            startDate,
            endDate,
        });

        const response = await authenticatedFetch(`/api/flights/range?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error("Không thể tìm kiếm chuyến bay");
        }

        return response.json();
    },

    /**
     * Lấy danh sách chuyến bay theo hãng
     */
    getFlightsByAirline: async (airlineCode: string): Promise<Flight[]> => {
        const response = await authenticatedFetch(`/api/flights/by-airline/${airlineCode}`);
        
        if (!response.ok) {
            throw new Error("Không thể tải chuyến bay của hãng");
        }

        return response.json();
    },

    /**
     * Lấy danh sách chuyến bay quốc tế hoặc nội địa
     */
    getFlightsByType: async (isInternational: boolean): Promise<Flight[]> => {
        const queryParams = new URLSearchParams({
            isInternational: isInternational.toString(),
        });

        const response = await authenticatedFetch(`/api/flights/by-type?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error("Không thể tải chuyến bay");
        }

        return response.json();
    },
};
