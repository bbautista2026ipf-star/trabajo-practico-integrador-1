// Validaciones de la relación artículo-etiqueta
import { body, param } from "express-validator";
import {
  ArticleModel,
  TagModel,
  ArticleTagModel,
} from "../../models/index.js";

// Creación: artículo y etiqueta existentes, sin asociación repetida
export const createArticleTagValidations = [
  body("article_id")
    .isInt({ min: 1 }).withMessage("El article_id debe ser un entero positivo").bail()
    .custom(async (articleId) => {
      const article = await ArticleModel.findByPk(articleId);
      if (!article) {
        throw new Error("El artículo no existe");
      }
      return true;
    }),
  body("tag_id")
    .isInt({ min: 1 }).withMessage("El tag_id debe ser un entero positivo").bail()
    // { req } da acceso al body para detectar el duplicado
    .custom(async (tagId, { req }) => {
      const tag = await TagModel.findByPk(tagId);
      if (!tag) {
        throw new Error("La etiqueta no existe");
      }

      const articleTag = await ArticleTagModel.findOne({
        where: { article_id: req.body.article_id, tag_id: tagId },
      });
      if (articleTag) {
        throw new Error("El artículo ya tiene esa etiqueta");
      }
      return true;
    }),
];

// param articleTagId: entero positivo y asociación existente
export const articleTagIdValidations = [
  param("articleTagId")
    .isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").bail()
    .custom(async (id) => {
      const articleTag = await ArticleTagModel.findByPk(id);
      if (!articleTag) {
        throw new Error("La asociación no existe");
      }
      return true;
    }),
];
