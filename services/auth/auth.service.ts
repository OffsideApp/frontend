// services/auth.service.ts
import { api } from '../axios';
import { 
  RegisterDto, 
  LoginDto, 
  VerifyEmailDto, 
  AuthResponse, 
  LoginResponse, 
  RegisterResponse, 
  selectClubDto,
  SetProfileDto,
  UserProfileResponse
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
  selectClub: async (data: selectClubDto) => {
    const response = await api.post<AuthResponse>('/auth/select-club', data);
    return response.data
  },
  setProfile: async (data: SetProfileDto ) => {
    const response = await api.post<AuthResponse>('/auth/set-profile', data);
    return response.data;
  },
  
  uploadAvatar: async (formData: FormData) => {
    const { data } = await api.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getProfile: async (username?: string): Promise<UserProfileResponse> => {
    const url = username ? `/auth/profile/${username}` : '/auth/profile';
    const { data } = await api.get(url);
    return data;
  },

  toggleFollow: async (targetUserId: string) => {
    const { data } = await api.post('/auth/follow', { targetUserId });
    return data;
  },
};