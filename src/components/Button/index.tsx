import classNames from 'classnames';
import type { FC } from 'react';
import type { ButtonProps } from './@types';

const Button: FC<ButtonProps> = ({
  variant,
  color,
  size,
  active = false,
  className,
  onClick,
  disabled,
  type,
  children,
}) => {
  const isVariantContained = variant === 'contained';
  const isVariantOutlined = variant === 'outlined';
  const isVariantText = variant === 'text';
  const isColorPrimary = color === 'primary';
  const isSizeSmall = size === 'small';
  const isSizeMedium = size === 'medium';
  const isButtonActive = active === true;
  return (
    <button
      className={classNames(
        'rounded-md max-w-fit',
        isSizeSmall && 'px-3 py-1.5',
        isSizeMedium && 'px-5 py-3.5',
        (isVariantContained || isVariantOutlined) &&
          'inline-flex items-center justify-center',
        isVariantContained && [
          'text-white text-sm leading-4',
          isColorPrimary && 'bg-primary',
          'hover:bg-opacity-90',
        ],
        isVariantOutlined && [
          'text-sm leading-4 border border-light text-primary',
          isColorPrimary && 'border-light',
          'hover:bg-light',
        ],
        isVariantText && [
          isColorPrimary && 'text-primary',
          isButtonActive && 'border-b-2 rounded-none',
        ],
        disabled && 'cursor-not-allowed opacity-70',
        className
      )}
      onClick={onClick}
      type={type}
      disabled={!!disabled}
    >
      {children}
    </button>
  );
};
export default Button;
