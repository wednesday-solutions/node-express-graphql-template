import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.purchasedProductsTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('purchased_product graphQL-server-DB query tests', () => {
  const purchasedProductPrice = `
  query {
    purchasedProduct (id: 1) {
      id
      price
    }
  }
  `;
  const allFields = `
  query {
    purchasedProduct (id: 1) {
      id
      price
      discount
      deliveryDate
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
      .send({ query: purchasedProductPrice })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.purchasedProduct');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'price']);
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
        const result = get(response, 'body.data.purchasedProduct');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual([
          'id',
          'price',
          'discount',
          'deliveryDate',
          'createdAt',
          'updatedAt',
          'deletedAt'
        ]);
        done();
      });
  });
});
