import get from 'lodash/get';
import { suppliersTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';
var request = require('supertest');
var cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('Suppliers graphQL-server-DB pagination tests', () => {
  const suppliersQuery = `
  query {
    suppliers (first: 1){
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

  it('should have a query to get the storeProducts', async done => {
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...suppliersTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(suppliersQuery).then(response => {
      const result = get(response, 'body.data.suppliers.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: suppliersTable[0].id,
          name: suppliersTable[0].name,
          addressId: suppliersTable[0].addressId
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
        rows: [{ ...suppliersTable, $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(suppliersQuery).then(response => {
      const result = get(response, 'body.data.suppliers.pageInfo');
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
        rows: [{ ...suppliersTable[0], ...suppliersTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...suppliersTable[0], ...suppliersTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));

    await getResponse(suppliersQuery).then(response => {
      const result = get(response, 'body.data.suppliers.pageInfo');
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
    const suppliersCursorQuery = `
      query {
        suppliers (first: 1, after: "${cursor.start}"){
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

    await getResponse(suppliersCursorQuery).then(response => {
      const result = get(response, 'body.data.suppliers.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: suppliersTable[1].id,
          name: suppliersTable[1].name,
          addressId: suppliersTable[1].addressId
        })
      );
      done();
    });
  });
});
