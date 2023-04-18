import { defineConfig, loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default ({ mode }) => { 
  const env = loadEnv(mode, process.cwd())
  
  return defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: (new URL(env.VITE_PUBLIC_URL)).pathname
  });
}