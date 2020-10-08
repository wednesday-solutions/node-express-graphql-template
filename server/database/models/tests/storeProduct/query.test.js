import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.storeProductsTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('store_product graphQL-server-DB query tests', () => {
  const storeProductStoreId = `
  query {
    storeProduct (id: 1) {
      id
      storeId
    }
  }
  `;
  const allFields = `
  query {
    storeProduct (id: 1) {
      id
      productId
      storeId
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
      .send({ query: storeProductStoreId })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.storeProduct');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'storeId']);
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
        const result = get(response, 'body.data.storeProduct');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'productId', 'storeId', 'createdAt', 'updatedAt', 'deletedAt']);
        done();
      });
  });
});
