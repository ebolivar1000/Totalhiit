# Decisiones técnicas del proyecto

Registrar aquí las decisiones que no deben perderse al cambiar de IA.

## Decisión 1 — Checkout manual por transferencia + WhatsApp (sin pasarela online)
- Fecha: 2026-10-22
- Decisión: El checkout no usa Mercado Pago Checkout ni Wise API. El usuario elige plan, se abre un
  modal con los datos bancarios del método elegido (Wise/USD o CBU/MP/ARS) y confirma la inscripción
  enviando el comprobante por WhatsApp.
- Motivo: Reduce dependencia técnica y permite operar sin pasarela habilitada ni cobros por comisión.
  La activación de la cuenta la hace una persona, no el sistema.
- Archivos afectados: `src/components/PaymentModal.tsx`, `src/components/Pricing.tsx`, `src/App.tsx`.

## Decisión 2 — La divisa activa determina el método de pago
- Fecha: 2026-10-22
- Decisión: No hay selector de método de pago propio. `USD` -> Wise, `ARS` -> Mercado Pago, gobernado
  por el único estado `currency` en `App.tsx` (compartido por Navbar y Pricing).
- Motivo: Evita duplicar selectores y reduce fricción: la persona elige su país y el medio de pago
  se deduce.
- Archivos afectados: `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/Pricing.tsx`.

## Decisión 3 — Datos de cobro centralizados en el componente del modal
- Fecha: 2026-10-22
- Decisión: CBU, alias, beneficiario, routing y cuenta se declaran como constantes dentro de
  `PaymentModal.tsx`. No se mueven a variables de entorno ni a archivos de memoria.
- Motivo: El proyecto es 100% estático (Vite build sin backend); las variables de entorno no aportan
  seguridad real. Se evita además duplicar datos financieros sensibles en documentación.
- Archivos afectados: `src/components/PaymentModal.tsx`.

## Decisión 4 — Contenido bloqueado con muestra gratuita
- Fecha: 2026-10-22
- Decisión: Solo el video de Introducción se reproduce embebido. Las 12 clases y los 2 videos de
  estiramiento muestran miniatura con candado + CTA "Desbloquear el Bootcamp" que hace scroll a
  `#precios`.
- Motivo: Es el mecanismo de conversión central del producto (muestra -> venta) sin requerir login.
- Archivos afectados: `src/data/bootcampData.ts` (campo `isLocked`), `src/components/VideoModal.tsx`,
  `src/components/BootcampModules.tsx`.

## Decisión 5 — Estructura de memoria en `ai/` + `docs/`
- Fecha: 2026-10-22
- Decisión: La memoria persistente vive en `ai/state.md` (estado) y `ai/decisions.md` (decisiones),
  en la raíz del repo, complementando `docs/progreso.md` (bitácora) y `docs/arquitectura.md`.
- Motivo: `ai/state.md` e `ai/decisions.md` son plantillas de trabajo de contexto por asistente, y
  `docs/progreso.md` es el log legible para el usuario; mantenerlos separados evita duplicar contenido.
- Archivos afectados: `ai/state.md`, `ai/decisions.md`, `docs/progreso.md`, `AGENTS.md`.

## Decisión 6 — Collage de creatividades como fondo del Hero (no como sección)
- Fecha: 2026-10-22
- Decisión: Las creatividades de Instagram (`public/images/user/`) se usan como mosaico de fondo
  del encabezado (retícula 2x4 móvil / 4x2 desktop, celdas con `blur-[5px]` y `object-cover`),
  NO como una sección nueva de galería.
- Motivo: El material es vertical 9:16 (formato stories) y 3 fotos vienen en baja resolución
  (438x911), por lo que solo funcionan como textura atmosférica. El blur oculta la baja resolución.
  Referencia `befitbycata.com`: su hero es una foto full-bleed con el texto encima; se replicó el
  concepto de fondo a sangre, con mosaico por ser material de stories.
- Archivos afectados: `src/components/Hero.tsx`, `src/data/heroCollage.ts`.

## Decisión 7 — Contacto y datos de pago en fuentes centralizadas
- Fecha: 2026-10-22
- Decisión: `src/data/contact.ts` concentra WhatsApp / Instagram / YouTube y el helper
  `buildWhatsappUrl()`. Los datos bancarios quedan en `src/components/PaymentModal.tsx`.
  `WHATSAPP_NUMBER` vacío hace que el enlace caiga al selector de contactos de WhatsApp en vez de
  romper. `YOUTUBE_URL` apunta por defecto al video oficial de introducción (enlace verificado)
  hasta que se conozca el canal.
- Motivo: Evitar links muertos y que el dato de contacto se actualice en un solo lugar. La IA no
  puede ver imágenes ni inventar datos de la dueña del negocio: los placeholders quedan marcados.
- Archivos afectados: `src/data/contact.ts`, `src/components/PaymentModal.tsx`, `src/components/Footer.tsx`.

## Decisión 8 — Animaciones propias en `src/index.css`
- Fecha: 2026-10-22
- Decisión: Las animaciones que no existen en Tailwind v4 (por ejemplo `animate-fade-in`) se
  declaran como keyframes + utilidad `@layer utilities` dentro de `src/index.css`, sin instalar
  dependencias.
- Motivo: El proyecto no tiene librerías de animación y `AGENTS.md` pide autorización antes de
  instalar dependencias.
- Archivos afectados: `src/index.css`.

## Decisión 9 — Servidor de desarrollo en IPv4 + puerto fijo
- Fecha: 2026-10-22
- Decisión: `vite.config.ts` fija `server.host: '0.0.0.0'`, `port: 5173` y `strictPort: true`.
- Motivo: Por defecto Vite 6 escucha solo en `::1` (IPv6) en Windows, y `http://127.0.0.1:5173`
  queda sin conexión. Con `strictPort` el proceso **falla** si el 5173 está ocupado, en lugar de
  subirse al 5174 en silencio y dejar al usuario mirando un puerto vacío.
- Archivos afectados: `vite.config.ts`.

## Decisión 10 — Tipografía de marca "Edo" autoalojada (no está en Google Fonts)
- Fecha: 2026-10-22
- Decisión: La marca "TOTALHIIT / Bootcamp +40" usa la fuente **Edo (Edo SZ)** de Vic Fieger, un
  brush script de uso comercial libre. No está en Google Fonts ni en Fontsource, por lo que el WOFF
  (17 KB) se descarga una vez a `public/fonts/edo.woff` y se declara con `@font-face` en
  `src/index.css` + utilidad `.font-edo`. Se aplica en el lockup del Navbar y del Footer.
- Motivo: Es la tipografía de marca pedida; autoalojarla evita depender de un CDN de terceros
  (caída, hotlinking y privacidad) y garantiza que la marca se vea igual siempre. No requiere
  instalar dependencias. Licencia: uso comercial libre (ver `public/fonts/README.txt`).
- Archivos afectados: `public/fonts/edo.woff`, `public/fonts/README.txt`, `src/index.css`,
  `src/components/Navbar.tsx`, `src/components/Footer.tsx`.

## Decisión 11 — Hero con fondo rojo magenta
- Fecha: 2026-10-22
- Decisión: El fondo del Hero pasa de `stone-950` a un **rojo magenta** (`#B00050` con velos
  magenta encima, degradado a `#8A0038` al pie). El collage sigue siendo la textura de fondo. El
  texto se lee en blanco; el acento del H1 pasa a `#FFD3E6` y el CTA principal es **blanco con
  texto magenta** (antes era `#E0006C`, invisible sobre magenta).
- Motivo: Pedido explícito de la dueña ("el encabezado tiene que ser color rojo magenta"). Con el
  magenta de fondo, los elementos que antes eran los de mayor contraste (`#E0006C`) deben cambiar de
  color para no perder legibilidad.
- Archivos afectados: `src/components/Hero.tsx`.

## Decisión 12 — Dos mensajes de WhatsApp, uno por método de pago
- Fecha: 2026-10-22
- Decisión: `PaymentModal` ya no usa una plantilla única con un condicional dentro del texto. Hay
  **dos plantillas completas**: una para **Wise (USD)** y otra para **Mercado Pago (ARS)**, ambas
  con plan, importe, medio de pago y la frase de envío del comprobante. Se mantiene
  `buildWhatsappUrl()` (el `\n` se codifica como `%0A` y WhatsApp respeta los saltos de línea).
- Motivo: El mensaje anterior mezclaba los dos métodos y podía sugerir un pago por el medio
  equivocado; el texto pre-cargado es la primera señal de qué medio usar.
- Archivos afectados: `src/components/PaymentModal.tsx`, `src/data/contact.ts`.

## Decisión 13 — Contenido editable en localStorage (sin backend)
- Fecha: 2026-10-22
- Decisión: Los precios, IDs de video e imágenes de fondo se editan desde un panel admin y se
  persisten en `localStorage` bajo `totalhiit.site.v1`. `src/data/siteContent.ts` es la fuente única
  (defaults + load/save/reset); `src/hooks/useSiteContent.ts` expone el contenido y escucha el evento
  `totalhiit:site-updated` (misma pestaña) y `storage` (otras pestañas).
- Motivo: El proyecto es estático y no hay backend ni base de datos; localStorage permite que la
  dueña cambie el contenido sin recompilar. **Limitación asumida**: los cambios solo se ven en su
  navegador, no para los visitantes. Si se necesita edición real para todo el público hay que migrar
  a un CMS/backend (p. ej. Supabase).
- Archivos afectados: `src/data/siteContent.ts`, `src/hooks/useSiteContent.ts`, `src/App.tsx`,
  `src/components/Hero.tsx`, `src/components/Pricing.tsx`, `src/admin/*`.

## Decisión 14 — Admin en entrada Vite separada con auth local
- Fecha: 2026-10-22
- Decisión: El panel vive en `admin.html` + `src/admin/` (entrada independiente del sitio, con
  `noindex`) y se compila con `build.rollupOptions.input = { main, admin }`. El login usa credenciales
  guardadas como hash SHA-256 (`crypto.subtle`, con fallback `fnv1a`) en `totalhiit.admin.creds.v1`;
  el usuario y la contraseña iniciales son los acordados con la dueña y **están solo en
  `src/admin/auth.ts`** (nunca en archivos de memoria). La clave se puede cambiar desde la pestaña
  Seguridad.
- Motivo: Mantener el sitio liviano (el panel no se descarga en la home) y evitar un router o
  dependencia extra. **La auth es solo nominal**: al ser client-side, cualquiera con acceso al
  código puede leer/alterar el hash; sirve para evitar cambios accidentales, no como seguridad real.
- Archivos afectados: `admin.html`, `src/admin/{main.tsx,AdminApp.tsx,auth.ts}`, `vite.config.ts`.

## Decisión 15 — Sección "Clases en Vivo" con video en bucle
- Fecha: 2026-10-22
- Decisión: Nueva sección `#vivo` entre Precios y FAQ (`src/components/LiveClasses.tsx`) con el copy
  de la modalidad (8/12/16 clases por mes por Zoom, seguimiento personalizado, comunidad, nutrición y
  acompañamiento privado), CTA a WhatsApp, banner destacado de clase gratis y video
  `/videos/entrenamiento.mp4` (`autoPlay` + `loop` + `muted` + `playsInline`, `poster` de
  `public/images/user/totalhiit_2.jpg`). El video original (1920x1080, 25 s, 5.9 MB) se copió desde
  `OneDrive/Documentos/Proyectos/TotalHiit/`.
- Motivo: Pedido de la dueña. El video se excluye del watcher de Vite (`server.watch.ignored`) porque
  OneDrive lo bloquea y el dev server moría con `EBUSY`.
- Archivos afectados: `src/components/LiveClasses.tsx`, `src/App.tsx`, `src/components/Navbar.tsx`,
  `vite.config.ts`, `public/videos/entrenamiento.mp4`.

## Decisión 16 — GitHub como repositorio único del proyecto
- Fecha: 2026-10-22
- Decisión: El repo local se sincroniza con **`github.com/ebolivar1000/Totalhiit`** (rama `main`).
  El remoto ya tenía un commit inicial con `.gitignore` + `README.md`: se integró con
  `git merge --allow-unrelated-histories` (se conservó el `.gitignore` estándar de Node y se le
  agregaron `dist-ssr`, `*.local`, `*.tsbuildinfo` y reglas de editor). `tsconfig.tsbuildinfo` dejó
  de trackearse.
- Motivo: Pedido de la dueña ("que todo quede guardado allí") y necesidad de CI/CD: Cloudflare Pages
  construye desde GitHub en cada push a `main`.
- Archivos afectados: `.gitignore`, `README.md` (del remoto), todo el repo.

## Decisión 17 — Cloudflare Pages + KV + botón "Publicar en PROD"
- Fecha: 2026-10-22
- Decisión: Hosting gratuito en **Cloudflare Pages** (ancho de banda ilimitado, uso comercial
  permitido, soporta repo privado) con **Pages Functions** y **Workers KV**:
  - `GET /api/content` lee el JSON publicado de KV (`SITE_CONTENT`), con caché de borde de 60 s.
  - `POST /api/content` valida y guarda el contenido (requiere sesión).
  - El panel muestra **Publicar en PROD** y deshabilita el botón cuando no hay backend.
  - `localStorage` queda como caché/borrador y como respaldo en desarrollo.
- Motivo: Permite que la dueña cambie precios, videos e imágenes sin recompilar y que el cambio se
  vea en todos los dispositivos. Se descartaron GitHub Pages (sin backend, exige repo público) y
  Vercel Hobby (prohíbe uso comercial). R2 (10 GB gratis, egress $0) queda para la Fase 2, cuando
  haga falta subir archivos desde el panel.
- Archivos afectados: `functions/api/content.ts`, `src/data/siteContent.ts`,
  `src/hooks/useSiteContent.ts`, `src/admin/AdminApp.tsx`, `docs/despliegue.md`.

## Decisión 18 — Login del admin validado en el servidor
- Fecha: 2026-10-22
- Decisión: `POST /api/login` verifica un hash **PBKDF2-SHA256** (100.000 iteraciones — el runtime de
  Cloudflare rechaza más de 100000) guardado en KV (`auth`) o, si todavía no se cambió la clave, en
  los secretos `ADMIN_USER` /
  `ADMIN_PASSWORD_HASH`. La sesión es una cookie `th_session` **HttpOnly + Secure +
  SameSite=Strict**, firmada con HMAC-SHA256 usando `SESSION_SECRET`. Hay rate limit de 20 fallos
  cada 10 minutos por IP en KV. `POST /api/password` cambia la clave (KV) y `POST /api/logout` borra
  la cookie.
- Motivo: La validación anterior era client-side (nominal). Con el botón de publicar, la sesión
  protege escrituras reales. El respaldo local (`src/admin/auth.ts`) queda **solo** para dev en
  `localhost`; en producción, si la API falla, el panel no permite entrar (no hay fallback
  inseguro).
- Archivos afectados: `functions/_lib/auth.ts`, `functions/api/{login,logout,session,password}.ts`,
  `src/admin/auth.ts`, `scripts/admin-secrets.mjs`, `scripts/api-test.ts`.

## Decisión 19 — Deploy manual por subida directa (wrangler) en vez de Git
- Fecha: 2026-10-22
- Decisión: El proyecto `totalhiit` en Cloudflare Pages se creó y despliega con
  `wrangler pages deploy` (subida directa) usando `wrangler.toml`. No se conectó la integración Git
  todavía. KV `SITE_CONTENT` y los secretos se cargan por CLI (`wrangler kv` / `wrangler pages
  secret put`).
- Motivo: `wrangler` no permite vincular un proyecto existente de subida directa a Git (Cloudflare lo
  documenta: "no se puede cambiar a Direct Upload después" y viceversa no hay conversión). La vía por
  CLI era la única 100% automatizable sin pedirle a la dueña que autorice el GitHub App. Si se quiere
  auto-deploy por push, hay que **crear otro proyecto** con "Connect to Git" desde el dashboard.
- Consecuencia: cada push a `main` NO despliega solo; hay que correr `npm run build` y
  `npx wrangler pages deploy --project-name totalhiit --branch main`.
- Archivos afectados: `wrangler.toml`, `.gitignore` (`.wrangler/`, `.dev.vars`).
