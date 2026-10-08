// Autorización por rol: requiere authMiddleware antes (req.user); 403 si no es admin
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Se necesitan permisos de administrador" });
  }
  next();
};
