import SequelizeMock from 'sequelize-mock';
import { resetAndMockDB } from '@utils/testUtils';
import { DB_ENV } from '@utils/testUtils/mockData';
import * as pg from 'pg';

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
    expect(mocks.sequelize.mock.calls[0][0]).toEqual(DB_ENV.POSTGRES_DB);
    expect(mocks.sequelize.mock.calls[0][1]).toEqual(DB_ENV.POSTGRES_USER);
    expect(mocks.sequelize.mock.calls[0][2]).toEqual(DB_ENV.POSTGRES_PASSWORD);
    expect(mocks.sequelize.mock.calls[0][3]).toEqual({
      dialectModule: pg,
      dialect: 'postgres',
      host: DB_ENV.POSTGRES_HOST
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
      db: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST
    });
  });

  it('should throw an error if connection fails', async () => {
    jest.unmock('@database');
    mocks.sequelize = SequelizeMock;
    jest.doMock('sequelize', () => mocks.sequelize);

    const { getClient, connect } = require('../../database');
    const client = await getClient();
    const error = new Error('failed');
    client.authenticate = () => throw error;
    jest.spyOn(client, 'authenticate');
    jest.spyOn(console, 'log');
    await expect(connect()).rejects.toEqual(error);
  });
});
