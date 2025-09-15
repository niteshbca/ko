import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
import { RiTailwindCssFill } from 'react-icons/ri'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tailwindcss(),
  ],
  server: {
    host: true, // 0.0.0.0 par bind karega
    allowedHosts: ['incentives.expert'], // <-- yahan apna domain add kiya
    port: 5173
  }
})
