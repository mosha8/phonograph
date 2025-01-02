'use client';
import Button from '@components/Button';
import FormProvider from '@components/Form/components/provider';
import FormInputSelect from '@components/FormInputSelect';
import type { InputSelectItem } from '@components/FormInputSelect/@types';
import FormInputSelectAsync from '@components/FormInputSelectAsync';
import type { GroupInputSelect } from '@components/FormInputSelectAsync/@types';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SearchResult } from '@server/graphql/@types/resolvers-types';
import { type FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import type {
  audioSearchFormValueSchema,
  AudioSearchFormValueSchema,
  AudioSearchProps,
} from './@types';

const searchItemTypeOptions: InputSelectItem[] = [
  { label: 'Track', value: 'track' },
  { label: 'Album', value: 'album', isDisabled: true },
];
const TrackSearchForm: FC<AudioSearchProps> = ({ searchQuery, onSubmit }) => {
  // Form
  const formMethods = useForm<AudioSearchFormValueSchema>({
    resolver: zodResolver(audioSearchFormValueSchema),
    defaultValues: {
      searchItem: null,
      searchItemType: 'track',
    },
    mode: 'onBlur',
  });

  // Callbacks
  const createSelectOptions = useCallback(
    (searchResult: SearchResult): GroupInputSelect[] => {
      const { albums, artists, tracks } = searchResult;
      if (albums && albums.items) {
        const { items } = albums;
        const filterItems = items.map((album) => {
          return { label: album?.name ?? '', value: album?.name ?? '' };
        });
        return [{ label: 'albums', options: filterItems }];
      }
      if (artists && artists.items) {
        const { items } = artists;
        const filterItems = items.map((artist) => {
          return { label: artist?.name ?? '', value: artist?.name ?? '' };
        });
        return [{ label: 'artists', options: filterItems }];
      }
      if (tracks && tracks.items) {
        const { items } = tracks;
        const filterItems = items.map((track) => {
          if (!track || !track.name || !track.artists) {
            return { label: '', value: '' };
          }
          if (track.artists[0]) {
            return {
              label: track.name + ' - ' + track.artists[0].name,
              value: track.id,
            };
          }
          return {
            label: track.name,
            value: track.id,
          };
        });
        return [{ label: 'tracks', options: filterItems }];
      }
      return [{ label: '', options: [] }];
    },
    []
  );
  const loadOptions = useCallback(
    async (inputValue: string) => {
      const searchResult = await searchQuery(inputValue);
      const items = createSelectOptions(searchResult);
      return items;
    },
    [searchQuery, createSelectOptions]
  );
  const onSubmitHandler = useCallback(
    ({ searchItem }: AudioSearchFormValueSchema) => {
      if (searchItem) {
        onSubmit(searchItem);
      }
    },
    [onSubmit]
  );

  return (
    <div className="border rounded-lg p-8 max-w-fit mx-auto">
      <FormProvider
        onSubmit={onSubmitHandler}
        methods={formMethods}
        className="flex flex-col items-center gap-y-8"
      >
        <div className="space-y-2">
          <label htmlFor="form-input-search-item-type">
            Select Search Item
          </label>
          <FormInputSelect
            id="form-input-search-item-type"
            options={searchItemTypeOptions}
            name="searchItemType"
            placeholder="Select"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="form-input-search-item">Search for a song</label>
          <FormInputSelectAsync
            id="form-input-search-item"
            loadOptions={loadOptions}
            name="searchItem"
            placeholder="Search"
            defaultOptions={[]}
          />
        </div>
        <Button variant="contained" color="primary" size="medium" type="submit">
          Show
        </Button>
      </FormProvider>
    </div>
  );
};
export default TrackSearchForm;
