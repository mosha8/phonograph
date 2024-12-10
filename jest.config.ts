import type { Config as JestConfig } from 'jest';
import nextJest from 'next/jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
/** @type {import('jest').Config} */

const createJestConfig = nextJest({
  dir: './',
});
const config: JestConfig = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(graphql|gql)$': 'graphql-tag/loader',
    '^src/(.*)$': '<rootDir>/src/$1',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/server/db/prisma/client/__mocks__/prisma-mock.ts',
    '<rootDir>/jest.setup.ts',
  ],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.tsx'],
};

export default createJestConfig(config);
