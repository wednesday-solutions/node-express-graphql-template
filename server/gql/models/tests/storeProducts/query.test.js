import get from 'lodash/get';
import { storeProductsTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...storeProductsTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
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
    await getResponse(storeProductStoreId).then(response => {
      const result = get(response, 'body.data.storeProduct');
      const resultFields = Object.keys(result);
      expect(resultFields).toEqual(['id', 'storeId']);
      done();
    });
  });

  it('should return all the valid fields in the model definition', async done => {
    await getResponse(allFields).then(response => {
      const result = get(response, 'body.data.storeProduct');
      const resultFields = Object.keys(result);
      expect(resultFields).toEqual(['id', 'productId', 'storeId', 'createdAt', 'updatedAt', 'deletedAt']);
      done();
    });
  });
});
