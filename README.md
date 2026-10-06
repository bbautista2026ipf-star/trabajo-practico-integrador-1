# Trabajo Práctico Integrador I - Blog personal con autenticación

API REST para gestionar un blog personal: usuarios con perfil, artículos y etiquetas, con autenticación por JWT en cookies y permisos por rol.

## Tecnologías

Node.js, Express, ES Modules, Sequelize, MySQL, express-validator, jsonwebtoken, bcrypt, cookie-parser, cors y dotenv.

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
| `DB_HOST` | Host de MySQL |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Clave para firmar los tokens |

4. Iniciar el servidor:

```bash
npm run dev
```

Las tablas se crean al iniciar. Para tener un administrador, registrar un usuario y cambiar su `role` a `admin` en MySQL.

## Estructura

```
├── app.js
└── src/
    ├── config/        conexión a la base de datos
    ├── models/        modelos y relaciones
    ├── routes/        rutas por recurso
    ├── controllers/   lógica de cada endpoint
    ├── middlewares/   autenticación, autorización y validaciones
    └── helpers/       JWT y bcrypt
```

## Modelos y relaciones

| Relación | Tipo | Alias |
|---|---|---|
| User - Profile | 1:1 | `profile` / `user` |
| User - Article | 1:N | `articles` / `author` |
| Article - Tag (a través de ArticleTag) | N:M | `tags` / `articles` |

- **Eliminación lógica:** `User` (`paranoid: true`, columna `deleted_at`).
- **Eliminación en cascada:** al eliminar un artículo o una etiqueta se eliminan sus filas en `article_tags`. También `profiles` y `articles` tienen cascada respecto de `users`.

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
| DELETE | `/api/users/:id` | Admin |

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
| DELETE | `/api/articles/:id` | Autor o admin |

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
| 400 | Error de validación |
| 401 | Sin sesión o token inválido |
| 403 | Sin permisos |
| 404 | Recurso inexistente |
| 500 | Error inesperado |
