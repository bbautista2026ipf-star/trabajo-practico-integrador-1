// Modelo ArticleTag -> tabla intermedia article_tags (relación N:M)
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ArticleTagModel = sequelize.define(
  "ArticleTag",
  {
    // PK propia: permite eliminar una asociación por su id
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // FKs hacia articles y tags
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // timestamps: created_at/updated_at; underscored: columnas en snake_case
    timestamps: true,
    underscored: true,
    // Evita asociar dos veces la misma etiqueta a un artículo
    indexes: [{ unique: true, fields: ["article_id", "tag_id"] }],
  },
);
