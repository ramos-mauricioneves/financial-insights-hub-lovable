// Types for Organizze API

export interface OrganizzeCredentials {
  email: string;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Account {
  id: number;
  name: string;
  description: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
  default: boolean;
  type: 'checking' | 'savings' | 'other';
}

export interface Category {
  id: number;
  name: string;
  color: string;
  parent_id: number | null;
  is_default: boolean;
  type: 'expense' | 'revenue';
}

export interface CreditCard {
  id: number;
  name: string;
  description: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
  default: boolean;
  limit: number;
  closing_day: number;
  due_day: number;
}

export interface Transaction {
  id: number;
  description: string;
  date: string;
  paid: boolean;
  amount_cents: number;
  total_installments: number;
  installment: number;
  recurring: boolean;
  account_id: number | null;
  category_id: number;
  contact_id: number | null;
  credit_card_id: number | null;
  credit_card_invoice_id: number | null;
  created_at: string;
  updated_at: string;
  attachments_count: number;
  notes: string | null;
  tags: string[];
}

export interface CreditCardInvoice {
  id: number;
  date: string;
  starting_date: string;
  closing_date: string;
  amount_cents: number;
  payment_amount_cents: number;
  balance_cents: number;
  previous_balance_cents: number;
  credit_card_id: number;
}

export interface FinancialSummary {
  total_revenues: number;
  total_expenses: number;
  balance: number;
  accounts_balance: number;
  credit_cards_balance: number;
}

export interface CategoryExpense {
  category: Category;
  total_amount: number;
  percentage: number;
  transactions_count: number;
}

export interface MonthlyData {
  month: string;
  revenues: number;
  expenses: number;
  balance: number;
}