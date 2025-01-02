'use client';
import type { InputSelectItem } from '@components/FormInputSelect/@types';
import graphQLClient from '@lib/client/graphql-client';
import { handleCatchError } from '@lib/errors';
import type {
  SearchResult,
  Track,
} from '@server/graphql/@types/resolvers-types';
import { gql } from 'graphql-request';
import { useCallback, useState } from 'react';
import TrackSearchForm from './components/TrackSearchForm';
import TrackSearchPreviewBox from './components/TrackSearchPreviewBox';
const TrackExplorer = () => {
  // States
  const [track, setTrack] = useState<Track | null>(null);

  // Callbacks
  const searchQuery = useCallback(async (text: string) => {
    const document = gql`
      query searchAudioQuery {
        searchAudio(input: { text: "${text}", type: "${'track'}" }) {
          tracks {
            href
            total
            items {
              album {
                images {
                  url
                  height
                  width
                }
              }
              name
              id
              duration_ms
              explicit
              is_playable
              href
              popularity
              preview_url
              track_number
              type
              uri
              artists {
                name
              }
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
  const getTrack = useCallback(async (id: string) => {
    const document = gql`
      query getTrackQuery {
        getTrack(input: { id: "${id}" }) {
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
      const { getTrack: track } = await graphQLClient.request<{
        getTrack: Track;
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
  const onSubmit = useCallback(
    async ({ value }: InputSelectItem) => {
      const track = await getTrack(value);
      setTrack(track);
    },
    [getTrack]
  );

  return (
    <div className="space-y-8">
      <TrackSearchForm searchQuery={searchQuery} onSubmit={onSubmit} />
      <TrackSearchPreviewBox track={track} />
    </div>
  );
};

export default TrackExplorer;
