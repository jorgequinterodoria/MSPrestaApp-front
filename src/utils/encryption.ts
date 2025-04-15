// utils/encryption.ts
import bcrypt from 'bcryptjs';

// Número de rondas de salt (10-12 es un buen balance entre seguridad y rendimiento)
const SALT_ROUNDS = 10;

/**
 * Genera un hash seguro para una contraseña
 * @param password Contraseña en texto plano
 * @returns String con el hash de la contraseña
 */
export const hashPassword = (password: string): string => {
  // Genera un salt aleatorio y luego hace el hash
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

/**
 * Verifica si una contraseña coincide con un hash
 * @param password Contraseña en texto plano a verificar
 * @param hashedPassword Hash almacenado para comparar
 * @returns true si la contraseña coincide, false si no
 */
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};