import get from 'lodash/get';
import { supplierProductsTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';
const request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...supplierProductsTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
});

describe('supplier_products graphQL-server-DB query tests', () => {
  const supplierProductId = `
  query {
    supplierProduct (id: 1) {
      id
      productId
    }
  }
  `;
  const allFields = `
  query {
    supplierProduct (id: 1) {
      id
      productId
      supplierId
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
      .send({ query: supplierProductId })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.supplierProduct');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'productId']);
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
        const result = get(response, 'body.data.supplierProduct');
        const resultFields = Object.keys(result);
        expect(resultFields).toEqual(['id', 'productId', 'supplierId', 'createdAt', 'updatedAt', 'deletedAt']);
        done();
      });
  });
});
