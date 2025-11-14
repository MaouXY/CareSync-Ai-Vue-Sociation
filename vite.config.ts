import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    proxy: {
      '/ark': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // 路径重写（如果需要）
        // rewrite: (path) => path.replace(/^\/ark/, '')
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 路径重写（如果需要）
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})