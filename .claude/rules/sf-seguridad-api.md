---
paths:
  - "src/api/**/*"
  - "src/services/**/*"
  - "src/middleware/**/*"
  - "src/auth/**/*"
---

# Reglas de Seguridad

## Manejo de Input
Valida forma Y contenido. Nunca confíes en las cabeceras Content-Type. Valida el payload real.

- **TypeScript**: usa `zod` con `safeParse`. Valida además: longitud de strings, rangos numéricos, formato de URL/email.
- **Python**: usa `Pydantic` con `Field(max_length=..., ge=..., le=...)`. Valida tipo de archivo por contenido, no solo extensión.

```python
# Python — validación estricta con Pydantic
class ResourceCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., max_length=254)
    score: int = Field(..., ge=0, le=100)
```

## Autorización
La verificación de auth ocurre en middleware, nunca dispersa por los
handlers. Cada ruta deniega por defecto. Para cualquier endpoint que
reciba un ID de recurso: verifica que el usuario autenticado tiene
permiso para acceder a ESE recurso específico. No solo "está logueado".
IDOR es la vulnerabilidad más común en aplicaciones web.
Validación de tokens: verificar expiración, emisor, audiencia Y firma.

## Base de Datos
Solo queries parametrizadas. Si ves concatenación de strings cerca de
una query, para y arréglalo inmediatamente. Al construir queries
dinámicas: whitelist de nombres de campo permitidos. Nunca pases
input del usuario como nombre de columna.

## Secretos y Datos
Si encuentras un secreto hardcodeado, repórtalo inmediatamente y
recomienda rotación. PII en logs: enmascarar a los últimos 4 caracteres
o hashear. Responses de API: devuelve solo los campos que el cliente
necesita. Nunca expongas IDs internos o metadatos.
Respuestas de error: devuelve código de error y mensaje seguro. Nunca
expongas stack traces, errores SQL ni rutas de archivos.

## Dependencias
Antes de añadir CUALQUIER paquete nuevo:
1. Verifica la fecha de última publicación (inactivo > 2 años = alarma)
2. Revisa advisories de seguridad abiertos en GitHub
3. Verifica descargas semanales (pocas = posible typosquatting)
4. Verifica que la licencia es compatible
5. Audita tras la instalación:
   - **Node**: `npm audit`
   - **Python**: `pip-audit`
