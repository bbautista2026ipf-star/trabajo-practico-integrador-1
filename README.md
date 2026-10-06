# Trabajo Práctico Integrador I - Blog personal con autenticación

API REST para gestionar un blog personal: usuarios con perfil, artículos y etiquetas, con autenticación por JWT en cookies y permisos por rol.

## Tecnologías

Node.js, Express 5, ES Modules, Sequelize, MySQL, express-validator, jsonwebtoken, bcrypt, cookie-parser, cors y dotenv. En desarrollo se usa nodemon.

## Instalación

1. Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

2. Crear la base de datos en MySQL:

```sql
CREATE DATABASE blog_integrador;
```

3. Copiar `.env.example` como `.env` y completar los valores:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor |
| `NODE_ENV` | `development` o `production`. En producción la cookie se envía solo por HTTPS (`secure`) |
| `DB_HOST` | Host de MySQL |
| `DB_PORT` | Puerto de MySQL (3306 por defecto) |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Clave para firmar los tokens |

4. Iniciar el servidor:

```bash
npm run dev   # desarrollo, con nodemon
npm start     # sin reinicio automático
```

Las tablas se crean al iniciar con `sequelize.sync()`, que no modifica tablas existentes. Si la base se creó con una versión anterior del proyecto, hay que borrarla y crearla de nuevo.

Para tener un administrador, registrar un usuario y cambiarle el rol en MySQL. El cambio se aplica sin volver a iniciar sesión:

```sql
UPDATE users SET role = 'admin' WHERE username = 'nombre_de_usuario';
```

## Estructura

```
├── app.js
└── src/
    ├── config/        conexión a la base de datos
    ├── models/        modelos y relaciones
    ├── routes/        rutas por recurso
    ├── controllers/   lógica de cada endpoint
    ├── middlewares/   autenticación, autorización, validaciones y errores
    └── helpers/       JWT y bcrypt
```

## Modelos y relaciones

| Relación | Tipo | Alias |
|---|---|---|
| User - Profile | 1:1 | `profile` / `user` |
| User - Article | 1:N | `articles` / `author` |
| Article - Tag (a través de ArticleTag) | N:M | `tags` / `articles` |

### Eliminaciones

- **Eliminación lógica:** `User` y `Article` (`paranoid: true`, columna `deleted_at`). Un usuario eliminado no puede iniciar sesión ni seguir usando su token, y sus artículos dejan de listarse.
- **Eliminación en cascada:** las claves foráneas de `profiles`, `articles` y `article_tags` tienen `ON DELETE CASCADE`. Al eliminar una etiqueta se borran sus filas en `article_tags`.
- **Artículos:** como la eliminación es lógica, la fila no se borra y la cascada de la base de datos no actúa. Por eso el controlador elimina las asociaciones del artículo con sus etiquetas en la misma transacción.

## Endpoints

### Autenticación

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/profile` | Autenticado |
| PUT | `/api/auth/profile` | Autenticado |
| POST | `/api/auth/logout` | Autenticado |

### Usuarios

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Admin |
| POST | `/api/users` | Admin |
| PUT | `/api/users/:id` | Admin |
| DELETE | `/api/users/:id` | Admin (eliminación lógica) |

### Etiquetas

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/tags` | Admin |
| GET | `/api/tags` | Autenticado |
| GET | `/api/tags/:id` | Admin |
| PUT | `/api/tags/:id` | Admin |
| DELETE | `/api/tags/:id` | Admin |

### Artículos

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/articles` | Autenticado |
| GET | `/api/articles` | Autenticado |
| GET | `/api/articles/:id` | Autenticado |
| GET | `/api/articles/user` | Autenticado |
| GET | `/api/articles/user/:id` | Autenticado |
| PUT | `/api/articles/:id` | Autor o admin |
| DELETE | `/api/articles/:id` | Autor o admin (eliminación lógica) |

### Etiquetas de artículos

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/articles-tags` | Autor del artículo |
| DELETE | `/api/articles-tags/:articleTagId` | Autor del artículo |

## Códigos de respuesta

| Código | Caso |
|---|---|
| 200 | Consulta, actualización o eliminación exitosa |
| 201 | Recurso creado |
| 400 | Error de validación o body con JSON mal formado |
| 401 | Sin sesión, token inválido o usuario eliminado |
| 403 | Sin permisos |
| 404 | Recurso o ruta inexistente |
| 500 | Error inesperado |

Los errores de validación devuelven un mensaje y la lista de campos con error:

```json
{
  "message": "Error de validación",
  "errors": [
    {
      "type": "field",
      "value": "ab",
      "msg": "El username debe tener entre 3 y 20 caracteres",
      "path": "username",
      "location": "body"
    }
  ]
}
```
