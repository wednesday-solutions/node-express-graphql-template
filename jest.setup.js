import { mockDBClient } from '@server/utils/testUtils';
import { DB_ENV } from '@utils/testUtils/mockData';

jest.doMock('@database', () => ({
  getClient: () => mockDBClient().client,
  client: mockDBClient().client
}));
jest.doMock('@database/models', () => ({
  ...mockDBClient().models
}));

beforeEach(() => {
  process.env = { ...process.env, ...DB_ENV };
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});
