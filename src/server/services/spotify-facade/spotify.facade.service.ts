import { decodeBase64, encodeBase64 } from '@lib/auth';
import restClient from '@lib/client';
import redisClient from '@lib/client/redis-client';
import {
  isSpotifyAccessTokenValid,
  spotifyAccessTokenRequest,
} from '@lib/spotifyClientCredentialsFlow';
import type { SpotifyAccessToken } from '@lib/spotifyClientCredentialsFlow/@types';
import type {
  Album,
  AlbumInput,
  Artist,
  ArtistInput,
  SearchAudioInput,
  SearchResult,
  Track,
  TrackInput,
} from '@server/graphql/@types/resolvers-types';
import { AxiosError } from 'axios';

class SpotifyFacadeService {
  constructor() {
    if (!redisClient.isOpen) {
      redisClient.connect().catch((reason) => {
        console.error('Failed to connect to redis.', reason);
      });
    }
  }
  async searchAudio({
    text,
    type,
  }: SearchAudioInput): Promise<SearchResult | null> {
    try {
      let spotifyAccessToken = await redisClient.get('spotifyAccessToken');
      if (spotifyAccessToken) {
        const valid = isSpotifyAccessTokenValid(spotifyAccessToken);
        if (!valid) {
          const token = await spotifyAccessTokenRequest();
          if (token) {
            const serializedToken = JSON.stringify(token);
            const encodedToken = encodeBase64(serializedToken);
            spotifyAccessToken = encodedToken;
            await redisClient.set('spotifyAccessToken', encodedToken);
          }
        }
        const decodeAccessToken = decodeBase64(spotifyAccessToken);
        const { access_token } = JSON.parse(
          decodeAccessToken
        ) as SpotifyAccessToken;
        const axiosInstance = restClient.getAxiosInstance('spotify');
        const { data } = await axiosInstance.get<SearchResult | null>(
          `/search?q=${text}&type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error('Something went wrong during search process.');
    }
  }
  async track({ id }: TrackInput): Promise<Track | null> {
    try {
      let spotifyAccessToken = await redisClient.get('spotifyAccessToken');
      if (spotifyAccessToken) {
        const valid = isSpotifyAccessTokenValid(spotifyAccessToken);
        if (!valid) {
          const token = await spotifyAccessTokenRequest();
          if (token) {
            const serializedToken = JSON.stringify(token);
            const encodedToken = encodeBase64(serializedToken);
            spotifyAccessToken = encodedToken;
            await redisClient.set('spotifyAccessToken', encodedToken);
          }
        }
        const decodeAccessToken = decodeBase64(spotifyAccessToken);
        const { access_token } = JSON.parse(
          decodeAccessToken
        ) as SpotifyAccessToken;
        const axiosInstance = restClient.getAxiosInstance('spotify');
        const { data } = await axiosInstance.get<Track | null>(
          `/tracks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error('Something went wrong during getting track.');
    }
  }
  async album({ id }: AlbumInput): Promise<Album | null> {
    try {
      let spotifyAccessToken = await redisClient.get('spotifyAccessToken');
      if (spotifyAccessToken) {
        const valid = isSpotifyAccessTokenValid(spotifyAccessToken);
        if (!valid) {
          const token = await spotifyAccessTokenRequest();
          if (token) {
            const serializedToken = JSON.stringify(token);
            const encodedToken = encodeBase64(serializedToken);
            spotifyAccessToken = encodedToken;
            await redisClient.set('spotifyAccessToken', encodedToken);
          }
        }
        const decodeAccessToken = decodeBase64(spotifyAccessToken);
        const { access_token } = JSON.parse(
          decodeAccessToken
        ) as SpotifyAccessToken;
        const axiosInstance = restClient.getAxiosInstance('spotify');
        const { data } = await axiosInstance.get<Album | null>(
          `/albums/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error('Something went wrong during getting track.');
    }
  }
  async artist({ id }: ArtistInput): Promise<Artist | null> {
    try {
      let spotifyAccessToken = await redisClient.get('spotifyAccessToken');
      if (spotifyAccessToken) {
        const valid = isSpotifyAccessTokenValid(spotifyAccessToken);
        if (!valid) {
          const token = await spotifyAccessTokenRequest();
          if (token) {
            const serializedToken = JSON.stringify(token);
            const encodedToken = encodeBase64(serializedToken);
            spotifyAccessToken = encodedToken;
            await redisClient.set('spotifyAccessToken', encodedToken);
          }
        }
        const decodeAccessToken = decodeBase64(spotifyAccessToken);
        const { access_token } = JSON.parse(
          decodeAccessToken
        ) as SpotifyAccessToken;
        const axiosInstance = restClient.getAxiosInstance('spotify');
        const { data } = await axiosInstance.get<Artist | null>(
          `/artists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error('Something went wrong during getting track.');
    }
  }
}

const spotifyFacade = new SpotifyFacadeService();
export default spotifyFacade;
