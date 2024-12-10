import type { PrismaClient } from '@prisma/client/extension';
import prisma from '@server/db/prisma/client';

export type GraphQLContext = {
  prisma: PrismaClient;
};

export const createContext = (): GraphQLContext => {
  return { prisma };
};
