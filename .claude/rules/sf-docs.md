---
paths:
  - "**/README.md"
  - "**/docs/**/*.md"
  - "**/.github/workflows/**/*.yml"
  - "**/flows/**/*.py"
  - "**/dbt_project.yml"
  - "**/docker-compose*.yml"
---

# Sincronización de Documentación

Cuando cambies comportamiento, configuración o interfaces, actualiza la documentación **en el mismo cambio** donde sea práctico.

---

## Cuándo actualizar docs

- Añades o cambias features, flows, modelos dbt, o APIs públicas
- Cambias variables de entorno, nombres de secretos (no valores), CLI o pasos de instalación
- Cambias workflows de CI/CD, rutas de despliegue o quality gates
- Introduces cambios breaking o que requieren migración

---

## Qué tocar

| Área | Archivos probables |
|---|---|
| Onboarding | `README.md` |
| Arquitectura / Flujo de datos | `docs/adr/` (vía `domain-modeling`), `README.md` |
| Estado y fases | `PROJECT_STATE.md` |
| Pipelines / Flows | `README.md` |
| dbt | `dbt_project.yml` notas, `README.md` |
| Variables de entorno | Sección "Configuración" del README |
| Despliegue | `docker-compose.yml` comentarios, `README.md` |

---

## Reglas

- Prefiere **edits pequeños y precisos** sobre rewrites masivos generados.
- No documentes secretos: referencia **nombres de variables** y dónde configurarlas.
- Si solo refactorizas internos sin cambio visible para el usuario, no hagas doc churn.
- `PROJECT_STATE.md` es la fuente de verdad del estado del proyecto: mantenlo actualizado. Las decisiones de arquitectura van en ADRs (`docs/adr/`) y los términos de dominio en `GLOSSARY.md`, ambos con `domain-modeling`.
