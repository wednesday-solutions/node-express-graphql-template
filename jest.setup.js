import { mockDBClient } from '@utils/testUtils';
import { DB_ENV } from '@utils/testUtils/mockData';

jest.doMock('@database', () => ({
  getClient: () => mockDBClient().client,
  client: mockDBClient().client,
  connect: () => {}
}));

jest.doMock('@server', () => {
  const server = jest.requireActual('@server');
  return {
    ...server,
    db: mockDBClient().models
  };
});

jest.doMock('@database/models', () => ({
  ...mockDBClient().models,
  initialize: async () => mockDBClient().models,
  getModels: async () => mockDBClient().models
}));

process.env.ENVIRONMENT = 'test';
beforeEach(() => {
  process.env = { ...process.env, ...DB_ENV, ENVIRONMENT: 'test' };
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});
