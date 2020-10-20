import get from 'lodash/get';
import { productsTable } from 'server/utils/testUtils/mockData';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');
var cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('Products graphQL-server-DB pagination tests', () => {
  const productsQuery = `
  query {
    products (first: 1){
      edges {
        node {
          id
          name
          category
          amount
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
        rows: [{ ...productsTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));
    await getResponse(productsQuery).then(response => {
      const result = get(response, 'body.data.products.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: productsTable[0].id,
          name: productsTable[0].name,
          category: productsTable[0].category,
          amount: Math.floor(productsTable[0].amount)
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
        rows: [{ ...productsTable, $total: 10 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));
    await getResponse(productsQuery).then(response => {
      const result = get(response, 'body.data.products.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });

  it('should return the correct product after the provided cursor', async done => {
    const mockDBClient = require('database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...productsTable[0], ...productsTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...productsTable[0], ...productsTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('database', () => ({ client, getClient: () => client }));

    await getResponse(productsQuery).then(response => {
      const result = get(response, 'body.data.products.pageInfo');
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

    const productsCursorQuery = `
      query {
        products (first: 1, after: "${cursor.start}"){
          edges {
            node {
              id
              name
              category
              amount
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

    await getResponse(productsCursorQuery).then(response => {
      const result = get(response, 'body.data.products.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: productsTable[1].id,
          name: productsTable[1].name,
          category: productsTable[1].category,
          amount: Math.floor(productsTable[1].amount)
        })
      );
      done();
    });
  });
});
