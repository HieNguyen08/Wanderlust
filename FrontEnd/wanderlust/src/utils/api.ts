// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Normalized availability error to surface approval/active gating to UI
const throwAvailabilityError = (response: Response, subject: string) => {
  if ([400, 403, 404].includes(response.status)) {
    throw new Error(`${subject} not available or pending approval`);
  }
  throw new Error(`Failed to fetch ${subject}`);
};

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
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData || userData === 'undefined') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('user_data');
      return null;
    }
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

  // POST /api/v1/users/me/request-vendor-role - Yêu cầu nâng cấp vai trò
  requestVendorRole: async () => {
    const response = await authenticatedFetch('/api/v1/users/me/request-vendor-role', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to request vendor role');
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
    paymentMethod: string; // "CARD", "STRIPE", "VNPAY"
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
  // GET /api/v1/wallet/transactions - Lấy lịch sử giao dịch từ wallet_transaction
  getTransactions: async (params?: {
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const response = await authenticatedFetch(`/api/v1/wallet/transactions?${queryParams.toString()}`);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to fetch transactions');
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

// Promotion API endpoints
export const promotionApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions`);
    if (!response.ok) throw new Error('Failed to fetch promotions');
    return response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch promotion');
    return response.json();
  },
  getByCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/code/${code}`);
    if (!response.ok) throw new Error('Failed to fetch promotion');
    return response.json();
  },
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch promotions by category');
    return response.json();
  },
  getByDestination: async (destination: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/destination/${destination}`);
    if (!response.ok) throw new Error('Failed to fetch promotions by destination');
    return response.json();
  },
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured promotions');
    return response.json();
  },
  getActive: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/active`);
    if (!response.ok) throw new Error('Failed to fetch active promotions');
    return response.json();
  },
  getActiveByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/active/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch active promotions by category');
    return response.json();
  },
  getExpiring: async (days: number = 7) => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/expiring?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch expiring promotions');
    return response.json();
  },
  getNewest: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promotions/newest`);
    if (!response.ok) throw new Error('Failed to fetch newest promotions');
    return response.json();
  },
  // Admin methods
  create: async (data: any) => {
    const response = await authenticatedFetch('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create promotion');
    return response.json();
  },
  update: async (id: string, data: any) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update promotion');
    return response.json();
  },
  delete: async (id: string) => {
    const response = await authenticatedFetch(`/api/promotions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete promotion');
    return response.json();
  },
  // Validation methods
  validate: async (code: string, category: string, orderAmount: number, vendorId: string, serviceId?: string) => {
    const serviceParam = serviceId ? `&serviceId=${encodeURIComponent(serviceId)}` : '';
    const response = await authenticatedFetch(`/api/promotions/validate?code=${encodeURIComponent(code)}&category=${encodeURIComponent(category)}&orderAmount=${orderAmount}&vendorId=${encodeURIComponent(vendorId)}${serviceParam}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to validate promotion');
    return response.json();
  },
  apply: async (code: string, vendorId: string, serviceId?: string) => {
    const serviceParam = serviceId ? `&serviceId=${encodeURIComponent(serviceId)}` : '';
    const response = await authenticatedFetch(`/api/promotions/apply/${encodeURIComponent(code)}?vendorId=${encodeURIComponent(vendorId)}${serviceParam}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to apply promotion');
    return response.json();
  },
  calculateDiscount: async (code: string, orderAmount: number, vendorId: string, serviceId?: string) => {
    const serviceParam = serviceId ? `&serviceId=${encodeURIComponent(serviceId)}` : '';
    const response = await authenticatedFetch(`/api/promotions/calculate-discount?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}&vendorId=${encodeURIComponent(vendorId)}${serviceParam}`);
    if (!response.ok) throw new Error('Failed to calculate discount');
    return response.json();
  }
};

// Vendor Promotion API endpoints
export const vendorPromotionApi = {
  // Lấy danh sách promotion của vendor hiện tại (tự động lọc theo vendorId)
  list: async (params: { search?: string; status?: string; type?: string; page?: number; size?: number }) => {
    const search = params.search ? `&search=${encodeURIComponent(params.search)}` : '';
    const status = params.status ? `&status=${encodeURIComponent(params.status)}` : '';
    const type = params.type ? `&type=${encodeURIComponent(params.type)}` : '';
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const response = await authenticatedFetch(`/api/promotions/vendor/my-promotions?page=${page}&size=${size}${search}${status}${type}`);
    if (!response.ok) throw new Error('Failed to fetch vendor promotions');
    return response.json();
  },
  // Tạo promotion mới (vendor)
  create: async (data: any) => {
    const response = await authenticatedFetch('/api/promotions/vendor', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create vendor promotion');
    return response.json();
  },
  // Cập nhật promotion (vendor)
  update: async (id: string, data: any) => {
    const response = await authenticatedFetch(`/api/promotions/vendor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update vendor promotion');
    return response.json();
  },
  // Xóa promotion (vendor)
  delete: async (id: string) => {
    const response = await authenticatedFetch(`/api/promotions/vendor/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete vendor promotion');
    return response.json();
  },
  // Toggle trạng thái active (vendor)
  toggle: async (id: string, active: boolean) => {
    const response = await authenticatedFetch(`/api/promotions/vendor/${id}/toggle?active=${active}`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to toggle vendor promotion');
    return response.json();
  }
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

  // Lấy các chuyến bay gần nhất
  getNearestFlights: async (limit: number = 50) => {
    const response = await fetch(`${API_BASE_URL}/api/flights/nearest?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch nearest flights');
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
  searchFlights: async (params: {
    from: string;
    to: string;
    date: string; // format: YYYY-MM-DD
    directOnly?: boolean;
    airlines?: string[]; // array of airline codes: ['VN', 'VJ']
    minPrice?: number;
    maxPrice?: number;
    cabinClass?: string;
    departureTimeRange?: string; // e.g. "morning,afternoon"
    page?: number;
    size?: number;
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

    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.cabinClass) searchParams.append('cabinClass', params.cabinClass);
    if (params.departureTimeRange) searchParams.append('departureTimeRange', params.departureTimeRange);

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await fetch(`${API_BASE_URL}/api/flights/search?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search flights');
    }
    return response.json();
  },

  // Tìm kiếm flights theo date range (cho 7-day price calendar)
  searchFlightsByDateRange: async (params: {
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
    maxStar?: number;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    hotelTypes?: string[]; // property types
    minRating?: number;
    featuredOnly?: boolean;
    verifiedOnly?: boolean;
    page?: number;
    size?: number;
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
    if (params?.maxStar) {
      searchParams.append('maxStar', params.maxStar.toString());
    }
    if (params?.minPrice) {
      searchParams.append('minPrice', params.minPrice.toString());
    }
    if (params?.maxPrice) {
      searchParams.append('maxPrice', params.maxPrice.toString());
    }
    if (params?.minRating) {
      searchParams.append('minRating', params.minRating.toString());
    }

    if (params?.featuredOnly) {
      searchParams.append('featuredOnly', 'true');
    }
    if (params?.verifiedOnly) {
      searchParams.append('verifiedOnly', 'true');
    }

    if (params?.amenities && params.amenities.length > 0) {
      params.amenities.forEach(a => searchParams.append('amenities', a));
    }

    if (params?.hotelTypes && params.hotelTypes.length > 0) {
      params.hotelTypes.forEach(t => searchParams.append('hotelTypes', t));
    }

    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

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
      throwAvailabilityError(response, 'Hotel');
    }
    return response.json();
  },

  // Lấy danh sách phòng của khách sạn
  getHotelRooms: async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/rooms`);
    if (!response.ok) {
      throwAvailabilityError(response, 'Hotel rooms');
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

  // --- Admin/Vendor status flows ---
  approveHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/admin/hotels/${id}/approve`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to approve hotel');
    }
    return response.json();
  },

  rejectHotel: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/admin/hotels/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to reject hotel');
    }
    return response.json();
  },

  requestRevisionHotel: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/admin/hotels/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to request hotel revision');
    }
    return response.json();
  },

  pauseHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/vendor/hotels/${id}/pause`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to pause hotel');
    }
    return response.json();
  },

  resumeHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/vendor/hotels/${id}/resume`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to resume hotel');
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

    const url = `/api/locations${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

    try {
      const response = await authenticatedFetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      return response.json();
    } catch (error: any) {
      // If not authenticated, try without token for public access
      if (error.message === 'UNAUTHORIZED') {
        const publicUrl = searchParams.toString()
          ? `${API_BASE_URL}/api/locations?${searchParams.toString()}`
          : `${API_BASE_URL}/api/locations`;
        const response = await fetch(publicUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        return response.json();
      }
      throw error;
    }
  },

  // Lấy locations nổi bật
  getFeaturedLocations: async () => {
    try {
      const response = await authenticatedFetch('/api/locations/featured');
      if (!response.ok) {
        throw new Error('Failed to fetch featured locations');
      }
      return response.json();
    } catch (error: any) {
      // If not authenticated, try without token for public access
      if (error.message === 'UNAUTHORIZED') {
        const response = await fetch(`${API_BASE_URL}/api/locations/featured`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured locations');
        }
        return response.json();
      }
      throw error;
    }
  },

  // Tìm kiếm location theo query
  searchLocations: async (query: string) => {
    try {
      const response = await authenticatedFetch(`/api/locations/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      return response.json();
    } catch (error: any) {
      // If not authenticated, try without token for public access
      if (error.message === 'UNAUTHORIZED') {
        const response = await fetch(`${API_BASE_URL}/api/locations/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to search locations');
        }
        return response.json();
      }
      throw error;
    }
  },

  // Lấy chi tiết location theo ID
  getLocationById: async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/locations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location details');
      }
      return response.json();
    } catch (error: any) {
      // If not authenticated, try without token for public access
      if (error.message === 'UNAUTHORIZED') {
        const response = await fetch(`${API_BASE_URL}/api/locations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch location details');
        }
        return response.json();
      }
      throw error;
    }
  },

  // Lấy locations theo type (CITY, COUNTRY)
  getLocationsByType: async (type: string) => {
    try {
      const response = await authenticatedFetch(`/api/locations/type/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations by type');
      }
      return response.json();
    } catch (error: any) {
      // If not authenticated, try without token for public access
      if (error.message === 'UNAUTHORIZED') {
        const response = await fetch(`${API_BASE_URL}/api/locations/type/${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch locations by type');
        }
        return response.json();
      }
      throw error;
    }
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
    types?: string[];
    minPrice?: number;
    maxPrice?: number;
    minSeats?: number;
    withDriver?: boolean;
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.locationId) queryParams.append('locationId', params.locationId);
    if (params?.brand) queryParams.append('brand', params.brand);

    if (params?.types && params.types.length > 0) {
      params.types.forEach(t => queryParams.append('types', t));
    }

    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    if (params?.minSeats) queryParams.append('minSeats', params.minSeats.toString());
    if (params?.withDriver !== undefined) queryParams.append('withDriver', params.withDriver.toString());

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

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
      throwAvailabilityError(response, 'Car rental');
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

  // --- Admin/Vendor status flows ---
  approveCar: async (id: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/approve`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to approve car');
    }
    return response.json();
  },

  rejectCar: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to reject car');
    }
    return response.json();
  },

  requestRevisionCar: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to request car revision');
    }
    return response.json();
  },

  pauseCar: async (id: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/pause`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to pause car');
    }
    return response.json();
  },

  resumeCar: async (id: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/resume`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to resume car');
    }
    return response.json();
  },
};

// Activity API endpoints
export const activityApi = {
  // Get all activities with optional filters
  getAllActivities: async (params?: {
    locationId?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.locationId) queryParams.append('locationId', params.locationId);

    if (params?.categories && params.categories.length > 0) {
      params.categories.forEach(c => queryParams.append('categories', c));
    }

    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const url = `${API_BASE_URL}/api/activities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    return response.json();
  },

  // Get popular/recommended activities
  getPopularActivities: async () => {
    const response = await fetch(`${API_BASE_URL}/api/activities/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular activities');
    }
    return response.json();
  },

  // Get activity details by ID
  getActivityById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/${id}`);
    if (!response.ok) {
      throwAvailabilityError(response, 'Activity');
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
  },

  // --- Admin/Vendor status flows ---
  approveActivity: async (id: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/approve`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to approve activity');
    }
    return response.json();
  },

  rejectActivity: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to reject activity');
    }
    return response.json();
  },

  requestRevisionActivity: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to request activity revision');
    }
    return response.json();
  },

  pauseActivity: async (id: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/pause`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to pause activity');
    }
    return response.json();
  },

  resumeActivity: async (id: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/resume`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to resume activity');
    }
    return response.json();
  },
};

// Booking API endpoints
export const bookingApi = {
  // Get all bookings for current user
  getMyBookings: async (params?: {
    page?: number;
    size?: number;
    status?: string; // "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REFUND_REQUESTED"
    paymentStatus?: string; // "COMPLETED", "PENDING"
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);

    const url = `/api/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  },

  // Get booking details by ID
  getBookingById: async (id: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking details');
    }
    return response.json();
  },

  // Create a new booking
  createBooking: async (bookingData: {
    productType: string; // "HOTEL", "CAR_RENTAL", "ACTIVITY", "FLIGHT"
    productId: string;
    startDate: string;
    endDate?: string;
    quantity?: number;
    guestInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
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

  // Update booking (cancel, modify, etc.)
  updateBooking: async (id: string, updates: {
    status?: string;
    specialRequests?: string;
  }) => {
    const response = await authenticatedFetch(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update booking');
    }
    return response.json();
  },

  // Cancel booking
  cancelBooking: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
    return response.json();
  },

  // Confirm booking (for vendors)
  confirmBooking: async (id: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}/confirm`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to confirm booking');
    }
    return response.json();
  },

  // Reject booking (for vendors)
  rejectBooking: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject booking');
    }
    return response.json();
  },

  // Alias for cancelBooking - used by BookingHistoryPage
  cancel: async (id: string, reason?: string) => {
    return bookingApi.cancelBooking(id, reason);
  },

  // Request refund for a cancelled booking
  requestRefund: async (bookingId: string) => {
    const response = await authenticatedFetch(`/api/bookings/${bookingId}/refund`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to request refund');
    }
    return response.json();
  },

  // Complete booking (user confirms completion)
  completeBooking: async (id: string) => {
    const response = await authenticatedFetch(`/api/bookings/${id}/complete`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to complete booking');
    }
    return response.json();
  },
};

// Admin API endpoints
export const adminApi = {
  // ============ USERS MANAGEMENT ============
  // Get all users (admin only)
  getAllUsers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/admin/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Get user details
  getUserById: async (userId: string) => {
    const response = await authenticatedFetch(`/api/admin/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return response.json();
  },

  // Block/Unblock user
  toggleUserStatus: async (userId: string, isBlocked: boolean) => {
    const response = await authenticatedFetch(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isBlocked }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user status');
    }
    return response.json();
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await authenticatedFetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return response.text();
  },

  // ============ BOOKINGS MANAGEMENT ============
  // Get all bookings
  getAllBookings: async (params?: {
    page?: number;
    size?: number;
    status?: string;
    userId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);

    const url = `/api/v1/admin/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  },

  // Get booking statistics
  getBookingStatistics: async () => {
    const response = await authenticatedFetch('/api/v1/admin/bookings/statistics');
    if (!response.ok) {
      throw new Error('Failed to fetch booking statistics');
    }
    return response.json();
  },

  // Update booking
  updateBooking: async (bookingId: string, updates: any) => {
    const response = await authenticatedFetch(`/api/v1/admin/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update booking');
    }
    return response.json();
  },

  // Delete booking
  deleteBooking: async (bookingId: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/bookings/${bookingId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
    return response.text();
  },

  // ============ SERVICES STATUS FLOWS ============
  approveHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/admin/hotels/${id}/approve`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to approve hotel');
    }
    return response.json();
  },

  rejectHotel: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/admin/hotels/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to reject hotel');
    }
    return response.json();
  },

  requestRevisionHotel: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/admin/hotels/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to request hotel revision');
    }
    return response.json();
  },

  approveCar: async (id: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/approve`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to approve car');
    }
    return response.json();
  },

  rejectCar: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to reject car');
    }
    return response.json();
  },

  requestRevisionCar: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to request car revision');
    }
    return response.json();
  },

  approveActivity: async (id: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/approve`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to approve activity');
    }
    return response.json();
  },

  rejectActivity: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to reject activity');
    }
    return response.json();
  },

  requestRevisionActivity: async (id: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    });
    if (!response.ok) {
      throw new Error('Failed to request activity revision');
    }
    return response.json();
  },

  // ============ WALLETS MANAGEMENT ============
  // Get all wallets
  getAllWallets: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `/api/v1/admin/wallets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }
    return response.json();
  },

  // Get wallet details
  getWalletDetail: async (userId: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wallet details');
    }
    return response.json();
  },

  // Approve refund
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

  // Reject refund
  rejectRefund: async (transactionId: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject refund');
    }
    return response.text();
  },

  // ============ PAYMENTS MANAGEMENT ============
  // Get all payments
  getAllPayments: async (params?: {
    page?: number;
    size?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/payments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return response.json();
  },

  // Update payment
  updatePayment: async (paymentId: string, updates: any) => {
    const response = await authenticatedFetch(`/api/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update payment');
    }
    return response.json();
  },

  // Delete payment
  deletePayment: async (paymentId: string) => {
    const response = await authenticatedFetch(`/api/payments/${paymentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete payment');
    }
    return response.text();
  },

  // ============ REVIEWS MANAGEMENT ============
  // Get all reviews (admin)
  getAllReviews: async (params?: {
    page?: number;
    size?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/reviews/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  // Get pending reviews
  getPendingReviews: async () => {
    const response = await authenticatedFetch('/api/reviews/admin/pending');
    if (!response.ok) {
      throw new Error('Failed to fetch pending reviews');
    }
    return response.json();
  },

  // Moderate review
  moderateReview: async (reviewId: string, status: 'APPROVED' | 'REJECTED' | 'HIDDEN', reason?: string) => {
    const response = await authenticatedFetch(`/api/reviews/admin/${reviewId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to moderate review');
    }
    return response.json();
  },
};

// Preview/Review API endpoints
export const previewApi = {
  // Get reviews by target (hotel, activity, etc.)
  getReviewsByTarget: async (targetType: string, targetId: string, page: number = 0, size: number = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}&page=${page}&size=${size}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  // Get review by ID
  getReviewById: async (reviewId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch review');
    }
    return response.json();
  },

  // Create review (authenticated users only)
  createReview: async (reviewData: {
    bookingId: string;
    rating: number;
    title?: string;
    comment?: string;
    detailedRatings?: Record<string, number>;
    images?: { url: string; caption?: string }[];
    travelDate?: string;
    travelType?: string;
  }) => {
    const response = await authenticatedFetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    return response.json();
  },

  // Update review
  updateReview: async (reviewId: string, updates: any) => {
    const response = await authenticatedFetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    return response.json();
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    const response = await authenticatedFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
    return response.text();
  },

  // Get user's reviews
  getMyReviews: async (page: number = 0, size: number = 10) => {
    const response = await authenticatedFetch(`/api/reviews/my-reviews?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch your reviews');
    }
    return response.json();
  },

  // Respond to review (vendor/partner only)
  respondToReview: async (reviewId: string, responseContent: string) => {
    const response = await authenticatedFetch(`/api/reviews/${reviewId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ responseContent }),
    });
    if (!response.ok) {
      throw new Error('Failed to respond to review');
    }
    return response.json();
  },

  // Vote a review helpful or not helpful
  voteReview: async (reviewId: string, voteType: 'HELPFUL' | 'NOT_HELPFUL') => {
    const response = await authenticatedFetch(`/api/reviews/${reviewId}/vote?voteType=${voteType}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to vote review');
    }
    return response.json();
  },
};

// Review API endpoints (alias for admin usage)
export const reviewApi = {
  // Get reviews by target (hotel, activity, etc.)
  getReviewsByTarget: async (targetType: string, targetId: string) => {
    return previewApi.getReviewsByTarget(targetType, targetId);
  },

  // Get review by ID
  getReviewById: async (reviewId: string) => {
    return previewApi.getReviewById(reviewId);
  },

  // Create review
  createReview: async (reviewData: any) => {
    return previewApi.createReview(reviewData);
  },

  // Update review
  updateReview: async (reviewId: string, updates: any) => {
    return previewApi.updateReview(reviewId, updates);
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    return previewApi.deleteReview(reviewId);
  },

  // Delete review by admin
  deleteReviewByAdmin: async (reviewId: string) => {
    return previewApi.deleteReview(reviewId);
  },

  // Get user's reviews
  getMyReviews: async () => {
    return previewApi.getMyReviews();
  },

  // Get all reviews (admin)
  getAllReviewsForAdmin: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/reviews/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch all reviews');
    }
    return response.json();
  },

  // Get pending reviews (admin)
  getPendingReviews: async () => {
    const response = await authenticatedFetch('/api/reviews/admin/pending');
    if (!response.ok) {
      throw new Error('Failed to fetch pending reviews');
    }
    return response.json();
  },

  // Moderate review (admin)
  moderateReview: async (reviewId: string, data: {
    status?: 'APPROVED' | 'REJECTED' | 'HIDDEN';
    reason?: string;
    moderatorNotes?: string;
  }) => {
    const response = await authenticatedFetch(`/api/reviews/admin/${reviewId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to moderate review');
    }
    return response.json();
  },

  // Respond to review (vendor/partner)
  respondToReview: async (reviewId: string, responseContent: string) => {
    return previewApi.respondToReview(reviewId, responseContent);
  },

  // Vote a review (helpful / not helpful)
  voteReview: async (reviewId: string, voteType: 'HELPFUL' | 'NOT_HELPFUL') => {
    return previewApi.voteReview(reviewId, voteType);
  },

  // Get admin review statistics
  getAdminStats: async () => {
    const response = await authenticatedFetch('/api/reviews/admin/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch admin review stats');
    }
    return response.json();
  },

  // Get vendor review statistics
  getVendorStats: async (vendorId: string) => {
    const response = await authenticatedFetch(`/api/reviews/vendor/${vendorId}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch vendor review stats');
    }
    return response.json();
  },
};

// Admin Wallet API endpoints
export const adminWalletApi = {
  // Get all wallets
  getAllWallets: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `/api/v1/admin/wallets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }
    return response.json();
  },

  // Get wallet detail by user ID
  getWalletDetail: async (userId: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wallet details');
    }
    return response.json();
  },

  // Get refunds (defaults to pending for backward compatibility)
  getPendingRefunds: async (
    params?: { page?: number; size?: number; status?: string } | number,
    sizeArg?: number
  ) => {
    // Support legacy signature getPendingRefunds(page, size)
    const normalizedParams = typeof params === 'number'
      ? { page: params, size: sizeArg }
      : params || {};

    const queryParams = new URLSearchParams();
    if (normalizedParams.page !== undefined) queryParams.append('page', normalizedParams.page.toString());
    if (normalizedParams.size !== undefined) queryParams.append('size', normalizedParams.size.toString());
    if (normalizedParams.status) queryParams.append('status', normalizedParams.status);

    // If status provided, use the generic refunds endpoint; otherwise keep the older /pending path
    const basePath = normalizedParams.status
      ? '/api/v1/admin/wallets/refunds'
      : '/api/v1/admin/wallets/refunds/pending';

    const url = `${basePath}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch pending refunds');
    }
    return response.json();
  },

  // Approve refund (optional penalty when admin overrides vendor SLA)
  approveRefund: async (
    transactionId: string,
    notes?: string,
    options?: { enforcePenalty?: boolean }
  ) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes, enforcePenalty: options?.enforcePenalty }),
    });
    if (!response.ok) {
      throw new Error('Failed to approve refund');
    }
    return response.json();
  },

  // Reject refund
  rejectRefund: async (transactionId: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/refunds/${transactionId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject refund');
    }
    return response.json();
  },

  // Create manual refund
  createManualRefund: async (data: {
    userId: string;
    amount: number;
    reason: string;
  }) => {
    const response = await authenticatedFetch('/api/v1/admin/wallets/refunds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create manual refund');
    }
    return response.json();
  },

  // Update wallet status
  updateWalletStatus: async (userId: string, data: {
    isBlocked?: boolean;
    reason?: string;
  }) => {
    const response = await authenticatedFetch(`/api/v1/admin/wallets/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update wallet status');
    }
    return response.json();
  },

  // Get user transactions
  getUserTransactions: async (userId: string, params?: {
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const url = `/api/v1/admin/wallets/${userId}/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user transactions');
    }
    return response.json();
  },
};

const vendorServicePath = (serviceType: string) => {
  switch (serviceType) {
    case 'hotel':
    case 'hotels':
      return '/api/vendor/hotels';
    case 'room':
    case 'rooms':
      return '/api/vendor/rooms';
    case 'car':
    case 'car-rentals':
      return '/api/car-rentals';
    case 'activity':
    case 'activities':
      return '/api/activities';
    default:
      throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Vendor/Partner API endpoints
export const vendorApi = {
  // Get vendor's bookings
  getVendorBookings: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/api/vendor/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vendor bookings');
    }
    return response.json();
  },

  // Confirm booking (vendor)
  confirmBooking: async (bookingId: string) => {
    const response = await authenticatedFetch(`/api/vendor/bookings/${bookingId}/confirm`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to confirm booking');
    }
    return response.json();
  },

  // Reject booking (vendor)
  rejectBooking: async (bookingId: string, reason?: string) => {
    const response = await authenticatedFetch(`/api/vendor/bookings/${bookingId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject booking');
    }
    return response.json();
  },

  // Get vendor dashboard stats
  getDashboardStats: async () => {
    const response = await authenticatedFetch('/api/vendor/dashboard/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  },

  // Get vendor revenue
  getRevenue: async (params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.period) queryParams.append('period', params.period);

    const url = `/api/vendor/revenue${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch revenue');
    }
    return response.json();
  },

  // Update vendor profile
  updateProfile: async (profileData: {
    businessName?: string;
    businessDescription?: string;
    businessImage?: string;
    bankAccount?: string;
    bankName?: string;
    accountName?: string;
  }) => {
    const response = await authenticatedFetch('/api/vendor/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update vendor profile');
    }
    return response.json();
  },

  // Get vendor profile
  getProfile: async () => {
    const response = await authenticatedFetch('/api/vendor/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch vendor profile');
    }
    return response.json();
  },

  // Create service (hotel, car, activity)
  createService: async (serviceType: string, serviceData: any) => {
    const basePath = vendorServicePath(serviceType);
    const response = await authenticatedFetch(basePath, {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create ${serviceType}`);
    }
    return response.json();
  },

  // Update service (hotel, car, activity)
  updateService: async (serviceType: string, serviceId: string, serviceData: any) => {
    const basePath = vendorServicePath(serviceType);
    const response = await authenticatedFetch(`${basePath}/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update ${serviceType}`);
    }
    return response.json();
  },

  // Delete service
  deleteService: async (serviceType: string, serviceId: string) => {
    const basePath = vendorServicePath(serviceType);
    const response = await authenticatedFetch(`${basePath}/${serviceId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete ${serviceType}`);
    }
    return response.text();
  },

  // Get vendor reviews (paginated, with search/status filters)
  getVendorReviews: async (
    vendorId: string,
    params?: { page?: number; size?: number; search?: string; status?: string }
  ) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append("page", params.page.toString());
    if (params?.size !== undefined) query.append("size", params.size.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);

    const queryString = query.toString();
    const response = await authenticatedFetch(
      `/api/reviews/vendor/${vendorId}${queryString ? `?${queryString}` : ""}`
    );

    if (response.status === 401 || response.status === 403) {
      return { content: [], totalElements: 0, totalPages: 0 };
    }
    if (!response.ok) {
      throw new Error("Failed to fetch vendor reviews");
    }
    return response.json();
  },

  // Get vendor services (hotels, cars, activities)
  getServices: async (serviceType: string, params?: {
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const basePath = vendorServicePath(serviceType);
    const url = `${basePath}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${serviceType}`);
    }
    return response.json();
  },

  pauseHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/vendor/hotels/${id}/pause`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to pause hotel');
    }
    return response.json();
  },

  resumeHotel: async (id: string) => {
    const response = await authenticatedFetch(`/api/vendor/hotels/${id}/resume`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to resume hotel');
    }
    return response.json();
  },

  pauseCar: async (id: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/pause`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to pause car');
    }
    return response.json();
  },

  resumeCar: async (id: string) => {
    const response = await authenticatedFetch(`/api/car-rentals/${id}/resume`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to resume car');
    }
    return response.json();
  },

  pauseActivity: async (id: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/pause`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to pause activity');
    }
    return response.json();
  },

  resumeActivity: async (id: string) => {
    const response = await authenticatedFetch(`/api/activities/${id}/resume`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to resume activity');
    }
    return response.json();
  },
};

// Flight Seat API endpoints
export const flightSeatApi = {
  // Lấy ghế của chuyến bay
  getSeatsByFlight: async (flightId: string) => {
    const response = await authenticatedFetch(`/api/flight-seats/flight/${flightId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch flight seats');
    }
    return response.json();
  },

  // Lấy số ghế còn trống theo hạng vé
  getAvailableSeatsByClass: async (flightId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/flight-seats/flight/${flightId}/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available seats count');
    }
    return response.json();
  },
};
