import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const options = {
  host: process.env.REDIS_DOMAIN,
  port: process.env.REDIS_PORT,
  connectTimeout: 10000,
  retryStrategy: times => Math.min(times * 50, 2000)
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});
