import { matchedData } from "express-validator";
import { ArticleModel, UserModel, TagModel } from "../models/index.js";

const articleIncludes = [
  { model: UserModel, as: "author", attributes: ["id", "username"] },
  {
    model: TagModel,
    as: "tags",
    attributes: ["id", "name"],
    through: { attributes: [] },
  },
];

export const getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.findAll({
      where: { status: "published" },
      include: articleIncludes,
    });

    return res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

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

export const createArticle = async (req, res) => {
  try {
    const data = matchedData(req);
    const article = await ArticleModel.create({
      ...data,
      user_id: data.user_id ?? req.user.id,
    });

    return res.status(201).json({ message: "Artículo creado", article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

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

// Se borra la fila: la cascada elimina sus asociaciones en ArticleTag
export const deleteArticle = async (req, res) => {
  try {
    const article = await ArticleModel.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    await article.destroy();

    return res.status(200).json({ message: "Artículo eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
