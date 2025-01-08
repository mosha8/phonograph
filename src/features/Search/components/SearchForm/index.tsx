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
import {
  audioSearchFormValueSchema,
  type AudioSearchFormValueSchema,
  type SearchProps,
} from './@types';

const searchItemTypeOptions: InputSelectItem[] = [
  { label: 'Track', value: 'track' },
  { label: 'Album', value: 'album' },
  { label: 'Artist', value: 'artist' },
];
const SearchForm: FC<SearchProps> = ({ searchQuery, onSubmit }) => {
  // Form
  const formMethods = useForm<AudioSearchFormValueSchema>({
    resolver: zodResolver(audioSearchFormValueSchema),
    defaultValues: {
      searchItem: {},
      searchItemType: 'track',
    },
    mode: 'onChange',
  });

  // Callbacks
  const createSelectOptions = useCallback(
    (searchResult: SearchResult): GroupInputSelect[] => {
      const { albums, artists, tracks } = searchResult;
      const searchItemType = formMethods.getValues('searchItemType');
      const resultItem: GroupInputSelect[] = [{ label: '', options: [] }];
      if (albums && albums.items && searchItemType.includes('album')) {
        const { items } = albums;
        const filterItems = items.slice(0, 10).map((album) => {
          return {
            label: album?.name ?? '',
            value: album?.id ?? '',
            category: 'album',
          };
        });
        resultItem.push({ label: 'albums', options: filterItems });
      }
      if (artists && artists.items && searchItemType.includes('artist')) {
        const { items } = artists;
        const filterItems = items.slice(0, 10).map((artist) => {
          return {
            label: artist?.name ?? '',
            value: artist?.id ?? '',
            category: 'artist',
          };
        });
        resultItem.push({ label: 'artists', options: filterItems });
      }
      if (tracks && tracks.items && searchItemType.includes('track')) {
        const { items } = tracks;
        const filterItems = items.slice(0, 10).map((track) => {
          if (!track || !track.name || !track.artists) {
            return { label: '', value: '', category: 'track' };
          }
          if (track.artists[0]) {
            return {
              label: track.name + ' - ' + track.artists[0].name,
              value: track.id,
              category: 'track',
            };
          }
          return {
            label: track.name,
            value: track.id,
            category: 'track',
          };
        });
        resultItem.push({ label: 'tracks', options: filterItems });
      }
      return resultItem;
    },
    [formMethods]
  );
  const loadOptions = useCallback(
    async (inputValue: string) => {
      const searchItemTypeValue = formMethods.getValues('searchItemType');
      const searchResult = await searchQuery(inputValue, searchItemTypeValue);
      const items = createSelectOptions(searchResult);
      return items;
    },
    [searchQuery, createSelectOptions, formMethods]
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
    <div className="border rounded-lg p-8 max-w-fit mx-auto bg-white">
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
            isMulti={true}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="form-input-search-item">Search For It</label>
          <FormInputSelectAsync
            id="form-input-search-item"
            loadOptions={loadOptions}
            name="searchItem"
            placeholder="Search"
            defaultOptions={[]}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          type="submit"
          disabled={!formMethods.formState.isValid}
        >
          Show
        </Button>
      </FormProvider>
    </div>
  );
};
export default SearchForm;
