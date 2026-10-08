// Autenticación: registro, login con JWT en cookie, perfil y logout
import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

// Mismas opciones al crear y al limpiar la cookie: si no coinciden, el
// navegador no la borra. secure exige HTTPS, por eso solo en producción
const cookieOptions = {
  // httpOnly: inaccesible desde JS (XSS); sameSite strict: mitiga CSRF
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

// POST /auth/register: rest (...) separa los datos del perfil
export const register = async (req, res) => {
  try {
    const { username, email, password, ...profileData } = matchedData(req);

    // Se guarda el hash, nunca el texto plano
    const hashedPassword = await hashPassword(password);

    // Usuario y perfil se crean juntos: si uno falla, no se guarda ninguno
    await sequelize.transaction(async (transaction) => {
      const user = await UserModel.create(
        { username, email, password: hashedPassword },
        { transaction },
      );
      await ProfileModel.create(
        { ...profileData, user_id: user.id },
        { transaction },
      );
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    // Error inesperado (por ejemplo, de la BD): 500
    console.error(error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// POST /auth/login: mismo mensaje si falla usuario o contraseña (no revela cuál)
export const login = async (req, res) => {
  try {
    const { username, password } = matchedData(req);

    const user = await UserModel.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // JWT en cookie de 1 hora (maxAge en ms), igual que su expiración
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, { ...cookieOptions, maxAge: 1000 * 60 * 60 });

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /auth/profile: usuario autenticado con su perfil, sin la contraseña
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: ProfileModel, as: "profile" }],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT /auth/profile: actualiza el perfil del usuario autenticado
export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    // Sin campos para actualizar: 400
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ message: "Debe enviar al menos un campo para actualizar" });
    }

    const profile = await ProfileModel.findOne({
      where: { user_id: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    await profile.update(data);

    return res.status(200).json({ message: "Perfil actualizado", profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST /auth/logout: borra la cookie del token; no es async (no consulta la BD)
export const logout = (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
