import SequelizeMock from 'sequelize-mock';
import pg from 'pg';
import { resetAndMockDB } from '@utils/testUtils';
import { DB_ENV } from '@utils/testUtils/mockData';

const mocks = {};
describe('getClient', () => {
  afterAll(() => {
    resetAndMockDB();
  });
  it('successfully get DB Client', async () => {
    jest.unmock('@database');
    mocks.sequelize = SequelizeMock;
    jest.doMock('sequelize', () => mocks.sequelize);
    jest.spyOn(mocks, 'sequelize');
    const { getClient } = require('../../database');
    const client = await getClient();
    await expect(client).toBeInstanceOf(mocks.sequelize);

    expect(mocks.sequelize.mock.calls.length).toEqual(1);
    expect(mocks.sequelize.mock.calls[0][0]).toEqual(DB_ENV.DB_URI);
    expect(mocks.sequelize.mock.calls[0][1]).toEqual({
      url: DB_ENV.DB_URI,
      host: DB_ENV.POSTGRES_HOST,
      dialectModule: pg,
      dialect: 'postgres',
      logging: false,
      pool: {
        min: 0,
        max: 10,
        idle: 10000
      },
      define: {
        underscored: true,
        timestamps: false
      },
      retry: {
        match: [
          'unknown timed out',
          mocks.sequelize.TimeoutError,
          'timed',
          'timeout',
          'TimeoutError',
          'Operation timeout',
          'refuse',
          'SQLITE_BUSY'
        ],
        max: 10
      }
    });
  });
  it('throw error on failure', async () => {
    jest.unmock('@database');
    mocks.sequelize = SequelizeMock;
    jest.doMock('sequelize', () => new Error());
    jest.spyOn(mocks, 'sequelize');

    const { getClient } = require('../../database');
    await expect(getClient).toThrow(expect.any(Error));
  });
});

describe('connect', () => {
  it('successfully connect to the database', async () => {
    jest.unmock('@database');
    mocks.sequelize = SequelizeMock;
    jest.doMock('sequelize', () => mocks.sequelize);

    const { getClient, connect } = require('../../database');
    const client = await getClient();
    jest.spyOn(client, 'authenticate');
    jest.spyOn(console, 'log');
    await connect();
    expect(client.authenticate.mock.calls.length).toBe(1);
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe('Connection has been established successfully.\n');
    expect(console.log.mock.calls[0][1]).toEqual({
      db_uri: process.env.DB_URI
    });
  });

  it('should throw an error if connection fails', async () => {
    jest.unmock('@database');
    mocks.sequelize = SequelizeMock;
    jest.doMock('sequelize', () => mocks.sequelize);

    const { getClient, connect } = require('../../database');
    const client = await getClient();
    const error = new Error('failed');
    client.authenticate = async () => {
      await expect(connect()).rejects.toEqual(error);
      jest.spyOn(client, 'authenticate');
      jest.spyOn(console, 'log');
      throw error;
    };
  });
});
