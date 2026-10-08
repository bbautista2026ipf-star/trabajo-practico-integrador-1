// Controladores de etiquetas (CRUD)
import { matchedData } from "express-validator";
import { TagModel, ArticleModel } from "../models/index.js";

// GET /tags: solo id y name (attributes)
export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.findAll({ attributes: ["id", "name"] });
    return res.status(200).json(tags);
  } catch (error) {
    // Error inesperado (por ejemplo, de la BD): 500
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /tags/:id: etiqueta con sus artículos (N:M)
export const getTagById = async (req, res) => {
  try {
    const tag = await TagModel.findByPk(req.params.id, {
      include: [
        {
          model: ArticleModel,
          as: "articles",
          attributes: ["id", "title", "status"],
          through: { attributes: [] },
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    return res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST /tags: crea con los campos validados (matchedData)
export const createTag = async (req, res) => {
  try {
    const data = matchedData(req);
    const tag = await TagModel.create(data);

    return res.status(201).json({ message: "Etiqueta creada", tag });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT /tags/:id: renombra la etiqueta (name obligatorio por validación)
export const updateTag = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const tag = await TagModel.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    await tag.update(data);

    return res.status(200).json({ message: "Etiqueta actualizada", tag });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE /tags/:id: borrado físico; la cascada elimina sus filas en article_tags
export const deleteTag = async (req, res) => {
  try {
    const tag = await TagModel.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    await tag.destroy();

    return res.status(200).json({ message: "Etiqueta eliminada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
