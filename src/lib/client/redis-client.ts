import { isProductionEnvironment } from '@lib/environment';
import { loadEnvConfig } from '@next/env';
import { createClient } from 'redis';

const prod = isProductionEnvironment();

const projectDir = process.cwd();
const { combinedEnv } = loadEnvConfig(projectDir, !prod);
const redisHost = combinedEnv['REDIS_HOST'];
const redisUsername = combinedEnv['REDIS_USERNAME'];
const redisPassword = combinedEnv['REDIS_PASSWORD'];
const redisPORT = combinedEnv['REDIS_PORT'];

const client = createClient({
  username: redisUsername,
  password: redisPassword,
  socket: {
    host: redisHost,
    port: Number(redisPORT),
  },
});

client.on('connect', () => {
  console.log('Connected to Redis!');
});

client.on('error', (err) => console.log('Redis Client Error', err));
export default client;
