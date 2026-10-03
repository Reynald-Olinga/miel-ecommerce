// client/src/config.ts
// Point unique de configuration de l'URL de l'API.

// En développement : le backend local.
// En production : la variable VITE_API_BASE_URL (définie dans .env.production
// ou dans Cloudflare), avec un repli vers l'API Render.
const FALLBACK_URL = import.meta.env.PROD
  ? 'https://miel-ecommerce.onrender.com/api'
  : 'http://localhost:5000/api';

export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || FALLBACK_URL
).replace(/\/+$/, '');

// Origine du serveur sans le "/api" (utile pour les images servies par le backend)
export const API_ORIGIN: string = API_BASE_URL.replace(/\/api$/, '');