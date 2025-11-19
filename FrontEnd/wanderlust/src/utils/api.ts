// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    return response.json();
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
  }) => {
    const url = `${API_BASE_URL}/api/auth/register`;
    console.log("🌐 API URL:", url);
    console.log("📦 Request body:", userData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response OK:", response.ok);
      console.log("📡 Response Content-Type:", response.headers.get('Content-Type'));
      
      // Log raw response text first
      const responseText = await response.text();
      console.log("📡 Raw response:", responseText.substring(0, 200));
      
      if (!response.ok) {
        console.error("❌ Registration error:", responseText);
        throw new Error(responseText || 'Registration failed');
      }

      const data = JSON.parse(responseText);
      console.log("✅ Registration success:", data);
      return data;
    } catch (error) {
      console.error("🔥 Fetch error:", error);
      throw error;
    }
  },
};

// Token management
export const tokenService = {
  getToken: () => localStorage.getItem('auth_token'),
  
  setToken: (token: string) => localStorage.setItem('auth_token', token),
  
  removeToken: () => localStorage.removeItem('auth_token'),
  
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  
  setUserData: (userData: any) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
  },
  
  removeUserData: () => localStorage.removeItem('user_data'),
  
  isAuthenticated: () => !!localStorage.getItem('auth_token'),
  
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },
};

// Authenticated API call helper
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = tokenService.getToken();
  
  // If no token, immediately throw UNAUTHORIZED without making request
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      throw new Error('UNAUTHORIZED');
    }

    return response;
  } catch (error: any) {
    // Network error or fetch failed
    if (error.message === 'UNAUTHORIZED') {
      throw error;
    }
    throw new Error('NETWORK_ERROR');
  }
};

// Profile API endpoints
export const profileApi = {
  getProfile: async () => {
    const response = await authenticatedFetch('/api/user/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },

  updateProfile: async (profileData: {
    firstName: string;
    lastName: string;
    mobile?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    country?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
  }) => {
    const response = await authenticatedFetch('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update profile');
    }

    return response.json();
  },
};

// Travel Guide API endpoints
export const travelGuideApi = {
  // Lấy tất cả travel guides
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides`);
    if (!response.ok) {
      throw new Error('Failed to fetch travel guides');
    }
    return response.json();
  },

  // Lấy travel guide theo ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch travel guide');
    }
    return response.json();
  },

  // Lấy published guides
  getPublished: async () => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/published`);
    if (!response.ok) {
      throw new Error('Failed to fetch published guides');
    }
    return response.json();
  },

  // Lấy featured guides
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured guides');
    }
    return response.json();
  },

  // Lấy popular guides
  getPopular: async () => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular guides');
    }
    return response.json();
  },

  // Lấy theo destination
  getByDestination: async (destination: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/destination/${encodeURIComponent(destination)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by destination');
    }
    return response.json();
  },

  // Lấy theo country
  getByCountry: async (country: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/country/${encodeURIComponent(country)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by country');
    }
    return response.json();
  },

  // Lấy theo continent
  getByContinent: async (continent: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/continent/${encodeURIComponent(continent)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by continent');
    }
    return response.json();
  },

  // Lấy theo category
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by category');
    }
    return response.json();
  },

  // Lấy theo type
  getByType: async (type: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/type/${encodeURIComponent(type)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by type');
    }
    return response.json();
  },

  // Lấy theo tag
  getByTag: async (tag: string) => {
    const response = await fetch(`${API_BASE_URL}/api/travelguides/tag/${encodeURIComponent(tag)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch guides by tag');
    }
    return response.json();
  },

  // Like travel guide (cần authentication)
  like: async (id: string) => {
    const response = await authenticatedFetch(`/api/travelguides/${id}/like`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to like guide');
    }
    return response.json();
  },

  // Unlike travel guide (cần authentication)
  unlike: async (id: string) => {
    const response = await authenticatedFetch(`/api/travelguides/${id}/unlike`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to unlike guide');
    }
    return response.json();
  },

  // Tạo mới travel guide (admin/partner only)
  create: async (guideData: any) => {
    const response = await authenticatedFetch('/api/travelguides', {
      method: 'POST',
      body: JSON.stringify(guideData),
    });
    if (!response.ok) {
      throw new Error('Failed to create guide');
    }
    return response.json();
  },

  // Cập nhật travel guide (admin/partner only)
  update: async (id: string, guideData: any) => {
    const response = await authenticatedFetch(`/api/travelguides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guideData),
    });
    if (!response.ok) {
      throw new Error('Failed to update guide');
    }
    return response.json();
  },

  // Xóa travel guide (admin only)
  delete: async (id: string) => {
    const response = await authenticatedFetch(`/api/travelguides/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete guide');
    }
    return response.text();
  },
};

// Promotion API endpoints
export const promotionApi = {
  // Lấy tất cả promotions
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }
    return response.json();
  },

  // Lấy promotion theo ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotion');
    }
    return response.json();
  },

  // Lấy promotion theo code
  getByCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/code/${encodeURIComponent(code)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotion by code');
    }
    return response.json();
  },

  // Lấy promotions theo category
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotions by category');
    }
    return response.json();
  },

  // Lấy promotions theo destination
  getByDestination: async (destination: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/destination/${encodeURIComponent(destination)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotions by destination');
    }
    return response.json();
  },

  // Lấy featured promotions
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured promotions');
    }
    return response.json();
  },

  // Lấy active promotions
  getActive: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active promotions');
    }
    return response.json();
  },

  // Lấy active promotions theo category
  getActiveByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/active/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch active promotions by category');
    }
    return response.json();
  },

  // Lấy promotions sắp hết hạn
  getExpiringSoon: async (days: number = 7) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/expiring?days=${days}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expiring promotions');
    }
    return response.json();
  },

  // Lấy newest promotions
  getNewest: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/newest`);
    if (!response.ok) {
      throw new Error('Failed to fetch newest promotions');
    }
    return response.json();
  },

  // Validate promotion code
  validate: async (code: string, category: string, orderAmount: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/promotions/validate?code=${encodeURIComponent(code)}&category=${encodeURIComponent(category)}&orderAmount=${orderAmount}`,
      {
        method: 'POST',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to validate promotion');
    }
    return response.json();
  },

  // Apply promotion (increment used count)
  apply: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/apply/${encodeURIComponent(code)}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to apply promotion');
    }
    return response.json();
  },

  // Calculate discount
  calculateDiscount: async (code: string, orderAmount: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/promotions/calculate-discount?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`
    );
    if (!response.ok) {
      throw new Error('Failed to calculate discount');
    }
    return response.json();
  },

  // Tạo mới promotion (admin only)
  create: async (promotionData: any) => {
    const response = await authenticatedFetch('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    });
    if (!response.ok) {
      throw new Error('Failed to create promotion');
    }
    return response.json();
  },

  // Cập nhật promotion (admin only)
  update: async (id: string, promotionData: any) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotionData),
    });
    if (!response.ok) {
      throw new Error('Failed to update promotion');
    }
    return response.json();
  },

  // Xóa promotion (admin only)
  delete: async (id: string) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete promotion');
    }
    return response.json();
  },
};

// Visa Articles API
export const visaArticleApi = {
  // Lấy tất cả visa articles
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/visa-articles`);
    if (!response.ok) {
      throw new Error('Failed to fetch visa articles');
    }
    return response.json();
  },

  // Lấy visa article theo ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/visa-articles/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch visa article');
    }
    return response.json();
  },

  // Lấy visa article theo country
  getByCountry: async (country: string) => {
    const response = await fetch(`${API_BASE_URL}/api/visa-articles/country/${encodeURIComponent(country)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch visa article by country');
    }
    return response.json();
  },

  // Lấy visa articles theo continent
  getByContinent: async (continent: string) => {
    const response = await fetch(`${API_BASE_URL}/api/visa-articles/continent/${encodeURIComponent(continent)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch visa articles by continent');
    }
    return response.json();
  },

  // Lấy visa articles theo category
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/api/visa-articles/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch visa articles by category');
    }
    return response.json();
  },

  // Lấy popular visa articles
  getPopular: async () => {
    const response = await fetch(`${API_BASE_URL}/api/visa-articles/popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular visa articles');
    }
    return response.json();
  },
};

// User Voucher Wallet API
export const userVoucherApi = {
  // Lưu voucher vào ví
  saveToWallet: async (voucherCode: string) => {
    const response = await authenticatedFetch('/api/v1/user-vouchers/save', {
      method: 'POST',
      body: JSON.stringify({ voucherCode }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save voucher');
    }
    return response.json();
  },

  // Lấy tất cả voucher của user
  getAll: async () => {
    const response = await authenticatedFetch('/api/v1/user-vouchers');
    if (!response.ok) {
      throw new Error('Failed to fetch user vouchers');
    }
    return response.json();
  },

  // Lấy voucher khả dụng
  getAvailable: async () => {
    const response = await authenticatedFetch('/api/v1/user-vouchers/available');
    if (!response.ok) {
      throw new Error('Failed to fetch available vouchers');
    }
    return response.json();
  },

  // Lấy voucher đã sử dụng
  getUsed: async () => {
    const response = await authenticatedFetch('/api/v1/user-vouchers/used');
    if (!response.ok) {
      throw new Error('Failed to fetch used vouchers');
    }
    return response.json();
  },

  // Lấy thống kê
  getStatistics: async () => {
    const response = await authenticatedFetch('/api/v1/user-vouchers/statistics');
    if (!response.ok) {
      throw new Error('Failed to fetch voucher statistics');
    }
    return response.json();
  },

  // Validate voucher trước khi sử dụng
  validate: async (voucherCode: string, category: string, orderAmount: number) => {
    const response = await authenticatedFetch('/api/v1/user-vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ voucherCode, category, orderAmount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate voucher');
    }
    return response.json();
  },

  // Sử dụng voucher
  use: async (voucherCode: string, orderId: string, discountAmount: number) => {
    const response = await authenticatedFetch('/api/v1/user-vouchers/use', {
      method: 'POST',
      body: JSON.stringify({ voucherCode, orderId, discountAmount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to use voucher');
    }
    return response.json();
  },

  // Xóa voucher
  delete: async (voucherCode: string) => {
    const response = await authenticatedFetch(`/api/v1/user-vouchers/${voucherCode}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete voucher');
    }
    return response.json();
  },
};

// Flight API endpoints
export const flightApi = {
  // Lấy tất cả flights
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/flights`);
    if (!response.ok) {
      throw new Error('Failed to fetch flights');
    }
    return response.json();
  },

  // Lấy flight theo ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/flights/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch flight');
    }
    return response.json();
  },

  // Tìm kiếm flights với filters
  search: async (params: {
    from: string;
    to: string;
    date: string; // format: YYYY-MM-DD
    directOnly?: boolean;
    airlines?: string[]; // array of airline codes: ['VN', 'VJ']
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('from', params.from);
    searchParams.append('to', params.to);
    searchParams.append('date', params.date);
    
    if (params.directOnly) {
      searchParams.append('directOnly', 'true');
    }
    
    if (params.airlines && params.airlines.length > 0) {
      params.airlines.forEach(airline => {
        searchParams.append('airlines', airline);
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/flights/search?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search flights');
    }
    return response.json();
  },

  // Tìm kiếm flights theo date range (cho 7-day price calendar)
  searchByDateRange: async (params: {
    from: string;
    to: string;
    startDate: string; // format: YYYY-MM-DD
    endDate: string; // format: YYYY-MM-DD
    directOnly?: boolean;
    airlines?: string[];
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('from', params.from);
    searchParams.append('to', params.to);
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    
    if (params.directOnly) {
      searchParams.append('directOnly', 'true');
    }
    
    if (params.airlines && params.airlines.length > 0) {
      params.airlines.forEach(airline => {
        searchParams.append('airlines', airline);
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/flights/range?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search flights by date range');
    }
    return response.json();
  },
};

// Hotel API endpoints
export const hotelApi = {
  // Tìm kiếm khách sạn với filters
  searchHotels: async (params?: {
    location?: string; // Tên thành phố hoặc locationId
    checkInDate?: string; // format: YYYY-MM-DD
    checkOutDate?: string; // format: YYYY-MM-DD
    guests?: number;
    minStar?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params?.location) {
      searchParams.append('location', params.location);
    }
    if (params?.checkInDate) {
      searchParams.append('checkInDate', params.checkInDate);
    }
    if (params?.checkOutDate) {
      searchParams.append('checkOutDate', params.checkOutDate);
    }
    if (params?.guests) {
      searchParams.append('guests', params.guests.toString());
    }
    if (params?.minStar) {
      searchParams.append('minStar', params.minStar.toString());
    }
    if (params?.maxPrice) {
      searchParams.append('maxPrice', params.maxPrice.toString());
    }

    const url = searchParams.toString() 
      ? `${API_BASE_URL}/api/hotels?${searchParams.toString()}`
      : `${API_BASE_URL}/api/hotels`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search hotels');
    }
    return response.json();
  },

  // Lấy danh sách khách sạn nổi bật
  getFeaturedHotels: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured hotels');
    }
    return response.json();
  },

  // Lấy danh sách locations từ hotels hiện có
  getHotelLocations: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel locations');
    }
    return response.json();
  },

  // Lấy thông tin chi tiết khách sạn theo ID
  getHotelById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel details');
    }
    return response.json();
  },

  // Lấy danh sách phòng của khách sạn
  getHotelRooms: async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel rooms');
    }
    return response.json();
  },

  // Lấy đánh giá của khách sạn (placeholder)
  getHotelReviews: async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel reviews');
    }
    return response.json();
  },
};

// Location API endpoints
export const locationApi = {
  // Lấy tất cả locations với pagination
  getAllLocations: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      searchParams.append('size', params.size.toString());
    }
    if (params?.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    if (params?.sortDir) {
      searchParams.append('sortDir', params.sortDir);
    }

    const url = searchParams.toString() 
      ? `${API_BASE_URL}/api/locations?${searchParams.toString()}`
      : `${API_BASE_URL}/api/locations`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  },

  // Lấy locations nổi bật
  getFeaturedLocations: async () => {
    const response = await fetch(`${API_BASE_URL}/api/locations/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured locations');
    }
    return response.json();
  },

  // Tìm kiếm location theo query
  searchLocations: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/api/locations/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search locations');
    }
    return response.json();
  },

  // Lấy chi tiết location theo ID
  getLocationById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/locations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location details');
    }
    return response.json();
  },
};

// ============================================
// CAR RENTAL API
// ============================================
export const carRentalApi = {
  // Get all car rentals with optional filters
  getAllCars: async (params?: {
    locationId?: string;
    brand?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.locationId) queryParams.append('locationId', params.locationId);
    if (params?.brand) queryParams.append('brand', params.brand);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const url = `${API_BASE_URL}/api/car-rentals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    return response.json();
  },

  // Get popular/recommended cars
  getPopularCars: async () => {
    const response = await fetch(`${API_BASE_URL}/api/car-rentals/popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular cars');
    }
    return response.json();
  },

  // Get car details by ID
  getCarById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/car-rentals/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car details');
    }
    return response.json();
  },

  // Check car availability
  checkAvailability: async (id: string, startDate: string, endDate: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/car-rentals/${id}/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    return response.json();
  },

  // Calculate rental price
  calculatePrice: async (id: string, data: {
    startDate: string;
    endDate: string;
    withDriver?: boolean;
    insurance?: boolean;
    delivery?: boolean;
  }) => {
    const response = await fetch(
      `${API_BASE_URL}/api/car-rentals/${id}/calculate-price`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to calculate price');
    }
    return response.json();
  },
};

// Activity API endpoints
export const activityApi = {
  // Get all activities with optional filters
  getAllActivities: async (params?: {
    locationId?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.locationId) queryParams.append('locationId', params.locationId);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);

    const url = `${API_BASE_URL}/api/activities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    return response.json();
  },

  // Get popular/recommended activities
  getPopularActivities: async () => {
    const response = await fetch(`${API_BASE_URL}/api/activities/popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular activities');
    }
    return response.json();
  },

  // Get activity details by ID
  getActivityById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity details');
    }
    return response.json();
  },

  // Search activities
  searchActivities: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search activities');
    }
    return response.json();
  }
};
