const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
  body?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieves JWT token from localStorage or cookies if available.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // 1. Try localStorage
  try {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('splitpay_token');
    if (token) return token;
  } catch {
    // localStorage access might throw in private mode / restricted contexts
  }

  // 2. Try cookies
  try {
    const match = document.cookie.match(
      /(?:^|; )\s*(?:token|auth_token|jwt|splitpay_token)=([^;]*)/
    );
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch {
    // ignore cookie reading errors
  }

  return null;
}

/**
 * Helper to store JWT token in localStorage and cookies.
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('jwt', token);
    localStorage.setItem('splitpay_token', token);
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } catch {
    // ignore
  }
}

/**
 * Helper to clear JWT token from localStorage and cookies.
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('splitpay_token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  } catch {
    // ignore
  }
}

async function request<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, token, headers, body, ...customConfig } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  // Interceptor: Inyectar automáticamente el token JWT si existe (vía opción explícita, localStorage o cookies)
  const activeToken = token || getAuthToken();

  const defaultHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
  };

  const requestBody =
    body && !isFormData && typeof body === 'object'
      ? JSON.stringify(body)
      : body;

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: requestBody,
    ...customConfig,
  };

  const response = await fetch(url, config);

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && data?.message)
      || (typeof data === 'string' && data)
      || response.statusText
      || 'Error en la petición a la API';
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T = any>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
