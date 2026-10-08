// Configuración y conexión a MySQL mediante Sequelize (ORM)
import { Sequelize } from "sequelize";

// Instancia única que usan los modelos: guarda la configuración, aún no conecta.
// Las credenciales llegan del .env cargado por dotenv
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // process.env guarda strings; 3306 es el puerto por defecto de MySQL
    port: Number(process.env.DB_PORT) || 3306,
    // Motor SQL; requiere el driver mysql2
    dialect: "mysql",
    // No muestra en consola cada consulta SQL
    logging: false,
  },
);

// async: devuelve una Promesa que app.js espera con await antes de app.listen
export const connectDB = async () => {
  try {
    // Handshake con las credenciales y consulta de prueba (SELECT 1+1)
    await sequelize.authenticate();
    // Crea las tablas faltantes de los modelos; no crea la base de datos
    await sequelize.sync();
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    // Promesa rechazada: sin base de datos no se levanta la API
    console.error("No se pudo conectar a la base de datos:", error);
    // Termina el proceso con código de salida 1 (error)
    process.exit(1);
  }
};
