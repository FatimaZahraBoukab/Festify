import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx", // Force l'interprétation des fichiers .js en JSX
    include: /src\/.*\.js$/, // Applique cela aux fichiers .js dans src
  }
})
