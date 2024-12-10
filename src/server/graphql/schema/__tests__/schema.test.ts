import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLSchema, printSchema } from 'graphql';

import path from 'path';
describe('GraphQL Schema Validation', () => {
  let schema: GraphQLSchema;
  beforeAll(() => {
    const graphQLSchemaPath = path.join(
      process.cwd(),
      'src/server/graphql/schema/schema.graphql'
    );
    schema = loadSchemaSync(graphQLSchemaPath, {
      loaders: [new GraphQLFileLoader()],
    });
  });
  test('if graphql schema exists.', () => {
    const schemaString = printSchema(schema);
    expect(schema).toBeDefined();
    expect(schemaString).toBeTruthy();
  });
});
