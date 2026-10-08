// Rutas de etiquetas
import { Router } from "express";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTagValidations,
  updateTagValidations,
  tagIdValidations,
} from "../middlewares/validations/tag.validations.js";

// Middlewares en orden: auth -> admin -> validaciones -> validate -> controlador
export const tagRoutes = Router();

// Listado: cualquier usuario autenticado; el resto, solo admin
tagRoutes.get("/tags", authMiddleware, getAllTags);
tagRoutes.get(
  "/tags/:id",
  authMiddleware,
  adminMiddleware,
  tagIdValidations,
  validate,
  getTagById,
);
tagRoutes.post(
  "/tags",
  authMiddleware,
  adminMiddleware,
  createTagValidations,
  validate,
  createTag,
);
tagRoutes.put(
  "/tags/:id",
  authMiddleware,
  adminMiddleware,
  updateTagValidations,
  validate,
  updateTag,
);
tagRoutes.delete(
  "/tags/:id",
  authMiddleware,
  adminMiddleware,
  tagIdValidations,
  validate,
  deleteTag,
);
