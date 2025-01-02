import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import type { FormInputSelectProps } from './@types';
import Input from './components/Input';
const FormInputSelect: FC<FormInputSelectProps> = ({ name, ...restProps }) => {
  return (
    <Controller
      name={name}
      render={({ field: { ref, onChange, value } }) => (
        <Input
          {...restProps}
          name={name}
          ref={ref}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
};

export default FormInputSelect;
