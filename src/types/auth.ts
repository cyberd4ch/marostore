// src/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  error?: string;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  created_at?: string;
}

export interface UserProfile {
  success: boolean;
  data: User;
}

export interface ValidationSchema {
  email: string;
  password: string;
}
