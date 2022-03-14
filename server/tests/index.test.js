import { restfulGetResponse, getResponse, resetAndMockDB } from '@utils/testUtils';

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
    jest.mock('dotenv', () => mocks.dotenv);
    jest.spyOn(mocks.dotenv, 'config');
    await require('../index').init();

    // check if the environments are being configured correctly
    expect(mocks.dotenv.config.mock.calls.length).toBe(3);
  });

  it('should ensure the no of call to app.use', async () => {
    const { init, app } = await require('../index');
    mocks.app = app;
    jest.spyOn(mocks.app, 'use');
    await init();

    // check if the server has been started
    expect(mocks.app.use.mock.calls.length).toBe(7);
    expect(mocks.app.use.mock.calls[0][0]).toEqual(expect.any(Function));
  });

  it('should invoke @database.connect ', async () => {
    mocks.db = { getClient: jest.fn(), connect: jest.fn() };
    jest.spyOn(mocks.db, 'connect');
    jest.doMock('@database', () => mocks.db);

    await require('../index');

    // the database connection is being made
    expect(mocks.db.connect.mock.calls.length).toBe(1);
  });
});
describe('TestApp: Server', () => {
  it('should respond to /graphql', async () => {
    resetAndMockDB();
    await getResponse(query).then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.data.__schema.queryType.fields[0].name).toBeTruthy();
    });
  });
});

describe('health check API', () => {
  it('respond with status 200 and correct message', async () => {
    const app = require('../index').app;
    const res = await restfulGetResponse('/', app);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('Service up and running!');
  });
});

describe('github API', () => {
  require('@services/circuitbreaker').__setupMocks(() => ({ data: { items: [] } }));
  it('respond with status 200 and correct message when CB is closed', async () => {
    process.env.ENVIRONMENT_NAME = 'local';
    process.env.IS_TESTING = 'local';
    const data = { data: 'this is fine' };
    require('@services/circuitbreaker').__setupMocks(() => data);
    const app = require('../index').app;
    const res = await restfulGetResponse('/github', app);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(data);
    process.env.ENVIRONMENT_NAME = 'test';
  });
  it('respond with status 424 and an error message when CB is open', async () => {
    process.env.ENVIRONMENT_NAME = 'local';
    const error = 'Github API is down.';
    require('@services/circuitbreaker').__setupMocks(() => error);
    const app = require('../index').app;
    const res = await restfulGetResponse('/github', app);
    expect(res.statusCode).toBe(424);
    expect(res.body).toStrictEqual({ error });
  });
});

describe('fetchFromGithub', () => {
  it('should call the github api', async () => {
    const repo = 'repo';
    const { fetchFromGithub } = require('../index');
    const res = { data: { items: [] } };
    const axiosSpy = jest.spyOn(require('axios'), 'get').mockImplementation(() => res);
    const data = await fetchFromGithub(repo);
    expect(data).toBe(res);
    expect(axiosSpy).toBeCalled();
    expect(axiosSpy).toBeCalledWith(`https://api.github.com/search/repositories?q=${repo}&per_page=2`);
  });
});
