// types/auth.types.ts

// --- DTOs (Data Transfer Objects) ---
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface selectClubDto{
  clubName: string
}

// --- RESPONSES ---
export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  message: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  hasSelectedClub: boolean;
  hasUsername: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}