---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---

# Convenciones JavaScript/TypeScript — Steadfetch

---

## TypeScript

- TypeScript strict mode siempre. Sin `any`. Sin `@ts-ignore` sin issue vinculado.
- Inferencia de tipos donde sea obvia, anotación explícita en funciones públicas.
- Prefiere `type` sobre `interface` salvo para contratos extensibles.
- Valida inputs externos con `zod` antes de que toquen la lógica de negocio.

```typescript
// Bien
const leadSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  score: z.number().min(0).max(100),
});

type Lead = z.infer<typeof leadSchema>;

// Mal
function procesar(data: any) { ... }
```

---

## Patrón de errores

Ver `sf-invariantes` (`{ data: T | null, error: AppError | null }`, sin `throw` a través de fronteras de módulo).

---

## Logging

Logger estructurado (`pino`, `winston` o el del proyecto). Reglas generales: `sf-invariantes`.

---

## Imports

Orden: node → externos → internos → relativos → tipos.

```typescript
import path from "path";

import { z } from "zod";
import axios from "axios";

import { db } from "@/database";
import { Lead } from "@/types";

import { normalizeEmail } from "./utils";
import type { LeadInput } from "./types";
```

---

## Testing

- Nombres como especificaciones: `should return null when lead does not exist`.
