// src/services/auth.service.ts
import api from '@/src/lib/api';
import type { LoginRequest, LoginResponse, UserProfile } from '@/src/types/auth';

export const authService = {
  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/api/v1/auth/login', credentials);
    
    if (response.data.success && response.data.data?.accessToken) {
      // Store tokens and user data
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Refresh access token
  async refreshToken(refreshToken: string) {
    const response = await api.post('/api/v1/auth/refresh', { refreshToken });
    
    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  },

  // Validate token
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await api.get('/api/v1/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valid === true;
    } catch {
      return false;
    }
  },

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/api/v1/auth/profile');
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      // Clear local storage regardless
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
};
