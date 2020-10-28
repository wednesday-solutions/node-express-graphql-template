import get from 'lodash/get';
import { storeProductsTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';

const request = require('supertest');
let cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('StoresProducts graphQL-server-DB pagination tests', () => {
  const storeProductsQuery = `
  query {
    storeProducts (first: 1){
      edges {
        node {
          id
          productId
          storeId
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

  it('should have a query to get the storeProducts', async done => {
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storeProductsTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(storeProductsQuery).then(response => {
      const result = get(response, 'body.data.storeProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: storeProductsTable[0].id,
          productId: storeProductsTable[0].productId,
          storeId: storeProductsTable[0].storeId
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async done => {
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storeProductsTable, $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(storeProductsQuery).then(response => {
      const result = get(response, 'body.data.storeProducts.pageInfo');
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
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storeProductsTable[0], ...storeProductsTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storeProductsTable[0], ...storeProductsTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));

    await getResponse(storeProductsQuery).then(response => {
      const result = get(response, 'body.data.storeProducts.pageInfo');
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
        storeProducts (first: 1, after: "${cursor.start}"){
            edges {
              node {
                id
                productId
                storeId
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
      const result = get(response, 'body.data.storeProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: storeProductsTable[1].id,
          productId: storeProductsTable[1].productId,
          storeId: storeProductsTable[1].storeId
        })
      );
      done();
    });
  });
});
