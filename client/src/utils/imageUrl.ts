// client/src/utils/imageUrl.ts
import { API_ORIGIN } from '../config';

/**
 * Retourne une URL d'image utilisable dans le navigateur.
 * - URL complète (Cloudinary, https://...) : inchangée
 * - Chemin relatif (/images/miel.jpg ou images/miel.jpg) : préfixé par l'URL du backend
 */
export const imageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default imageUrl;