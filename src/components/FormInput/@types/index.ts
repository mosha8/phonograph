import type { ErrorDetail } from '@lib/errors';
import type { ReactNode } from 'react';
import type { ControllerRenderProps, FieldError } from 'react-hook-form';

export interface FormInputProps {
  name: string;
  type?: 'text' | 'number' | 'password';
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: 'on' | 'off' | 'new-password';
  className?: string;
  icon?: ReactNode;
}
export interface InputBaseProps
  extends FormInputProps,
    Partial<Omit<ControllerRenderProps, 'name' | 'onChange'>>,
    Pick<ControllerRenderProps, 'name' | 'onChange'> {
  error?: string | FieldError | ErrorDetail;
}
