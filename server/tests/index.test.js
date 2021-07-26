import { getResponse } from '@utils/testUtils';
import { mockDBClient } from '@utils/testUtils/index';
import request from 'supertest';

const query = `
    query {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
  `;

describe('init', () => {
  const mocks = {};
  it('should successfully configure environment variables and connect to the database', async () => {
    mocks.dotenv = {
      config: jest.fn
    };
    jest.doMock('dotenv', () => mocks.dotenv);
    jest.spyOn(mocks.dotenv, 'config');
    const { init } = require('../index');

    await init();

    // check if the environments are being configured correctly
    expect(mocks.dotenv.config.mock.calls.length).toBe(2);
  });

  it('should start the server and listen for /grapqhl', async () => {
    const { init } = require('../index');
    mocks.app = await init();
    jest.spyOn(mocks.app, 'use');
    await init();
    // check if the server has been started
    expect(mocks.app.use.mock.calls.length).toBe(9);
    expect(mocks.app.use.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(mocks.app.use.mock.calls[1][0]).toEqual('/graphql');
    expect(mocks.app.use.mock.calls[2][0]).toEqual('/');
  });

  it('should have a health check api(/) that responds with 200', async () => {
    const { init } = require('../index');
    const app = await init();
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('should invoke @database.connect ', async () => {
    mocks.db = { getClient: jest.fn(), connect: jest.fn() };
    jest.spyOn(mocks.db, 'connect');
    jest.doMock('@database', () => mocks.db);

    const { init } = require('../index');
    await init();

    // the database connection is being made
    expect(mocks.db.connect.mock.calls.length).toBe(1);
  });

  it('should log an Error if db is not initialised', async () => {
    mocks.dbModels = { initialize: () => null };
    jest.doMock('@database/models/index', () => mocks.dbModels);
    const { init } = require('../index');
    await expect(init()).rejects.toBeTruthy();
  });

  it('should create the graphql schema if db is initialized', async () => {
    jest.doMock('@database/models/index', () => ({
      ...mockDBClient().models,
      initialize: async () => mockDBClient().models,
      getModels: async () => mockDBClient().models
    }));
    const queries = require('@gql/queries');
    jest.spyOn(queries, 'createRootQuery');
    const { init } = require('../index');
    await init();
    expect(queries.createRootQuery.mock.calls.length).toBe(1);
  });

  it('should succeed when a valid request is made ', async () => {
    const { app, init } = require('../index');
    await init();
    await getResponse(query, app).then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.data.__schema).toBeTruthy();
    });
  });

  it('should fail when an invalid request is made ', async () => {
    const { app, init } = await require('../index');
    await init();
    await getResponse(
      `\n  query {\n    __schema1 {\n      queryType {\n        fields {\n          name\n        }\n      }\n    }\n  }\n  `,
      app
    ).then(response => {
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeTruthy();
    });
  });
});
