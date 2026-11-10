# Convenciones de Desarrollo

## Forma de operar

- Lee los archivos antes de escribir código; no releas los que no han cambiado.
- Edita solo lo que cambia, no reescribas archivos enteros ni repitas código sin cambios.
- Sin preámbulos, sin resúmenes al final, sin explicar lo obvio.
- Testea antes de dar por terminado.
- Comandos del proyecto: consulta el `README.md` antes de ejecutar nada. Si no existe, pregunta al usuario.

## Fuentes de verdad

- Estado del desarrollo → `PROJECT_STATE.md`
- Decisiones y vocabulario de dominio → `docs/adr/` y `GLOSSARY.md` (los mantiene la skill `domain-modeling`)

Léelos antes de proponer cambios importantes.

## Git flow

- Nunca commitear directamente a `main` o `master`.
- Ramas: `feat/descripcion`, `fix/descripcion`, `chore/descripcion`, o con ticket: `PROJ-123_descripcion`.
- PRs contra la rama base del repo: `main` por defecto; si el `CLAUDE.md` del repo declara otra rama base, esa. Squash and merge salvo que el historial sea relevante.
- Una rama = una tarea. No mezcles concerns.

## Commits: Conventional Commits

```
tipo(scope): descripción en imperativo, máx 72 chars
```

**Tipos:** `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`

**Scopes:** derivados de la carpeta principal afectada (ej: `src`, `api`, `flows`, `models`, `infra`)

```
feat(flows): añadir flow de captación con Apify
fix(api): corregir paginación en endpoint de leads
chore(deps): actualizar prefect a 3.2
docs(readme): añadir guía de despliegue local
```

- Imperativo: "añadir" no "añadido", "corregir" no "corregido".
- Describe el DIFF actual, no el feature completo. Sin punto final.

## Naming

- **Funciones y variables**: `snake_case` (Python) / `camelCase` (JavaScript)
- **Clases y tipos**: `PascalCase`
- **Constantes**: `SCREAMING_SNAKE_CASE`
- **Archivos**: `kebab-case` (JS/config) / `snake_case` (Python)
- **Tablas BD**: `snake_case` en plural (`leads`, `pipeline_runs`)
- Elige un idioma (español o inglés) y sé consistente en todo el proyecto.

## Código

- Funciones: máximo 30 líneas, 3 niveles de anidación y 4 parámetros.
- Comentarios: POR QUÉ, nunca QUÉ. Sin código muerto ni `TODO`/`FIXME` sin issue de tracking.
- Errores, validación, logging y secretos: ver `sf-invariantes`.

## Testing

- Nombres como especificaciones: `test_should_return_error_when_api_key_is_invalid`.
- Arrange-Act-Assert. Mock solo en la frontera (APIs externas, BD).
- Casos borde: vacío, null/None, un solo elemento, límite, duplicados, malformado.
- Tests de comportamiento, no de mocks.

## Criterios de completitud

Antes de dar una tarea por terminada:

1. Los checks del proyecto pasan (tests, lint, typecheck según el stack).
2. Sin `TODO`/`FIXME` huérfanos ni depuración (`console.log`, `print`) en código de producción.
3. Módulos nuevos tienen archivos de test.
4. Si el cambio introduce una decisión de arquitectura o un término de dominio: regístralo con `domain-modeling` (`docs/adr/`, `GLOSSARY.md`). Si cambia el estado del proyecto: `PROJECT_STATE.md`.
5. Si se completó un proceso nuevo: `superpowers:writing-skills`, skill en `.claude/skills/<nombre>/`.

## Lo que nunca debes hacer

- Commitear a main directamente.
- Leer o modificar archivos `.env` o de secretos.
- Ejecutar comandos destructivos sin confirmación explícita.
- Instalar dependencias sin justificación (ver `sf-seguridad`).
- Tragarse errores silenciosamente (`except: pass`, `catch (e) {}`).
- Modificar `.claude/memory/learned-rules.md` sin ejecutar la skill `evolve`.
