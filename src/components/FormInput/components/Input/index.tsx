import type { InputBaseProps } from '@components/FormInput/@types';
import classNames from 'classnames';
import type { FC } from 'react';

const Input: FC<InputBaseProps> = ({
  type = 'text',
  className,
  disabled,
  onChange,
  error,
  ref,
  ...restProps
}) => {
  return (
    <div className={classNames('flex flex-col gap-y-2', className)}>
      <input
        ref={ref}
        disabled={disabled}
        className={classNames(
          'inline-block max-w-96 px-3 py-2',
          'bg-transparent outline-none font-light border border-light text-primary rounded-lg',
          'hover:border-medium focus:border-black',
          error && 'border-red-500'
        )}
        type={type}
        onChange={({ target }) => {
          target.classList.remove('border-red-500');
          onChange(target.value);
        }}
        {...restProps}
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
