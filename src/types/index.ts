// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string;
  userId: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string;
  categoryId: string;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
  category?: Category;
  spent?: number;
  remaining?: number;
  percentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetInput {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface BudgetAlert {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'ok' | 'warning' | 'exceeded';
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; path: string }>;
}