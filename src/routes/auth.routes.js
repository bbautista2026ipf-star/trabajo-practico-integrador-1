// Rutas de autenticación
import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerValidations,
  loginValidations,
} from "../middlewares/validations/auth.validations.js";
import { updateProfileValidations } from "../middlewares/validations/user.validations.js";

// Router: agrupa rutas; app.js lo monta bajo /api
export const authRoutes = Router();

// Públicas: validaciones -> validate -> controlador
authRoutes.post("/auth/register", registerValidations, validate, register);
authRoutes.post("/auth/login", loginValidations, validate, login);
// Protegidas: authMiddleware verifica el JWT de la cookie
authRoutes.get("/auth/profile", authMiddleware, getProfile);
authRoutes.put(
  "/auth/profile",
  authMiddleware,
  updateProfileValidations,
  validate,
  updateProfile,
);
authRoutes.post("/auth/logout", authMiddleware, logout);
