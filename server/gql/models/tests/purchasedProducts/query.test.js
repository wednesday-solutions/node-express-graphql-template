import get from 'lodash/get';
import { purchasedProductsTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...purchasedProductsTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
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
    await getResponse(purchasedProductPrice).then(response => {
      const result = get(response, 'body.data.purchasedProduct');
      const resultFields = Object.keys(result);
      expect(resultFields).toEqual(['id', 'price']);
      done();
    });
  });

  it('should return all the valid fields in the model definition', async done => {
    await getResponse(allFields).then(response => {
      const result = get(response, 'body.data.purchasedProduct');
      const resultFields = Object.keys(result);
      expect(resultFields).toEqual(['id', 'price', 'discount', 'deliveryDate', 'createdAt', 'updatedAt', 'deletedAt']);
      done();
    });
  });
});
