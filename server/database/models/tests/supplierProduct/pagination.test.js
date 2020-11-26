import get from 'lodash/get';
import { supplierProductsTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';
const request = require('supertest');
let cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('Supplier Products graphQL-server-DB pagination tests', () => {
  const supplierProductsQuery = `
  query {
    supplierProducts (first: 1){
      edges {
        node {
          id
          productId
          supplierId
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
        rows: [{ ...supplierProductsTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(supplierProductsQuery).then(response => {
      const result = get(response, 'body.data.supplierProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: supplierProductsTable[0].id,
          productId: supplierProductsTable[0].productId,
          supplierId: supplierProductsTable[0].supplierId
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
        rows: [{ ...supplierProductsTable, $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(supplierProductsQuery).then(response => {
      const result = get(response, 'body.data.supplierProducts.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });

  it('should return the correct supplier after the provided cursor', async done => {
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...supplierProductsTable[0], ...supplierProductsTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...supplierProductsTable[0], ...supplierProductsTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));

    await getResponse(supplierProductsQuery).then(response => {
      const result = get(response, 'body.data.supplierProducts.pageInfo');
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
    const supplierProductsCursorQuery = `
      query {
        supplierProducts (first: 1, after: "${cursor.start}"){
            edges {
              node {
                id
                productId
                supplierId
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

    await getResponse(supplierProductsCursorQuery).then(response => {
      const result = get(response, 'body.data.supplierProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: supplierProductsTable[1].id,
          productId: supplierProductsTable[1].productId,
          supplierId: supplierProductsTable[1].supplierId
        })
      );
      done();
    });
  });
});
