# Sistema de Memoria

Este directorio es la infraestructura de aprendizaje de Claude.

## Flujo

```
  Inicio sesión ──► BARRIDO DE VERIFICACIÓN ──► Actividad de sesión
       │                                              │
       ▼                                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  observations.jsonl   — Descubrimientos verificados     │
  │  corrections.jsonl    — Correcciones del usuario         │
  │  violations.jsonl     — Violaciones detectadas           │
  │  sessions.jsonl       — Scorecards de sesión             │
  └─────────────────────────────────────────────────────────┘
       │
       ▼
  evolve                  — Revisión periódica (manual, skill)
       │
       ▼
  learned-rules.md        — Patrones graduados CON checks verify:
       │
       ▼
  CLAUDE.md / rules/      — Promoción a configuración permanente
```

## Propósito de Cada Archivo

**observations.jsonl** — Solo append. Descubrimientos verificados (no suposiciones).
Tipos: convention, gotcha, dependency, architecture, performance, pattern.
Confianza: low, medium, high, confirmed.
Ejemplo: `{"type": "convention", "observation": "Todos los handlers usan schema.safeParse", "confidence": "confirmed", "evidence": "grep en src/api/ devuelve 12 coincidencias", "date": "2026-04-13"}`

**corrections.jsonl** — Solo append. Correcciones del usuario con categorías:
style, architecture, security, testing, naming, process, behavior.
Cuando times_corrected llega a 2 → su promoción a learned-rules.md se propone con `/evolve`, que pide aprobación.
Ejemplo: `{"correction": "No uses console.log, usa el logger", "category": "style", "times_corrected": 1, "date": "2026-04-13"}`

**violations.jsonl** — Violaciones de reglas detectadas por el barrido de verificación.
Usado por el skill `evolve` para identificar reglas que necesitan escalación.

**sessions.jsonl** — Scorecards de sesión para detectar tendencias. Schema canónico:
```json
{"date": "YYYY-MM-DD", "session_number": N, "corrections_received": 0, "rules_checked": 0, "rules_passed": 0, "rules_failed": 0, "violations_found": [], "violations_fixed": [], "observations_made": 0, "observations_verified": 0}
```
Campos obligatorios: `date`, `corrections_received`, `rules_checked`, `rules_passed`, `rules_failed`, `observations_made`. Campos opcionales: `session_number`, `violations_found`, `violations_fixed`, `observations_verified`.

**learned-rules.md** — Reglas graduadas curadas. Máximo 50 líneas.

**evolution-log.md** — Registro de auditoría. Previene re-proponer reglas rechazadas.

## Escalera de Promoción

| Señal                                 | Destino             |
|---------------------------------------|---------------------|
| Corregido una vez                     | corrections.jsonl   |
| Corregido dos veces, mismo patrón    | learned-rules.md (se propone con `/evolve`) |
| Observado 3+ veces                    | learned-rules.md (se propone con `/evolve`) |
| En learned-rules durante 10+ sesiones | CLAUDE.md o rules/  |
| Rechazado durante evolve              | evolution-log.md    |

## Nota para el template

Los cuatro archivos JSONL (`corrections.jsonl`, `observations.jsonl`, `sessions.jsonl`, `violations.jsonl`) son **locales por proyecto** y no se versionan. En este template se incluyen como `.jsonl.example` para que se puedan copiar al repo destino. El README principal explica cómo inicializarlos y qué añadir al `.gitignore` del repo destino.

## Reglas para Escribir en Memoria
1. Las observaciones son baratas. Registra con libertad.
2. Las correcciones son oro. Cada una se registra. Sin excepciones.
3. Las reglas aprendidas son caras. Deben ser accionables + testeables.
4. Nunca borres logs de correcciones. Son la procedencia.
5. Máximo 50 líneas en learned-rules.md.
