---
paths:
  - "src/api/**/*"
  - "src/routes/**/*"
  - "src/handlers/**/*"
---

# Reglas de Diseño de API

## Estructura de Handlers

**TypeScript (Express/Fastify):**
```typescript
async function handleSomething(req, res) {
  // 1. Validar input (schema zod)
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({
    data: null, error: formatZodError(parsed.error)
  });
  // 2. Llamar a lógica de negocio (desde core/, nunca inline)
  const result = await doTheThing(parsed.data);
  // 3. Manejar resultado
  if (result.error) return res.status(result.error.status)
    .json({ data: null, error: result.error });
  return res.status(200).json({ data: result.data, error: null });
}
```

**Python (FastAPI):**
```python
@router.post("/resource", response_model=ApiResponse, status_code=201)
async def create_resource(body: ResourceCreate) -> ApiResponse:
    # Pydantic valida body antes de llegar aquí
    result, err = service.create(body)
    if err:
        return ApiResponse(error=ErrorBody(code="INTERNAL_ERROR", message="No se pudo crear"))
    return ApiResponse(data=result)
```

Nada de lógica de negocio en handlers. Si tu handler tiene más de 20
líneas, estás poniendo lógica en el sitio equivocado.

## Forma de la Respuesta
Cada respuesta, siempre, sin excepciones:

TypeScript: `{ data: T | null, error: { code: string, message: string } | null }`

Python (Pydantic):
```python
class ErrorBody(BaseModel):
    code: str
    message: str

class ApiResponse(BaseModel):
    data: Any | None = None
    error: ErrorBody | None = None
```

## Paginación
Todos los endpoints de lista paginan. Default: 20. Máximo: 100.
{ data: T[], meta: { total, limit, offset, hasMore }, error: null }

## Códigos de Error
NOT_FOUND, VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN,
RATE_LIMITED, CONFLICT, INTERNAL_ERROR

## Rate Limiting
- Autenticado: 100 req/min
- No autenticado: 20 req/min
- Endpoints de auth: 5 req/min por IP
Devolver cabecera Retry-After cuando se aplique rate limit.

## Dependencias de auditoría
- **Python**: `pip-audit` tras instalar nuevas dependencias
- **Node**: `npm audit` tras instalar nuevas dependencias
