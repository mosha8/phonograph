import { graphQLSchema } from '@server/graphql';
import { createYoga } from 'graphql-yoga';

const { handleRequest } = createYoga({
  schema: graphQLSchema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as OPTIONS,
  handleRequest as POST,
};
