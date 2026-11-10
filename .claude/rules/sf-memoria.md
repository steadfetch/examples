# Memoria y Auto-Evolución

La memoria del proyecto vive en `.claude/memory/`. El protocolo completo está en `.claude/memory/README.md`; léelo si vas a registrar algo.

## Al inicio de la sesión

1. Lee `.claude/memory/learned-rules.md`.
2. Ejecuta la comprobación de cada regla con línea `verify:` (grep, glob o lectura).
3. Si hay violaciones, repórtalas antes de empezar:
   ```
   VIOLACIÓN DETECTADA: [regla]
   Encontrado: [qué viola la regla y dónde]
   Fix: [acción concreta]
   ```
4. Si todo pasa: silencio.

## Durante el trabajo

- **Corrección del usuario** ("no", "mal", "así no", "te dije"): aplícala y regístrala en `corrections.jsonl` en el momento, solo append:
  ```json
  {"correction": "lo que no se debe hacer", "category": "style|architecture|security|testing|naming|process|behavior", "times_corrected": 1, "date": "YYYY-MM-DD"}
  ```
  Si el mismo patrón se repite una segunda vez, **propón** su promoción (con su línea `verify:`), no la escribas.
- **Patrón verificable** (con evidencia concreta: grep, lectura): regístralo en `observations.jsonl` en el momento:
  ```json
  {"type": "convention|gotcha|dependency|architecture|pattern", "observation": "descripción concisa", "confidence": "low|medium|high|confirmed", "evidence": "qué verificaste y qué encontraste", "date": "YYYY-MM-DD"}
  ```
  Las de confianza alta sin contraejemplos son candidatas a regla aprendida: propónlas.

## Al cerrar

Si hubo correcciones o eventos relevantes, al cerrar con `superpowers:finishing-a-development-branch` añade el scorecard a `sessions.jsonl` (schema canónico en `.claude/memory/README.md`).

## Reglas de la memoria

- Cada corrección se registra, sin excepciones. Nunca borres los logs: son la procedencia del aprendizaje.
- Registra observaciones con libertad, pero solo con evidencia.
- Las reglas aprendidas son caras: accionables y verificables por máquina. Máximo 50 líneas en `learned-rules.md`; si se acerca, ejecuta la skill `evolve`.
- `learned-rules.md` solo se modifica mediante la skill `evolve`, con aprobación del usuario.

Formato en `learned-rules.md`:
```
- [descripción de la regla accionable]
  verify: Grep("[patrón]", path="[scope]") -> [0 matches | 1+ matches]
  [origen: corregido Nx | observado Nx, YYYY-MM-DD]
```
