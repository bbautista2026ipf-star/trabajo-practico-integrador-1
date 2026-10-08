// Cierra la cadena de validaciones de cada ruta
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  // Errores acumulados por body() y param(); si hay alguno: 400
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Error de validación", errors: errors.array() });
  }

  next();
};
