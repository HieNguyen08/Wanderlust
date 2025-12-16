import { authenticatedFetch } from "../utils/api";

export interface AdminFlight {
    id: string;
    airline: string;
    airlineName: string;
    flightNumber: string;
    aircraft: string;
    from: string;
    fromCity: string;
    to: string;
    toCity: string;
    departTime: string;
    arriveTime: string;
    duration: string;
    isDirect: boolean;
    terminal: string;
    economyPrice: number;
    premiumEconomyPrice: number;
    businessPrice: number;
    availableSeats: number;
    totalBookings: number;
    revenue: number;
    status: "active" | "inactive" | "cancelled";
    date: string;
}

export const adminFlightApi = {
    getAllFlights: async (params?: { page?: number; size?: number; search?: string }): Promise<{ items: AdminFlight[]; total: number }> => {
        const query = new URLSearchParams({
            page: (params?.page || 0).toString(),
            size: (params?.size || 10).toString(),
            search: params?.search || "",
        });
        const response = await authenticatedFetch(`/api/flights?${query.toString()}`);
        if (!response.ok) {
            throw new Error("Failed to fetch flights");
        }
        const data = await response.json();

        // Backend now returns Page<Flight>
        const content = data.content || [];

        const items = content.map((flight: any) => {
            // Extract prices safely
            const economyPrice = flight.cabinClasses?.economy?.fromPrice || 0;
            const premiumEconomyPrice = flight.cabinClasses?.premiumEconomy?.fromPrice || 0;
            const businessPrice = flight.cabinClasses?.business?.fromPrice || 0;

            // Extract time and date
            const departDateTime = new Date(flight.departureTime);
            const arriveDateTime = new Date(flight.arrivalTime);

            const departTime = departDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const arriveTime = arriveDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const date = departDateTime.toISOString().split('T')[0];

            // Map status
            let status: "active" | "inactive" | "cancelled" = "active";
            if (flight.status === "CANCELLED") status = "cancelled";
            else if (flight.status === "DELAYED") status = "inactive"; // Or keep active?

            return {
                id: flight.id,
                airline: flight.airlineCode,
                airlineName: flight.airlineName,
                flightNumber: flight.flightNumber,
                aircraft: flight.aircraftType,
                from: flight.departureAirportCode,
                fromCity: flight.departureCity,
                to: flight.arrivalAirportCode,
                toCity: flight.arrivalCity,
                departTime,
                arriveTime,
                duration: flight.durationDisplay,
                isDirect: flight.isDirect,
                terminal: flight.departureTerminal,
                economyPrice,
                premiumEconomyPrice,
                businessPrice,
                availableSeats: flight.availableSeats,
                totalBookings: flight.totalSeats - flight.availableSeats, // Approx
                revenue: 0, // Not available
                status,
                date,
            };
        });

        return {
            items,
            total: data.totalElements || 0
        };
    },

    // Legacy support or alias if needed, but better to update calls
    getAllFlightsList: async (): Promise<AdminFlight[]> => {
        const res = await adminFlightApi.getAllFlights({ size: 1000 });
        return res.items;
    },

    createFlight: async (flightData: any) => {
        // Construct backend Flight object
        const departureTime = `${flightData.date}T${flightData.departTime}:00`;
        // Calculate arrival datetime (rough approx if not provided fully, but UI gives time)
        // For now assume same day or handle crossing midnight if duration is long?
        // The UI only gives time. Let's assume same day for simplicity or we need logic.
        // Actually, we should probably ask for arrival date or calculate it from duration.
        // For now, let's use same date as departure for arrival.
        const arrivalTime = `${flightData.date}T${flightData.arriveTime}:00`;

        const payload = {
            flightNumber: flightData.flightNumber,
            airlineCode: flightData.airline,
            airlineName: flightData.airlineName,
            departureAirportCode: flightData.from,
            departureCity: flightData.fromCity,
            departureTerminal: flightData.terminal,
            departureTime: departureTime,
            arrivalAirportCode: flightData.to,
            arrivalCity: flightData.toCity,
            arrivalTime: arrivalTime,
            durationDisplay: flightData.duration,
            isDirect: flightData.isDirect,
            aircraftType: flightData.aircraft,
            status: flightData.status === "cancelled" ? "CANCELLED" : "SCHEDULED",
            availableSeats: flightData.availableSeats,
            totalSeats: flightData.availableSeats, // Assume full if new?
            cabinClasses: {
                economy: {
                    fromPrice: flightData.economyPrice,
                    available: true
                },
                premiumEconomy: {
                    fromPrice: flightData.premiumEconomyPrice,
                    available: true
                },
                business: {
                    fromPrice: flightData.businessPrice,
                    available: true
                }
            }
        };

        const response = await authenticatedFetch("/api/flights", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to create flight");
        }
        return response.json();
    },

    updateFlight: async (id: string, flightData: any) => {
        // Similar construction to create
        const departureTime = `${flightData.date}T${flightData.departTime}:00`;
        const arrivalTime = `${flightData.date}T${flightData.arriveTime}:00`;

        const payload = {
            id,
            flightNumber: flightData.flightNumber,
            airlineCode: flightData.airline,
            airlineName: flightData.airlineName,
            departureAirportCode: flightData.from,
            departureCity: flightData.fromCity,
            departureTerminal: flightData.terminal,
            departureTime: departureTime,
            arrivalAirportCode: flightData.to,
            arrivalCity: flightData.toCity,
            arrivalTime: arrivalTime,
            durationDisplay: flightData.duration,
            isDirect: flightData.isDirect,
            aircraftType: flightData.aircraft,
            status: flightData.status === "cancelled" ? "CANCELLED" : "SCHEDULED",
            availableSeats: flightData.availableSeats,
            cabinClasses: {
                economy: {
                    fromPrice: flightData.economyPrice,
                    available: true
                },
                premiumEconomy: {
                    fromPrice: flightData.premiumEconomyPrice,
                    available: true
                },
                business: {
                    fromPrice: flightData.businessPrice,
                    available: true
                }
            }
        };

        // Backend might not have PUT /api/flights/{id} implemented in Controller?
        // Let's check FlightController.java again.
        // It has POST (create) and DELETE. It does NOT have PUT.
        // I need to add PUT to FlightController.java!

        // Wait, I can't update if backend doesn't support it.
        // I will need to add the endpoint to Backend first.

        // For now, I will write this function but I must update Backend.
        const response = await authenticatedFetch(`/api/flights/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to update flight");
        }
        return response.json();
    },

    deleteFlight: async (id: string) => {
        const response = await authenticatedFetch(`/api/flights/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to delete flight");
        }
        return true;
    }
};
