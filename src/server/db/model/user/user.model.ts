import {
  DatabaseConnectionFailedError,
  EmailUniqueConstraintError,
  ERROR_CODES,
  ERROR_DESCRIPTION,
  UnexpectedError,
  UserNotFoundError,
} from '@lib/errors';
import { hashPassword } from '@lib/index';
import type { User } from '@prisma/client';
import type {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

import prisma from '@server/db/prisma/client';
import type { SignUpInput } from '@server/graphql/@types/resolvers-types';

class UserRepository {
  private readonly prismaClient;
  constructor() {
    this.prismaClient = prisma;
  }
  async createUser({ email, password }: SignUpInput): Promise<User | null> {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await this.prismaClient.user.create({
        data: { email, password: hashedPassword },
      });
      if (!user) {
        throw new UnexpectedError(ERROR_DESCRIPTION.UNEXPECTED_ERROR);
      }
      return user;
    } catch (error) {
      if (
        (error satisfies PrismaClientInitializationError) &&
        (error as Error).name === 'PrismaClientInitializationError'
      ) {
        throw new DatabaseConnectionFailedError(
          ERROR_DESCRIPTION.DATABASE_CONNECTION_FAILED,
          ERROR_CODES.DATABASE_CONNECTION_FAILED
        );
      }
      if (
        (error satisfies PrismaClientKnownRequestError) &&
        (error as PrismaClientKnownRequestError).code === 'P2002'
      ) {
        throw new EmailUniqueConstraintError(
          ERROR_DESCRIPTION.EMAIL_UNIQUE_CONSTRAINT,
          ERROR_CODES.EMAIL_UNIQUE_CONSTRAINT
        );
      } else if (error instanceof UnexpectedError) {
        const { message } = error;
        throw new UnexpectedError(message);
      }
      return null;
    }
  }
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { role: true },
      });
      if (user === null) {
        throw new UserNotFoundError('User Not Found.');
      }
      return user;
    } catch (error) {
      if (
        (error satisfies PrismaClientInitializationError) &&
        (error as Error).name === 'PrismaClientInitializationError'
      ) {
        throw new DatabaseConnectionFailedError(
          ERROR_DESCRIPTION.DATABASE_CONNECTION_FAILED,
          ERROR_CODES.DATABASE_CONNECTION_FAILED
        );
      }
      if (error instanceof UserNotFoundError) {
        const { message } = error;
        throw new UserNotFoundError(message);
      } else if (error instanceof UnexpectedError) {
        const { message } = error;
        throw new UnexpectedError(message);
      }
      return null;
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });
      if (user === null) {
        throw new UserNotFoundError('User Not Found.');
      }
      return user;
    } catch (error) {
      if (
        (error satisfies PrismaClientInitializationError) &&
        (error as Error).name === 'PrismaClientInitializationError'
      ) {
        throw new DatabaseConnectionFailedError(
          ERROR_DESCRIPTION.DATABASE_CONNECTION_FAILED,
          ERROR_CODES.DATABASE_CONNECTION_FAILED
        );
      }
      if (error instanceof UserNotFoundError) {
        const { message } = error;
        throw new UserNotFoundError(message);
      } else if (error instanceof UnexpectedError) {
        const { message } = error;
        throw new UnexpectedError(message);
      }
      return null;
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
