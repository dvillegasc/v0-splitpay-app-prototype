export interface User {
  id?: string;
  name: string;
  email: string;
  ingreso_mensual_declarado?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface HouseholdMember {
  id?: string;
  user_id?: string;
  name: string;
  email?: string;
  role?: string;
  ingreso_mensual_declarado?: string;
  monto_asignado?: string;
  porcentaje_aplicado?: string;
  color?: string;
  is_treasurer?: boolean;
}

export type SaldosNetos = Record<string, string>;

export interface Household {
  id?: string;
  name?: string;
  balance?: number;
  members?: HouseholdMember[];
  saldos_netos?: SaldosNetos;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface ExpenseApproval {
  user_id?: string;
  name?: string;
  initials?: string;
  approved: boolean;
  color?: string;
}

export interface ExpenseComment {
  from: string;
  text: string;
  color?: string;
}

export interface Expense {
  id: string;
  title: string;
  monto_total: string;
  status: 'pending' | 'approved' | 'debate' | string;
  category?: 'luz' | 'mercado' | 'licor' | string;
  proposer?: {
    name: string;
    initials: string;
    color: string;
  };
  approvals?: ExpenseApproval[];
  comments?: ExpenseComment[];
  attemptsLeft?: number;
  household_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user?: User;
  detail?: string;
  message?: string;
}

export interface HouseholdResponse {
  household?: Household;
  households?: Household[];
  data?: Household | Household[];
}
