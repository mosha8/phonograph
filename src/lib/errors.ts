import type { CallbackRouteError } from '@auth/core/errors';
import { ClientError as GraphqlClientError } from 'graphql-request';
import { type AuthError, CredentialsSignin } from 'next-auth';

import { toast } from 'react-toastify';
import { ZodError } from 'zod';

export type ErrorDetail = {
  code: string;
  message: string;
};

export const enum ERROR_CODES {
  AUTH_USER_NOT_FOUND,
  AUTH_PASSWORD_WRONG,
  AUTH_USER_PASSWORD_NOT_SET,
  AUTH_UNKNOWN_ERROR,
  EMAIL_UNIQUE_CONSTRAINT,
  UNEXPECTED_ERROR,
  DATABASE_CONNECTION_FAILED,
}
export const ERROR_DESCRIPTION = {
  AUTH_USER_NOT_FOUND: 'Email Is Incorrect.',
  AUTH_PASSWORD_WRONG: 'Password Is Incorrect.',
  AUTH_USER_PASSWORD_NOT_SET: 'No Password Is Set, SignIn with Google.',
  AUTH_UNKNOWN_ERROR: 'Unexpected Error Occurred During Auth Process.',
  EMAIL_UNIQUE_CONSTRAINT: 'Email Already Exists.',
  UNEXPECTED_ERROR: 'Unexpected Error Occurred.',
  DATABASE_CONNECTION_FAILED: 'Connection To The Database Failed.',
};

class BaseError extends Error {
  code: string;
  constructor(code: string) {
    super();
    this.code = code;
  }
}
export class AuthSignInError extends CredentialsSignin {
  constructor(
    error: string | AuthError,
    options: { type: 'email' | 'password' }
  ) {
    super();
    const { type } = options;
    if (typeof error === 'string') {
      if (type === 'email') {
        this.code = ERROR_CODES.AUTH_USER_NOT_FOUND.toString();
      } else if (type === 'password') {
        this.code = ERROR_CODES.AUTH_PASSWORD_WRONG.toString();
      }
      this.message = error;
    } else {
      const { message } = error;
      this.code = ERROR_CODES.AUTH_USER_NOT_FOUND.toString();
      this.message = message;
    }
  }
}

export class ValidationError extends ZodError {
  constructor(error: ZodError) {
    super(error.issues);
  }
}

export class EmailUniqueConstraintError extends BaseError {
  constructor(message: string, code: number) {
    super(code.toString());
    this.message = message;
    this.code = code.toString();
  }
}

export class DatabaseConnectionFailedError extends BaseError {
  constructor(message: string, code: number) {
    super(code.toString());
    this.message = message;
    this.code = code.toString();
  }
}

export class PasswordNotSetError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.code = ERROR_CODES.AUTH_USER_PASSWORD_NOT_SET.toString();
  }
}

export class UserNotFoundError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.code = ERROR_CODES.AUTH_USER_NOT_FOUND.toString();
  }
}

export class UnexpectedError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.code = ERROR_CODES.UNEXPECTED_ERROR.toString();
  }
}

export const handleCatchError = (error: unknown) => {
  if (error instanceof GraphqlClientError) {
    const {
      response: { errors },
    } = error;
    if (errors && errors.length > 0) {
      const { message, extensions } = errors[0];
      if (extensions) {
        const { originalError } = extensions;
        const { message: originalErrorMessage } = originalError as Error;
        if (originalErrorMessage) {
          toast.error(originalErrorMessage);
        }
      } else {
        toast.error(message);
      }
    }
  }
  if (error instanceof UnexpectedError) {
    const { message } = error;
    toast.error(message);
  } else {
    toast.error(ERROR_DESCRIPTION.UNEXPECTED_ERROR);
  }
};

export const handleCatchErrorServer = (error: unknown) => {
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
  if (error as AuthError satisfies CallbackRouteError) {
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
};
