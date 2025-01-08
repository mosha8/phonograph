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
  isMulti,
  error,
  ref,
}) => {
  const [selectValue, setSelectValue] = useState<InputSelectItem[]>([]);

  useEffect(() => {
    if (value) {
      const values = (value as string).split(',');
      const newValue = options.filter((item) => values.includes(item.value));
      setSelectValue(newValue);
    } else {
      setSelectValue([]);
    }
  }, [value, options]);
  const onChangeHandler = (newValue: unknown) => {
    if (newValue) {
      setSelectValue(newValue as InputSelectItem[]);
      const newValueStringCommaSeparated = (
        newValue as InputSelectItem[]
      ).reduce((prevValue, { value }) => {
        return (prevValue += value + ',');
      }, '');
      onChange(newValueStringCommaSeparated);
    } else {
      setSelectValue([]);
      onChange(undefined);
    }
  };
  return (
    <div className="h-8 min-w-[350px] md:w-[400px] lg:w-[500px]">
      <Select
        instanceId={id}
        name={name}
        value={selectValue}
        ref={ref}
        onChange={onChangeHandler}
        options={options}
        isMulti={isMulti}
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
      {error && (
        <span className="text-sm text-red-400">
          {typeof error === 'string' ? error : error.message}
        </span>
      )}
    </div>
  );
};

export default Input;
