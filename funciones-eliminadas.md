# Funciones eliminadas

Documento de las funciones y archivos eliminados por no estar en uso en el proyecto.

## Rutas

| Archivo | Detalle |
| --- | --- |
| `routes/column.js` | Archivo de ruta eliminado completo. Nunca se importaba ni montaba en `server.js`, por lo que la ruta `POST /new-column` no estaba expuesta. |

## Funciones eliminadas

| Archivo | Función | Motivo |
| --- | --- | --- |
| `databaseActions/columnsDB.js` | `createColumn` | Únicamente era usada por la ruta eliminada `routes/column.js`. Otro `createColumn` (el de `databaseActions/boardsDB.js`) se mantiene porque lo usa la ruta `POST /api/boards/createColumn`. |
| `utils/format.js` | `checkGeneralText` | *Stub* con cuerpo vacío, nunca fue usado en ningún archivo. |

## Imports eliminados

| Archivo | Import | Motivo |
| --- | --- | --- |
| `routes/user.js` | `conexion` (de `controllers/connection`) | Variable importada pero nunca utilizada dentro del archivo. |

> Nota: el archivo `databaseActions/columnsDB.js` conserva `changeColumnName` y `deleteColumn`, que se usan en `server.js` por medio de Socket.IO.

## Segunda revisión (chequeo de código sin uso)

### Código muerto corregido

| Archivo | Detalle |
| --- | --- |
| `server.js` | `const PORT = 3000 || process.env.PORT` → `process.env.PORT || 3000`. La variable de entorno `PORT` nunca se evaluaba (bug de AGENTS.md). También se eliminó `{ data }` sin uso en los sockets `changeBoard`, `addFavorite` y `removeFavorite`, y el bloque muerto `if (data.length > 0)` en `changeBoard`. |

### Logs de depuración eliminados

| Archivo | Log eliminado |
| --- | --- |
| `server.js` | `console.log(data[0].is_favorite)` en `checkFavorite`; `console.log(" vro")` en `changeColumnName`; `console.log('entra aca')` en `deleteColumn` |
| `databaseActions/user.js` | `console.log("Datos desde data: ", data)` en `getUserById` |
| `databaseActions/boardsDB.js` | `console.log(data)` en `getBoardInfo` |
| `utils/jwtVerifications.js` | `console.log(refreshToken)` y `console.log(user)` en `verifyRefreshToken` |
| `routes/user.js` | `console.log(password, passwordConfirmation)` en `change-password` (además exponía contraseñas en los logs) |