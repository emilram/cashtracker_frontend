// src/api/auth.ts
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types';
import apiClient from './client';

export const authApi = {
  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil del usuario actual
  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },
};