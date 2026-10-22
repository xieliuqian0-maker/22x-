import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本地开发用根路径 /；部署到 GitHub Pages 时用 /22x-/ 子路径
export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/22x-/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
}))
