import { z } from 'zod';

const responseDataSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

const spotifyAccessTokenSchema = responseDataSchema.extend({
  created_at: z.number().default(Date.now()),
});
type SpotifyAccessToken = z.infer<typeof spotifyAccessTokenSchema>;
type ResponseData = z.infer<typeof responseDataSchema>;

export { spotifyAccessTokenSchema };
export type { SpotifyAccessToken, ResponseData as SpotifyTokenResponseData };
