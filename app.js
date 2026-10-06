import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";
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

const app = express();
const PORT = process.env.PORT || 3000;

// CORS va primero para que también las respuestas de error lleven sus cabeceras
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tagRoutes);
app.use("/api", articleRoutes);
app.use("/api", articleTagRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

await connectDB();

// En Express 5 el callback también recibe el error si el servidor no inicia
app.listen(PORT, (error) => {
  if (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }

  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
