/**
 * Tipos e interfaces TypeScript para la API de SplitPay.
 * 
 * Regla legal inamovible de Cero Custodia:
 * SplitPay opera únicamente como gestor de cálculos e instrucciones de pago.
 * Los datos monetarios provenientes del backend se reciben y procesan en formato string
 * para garantizar precisión decimal exacta y coherencia con la API.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  ingreso_mensual_declarado: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  user: User;
  message?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  user: User;
}

export interface HouseholdMember {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  role?: string;
  is_treasurer?: boolean;
  color?: string;
  ingreso_mensual_declarado: string;
  porcentaje_aplicado?: string;
  monto_asignado?: string;
}

export interface Household {
  id: string;
  name?: string;
  balance?: string;
  members?: HouseholdMember[];
  created_at?: string;
  updated_at?: string;
}

export interface HouseholdResponse {
  household: Household;
  message?: string;
}

export interface ExpenseAssignment {
  id?: string;
  expense_id?: string;
  user_id: string;
  user_name?: string;
  monto_asignado: string;
  porcentaje_aplicado: string;
}

export interface Expense {
  id: string;
  household_id: string;
  concept: string;
  title?: string;
  monto_total: string;
  proposer_id: string;
  proposer_name?: string;
  status: 'pending' | 'approved' | 'rejected' | 'debate' | string;
  expense_type?: 'direct' | 'reimbursement' | string;
  category?: 'luz' | 'mercado' | 'licor' | string;
  assignments?: ExpenseAssignment[];
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseResponse {
  expense: Expense;
  message?: string;
}

export interface SaldosNetosResponse {
  household_id: string;
  monto_total?: string;
  saldos_netos: Record<string, string>;
  updated_at?: string;
}

export interface ApiErrorDetail {
  loc?: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail?: string | ApiErrorDetail[] | Record<string, unknown>;
  message?: string;
}
