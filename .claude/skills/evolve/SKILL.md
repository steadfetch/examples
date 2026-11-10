---
name: evolve
description: Revisión del sistema de aprendizaje. Promueve y poda reglas.
  Ejecutar semanalmente o cuando learned-rules.md se llene.
---
## Estado Actual
### Reglas Aprendidas
!`cat .claude/memory/learned-rules.md 2>/dev/null || echo 'Sin reglas aprendidas aún'`
### Correcciones Recientes (últimas 20)
!`tail -n 20 .claude/memory/corrections.jsonl 2>/dev/null || echo 'Sin correcciones registradas'`
### Observaciones Recientes (últimas 20)
!`tail -n 20 .claude/memory/observations.jsonl 2>/dev/null || echo 'Sin observaciones registradas'`
### Decisiones de Evolución Previas
!`tail -n 40 .claude/memory/evolution-log.md 2>/dev/null || echo 'Sin historial de evolución'`

## Tu Tarea
Eres el meta-ingeniero. Mejora el sistema que te ejecuta.

### Paso 1: Analizar Correcciones
Agrupa por patrón. Busca: misma corrección 2+ veces (promueve ahora),
clusters de correcciones que apuntan a una regla faltante, correcciones
que contradicen reglas existentes (la regla está mal, no el usuario).

### Paso 2: Analizar Observaciones
Agrupa por tipo. Busca: observaciones confirmadas de alta confianza,
observaciones que coinciden con correcciones (señales convergentes son
las más fuertes), observaciones de arquitectura que podrían prevenir
bugs futuros.

### Paso 3: Auditar Reglas Aprendidas
Para cada regla: ¿Sigue siendo relevante? ¿Candidata a promoción
(10+ sesiones)? ¿Redundante (cubierta por linter)? ¿Demasiado vaga?
Verifica coherencia con las reglas en `.claude/rules/`: si una regla
aprendida contradice una regla de rules/, es un conflicto que hay que
resolver.

### Paso 4: Revisar Registro de Evolución
Nunca re-propongas una regla rechazada a menos que el usuario lo pida
explícitamente.

### Paso 5: Proponer Cambios
PROPUESTA: [acción]
Regla: [texto de la regla]
Origen: [corrections/observations/learned-rules]
Evidencia: [por qué debería cambiar]
Destino: [learned-rules.md | CLAUDE.md | rules/X.md | ELIMINAR]

Acciones: PROMOVER | GRADUAR | PODAR | ACTUALIZAR | AÑADIR

### Paso 6: Esperar Aprobación
Lista todas las propuestas. NO apliques cambios hasta que se aprueben.
Registra todo (aprobado Y rechazado) en evolution-log.md.

### Restricciones
- Nunca eliminar reglas de seguridad
- Nunca debilitar criterios de completitud
- Máximo 50 líneas en learned-rules.md
- Cada regla debe ser lo suficientemente específica para verificar cumplimiento
- Sesgo hacia la especificidad, no la abstracción
