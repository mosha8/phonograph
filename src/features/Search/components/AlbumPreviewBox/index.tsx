import Image from '@components/Image';
import { type FC } from 'react';
import type { AlbumPreviewBoxProps } from './@types';

const AlbumPreviewBox: FC<AlbumPreviewBoxProps> = ({ album }) => {
  if (!album) return;
  return (
    <div className="max-w-[580px] mx-auto border rounded-lg pb-8 bg-white">
      <div>
        {album.images[0] && (
          <Image
            width={album.images[0].width}
            height={album.images[0].height}
            alt="album-img"
            src={album.images[0].url}
          />
        )}
      </div>
      <div className="space-y-2 mt-8">
        <div className="px-8 space-x-2">
          <label className="font-semibold">Title:</label>
          <span className="text-darkest text-lg"> {album.name}</span>
        </div>
        <div className="px-8 space-x-2">
          <label className="font-semibold">Artist:</label>
          <span className="text-darkest text-lg">
            {album.artists && album.artists[0]?.name}
          </span>
        </div>
        <div className="px-8 space-x-2">
          <label className="font-semibold">Total Tracks:</label>
          <span className="text-darkest text-lg">{album.total_tracks}</span>
        </div>
        <div className="px-8 space-x-2">
          <label className="font-semibold">Release Date:</label>
          <span className="text-darkest text-lg">{album.release_date}</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumPreviewBox;
