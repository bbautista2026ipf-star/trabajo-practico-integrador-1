// Controladores de la relación N:M artículo-etiqueta (tabla article_tags)
import { matchedData } from "express-validator";
import { ArticleTagModel } from "../models/index.js";

// POST /articles-tags: crea la fila en la tabla intermedia
export const addTagToArticle = async (req, res) => {
  try {
    const data = matchedData(req);
    const articleTag = await ArticleTagModel.create(data);

    return res
      .status(201)
      .json({ message: "Etiqueta agregada al artículo", articleTag });
  } catch (error) {
    // Error inesperado (por ejemplo, de la BD): 500
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE /articles-tags/:articleTagId: borrado físico de la asociación
export const removeTagFromArticle = async (req, res) => {
  try {
    const articleTag = await ArticleTagModel.findByPk(req.params.articleTagId);

    if (!articleTag) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    await articleTag.destroy();

    return res.status(200).json({ message: "Etiqueta removida del artículo" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
