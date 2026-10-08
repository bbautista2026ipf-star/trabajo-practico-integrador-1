// Firma y verificación de tokens JWT con la clave secreta JWT_SECRET
import jwt from "jsonwebtoken";

// Firma el payload (id, username, role); expira en 1 hora
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    throw new Error("Error generando el token: " + error.message);
  }
};

// Valida firma y expiración; devuelve el payload o lanza un error
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Error verificando el token: " + error.message);
  }
};
