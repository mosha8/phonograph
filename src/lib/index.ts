'use server';
import type { User as PrismaUser } from '@prisma/client';
import type { User as GraphQLUser } from '@server/graphql/@types/resolvers-types';
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

type NormalizeUserResponse<TResponse> = (user: PrismaUser) => TResponse;
/**
 * Normalizes an object for transfer over network. converting dates to strings, etc...
 * @param object - The object that'll be transferred.
 * @returns The normalized object.
 */
const normalizeUser: NormalizeUserResponse<GraphQLUser> = (user) => {
  const normalizedObject = Object.assign(user) as GraphQLUser;
  Object.entries(user)
    .filter((arr) => arr[0] === 'createdAt' || arr[0] === 'updatedAt')
    .map((arr) => {
      if (arr[0] === 'createdAt')
        normalizedObject['createdAt'] = (arr[1] as Date).toJSON();
      else normalizedObject['updatedAt'] = (arr[1] as Date).toJSON();
    });
  const normalizedUser = normalizedObject;
  return normalizedUser;
};

/**
 * Normalizes an object for transfer over network. converting dates to strings, etc...
 * @param object - The object that'll be transferred.
 * @returns The normalized object.
 */
const stringifyQueryParams = (
  params: Record<string, unknown>
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
};

export { comparePasswords, hashPassword, normalizeUser, stringifyQueryParams };
