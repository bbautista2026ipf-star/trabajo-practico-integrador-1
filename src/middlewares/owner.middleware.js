// Autorización por autoría: compara article.user_id con req.user.id
import { ArticleModel, ArticleTagModel } from "../models/index.js";

// Artículo de req.params.id: autor o admin
export const ownerMiddleware = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    if (article.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No es el autor de este artículo" });
    }

    next();
  } catch (error) {
    // Error inesperado (por ejemplo, de la BD): 500
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Etiquetas de un artículo: solo el autor.
// El artículo sale del body (POST) o de la asociación en params (DELETE)
export const articleTagOwnerMiddleware = async (req, res, next) => {
  try {
    // ?. (optional chaining): en Express 5 req.body es undefined si no hay body
    let articleId = req.body?.article_id;

    // DELETE: el artículo se obtiene desde la asociación
    if (req.params.articleTagId) {
      const articleTag = await ArticleTagModel.findByPk(
        req.params.articleTagId,
      );

      if (!articleTag) {
        return res.status(404).json({ message: "Asociación no encontrada" });
      }

      articleId = articleTag.article_id;
    }

    const article = await ArticleModel.findByPk(articleId);

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    if (article.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Solo el autor puede modificar las etiquetas" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
