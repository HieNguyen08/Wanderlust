import { TravelGuide } from '../types/travelGuide';

const API_BASE_URL = 'http://localhost:8080';

// Test Travel Guide API endpoints (without MongoDB)
export const testTravelGuideApi = {
  // Lấy tất cả travel guides
  getAll: async (): Promise<TravelGuide[]> => {
    const response = await fetch(`${API_BASE_URL}/api/test/travelguides`);
    if (!response.ok) {
      throw new Error('Failed to fetch travel guides');
    }
    return response.json();
  },

  // Lấy travel guide theo ID
  getById: async (id: string): Promise<TravelGuide> => {
    const response = await fetch(`${API_BASE_URL}/api/test/travelguides/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch travel guide');
    }
    return response.json();
  },

  // Lấy featured guides
  getFeatured: async (): Promise<TravelGuide[]> => {
    const response = await fetch(`${API_BASE_URL}/api/test/travelguides/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured guides');
    }
    return response.json();
  },

  // Lấy theo country
  getByCountry: async (country: string): Promise<TravelGuide[]> => {
    const response = await fetch(`${API_BASE_URL}/api/test/travelguides/country/${encodeURIComponent(country)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by country');
    }
    return response.json();
  },

  // Lấy theo type
  getByType: async (type: string): Promise<TravelGuide[]> => {
    const response = await fetch(`${API_BASE_URL}/api/test/travelguides/type/${encodeURIComponent(type)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by type');
    }
    return response.json();
  },

  // Lấy theo continent (fake - return all)
  getByContinent: async (continent: string): Promise<TravelGuide[]> => {
    // Test API doesn't have continent filter yet, return all for now
    const response = await fetch(`${API_BASE_URL}/api/test/travelguides`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by continent');
    }
    return response.json();
  },
};
