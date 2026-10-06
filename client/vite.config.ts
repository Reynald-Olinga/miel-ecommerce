import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Cloudflare Pages sert le site à la racine du domaine
  base: '/',

  // Le proxy ne s'applique qu'en développement (npm run dev).
  // Port 5000 = port par défaut de ton index.js.
  // Si ton serveur local tourne sur 5001 (variable PORT dans ton .env serveur), remets 5001.
  server: {
    proxy: {
      '/api': {
        target: 'https://miel-ecommerce.onrender.com',
        changeOrigin: true,
      },
    },
  },
})