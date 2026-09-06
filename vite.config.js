import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Нужно для GitHub Pages: https://<user>.github.io/ushanka/
  base: '/ushanka/',
})
