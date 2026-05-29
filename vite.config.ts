import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const isTauri = process.env.VITE_APP_MODE === 'tauri'

export default defineConfig({
  base: isTauri ? '/' : '/ThreatMonitoring-frontend/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      devOptions: {
        enabled: false,
      },
      
      workbox: {
        globIgnores: ['**/*.wasm'],
      },

      manifest: {
        name: 'Threat monitoring system',
        short_name: 'Threat monitoring system',
        start_url: '/ThreatMonitoring-frontend/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d6efd',
      },
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
