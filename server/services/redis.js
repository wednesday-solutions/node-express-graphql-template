import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);

export const setRedisData = async (key, value) => {
  const data = await redis.set(key, value);
  return data;
};

export const getRedisData = async key => {
  const data = await redis.get(key);
  return data;
};

// Add a function to close the Redis connection
export const closeRedisConnection = async () => {
  await redis.quit();
};
