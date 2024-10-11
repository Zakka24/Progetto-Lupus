import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:8080', // Il tuo server WebSocket
        ws: true,  // Abilita il proxy per il WebSocket
        changeOrigin: true
      }
    }
  }
})

