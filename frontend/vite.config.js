import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// dev中は /api を Django(8000)へ流す（CORSを気にしないで済む）
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
