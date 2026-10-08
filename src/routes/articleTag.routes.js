// Rutas de la relación artículo-etiqueta
import { Router } from "express";
import {
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/articleTag.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { articleTagOwnerMiddleware } from "../middlewares/owner.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createArticleTagValidations,
  articleTagIdValidations,
} from "../middlewares/validations/articleTag.validations.js";

// Solo el autor del artículo agrega o quita etiquetas (articleTagOwnerMiddleware)
export const articleTagRoutes = Router();

// Se valida antes de verificar la autoría: el artículo tiene que existir
articleTagRoutes.post(
  "/articles-tags",
  authMiddleware,
  createArticleTagValidations,
  validate,
  articleTagOwnerMiddleware,
  addTagToArticle,
);
articleTagRoutes.delete(
  "/articles-tags/:articleTagId",
  authMiddleware,
  articleTagIdValidations,
  validate,
  articleTagOwnerMiddleware,
  removeTagFromArticle,
);
