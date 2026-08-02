import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // algorithm logic is pure JS, no DOM needed yet
    globals: true,
  },
})