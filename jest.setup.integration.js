import { DB_ENV } from '@utils/testUtils/mockData';

require('dotenv').config({
  path: '.env.test'
});

process.env.ENVIRONMENT_NAME = 'test';

beforeEach(() => {
  process.env = { ...process.env, ...DB_ENV, ENVIRONMENT_NAME: 'test' };
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});
