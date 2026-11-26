# Registro de Decisiones Técnicas (ADR) — TOTALHIIT (Sitio Web & Admin)

## Decisión 1 — Checkout manual por transferencia + WhatsApp
- **Fecha:** 2026-10-22
- **Decisión:** El checkout no utiliza APIs automatizadas de pasarelas. Muestra los datos bancarios y deriva la confirmación a WhatsApp.
- **Motivo:** Cero comisiones de intermediarios y activación personalizada.

## Decisión 2 — La divisa activa determina el método de pago
- **Fecha:** 2026-10-22
- **Decisión:** USD activa Wise; ARS activa Mercado Pago / CBU.
- **Motivo:** Experiencia de usuario simplificada.

## Decisión 3 — Datos de cobro centralizados en constante de UI
- **Fecha:** 2026-10-22
- **Decisión:** Los datos de cuenta se definen como constantes en `PaymentModal.tsx`.
- **Motivo:** El frontend es estático; las variables de entorno cliente no brindan seguridad adicional.

## Decisión 4 — Muestra gratuita y bloqueo del bootcamp
- **Fecha:** 2026-10-22
- **Decisión:** Solo el video de introducción es reproducible. Las clases del bootcamp están bloqueadas con scroll directo al bloque de precios.

## Decisión 5 — Administración sin recompilación vía Workers KV
- **Fecha:** 2026-10-24
- **Decisión:** Los precios y textos editables se almacenan en Workers KV (`SITE_CONTENT`).
- **Motivo:** Permite a la clienta cambiar precios desde `/admin` sin necesidad de un nuevo deploy de código.
