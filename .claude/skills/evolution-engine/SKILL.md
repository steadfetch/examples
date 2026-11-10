---
name: evolution-engine
description: >
  Sistema autónomo de aprendizaje y verificación. Se activa por:
  - Inicio de sesión (ejecuta barrido de verificación en reglas aprendidas)
  - Correcciones del usuario ("no", "mal", "te dije", "no hacemos eso")
  - Fin de tarea (puntuación de sesión)
  - Descubrimientos durante el trabajo (verificación de hipótesis)
  - Petición explícita ("recuerda esto", "añade esto como regla")
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---
# Motor de Evolución
No eres un diario. Eres un sistema inmunológico.
Verificas, aplicas y aprendes autónomamente.

---
## SECCIÓN 1: BARRIDO DE VERIFICACIÓN (ejecutar al inicio de sesión)

Lee .claude/memory/learned-rules.md. Cada regla con una línea verify:
se ejecuta como un grep/glob/check. Las reglas sin línea verify: son
deuda técnica. Añádele una.

Formato de ejemplo en learned-rules.md:
- Nunca usar el patrón spread para mergear opciones en fetchJSON.
  verify: Grep("\.\.\.options", path="src/api/client.js") -> 0 matches
  [origen: corregido 2x, 2026-03-28]

La línea verify: no es código ejecutable. Es una instrucción que Claude
ejecuta como verificación grep durante el barrido. Claude lee el patrón,
ejecuta la búsqueda y comprueba que el resultado coincida.

### Protocolo de Verificación
1. Para cada regla con línea verify::
   - Ejecuta el check. PASA: Silencio. FALLA: Registra en violations.jsonl
   - Muestra las violaciones:
     VIOLACIONES DE REGLAS DETECTADAS:
     - [regla]: encontrado [violación] en [archivo:línea]
       fix: [fix específico]
2. Si TODAS las checks pasan, no digas nada. El mejor sistema inmunológico
   es invisible.

Patrones de verificación:
- Patrón de código prohibido: Grep("[patrón]", path="[scope]") -> 0 matches
- Patrón de código requerido: Grep("[patrón]", path="[scope]") -> 1+ matches
- Archivo debe existir: Glob("[patrón]") -> 1+ matches
- Archivo no debe existir: Glob("[patrón]") -> 0 matches

---
## SECCIÓN 2: OBSERVACIONES BASADAS EN HIPÓTESIS

Una observación es un descubrimiento sobre el codebase (un patrón, una
convención, una dependencia). Una corrección es cuando el usuario te dice
que hiciste algo mal. No son lo mismo.

Nunca registres una suposición. Verifica inmediatamente o no lo registres.

1. Formula como afirmación testeable.
2. Testea inmediatamente (grep por contra-ejemplos, lee archivos, cuenta).
3. Registra con evidencia en observations.jsonl.
4. Observaciones confirmadas (0 contra-ejemplos) son candidatas a learned-rules.md.
   **Propón** la regla con su línea verify: pero no la escribas directamente.
   Ejecuta el skill evolve para que el usuario la apruebe.
5. Observaciones de baja confianza se marcan para re-verificación.

---
## SECCIÓN 3: CAPTURA DE CORRECCIONES

Cuando el usuario te corrige:
1. Reconócelo naturalmente.
2. Registra en corrections.jsonl con un patrón verify auto-generado.
3. Reglas de promoción:
   - 1ª vez: Registra.
   - 2ª vez (mismo patrón): Propón la promoción a learned-rules.md via el skill evolve (requiere aprobación del usuario). No escribas directamente.
   - Ya está en learned-rules: Asegura que la verificación existe.
4. Aplica la corrección inmediatamente.

---
## SECCIÓN 4: PUNTUACIÓN DE SESIÓN

Al finalizar, escribe la scorecard en sessions.jsonl:
{"date": "[hoy]", "session_number": "[N]",
 "corrections_received": 2, "rules_checked": 8,
 "rules_passed": 7, "rules_failed": 1,
 "violations_found": [...], "violations_fixed": [...],
 "observations_made": 1, "observations_verified": 1}

### Detección de Tendencias
Si hay 5+ entradas: ¿correcciones disminuyendo? El sistema funciona.
¿Planas/aumentando? Las reglas no se consultan. ¿Misma violación
recurrente? Gradúala.
Muestra: "Sesión 12: 0 correcciones (baja desde media de 3). 8/8 pasando."

---
## SECCIÓN 5: "RECUERDA ESTO" EXPLÍCITO

Cuando el usuario te pida recordar algo:
1. Reescríbelo como regla testeable.
2. Genera un patrón verify.
3. **Propón** la regla al usuario y ejecuta el skill evolve para que la apruebe antes de escribir en learned-rules.md.
4. Confirma cuando haya sido aprobada y escrita: "Regla añadida: [regla]. Verificación: [check]."

Si no puedes hacerla verificable por máquina, dilo.

---
## GESTIÓN DE CAPACIDAD

Máximo 50 líneas en learned-rules.md. ¿Acercándose a 50? Revisa qué
reglas han pasado 10+ sesiones consecutivas (candidatas a graduación).

---
## EL PRINCIPIO

Una regla sin verificación es un deseo.
Una regla con verificación es un guardarraíl.
Solo los guardarraíles sobreviven.
