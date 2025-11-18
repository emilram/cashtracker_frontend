// src/hooks/useBudgets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi } from '../api/budgets';
import type { BudgetInput } from '../types';

export const useBudgets = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => budgetsApi.getAll(month, year),
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: () => budgetsApi.getById(id),
    enabled: !!id,
  });
};

export const useBudgetAlerts = () => {
  return useQuery({
    queryKey: ['budgets', 'alerts'],
    queryFn: () => budgetsApi.getAlerts(),
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetInput) => budgetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetInput> }) =>
      budgetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};