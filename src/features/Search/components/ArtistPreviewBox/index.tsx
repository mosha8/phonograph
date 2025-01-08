import Image from '@components/Image';
import { type FC } from 'react';
import type { ArtistPreviewBoxProps } from './@types';

const ArtistPreviewBox: FC<ArtistPreviewBoxProps> = ({ artist }) => {
  if (!artist) return;
  return (
    <div className="max-w-[580px] mx-auto border rounded-lg pb-8 bg-white">
      <div>
        {artist.images[0] && (
          <Image
            width={artist.images[0].width}
            height={artist.images[0].height}
            alt="artist-img"
            src={artist.images[0].url}
          />
        )}
      </div>
      <div className="space-y-2 mt-8">
        <div className="px-8 space-x-2">
          <label className="font-semibold">Title:</label>
          <span className="text-darkest text-lg"> {artist.name}</span>
        </div>
        <div className="px-8 space-x-2">
          <label className="font-semibold">Genres:</label>
          <span className="text-darkest text-lg">
            {artist.genres && artist.genres[0]}
          </span>
        </div>
        <div className="px-8 space-x-2">
          <label className="font-semibold">Popularity:</label>
          <span className="text-darkest text-lg">{artist.popularity}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistPreviewBox;
