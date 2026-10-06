import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { UserModel, ProfileModel, ArticleModel } from "../models/index.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: ProfileModel, as: "profile" }],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: ProfileModel, as: "profile" },
        {
          model: ArticleModel,
          as: "articles",
          attributes: ["id", "title", "status"],
        },
      ],
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

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, ...profileData } =
      matchedData(req);

    const hashedPassword = await hashPassword(password);

    // Usuario y perfil se crean juntos: si uno falla, no se guarda ninguno
    const user = await sequelize.transaction(async (transaction) => {
      const newUser = await UserModel.create(
        { username, email, password: hashedPassword, role },
        { transaction },
      );
      await ProfileModel.create(
        { ...profileData, user_id: newUser.id },
        { transaction },
      );
      return newUser;
    });

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: { id: user.id, username, email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ message: "Debe enviar al menos un campo para actualizar" });
    }

    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    await user.update(data);

    return res.status(200).json({
      message: "Usuario actualizado",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    return res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
