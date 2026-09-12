import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración estricta que exige la inyección de la variable de entorno
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
    console.error("FATAL: NEXT_PUBLIC_API_URL no está definida en el entorno.");
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
        localStorage.removeItem('splitpay_user');
    }
};

export const parseErrorMessage = (error: any): string => {
    const data = error?.response?.data || error?.data || error;
    if (typeof data?.detail === 'string') {
        return data.detail;
    }
    if (Array.isArray(data?.detail)) {
        return data.detail.map((item: any) => item?.msg || item?.message || JSON.stringify(item)).join(', ');
    }
    if (data?.detail && typeof data.detail === 'object') {
        return JSON.stringify(data.detail);
    }
    return data?.message || error?.message || 'Ocurrió un error inesperado.';
};

// Interceptor de Peticiones: Inyección de JWT y protección CSRF
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = getAuthToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuestas: Gestión global de estado y desautorización
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as any;

            // Parseo estricto de errores leyendo data?.detail en lugar de data?.message
            const errorMessage = typeof data?.detail === 'string'
                ? data.detail
                : Array.isArray(data?.detail)
                ? data.detail.map((item: any) => item?.msg || item?.message || JSON.stringify(item)).join(', ')
                : data?.detail || data?.message || error.message;

            error.message = errorMessage;
            if (data) {
                (error as any).detail = data?.detail;
                (error as any).data = data;
            }

            // Gestión de token expirado o inválido
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    if (!window.location.pathname.includes('/login')) {
                        console.warn("Autenticación revocada. Purgando sesión.");
                        clearAuthToken();
                        
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
            console.error("Error de red: El backend de SplitPay no responde.");
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
    patch: async (url: string, data?: any, config?: any) => {
        const response = await apiClient.patch(url, data, config);
        return response.data;
    },
    delete: async (url: string, config?: any) => {
        const response = await apiClient.delete(url, config);
        return response.data;
    },
};
