// Controladores de artículos: consultas con Sequelize y respuestas JSON
import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import {
  ArticleModel,
  ArticleTagModel,
  UserModel,
  TagModel,
} from "../models/index.js";

// required: true hace un INNER JOIN con el autor, así no se muestran los
// artículos de usuarios eliminados lógicamente
const articleIncludes = [
  {
    model: UserModel,
    as: "author",
    attributes: ["id", "username"],
    required: true,
  },
  {
    model: TagModel,
    as: "tags",
    attributes: ["id", "name"],
    // Oculta las columnas de la tabla intermedia
    through: { attributes: [] },
  },
];

// GET /articles: publicados, con autor y etiquetas
export const getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.findAll({
      where: { status: "published" },
      include: articleIncludes,
    });

    return res.status(200).json(articles);
  } catch (error) {
    // Error inesperado (por ejemplo, de la BD): 500
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /articles/:id: búsqueda por clave primaria (findByPk); 404 si no existe
export const getArticleById = async (req, res) => {
  try {
    const article = await ArticleModel.findByPk(req.params.id, {
      include: articleIncludes,
    });

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    return res.status(200).json(article);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /articles/user: publicados del usuario autenticado (req.user)
export const getUserArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.findAll({
      where: { user_id: req.user.id, status: "published" },
      include: articleIncludes,
    });

    return res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /articles/user/:id: findOne filtra por id y autor
export const getUserArticleById = async (req, res) => {
  try {
    const article = await ArticleModel.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: articleIncludes,
    });

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    return res.status(200).json(article);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST /articles: matchedData devuelve solo los campos validados
export const createArticle = async (req, res) => {
  try {
    const data = matchedData(req);
    const article = await ArticleModel.create({
      ...data,
      // ??: sin user_id, el autor es el usuario autenticado
      user_id: data.user_id ?? req.user.id,
    });

    return res.status(201).json({ message: "Artículo creado", article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT /articles/:id: actualización parcial
export const updateArticle = async (req, res) => {
  try {
    // locations: solo campos del body (excluye el id de params)
    const data = matchedData(req, { locations: ["body"] });

    // Sin campos para actualizar: 400
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ message: "Debe enviar al menos un campo para actualizar" });
    }

    const article = await ArticleModel.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    await article.update(data);

    return res.status(200).json({ message: "Artículo actualizado", article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE /articles/:id
// Eliminación lógica (paranoid): la fila queda con deleted_at, así que la
// cascada de la base de datos no actúa. Las asociaciones con etiquetas se
// eliminan en la misma transacción: o se hacen las dos cosas o ninguna
export const deleteArticle = async (req, res) => {
  try {
    const article = await ArticleModel.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    await sequelize.transaction(async (transaction) => {
      await ArticleTagModel.destroy({
        where: { article_id: article.id },
        transaction,
      });
      await article.destroy({ transaction });
    });

    return res.status(200).json({ message: "Artículo eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
