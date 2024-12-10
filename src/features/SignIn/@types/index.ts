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

export { formValuesSchema as signInFormValueSchema };
export type { FormValueSchema as SignInFormValueSchema };
