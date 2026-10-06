import { body } from "express-validator";
import { userDataValidations, profileValidations } from "./user.validations.js";

export const registerValidations = [...userDataValidations, ...profileValidations];

export const loginValidations = [
  body("username").notEmpty().withMessage("El username es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
