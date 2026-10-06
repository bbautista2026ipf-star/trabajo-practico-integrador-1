import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ArticleTagModel = sequelize.define(
  "ArticleTag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    timestamps: true,
    underscored: true,
    // Evita asociar dos veces la misma etiqueta a un artículo
    indexes: [{ unique: true, fields: ["article_id", "tag_id"] }],
  },
);
