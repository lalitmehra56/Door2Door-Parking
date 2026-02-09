import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        // Use 127.0.0.1 to avoid IPv4/IPv6 localhost resolution issues on some setups
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      }
    }
  }
})
