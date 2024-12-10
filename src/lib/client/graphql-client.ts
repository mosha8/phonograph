import { GraphQLClient } from 'graphql-request';

const SERVER_URL = process.env['NEXT_PUBLIC_SERVER_URL'];
const graphQLClient = new GraphQLClient(`${SERVER_URL ?? ''}/api/graphql`);

export default graphQLClient;
