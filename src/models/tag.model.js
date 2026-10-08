// Modelo Tag -> tabla tags
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const TagModel = sequelize.define(
  "Tag",
  {
    // unique: no se repiten nombres de etiqueta
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
  },
  {
    // timestamps: created_at/updated_at; underscored: columnas en snake_case
    // Sin paranoid: destroy() borra la fila y la cascada limpia article_tags
    timestamps: true,
    underscored: true,
  },
);
