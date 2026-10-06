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

export const userDataValidations = [
  body("username")
    .notEmpty().withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El username solo puede tener letras y números")
    .custom(isUnique("username")),
  body("email")
    .notEmpty().withMessage("El email es obligatorio")
    .isEmail().withMessage("El email no es válido")
    .custom(isUnique("email")),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .matches(passwordRegex).withMessage(passwordMessage),
];

const optionalProfileValidations = [
  body("biography")
    .optional()
    .isLength({ max: 500 }).withMessage("La biografía no puede superar los 500 caracteres"),
  body("avatar_url")
    .optional()
    .isURL().withMessage("El avatar debe ser una URL válida"),
  body("birth_date")
    .optional()
    .isDate().withMessage("La fecha de nacimiento debe tener el formato YYYY-MM-DD"),
];

export const profileValidations = [
  body("first_name")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede tener letras"),
  body("last_name")
    .notEmpty().withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede tener letras"),
  ...optionalProfileValidations,
];

export const updateProfileValidations = [
  body("first_name")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede tener letras"),
  body("last_name")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede tener letras"),
  ...optionalProfileValidations,
];

const roleValidation = body("role")
  .optional()
  .isIn(["user", "admin"]).withMessage("El rol debe ser user o admin");

export const userIdValidations = [
  param("id")
    .isInt({ min: 1 }).withMessage("El id debe ser un entero positivo")
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
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El username solo puede tener letras y números")
    .custom(isUnique("username")),
  body("email")
    .optional()
    .isEmail().withMessage("El email no es válido")
    .custom(isUnique("email")),
  body("password")
    .optional()
    .matches(passwordRegex).withMessage(passwordMessage),
  roleValidation,
];
