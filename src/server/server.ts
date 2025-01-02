import { encodeBase64 } from '@lib/auth';
import redisClient from '@lib/client/redis-client';
import { isDevelopmentEnvironment } from '@lib/environment';
import { spotifyAccessTokenRequest } from '@lib/spotifyClientCredentialsFlow';
import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';
const port = parseInt(process.env.PORT || '3000', 10);
const dev = isDevelopmentEnvironment();
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url as string, true);
      handle(req, res, parsedUrl).catch((reason) => {
        console.error('handle request failed by http server.', reason);
      });
    }).listen(port);
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const spotifyAccessToken = await redisClient.get('spotifyAccessToken');
      if (!spotifyAccessToken) {
        const data = await spotifyAccessTokenRequest();
        if (data) {
          const encodedAccessToken = encodeBase64(JSON.stringify(data));
          await redisClient.set('spotifyAccessToken', encodedAccessToken);
          console.log(
            'Obtained access token from spotify and stored it to redis.'
          );
        }
      }
      console.log(
        `> Server listening at http://localhost:${port} as ${
          dev ? 'development' : process.env.NODE_ENV
        }`
      );
    } catch (error) {
      console.error('error initializing server: ', error);
    }
  })
  .catch((reason) => {
    console.error('Failed to start up custom server.', reason);
  });
