// Hash y comparación de contraseñas con bcrypt
import bcrypt from "bcrypt";

// saltRounds: costo del hash (2^10 rondas); cada hash incluye un salt aleatorio
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compara el texto plano con el hash guardado (usa su salt): true o false
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
