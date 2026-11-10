---
paths:
  - "**/*.sql"
  - "**/dbt_project.yml"
  - "**/models/**/*.sql"
  - "**/macros/**/*.sql"
  - "**/seeds/**/*.csv"
---

# Convenciones SQL y dbt — Steadfetch

---

## Naming (SQL general)

- Tablas: `snake_case` en plural (`leads`, `pipeline_runs`, `company_scores`).
- Columnas: `snake_case` en singular para IDs (`lead_id`, `company_name`).
- Índices: `idx_tabla_columna` (`idx_leads_email`, `idx_runs_created_at`).
- Vistas: prefijo `vw_` (`vw_leads_calientes`).
- Funciones: prefijo `fn_` o verbos descriptivos.

---

## Queries seguras

- Solo queries parametrizadas en código. Nunca concatenación de strings con input del usuario.
- Siempre `LIMIT` en queries de listado. Nunca `SELECT *` en producción sin filtro.
- Nunca `TRUNCATE` o `DELETE` sin cláusula `WHERE` explícita y revisada.
- Añade índice si una query filtra o une por una columna sin índice.

```sql
-- Bien
SELECT id, nombre, score
FROM leads
WHERE sector = $1
  AND score > $2
ORDER BY score DESC
LIMIT 100;

-- Mal
SELECT * FROM leads WHERE sector = 'tecnologia';
```

---

## dbt — Estructura de capas

```
models/
├── staging/      # stg_: datos en bruto normalizados, 1 fuente por modelo
├── intermediate/ # int_: lógica de negocio intermedia
└── marts/        # mart_: tablas finales para consumidores (BI, APIs)
```

- `staging/`: `stg_[fuente]__[entidad].sql`. Renombra columnas, casting de tipos, deduplicación básica.
- `marts/`: `[dominio]_[entidad].sql`. Joins, métricas, reglas de negocio.
- Nunca saltar capas: marts no importan directamente de raw.

---

## dbt — Naming

- Modelos en `snake_case`.
- Prefijos obligatorios: `stg_`, `int_`, (marts sin prefijo o `fct_`/`dim_` si es kimball).
- Tests de unicidad e `not_null` en todas las claves primarias.
- `description:` en todos los modelos y columnas clave del `schema.yml`.

---

## dbt — Tests obligatorios

```yaml
# schema.yml
models:
  - name: stg_leads
    columns:
      - name: lead_id
        tests:
          - unique
          - not_null
      - name: email
        tests:
          - not_null
```

---

## Optimización (ClickHouse / PostgreSQL)

- Verifica que las columnas de filtros frecuentes tienen índice.
- En ClickHouse: la clave primaria define el orden físico — ponla por cardinalidad ascendente.
- Evita `COUNT(DISTINCT ...)` en grandes tablas de ClickHouse: usa `uniq()`.
- Nunca mutations en ClickHouse en producción (DELETE, UPDATE): usa tablas con `ReplacingMergeTree` o vistas.
- En joins: filtra primero, luego une (reduce el volumen de datos antes del join).
