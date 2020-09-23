import { mockDBClient } from './server/utils/testUtils';

jest.mock('dist-database', () => ({
  client: mockDBClient()
}));
