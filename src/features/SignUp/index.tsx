'use client';
import GoogleIcon from '@assets/icons/google.svg';
import Button from '@components/Button';
import FormProvider from '@components/Form/components/provider';
import FormInput from '@components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from '@lib/actions';
import graphQLClient from '@lib/client/graphql-client';
import { handleCatchError } from '@lib/errors';
import type { SignUpInput, User } from '@server/graphql/@types/resolvers-types';
import { useMutation } from '@tanstack/react-query';
import { credentialsProvider, googleProvider, providersMap } from 'auth.config';
import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { SignUpFormValueSchema } from './@types';
import { signUpFormValueSchema, signUpKeyGenerator } from './@types';

const SignUp = () => {
  // Hooks
  const router = useRouter();

  // Callbacks
  const checkSession = useCallback(async () => {
    const session = await getSession();
    if (session) router.push('/');
  }, [router]);

  const onGoogleClick = useCallback(async () => {
    try {
      if (!googleProvider) {
        console.error('No google provider.');
        return;
      } else {
        await signIn(googleProvider.id, {
          redirectTo: '/',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong with google signup.');
    }
  }, []);

  const mutateFn = useCallback(async ({ email, password }: SignUpInput) => {
    const document = gql`
        mutation Auth {
          signUp(input: { email: "${email}", password: "${password}" }) {
            id
            email
            isActive
          }
        }
      `;

    try {
      const { signUp }: { signUp: Pick<User, 'id' | 'email' | 'isActive'> } =
        await graphQLClient.request({
          document,
        });

      return signUp;
    } catch (error) {
      handleCatchError(error);
    }
  }, []);

  // Form
  const formMethods = useForm<SignUpFormValueSchema>({
    resolver: zodResolver(signUpFormValueSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });
  const { mutateAsync: signUp, isPending } = useMutation({
    mutationKey: signUpKeyGenerator(),
    mutationFn: mutateFn,
  });

  const onSubmit = useCallback(
    async ({ email, password }: SignUpFormValueSchema) => {
      try {
        if (!credentialsProvider) {
          console.error('No credentials provider.');
          return;
        } else {
          const register = await signUp({
            email,
            password,
          });
          if (register) {
            toast.success('SignUp Successful.');
            router.push('/signin');
          }
        }
      } catch (error) {
        handleCatchError(error);
      }
    },
    [router, signUp]
  );

  // Effects
  useEffect(() => {
    checkSession().catch((reason) => {
      console.error(reason);
    });
  }, [checkSession]);

  if (isPending) {
    return (
      <div className="h-screen content-center bg-background">
        <div className="min-w-[578px] h-[734px] bg-white border border-light rounded-lg shadow-lg p-32 max-w-fit mx-auto space-y-8 mt-12">
          <div className="w-80 h-14 rounded-lg bg-zinc-400 animate-pulse" />
          <div className="flex flex-col items-center gap-y-8 py-12">
            <div className="w-80 h-10 rounded-lg bg-zinc-400 animate-pulse" />
            <div className="w-80 h-10 rounded-lg bg-zinc-400 animate-pulse" />
          </div>
          <div className="w-80 h-12 rounded-lg bg-zinc-400 animate-pulse" />
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen content-center bg-background">
      <div className="bg-white border border-light rounded-lg shadow-lg p-32 max-w-fit mx-auto space-y-8">
        <div className="flex flex-col gap-y-2 items-center">
          <label className="text-5xl font-semibold text-darkest">Welcome</label>
          <span className="text-sm text-dark">
            Please register to setup your account
          </span>
        </div>
        <FormProvider
          onSubmit={onSubmit}
          methods={formMethods}
          className="flex flex-col items-center gap-y-4"
        >
          <div className="w-full flex flex-col gap-y-2">
            <label htmlFor="input-text-email">Email</label>
            <FormInput
              id="input-text-email"
              type="text"
              name="email"
              placeholder="Enter your email"
              className="min-w-80"
            />
          </div>
          <div className="w-full flex flex-col gap-y-2">
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
              Sign up
            </Button>
          </div>
        </FormProvider>
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex-1 h-[1px] bg-light" />
          <span className="text-dark text-sm leading-4">or continue with</span>
          <div className="flex-1 h-[1px] bg-light" />
        </div>
        <div className="">
          {Object.values(providersMap)
            .filter(({ id }) => id !== 'credentials')
            .map((provider) => (
              <Button
                key={provider.id}
                variant="outlined"
                color="primary"
                size="small"
                className="w-full max-w-full flex gap-x-4"
                onClick={onGoogleClick}
                disabled={formMethods.formState.isSubmitting}
              >
                {`Sign up with ${provider.name}`}
                {<GoogleIcon />}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
