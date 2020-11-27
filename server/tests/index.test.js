import { testApp } from '@utils/testUtils/testApp';
const request = require('supertest');

describe('init', () => {
  const mocks = {};
  it('should successfully configure environment variables and connect to the database', async () => {
    mocks.dotenv = {
      config: jest.fn
    };
    jest.doMock('dotenv', () => mocks.dotenv);
    jest.spyOn(mocks.dotenv, 'config');
    await require('../index');

    // check if the environments are being configured correctly
    expect(mocks.dotenv.config.mock.calls.length).toBe(1);
    expect(mocks.dotenv.config.mock.calls[0][0]).toEqual({ path: `.env.${process.env.ENVIRONMENT}` });
  });

  it('should start the server and listen for /grapqhl', async () => {
    const { init, app } = await require('../index');
    mocks.app = app;
    jest.spyOn(mocks.app, 'use');
    await init();

    // check if the server has been started
    expect(mocks.app.use.mock.calls.length).toBe(1);
    expect(mocks.app.use.mock.calls[0][0]).toEqual('/graphql');
  });

  it('check if @database.connect has been invoked', async () => {
    mocks.db = { getClient: jest.fn(), connect: jest.fn() };
    jest.spyOn(mocks.db, 'connect');
    jest.doMock('@database', () => mocks.db);

    await require('../index');

    // the database connection is being made
    expect(mocks.db.connect.mock.calls.length).toBe(1);
  });
});
describe('TestApp: Server', () => {
  it('responds OK to GET /', done => {
    request(testApp)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OK');
        done();
      });
  });

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

  it('should respond to /graphql', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.__schema.queryType.fields[0].name).toBeTruthy();
        done();
      });
  });
});
