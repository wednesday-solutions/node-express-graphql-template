/* eslint-disable no-console */
import SequelizeMock from 'sequelize-mock';
import { resetAndMockDB } from '@utils/testUtils';
import { DB_ENV } from '@utils/testUtils/mockData';
import * as pg from 'pg';

const mocks = {};

jest.unmock('@database');
jest.mock('sequelize');

afterAll(() => {
  resetAndMockDB();
  jest.unmock('sequelize');
});
describe('getClient', () => {
  const { getClient } = require('@database/index');
  it('successfully get DB Client', async () => {
    jest.doMock('sequelize', () => ({
      __esModule: true,
      default: function() {
        return true;
      }
    }));
    const sequelize = require('sequelize');
    const sequelizeSpy = jest.spyOn(sequelize, 'default');
    getClient();
    expect(sequelizeSpy).toBeCalledWith(DB_ENV.POSTGRES_DB, DB_ENV.POSTGRES_USER, DB_ENV.POSTGRES_PASSWORD, {
      dialectModule: pg,
      dialect: 'postgres',
      host: DB_ENV.POSTGRES_HOST
    });
  });
  it('throw error on failure', async () => {
    mocks.sequelize = SequelizeMock;
    jest.doMock('sequelize', () => new Error('THROW'));
    jest.spyOn(mocks, 'sequelize');

    const { getClient } = require('../../database');
    await expect(getClient).toThrow(expect.any(Error));
  });
});

describe('connect', () => {
  beforeAll(() => {
    console.log('before all');
    jest.unmock('sequelize');
  });
  afterAll(() => {
    jest.unmock('sequelize');
  });
  const { getClient, connect } = require('@database/index');
  it('successfully connect to the database', async () => {
    const client = getClient();
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
    const { getClient, connect } = require('../../database');
    const client = await getClient();
    const error = new Error('failed');
    client.authenticate = () => {
      throw error;
    };
    jest.spyOn(client, 'authenticate');
    jest.spyOn(console, 'log');
    await expect(connect()).rejects.toEqual(error);
  });
});
