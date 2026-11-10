# Flujo de trabajo Steadfetch

Este flujo aplica en todos los repos. superpowers es la columna vertebral y el resto de skills se engancha donde se indica. Estas instrucciones prevalecen sobre las de cualquier skill.

| Fase | Skill | Puente Steadfetch |
|---|---|---|
| 1. Idea → diseño | `superpowers:brainstorming` | Si el diseño introduce términos de dominio o decisiones de arquitectura, invoca `domain-modeling` (GLOSSARY.md, docs/adr/) antes de pedir la aprobación del spec. Si una duda solo se resuelve probando, usa `prototype`. Si el usuario quiere estresar el diseño, sugiérele `/grill-me`. |
| 2. Diseño → plan | `superpowers:writing-plans` | Aplica `sf-principios` al decidir qué tareas existen. El plan marca nivel y paralelismo por tarea según `sf-modelos`. |
| 3. Aislamiento | `superpowers:using-git-worktrees` | Nombre de rama según `sf-convenciones`. |
| 4. Ejecución | `superpowers:subagent-driven-development` (por defecto) o `superpowers:executing-plans` | Cada tarea con `superpowers:test-driven-development`. En GREEN, la escalera de `sf-principios`. Modelo, esfuerzo y paralelismo según `sf-modelos`. |
| 5. Bugs | `superpowers:systematic-debugging` | Si parte de un issue de GitHub, entra por `/fix-issue`. |
| 6. Revisión | `superpowers:requesting-code-review` | Despacha el agente `reviewer`. Si el diff toca auth, BD, PII, pagos o APIs externas, añade `security-reviewer` en la revisión final de la rama. Si añade o cambia manejo de errores, añade `silent-failure-hunter`. Para el feedback: `superpowers:receiving-code-review`. |
| 7. Verificación | `superpowers:verification-before-completion` | Comandos del README.md y criterios de completitud de `sf-convenciones`. |
| 8. Cierre | `superpowers:finishing-a-development-branch` | Commits con `/commit` y PR con `/pr`. Si nace un proceso nuevo, crea su skill con `superpowers:writing-skills`. Registra lo aprendido según `sf-memoria`. |

## Precedencia
- TDD: manda `superpowers:test-driven-development`. Nunca "un test pequeño" en lugar del test que falla primero.
- Revisión: no sustituyas el paso 6 por `/code-review`, `ponytail-review` ni otras revisiones. `ponytail-review` ya la carga `reviewer`.
- Specs y planes: en `.superpowers/specs/` y `.superpowers/plans/` (git-ignorado), nunca en `docs/`, en prosa completa. Nunca comprimidos ni en estilo telegráfico.
- Commits y PR: siempre `/commit` y `/pr`.

## Periódicas (las lanza el usuario)
`/evolve` cada semana. `/improve-codebase-architecture` y `/ponytail-audit` cada mes. `/ponytail-debt` antes de cada release. `/handoff` cuando la sesión se alargue.
