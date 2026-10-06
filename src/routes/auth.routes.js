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

export const authRoutes = Router();

authRoutes.post("/auth/register", registerValidations, validate, register);
authRoutes.post("/auth/login", loginValidations, validate, login);
authRoutes.get("/auth/profile", authMiddleware, getProfile);
authRoutes.put(
  "/auth/profile",
  authMiddleware,
  updateProfileValidations,
  validate,
  updateProfile,
);
authRoutes.post("/auth/logout", authMiddleware, logout);
