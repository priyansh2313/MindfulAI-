import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@tensorflow/tfjs-core',
      '@tensorflow/tfjs-backend-webgl',
      '@tensorflow/tfjs',
      'socket.io-client',
      'emoji-picker-react',
      'uuid',
    ],
    exclude: [
      '@tensorflow/tfjs-node',
    ],
  },
  build: {
    rollupOptions: {
      external: ['@tensorflow/tfjs-node'],
      output: {
        manualChunks: {
          tensorflow: ['@tensorflow/tfjs-core', '@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs'],
          socket: ['socket.io-client'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@tensorflow/tfjs-core': '@tensorflow/tfjs-core',
      '@tensorflow/tfjs-backend-webgl': '@tensorflow/tfjs-backend-webgl',
    },
  },
}) 