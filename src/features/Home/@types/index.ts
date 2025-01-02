import { encodeBase64 } from '@lib/auth';
import client from '@lib/client';
import type { MutationKeyGenerator } from '@lib/client/@types';
import { z } from 'zod';

const spotifyClientId = process.env['NEXT_PUBLIC_SPOTIFY_CLIENT_ID'];
const spotifyClientSecret = process.env['NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET'];

const spotifyClientIdSecretBase64 = encodeBase64(
  spotifyClientId + ':' + spotifyClientSecret
);

const requestDataSchema = z.object({
  grant_type: z.string().default('client_credentials'),
});
const responseDataSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});
type RequestData = z.infer<typeof requestDataSchema>;
type ResponseData = z.infer<typeof responseDataSchema>;

const keyGenerator: MutationKeyGenerator = () => ['token'];

client.registerEndpoint(keyGenerator, {
  url: '/token',
  server: 'spotify_auth',
  type: 'mutation',
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${spotifyClientIdSecretBase64}`,
  },
  requestDataSchema: requestDataSchema,
});
export {
  keyGenerator as spotifyClientCredentialsFlowKeyGenerator,
  requestDataSchema as spotifyClientCredentialsFlowRequestDataSchema,
  responseDataSchema as spotifyClientCredentialsFlowResponseDataSchema,
};
export type {
  RequestData as SpotifyClientCredentialsFlowRequestData,
  ResponseData as SpotifyClientCredentialsFlowResponseData,
};
