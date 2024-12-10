import { type AuthError, CredentialsSignin } from 'next-auth';
import { ZodError } from 'zod';

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

export type ErrorDetail = {
  code: string;
  message: string;
};
