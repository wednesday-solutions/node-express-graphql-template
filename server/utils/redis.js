import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_DOMAIN,
  port: process.env.REDIS_PORT
});

// Use this exported ioRedis object for storing and retrieving key
export const ioRedis = {
  redis,
  set: async (key, value) => await redis.set(key, value),
  get: async key => await redis.get(key),
  remove: async key => await redis.del(key)
};
