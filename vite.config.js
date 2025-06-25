import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 개발 서버 설정
  server: {
    port: 5173,
    open: true
  },
  // 빌드 설정
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 