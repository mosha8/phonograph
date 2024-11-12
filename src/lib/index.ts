import { compare, genSalt, hash } from 'bcrypt';
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(SALT_ROUNDS);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns True if the passwords match, otherwise false.
 */
const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};

export { comparePasswords, hashPassword };
