'use client';
import type {
  InputSelectItem,
  InputSelectProps,
} from '@components/FormInputSelect/@types';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { type FC, useEffect, useState } from 'react';

const Loading = () => (
  <div className="h-10 min-w-[500px] border rounded-lg bg-zinc-400 animate-pulse" />
);
const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => <Loading />,
});

const Input: FC<InputSelectProps> = ({
  name,
  id,
  value,
  options,
  onChange,
  isSearchable,
  disabled,
  ref,
}) => {
  const [selectValue, setSelectValue] = useState<InputSelectItem | null>(null);

  useEffect(() => {
    if (value) {
      const newValue = options.find((item) => value === item.value);
      setSelectValue(newValue ?? null);
    } else {
      setSelectValue(null);
    }
  }, [value, options]);
  const onChangeHandler = (newValue: unknown) => {
    if (newValue) {
      setSelectValue(newValue as InputSelectItem);
      const { value } = newValue as InputSelectItem;
      onChange(value);
    } else {
      setSelectValue(null);
      onChange(undefined);
    }
  };
  return (
    <div className="h-8 min-w-[500px]">
      <Select
        instanceId={id}
        name={name}
        value={selectValue}
        ref={ref}
        onChange={onChangeHandler}
        options={options}
        isSearchable={isSearchable}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            outlineColor: 'none',
            borderColor: 'none',
            borderRadius: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            cursor: 'pointer',
          }),
        }}
        classNames={{
          control: () => 'hover:!border-medium !rounded !border-light',
          singleValue: () => '!text-primary',
          option: ({ isSelected, isDisabled }) =>
            classNames(
              isDisabled && '!cursor-not-allowed',
              !isDisabled && [
                '!text-primary',
                'hover:!bg-light',
                isSelected && '!bg-dark !text-white hover:!text-primary',
              ]
            ),
        }}
        isDisabled={disabled}
      />
    </div>
  );
};

export default Input;
