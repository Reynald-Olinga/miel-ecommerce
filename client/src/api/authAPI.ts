// client/src/api/authAPI.ts
import apiClient from './client';

/* -------------------------------------------------
   Types
-------------------------------------------------- */
interface UserData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

interface TokenResponse {
  token?: string;
  accessToken?: string; // fallback possible
  refreshToken?: string;
  userId?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

/* -------------------------------------------------
   API
-------------------------------------------------- */
export const authAPI = {
  async register(userData: UserData): Promise<ApiResponse<TokenResponse>> {
    try {
      const { data, status } = await apiClient.post('/auth/register', userData);

      // Stockage
      const token = data.token || data.accessToken;
      if (token) {
        localStorage.setItem('authToken', token);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { success: true, data, status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<TokenResponse>> {
    try {
      const { data, status } = await apiClient.post('/auth/login', credentials);

      // Stockage
      const token = data.token || data.accessToken;
      if (token) {
        localStorage.setItem('authToken', token);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { success: true, data, status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Email ou mot de passe incorrect',
        status: error.response?.status,
      };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('[AUTH API] logout effectué');
  },

  validate: {
    email: (email: string): boolean =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone: string): boolean =>
      /^[0-9]{9,15}$/.test(phone),
    password: (password: string): { valid: boolean; message?: string } =>
      password.length < 8
        ? { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' }
        : { valid: true },
  },
};

/* -------------------------------------------------
   Export de types & module
-------------------------------------------------- */
export type { UserData, ApiResponse, TokenResponse };
export default authAPI;