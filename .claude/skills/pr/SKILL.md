---
name: pr
description: Generar el título y la descripción de una pull request, simple o detallada según la complejidad del cambio, con la sección "Cómo se ha verificado". Úsala al cerrar una rama.
---

# Descripción de PR

## Paso 1: Analizar el diff

Determina la rama base: si el `CLAUDE.md` del repo declara una rama base, esa; si no, la rama por defecto del repo (`gh repo view --json defaultBranchRef -q .defaultBranchRef.name`), que normalmente es `main`. Úsala como `<base>`:

```bash
git rev-parse --abbrev-ref HEAD
git log <base>..HEAD --oneline
git diff <base>...HEAD --stat
```

## Paso 2: Complejidad

- **PR simple**: 1 commit, 3 archivos o menos, 50 líneas o menos.
- **PR complejo**: varios commits, o más de 3 archivos, o más de 50 líneas.

## Paso 3: Contexto

- Rama que empieza por `PROJ-XXX`: extrae el ticket.
- `PROJECT_STATE.md`, y los ADRs (`docs/adr/`) o `GLOSSARY.md` si el cambio toca decisiones de arquitectura o términos de dominio.

## Paso 4: Generar según complejidad

### PR simple

```markdown
## Resumen
[1-2 frases: qué cambia y por qué]

[Ticket si aplica]

**Cambios**: [bullets específicos, sin repetir el resumen]

**Impacto**: [qué áreas afecta]

## Cómo se ha verificado
[salida de superpowers:verification-before-completion: comandos ejecutados y resultado]

---
**Merge**: Squash and merge

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### PR complejo

```markdown
## Resumen
[1 párrafo: qué hace el PR y su impacto]

## Ticket
[Enlace o "Sin ticket — mejora interna"]

## Tipo de cambio
- [X] feat / fix / refactor / docs / chore

## Cambios
[Bullets por área afectada]

## Cómo se ha verificado
[salida de superpowers:verification-before-completion: comandos ejecutados y resultado]

## Notas
[Decisiones técnicas, trade-offs, contexto para el reviewer]

---
**Merge**: Squash and merge

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Reglas de contenido

- No te repitas: si el título dice "añadir X", no lo repitas en el resumen.
- Sé específico: "corrige paginación en /leads" mejor que "mejora la API".
- Omite secciones vacías (sin ticket, sin notas).
- "Cómo se ha verificado" nunca se omite ni se inventa: se rellena con lo que realmente se ejecutó.
- Piensa en el reviewer: qué necesita saber para revisar bien.

## Salida

1. Rama base (la declarada en `CLAUDE.md`, o `main` por defecto)
2. Título del PR, listo para copiar
3. Cuerpo del PR en markdown
4. Recordatorio si hay que actualizar docs
