# Stack Tecnológico — TOTALHIIT (Sitio Web & Admin)

## Frontend & Estilos
- **Framework:** React 19.0
- **Bundler:** Vite 6.0
- **Lenguaje:** TypeScript 5.7
- **CSS:** Tailwind CSS v4 (vía plugin oficial `@tailwindcss/vite`)
- **Iconografía:** `lucide-react`

## Backend Serverless & Edge Storage
- **Runtime:** Cloudflare Pages Functions
- **Almacenamiento de Estado:** Cloudflare Workers KV (`SITE_CONTENT`)
- **Criptografía Server-Side:** Web Crypto API nativa (PBKDF2-SHA256 + HMAC-SHA256)

## Comandos Oficiales
```bash
# Desarrollo frontend (puerto 5173)
npm run dev

# Compilación de producción
npm run build

# Pruebas automatizadas de Functions con mock de KV
npm run test:api

# Despliegue en Cloudflare Pages
npx wrangler pages deploy dist --project-name totalhiit --branch main
```
