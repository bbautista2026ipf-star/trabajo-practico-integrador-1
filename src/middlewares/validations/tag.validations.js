// Validaciones de etiquetas
import { body, param } from "express-validator";
import { Op } from "sequelize";
import { TagModel } from "../../models/index.js";

// Nombre único; al editar excluye la propia etiqueta (Op.ne: distinto de)
const isUniqueName = async (name, { req }) => {
  const where = { name };

  if (req.params.id) {
    where.id = { [Op.ne]: req.params.id };
  }

  const tag = await TagModel.findOne({ where });
  if (tag) {
    throw new Error("Ya existe una etiqueta con ese nombre");
  }
  return true;
};

// param id: entero positivo y etiqueta existente
export const tagIdValidations = [
  param("id")
    .isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").bail()
    .custom(async (id) => {
      const tag = await TagModel.findByPk(id);
      if (!tag) {
        throw new Error("La etiqueta no existe");
      }
      return true;
    }),
];

// name: 2 a 30 caracteres, sin espacios (regex) y único
export const createTagValidations = [
  body("name")
    .notEmpty({ ignore_whitespace: true }).withMessage("El nombre es obligatorio").bail()
    .isString().withMessage("El nombre debe ser un texto").bail()
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .matches(/^\S+$/).withMessage("El nombre no puede tener espacios").bail()
    .custom(isUniqueName),
];

// Edición: id válido y las mismas reglas que la creación
export const updateTagValidations = [
  ...tagIdValidations,
  ...createTagValidations,
];
