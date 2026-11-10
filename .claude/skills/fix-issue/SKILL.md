---
name: fix-issue
description: Corregir un bug a partir de un número de issue de GitHub, encadenando depuración, TDD, verificación y commit. Úsala cuando el usuario pida arreglar un issue concreto.
argument-hint: [número-de-issue]
---
!`gh issue view "$ARGUMENTS" 2>&1 || echo "No se pudo obtener el issue #$ARGUMENTS"`

## Flujo de trabajo

Nivel de modelo según `sf-modelos` (depuración difícil → capaz).

1. `superpowers:systematic-debugging` hasta formular la causa raíz en una frase, antes de escribir ningún fix.
2. `superpowers:test-driven-development`: un test que reproduce el bug, que falla sin el fix y pasa con él. Cambio mínimo, sin refactors.
3. `superpowers:verification-before-completion`: comandos de calidad del `README.md` del proyecto (tests, lint, typecheck).
4. `/commit` con `fix(scope): descripción (fixes #$ARGUMENTS)`.

Reporta en un párrafo: causa raíz, cambio realizado, test añadido.
