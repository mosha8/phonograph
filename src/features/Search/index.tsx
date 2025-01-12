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
  const [trackItem, setTrack] = useState<Track | null>(null);
  const [albumItem, setAlbum] = useState<Album | null>(null);
  const [artistItem, setArtist] = useState<Artist | null>(null);

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
  const track = useCallback(async (id: string) => {
    const document = gql`
      query getTrackQuery {
        track(input: { id: "${id}" }) {
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
      const { track: track } = await graphQLClient.request<{
        track: Track;
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
  const album = useCallback(async (id: string) => {
    const document = gql`
      query albumQuery {
        album(input: { id: "${id}" }) {
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
      const { album: album } = await graphQLClient.request<{
        album: Album;
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
  const artist = useCallback(async (id: string) => {
    const document = gql`
      query artistQuery {
        artist(input: { id: "${id}" }) {
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
      const { artist: artist } = await graphQLClient.request<{
        artist: Artist;
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
        const trackItem = await track(value);
        setTrack(trackItem);
        setAlbum(null);
        setArtist(null);
      }
      if (category === 'album') {
        const albumItem = await album(value);
        setAlbum(albumItem);
        setTrack(null);
        setArtist(null);
      }
      if (category === 'artist') {
        const artistItem = await artist(value);
        setArtist(artistItem);
        setAlbum(null);
        setTrack(null);
      }
    },
    [album, artist, track]
  );

  return (
    <div className="space-y-8">
      <SearchForm searchQuery={searchQuery} onSubmit={onSubmit} />
      <TrackPreviewBox track={trackItem} />
      <AlbumPreviewBox album={albumItem} />
      <ArtistPreviewBox artist={artistItem} />
    </div>
  );
};

export default Search;
