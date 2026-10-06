import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  getUserArticles,
  getUserArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerMiddleware } from "../middlewares/owner.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  articleIdValidations,
  createArticleValidations,
  updateArticleValidations,
} from "../middlewares/validations/article.validations.js";

export const articleRoutes = Router();

// /articles/user va antes que /articles/:id para que "user" no se tome como id
articleRoutes.get("/articles/user", authMiddleware, getUserArticles);
articleRoutes.get(
  "/articles/user/:id",
  authMiddleware,
  articleIdValidations,
  validate,
  getUserArticleById,
);
articleRoutes.get("/articles", authMiddleware, getAllArticles);
articleRoutes.get(
  "/articles/:id",
  authMiddleware,
  articleIdValidations,
  validate,
  getArticleById,
);
articleRoutes.post(
  "/articles",
  authMiddleware,
  createArticleValidations,
  validate,
  createArticle,
);
articleRoutes.put(
  "/articles/:id",
  authMiddleware,
  ownerMiddleware,
  updateArticleValidations,
  validate,
  updateArticle,
);
articleRoutes.delete(
  "/articles/:id",
  authMiddleware,
  ownerMiddleware,
  articleIdValidations,
  validate,
  deleteArticle,
);
