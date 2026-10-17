/**
 * Definciones de tipos TypeScript para el Frontend de SplitPay.
 *
 * REGLA LEGAL DE CERO CUSTODIA:
 * SplitPay opera bajo una regla legal inamovible de "Cero Custodia".
 * La UI nunca debe insinuar que SplitPay retiene o procesa dinero.
 *
 * NOTA DE TIPADO DE MONTOS:
 * Los campos `ingreso_mensual_declarado`, `monto_total`, `monto_asignado`,
 * `porcentaje_aplicado` y los valores dentro de `saldos_netos` se definen
 * rigurosamente como `string` para garantizar la precisión decimal enviada por el backend.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  ingreso_mensual_declarado: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  token?: string;
  user?: User;
  detail?: string;
}

export interface HouseholdMember {
  id?: string;
  user_id?: string;
  name: string;
  email?: string;
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
  members: HouseholdMember[];
  saldos_netos?: Record<string, string>;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseAllocation {
  user_id: string;
  user_name?: string;
  ingreso_mensual_declarado?: string;
  porcentaje_aplicado: string;
  monto_asignado: string;
}

export interface ExpenseApproval {
  user_id?: string;
  name: string;
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

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'debate';

export interface Expense {
  id: string;
  household_id?: string;
  proposer_id?: string;
  proposer_name?: string;
  title: string;
  monto_total: string;
  status: ExpenseStatus;
  category?: string;
  allocations?: ExpenseAllocation[];
  approvals?: ExpenseApproval[];
  comments?: ExpenseComment[];
  attempts_left?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SettlementSummary {
  household_id: string;
  monto_total: string;
  saldos_netos: Record<string, string>;
  allocations?: ExpenseAllocation[];
}

export interface ApiResponse<T = any> {
  data?: T;
  detail?: string;
  message?: string;
  household?: Household;
  user?: User;
}
