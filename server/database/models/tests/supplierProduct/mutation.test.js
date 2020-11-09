import get from 'lodash/get';
import { supplierProductsTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...supplierProductsTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
});

describe('supplier_product graphQL-server-DB mutation tests', () => {
  const createSupplierProductMut = `
    mutation {
      createSupplierproduct (
        productId: 1
        supplierId: 1
      ) {
        id
        productId
        supplierId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new supplier Product', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: createSupplierProductMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.createSupplierproduct');
        expect(result).toMatchObject({
          id: '1',
          productId: 1,
          supplierId: 1
        });
        done();
      });
  });

  const deleteSupplierProductMut = `
  mutation {
    deleteSupplierproduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a supplier product', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: deleteSupplierProductMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.deleteSupplierproduct');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1
          })
        );
        done();
      });
  });
});
