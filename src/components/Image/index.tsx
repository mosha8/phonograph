import classNames from 'classnames';
import NextImage from 'next/image';
import type { FC } from 'react';
import type { ImageProps } from './@types';
const Image: FC<ImageProps> = ({ src, alt, width, height, className }) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={classNames('rounded-t-lg', className)}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcuHDVfwAGxALtfbZXhQAAAABJRU5ErkJggg=="
    />
  );
};
export default Image;
