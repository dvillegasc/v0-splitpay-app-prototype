export interface User {
  id: string;
  name: string;
  email: string;
  ingreso_mensual_declarado: string;
  created_at?: string;
  updated_at?: string;
}

export interface HouseholdMember {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  ingreso_mensual_declarado: string;
  porcentaje_aplicado?: string;
  monto_asignado?: string;
  role?: string;
  is_treasurer?: boolean;
  color?: string;
  aporte?: number;
}

export interface Household {
  id: string;
  name: string;
  code?: string;
  members: HouseholdMember[];
  saldos_netos?: Record<string, string>;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseSplit {
  id?: string;
  user_id: string;
  user_name?: string;
  monto_asignado: string;
  porcentaje_aplicado: string;
  is_paid?: boolean;
}

export interface ExpenseApproval {
  user_id: string;
  user_name?: string;
  approved: boolean;
  created_at?: string;
}

export interface ExpenseComment {
  id?: string;
  user_id: string;
  user_name?: string;
  text: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  household_id: string;
  proposer_id: string;
  proposer_name?: string;
  title?: string;
  concept?: string;
  monto_total: string;
  category?: 'luz' | 'mercado' | 'licor' | string;
  status: 'pending' | 'approved' | 'debate' | 'rejected' | string;
  type?: 'direct' | 'reimbursement' | string;
  receipt_url?: string;
  attempts_left?: number;
  splits?: ExpenseSplit[];
  approvals?: ExpenseApproval[];
  comments?: ExpenseComment[];
  created_at?: string;
  updated_at?: string;
}

export interface CalculationResult {
  monto_total: string;
  splits: ExpenseSplit[];
  saldos_netos: Record<string, string>;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  detail?: string | any;
  data?: T;
  household?: Household;
  households?: Household[];
  expense?: Expense;
  expenses?: Expense[];
  user?: User;
}
