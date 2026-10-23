# TOTALHIIT

Sitio web oficial de **TOTALHIIT**: bootcamp de entrenamiento HIIT adaptado y nutrición para mujeres de más de 40 años.

- **Sitio público:** https://totalhiit.pages.dev
- **Panel de administración:** https://totalhiit.pages.dev/admin (no enlazado desde el sitio)
- **Repositorio:** privado, rama `main`

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Cloudflare Pages + Pages Functions + Workers KV.

El frontend es una SPA con dos entradas (`index.html` y `admin.html`). El backend son funciones serverless en `functions/api/` que leen y escriben en KV (`SITE_CONTENT`).

## Desarrollo

```bash
npm install
npm run dev        # http://127.0.0.1:5173  (panel: /admin.html)
npm run build      # tsc -b + vite build -> dist/
npm run test:api   # 17 pruebas de las Functions con KV simulada
```

En desarrollo no se ejecutan las Functions: el panel usa la clave local de `src/admin/auth.ts` y el contenido vive en `localStorage`.

## Publicación

El contenido (precios, IDs de YouTube e imágenes del Hero) se edita desde `/admin` y se publica con el botón **Publicar en PROD**; queda en KV y no requiere recompilar.

Los cambios de **código** se despliegan a mano (el proyecto es Direct Upload, no está conectado a Git):

```bash
npm run build
npx wrangler pages deploy --project-name totalhiit --branch main
```

## Secretos

Se configuran solo en Cloudflare (nunca en el repo):

```bash
npm run admin:secrets -- "ClaveSegura"    # imprime ADMIN_PASSWORD_HASH y SESSION_SECRET

npx wrangler pages secret put ADMIN_USER --project-name totalhiit
npx wrangler pages secret put ADMIN_PASSWORD_HASH --project-name totalhiit
npx wrangler pages secret put SESSION_SECRET --project-name totalhiit
```

El binding KV se declara en `wrangler.toml`.

## Dónde vive cada cosa

| Contenido | Ubicación |
| --- | --- |
| Código, imágenes, video y fuente | Git (GitHub) + cada despliegue de Cloudflare Pages |
| Contenido publicado y credenciales | Workers KV (`SITE_CONTENT`) |
| Secretos de producción | Variables cifradas de Cloudflare |
| Documentación y memoria del proyecto | `docs/` y `ai/` (también en Git) |

No hacen falta archivos locales para que el sitio siga online: si se pierde la laptop, se clona el repo en otra máquina y se repite el deploy.

## Documentación

- `docs/arquitectura.docx` — documentación técnica completa (arquitectura, rutas, API, despliegue).
- `docs/despliegue.md` — guía de Cloudflare Pages + KV.
- `docs/progreso.md` — historial de cambios.
- `ai/state.md` y `ai/decisions.md` — estado actual y decisiones técnicas.
