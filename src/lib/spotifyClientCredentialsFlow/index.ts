import config from '@configs/app.json';
import { decodeBase64, encodeBase64 } from '@lib/auth';
import { isProductionEnvironment } from '@lib/environment';
import { loadEnvConfig } from '@next/env';
import axios, { AxiosError } from 'axios';
import type { SpotifyAccessToken, SpotifyTokenResponseData } from './@types';

const prod = isProductionEnvironment();
const projectDir = process.cwd();

const { combinedEnv } = loadEnvConfig(projectDir, !prod);

const spotifyClientId = combinedEnv['SPOTIFY_CLIENT_ID'];
const spotifyClientSecret = combinedEnv['SPOTIFY_CLIENT_SECRET'];
const spotifyClientIdSecretBase64 = encodeBase64(
  spotifyClientId + ':' + spotifyClientSecret
);

const { APIOptionsConfig } = config;
const spotifyAPIConfig = APIOptionsConfig.find(
  ({ server }) => server === 'spotify_auth'
);

export const spotifyAccessTokenRequest =
  async (): Promise<SpotifyAccessToken | null> => {
    try {
      if (spotifyAPIConfig) {
        const { data } = await axios.post<SpotifyTokenResponseData>(
          spotifyAPIConfig.url + '/token',
          {
            grant_type: 'client_credentials',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${spotifyClientIdSecretBase64}`,
            },
          }
        );
        if (data) {
          return { ...data, created_at: Date.now() };
        }
      }
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('axios error: ', { error, server: 'spotify_auth' });
      }
      return null;
    }
  };

export const isSpotifyAccessTokenValid = (token: string) => {
  const decodeAccessToken = decodeBase64(token);
  const tokenPayload = JSON.parse(decodeAccessToken) as SpotifyAccessToken;
  const { expires_in, created_at } = tokenPayload;
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const createdAtTimeInSeconds = Math.floor(created_at / 1000);
  const expirationTimeInSeconds = createdAtTimeInSeconds + expires_in;
  if (expirationTimeInSeconds < currentTimeInSeconds) {
    return false;
  }
  return true;
};
