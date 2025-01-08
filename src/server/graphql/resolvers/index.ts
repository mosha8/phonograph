import {
  DatabaseConnectionFailedError,
  EmailUniqueConstraintError,
  ERROR_CODES,
  ERROR_DESCRIPTION,
  UnexpectedError,
} from '@lib/errors';

import { normalizeUser } from '@lib/index';
import userRepository from '@server/db/model/user/user.model';
import prisma from '@server/db/prisma/client';
import spotifyFacade from '@server/services/spotify-facade/spotify.facade.service';
import type { Resolvers } from '../@types/resolvers-types';

export const resolvers: Resolvers = {
  Query: {
    searchAudio: async (parent, { input: { text, type } }) => {
      const searchResult = await spotifyFacade.searchAudio({ text, type });
      return searchResult;
    },
    getTrackById: async (parent, { input: { id } }) => {
      const track = await spotifyFacade.getTrackById({ id });
      return track;
    },
    getAlbumById: async (parent, { input: { id } }) => {
      const album = await spotifyFacade.getAlbumById({ id });
      return album;
    },
    getArtistById: async (parent, { input: { id } }) => {
      const artist = await spotifyFacade.getArtistById({ id });
      return artist;
    },
  },
  Mutation: {
    signUp: async (parent, { input: { email, password } }) => {
      try {
        const user = await userRepository.createUser({ email, password });
        if (!user) {
          throw new UnexpectedError(ERROR_DESCRIPTION.UNEXPECTED_ERROR);
        }
        const account = await prisma.account.create({
          data: {
            provider: 'credentials',
            userId: user.id,
            type: 'credentials',
            providerAccountId: user.id,
          },
        });
        if (!account) {
          throw new Error('Account Not Created!');
        }
        const userNormalized = normalizeUser(user);
        return userNormalized;
      } catch (error) {
        if (error instanceof DatabaseConnectionFailedError) {
          const { message } = error;
          throw new DatabaseConnectionFailedError(
            message,
            ERROR_CODES.DATABASE_CONNECTION_FAILED
          );
        }
        if (error instanceof EmailUniqueConstraintError) {
          const { message } = error;
          throw new EmailUniqueConstraintError(
            message,
            ERROR_CODES.EMAIL_UNIQUE_CONSTRAINT
          );
        } else if (error instanceof UnexpectedError) {
          throw new UnexpectedError(error.message);
        }
        throw new Error('Something went wrong.');
      }
    },
  },
};
