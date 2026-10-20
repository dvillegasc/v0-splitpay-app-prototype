export interface User {
  id: string;
  email: string;
  name: string;
  ingreso_mensual_declarado: string;
  created_at?: string;
  updated_at?: string;
}

export interface HouseholdMember {
  id: string;
  household_id?: string;
  user_id?: string;
  name: string;
  email: string;
  ingreso_mensual_declarado?: string;
  role: string;
  is_treasurer?: boolean;
  color?: string;
  aporte?: number;
}

export interface Household {
  id: string;
  name: string;
  balance?: number;
  created_at?: string;
  updated_at?: string;
  members?: HouseholdMember[];
  debts?: Expense[];
}

export interface ExpenseAssignment {
  id?: string;
  expense_id?: string;
  user_id: string;
  monto_asignado: string;
  porcentaje_aplicado: string;
}

export interface ExpenseApproval {
  user_id: string;
  name?: string;
  initials?: string;
  approved: boolean;
  color?: string;
}

export interface ExpenseComment {
  id?: string;
  from: string;
  text: string;
  color?: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  household_id: string;
  created_by?: string;
  proposer_id?: string;
  title: string;
  monto_total: string;
  category?: 'luz' | 'mercado' | 'licor' | string;
  expense_type?: 'direct' | 'reimbursement' | string;
  status: 'pending' | 'approved' | 'rejected' | 'debate' | string;
  assignments?: ExpenseAssignment[];
  approvals?: ExpenseApproval[];
  comments?: ExpenseComment[];
  attempts_left?: number;
  created_at?: string;
  updated_at?: string;
}

export type SaldosNetos = Record<string, string>;

export interface HouseholdBalancesResponse {
  household_id: string;
  saldos_netos: Record<string, string>;
  currency?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  user: User;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  detail?: string | any[];
  status?: number;
}
