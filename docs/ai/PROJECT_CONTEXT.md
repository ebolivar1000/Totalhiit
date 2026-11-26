# Contexto del Proyecto — TOTALHIIT (Sitio Web Público & Admin)

## Visión del Producto
Plataforma web oficial (landing page + clon funcional + panel de administración) de **TOTALHIIT**, un bootcamp de entrenamiento HIIT adaptado y nutrición para mujeres de más de 40 años (+40).

- **Sitio Público:** https://totalhiit.pages.dev
- **Panel Administrativo:** https://totalhiit.pages.dev/admin (acceso directo con credenciales seguras).
- **Relación con TotalhiitApp:** Este repositorio es el portal comercial y de captación. La aplicación móvil/PWA (`TotalhiitApp`) es un desarrollo independiente.

## Modelo Comercial & Checkout Dual
- **Cobro Manual Directo:** No se utilizan pasarelas online automatizadas con comisiones (Mercado Pago Checkout API o Wise API).
- El usuario selecciona su moneda:
  - **USD:** Datos de cuenta bancaria Wise para alumnas internacionales.
  - **ARS:** Datos de CBU / Alias / Mercado Pago para Argentina.
- La confirmación del pago y la activación del acceso se realizan **manualmente vía WhatsApp**.

## Panel Administrativo
- Permite editar precios, enlaces de clases y textos dinámicos sin necesidad de recompilar el código.
- Los datos se almacenan en **Cloudflare Workers KV** (`SITE_CONTENT`).
