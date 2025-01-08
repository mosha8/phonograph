import type {
  GroupInputSelect,
  InputAsyncSelectItem,
  InputSelectProps,
} from '@components/FormInputSelectAsync/@types';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import dynamic from 'next/dynamic';
import { type FC, useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
const Loading = () => (
  <div className="h-10 min-w-[500px] border rounded-lg bg-zinc-400 animate-pulse" />
);
const SelectAsync = dynamic(() => import('react-select/async'), {
  ssr: false,
  loading: () => <Loading />,
});
const Input: FC<InputSelectProps> = ({
  name,
  id,
  isSearchable = true,
  defaultOptions,
  loadOptions,
  onChange,
  placeholder,
  disabled,
  isClearable = true,
  cacheOptions = true,
  ref,
  error,
}) => {
  const [selectValue, setSelectValue] = useState<InputAsyncSelectItem | null>(
    null
  );
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 2000);
  const debouncedLoadOptions = useCallback(
    debounce(
      async (
        value: string,
        callback: (options: GroupInputSelect[]) => void
      ) => {
        if (value) {
          const newOptions = await loadOptions(value);
          callback(newOptions);
          return newOptions;
        }
        return [];
      },
      2000
    ),
    [loadOptions, debouncedInputValue]
  );

  return (
    <div className="h-8 min-w-[350px] md:w-[400px] lg:w-[500px]">
      <SelectAsync
        instanceId={id}
        name={name}
        value={selectValue}
        inputValue={inputValue}
        onInputChange={(newValue) => setInputValue(newValue)}
        ref={ref}
        isSearchable={isSearchable}
        isClearable={isClearable}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            outlineColor: 'none',
            borderColor: 'none',
            borderRadius: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }),
        }}
        classNames={{
          control: () => 'hover:!border-medium !rounded !border-light',
          singleValue: () => '!text-primary',
          option: ({ isSelected }) =>
            classNames(
              '!text-primary',
              'hover:!bg-light',
              isSelected && '!bg-dark !text-white hover:!text-primary'
            ),
        }}
        cacheOptions={cacheOptions}
        loadOptions={debouncedLoadOptions}
        defaultOptions={defaultOptions}
        isDisabled={disabled}
        placeholder={placeholder}
        onChange={(newValue) => {
          if (newValue) {
            setSelectValue(newValue as InputAsyncSelectItem);
            onChange(newValue);
          } else {
            setSelectValue(null);
            onChange(null);
          }
        }}
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
