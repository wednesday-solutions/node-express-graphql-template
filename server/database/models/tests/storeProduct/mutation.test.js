import get from 'lodash/get';
import { storeProductsTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...storeProductsTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
});

describe('store_products graphQL-server-DB mutation tests', () => {
  const createStoreProductMut = `
    mutation {
        createStoreproduct (
        productId: 1
        storeId: 1
      ) {
        id
        productId
        storeId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new store product', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: createStoreProductMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.createStoreproduct');
        expect(result).toMatchObject({
          id: '1',
          productId: 1,
          storeId: 1
        });
        done();
      });
  });

  const deleteStoreProductMut = `
  mutation {
    deleteStoreproduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a store product', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: deleteStoreProductMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.deleteStoreproduct');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1
          })
        );
        done();
      });
  });
});
