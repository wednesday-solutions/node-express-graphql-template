import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.suppliersTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('supplier graphQL-server-DB query tests', () => {
  const supplierName = `
  query {
    supplier (id: 1) {
      id
      name
    }
  }
  `;
  const allFields = `
  query {
    supplier (id: 1) {
      id
      name
      addressId
      createdAt
      updatedAt
      deletedAt
    }
  }
  `;

  it('should return the fields mentioned in the query', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: supplierName })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.supplier');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'name']);
        done();
      });
  });

  it('should return all the valid fields in the model definition', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: allFields })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.supplier');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'name', 'addressId', 'createdAt', 'updatedAt', 'deletedAt']);
        done();
      });
  });
});
