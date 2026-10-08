// Validaciones de autenticación
import { body } from "express-validator";
import { userDataValidations, profileValidations } from "./user.validations.js";

// Registro: reutiliza las validaciones de usuario y perfil (spread)
export const registerValidations = [...userDataValidations, ...profileValidations];

// Login: solo presencia y tipo; las credenciales las verifica el controlador
export const loginValidations = [
  body("username")
    .notEmpty({ ignore_whitespace: true }).withMessage("El username es obligatorio").bail()
    .isString().withMessage("El username debe ser un texto").bail()
    .trim(),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria").bail()
    .isString().withMessage("La contraseña debe ser un texto"),
];
