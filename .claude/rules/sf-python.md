---
paths:
  - "**/*.py"
---

# Convenciones Python — Steadfetch

---

## Tipado

- Type hints en todas las funciones públicas: parámetros y retorno.
- Usa `from __future__ import annotations` en archivos con tipos complejos.
- Prefiere `list[str]` sobre `List[str]` (Python 3.10+).
- Nada de `Any` sin justificación comentada.
- Usa Pydantic para validación de inputs externos y configuración.

```python
# Bien
def procesar_leads(leads: list[Lead], limite: int = 100) -> list[Lead]:
    ...

# Mal
def procesar_leads(leads, limite=100):
    ...
```

---

## Patrón de errores

Ver `sf-invariantes` (error como valor; en Python `tuple[T | None, Exception | None]` o un dataclass de resultado). Registra el error con el logger antes de devolverlo.

---

## Logging

- Usa `structlog` o `loguru` con niveles; nada de `logging.basicConfig()` en módulos. Reglas generales de logging: `sf-invariantes`.
- Los logs de error incluyen contexto suficiente para reproducir el problema.

```python
import structlog
logger = structlog.get_logger(__name__)

logger.info("lead procesado", lead_id=lead.id, score=lead.score)
logger.error("fallo en API", servicio="apify", status_code=429)
```

---

## Testing

- Nombres de tests como especificaciones: `test_should_return_none_when_lead_not_found`.

```python
def test_should_return_error_when_api_key_is_invalid():
    # Arrange
    client = ApifyClient(api_key="invalid")
    # Act
    result, error = client.run_actor("google-maps-scraper", {})
    # Assert
    assert result is None
    assert error is not None
```

---

## Imports

Orden: stdlib → externos → internos → relativos → tipos.

```python
import os
import json
from datetime import datetime

import httpx
from pydantic import BaseModel

from src.database import db
from src.models import Lead

from .utils import normalizar_email
```

---

## Configuración

- Usa `pydantic-settings` para leer variables de entorno.
- Un único `Settings` por proyecto, cargado una vez en arranque.
- Nunca `os.getenv()` disperso por el código.

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    apify_token: str

    class Config:
        env_file = ".env"

settings = Settings()
```
