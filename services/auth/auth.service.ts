// services/auth.service.ts
import { api } from '../axios';
import { 
  RegisterDto, 
  LoginDto, 
  VerifyEmailDto, 
  AuthResponse, 
  LoginResponse, 
  RegisterResponse 
} from '../../types/auth.types';

export const AuthService = {
  
  register: async (data: RegisterDto) => {
    const response = await api.post<AuthResponse<RegisterResponse>>('/auth/register', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailDto) => {
    const response = await api.post<AuthResponse>('/auth/verify', data);
    return response.data;
  },

  login: async (data: LoginDto) => {
    const response = await api.post<AuthResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
};