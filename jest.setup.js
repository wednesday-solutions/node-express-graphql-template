import { mockDBClient } from '@server/utils/testUtils';
import { DB_ENV } from '@utils/testUtils/mockData';

jest.doMock('@database', () => ({
  getClient: () => mockDBClient().client,
  client: mockDBClient().client,
  connect: () => {}
}));
jest.doMock('@database/models', () => ({
  ...mockDBClient().models
}));

jest.doMock('graphql-redis-subscriptions', () => ({
  RedisPubSub: () => ({ publish: () => ({}), asyncIterator: () => ({}) })
}));
jest.doMock('ioredis', () =>
  jest.fn().mockImplementation(() => ({
    publish: () => ({}),
    set: msg =>
      JSON.stringify({
        msg
      }),
    get: msg =>
      JSON.stringify({
        msg
      })
  }))
);

process.env.ENVIRONMENT_NAME = 'test';
beforeEach(() => {
  process.env = { ...process.env, ...DB_ENV, ENVIRONMENT_NAME: 'test' };
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});
