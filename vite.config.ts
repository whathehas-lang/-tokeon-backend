import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    open: true,
    port: 5173,
    proxy: {
      '/api/football': {
        target: 'https://v3.football.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, '')
      },
      '/api/baseball': {
        target: 'https://v1.baseball.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/baseball/, '')
      },
      '/api/mlb': {
        target: 'https://statsapi.mlb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mlb/, '')
      },
      '/api/kbo-naver': {
        target: 'https://api-gw.sports.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kbo-naver/, '')
      }
    }
  }
})
