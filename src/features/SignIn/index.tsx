'use client';
import GoogleIcon from '@assets/icons/google.svg';
import Button from '@components/Button';
import FormProvider from '@components/Form/components/provider';
import FormInput from '@components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, userSignIn } from '@lib/actions';
import { ERROR_CODES, ERROR_DESCRIPTION, handleCatchError } from '@lib/errors';
import type { SignInInput } from '@server/graphql/@types/resolvers-types';
import { providersMap } from 'auth.config';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { SignInFormValueSchema } from './@types';
import { signInFormValueSchema } from './@types';

const SignIn = () => {
  // Variables
  const credentialsProvider = Object.values(providersMap).find(
    ({ id }) => id === 'credentials'
  );
  const googleProvider = Object.values(providersMap).find(
    ({ id }) => id === 'google'
  );

  // Form
  const formMethods = useForm<SignInFormValueSchema>({
    resolver: zodResolver(signInFormValueSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  // Hooks
  const router = useRouter();

  // Memos
  const providers = useMemo(
    () => Object.values(providersMap).filter(({ id }) => id !== 'credentials'),
    []
  );

  // Callbacks
  const checkSession = useCallback(async () => {
    const session = await getSession();
    if (session) router.push('/');
  }, [router]);

  const onGoogleClick = useCallback(async () => {
    if (!googleProvider) {
      console.error('No google provider.');
      return;
    } else {
      try {
        await signIn(googleProvider.id, {
          redirectTo: '/',
        });
      } catch (error) {
        handleCatchError(error);
      }
    }
  }, [googleProvider]);

  const onSubmit = useCallback(
    async ({ email, password }: SignInInput) => {
      if (!credentialsProvider) {
        console.error('No credentials provider.');
        return;
      } else {
        const { success, errors } = await userSignIn(credentialsProvider.id, {
          email,
          password,
        });
        if (success) {
          toast.success('SignIn Successful.');
          router.push('/');
        } else {
          if (errors && errors.length > 0) {
            const { code, message } = errors[0];
            if (code === ERROR_CODES.AUTH_PASSWORD_WRONG.toString()) {
              formMethods.setError('password', {
                message: ERROR_DESCRIPTION.AUTH_PASSWORD_WRONG,
              });
            }
            if (code === ERROR_CODES.AUTH_USER_NOT_FOUND.toString()) {
              formMethods.setError('email', {
                message: ERROR_DESCRIPTION.AUTH_USER_NOT_FOUND,
              });
            } else {
              toast.error(message);
            }
          }
        }
      }
    },
    [formMethods, router, credentialsProvider]
  );

  // Effects
  useEffect(() => {
    checkSession().catch((reason) => {
      console.error(reason);
    });
  }, [checkSession]);

  return (
    <div className="h-screen content-center bg-background">
      <div className="bg-white border border-light rounded-lg shadow-lg p-32 max-w-fit mx-auto space-y-8">
        <div className="flex flex-col gap-y-2 items-center">
          <label className="text-5xl font-semibold text-darkest">
            Welcome back
          </label>
          <span className="text-sm text-dark">
            Please sign in to your account
          </span>
        </div>
        <FormProvider
          onSubmit={onSubmit}
          methods={formMethods}
          className="flex flex-col items-center gap-y-4"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="input-text-email">Email</label>
            <FormInput
              id="input-text-email"
              type="text"
              name="email"
              placeholder="Enter your email"
              className="min-w-80"
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="input-text-password">Password</label>
            <FormInput
              id="input-text-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="min-w-80"
              autoComplete="new-password"
            />
          </div>
          <div className="w-full mt-8">
            <Button
              color="primary"
              size="medium"
              variant="contained"
              className="w-full max-w-full"
              disabled={
                formMethods.formState.isSubmitting ||
                !formMethods.formState.isValid
              }
            >
              Sign in
            </Button>
          </div>
        </FormProvider>
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex-1 h-[1px] bg-light" />
          <span className="text-dark text-sm leading-4">or continue with</span>
          <div className="flex-1 h-[1px] bg-light" />
        </div>
        <div className="flex flex-col gap-y-8">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="outlined"
              color="primary"
              size="small"
              className="w-full max-w-full flex gap-x-4"
              onClick={onGoogleClick}
              disabled={formMethods.formState.isSubmitting}
            >
              {`Sign in with ${provider.name}`}
              {<GoogleIcon />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
