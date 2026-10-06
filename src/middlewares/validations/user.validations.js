import { body, param } from "express-validator";
import { Op } from "sequelize";
import { UserModel } from "../../models/index.js";

// Unicidad: incluye a los usuarios eliminados lógicamente (paranoid: false)
// y excluye al propio usuario cuando se edita
const isUnique = (field) => async (value, { req }) => {
  const where = { [field]: value };

  if (req.params.id) {
    where.id = { [Op.ne]: req.params.id };
  }

  const user = await UserModel.findOne({ where, paranoid: false });
  if (user) {
    throw new Error(`El ${field} ya está en uso`);
  }
  return true;
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordMessage =
  "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";

// trim() quita los espacios de los extremos antes de validar y bail() corta
// la cadena en el primer error, así no se consulta la BD con datos inválidos
export const userDataValidations = [
  body("username")
    .trim()
    .notEmpty().withMessage("El username es obligatorio").bail()
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El username solo puede tener letras y números").bail()
    .custom(isUnique("username")),
  body("email")
    .trim()
    .notEmpty().withMessage("El email es obligatorio").bail()
    .isEmail().withMessage("El email no es válido").bail()
    .custom(isUnique("email")),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria").bail()
    .matches(passwordRegex).withMessage(passwordMessage),
];

const optionalProfileValidations = [
  body("biography")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("La biografía no puede superar los 500 caracteres"),
  body("avatar_url")
    .optional()
    .trim()
    .isURL().withMessage("El avatar debe ser una URL válida"),
  body("birth_date")
    .optional()
    .isDate().withMessage("La fecha de nacimiento debe tener el formato YYYY-MM-DD"),
];

export const profileValidations = [
  body("first_name")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio").bail()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede tener letras"),
  body("last_name")
    .trim()
    .notEmpty().withMessage("El apellido es obligatorio").bail()
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede tener letras"),
  ...optionalProfileValidations,
];

export const updateProfileValidations = [
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede tener letras"),
  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede tener letras"),
  ...optionalProfileValidations,
];

const roleValidation = body("role")
  .optional()
  .isIn(["user", "admin"]).withMessage("El rol debe ser user o admin");

export const userIdValidations = [
  param("id")
    .isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").bail()
    .custom(async (id) => {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw new Error("El usuario no existe");
      }
      return true;
    }),
];

export const createUserValidations = [
  ...userDataValidations,
  roleValidation,
  ...profileValidations,
];

export const updateUserValidations = [
  ...userIdValidations,
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El username solo puede tener letras y números").bail()
    .custom(isUnique("username")),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("El email no es válido").bail()
    .custom(isUnique("email")),
  body("password")
    .optional()
    .matches(passwordRegex).withMessage(passwordMessage),
  roleValidation,
];
