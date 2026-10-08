// Punto de entrada: configura Express, monta las rutas y levanta el servidor

// Primer import: carga el .env en process.env antes de evaluar los demás módulos
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";
// Import sin nombres: ejecuta el módulo y registra modelos y asociaciones
import "./src/models/index.js";
import { authRoutes } from "./src/routes/auth.routes.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { tagRoutes } from "./src/routes/tag.routes.js";
import { articleRoutes } from "./src/routes/article.routes.js";
import { articleTagRoutes } from "./src/routes/articleTag.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./src/middlewares/error.middleware.js";

// Instancia de la aplicación; PORT por defecto si no está en el .env
const app = express();
const PORT = process.env.PORT || 3000;

// CORS va primero para que también las respuestas de error lleven sus cabeceras
app.use(
  cors({
    // Origen permitido (frontend en Vite) y envío de cookies entre orígenes
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// Parsean el body JSON a req.body y las cookies a req.cookies
app.use(express.json());
app.use(cookieParser());

// Routers montados bajo el prefijo /api
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tagRoutes);
app.use("/api", articleRoutes);
app.use("/api", articleTagRoutes);

// Después de las rutas: 404 si ninguna coincidió y manejador de errores global
app.use(notFoundHandler);
app.use(errorHandler);

// Top-level await: el servidor solo escucha si la base de datos conectó
await connectDB();

// En Express 5 el callback también recibe el error si el servidor no inicia
app.listen(PORT, (error) => {
  if (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }

  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
