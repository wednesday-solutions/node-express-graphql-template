import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { options } from '@utils/pubsub';
describe('Pubsub tests', () => {
  let pubsub;

  afterAll(() => pubsub.close());
  it('should a pubsub stream ', () => {
    const mockOptions = {
      host: 'localhost',
      port: '6378',
      connectTimeout: 10000,
      retryStrategy: times => Math.min(times * 50, 2000)
    };
    pubsub = new RedisPubSub({
      publisher: new Redis(mockOptions),
      subscriber: new Redis(mockOptions)
    });

    expect(pubsub.redisPublisher.options.host).toBe('localhost');
    expect(pubsub.redisPublisher.options.port).toBe(6378);
    expect(pubsub.redisSubscriber.options.host).toBe('localhost');
    expect(pubsub.redisSubscriber.options.port).toBe(6378);
  });
  it('should retry after the given time ', () => {
    const spy = jest.spyOn(options, 'retryStrategy');
    const res = spy(3);
    expect(res).toEqual(150);
  });
});
