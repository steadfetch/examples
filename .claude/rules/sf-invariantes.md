# Invariantes del Proyecto

Estas reglas se cargan siempre, en cada sesión. Existen porque violarlas causa bugs en producción.

---

## 1. Patrón de error

Toda función que cruce fronteras de módulo devuelve el error como valor — nunca lanza excepciones al caller.

```python
# Python: tuple[T | None, Exception | None]
def obtener_lead(lead_id: str) -> tuple[Lead | None, Exception | None]:
    try:
        return db.get(lead_id), None
    except Exception as e:
        return None, e
```

```typescript
// TypeScript: { data: T | null, error: AppError | null }
async function obtenerLead(id: string): Promise<{ data: Lead | null; error: AppError | null }> {
    try {
        return { data: await db.get(id), error: null };
    } catch (err) {
        return { data: null, error: { code: "DB_ERROR", message: String(err) } };
    }
}
```

Si ves un `throw` (TypeScript) o `raise` sin captura (Python) cruzando una frontera de módulo: cámbialo.

---

## 2. Validación de toda entrada externa

Antes de que cualquier input externo (request body, query params, variables de entorno, respuestas de APIs externas) toque la lógica de negocio, se valida.

- Python: Pydantic o marshmallow
- JavaScript/TypeScript: zod

No hay excepciones. Si el input no está validado, la lógica de negocio no lo toca.

---

## 3. No logging de PII

Nunca loguear emails, teléfonos, nombres, documentos de identidad, tokens, ni secretos. Si el dato identifica a una persona o es una credencial: no va al log.

---

## 4. Logger estructurado, no console/print

```python
# MAL en producción
print(f"Procesando lead {lead_id}")

# BIEN
logger.info("procesando lead", lead_id=lead_id, sector=sector)
```

Un `console.log` o `print` en producción es un bug de observabilidad. Usa el logger configurado para el proyecto con niveles (`debug`, `info`, `warning`, `error`).

---

## 5. No secretos hardcodeados

Ningún valor de API key, password, token, connection string ni secret va en el código. Solo nombres de variables de entorno o referencias a secret stores.
