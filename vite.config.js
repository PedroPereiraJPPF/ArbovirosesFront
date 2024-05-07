import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    envCompatible({
      prefix: 'REACT_APP_',
      mode: process.env.NODE_ENV,
      debug: process.env.NODE_ENV !== 'production',
    }),
  ],
})
