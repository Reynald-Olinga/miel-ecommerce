// client/src/api/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/* -------------------------------------------------
   Création de l’instance Axios
-------------------------------------------------- */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/* -------------------------------------------------
   Intercepteur de REQUÊTE : injection du token JWT
-------------------------------------------------- */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ⚠️ Avant de lire localStorage, on vérifie qu’on est côté client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('[AXIOS REQUEST] token trouvé →', token ? `${token.slice(0, 10)}…` : 'undefined');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------------
   Intercepteur de RÉPONSE : rafraîchissement token
-------------------------------------------------- */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        if (data?.token) {
          localStorage.setItem('authToken', data.token);
          // On relance la requête initiale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr: any) {
        console.error('[AXIOS REFRESH] échec →', refreshErr.response?.data || refreshErr.message);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    const message = error.response?.data?.message || error.message || 'Erreur réseau';
    console.error(`[AXIOS ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} : ${message}`);
    return Promise.reject(message);
  }
);

export default apiClient;