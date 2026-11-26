# Reglas Generales de Asistentes IA (Antigravity & Cursor) — TOTALHIIT (Sitio Web & Admin)

Este archivo rige a **todos los asistentes de Inteligencia Artificial** que abran este proyecto.

---

## 🚨 PROTOCOLO OBLIGATORIO DE ENTRADA
1. **Verificar Git:** Ejecutar `git status`. Si hay cambios no guardados de otro agente, analizarlos antes de continuar.
2. **Leer `docs/ai/HANDOFF.md`:** Identificar qué se hizo en la sesión anterior y cuál es el siguiente paso.
3. **Consultar la Memoria:**
   - `docs/ai/PROJECT_CONTEXT.md`: Reglas del negocio y checkout manual.
   - `docs/ai/ARCHITECTURE.md`: SPA + Pages Functions + Workers KV.
   - `docs/ai/DECISIONS.md`: Decisiones arquitectónicas inmutables.
4. **Validación:** Tras cualquier cambio en `functions/api/`, ejecutar obligatoriamente `npm run test:api`.

---

## 🏁 PROTOCOLO OBLIGATORIO DE SALIDA
Al culminar una tarea:
1. Actualizar `docs/ai/CHANGELOG_AI.md` y `docs/ai/TODO.md`.
2. Actualizar `docs/ai/HANDOFF.md` con los detalles de la sesión.
