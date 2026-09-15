/**
 * Types TypeScript para la comunicación con la API Backend de SplitPay.
 *
 * NOTA DE CUMPLIMIENTO CERO CUSTODIA Y PRECISIÓN NUMÉRICA:
 * Los valores monetarios y porcentuales devueltos por el backend se tipan como `string`
 * (`ingreso_mensual_declarado`, `monto_total`, `monto_asignado`, `porcentaje_aplicado`
 * y los valores dentro de `saldos_netos`) para evitar pérdidas de precisión de punto flotante
 * en Javascript y mantener congruencia estricta con la API Backend (Decimal/Numeric).
 */

export type Role = 'Administrador' | 'Miembro' | 'Tesorero' | string;
export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'debate' | string;
export type DivisionStrategy = 'proportional' | 'equal' | 'custom' | string;

/**
 * Representa la estructura de saldos netos calculados entre los miembros de un hogar o cartera.
 * Los valores son cadenas de texto que representan montos en COP.
 */
export type SaldosNetos = Record<string, string>;

/**
 * Perfil de usuario registrado en la plataforma.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  ingreso_mensual_declarado: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Representación de un miembro perteneciente a una cartera/hogar.
 */
export interface HouseholdMember {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  role: Role;
  ingreso_mensual_declarado: string;
  porcentaje_aplicado?: string;
  monto_asignado?: string;
  is_treasurer?: boolean;
  color?: string;
}

/**
 * Desglose o partición de un gasto para un usuario específico.
 */
export interface ExpenseSplit {
  id?: string;
  user_id: string;
  user_name?: string;
  monto_asignado: string;
  porcentaje_aplicado: string;
  status?: string;
}

/**
 * Estructura de gasto propuesto o registrado en una cartera.
 */
export interface Expense {
  id: string;
  household_id: string;
  title: string;
  monto_total: string;
  monto_asignado?: string;
  category?: string;
  status: ExpenseStatus;
  proposer_id?: string;
  proposer_name?: string;
  division_strategy?: DivisionStrategy;
  splits?: ExpenseSplit[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Estructura principal de una Cartera Compartida / Hogar.
 */
export interface Household {
  id: string;
  name: string;
  balance?: string;
  monto_total?: string;
  saldos_netos?: SaldosNetos;
  members: HouseholdMember[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Respuestas estándar de la API de Autenticación.
 */
export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  user?: User;
  detail?: string;
}

/**
 * Respuestas estándar de la API para endpoints de Carteras / Hogares.
 */
export interface HouseholdResponse {
  household?: Household;
  households?: Household[];
  saldos_netos?: SaldosNetos;
  detail?: string;
}

/**
 * Respuestas estándar de la API para endpoints de Gastos.
 */
export interface ExpenseResponse {
  expense?: Expense;
  expenses?: Expense[];
  monto_total?: string;
  monto_asignado?: string;
  detail?: string;
}

/**
 * Respuesta del cálculo de liquidación o balance de saldos netos.
 */
export interface SettlementResponse {
  household_id: string;
  monto_total: string;
  saldos_netos: SaldosNetos;
  detail?: string;
}

/**
 * Estructura genérica para detalles de error devueltos por FastAPI / Pydantic.
 */
export interface ApiErrorDetail {
  loc?: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail: string | ApiErrorDetail[] | Record<string, unknown>;
  message?: string;
}
