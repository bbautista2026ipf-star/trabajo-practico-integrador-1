// Modelo Profile -> tabla profiles; datos personales del usuario
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ProfileModel = sequelize.define(
  "Profile",
  {
    // FK hacia users; unique: un solo perfil por usuario (1:1)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // Campos opcionales: allowNull es true por defecto
    biography: {
      type: DataTypes.TEXT,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
    },
    // DATEONLY: fecha sin hora (YYYY-MM-DD)
    birth_date: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    // timestamps: created_at/updated_at; underscored: columnas en snake_case
    timestamps: true,
    underscored: true,
  },
);
