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
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    tokenService.removeToken();
    tokenService.removeUserData();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
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
