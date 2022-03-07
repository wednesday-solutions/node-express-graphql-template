import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

describe('Pubsub tests', () => {
  let pubsub;
  afterEach(() => pubsub.close());
  it('should a pubsub stream ', () => {
    const options = {
      host: 'localhost',
      port: '6378',
      connectTimeout: 10000,
      retryStrategy: times => Math.min(times * 50, 2000)
    };
    pubsub = new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options)
    });
    expect(pubsub.redisPublisher.options.host).toBe('localhost');
    expect(pubsub.redisPublisher.options.port).toBe(6378);
    expect(pubsub.redisSubscriber.options.host).toBe('localhost');
    expect(pubsub.redisSubscriber.options.port).toBe(6378);
  });
});
