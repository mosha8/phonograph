import type { FC } from 'react';
import type { FormInputSelectProps } from './@types';

import { Controller } from 'react-hook-form';
import Input from './components/Input';

const FormInputSelectAsync: FC<FormInputSelectProps> = ({
  name,
  ...restProps
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
        <Input
          {...restProps}
          name={name}
          ref={ref}
          onChange={onChange}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={value}
          error={error}
        />
      )}
    />
  );
};

export default FormInputSelectAsync;
