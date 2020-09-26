import { mockDBClient } from 'server/utils/testUtils';

jest.mock('database', () => ({
  getClient: () => mockDBClient().client,
  client: mockDBClient().client
}));

jest.mock('database/models', () => ({
  ...mockDBClient().models
}));
