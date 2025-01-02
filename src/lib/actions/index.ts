'use server';
import type { ResponseInternal } from '@auth/core/types';
import { handleCatchErrorServer } from '@lib/errors';
import type { Response } from '@server/@types';
import type { SignInInput } from '@server/graphql/@types/resolvers-types';
import { auth, signIn, signOut } from 'auth.config';

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
    return handleCatchErrorServer(error);
  }
};
export const userSignOut = async () => {
  try {
    const signoutResponse = (await signOut({
      redirectTo: '/',
      redirect: false,
    })) as ResponseInternal;
    return signoutResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { auth, signIn, signOut };
