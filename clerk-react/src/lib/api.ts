import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
let tokenProvider: (() => Promise<string | undefined>) | null = null;

export function setTokenProvider(provider: () => Promise<string | undefined>) {
  tokenProvider = provider;
}

export async function apiRequest(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any,
  token?: string
) {
  const url = `${API_URL}${endpoint}`;
  const config: any = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // If token not supplied, try token provider (registered by app)
  if (!token && tokenProvider) {
    try {
      token = await tokenProvider();
    } catch (e) {
      console.warn('Token provider failed:', e);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (data) {
    config.data = data;
  }
  
  try {
    console.log(`API Request: ${method} ${url}`);
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: url
    });
    
    // Better error handling
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
      throw new Error(`Cannot connect to server at ${API_URL}. Make sure the backend server is running and accessible.`);
    }
    
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    }
    
    if (error.request) {
      // Request was made but no response received
      throw new Error(`Network error: No response from server at ${API_URL}. Check if the backend is running.`);
    }
    
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred');
  }
}
