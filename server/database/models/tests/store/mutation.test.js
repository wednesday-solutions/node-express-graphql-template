import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.storesTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('store graphQL-server-DB mutation tests', () => {
  const createStoreMut = `
    mutation {
        createStore (
        name: "new store name"
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

  it('should have a mutation to create a new store', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: createStoreMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.createStore');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
            name: 'new store name',
            addressId: 1
          })
        );
        done();
      });
  });

  const deleteStoreMut = `
  mutation {
    deleteStore (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a store', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: deleteStoreMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.deleteStore');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1
          })
        );
        done();
      });
  });
});
