// src/api/budgets.ts
import type { Budget, BudgetAlert, BudgetInput } from '../types';
import apiClient from './client';

export const budgetsApi = {
  // Obtener todos los presupuestos
  getAll: async (month?: number, year?: number): Promise<{ budgets: Budget[] }> => {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await apiClient.get<{ budgets: Budget[] }>('/budgets', { params });
    return response.data;
  },

  // Obtener presupuesto por ID
  getById: async (id: string): Promise<{ budget: Budget }> => {
    const response = await apiClient.get<{ budget: Budget }>(`/budgets/${id}`);
    return response.data;
  },

  // Crear presupuesto
  create: async (data: BudgetInput): Promise<{ budget: Budget }> => {
    const response = await apiClient.post<{ budget: Budget }>('/budgets', data);
    return response.data;
  },

  // Actualizar presupuesto
  update: async (id: string, data: Partial<BudgetInput>): Promise<{ budget: Budget }> => {
    const response = await apiClient.put<{ budget: Budget }>(`/budgets/${id}`, data);
    return response.data;
  },

  // Eliminar presupuesto
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/budgets/${id}`);
    return response.data;
  },

  // Obtener alertas de presupuestos
  getAlerts: async (): Promise<{ alerts: BudgetAlert[] }> => {
    const response = await apiClient.get<{ alerts: BudgetAlert[] }>('/budgets/alerts');
    return response.data;
  },
};