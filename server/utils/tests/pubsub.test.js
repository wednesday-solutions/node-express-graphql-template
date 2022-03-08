import { options } from '@utils/pubsub';

import * as module from '@utils/pubsub';

describe('Pubsub tests', () => {
  let pubsub;
  it('should ', () => {
    const spy = jest.spyOn(options, 'retryStrategy');
    const res = spy(3);
    expect(res).toEqual(150);
  });
  it('should ', () => {
    pubsub = module.createPubSub();
    expect(pubsub.redisPublisher.options.host).toBe('localhost');
    expect(pubsub.redisPublisher.options.port).toBe(6379);
    expect(pubsub.redisSubscriber.options.host).toBe('localhost');
    expect(pubsub.redisSubscriber.options.port).toBe(6379);
    pubsub.close();
  });
});
