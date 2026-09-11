import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

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

export const api = apiClient;

export function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('splitpay_access_token');
    }
    return null;
}

export function setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('splitpay_access_token', token);
    }
}

export function clearAuthToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('splitpay_access_token');
        localStorage.removeItem('splitpay_user');
    }
}

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('splitpay_access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                if (typeof window !== 'undefined') {
                    if (!window.location.pathname.includes('/login')) {
                        console.warn("Autenticación revocada. Purgando sesión.");
                        localStorage.removeItem('splitpay_access_token');
                        localStorage.removeItem('splitpay_user');
                        
                        window.dispatchEvent(new Event('auth-logout'));
                        window.location.href = '/login?session_expired=true';
                    }
                }
            }
            
            if (status >= 500) {
                console.error(`Error Crítico del Servidor: ${error.config?.url}`, error.response.data);
            }
        } else if (error.request) {
            console.error("Error de red: El backend de SplitPay no responde.");
        }
        
        return Promise.reject(error);
    }
);
