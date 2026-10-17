# Notas: integración de Claude en el proyecto

## Servidor MCP

`.mcp.json` registra `fetch` (`uvx mcp-server-fetch`) a nivel de proyecto. Permite leer páginas web, como la documentación de Express, Supertest o `node:test`, sin necesidad de credenciales ni de variables de entorno. En `.claude/settings.json` solo se permite `mcp__fetch__fetch`, su única herramienta, que es de lectura. Requiere `uv` instalado y que `uvx` esté en el PATH. Si se acaba de instalar, hay que reiniciar el editor o la terminal.

Para probarlo se ejecutó una tarea headless que tenía `mcp__fetch__fetch` como único permiso:

```powershell
claude -p "Usa la herramienta fetch para leer https://github.com/ladjs/supertest#readme y resume en 3 puntos cómo se envía un body JSON y cómo se comprueban el status y la respuesta, para aplicarlo en tests/users.test.js. No modifiques archivos." --allowedTools "mcp__fetch__fetch" --max-turns 5
```

Claude leyó el README, que ahora redirige a `forwardemail/supertest`, y lo relacionó con el estilo que ya usan las pruebas: `.send({...})`, `assert.equal(res.status, …)` y `assert.deepEqual(res.body, …)`. No modificó ningún archivo.

## Skill: `testing-endpoints`

`.claude/skills/testing-endpoints/SKILL.md` documenta cómo escribir pruebas de endpoints en este repo: `node:test` + Supertest contra la app importada desde `server.js`, `store.reset()` en `beforeEach` y aserciones de status y JSON, incluido `{ error }`. Además, indica no tocar el código de la aplicación. Se activa con peticiones como "agrega una prueba para PUT /users/:id cuando…", sin necesidad de nombrar la skill. La descripción excluye explícitamente los cambios generales de la aplicación.

## Comando: `/test-endpoint`

`.claude/commands/test-endpoint.md` recibe `$1` (método y ruta) y `$2` (escenarios). Por ejemplo, `/test-endpoint "GET /users/:id" "usuario existente y 404"`. Si un argumento tiene espacios, debe ir entre comillas. El comando sigue la skill, limita los cambios a las pruebas, ejecuta `npm test` y pide aclaración si falta algún argumento.

## Hook

Es un `PostToolUse` con matcher `Bash|PowerShell` que ejecuta `.claude/hooks/lint-after-tests.js`. El script lee el comando ejecutado y, solo si era `npm test`, lanza `npm run lint`. Para cualquier otro comando termina sin hacer nada. Elegí `PostToolUse` porque el objetivo es reaccionar después de las pruebas, no bloquear nada. Se comprobó ejecutando `npm test` en una sesión interactiva: apareció `npm test completed. Running npm run lint.`, seguido del resultado del lint.

## Tarea headless

```powershell
claude -p "En tests/users.test.js, agrega una prueba para PUT /users/1 enviando un body vacío ({}). Comprueba que responde 400 y que el body es exactamente { error: 'name or email is required' }. Sigue el estilo de las pruebas existentes. No modifiques archivos de la aplicación ni otros archivos. Ejecuta npm test y reporta el resultado." --allowedTools "Read" "Edit(tests/users.test.js)" "Bash(npm test)" "PowerShell(npm test)" --max-turns 10
```

Restricciones aplicadas:

- `Read` para leer el código.
- `Edit` limitado a `tests/users.test.js`.
- Solo el comando exacto `npm test`, en Bash o PowerShell, porque en Windows Claude puede usar cualquiera de los dos.
- Sin `Write` ni Bash general, y con un tope de 10 turnos.

Resultado: Claude añadió `PUT /users/:id returns 400 for an empty body` y `npm test` pasó 9/9. `git status` confirmó que no cambió ningún otro archivo. Con `-p` en formato de texto solo se ve la respuesta final, así que la ejecución del hook en modo headless no queda visible. Por eso el hook se documenta con la prueba interactiva. El cambio en `tests/` se usó para validar la tarea y no forma parte de este PR, que solo incluye integraciones.
