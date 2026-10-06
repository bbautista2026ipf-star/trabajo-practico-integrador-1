import { body } from "express-validator";
import { userDataValidations, profileValidations } from "./user.validations.js";

export const registerValidations = [...userDataValidations, ...profileValidations];

export const loginValidations = [
  body("username")
    .notEmpty({ ignore_whitespace: true }).withMessage("El username es obligatorio").bail()
    .isString().withMessage("El username debe ser un texto").bail()
    .trim(),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria").bail()
    .isString().withMessage("La contraseña debe ser un texto"),
];
