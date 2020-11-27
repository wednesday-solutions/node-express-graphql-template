import { mockDBClient } from '@server/utils/testUtils';

jest.doMock('@database', () => ({
  getClient: () => mockDBClient().client,
  client: mockDBClient().client
}));
jest.doMock('@database/models', () => ({
  ...mockDBClient().models
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});
