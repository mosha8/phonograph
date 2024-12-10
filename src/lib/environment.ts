export const isDevelopmentEnvironment = () =>
  process.env['NODE_ENV'] === 'development';
export const isProductionEnvironment = () =>
  process.env['NODE_ENV'] === 'production';
export const isTestEnvironment = () => process.env['NODE_ENV'] === 'test';
export const isServerSideEnvironment = () => typeof window === 'undefined';
