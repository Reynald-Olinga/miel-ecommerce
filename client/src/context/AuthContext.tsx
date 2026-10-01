// client/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/authAPI';

/* -------------------------------------------------
   Types
-------------------------------------------------- */
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

/* -------------------------------------------------
   Contexte
-------------------------------------------------- */
export const AuthCtx = createContext<AuthContextType>({
  token: null,
  refreshToken: null,
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

/* -------------------------------------------------
   Provider
-------------------------------------------------- */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ---------- États ----------
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('authToken')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem('refreshToken')
  );
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    try {
      return raw && raw !== 'undefined' ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Fin du chargement initial
  useEffect(() => setLoading(false), []);

  // ---------- Actions ----------
  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
      console.log('[DEBUG AUTH] /login réponse brute', res);

    if (res.success && res.data?.token && res.data?.user) {
      const { token, refreshToken, user } = res.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
    } else {
      throw new Error(res.error || 'Erreur de connexion');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // ---------- Rendu ----------
  return (
    <AuthCtx.Provider
      value={{
        token,
        refreshToken,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};