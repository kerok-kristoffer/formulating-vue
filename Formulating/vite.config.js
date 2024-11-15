import { fileURLToPath, URL } from 'url'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'stripe-pricing-table'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
