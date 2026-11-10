# Principios de Ingeniería

Sesgan hacia la cautela antes que hacia la velocidad. En tareas triviales, usa el criterio.

## Antes de escribir código

Siempre. Sin excepciones.

1. **Grep primero.** Busca patrones existentes antes de crear nada. Si ya existe una convención, síguela.
2. **Radio de impacto.** ¿Qué depende de lo que vas a cambiar? Revisa imports, tests, consumidores. Radio de impacto desconocido = no estás listo para programar.
3. **Pregunta, no asumas.** Detalle en "Piensa antes de programar": UNA pregunta clarificadora, no cinco.
4. **Cambio mínimo.** El scope creep es un bug. Detalle en "Simplicidad primero" y "Cambios quirúrgicos".
5. **Plan de verificación.** ¿Cómo vas a demostrar que funciona? Responde esto antes de escribir código.

## 1. Piensa antes de programar

**No asumas. No ocultes la confusión. Expón los compromisos.**

Antes de implementar:
- Enuncia tus suposiciones de forma explícita. Si dudas, pregunta.
- Si existen varias interpretaciones, preséntalas; no elijas una en silencio.
- Si existe un enfoque más simple, dilo. Discrepa cuando proceda.
- Si algo no está claro, detente. Nombra lo que confunde y haz UNA pregunta clarificadora; no adivines ni hagas cinco.

## 2. Simplicidad primero

**El mínimo código que resuelve el problema. Nada especulativo.**

- Resuelve lo que se pidió y nada más: el scope creep es un bug. Ninguna funcionalidad más allá de lo pedido.
- Ninguna abstracción para código de un solo uso.
- Ninguna "flexibilidad" o "configurabilidad" que nadie pidió.
- Ningún manejo de errores para escenarios imposibles.
- Si escribes 200 líneas y podrían ser 50, reescríbelo.

Pregúntate: "¿diría un ingeniero sénior que esto está sobrecomplicado?". Si la respuesta es sí, simplifica.

## 3. Cambios quirúrgicos

**Toca solo lo imprescindible. Limpia solo tu propio desorden.**

Al editar código existente:
- No "mejores" código, comentarios ni formato adyacentes.
- No refactorices lo que no está roto.
- Respeta el estilo existente, aunque tú lo harías distinto.
- Si ves código muerto ajeno a tu tarea, menciónalo; no lo borres.

Cuando tus cambios dejen huérfanos:
- Elimina imports, variables y funciones que TUS cambios han dejado sin uso.
- No elimines código muerto previo salvo que te lo pidan.

La prueba: cada línea cambiada debe poder trazarse directamente a la petición del usuario.

## 4. Ejecución guiada por objetivos

**Define criterios de éxito. Itera hasta verificarlos.**

Convierte las tareas en objetivos verificables:
- "Añadir validación" → "Escribe tests con entradas inválidas y haz que pasen"
- "Arreglar el bug" → "Escribe un test que lo reproduzca y haz que pase"
- "Refactorizar X" → "Asegura que los tests pasan antes y después"

Para tareas de varios pasos, enuncia un plan breve:
```
1. [Paso] → verify: [comprobación]
2. [Paso] → verify: [comprobación]
3. [Paso] → verify: [comprobación]
```

Criterios de éxito sólidos te permiten iterar sin supervisión. Los débiles ("que funcione") exigen aclaraciones constantes.

## Escalera del cambio mínimo

El cambio más pequeño que resuelve la tarea por completo. Toma la primera opción que funcione del todo:

1. ¿Necesita existir? Omite funcionalidades, opciones y flexibilidad que nadie pidió, y nómbralas en una línea. Una petición vaga ("hazme X") recibe la versión más pequeña que cumple el núcleo.
2. ¿Ya existe en este código (helper, componente, servicio, patrón)? Úsalo como lo hace el código de alrededor.
3. ¿Librería estándar o capacidad de la plataforma? Úsala, salvo que el proyecto tenga la suya. Un componente propio gana a un widget nativo.
4. ¿Dependencia ya instalada? Úsala. Nunca añadas una dependencia para unas pocas líneas.
5. ¿Cabe en una línea que se entienda de un vistazo? Una línea.
6. Si no: el mínimo código que funcione.

- Sé perezoso con la solución, nunca con el cambio: termina todo lo que la tarea necesita, incluidos los callers, tests y fixtures que tu cambio rompe.
- Sin abstracción, wrapper, conversión de tipos, opción, config, boilerplate ni código "para más adelante" que nadie pidió. Borrar gana a añadir. Mantén la estructura que ya tiene el código: capas, interfaces y convenciones.
- Gana el diff funcional más corto, una vez sabes todo lo que debe tocar. Una línea que hay que descifrar no es corta.
- Si mueves o fusionas código, conserva su manejo de errores y su validación.
- Entre opciones del mismo tamaño, elige la correcta en los casos borde.
- Bug: antes de editar, haz grep de todos los callers de la función que tocas y arregla la causa raíz una sola vez, en el código compartido.
- Código perezoso sin su comprobación está inacabado: la lógica nueva no trivial (rama, bucle, parser, dinero, seguridad, script o app nueva) deja un test pequeño o un autochequeo con asserts.
- Un atajo con límite conocido lleva un comentario con esta forma: `shortcut: <límite>, <cuándo mejorarlo>`, con el marcador de comentario del lenguaje (`#`, `//` o `--`).

**Líneas rojas, nunca se recortan:** validación en las fronteras de confianza, manejo de errores que evita pérdida de datos, seguridad, accesibilidad, y todo lo que el usuario pidió.

Al terminar, una línea con lo que no verificaste o dejaste fuera.

**Precedencia.** La escalera decide cuánto código se escribe en el paso GREEN de `superpowers:test-driven-development`; nunca si se escribe el test. Para trabajo de varios pasos manda `superpowers:writing-plans` sobre el formato breve "paso → verify".

Basado en andrej-karpathy-skills (MIT) y ponytail (MIT, DietrichGebert).
