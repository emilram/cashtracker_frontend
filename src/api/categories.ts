// src/api/categories.ts
import type { Category, CategoryInput } from '../types';
import apiClient from './client';

export const categoriesApi = {
  // Obtener todas las categorías
  getAll: async (type?: 'income' | 'expense'): Promise<{ categories: Category[] }> => {
    const params = type ? { type } : {};
    const response = await apiClient.get<{ categories: Category[] }>('/categories', { params });
    return response.data;
  },

  // Obtener categoría por ID
  getById: async (id: string): Promise<{ category: Category }> => {
    const response = await apiClient.get<{ category: Category }>(`/categories/${id}`);
    return response.data;
  },

  // Crear categoría personalizada
  create: async (data: CategoryInput): Promise<{ category: Category }> => {
    const response = await apiClient.post<{ category: Category }>('/categories', data);
    return response.data;
  },

  // Actualizar categoría
  update: async (id: string, data: Partial<CategoryInput>): Promise<{ category: Category }> => {
    const response = await apiClient.put<{ category: Category }>(`/categories/${id}`, data);
    return response.data;
  },

  // Eliminar categoría
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  },
};