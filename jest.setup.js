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

process.env.ENVIRONMENT_NAME = 'test';
beforeEach(() => {
  process.env = { ...process.env, ...DB_ENV, ENVIRONMENT_NAME: 'test' };
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});
