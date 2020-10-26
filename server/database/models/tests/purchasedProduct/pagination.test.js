import get from 'lodash/get';
import { purchasedProductsTable } from 'server/utils/testUtils/mockData';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');
var cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('PurchasedProducts graphQL-server-DB pagination tests', () => {
  const purchasedProductsQuery = `
  query {
    purchasedProducts (first: 1){
      edges {
        node {
          id
          price
          discount
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

  it('should have a query to get the products', async done => {
    const mockDBClient = require('database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...purchasedProductsTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));
    await getResponse(purchasedProductsQuery).then(response => {
      const result = get(response, 'body.data.purchasedProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: purchasedProductsTable[0].id,
          price: Math.floor(purchasedProductsTable[0].price),
          discount: Math.floor(purchasedProductsTable[0].discount)
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
        rows: [{ ...purchasedProductsTable, $total: 10 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));
    await getResponse(purchasedProductsQuery).then(response => {
      const result = get(response, 'body.data.purchasedProducts.pageInfo');
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
        rows: [{ ...purchasedProductsTable[0], ...purchasedProductsTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...purchasedProductsTable[0], ...purchasedProductsTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));

    await getResponse(purchasedProductsQuery).then(response => {
      const result = get(response, 'body.data.purchasedProducts.pageInfo');
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
    const purchasedProductsCursorQuery = `
      query {
        purchasedProducts (first: 1, after: "${cursor.start}"){
          edges {
            node {
              id
              price
              discount
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

    await getResponse(purchasedProductsCursorQuery).then(response => {
      const result = get(response, 'body.data.purchasedProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: purchasedProductsTable[1].id,
          price: Math.floor(purchasedProductsTable[1].price),
          discount: Math.floor(purchasedProductsTable[1].discount)
        })
      );
      done();
    });
  });
});
