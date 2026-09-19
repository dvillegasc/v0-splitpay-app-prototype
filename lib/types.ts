/**
 * Interfaces TypeScript para la API backend de SplitPay.
 * 
 * Regla Legal Inamovible de Cero Custodia:
 * SplitPay opera bajo una regla legal de Cero Custodia; no retiene ni procesa dinero.
 * Los campos monetarios y porcentuales calculados por el backend se procesan y tipan
 * como `string` para garantizar precisión exacta en registros contables e informativos.
 */

export interface User {
  id: string
  name: string
  email: string
  ingreso_mensual_declarado: string
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  token?: string
  access_token?: string
  token_type?: string
  user: User
}

export interface HouseholdMember {
  id: string
  user_id?: string
  name: string
  email?: string
  ingreso_mensual_declarado: string
  porcentaje_aplicado?: string
  monto_asignado?: string
  role?: "Administrador" | "Miembro" | "Tesorero" | string
  is_treasurer?: boolean
  color?: string
}

/**
 * Mapeo de saldos netos por usuario, donde los valores devueltos por el backend son cadenas (`string`).
 */
export type SaldosNetosMap = Record<string, string>

export interface Household {
  id: string
  name: string
  code?: string
  balance?: number
  monto_total?: string
  saldos_netos?: SaldosNetosMap
  members: HouseholdMember[]
  created_at?: string
  updated_at?: string
}

export interface HouseholdResponse {
  household?: Household
  data?: Household
  members?: HouseholdMember[]
}

export interface ExpenseApproval {
  id?: string
  user_id?: string
  name: string
  initials?: string
  approved: boolean
  color?: string
  created_at?: string
}

export interface ExpenseComment {
  id?: string
  user_id?: string
  from: string
  text: string
  color?: string
  created_at?: string
}

export interface ExpenseSplit {
  user_id: string
  name?: string
  monto_asignado: string
  porcentaje_aplicado: string
}

export type ExpenseCategory = "luz" | "mercado" | "licor" | "arriendo" | "servicios" | string
export type ExpenseStatus = "pending" | "approved" | "debate" | string
export type ExpenseType = "direct" | "reimbursement" | string

export interface Expense {
  id: string
  household_id?: string
  title: string
  monto_total: string
  category: ExpenseCategory
  expense_type?: ExpenseType
  status: ExpenseStatus
  proposer: {
    id?: string
    name: string
    initials?: string
    color?: string
  }
  splits?: ExpenseSplit[]
  approvals?: ExpenseApproval[]
  comments?: ExpenseComment[]
  attemptsLeft?: number
  created_at?: string
  updated_at?: string
}

export interface ExpenseResponse {
  expense?: Expense
  expenses?: Expense[]
  data?: Expense | Expense[]
}

export interface CalculationResult {
  monto_total: string
  saldos_netos: SaldosNetosMap
  splits: ExpenseSplit[]
}

export interface ApiErrorDetail {
  loc?: (string | number)[]
  msg: string
  type?: string
}

export interface ApiErrorResponse {
  detail?: string | ApiErrorDetail[] | Record<string, unknown>
  message?: string
}
