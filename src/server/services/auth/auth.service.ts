import { ERROR_CODES, ERROR_DESCRIPTION } from '@lib/errors';
import { hashPassword, normalizeUser } from '@lib/index';
import userRepository from '@server//db/model/user/user.model';
import type { Response } from '@server/@types';
import type { SignInInput, User } from '@server/graphql/@types/resolvers-types';

class AuthService {
  private readonly userRepository;
  constructor() {
    this.userRepository = userRepository;
  }
  async authorize({
    email,
    password: passwordInput,
  }: SignInInput): Promise<Response<User | null>> {
    const dbUser = await this.userRepository.getUserByEmail(email);
    if (!dbUser) {
      return {
        success: false,
        data: null,
        errors: [
          {
            code: ERROR_CODES.EMAIL_UNIQUE_CONSTRAINT.toString(),
            message: ERROR_DESCRIPTION.EMAIL_UNIQUE_CONSTRAINT,
          },
        ],
      };
    }
    const { password } = dbUser;
    if (!password) {
      return {
        success: false,
        data: null,
        errors: [
          {
            code: ERROR_CODES.AUTH_USER_PASSWORD_NOT_SET.toString(),
            message: ERROR_DESCRIPTION.AUTH_USER_PASSWORD_NOT_SET,
          },
        ],
      };
    }

    const hashedPassword = await hashPassword(password);
    if (hashedPassword === passwordInput) {
      const user = normalizeUser(dbUser);
      return { success: true, data: user };
    } else {
      return {
        success: false,
        data: null,
        errors: [
          {
            code: ERROR_CODES.AUTH_PASSWORD_WRONG.toString(),
            message: ERROR_DESCRIPTION.AUTH_PASSWORD_WRONG.toString(),
          },
        ],
      };
    }
  }
}

const authService = new AuthService();
export default authService;
