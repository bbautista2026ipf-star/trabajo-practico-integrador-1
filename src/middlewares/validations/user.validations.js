// Validaciones de usuarios y perfiles (también las usa auth.validations)
import { body, param } from "express-validator";
import { Op } from "sequelize";
import { UserModel } from "../../models/index.js";

// Función de orden superior: isUnique(campo) devuelve el validador (closure)
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

// Lookaheads (?=...): minúscula, mayúscula y dígito; mínimo 8 caracteres
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordMessage =
  "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";

// Datos de usuario obligatorios. isString() va antes que trim(): trim()
// convierte cualquier valor en texto y un array u objeto fallaría al guardar (500).
// notEmpty({ ignore_whitespace: true }) rechaza textos con solo espacios y
// bail() corta en el primer error, así no se consulta la BD con datos inválidos
export const userDataValidations = [
  body("username")
    .notEmpty({ ignore_whitespace: true }).withMessage("El username es obligatorio").bail()
    .isString().withMessage("El username debe ser un texto").bail()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El username solo puede tener letras y números").bail()
    .custom(isUnique("username")),
  body("email")
    .notEmpty({ ignore_whitespace: true }).withMessage("El email es obligatorio").bail()
    .isString().withMessage("El email debe ser un texto").bail()
    .trim()
    .isLength({ max: 100 }).withMessage("El email no puede superar los 100 caracteres")
    .isEmail().withMessage("El email no es válido").bail()
    .custom(isUnique("email")),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria").bail()
    .isString().withMessage("La contraseña debe ser un texto").bail()
    .matches(passwordRegex).withMessage(passwordMessage),
];

// Campos opcionales del perfil, compartidos por alta y edición
const optionalProfileValidations = [
  body("biography")
    .optional()
    .isString().withMessage("La biografía debe ser un texto").bail()
    .trim()
    .isLength({ max: 500 }).withMessage("La biografía no puede superar los 500 caracteres"),
  body("avatar_url")
    .optional()
    .isString().withMessage("El avatar debe ser un texto").bail()
    .trim()
    .isLength({ max: 255 }).withMessage("El avatar no puede superar los 255 caracteres")
    .isURL().withMessage("El avatar debe ser una URL válida"),
  body("birth_date")
    .optional()
    .isString().withMessage("La fecha de nacimiento debe tener el formato YYYY-MM-DD").bail()
    .isDate().withMessage("La fecha de nacimiento debe tener el formato YYYY-MM-DD"),
];

// Alta: nombre y apellido obligatorios; isAlpha("es-ES") admite tildes y ñ,
// ignore permite espacios
export const profileValidations = [
  body("first_name")
    .notEmpty({ ignore_whitespace: true }).withMessage("El nombre es obligatorio").bail()
    .isString().withMessage("El nombre debe ser un texto").bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede tener letras"),
  body("last_name")
    .notEmpty({ ignore_whitespace: true }).withMessage("El apellido es obligatorio").bail()
    .isString().withMessage("El apellido debe ser un texto").bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede tener letras"),
  ...optionalProfileValidations,
];

// Edición del perfil: los mismos campos, todos opcionales
export const updateProfileValidations = [
  body("first_name")
    .optional()
    .isString().withMessage("El nombre debe ser un texto").bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede tener letras"),
  body("last_name")
    .optional()
    .isString().withMessage("El apellido debe ser un texto").bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede tener letras"),
  ...optionalProfileValidations,
];

// Rol opcional: user o admin (si falta, el modelo asigna user)
const roleValidation = body("role")
  .optional()
  .isString().withMessage("El rol debe ser un texto").bail()
  .isIn(["user", "admin"]).withMessage("El rol debe ser user o admin");

// param id: entero positivo y usuario no eliminado lógicamente
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

// Alta por admin: datos de usuario, rol y perfil
export const createUserValidations = [
  ...userDataValidations,
  roleValidation,
  ...profileValidations,
];

// Edición por admin: id válido y campos opcionales con unicidad
export const updateUserValidations = [
  ...userIdValidations,
  body("username")
    .optional()
    .isString().withMessage("El username debe ser un texto").bail()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El username solo puede tener letras y números").bail()
    .custom(isUnique("username")),
  body("email")
    .optional()
    .isString().withMessage("El email debe ser un texto").bail()
    .trim()
    .isLength({ max: 100 }).withMessage("El email no puede superar los 100 caracteres")
    .isEmail().withMessage("El email no es válido").bail()
    .custom(isUnique("email")),
  body("password")
    .optional()
    .isString().withMessage("La contraseña debe ser un texto").bail()
    .matches(passwordRegex).withMessage(passwordMessage),
  roleValidation,
];
