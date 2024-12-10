import type { MutationKeyGenerator } from '@lib/client/@types';
import { z } from 'zod';

const formValuesSchema = z
  .object({
    email: z
      .string({ required_error: 'email required' })
      .email({ message: 'Invalid Email' }),
    password: z
      .string({ required_error: 'password required' })
      .min(6, 'Password must be at least 6 characters'),
  })
  .required();
type FormValueSchema = z.infer<typeof formValuesSchema>;

const keyGenerator: MutationKeyGenerator = () => ['signup'];

export {
  formValuesSchema as signUpFormValueSchema,
  keyGenerator as signUpKeyGenerator,
};
export type { FormValueSchema as SignUpFormValueSchema };
