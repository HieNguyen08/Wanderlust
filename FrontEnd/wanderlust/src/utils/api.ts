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
