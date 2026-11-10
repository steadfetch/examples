# Modelos, esfuerzo y paralelismo

No escribas versiones ni IDs concretos de modelo en reglas, skills ni planes: usa niveles. Cada nivel corresponde a un alias de Claude Code, que siempre apunta a la versión vigente.

| Nivel | Alias | Esfuerzo | Para qué |
|---|---|---|---|
| capaz | `opus` | alto | brainstorming, writing-plans, decisiones de arquitectura, revisión final de la rama, depuración difícil, rondas 4–5 de un fix que no converge |
| estándar | `sonnet` | por defecto | implementar tareas con integración entre archivos, revisiones por tarea |
| rápido | `haiku` | por defecto | transcripción mecánica (el plan trae el código), cambios repetidos en lote, re-revisiones de fixes pequeños, búsquedas de solo lectura |

## Sesión principal
- Antes de `superpowers:brainstorming` o `superpowers:writing-plans`, si la sesión no está en el nivel capaz, avisa al usuario en una línea y sugiere cambiar (`/model opus`, esfuerzo alto). No bloquees: si decide seguir, continúa.

## Subagentes
- Al despachar un subagente indica siempre `model` con el alias de su nivel. Sin él hereda el modelo de la sesión, normalmente el más caro.
- Esta regla autoriza a fijar `effort: high` en los subagentes de nivel capaz.

## En los planes
- `superpowers:writing-plans` añade a cada tarea, bajo su título, `**Nivel:** capaz|estándar|rápido — <motivo en una frase>` y `**Paralelo con:** <tareas>` (o `—`).
- Antes de la primera tarea, una tabla `| Tarea | Nivel | Paralelo con |`. Es lo que el usuario revisa y ajusta antes de ejecutar.

## Paralelismo
- Dos tareas son paralelas si no tocan los mismos archivos, ninguna consume una interfaz que produce la otra y no hay un orden obligatorio entre ellas.
- Las tareas marcadas como paralelas se despachan a la vez (`superpowers:dispatching-parallel-agents`), cada una con `isolation: "worktree"`, y se integran una a una al terminar. Cada una mantiene su revisión por tarea. Esto prevalece sobre la norma por defecto de `superpowers:subagent-driven-development` de no paralelizar implementadores.
- Un mismo cambio repetido en muchos archivos que no se afectan entre sí (renombrar, actualizar una dependencia, aplicar un patrón): repártelo en lotes de archivos, un subagente de nivel rápido por lote y todos a la vez. Ni un subagente por archivo ni uno solo para todo.
- En duda, secuencial.
