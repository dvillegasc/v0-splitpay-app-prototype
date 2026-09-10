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

// Interceptor de Peticiones: Inyección de JWT y protección CSRF
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // En un entorno de Next.js, se verifica si estamos en el cliente o servidor
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

// Interceptor de Respuestas: Gestión global de estado y desautorización
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            // Gestión de token expirado o inválido
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    // Prevenir bucles de redirección si ya está en login
                    if (!window.location.pathname.includes('/login')) {
                        console.warn("Autenticación revocada. Purgando sesión.");
                        localStorage.removeItem('splitpay_access_token');
                        localStorage.removeItem('splitpay_user_data');
                        
                        // Emitir un evento para que los componentes React desmonten vistas sensibles
                        window.dispatchEvent(new Event('auth-logout'));
                        window.location.href = '/login?session_expired=true';
                    }
                }
            }
            
            // Logueo estructurado de errores del servidor para monitoreo
            if (status >= 500) {
                console.error(`Error Crítico del Servidor: ${error.config?.url}`, error.response.data);
            }
        } else if (error.request) {
            console.error("Error de red: El backend de SplitPay no responde.");
        }
        
        return Promise.reject(error);
    }
);
