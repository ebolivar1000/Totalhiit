# Problemas Conocidos — TOTALHIIT (Sitio Web & Admin)

## 1. Secretos de Producción en Cloudflare
- Los secretos del panel (`ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`) deben residir exclusivamente en Cloudflare Pages (`wrangler pages secret put`). Jamás se guardan en el repositorio Git.

## 2. Archivos Multimedia Pesados
- Los videos en `public/images/` y `public/videos/` deben mantenerse por debajo de los 15 MB para no saturar la cuota de ancho de banda ni degradar la experiencia en móviles.
