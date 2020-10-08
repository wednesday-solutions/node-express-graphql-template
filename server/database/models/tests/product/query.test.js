import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.productsTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('Product graphQL-server-DB query tests', () => {
  const productName = `
  query {
    product (id: 1) {
      id
      name
    }
  }
  `;
  const allFields = `
  query {
    product (id: 1) {
      id
      name
      category
      amount
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
      .send({ query: productName })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.product');
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
        const result = get(response, 'body.data.product');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'name', 'category', 'amount', 'createdAt', 'updatedAt', 'deletedAt']);
        done();
      });
  });
});
