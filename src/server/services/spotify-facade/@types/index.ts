import { z } from 'zod';

const itemSchema = z.enum([
  'album',
  'artist',
  'playlist',
  'track',
  'show',
  'episode',
  'audiobook',
]);

export type TItem = z.infer<typeof itemSchema>;
const restrictionReasonSchema = z.enum(['market', 'product', 'explicit']);

const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: itemSchema,
  uri: z.string(),
  external_urls: z.object({
    spotify: z.string(),
  }),
});

const albumSchema = z.object({
  id: z.string(),
  name: z.string(),
  album_type: z.string(),
  total_tracks: z.number(),
  available_markets: z.string().array(),
  href: z.string(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  images: z.object({
    url: z.string(),
    height: z.number().nullable(),
    width: z.number().nullable(),
  }),
  release_date: z.string(),
  release_date_precision: z.string(),
  restrictions: z.object({
    reason: z.string(),
  }),
  type: itemSchema,
  uri: z.string(),
  artists: z.array(artistSchema),
});

const trackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  popularity: z.number(),
  is_playable: z.boolean(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: itemSchema,
  uri: z.string(),
  is_local: z.boolean(),
  album: albumSchema,
  artists: z.array(artistSchema),
  available_markets: z.string().array(),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  href: z.string(),
});

const tracksSchema = z.object({
  href: z.string(),
  offset: z.number(),
  limit: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(trackItemSchema),
});
const playlistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  name: z.string().optional(),
  images: z.object({
    url: z.string(),
    height: z.number().nullable(),
    width: z.number().nullable(),
  }),
  owner: z
    .object({
      external_urls: z
        .object({
          spotify: z.string(),
        })
        .optional(),
      followers: z
        .object({
          href: z.string().nullable(),
          total: z.number(),
        })
        .optional(),
      href: z.string(),
      id: z.string(),
      type: itemSchema,
      uri: z.string(),
    })
    .optional(),
  public: z.boolean().optional(),
  snapshot_id: z.string().optional(),
  tracks: tracksSchema.optional(),
  type: itemSchema,
  uri: z.string().optional(),
});

const artistsSchema = z.object({
  href: z.string(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(artistSchema),
});

const albumsSchema = z.object({
  href: z.string(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(albumSchema),
});

const playlistsSchema = z.object({
  href: z.string(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(playlistSchema),
});

const showSchema = z.object({
  id: z.string(),
  name: z.string(),
  href: z.string(),
  available_markets: z.string().array(),
  copyrights: z.object({
    text: z.string().optional(),
    type: z.string().optional(),
  }),
  description: z.string(),
  html_description: z.string(),
  explicit: z.boolean(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  images: z.object({
    url: z.string().url(),
    height: z.number().nullable(),
    width: z.number().nullable(),
  }),
  is_externally_hosted: z.boolean(),
  languages: z.string().array(),
  media_type: z.string(),
  publisher: z.string(),
  type: itemSchema,
  uri: z.string(),
  total_episodes: z.number(),
});
const showsSchema = z.object({
  href: z.string(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(showSchema),
});
const episodeSchema = z.object({
  items: z
    .object({
      audio_preview_url: z.string().nullable(),
      description: z.string(),
      html_description: z.string(),
      duration_ms: z.number(),
      explicit: z.boolean(),
      external_urls: z.object({
        spotify: z.string(),
      }),
      href: z.string(),
      id: z.string(),
      images: z.object({
        url: z.string().url(),
        height: z.number().nullable(),
        width: z.number().nullable(),
      }),
      is_externally_hosted: z.boolean(),
      is_playable: z.boolean(),
      language: z.string().optional(),
      languages: z.string().array(),
      name: z.string(),
      release_date: z.string(),
      release_date_precision: z.string(),
      resume_point: z.object({
        fully_played: z.boolean(),
        resume_position_ms: z.number(),
      }),
      type: itemSchema,
      uri: z.string(),
      restrictions: z.object({
        reason: restrictionReasonSchema,
      }),
    })
    .array(),
});
const episodesSchema = z.object({
  href: z.string(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(episodeSchema),
});

const audiobookSchema = z.object({
  authors: z.object({
    name: z.string(),
  }),
  available_markets: z.string().array(),
  copyrights: z.object({
    text: z.string().optional(),
    type: z.string().optional(),
  }),
  description: z.string(),
  html_description: z.string(),
  edition: z.string().optional(),
  explicit: z.boolean(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  images: z.object({
    url: z.string().url(),
    height: z.number().nullable(),
    width: z.number().nullable(),
  }),
  languages: z.string().array(),
  media_type: z.string(),
  name: z.string(),
  narrators: z.object({
    name: z.string(),
  }),
  publisher: z.string(),
  type: itemSchema,
  uri: z.string().url(),
  total_chapters: z.number(),
});
const audiobooksSchema = z.object({
  href: z.string(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(audiobookSchema),
});
const requestDataSchema = z.object({});
const responseDataSchema = z.object({
  tracks: tracksSchema.optional(),
  artists: artistsSchema.optional(),
  albums: albumsSchema.optional(),
  playlists: playlistsSchema.optional(),
  shows: showsSchema.optional(),
  episodes: episodesSchema.optional(),
  audiobooks: audiobooksSchema.optional(),
});
type RequestData = z.infer<typeof requestDataSchema>;
type ResponseData = z.infer<typeof responseDataSchema>;

export {
  requestDataSchema as audioSearchRequestData,
  responseDataSchema as audioSearchResponseData,
  itemSchema as searchItemSchema,
};
export type {
  RequestData as AudioSearchRequestData,
  ResponseData as AudioSearchResponseData,
};
