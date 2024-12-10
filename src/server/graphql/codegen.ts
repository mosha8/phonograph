import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/server/graphql/schema/schema.graphql',
  generates: {
    'src/server/graphql/@types/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};
export default config;
