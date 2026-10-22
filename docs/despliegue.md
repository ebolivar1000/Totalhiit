# Despliegue en Cloudflare Pages

Arquitectura acordada (ver `ai/decisions.md`, Decisiones 13–17):

- **Sitio**: Vite build estático (`dist/`) en **Cloudflare Pages** (plan gratuito).
- **Contenido editable**: JSON en **Workers KV** (binding `SITE_CONTENT`), servido por
  `functions/api/content.ts`.
- **Admin**: `admin.html` + API en `functions/api/*` (login con cookie HttpOnly firmada, clave
  hasheada con PBKDF2).
- **Botón "Publicar en PROD"**: escribe en KV; no requiere recompilar ni volver a desplegar.
- **Código**: GitHub `ebolivar1000/Totalhiit`, rama `main`; cada push reconstruye el sitio.

> Estado: el código y la configuración están listos. Falta crear el proyecto en la cuenta de
> Cloudflare (los pasos 1–4 los hace la dueña de la cuenta; no requieren instalar nada).

## Paso a paso

### 1. Crear el proyecto de Pages

1. Entrar a <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Autorizar GitHub y elegir el repo `ebolivar1000/Totalhiit` (puede ser privado).
3. Configuración de build:
   - Branch de producción: `main`
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: (vacío)
4. **Save and Deploy**. Queda online en `https://<proyecto>.pages.dev`.

### 2. Crear el KV del contenido

1. **Workers & Pages** → **KV** → **Create a namespace** → nombre `totalhiit-content`.
2. En el proyecto de Pages → **Settings** → **Bindings** (o *Functions → KV namespace bindings*)
   → **Add** → **KV namespace**:
   - Variable name: `SITE_CONTENT`
   - Namespace: `totalhiit-content`
3. Repetir en el entorno **Preview** si se quiere probar antes de producción.

### 3. Cargar los secretos del admin

En el proyecto de Pages → **Settings** → **Environment variables** → **Production** → **Add**,
tipo **Secret**:

| Variable | Valor |
|---|---|
| `ADMIN_USER` | `admin` (o el usuario que se prefiera) |
| `ADMIN_PASSWORD_HASH` | generado en el paso siguiente |
| `SESSION_SECRET` | generado en el paso siguiente |

Generarlos en la máquina local (no se publican ni quedan en el repo):

```bash
npm run admin:secrets -- "MiClaveSeguraDeProduccion"
```

Copiar las tres líneas que imprime. **Importante**: usar una clave distinta de la de desarrollo
(`TotalHiit2026!`); esa solo sirve para el modo local sin backend.

### 4. Redesplegar y verificar

Los bindings y secretos se inyectan al crear un deployment:

1. **Deployments** → menú del último → **Retry deployment**.
2. Verificar:
   - `https://<proyecto>.pages.dev/` → sitio público.
   - `https://<proyecto>.pages.dev/api/content` → `{"content":null,"source":"default"}`.
   - `https://<proyecto>.pages.dev/admin.html` → login y pestaña **Seguridad**.
3. Cambiar precios/videos/imágenes → **Publicar en PROD** → recargar el sitio en otro navegador:
   los cambios ya están publicados (puede tardar hasta ~1 minuto por caché de borde).
4. Cambiar la clave desde **Seguridad** (queda en KV; la clave anterior deja de servir).

### 5. Dominio propio (opcional, más adelante)

**Custom domains** → **Set up a domain**. Si el dominio está en Cloudflare es automático; si no,
se agrega un CNAME. El subdominio `*.pages.dev` sigue funcionando.

## Cómo funciona la publicación

- `GET /api/content` devuelve el JSON guardado en KV (o `null` si todavía no se publicó nada; el
  sitio usa los valores compilados como respaldo). Se cachea 60 s en el borde.
- `POST /api/content` exige sesión válida, valida el formato y guarda `site` en KV.
- `POST /api/login` verifica el hash (KV primero, secretos después), aplica rate limit (20 fallos
  cada 10 min por IP) y devuelve una cookie `th_session` HttpOnly, Secure y SameSite=Strict.
- `POST /api/password` cambia la clave (PBKDF2) y la guarda en KV.
- `POST /api/logout` borra la cookie.
- En local (`npm run dev`) no hay Functions: el admin cae al modo local con `localStorage` y el
  botón **Publicar en PROD** queda deshabilitado.

## Límites del plan gratuito (suficientes para este sitio)

| Servicio | Gratis |
|---|---|
| Pages | Ancho de banda y requests ilimitados, 500 builds/mes |
| Functions | 100.000 requests/día |
| KV | 1 GB, 100.000 lecturas/día, 1.000 escrituras/día |

## Pendiente (Fase 2): medios en R2

Hoy las imágenes y el video viajan en el repo (`public/`). Para que el admin pueda subir archivos:

1. Crear un bucket **R2** (`totalhiit-media`; 10 GB gratis, sin costo de salida).
2. Exponerlo con un dominio (`media.<dominio>`) y agregar el binding `MEDIA` al proyecto.
3. Agregar `functions/api/upload.ts` (subida desde el panel con sesión) y guardar las URLs en el
   contenido.

## Seguridad

- El hash PBKDF2 y el `SESSION_SECRET` viven solo en Cloudflare (secretos cifrados).
- La cookie es HttpOnly (no accesible por JS) y SameSite=Strict (frena CSRF).
- Nunca commitear los valores de `admin:secrets` ni `.env` (ya están en `.gitignore`).
