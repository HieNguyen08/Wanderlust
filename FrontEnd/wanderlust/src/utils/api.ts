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
  // GET /api/v1/users/me - Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await authenticatedFetch('/api/v1/users/me');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch current user');
    }
    return response.json();
  },

  // PUT /api/v1/users/me/profile - Cập nhật thông tin cá nhân
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    country?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
    avatar?: string;
  }) => {
    const response = await authenticatedFetch('/api/v1/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update profile');
    }

    return response.json();
  },

  // GET /api/v1/users/me/stats - Lấy thống kê user (trips, points, reviews)
  getUserStats: async () => {
    const response = await authenticatedFetch('/api/v1/users/me/stats');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch user stats');
    }
    return response.json();
  },

  // GET /api/v1/users/me/membership - Lấy thông tin membership
  getMembershipInfo: async () => {
    const response = await authenticatedFetch('/api/v1/users/me/membership');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch membership info');
    }
    return response.json();
  },

  // PUT /api/v1/users/me/password - Đổi mật khẩu
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await authenticatedFetch('/api/v1/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to change password');
    }

    return response.text();
  },

  // GET /api/v1/users/me/notification-settings - Lấy cài đặt thông báo
  getNotificationSettings: async () => {
    const response = await authenticatedFetch('/api/v1/users/me/notification-settings');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch notification settings');
    }
    return response.json();
  },

  // PUT /api/v1/users/me/notification-settings - Cập nhật cài đặt thông báo
  updateNotificationSettings: async (settings: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    promotionalEmails?: boolean;
    bookingReminders?: boolean;
    priceAlerts?: boolean;
  }) => {
    const response = await authenticatedFetch('/api/v1/users/me/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update notification settings');
    }

    return response.json();
  },

  // POST /api/v1/users/me/request-partner-role - Yêu cầu nâng cấp vai trò
  requestPartnerRole: async () => {
    const response = await authenticatedFetch('/api/v1/users/me/request-partner-role', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to request partner role');
    }

    return response.text();
  },
};

// Wallet API endpoints
export const walletApi = {
  // GET /api/v1/wallet - Lấy thông tin ví
  getWallet: async () => {
    const response = await authenticatedFetch('/api/v1/wallet');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch wallet');
    }
    return response.json();
  },

  // POST /api/v1/wallet/deposit - Nạp tiền vào ví
  deposit: async (depositData: {
    amount: number;
    paymentMethod: string; // "CARD", "MOMO", "VNPAY"
  }) => {
    const response = await authenticatedFetch('/api/v1/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to deposit');
    }

    return response.json();
  },

  // POST /api/v1/wallet/pay - Thanh toán bằng ví
  pay: async (paymentData: {
    bookingId: string;
    amount: number;
    description: string;
  }) => {
    const response = await authenticatedFetch('/api/v1/wallet/pay', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to pay with wallet');
    }

    return response.json();
  },

  // POST /api/v1/wallet/withdraw - Rút tiền từ ví
  withdraw: async (withdrawData: {
    amount: number;
    bankAccountNumber: string;
    bankCode: string;
    accountName: string;
  }) => {
    const response = await authenticatedFetch('/api/v1/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to withdraw');
    }

    return response.json();
  },
};

// Transaction API endpoints
export const transactionApi = {
  // GET /api/v1/transactions - Lấy lịch sử giao dịch
  getTransactions: async (params?: {
    page?: number;
    size?: number;
    type?: string; // "CREDIT", "DEBIT", "REFUND", "WITHDRAW"
    status?: string; // "PENDING", "COMPLETED", "FAILED"
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/v1/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch transactions');
    }
    return response.json();
  },

  // GET /api/v1/transactions/{transactionId} - Lấy chi tiết giao dịch
  getTransactionDetail: async (transactionId: string) => {
    const response = await authenticatedFetch(`/api/v1/transactions/${transactionId}`);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch transaction detail');
    }
    return response.json();
  },

  // GET /api/v1/transactions/summary - Lấy tổng quan giao dịch
  getSummary: async () => {
    const response = await authenticatedFetch('/api/v1/transactions/summary');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch transaction summary');
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

// ============================================================
// HOTEL APIs - HotelController
// ============================================================
export const hotelApi = {
  // GET /api/hotels - Tìm kiếm khách sạn
  search: async (criteria?: {
    locationId?: string;
    checkIn?: string; // YYYY-MM-DD
    checkOut?: string; // YYYY-MM-DD
    guests?: number;
    rooms?: number;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    amenities?: string[];
  }) => {
    const searchParams = new URLSearchParams();
    if (criteria) {
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    const url = `${API_BASE_URL}/api/hotels${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search hotels');
    }
    return response.json();
  },

  // GET /api/hotels/featured - Khách sạn nổi bật
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured hotels');
    }
    return response.json();
  },

  // GET /api/hotels/{id} - Chi tiết khách sạn
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel details');
    }
    return response.json();
  },

  // GET /api/hotels/{id}/rooms - Danh sách phòng của khách sạn
  getRooms: async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel rooms');
    }
    return response.json();
  },

  // GET /api/hotels/{id}/reviews - Đánh giá khách sạn
  getReviews: async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel reviews');
    }
    return response.json();
  },

  // POST /api/hotels/{id}/check-availability - Kiểm tra còn phòng (Authenticated)
  checkAvailability: async (hotelId: string, data?: { checkIn?: string; checkOut?: string; guests?: number }) => {
    const response = await authenticatedFetch(`/api/hotels/${hotelId}/check-availability`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
    if (!response.ok) {
      throw new Error('Failed to check hotel availability');
    }
    return response.json();
  },
};

// ============================================================
// ROOM APIs - RoomController
// ============================================================
export const roomApi = {
  // GET /api/rooms/{id} - Chi tiết phòng
  getById: async (roomId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch room details');
    }
    return response.json();
  },

  // GET /api/rooms/{id}/availability - Kiểm tra phòng trống
  checkAvailability: async (roomId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/availability`);
    if (!response.ok) {
      throw new Error('Failed to check room availability');
    }
    return response.json();
  },
};

// ============================================================
// LOCATION APIs - LocationController
// ============================================================
export const locationApi = {
  // GET /api/locations - Danh sách locations (có pagination)
  getAll: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDir) searchParams.append('sortDir', params.sortDir);
    }

    const url = `${API_BASE_URL}/api/locations${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  },

  // GET /api/locations/featured - Locations nổi bật
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/locations/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured locations');
    }
    return response.json();
  },

  // GET /api/locations/search - Tìm kiếm location
  search: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/api/locations/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search locations');
    }
    return response.json();
  },

  // GET /api/locations/{id} - Chi tiết location
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/locations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location details');
    }
    return response.json();
  },
};

// ============================================================
// BOOKING APIs - BookingController
// ============================================================
export const bookingApi = {
  // GET /api/bookings - Lấy bookings của user
  getMyBookings: async () => {
    const response = await authenticatedFetch('/api/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  },

  // GET /api/bookings/{id} - Chi tiết booking
  getById: async (id: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking details');
    }
    return response.json();
  },

  // POST /api/bookings - Tạo booking mới
  create: async (bookingData: {
    bookingType: string; // HOTEL, FLIGHT, ACTIVITY, CAR_RENTAL
    serviceId: string; // ID của hotel/flight/activity/car
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
    roomIds?: string[]; // For hotel bookings
    totalAmount: number;
    specialRequests?: string;
  }) => {
    const response = await authenticatedFetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create booking');
    }
    return response.json();
  },

  // PUT /api/bookings/{id}/cancel - Hủy booking
  cancel: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason: reason || 'User requested cancellation' }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to cancel booking');
    }
    return response.json();
  },

  // POST /api/bookings/{id}/request-refund - Yêu cầu hoàn tiền
  requestRefund: async (id: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}/request-refund`, {
      method: 'POST',
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to request refund');
    }
    return response.json();
  },

  // POST /api/bookings/preview - Xem trước booking (tính giá)
  preview: async (bookingData: any) => {
    const response = await authenticatedFetch('/api/bookings/preview', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to preview booking');
    }
    return response.json();
  },
};

// ============================================================
// ACTIVITY APIs - ActivityController
// ============================================================
export const activityApi = {
  // GET /api/activities - Search/filter activities
  search: async (params?: {
    locationId?: string;
    category?: string; // TOUR, ADVENTURE, CULTURAL, FOOD, WATER_SPORTS, etc.
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/activities?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search activities');
    }
    return response.json();
  },

  // GET /api/activities/featured - Featured activities
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/activities/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured activities');
    }
    return response.json();
  },

  // GET /api/activities/{id} - Activity details
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity details');
    }
    return response.json();
  },

  // GET /api/activities/{id}/availability - Check simple availability
  getAvailability: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/${id}/availability`);
    if (!response.ok) {
      throw new Error('Failed to check activity availability');
    }
    return response.json();
  },

  // GET /api/activities/{id}/reviews - Get activity reviews
  getReviews: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/${id}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity reviews');
    }
    return response.json();
  },

  // POST /api/activities/{id}/check-availability - Check specific date & guests
  checkAvailability: async (id: string, date: string, guests: number) => {
    const response = await authenticatedFetch(`/api/activities/${id}/check-availability`, {
      method: 'POST',
      body: JSON.stringify({ date, guests }),
    });
    if (!response.ok) {
      throw new Error('Failed to check activity availability');
    }
    return response.json();
  },
};

// ============================================================
// CAR RENTAL APIs - CarRentalController
// ============================================================
export const carRentalApi = {
  // GET /api/car-rentals - Search car rentals
  search: async (params?: {
    locationId?: string;
    brand?: string;
    type?: string; // SUV, SEDAN, VAN, etc.
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/car-rentals?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search car rentals');
    }
    return response.json();
  },

  // GET /api/car-rentals/popular - Popular car rentals
  getPopular: async () => {
    const response = await fetch(`${API_BASE_URL}/api/car-rentals/popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular car rentals');
    }
    return response.json();
  },

  // GET /api/car-rentals/{id} - Car rental details
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/car-rentals/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car rental details');
    }
    return response.json();
  },

  // GET /api/car-rentals/{id}/availability - Check availability
  checkAvailability: async (id: string, startDate: string, endDate: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', startDate);
    searchParams.append('endDate', endDate);

    const response = await fetch(
      `${API_BASE_URL}/api/car-rentals/${id}/availability?${searchParams.toString()}`
    );
    if (!response.ok) {
      throw new Error('Failed to check car rental availability');
    }
    return response.json();
  },

  // POST /api/car-rentals/{id}/calculate-price - Calculate rental price
  calculatePrice: async (id: string, data: {
    startDate: string;
    endDate: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    includeInsurance?: boolean;
    includeDriver?: boolean;
  }) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/calculate-price`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to calculate price');
    }
    return response.json();
  },
};

// ============================================================
// ADMIN APIs - AdminBookingController, AdminWalletController, UserController
// ============================================================
export const adminApi = {
  // ===== BOOKING MANAGEMENT =====
  // GET /api/admin/bookings - Get all bookings
  getAllBookings: async () => {
    const response = await authenticatedFetch('/api/admin/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch all bookings');
    }
    return response.json();
  },

  // GET /api/admin/bookings/statistics - Get booking statistics
  getBookingStatistics: async () => {
    const response = await authenticatedFetch('/api/admin/bookings/statistics');
    if (!response.ok) {
      throw new Error('Failed to fetch booking statistics');
    }
    return response.json();
  },

  // PUT /api/admin/bookings/{id} - Update booking
  updateBooking: async (id: string, bookingData: any) => {
    const response = await authenticatedFetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error('Failed to update booking');
    }
    return response.json();
  },

  // DELETE /api/admin/bookings/{id} - Delete booking
  deleteBooking: async (id: string) => {
    const response = await authenticatedFetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
    return response.text();
  },

  // ===== WALLET MANAGEMENT =====
  // GET /api/v1/admin/wallets - Get all wallets
  getAllWallets: async (page: number = 0, size: number = 20, search?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (search) params.append('search', search);

    const response = await authenticatedFetch(`/api/v1/admin/wallets?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }
    return response.json();
  },

  // GET /api/v1/admin/wallets/{userId} - Get wallet details
  getUserWallet: async (userId: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user wallet');
    }
    return response.json();
  },

  // PUT /api/v1/admin/wallets/refunds/{transactionId}/approve - Approve refund
  approveRefund: async (transactionId: string, notes?: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
    if (!response.ok) {
      throw new Error('Failed to approve refund');
    }
    return response.text();
  },

  // PUT /api/v1/admin/wallets/refunds/{transactionId}/reject - Reject refund
  rejectRefund: async (transactionId: string, reason: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject refund');
    }
    return response.text();
  },

  // GET /api/v1/admin/wallets/refunds/pending - Get pending refunds
  getPendingRefunds: async (page: number = 0, size: number = 20) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/pending?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pending refunds');
    }
    return response.json();
  },

  // POST /api/v1/admin/wallets/refunds - Create manual refund
  createManualRefund: async (refundData: {
    userId: string;
    amount: number;
    reason: string;
    notes?: string;
  }) => {
    const response = await authenticatedFetch('/api/v1/admin/wallets/refunds', {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
    if (!response.ok) {
      throw new Error('Failed to create manual refund');
    }
    return response.text();
  },

  // ===== USER MANAGEMENT =====
  // GET /api/users - Get all users
  getAllUsers: async () => {
    const response = await authenticatedFetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // GET /api/users/{id} - Get user by ID
  getUserById: async (id: string) => {
    const response = await authenticatedFetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  // POST /api/users - Create user
  createUser: async (userData: any) => {
    const response = await authenticatedFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },

  // PUT /api/users/{id} - Update user
  updateUser: async (id: string, userData: any) => {
    const response = await authenticatedFetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  },

  // DELETE /api/users/{id} - Delete user
  deleteUser: async (id: string) => {
    const response = await authenticatedFetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return response.text();
  },
};

// ==========================================
// VENDOR API
// ==========================================
export const vendorApi = {
  // ===== BOOKING MANAGEMENT =====
  
  // GET /api/vendor/bookings - Get all bookings for vendor
  getVendorBookings: async () => {
    const response = await authenticatedFetch('/api/vendor/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch vendor bookings');
    }
    return response.json();
  },

  // POST /api/vendor/bookings/{id}/confirm - Confirm booking
  confirmBooking: async (id: string) => {
    const response = await authenticatedFetch(`/api/vendor/bookings/${id}/confirm`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to confirm booking');
    }
    return response.json();
  },

  // POST /api/vendor/bookings/{id}/reject - Reject booking
  rejectBooking: async (id: string, reason: string) => {
    const response = await authenticatedFetch(`/api/vendor/bookings/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject booking');
    }
    return response.json();
  },

  // ===== HOTEL/SERVICE MANAGEMENT =====
  
  // GET /api/vendor/hotels - Get vendor's hotels
  getVendorHotels: async () => {
    const response = await authenticatedFetch('/api/vendor/hotels');
    if (!response.ok) {
      throw new Error('Failed to fetch vendor hotels');
    }
    return response.json();
  },

  // POST /api/vendor/hotels - Create new hotel
  createHotel: async (hotelData: any) => {
    const response = await authenticatedFetch('/api/vendor/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData),
    });
    if (!response.ok) {
      throw new Error('Failed to create hotel');
    }
    return response.json();
  },

  // PUT /api/vendor/hotels/{id} - Update hotel
  updateHotel: async (id: string, hotelData: any) => {
    const response = await authenticatedFetch(`/api/vendor/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData),
    });
    if (!response.ok) {
      throw new Error('Failed to update hotel');
    }
    return response.json();
  },

  // DELETE /api/vendor/hotels/{id} - Delete hotel
  deleteHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/vendor/hotels/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }
    return response.text();
  },

  // ===== REVIEW MANAGEMENT =====
  
  // POST /api/reviews/{id}/respond - Respond to review
  respondToReview: async (id: string, response: string) => {
    const res = await authenticatedFetch(`/api/reviews/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
    if (!res.ok) {
      throw new Error('Failed to respond to review');
    }
    return res.json();
  },

  // GET /api/reviews - Get reviews for vendor's services
  getVendorReviews: async (targetType: string, targetId: string) => {
    const response = await authenticatedFetch(`/api/reviews?targetType=${targetType}&targetId=${targetId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },
};

// ==========================================
// PROMOTION/VOUCHER API
// ==========================================
export const promotionApi = {
  // GET /api/promotions - Get all promotions
  getAllPromotions: async () => {
    const response = await authenticatedFetch('/api/promotions');
    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }
    return response.json();
  },

  // GET /api/promotions/active - Get active promotions
  getActivePromotions: async () => {
    const response = await authenticatedFetch('/api/promotions/active');
    if (!response.ok) {
      throw new Error('Failed to fetch active promotions');
    }
    return response.json();
  },

  // GET /api/promotions/{id} - Get promotion by ID
  getPromotionById: async (id: string) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotion');
    }
    return response.json();
  },

  // GET /api/promotions/code/{code} - Get promotion by code
  getPromotionByCode: async (code: string) => {
    const response = await authenticatedFetch(`/api/promotions/code/${code}`);
    if (!response.ok) {
      throw new Error('Failed to fetch promotion');
    }
    return response.json();
  },

  // POST /api/promotions - Create promotion (Admin only)
  createPromotion: async (promotionData: any) => {
    const response = await authenticatedFetch('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    });
    if (!response.ok) {
      throw new Error('Failed to create promotion');
    }
    return response.json();
  },

  // PUT /api/promotions/{id} - Update promotion (Admin only)
  updatePromotion: async (id: string, promotionData: any) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotionData),
    });
    if (!response.ok) {
      throw new Error('Failed to update promotion');
    }
    return response.json();
  },

  // DELETE /api/promotions/{id} - Delete promotion (Admin only)
  deletePromotion: async (id: string) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete promotion');
    }
    return response.json();
  },

  // POST /api/promotions/validate - Validate promotion code
  validatePromotion: async (code: string, category: string, orderAmount: number) => {
    const response = await authenticatedFetch(
      `/api/promotions/validate?code=${code}&category=${category}&orderAmount=${orderAmount}`,
      {
        method: 'POST',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to validate promotion');
    }
    return response.json();
  },

  // POST /api/promotions/apply/{code} - Apply promotion
  applyPromotion: async (code: string) => {
    const response = await authenticatedFetch(`/api/promotions/apply/${code}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to apply promotion');
    }
    return response.json();
  },
};

// ==========================================
// REVIEW API (Admin & Public)
// ==========================================
export const reviewApi = {
  // ===== PUBLIC/USER ENDPOINTS =====
  
  // GET /api/reviews/{id} - Get review by ID
  getReviewById: async (id: string) => {
    const response = await authenticatedFetch(`/api/reviews/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch review');
    }
    return response.json();
  },

  // GET /api/reviews - Get approved reviews by target
  getReviewsByTarget: async (targetType: string, targetId: string) => {
    const response = await authenticatedFetch(`/api/reviews?targetType=${targetType}&targetId=${targetId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  // GET /api/reviews/my-reviews - Get user's reviews
  getMyReviews: async () => {
    const response = await authenticatedFetch('/api/reviews/my-reviews');
    if (!response.ok) {
      throw new Error('Failed to fetch my reviews');
    }
    return response.json();
  },

  // POST /api/reviews - Create review
  createReview: async (reviewData: any) => {
    const response = await authenticatedFetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    return response.json();
  },

  // PUT /api/reviews/{id} - Update review
  updateReview: async (id: string, reviewData: any) => {
    const response = await authenticatedFetch(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    return response.json();
  },

  // DELETE /api/reviews/{id} - Delete review
  deleteReview: async (id: string) => {
    const response = await authenticatedFetch(`/api/reviews/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
  },

  // ===== ADMIN ENDPOINTS =====
  
  // GET /api/reviews/admin/all - Get all reviews (Admin)
  getAllReviewsForAdmin: async () => {
    const response = await authenticatedFetch('/api/reviews/admin/all');
    if (!response.ok) {
      throw new Error('Failed to fetch all reviews');
    }
    return response.json();
  },

  // GET /api/reviews/admin/pending - Get pending reviews (Admin)
  getPendingReviews: async () => {
    const response = await authenticatedFetch('/api/reviews/admin/pending');
    if (!response.ok) {
      throw new Error('Failed to fetch pending reviews');
    }
    return response.json();
  },

  // PUT /api/reviews/admin/{id}/moderate - Moderate review (Admin)
  moderateReview: async (id: string, moderationData: any) => {
    const response = await authenticatedFetch(`/api/reviews/admin/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify(moderationData),
    });
    if (!response.ok) {
      throw new Error('Failed to moderate review');
    }
    return response.json();
  },

  // DELETE /api/reviews/admin/{id} - Delete review (Admin)
  deleteReviewByAdmin: async (id: string) => {
    const response = await authenticatedFetch(`/api/reviews/admin/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
  },

  // DELETE /api/reviews/admin/all - Delete all reviews (Admin)
  deleteAllReviews: async () => {
    const response = await authenticatedFetch('/api/reviews/admin/all', {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete all reviews');
    }
    return response.text();
  },
};

// ==========================================
// ADMIN WALLET/REFUND API
// ==========================================
export const adminWalletApi = {
  // GET /api/v1/admin/wallets - Get all wallets
  getAllWallets: async (page: number = 0, size: number = 20, search?: string) => {
    let url = `/api/v1/admin/wallets?page=${page}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }
    return response.json();
  },

  // GET /api/v1/admin/wallets/{userId} - Get user wallet detail
  getUserWallet: async (userId: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user wallet');
    }
    return response.json();
  },

  // GET /api/v1/admin/wallets/refunds/pending - Get pending refunds
  getPendingRefunds: async (page: number = 0, size: number = 20) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/pending?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pending refunds');
    }
    return response.json();
  },

  // PUT /api/v1/admin/wallets/refunds/{transactionId}/approve - Approve refund
  approveRefund: async (transactionId: string, notes?: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes: notes || '' }),
    });
    if (!response.ok) {
      throw new Error('Failed to approve refund');
    }
  },

  // PUT /api/v1/admin/wallets/refunds/{transactionId}/reject - Reject refund
  rejectRefund: async (transactionId: string, reason: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject refund');
    }
  },

  // POST /api/v1/admin/wallets/refunds - Create manual refund
  createManualRefund: async (refundData: any) => {
    const response = await authenticatedFetch('/api/v1/admin/wallets/refunds', {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
    if (!response.ok) {
      throw new Error('Failed to create manual refund');
    }
  },

  // GET /api/v1/admin/wallets/{userId}/transactions - Get user transactions
  getUserTransactions: async (userId: string, page: number = 0, size: number = 20) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}/transactions?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user transactions');
    }
    return response.json();
  },

  // PUT /api/v1/admin/wallets/{userId}/status - Update wallet status
  updateWalletStatus: async (userId: string, newStatus: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus, reason: reason || '' }),
    });
    if (!response.ok) {
      throw new Error('Failed to update wallet status');
    }
  },
};

