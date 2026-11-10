---
name: commit
description: Generar el mensaje de commit (Conventional Commits en español) a partir del diff actual y crear el commit. Úsala siempre que haya que commitear cambios.
---

# Commit

## Paso 1: Analizar los cambios actuales

**Solo describe el diff ACTUAL. No incluyas commits anteriores.**

```bash
git status
git diff           # sin stagear
git diff --staged  # en staging
```

No uses `git diff HEAD~1` ni `git log`: resumirían trabajo ya commiteado, no el actual.

## Paso 2: Tipo

- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `docs`: solo documentación
- `refactor`: reestructuración sin cambio de comportamiento
- `chore`: mantenimiento, dependencias, config
- `test`: añadir o corregir tests
- `perf`: mejora de rendimiento

## Paso 3: Scope

Derivado de la ruta del archivo principal modificado:

| Ruta | Scope |
|---|---|
| `src/flows/` o `flows/` | `flows` |
| `src/api/` o `api/` | `api` |
| `src/models/` o `models/` | `models` |
| `src/database/` o `db/` | `db` |
| `.github/workflows/` | `ci` |
| `docker-compose*.yml`, `Dockerfile` | `infra` |
| `docs/`, `*.md` | `docs` |
| `.claude/` | `ai-config` |
| Varias áreas | el área principal |

## Paso 4: Mensaje

```
tipo(scope): descripción en imperativo, máx 72 chars
```

- Imperativo: "añadir", no "añadido"; "corregir", no "corregido".
- Minúsculas y sin punto final.
- Describe solo el diff actual: si cambias un archivo, describe ese archivo.
- Si el commit cierra un issue, añade `(fixes #N)` al final de la descripción.

```
feat(flows): añadir flow de clasificación de leads por sector
fix(api): corregir paginación cuando total es cero
chore(deps): actualizar prefect a la última versión menor
```

## Paso 5: Crear el commit

Nunca commitees a `main` ni a `master` (ver `sf-convenciones`). Termina el mensaje con una línea en blanco y este trailer, tal cual, sin versión de modelo:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```
