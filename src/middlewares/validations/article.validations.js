import { body, param } from "express-validator";
import { ArticleModel, UserModel } from "../../models/index.js";

export const articleIdValidations = [
  param("id")
    .isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").bail()
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
    .notEmpty({ ignore_whitespace: true }).withMessage("El título es obligatorio").bail()
    .isString().withMessage("El título debe ser un texto").bail()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .notEmpty({ ignore_whitespace: true }).withMessage("El contenido es obligatorio").bail()
    .isString().withMessage("El contenido debe ser un texto").bail()
    .trim()
    .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),
  body("excerpt")
    .optional()
    .isString().withMessage("El resumen debe ser un texto").bail()
    .trim()
    .isLength({ max: 500 }).withMessage("El resumen no puede superar los 500 caracteres"),
  body("status")
    .optional()
    .isString().withMessage("El estado debe ser un texto").bail()
    .isIn(["published", "archived"]).withMessage("El estado debe ser published o archived"),
  // Si no se envía, el autor es el usuario logueado. Solo un admin puede indicar otro
  body("user_id")
    .optional()
    .isInt({ min: 1 }).withMessage("El user_id debe ser un entero positivo").bail()
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
    .isString().withMessage("El título debe ser un texto").bail()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .optional()
    .isString().withMessage("El contenido debe ser un texto").bail()
    .trim()
    .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),
  body("excerpt")
    .optional()
    .isString().withMessage("El resumen debe ser un texto").bail()
    .trim()
    .isLength({ max: 500 }).withMessage("El resumen no puede superar los 500 caracteres"),
  body("status")
    .optional()
    .isString().withMessage("El estado debe ser un texto").bail()
    .isIn(["published", "archived"]).withMessage("El estado debe ser published o archived"),
];
