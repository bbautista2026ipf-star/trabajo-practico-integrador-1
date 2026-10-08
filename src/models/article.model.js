// Modelo Article -> tabla articles
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ArticleModel = sequelize.define(
  "Article",
  {
    // STRING(n) -> VARCHAR(n); TEXT para textos largos
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(500),
    },
    // ENUM: solo esos valores; por defecto published
    status: {
      type: DataTypes.ENUM("published", "archived"),
      allowNull: false,
      defaultValue: "published",
    },
    // FK del autor; la relación se declara en models/index.js
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // timestamps: created_at/updated_at; paranoid: eliminación lógica (deleted_at);
    // underscored: columnas en snake_case
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);
