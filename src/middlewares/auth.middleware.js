import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  try {
    // El token sigue vigente aunque el usuario se haya eliminado lógicamente
    // o le hayan cambiado el rol: se usan sus datos actuales
    const user = await UserModel.findByPk(payload.id, {
      attributes: ["id", "username", "role"],
    });

    if (!user) {
      return res.status(401).json({ message: "El usuario ya no existe" });
    }

    req.user = { id: user.id, username: user.username, role: user.role };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
