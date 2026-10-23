# Estado actual del proyecto — TOTALHIIT

> Este archivo es la memoria persistente del proyecto. Se actualiza al cerrar cada tarea.
> Documento complementario: `docs/progreso.md` (log de avance) y `ai/decisions.md` (decisiones técnicas).

## Objetivo
Plataforma web (landing + clone funcional) de **TOTALHIIT**, un bootcamp de HIIT adaptado + nutrición
funcional para mujeres hispanohablantes de más de 40 años (+40), con alcance internacional y
cobro dual: **Wise (USD)** para el exterior y **Mercado Pago / transferencia bancaria (ARS)** para Argentina.

## Tecnologías utilizadas
- React 19 + TypeScript 5.7 + Vite 6
- Tailwind CSS v4 (plugin `@tailwindcss/vite`, sin `tailwind.config.js`)
- Lucide React (iconos)
- Sin backend ni librerías de pago: el checkout es **manual** (datos bancarios + confirmación por WhatsApp)

## Funcionalidades terminadas
- Landing page completa: Navbar con selector de divisa, Hero, Bootcamp (4 semanas por tabs),
  módulo complementario de estiramiento y movilidad, pilares nutricionales, precios, FAQ y Footer.
- Reproductor modal de video (`VideoModal`) con embed de YouTube (`youtube-nocookie`).
  - Video de Introducción: visible como muestra gratuita.
  - Las 12 clases + 2 de estiramiento: bloqueadas, con CTA de conversión al bloque de precios.
- Catálogo de contenido y miniaturas extraídas del PDF en `src/data/bootcampData.ts`
  (12 clases + 2 estiramientos + intro = 15 videos) e imágenes en `public/images/`.
- Checkout dual funcional: `Pricing` -> botón por plan -> `PaymentModal` con los datos
  bancarios de cada método, botón de copiar al portapapeles y enlace de confirmación por WhatsApp.
- Selector de divisa (USD/ARS) sincronizado entre Navbar y Pricing; el método de pago y el
  importe del modal se derivan de la divisa activa.
- `npm run build` (tsc + vite) y `npm run dev` verificados sin errores.

## Encabezado (Hero) — collage de creatividades sobre fondo rojo magenta
- El fondo del Hero es un **mosaico translúcido** de las creatividades de Instagram
  (`src/data/heroCollage.ts`): retícula 2x4 en móvil y 4x2 en tablet/desktop, con las 7 imágenes
  únicas (`totalhiit_3.jpg` se excluye por ser duplicado exacto de `totalhiit_1.jpg`) + 1 celda de
  marca con el logo Flame sobre gradiente magenta.
- Cada celda: `object-cover`, `scale-110`, `blur-[5px]`, `saturate-[0.9]`, `opacity-70` y
  `object-position` variable para que el recorte no sea repetitivo. El blur también resuelve que 3 de
  las fotos vienen en baja resolución (438x911).
- El fondo es **rojo magenta** (`#B00050`), con velos magenta encima (plano `#A30049/60`, gradiente
  horizontal y gradiente vertical hasta `#8A0038`) y glow `#E0006C` de marca. Verificado por píxeles:
  `#B10050` en el cuerpo del Hero, `#8A0038` al pie, collage visible a la derecha.
- Contraste sobre magenta: titular en blanco, acento del H1 en `#FFD3E6`, **CTA principal blanco con
  texto magenta** (antes `#E0006C`, que quedaba invisible), badge y bordes en `white/15-30`.
- Referencia de estilo: `befitbycata.com` usa una sola foto full-bleed con el texto encima
  (sin collage); se replicó el concepto de fondo a sangre, pero con mosaico por tratarse de
  material vertical de Instagram.

## Tipografía de marca — Edo (brush script) autoalojada
- La marca "TOTALHIIT / Bootcamp +40" usa **Edo (Edo SZ)**, brush script de Vic Fieger, uso comercial
  libre. **No existe en Google Fonts ni en Fontsource** (el endpoint `css2?family=Edo` devuelve 400).
- El WOFF (17 KB) quedó en `public/fonts/edo.woff` con `@font-face` + utilidad `.font-edo` en
  `src/index.css`; se aplica en el lockup del **Navbar** y del **Footer** (más el subtítulo
  "Bootcamp +40"). Licencia y procedencia en `public/fonts/README.txt`.
- Verificado renderizando la fuente en un headless y comparando trazos: la página usa los trazos de
  pincel de Edo (distintos del fallback serif y de Arial).

## Mensajes de WhatsApp diferenciados por método de pago
- `PaymentModal` tiene **dos plantillas completas** (antes una sola con condicional dentro del texto):
  - **Wise (USD)**: "...Ya realicé la transferencia internacional por Wise (USD). Te adjunto el comprobante:"
  - **Mercado Pago (ARS)**: "...Ya realicé la transferencia por Mercado Pago (ARS). Te adjunto el comprobante:"
- Ambas incluyen plan, importe y medio de pago. Se sigue usando `buildWhatsappUrl()`; el `\n` se
  codifica como `%0A` y WhatsApp respeta los saltos de línea.

- **Reparaciones aplicadas**
- `animate-fade-in` estaba usada en `VideoModal` y `PaymentModal` pero **no existía** en Tailwind v4
  → keyframes + utilidad propia en `src/index.css`.
- El ancla `#programa` del Navbar ("El Bootcamp") **no apuntaba a ninguna sección** → ahora es el
  `id` del Hero.
- El enlace de WhatsApp del modal **no tenía destinatario** (`wa.me/?text=`) y el de YouTube del
  Footer era genérico (`youtube.com`) → centralizados en `src/data/contact.ts`
  (`buildWhatsappUrl`, `INSTAGRAM_URL`, `YOUTUBE_URL`). WhatsApp: **+54 9 11 5418-8296**
  (`5491154188296`).
- El FAQ describía el pago con "tarjeta o saldo en cuenta", que no es el flujo real → reescrito
  según la transferencia bancaria real.
- **La web no se veía en el navegador**: Vite escuchaba solo en IPv6 (`::1`), por lo que
  `http://127.0.0.1:5173` daba "no se puede conectar" y `localhost` dependía del fallback IPv6 del
  navegador. Además, si el puerto estaba ocupado Vite saltaba al 5174 en silencio y el usuario
  seguía mirando el puerto equivocado. Fix en `vite.config.ts`: `server.host: '0.0.0.0'`,
  `port: 5173`, `strictPort: true` (falla en vez de cambiar de puerto). Ahora responde en
  `http://127.0.0.1:5173/`, `http://localhost:5173/` y en la LAN (`http://192.168.0.84:5173/`).

## Sección "Clases en Vivo" + panel de administración (última tanda)
- Nueva sección `#vivo` entre Precios y FAQ (`src/components/LiveClasses.tsx`): copy de la modalidad
  (8, 12 o 16 clases en vivo por mes por Zoom, seguimiento personalizado, comunidad, nutrición y
  acompañamiento privado), cards por paquete, CTA a WhatsApp y banner destacado
  **"¡Aprovecha que tienes una clase gratis de prueba!"**. Incluye video en bucle
  `public/videos/entrenamiento.mp4` (1920x1080, 25 s, 5.9 MB, copiado de OneDrive) con poster de
  `public/images/user/totalhiit_2.jpg`.
- Link "Clases en Vivo" agregado al menú de escritorio y al menú móvil del Navbar.
- Contenido editable sin recompilar: `src/data/siteContent.ts` + `src/hooks/useSiteContent.ts`
  (precios por divisa, IDs de YouTube y 7 imágenes del collage), persistido en `localStorage`
  (`totalhiit.site.v1`). Hero, Pricing y `handleOpenVideo` consumen esos overrides.
- Panel en **`/admin.html`** (`src/admin/`): login, pestañas Precios / Videos / Imágenes / Seguridad,
  guardar / descartar / restaurar, cambio de contraseña. El usuario y la clave inicial están **solo en
  `src/admin/auth.ts`**; por pedido de la dueña la clave es cambiable desde el panel.
- `vite.config.ts` ahora es multi-entrada (`main` + `admin`) y excluye `public/videos/**` del watcher:
  OneDrive bloqueaba el MP4 y el dev server moría con `EBUSY`.
- El fueguito naranja del logo en Navbar y Footer se reemplazó por `public/images/certificado.jpg`
  (copia optimizada a 1400x781, 156 KB; original 2752x1536 en OneDrive). Se mantiene el fueguito del
  Hero (celda del collage) por ahora.
- **Logo definitivo (2026-10-23)**: `certificado.jpg` se reemplazó por `public/images/logo.png`
  (500x500, 65 KB, original en OneDrive) en Navbar y Footer; `certificado.jpg` se eliminó de
  `public/`. `YOUTUBE_URL` ahora es el canal oficial
  `https://www.youtube.com/channel/UC737ehJ-_dCu68IaZnC6zew?sub_confirmation=1`.
- Verificado headless: 13/13 checks de auth y persistencia OK, sección `#vivo` con video pintando
  contenido real y banner con degradado `#E72F86 → #FF3287 → #FFB400`, y panel admin renderizando
  tras login programático.
- **Publicación real (sin desplegar todavía)**: capa serverless en `functions/api/*` con
  `GET/POST /api/content` (KV `SITE_CONTENT`), login con PBKDF2 + cookie HttpOnly firmada,
  rate limit y cambio de clave. El panel tiene **Publicar en PROD** (deshabilitado sin backend) y
  carga el contenido publicado al abrirse. `npm run test:api` valida 17 casos de la API (login,
  sesión, publicar, validación, cambio de clave, rate limit, logout). Guía completa en
  `docs/despliegue.md`.
- **GitHub**: repo sincronizado con `github.com/ebolivar1000/Totalhiit` (rama `main`); el remoto tenía
  un commit inicial que se integró.

## EN PRODUCCION (publicado 2026-10-22)
- **Sitio público: https://totalhiit.pages.dev** · **Panel: https://totalhiit.pages.dev/admin**
  (usuario `admin`, clave `TotalHiit2026!`, definida por la dueña; se puede cambiar en Seguridad).
- Proyecto de Cloudflare Pages `totalhiit` (cuenta `caribialabs@gmail.com`), deploy por **subida
  directa con `wrangler pages deploy`** (NO conectado a Git; cada push NO auto-despliega: hay que
  correr `npm run build` + deploy, o conectar el repo desde el dashboard).
- KV `SITE_CONTENT` (`2942bb9c7422467989218acbb995983a`) enlazado vía `wrangler.toml`
  (`kv_namespaces`, también en `[env.production]`). Secretos en Cloudflare: `ADMIN_USER`,
  `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` (cargados con `wrangler pages secret put`).
- **Fix crítico**: el runtime de Cloudflare solo permite PBKDF2 hasta **100.000 iteraciones**
  (con 120.000 daba `NotSupportedError` y el login devolvía 500). Se bajó a 100000 en
  `functions/_lib/auth.ts` y `scripts/admin-secrets.mjs`.
- **Verificado end-to-end**: `POST /api/login` 200, `GET /api/session` 200, `POST /api/content` 200
  (con sesión) y `GET /api/content` devolviendo KV; `/admin` responde 200 (`.html` redirige con 308,
  es el pretty-URL de Pages). `index.html`, `/fonts/edo.woff`, `/videos/entrenamiento.mp4` y
  `/images/logo.png` responden 200.
- Comandos: `npx wrangler pages deploy --project-name totalhiit --branch main` (usa `dist/`),
  `npx wrangler pages deployment tail https://<hash>.totalhiit.pages.dev --project-name totalhiit`.

## Verificación visual (sin navegador de escritorio)
- Se verificó el render con Chrome/Edge headless (`--screenshot`) + análisis de píxeles:
  el Hero renderiza con **fondo rojo magenta** (`#B10050`), titular en blanco, collage visible como
  textura a la derecha y CTA principal blanco; la marca en Edo muestra los trazos de pincel en
  Navbar y Footer.
- Limitación: el modelo no puede ver imágenes; el ajuste fino del collage, del magenta y del tamaño
  del lockup requiere mirada humana.

## Trabajo pendiente
- **Completar los datos definitivos**: alias de Mercado Pago y datos bancarios en
  `src/components/PaymentModal.tsx` (el alias dice literalmente "Verificar CBU").
- Revisión visual del Hero magenta y del tamaño del lockup en Edo en navegador (el modelo no puede
  ver imágenes): si el brush queda muy grande o chico en móvil, ajustar `text-[28px]` / `text-[13px]`
  del Navbar y `text-[26px]` / `text-[12px]` del Footer.
- Agregar el archivo del recetario nutricional mencionado en los planes (hoy no existe en el repo).
- Unificar la paleta de marca: conviven el magenta `#E0006C` (Hero + PaymentModal) y el rose de
  Tailwind (`rose-600`) en Navbar, BootcampModules, Pricing y VideoModal.
- **Crear el proyecto en Cloudflare Pages** (lo hace la dueña de la cuenta): conectar el repo,
  build `npm run build` + salida `dist`, KV `totalhiit-content` como `SITE_CONTENT`, y los secretos
  `ADMIN_USER` / `ADMIN_PASSWORD_HASH` / `SESSION_SECRET` generados con `npm run admin:secrets`.
  Detalle en `docs/despliegue.md`.
- **Auto-deploy (opcional)**: conectar `github.com/ebolivar1000/Totalhiit` desde el dashboard
  (Workers & Pages → totalhiit → Settings → Builds → Git Repository) para que cada push a `main`
  despliegue solo. Hoy el deploy es manual con `wrangler pages deploy`.
- **Fase 2 (R2)**: bucket `totalhiit-media` + `functions/api/upload.ts` para que el admin suba
  imágenes/videos desde el panel. Hoy los medios viajan en el repo.
- Revisión visual de la sección Clases en Vivo (video, cards, banner), del logo con el certificado y
  del panel admin en navegador.

## Próxima tarea
El sitio ya está en producción (**https://totalhiit.pages.dev**). Pendiente: revisión visual en
celular del sitio y del panel; probar **Publicar en PROD** desde `/admin` en un navegador distinto;
completar `YOUTUBE_URL` y el alias de Mercado Pago; evaluar Fase 2 (R2 para subir medios desde el
panel) y conectar el repo para auto-deploy.

## Comandos utiles
- `npm run dev` → dev server en `http://127.0.0.1:5173/` (LAN: `http://192.168.0.84:5173/`).
  Con `strictPort: true` falla si el puerto 5173 esta ocupado: leer la terminal, no buscar otro puerto.
- Panel de administración: `http://127.0.0.1:5173/admin.html` (en dev, clave local de
  `src/admin/auth.ts`; en producción, la cargada en Cloudflare).
- `npm run build` → `tsc -b` + build de Vite (genera `dist/index.html` y `dist/admin.html`).
- `npm run test:api` → 17 pruebas de las Functions (login, KV, rate limit) sin desplegar.
- `npm run admin:secrets -- "Clave"` → genera `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` para Cloudflare.
- Verificar render sin abrir navegador: `msedge --headless=new --screenshot=... <url>`.
- `git push origin main` → despliegue automático en Cloudflare Pages.

## Archivos relevantes
- `src/App.tsx` — orquestación de estado: `currency`, `activeVideo`, `payment` (PaymentSelection).
- `src/components/Hero.tsx` — collage de fondo + copy + card de video.
- `src/data/heroCollage.ts` — retícula del collage (imágenes + `object-position`).
- `src/data/contact.ts` — **fuente única de contacto** (WhatsApp, Instagram, YouTube).
- `src/components/PaymentModal.tsx` — **contiene los datos bancarios de cobro** (no duplicarlos en
  documentación ni en archivos de memoria).
- `src/components/Pricing.tsx` — planes, precios por divisa y disparador `onSelectPayment`.
- `src/components/VideoModal.tsx` — player modal, lógica de contenido bloqueado vs. muestra.
- `src/components/BootcampModules.tsx` — tabs por semana + módulo de estiramiento.
- `src/components/Navbar.tsx`, `NutritionPillars.tsx`, `FAQ.tsx`, `Footer.tsx`.
- `src/data/bootcampData.ts` — datos de videos, YouTube IDs e imágenes.
- `src/components/LiveClasses.tsx` — sección `#vivo` (paquetes en vivo, banner clase gratis, video).
- `src/data/siteContent.ts` + `src/hooks/useSiteContent.ts` — contenido editable (precios, videos,
  imágenes) con caché en `localStorage` y publicación vía `/api/content`.
- `src/admin/auth.ts` — login del panel (API primero; respaldo local solo en dev).
- `functions/_lib/auth.ts` — HMAC de sesión, PBKDF2, cookies y rate limit.
- `functions/api/{content,login,logout,session,password}.ts` — API del panel y del contenido.
- `scripts/api-test.ts` + `scripts/admin-secrets.mjs` — pruebas de la API y generación de secretos.
- `docs/despliegue.md` — guía paso a paso de Cloudflare Pages (KV, secretos, verificación).
- `wrangler.toml` — config del proyecto Pages (`totalhiit`) y binding `SITE_CONTENT` (KV).
- `src/admin/AdminApp.tsx`, `src/admin/main.tsx`, `admin.html` — panel de administración.
- `src/index.css` — tipografías, `@font-face` de Edo + `.font-edo`, `font-serif-display` y keyframes
  propios (`animate-fade-in`).
- `public/fonts/edo.woff` — fuente de marca (Edo SZ, uso comercial libre) + `public/fonts/README.txt`.
- `public/images/` — miniaturas del PDF (`img_*`) y creatividades del usuario (`user/totalhiit_*`).
- `public/videos/entrenamiento.mp4` — video de la sección Clases en Vivo (excluido del watcher).
- `docs/progreso.md` — bitácora de avance. `docs/arquitectura.md` — arquitectura aprobada.
