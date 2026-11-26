# Estrategia de Pruebas — TOTALHIIT (Sitio Web & Admin)

## Suite de Pruebas de API
El proyecto cuenta con un runner de pruebas automatizado para las Cloudflare Pages Functions que simula el entorno de Workers KV en memoria:

```bash
npm run test:api
```

Cubre 17 casos de prueba críticos:
- Autenticación con contraseña válida e inválida.
- Manejo de cookies firmadas y sesiones expiradas.
- Validación de esquemas JSON y rate limiting por IP.
- Persistencia y recuperación de contenido en KV.
