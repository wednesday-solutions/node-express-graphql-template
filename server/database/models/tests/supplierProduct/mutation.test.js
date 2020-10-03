import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.suppliersProductTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('supplier_product graphQL-server-DB mutation tests', () => {
  const createSupplierProductMut = `
    mutation {
      createSupplierProduct (
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
        const result = get(response, 'body.data.createSupplierProduct');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
            productId: 1,
            supplierId: 1
          })
        );
        done();
      });
  });

  const deleteSupplierProductMut = `
  mutation {
    deleteSupplierProduct (
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
        const result = get(response, 'body.data.deleteSupplierProduct');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1
          })
        );
        done();
      });
  });
});
