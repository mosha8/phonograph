/// <reference types="optimized-images-loader" />

import { DefaultSession } from 'next-auth';

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.graphql' {
  const content: string;
  export default content;
}
declare module 'next-auth' {
  interface Session extends DefaultSession {
    error?: 'RefreshTokenError';
  }
}
