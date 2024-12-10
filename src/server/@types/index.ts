import type { ErrorDetail } from '@lib/errors';

export interface Response<T> {
  success: boolean;
  data?: T;
  errors?: ErrorDetail[];
}
