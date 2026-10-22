# Estado actual - TOTALHIIT

## Objetivo
Desarrollar la plataforma web y clone funcional para TOTALHIIT (+40) enfocada en mujeres de más de 40 años hispanohablantes a nivel internacional (HIIT adaptado + Nutrición funcional) con pagos duales (Wise en USD y Mercado Pago en ARS).

## Completado
- **Memoria persistente**: Registrada en `C:\Users\Everth\AGENTS.md` y [AGENTS.md](file:///C:/Users/Everth/ProyectosIA/MiPrimeraApp/AGENTS.md) para que Antigravity CLI reconozca **TOTALHIIT** en cada inicio de sesión.
- **Análisis de PDF `BOOTCAMP TOTAL+40.pdf`**: Se extrajeron los 15 videos oficiales de YouTube correspondientes al Video de Introducción, las 4 semanas de clases (12 clases) y las 2 clases de estiramiento y movilidad.
- **Arquitectura base aprobada**: Configurada en [docs/arquitectura.md](file:///C:/Users/Everth/ProyectosIA/MiPrimeraApp/docs/arquitectura.md).
- **Inicialización de la aplicación Web**:
  - React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide React.
  - Reproductor modal de video interactivo con YouTube embeds sin salir de la página.
  - Barra de navegación con selector de divisa (`USD` vía Wise / `ARS` vía Mercado Pago).
  - Hero section con video teaser de introducción y propuesta de valor enfocada en mujeres +40.
  - Módulos interactivos de las 4 semanas del Bootcamp con miniaturas, duración y descripción de cada clase.
  - Módulo complementario de estiramiento y movilidad articular.
  - Sección de pilares nutricionales adaptados a cambios hormonales y antiinflamación.
  - Sección de precios y checkout dual (Wise / Mercado Pago).
  - Acordeón de preguntas frecuentes (FAQ) para dudas de articulaciones, materiales y acceso.
  - Footer con enlaces a Instagram (@totalhiit1) y YouTube.
- **Imágenes y creatividades**:
  - 16 miniaturas de los videos extraídas del PDF en `public/images/`.
  - 8 creatividades del usuario en `public/images/user/` (`totalhiit_1..8.jpg`).
  - `totalhiit_3.jpg` es un duplicado exacto de `totalhiit_1.jpg` y queda excluido del collage.
- **Encabezado (Hero) con collage de creatividades**:
  - Mosaico translúcido de fondo (retícula 2x4 móvil / 4x2 desktop) con las 7 creatividades únicas
    + 1 celda de marca con el logo.
  - Celdas con `object-cover`, `scale-110`, `blur-[5px]` y `object-position` variable; velos
    oscuros para legibilidad y glow magenta de marca.
  - Se replica el concepto de `befitbycata.com` (fondo full-bleed con texto encima), adaptado a
    material vertical de Instagram. No se agrega una sección nueva.
- **Hero en rojo magenta** (pedido de la dueña):
  - Fondo `#B00050` con velos magenta y degradado a `#8A0038` al pie; el collage sigue siendo la
    textura de fondo.
  - Contraste reajustado: titular en blanco, acento del H1 en `#FFD3E6`, CTA principal **blanco con
    texto magenta** (antes `#E0006C`, invisible sobre magenta), badge y bordes en blanco translúcido.
- **Tipografía de marca Edo**:
  - "TOTALHIIT / Bootcamp +40" en **Edo (Edo SZ)**, brush script de Vic Fieger con uso comercial
    libre. No está en Google Fonts ni en Fontsource, así que el WOFF (17 KB) quedó autoalojado en
    `public/fonts/edo.woff`, declarado con `@font-face` + `.font-edo` en `src/index.css`.
  - Aplicada en el lockup del Navbar y del Footer. Procedencia y licencia en `public/fonts/README.txt`.
- **WhatsApp con dos mensajes separados**:
  - Wise (USD) y Mercado Pago (ARS) tienen su propia plantilla completa (plan, importe, medio de pago
    y envío del comprobante), en lugar de un único mensaje con condicional.
- **Checkout dual funcional** (`PaymentModal`):
  - Modal de instrucciones de pago con datos bancarios por método, botón de copiar al portapapeles
    (CBU, beneficiario, routing y cuenta) y enlace de confirmación por WhatsApp.
  - Conectado al flujo real: `Pricing` -> `onSelectPayment` -> `App` -> `PaymentModal`.
- **Reparaciones**:
  - `animate-fade-in` (usada en ambos modales) no existía en Tailwind v4 → agregada en `src/index.css`.
  - Ancla `#programa` del Navbar sin destino → ahora es el `id` del Hero.
  - Enlace de WhatsApp sin destinatario y enlace de YouTube genérico → centralizados en
    `src/data/contact.ts` (WhatsApp: **+54 9 11 5418-8296**).
  - FAQ de pagos reescrito para describir la transferencia real (no pago con tarjeta).
  - **La web no se veía en el navegador**: Vite escuchaba solo en IPv6 (`::1`), por lo que
    `127.0.0.1:5173` no conectaba; además podía saltear al puerto 5174 en silencio.
    `vite.config.ts` ahora fija `host: '0.0.0.0'`, `port: 5173` y `strictPort: true`.
- **Render verificado** con navegador headless + análisis de píxeles: Hero con fondo oscuro,
  titular en blanco, collage visible como textura y las 7 creatividades cargando (HTTP 200).
- **Compilación verificada**: `npm run build` ejecutado exitosamente sin errores de TypeScript.
- **Control de versiones**: Repositorio Git inicializado y primer commit registrado.

## Segunda tanda (2026-10-22)
- **Hero rojo magenta**: base `#B00050`, velos magenta y degradado a `#8A0038`; H1 blanco con acento
  `#FFD3E6` y CTA blanco con texto magenta. Verificado por píxeles (`#B10050`).
- **Marca en Edo**: WOFF autoalojado (`public/fonts/edo.woff`, Edo SZ de Vic Fieger) con `@font-face` +
  `.font-edo`; aplicado al lockup del Navbar y del Footer.
- **Sección "Clases en Vivo"** (`#vivo`, entre Precios y FAQ): modalidad de 8/12/16 clases por mes por
  Zoom, seguimiento personalizado, comunidad, nutrición y acompañamiento privado; CTA a WhatsApp;
  banner de clase gratis de prueba; video en bucle `public/videos/entrenamiento.mp4` (1920x1080, 25 s).
  Links en el menú de escritorio y móvil.
- **Panel de administración** en `/admin.html`: login con clave cambiable, edición de precios, IDs de
  video e imágenes de fondo. Persistencia en `localStorage` (`src/data/siteContent.ts` +
  `useSiteContent`), consumida por Hero, Pricing y `handleOpenVideo`. El sitio compila en dos entradas
  (`index.html` + `admin.html`).
- **Fix del dev server**: el MP4 de OneDrive bloqueaba el watcher y tumbaba Vite con `EBUSY`;
  `server.watch.ignored: ['**/public/videos/**']`.
- **Logo con certificado**: el fueguito naranja de Navbar y Footer se sustituyó por
  `public/images/certificado.jpg` (optimizado a 1400x781, 156 KB).
- **Verificado headless**: 13/13 checks de auth/persistencia, sección `#vivo` con video real y banner
  `#E72F86 → #FF3287 → #FFB400`, panel admin renderizando tras login. `npm run build` en verde.

## Tercera tanda (2026-10-22): publicación
- **Logo**: el fueguito naranja de Navbar y Footer se reemplazó por `public/images/certificado.jpg`.
- **GitHub**: repo sincronizado con `github.com/ebolivar1000/Totalhiit` (rama `main`), integrando el
  commit inicial del remoto; `.gitignore` unificado y `tsconfig.tsbuildinfo` destrackeado.
- **Backend serverless** en `functions/` (Cloudflare Pages):
  - `GET/POST /api/content` con Workers KV (`SITE_CONTENT`) para publicar precios, videos e imágenes.
  - Login con PBKDF2-SHA256, cookie HttpOnly firmada (HMAC), rate limit y `POST /api/password`.
  - El panel ahora carga lo publicado y tiene el botón **Publicar en PROD** (deshabilitado sin backend).
- **Pruebas**: `npm run test:api` → 17/17 (login, sesión, publicar, validaciones, cambio de clave,
  rate limit, logout). `npm run admin:secrets` genera los secretos para Cloudflare.
- **Documentación**: `docs/despliegue.md` con los pasos de Cloudflare Pages + KV + secretos.

## En desarrollo
- Revisión visual del usuario en navegador: Hero magenta, lockup Edo, sección Clases en Vivo, logo con
  certificado y panel admin.
- Unificación de paleta de marca (magenta `#E0006C` vs. `rose-600`).

## Pendiente
- Completar `YOUTUBE_URL` en `src/data/contact.ts` y el alias de Mercado Pago en
  `src/components/PaymentModal.tsx`.
- Conectar el repo a Git para auto-deploy (opcional; ver Decisión 19).
- Fase 2: R2 para subir imágenes/videos desde el panel.
- Agregar el archivo del recetario nutricional mencionado en los planes.

## Problemas conocidos
- El contenido público tiene caché de borde de 60 s: un cambio puede tardar hasta ~1 minuto en verse.
- La clave de desarrollo (`src/admin/auth.ts`) no se usa en producción, pero está en el repo; en
  Cloudflare se configura una clave distinta.

## PUBLICADO (2026-10-22)
- **Sitio: https://totalhiit.pages.dev** · **Panel: https://totalhiit.pages.dev/admin**
  (usuario `admin`, clave `TotalHiit2026!`).
- Deploy en Cloudflare Pages con `wrangler` (subida directa, no auto-deploy por Git), KV
  `SITE_CONTENT` y secretos `ADMIN_USER`/`ADMIN_PASSWORD_HASH`/`SESSION_SECRET`.
- **Fix**: PBKDF2 bajó de 120.000 a **100.000** iteraciones (Cloudflare no soporta más y el login
  daba 500). Verificado end-to-end: login, sesión, publicar y leer contenido desde KV.

## Próxima tarea
Probar en producción el login y **Publicar en PROD** desde otro navegador; revisión visual en celular;
conectar el repo para auto-deploy (opcional); completar los datos de contacto definitivos.
