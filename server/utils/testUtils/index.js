import isNil from 'lodash/isNil';
import request from 'supertest';
import logger from '@middleware/logger/index';

export const restfulGetResponse = async (path, app) => {
  if (!app) {
    app = await require('@server/utils/testUtils/testApp').testApp;
  }
  return await request(app)
    .get(path)
    .set('Accept', 'application/json');
};

export const getResponse = async (query, app) => {
  if (!app) {
    app = await require('@server/utils/testUtils/testApp').testApp;
  }
  return await request(app)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');
};

export function mockDBClient(config = { total: 10 }) {
  const SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  const dbConnectionMock = new SequelizeMock();
  dbConnectionMock.options = { dialect: 'mock' };

  return {
    client: dbConnectionMock,
    models: {}
  };
}

export async function connectToMockDB() {
  const client = mockDBClient();
  try {
    client.authenticate();
  } catch (error) {
    logger().error(error);
  }
}

export const resetAndMockDB = (mockCallback, config, db) => {
  if (!db) {
    db = mockDBClient(config);
  }
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  jest.doMock('@database', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return { getClient: () => db.client, client: db.client, connect: () => {} };
  });
  jest.doMock('@database/models', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return db.models;
  });
  return db.client;
};
export const createFieldsWithType = fields => {
  const fieldsWithType = [];
  Object.keys(fields).forEach(key => {
    fieldsWithType.push({
      name: key,
      type: {
        name: fields[key].type
      }
    });
  });
  return fieldsWithType;
};

const getExpectedField = (expectedFields, name) => expectedFields.filter(field => field.name === name);

export const expectSameTypeNameOrKind = (result, expected) =>
  result.filter(field => {
    const expectedField = getExpectedField(expected, field.name)[0];
    // @todo check for connection types.
    if (!isNil(expectedField)) {
      return expectedField.type.name === field.type.name || expectedField.type.kind === field.type.kind;
    }
    return false;
  }).length === 0;
