import { authenticatedFetch } from "../utils/api";

export interface SearchResultDTO {
  id: string;
  type: "HOTEL" | "FLIGHT" | "ACTIVITY" | "CAR_RENTAL" | "TRAVEL_GUIDE";
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  location?: string;
  rating?: number;
  url?: string;
}

export const searchApi = {
  // GET /api/search/global?query=... - Global search
  globalSearch: async (query: string): Promise<SearchResultDTO[]> => {
    const queryParams = new URLSearchParams({ query });
    const response = await authenticatedFetch(`/api/search/global?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error("Không thể tìm kiếm");
    }
    
    return response.json();
  },
};
