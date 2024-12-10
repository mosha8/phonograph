import { resolvers } from '@server/graphql/resolvers';
import { readFileSync } from 'fs';
import { createSchema } from 'graphql-yoga';
import path from 'path';

const graphQLSchemaPath = path.join(
  process.cwd(),
  'src/server/graphql/schema/schema.graphql'
);
const typeDefs = readFileSync(graphQLSchemaPath).toString();

export const graphQLSchema = createSchema({
  typeDefs,
  resolvers,
});
