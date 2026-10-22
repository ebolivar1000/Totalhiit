import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Sitio público + panel de administración (entradas independientes)
      input: {
        main: 'index.html',
        admin: 'admin.html'
      }
    }
  },
  server: {
    // Escuchar en IPv4 + red local: por defecto Vite binds solo a ::1 (IPv6)
    // y http://127.0.0.1:5173 queda sin conexion.
    host: '0.0.0.0',
    port: 5173,
    // Fallar en vez de saltar de puerto si 5173 esta ocupado (evita buscar en 5174 sin querer)
    strictPort: true,
    // Los MP4 grandes (OneDrive) bloquean el watcher y tumban el dev server (EBUSY)
    watch: {
      ignored: ['**/public/videos/**']
    }
  }
});
