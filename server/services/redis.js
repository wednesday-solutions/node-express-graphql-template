import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_DOMAIN);
