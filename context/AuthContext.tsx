'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '@/lib/api';

export interface User {
  id?: string;
  name: string;
  email: string;
  ingreso_mensual_declarado?: number;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'splitpay_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Fetches current user profile from the backend API (/auth/me)
   */
  const refreshUser = useCallback(async () => {
    const activeToken = getAuthToken();
    if (!activeToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const userData = response?.user || response?.data?.user || response?.data || response;
      if (userData && typeof userData === 'object') {
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        }
      }
    } catch (err) {
      console.warn('No se pudo actualizar el perfil del usuario desde la API:', err);
      // Fallback a localStorage si falla la petición API
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(USER_STORAGE_KEY);
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // ignore JSON parse error
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inicialización del estado de autenticación en montaje
  useEffect(() => {
    const savedToken = getAuthToken();
    setTokenState(savedToken);

    if (savedToken) {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(USER_STORAGE_KEY);
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // ignore
          }
        }
      }
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback((newToken: string, userData?: User) => {
    setAuthToken(newToken);
    setTokenState(newToken);

    if (userData) {
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      }
    } else {
      refreshUser();
    }
  }, [refreshUser]);

  const logout = useCallback(() => {
    clearAuthToken();
    setTokenState(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
