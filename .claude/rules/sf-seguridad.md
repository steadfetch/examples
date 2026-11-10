# Seguridad (OWASP)

**Principio:** por defecto elige siempre la opción más segura. Si te desvías, explica qué riesgo mitigas.

Secretos, PII en logs y validación de entradas externas: ver `sf-invariantes`. Si detectas un secreto commiteado, repórtalo de inmediato y recomienda rotación. Valida también el contenido (longitud, rangos, formato) y nunca confíes en la cabecera `Content-Type`.

## Base de datos

- Solo queries parametrizadas / prepared statements. Nunca concatenación de strings con input del usuario.
- En queries dinámicas: whitelist de nombres de campo; nunca el nombre de columna desde input del usuario.
- Devuelve solo los campos que el cliente necesita. Nunca `SELECT *` en APIs.

## Autorización

- Denegar por defecto. Concede acceso explícito por recurso/acción.
- Todo endpoint que reciba un ID de recurso verifica que el usuario autenticado tiene permiso sobre **ese** recurso (prevenir IDOR).
- Tokens: verifica expiración, emisor, audiencia **y** firma.
- La auth ocurre en middleware/decorador, nunca dispersa por los handlers.

## Inyección y traversal

- Shell/OS: APIs seguras y escaping (`shlex.quote` en Python). Evita `shell=True`.
- Path traversal: sanitiza rutas de usuario con `os.path.realpath` y comprueba que quedan dentro del directorio permitido.
- SSRF: trata las URLs de usuario como no confiables; allowlist de hosts/puertos para fetch saliente.
- XSS: prefiere APIs de texto sobre HTML raw. Sanitiza si el HTML es necesario.

## Dependencias

Antes de añadir un paquete:
1. Fecha de última publicación (inactivo > 2 años = alarma).
2. Advisories de seguridad abiertos.
3. Descargas semanales (pocas = posible typosquatting).
4. Licencia compatible.
5. `pip-audit` / `npm audit` tras la instalación.

## En revisiones

Al corregir o revisar código, **nombra la clase de vulnerabilidad** (ej: "SQL injection", "IDOR", "path traversal") y muestra el patrón seguro en lugar del inseguro.
