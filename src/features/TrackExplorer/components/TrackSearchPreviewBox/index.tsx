import Image from '@components/Image';
import { type FC, useMemo } from 'react';
import type { TrackSearchPreviewBoxProps } from './@types';

const TrackSearchPreviewBox: FC<TrackSearchPreviewBoxProps> = ({ track }) => {
  // Memos
  const duration = useMemo(() => {
    if (track && track.duration_ms) {
      const totalSeconds = Math.floor(track.duration_ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    return '';
  }, [track]);

  if (!track) return;
  return (
    <div className="max-w-[580px] mx-auto border rounded-lg pb-8">
      <div className="flex flex-col gap-y-8">
        <div>
          {track && track.album && track.album.images[0] && (
            <Image
              width={track.album.images[0].width}
              height={track.album.images[0].height}
              alt="song-img"
              src={track.album.images[0].url}
            />
          )}
        </div>
        <div className="space-y-2">
          <div className="px-8 space-x-2">
            <label className="font-semibold">Title:</label>
            <span className="text-darkest text-lg"> {track.name}</span>
          </div>
          <div className="px-8 space-x-2">
            <label className="font-semibold">Popularity:</label>
            <span className="text-darkest text-lg">{track.popularity}</span>
          </div>
          <div className="px-8 space-x-2">
            <label className="font-semibold">duration:</label>
            <span className="text-darkest text-lg">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackSearchPreviewBox;
