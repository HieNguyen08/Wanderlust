import { API_BASE_URL, authenticatedFetch, tokenService } from '../utils/api';

export type PaymentMethod = 'STRIPE' | 'WALLET';

export interface CreatePaymentRequest {
  bookingId: string;
  userId: string;
  userEmail?: string;
  amount: number;
  payableAmount?: number;
  originalAmount?: number;
  discountAmount?: number;
  voucherCode?: string;
  voucherMeta?: unknown;
  currency?: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
  id: string;
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  metadata?: {
    paymentUrl?: string;
    stripe_session_id?: string;
  };
  createdAt: string;
}

export interface WalletTopUpRequest {
  amount: number;
  paymentMethod: 'STRIPE'; // Wallet top-up only supports STRIPE
}

export interface WalletTopUpResponse {
  transactionId: string;
  paymentUrl?: string;
  status: string;
}

export interface PaymentHistoryItem {
  id: string;
  transactionId: string;
  bookingId: string;
  userId: string;
  userEmail: string;
  amount: string | number;
  originalAmount?: string | number;
  discountAmount?: string | number;
  voucherCode?: string;
  voucherMeta?: unknown;
  currency: string;
  paymentMethod: string;
  paymentGateway?: string | null;
  status: string;
  gatewayTransactionId?: string;
  createdAt: string;
  paidAt?: string;
  metadata?: {
    paymentUrl?: string;
    stripe_session_id?: string;
  };
}

/**
 * Initiate a payment for booking (Flight, Hotel, Car Rental, Activity)
 */
export const initiatePayment = async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
  const token = tokenService.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/api/payments/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to initiate payment');
  }

  return response.json();
};

/**
 * Get payment status by ID
 */
export const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  const token = tokenService.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to get payment status');
  }

  return response.json();
};

/**
 * Get payment by booking ID
 */
export const getPaymentByBookingId = async (bookingId: string): Promise<PaymentResponse> => {
  const token = tokenService.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await authenticatedFetch(`/api/payments/booking/${bookingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to get payment by booking ID');
  }

  return response.json();
};

/**
 * Top-up wallet using STRIPE
 */
export const topUpWallet = async (data: WalletTopUpRequest): Promise<WalletTopUpResponse> => {
  const token = tokenService.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  console.log('🔐 Token found:', token ? 'Yes' : 'No');
  console.log('📤 Sending request to:', `${API_BASE_URL}/api/v1/wallet/deposit`);
  console.log('📦 Request body:', data);

  const response = await fetch(`${API_BASE_URL}/api/v1/wallet/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: data.amount,
      paymentMethod: data.paymentMethod
    })
  });

  console.log('📥 Response status:', response.status);
  console.log('📥 Response ok:', response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error response:', errorText);
    throw new Error(errorText || 'Failed to top up wallet');
  }

  const result = await response.json();
  console.log('✅ Response data:', result);
  return result;
};

/**
 * Get payment history by user ID
 */
export const getPaymentHistoryByUserId = async (userId: string): Promise<PaymentHistoryItem[]> => {
  const token = tokenService.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  console.log('📞 Fetching payment history for userId:', userId);
  console.log('🔐 Token:', token ? 'Present' : 'Missing');

  const response = await authenticatedFetch(`/api/payments/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('📥 Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error response:', errorText);
    throw new Error(errorText || 'Failed to get payment history');
  }

  const data = await response.json();
  const normalized = Array.isArray(data) ? data : (data?.data ?? []);
  console.log('✅ Payment history data:', normalized);
  return normalized;
};

export const paymentApi = {
  initiatePayment,
  getPaymentStatus,
  getPaymentByBookingId,
  topUpWallet,
  getPaymentHistoryByUserId
};