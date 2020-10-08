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

describe('Product graphQL-server-DB mutation tests', () => {
  const createProductMut = `
    mutation {
      createProduct (
        name: "New produce"
        amount: 10
      ) {
        id
        name
        amount
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new product', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: createProductMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.createProduct');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
            name: 'New produce',
            amount: 10
          })
        );
        done();
      });
  });

  const deleteProductMut = `
  mutation {
    deleteProduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a product', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: deleteProductMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.deleteProduct');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1
          })
        );
        done();
      });
  });
});
