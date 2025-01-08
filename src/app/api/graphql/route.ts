import { graphQLSchema } from '@server/graphql';
import { createYoga } from 'graphql-yoga';
import type { NextRequest } from 'next/server';

const { handleRequest } = createYoga({
  schema: graphQLSchema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response: Response, Request: Request },
});

export async function GET(req: NextRequest) {
  return handleRequest(req, {});
}
export async function POST(req: NextRequest) {
  return handleRequest(req, {});
}
export async function OPTIONS(req: NextRequest) {
  return handleRequest(req, {});
}
