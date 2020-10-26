import get from 'lodash/get';
import { storesTable } from 'server/utils/testUtils/mockData';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');
var cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('Stores graphQL-server-DB pagination tests', () => {
  const storesQuery = `
  query {
    stores (first: 1){
      edges {
        node {
          id
          name
          addressId
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }
`;

  it('should have a query to get the Stores', async done => {
    const mockDBClient = require('database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storesTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));
    await getResponse(storesQuery).then(response => {
      const result = get(response, 'body.data.stores.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: storesTable[0].id,
          name: storesTable[0].name,
          addressId: storesTable[0].addressId
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async done => {
    const mockDBClient = require('database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storesTable, $total: 10 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));
    await getResponse(storesQuery).then(response => {
      const result = get(response, 'body.data.stores.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });

  it('should return the correct purchasedProduct after the provided cursor', async done => {
    const mockDBClient = require('database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storesTable[0], ...storesTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storesTable[0], ...storesTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));

    await getResponse(storesQuery).then(response => {
      const result = get(response, 'body.data.stores.pageInfo');
      cursor = {
        start: result.startCursor,
        end: result.endCursor
      };
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
    const storesCursorQuery = `
      query {
        stores (first: 1, after: "${cursor.start}"){
            edges {
              node {
                id
                name
                addressId
              }
            }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          total
        }
      }
    `;

    await getResponse(storesCursorQuery).then(response => {
      const result = get(response, 'body.data.stores.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: storesTable[1].id,
          name: storesTable[1].name,
          addressId: storesTable[1].addressId
        })
      );
      done();
    });
  });
});
