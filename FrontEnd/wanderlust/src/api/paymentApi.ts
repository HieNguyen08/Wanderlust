import { API_BASE_URL, tokenService } from '../utils/api';

export type PaymentMethod = 'STRIPE';

export interface CreatePaymentRequest {
  bookingId: string;
  userId: string;
  amount: number;
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

  const response = await fetch(`${API_BASE_URL}/api/payments/booking/${bookingId}`, {
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



export const paymentApi = {
  initiatePayment,
  getPaymentStatus,
  getPaymentByBookingId,
  topUpWallet
};
