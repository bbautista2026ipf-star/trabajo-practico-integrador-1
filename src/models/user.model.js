// Modelo User -> tabla users; Sequelize agrega id (PK autoincremental)
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// define registra el modelo en la instancia; sync() crea la tabla
export const UserModel = sequelize.define(
  "User",
  {
    // allowNull: false -> NOT NULL; unique: true -> índice UNIQUE
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    // Guarda el hash de bcrypt, nunca el texto plano
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // ENUM: solo user o admin; por defecto user
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
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
