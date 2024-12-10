import { SignInError } from '@auth/core/errors';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { generateSessionToken } from '@lib/auth';
import {
  AuthSignInError,
  ERROR_CODES,
  ERROR_DESCRIPTION,
  PasswordNotSetError,
  UnexpectedError,
  UserNotFoundError,
  ValidationError,
} from '@lib/errors';
import { comparePasswords } from '@lib/index';
import userRepository from '@server/db/model/user/user.model';
import prisma from '@server/db/prisma/client';
import NextAuth, { User as NextAuthUser } from 'next-auth';

import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z, ZodError } from 'zod';

const AUTH_GOOGLE_ID = process.env['AUTH_GOOGLE_ID']!;
const AUTH_GOOGLE_SECRET = process.env['AUTH_GOOGLE_SECRET']!;
const NEXTAUTH_SECRET = process.env['NEXTAUTH_SECRET']!;

const credentialsInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type CredentialsInput = z.infer<typeof credentialsInput>;
const providers: Provider[] = [
  Credentials({
    id: 'credentials',
    credentials: {
      email: { label: 'email', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials): Promise<NextAuthUser | null> {
      try {
        const { email, password } = credentialsInput.parse(credentials);
        const user = await userRepository.getUserByEmail(email);

        if (!user) {
          throw new AuthSignInError(`User with email ${email} Not Found`, {
            type: 'email',
          });
        }
        if (!user.password) {
          throw new PasswordNotSetError(
            ERROR_DESCRIPTION.AUTH_USER_PASSWORD_NOT_SET
          );
        } else {
          const passwordsMatch = await comparePasswords(
            String(password),
            user.password as string
          );

          if (passwordsMatch) {
            return {
              email: user?.email,
              id: user.id,
              image: user.image,
              name: user.name,
            };
          } else
            throw new AuthSignInError(`Wrong Password for user ${email}`, {
              type: 'password',
            });
        }
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ValidationError(error);
        }
        if (error instanceof AuthSignInError) {
          throw error;
        }
        if (
          error instanceof UserNotFoundError &&
          error.code === ERROR_CODES.AUTH_USER_NOT_FOUND.toString()
        ) {
          throw error;
        }
        if (
          error instanceof PasswordNotSetError &&
          error.code === ERROR_CODES.AUTH_USER_PASSWORD_NOT_SET.toString()
        ) {
          throw error;
        } else {
          throw new UnexpectedError(
            'An Unexpected error happened during signin.'
          );
        }
      }
    },
  }),
  Google({
    clientId: AUTH_GOOGLE_ID,
    clientSecret: AUTH_GOOGLE_SECRET,
    authorization: { params: { access_type: 'offline', prompt: 'consent' } },
  }),
];

export const providersMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const { id, name } = provider();
    return { id, name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});
export const googleProvider = Object.values(providersMap).find(
  ({ id }) => id === 'google'
);
export const credentialsProvider = Object.values(providersMap).find(
  ({ id }) => id === 'credentials'
);

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: true,
  providers,
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  adapter: PrismaAdapter(prisma),
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 14 * 24 * 60 * 60, // 14 days
    updateAge: 1 * 24 * 60 * 60, // 1 day
  },
  callbacks: {
    signIn: async ({ account, user }) => {
      if (user && account?.type === 'credentials') {
        try {
          const [dbAccount] = await prisma.account.findMany({
            where: {
              userId: user.id,
              type: 'credentials',
            },
          });
          await prisma.account.update({
            data: {
              access_token: generateSessionToken(),
              id_token: generateSessionToken(),
              refresh_token: generateSessionToken(),
              expires_at: dbAccount.expires_at,
              token_type: 'bearer',
              scope: 'http://localhost/media.read',
            },
            where: { id: dbAccount.id },
          });
          return true;
        } catch (error) {
          throw new SignInError(error);
        }
      }
      if (user && account) return true;
      else return false;
    },
  },
});
