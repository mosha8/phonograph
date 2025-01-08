'use client';
import type { InputAsyncSelectItem } from '@components/FormInputSelectAsync/@types';
import graphQLClient from '@lib/client/graphql-client';
import { handleCatchError } from '@lib/errors';
import type {
  Album,
  Artist,
  SearchResult,
  Track,
} from '@server/graphql/@types/resolvers-types';
import { gql } from 'graphql-request';
import { useCallback, useState } from 'react';
import AlbumPreviewBox from './components/AlbumPreviewBox';
import ArtistPreviewBox from './components/ArtistPreviewBox';
import SearchForm from './components/SearchForm';
import TrackPreviewBox from './components/TrackPreviewBox';
const Search = () => {
  // States
  const [track, setTrack] = useState<Track | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);

  // Callbacks
  const searchQuery = useCallback(async (text: string, type: string) => {
    const document = gql`
      query searchAudioQuery {
        searchAudio(input: { text: "${text}", type: "${type}" }) {
          albums {
            href
            total
            items {
              name
              id
              release_date
              total_tracks
              artists {
                id
                name
              }
              images {
                height
                width
                url
              }
            }
          }
          artists {
            items {
              followers {
                total
              }
              genres
              id
              name
              popularity
              images {
                height
                url
                width
              }
            }
          }
          tracks {
            total
            items {
              id
              name
              artists {
                  id
                  name
              }
              duration_ms
              explicit
              popularity
            }
          }
        }
      }
    `;
    try {
      const { searchAudio } = await graphQLClient.request<{
        searchAudio: SearchResult;
      }>({
        document,
      });
      if (!searchAudio) {
        return {};
      }
      return searchAudio;
    } catch (error) {
      handleCatchError(error);
      return {};
    }
  }, []);
  const getTrackById = useCallback(async (id: string) => {
    const document = gql`
      query getTrackQuery {
        getTrackById(input: { id: "${id}" }) {
          explicit
          id
          available_markets
          disc_number
          duration_ms
          href
          is_local
          is_playable
          name
          popularity
          preview_url
          track_number
          uri
          type
          album {
           images {
            height
            url
            width
            }
          }
        }
      }
    `;
    try {
      const { getTrackById: track } = await graphQLClient.request<{
        getTrackById: Track;
      }>({
        document,
      });
      if (!track) {
        return null;
      }
      return track;
    } catch (error) {
      handleCatchError(error);
      return null;
    }
  }, []);
  const getAlbumById = useCallback(async (id: string) => {
    const document = gql`
      query getAlbumByIdQuery {
        getAlbumById(input: { id: "${id}" }) {
          id
          name
          images {
            height
            url
            width
          }
          release_date
          total_tracks
          artists {
            id
            name
          }
        }
      }
    `;
    try {
      const { getAlbumById: album } = await graphQLClient.request<{
        getAlbumById: Album;
      }>({
        document,
      });
      if (!album) {
        return null;
      }
      return album;
    } catch (error) {
      handleCatchError(error);
      return null;
    }
  }, []);
  const getArtistById = useCallback(async (id: string) => {
    const document = gql`
      query getArtistByIdQuery {
        getArtistById(input: { id: "${id}" }) {
              genres
              id
              name
              popularity
              images {
                height
                url
                 width
            }
         }
      }
    `;
    try {
      const { getArtistById: artist } = await graphQLClient.request<{
        getArtistById: Artist;
      }>({
        document,
      });
      if (!artist) {
        return null;
      }
      return artist;
    } catch (error) {
      handleCatchError(error);
      return null;
    }
  }, []);
  const onSubmit = useCallback(
    async ({ value, category }: InputAsyncSelectItem) => {
      if (category === 'track') {
        const track = await getTrackById(value);
        setTrack(track);
        setAlbum(null);
        setArtist(null);
      }
      if (category === 'album') {
        const album = await getAlbumById(value);
        setAlbum(album);
        setTrack(null);
        setArtist(null);
      }
      if (category === 'artist') {
        const artist = await getArtistById(value);
        setArtist(artist);
        setAlbum(null);
        setTrack(null);
      }
    },
    [getTrackById, getAlbumById, getArtistById]
  );

  return (
    <div className="space-y-8">
      <SearchForm searchQuery={searchQuery} onSubmit={onSubmit} />
      <TrackPreviewBox track={track} />
      <AlbumPreviewBox album={album} />
      <ArtistPreviewBox artist={artist} />
    </div>
  );
};

export default Search;
