import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  "server.hmr.overlay": false,
  server: {
    https: {
      key: './../backend/localhost-key.pem',
      cert: './../backend/localhost.pem',
    }
  },
})
