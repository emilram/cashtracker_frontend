// src/api/transactions.ts
import type { Transaction, TransactionFilters, TransactionInput } from '../types';
import apiClient from './client';

export const transactionsApi = {
  // Obtener todas las transacciones con filtros
  getAll: async (filters?: TransactionFilters): Promise<{ transactions: Transaction[] }> => {
    const response = await apiClient.get<{ transactions: Transaction[] }>('/transactions', {
      params: filters,
    });
    return response.data;
  },

  // Obtener transacción por ID
  getById: async (id: string): Promise<{ transaction: Transaction }> => {
    const response = await apiClient.get<{ transaction: Transaction }>(`/transactions/${id}`);
    return response.data;
  },

  // Crear transacción
  create: async (data: TransactionInput): Promise<{ transaction: Transaction }> => {
    const response = await apiClient.post<{ transaction: Transaction }>('/transactions', data);
    return response.data;
  },

  // Actualizar transacción
  update: async (id: string, data: Partial<TransactionInput>): Promise<{ transaction: Transaction }> => {
    const response = await apiClient.put<{ transaction: Transaction }>(`/transactions/${id}`, data);
    return response.data;
  },

  // Eliminar transacción
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/transactions/${id}`);
    return response.data;
  },
};