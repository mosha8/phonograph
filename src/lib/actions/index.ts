'use server';
import type { CallbackRouteError } from '@auth/core/errors';
import type { CookieOptions } from '@lib/@types';
import {
  AuthSignInError,
  ERROR_CODES,
  ERROR_DESCRIPTION,
  type PasswordNotSetError,
} from '@lib/errors';
import type { Response } from '@server/@types';
import type { SignInInput } from '@server/graphql/@types/resolvers-types';
import { auth, signIn, signOut } from 'auth.config';

import { CredentialsSignin } from 'next-auth';
import { cookies } from 'next/headers';

export async function getCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  return cookie?.value;
}
export async function setCookie(
  key: string,
  value: string,
  options: CookieOptions
) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options);
}

export const userSignIn = async (
  credentialsId: string,
  { email, password }: SignInInput
): Promise<Response<string>> => {
  try {
    await signIn(credentialsId, {
      email,
      password,
      redirectTo: 'http://localhost:3000/',
    });
    return { success: true, data: 'SignIn Successful.' };
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') {
      return { success: true, data: 'SignIn Successful.' };
    }
    if (error instanceof AuthSignInError) {
      const { code, message } = error;
      return {
        success: false,
        errors: [{ code, message }],
      };
    }
    if (error instanceof CredentialsSignin) {
      const { code, message } = error;
      return {
        success: false,
        errors: [{ code, message }],
      };
    }
    if (error satisfies CallbackRouteError) {
      const { cause } = error as CallbackRouteError;
      if (cause && cause.err) {
        const { code, message } = cause.err as PasswordNotSetError;
        return {
          success: false,
          errors: [
            {
              code,
              message,
            },
          ],
        };
      }
    }
    return {
      success: false,
      errors: [
        {
          code: ERROR_CODES.AUTH_UNKNOWN_ERROR.toString(),
          message: ERROR_DESCRIPTION.AUTH_UNKNOWN_ERROR,
        },
      ],
    };
  }
};
export const userSignOut = async () => {
  try {
    await signOut({ redirectTo: '/' });
  } catch (error) {
    console.error(error);
  }
};

export { auth, signIn, signOut };
