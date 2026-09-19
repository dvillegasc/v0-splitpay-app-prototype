import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración estricta de la URL pública del backend en Render / Vercel
const DEFAULT_RENDER_API_URL = 'https://splitpay-backend.onrender.com';
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_RENDER_API_URL;

if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn(`AVISO: NEXT_PUBLIC_API_URL no está definida explícitamente. Apuntando por defecto a Render: ${DEFAULT_RENDER_API_URL}`);
}

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('splitpay_access_token');
    }
    return null;
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('splitpay_access_token', token);
    }
};

export const clearAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('splitpay_access_token');
        localStorage.removeItem('splitpay_user_data');
    }
};

export const apiClient: AxiosInstance = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Extrae y normaliza el mensaje de error devuelto por la API del backend.
 * Prioriza la lectura de `data?.detail` en vez de `data?.message`.
 */
export function parseApiError(error: any): string {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as any;
        if (data?.detail) {
            if (typeof data.detail === 'string') {
                return data.detail;
            }
            if (Array.isArray(data.detail)) {
                return data.detail.map((e: any) => e?.msg || e?.message || JSON.stringify(e)).join(', ');
            }
            if (typeof data.detail === 'object') {
                return JSON.stringify(data.detail);
            }
        }
        if (data?.message) {
            return data.message;
        }
    }
    return error?.message || 'Ocurrió un error inesperado en la comunicación con la API.';
}

// Interceptor de Peticiones: Inyección de JWT y protección CSRF
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuestas: Gestión global de estado, parseo de errores y desautorización
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as any;

            // Corregir el parseo de errores para leer `data?.detail` en vez de `data?.message`
            const detailMessage =
                typeof data?.detail === 'string'
                    ? data.detail
                    : Array.isArray(data?.detail)
                    ? data.detail.map((e: any) => e?.msg || e?.message || JSON.stringify(e)).join(', ')
                    : typeof data?.detail === 'object' && data?.detail !== null
                    ? JSON.stringify(data.detail)
                    : data?.detail || data?.message;

            if (detailMessage) {
                error.message = detailMessage;
                (error as any).detail = detailMessage;
            }

            if (data) {
                (error as any).data = data;
            }

            // Gestión de token expirado o inválido
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    // Prevenir bucles de redirección si ya está en login
                    if (!window.location.pathname.includes('/login')) {
                        console.warn("Autenticación revocada. Purgando sesión.");
                        clearAuthToken();
                        
                        // Emitir un evento para que los componentes React desmonten vistas sensibles
                        window.dispatchEvent(new Event('auth-logout'));
                        window.location.href = '/login?session_expired=true';
                    }
                }
            }
            
            // Logueo estructurado de errores del servidor para monitoreo
            if (status >= 500) {
                console.error(`Error Crítico del Servidor: ${error.config?.url}`, data);
            }
        } else if (error.request) {
            console.error("Error de red: El backend de SplitPay en Render no responde.");
        }
        
        return Promise.reject(error);
    }
);

export const api = {
    get: async (url: string, config?: any) => {
        const response = await apiClient.get(url, config);
        return response.data;
    },
    post: async (url: string, data?: any, config?: any) => {
        const response = await apiClient.post(url, data, config);
        return response.data;
    },
    put: async (url: string, data?: any, config?: any) => {
        const response = await apiClient.put(url, data, config);
        return response.data;
    },
    delete: async (url: string, config?: any) => {
        const response = await apiClient.delete(url, config);
        return response.data;
    },
};
