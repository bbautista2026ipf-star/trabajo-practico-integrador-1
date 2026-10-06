import { body, param } from "express-validator";
import { ArticleModel, UserModel } from "../../models/index.js";

export const articleIdValidations = [
  param("id")
    .isInt({ min: 1 }).withMessage("El id debe ser un entero positivo")
    .custom(async (id) => {
      const article = await ArticleModel.findByPk(id);
      if (!article) {
        throw new Error("El artículo no existe");
      }
      return true;
    }),
];

export const createArticleValidations = [
  body("title")
    .notEmpty().withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .notEmpty().withMessage("El contenido es obligatorio")
    .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),
  body("excerpt")
    .optional()
    .isLength({ max: 500 }).withMessage("El resumen no puede superar los 500 caracteres"),
  body("status")
    .optional()
    .isIn(["published", "archived"]).withMessage("El estado debe ser published o archived"),
  // Si no se envía, el autor es el usuario logueado. Solo un admin puede indicar otro
  body("user_id")
    .optional()
    .isInt({ min: 1 }).withMessage("El user_id debe ser un entero positivo")
    .custom(async (userId, { req }) => {
      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error("El usuario no existe");
      }
      if (req.user.role !== "admin" && Number(userId) !== req.user.id) {
        throw new Error("El user_id debe coincidir con el usuario autenticado");
      }
      return true;
    }),
];

export const updateArticleValidations = [
  ...articleIdValidations,
  body("title")
    .optional()
    .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .optional()
    .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),
  body("excerpt")
    .optional()
    .isLength({ max: 500 }).withMessage("El resumen no puede superar los 500 caracteres"),
  body("status")
    .optional()
    .isIn(["published", "archived"]).withMessage("El estado debe ser published o archived"),
];
