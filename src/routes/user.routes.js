import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserValidations,
  updateUserValidations,
  userIdValidations,
} from "../middlewares/validations/user.validations.js";

export const userRoutes = Router();

userRoutes.get("/users", authMiddleware, adminMiddleware, getAllUsers);
userRoutes.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidations,
  validate,
  getUserById,
);
userRoutes.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  createUserValidations,
  validate,
  createUser,
);
userRoutes.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  updateUserValidations,
  validate,
  updateUser,
);
userRoutes.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidations,
  validate,
  deleteUser,
);
