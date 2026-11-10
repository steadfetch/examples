---
paths:
  - "src/**/*"
---

# Reglas de Rendimiento
## Las Tres Cosas Que Causan el 90% de Problemas en Producción

### 1. Queries N+1
Si estás haciendo queries dentro de un bucle, tienes un N+1. Agrúpalo.

**TypeScript:**
```typescript
// MAL (golpea la BD una vez por usuario):
for (const id of userIds) {
  const user = await db.user.findUnique({ where: { id } });
}
// BIEN (una sola query por lote):
const users = await db.user.findMany({
  where: { id: { in: userIds } }
});
```

**Python:**
```python
# MAL (N+1):
for lead_id in lead_ids:
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

# BIEN (una sola query):
leads = db.query(Lead).filter(Lead.id.in_(lead_ids)).all()
```

### 2. Índices Faltantes
Cada nuevo patrón de query necesita una verificación de índices. Al
escribir una nueva query: verifica inmediatamente si los campos
consultados tienen índices. Si no, escribe la migración en el mismo PR.

### 3. Queries Sin Límite
Nunca SELECT * sin LIMIT. Nunca traer todos los registros cuando
necesitas un conteo. Nunca cargar una colección entera para filtrar
en código.

## Patrones Async

**TypeScript:** Timeouts en cada llamada externa. Defaults: 10s APIs, 30s BD, 5s caché.
Usa `Promise.all()` para operaciones concurrentes independientes.
Nunca bloquees el event loop en rutas críticas.

**Python (httpx / asyncio):**
```python
import asyncio
import httpx

async def fetch_multiple(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)
    return [r.json() for r in responses if not isinstance(r, Exception)]
```

## Caché
Cachear en la frontera del servicio, nunca dentro de lógica core.
Claves: con namespace y versionadas (v1:users:{id}). Siempre con TTL.
