/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(
  mergeConfig(
    {
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      }
    },
    {
      test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: [
            'node_modules/',
            'src/test/',
            '**/*.d.ts',
            '**/*.config.{js,ts}',
            '**/index.{js,ts,tsx}',
            'src/main.tsx',
            'src/vite-env.d.ts'
          ]
        }
      }
    }
  )
)
