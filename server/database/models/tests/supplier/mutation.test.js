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

describe('supplier graphQL-server-DB mutation tests', () => {
  const createSupplierMut = `
    mutation {
      createSupplier (
        name: "new supplier name"
        addressId: 1
      ) {
        id
        name
        addressId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new supplier', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: createSupplierMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.createSupplier');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
            name: 'new supplier name',
            addressId: 1
          })
        );
        done();
      });
  });

  const deleteSupplierMut = `
  mutation {
    deleteSupplier (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a supplier', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: deleteSupplierMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.deleteSupplier');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1
          })
        );
        done();
      });
  });
});
