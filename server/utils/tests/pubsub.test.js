describe('Pubsub tests', () => {
  it('should create a new Pubsub', () => {
    const graphqlSubscription = require('graphql-redis-subscriptions');
    const spy = jest.spyOn(graphqlSubscription, 'RedisPubSub');
    require('@utils/pubsub');
    expect(spy).toBeCalledTimes(1);
  });
  it('should set the retry stratergy ', () => {
    const module = require('@utils/pubsub');
    const spy = jest.spyOn(module.options, 'retryStrategy');
    const res = spy(3);
    expect(res).toEqual(150);
  });
});
