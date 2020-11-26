import get from 'lodash/get';
import { addressesTable } from '@server/utils/testUtils/mockData';
import { testApp } from '@server/utils/testUtils/testApp';
const request = require('supertest');
let cursor = {};

const getResponse = async query =>
  await request(testApp)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');

describe('Address graphQL-server-DB mutation tests', () => {
  const addressesQuery = `
  query {
    addresses (first: 1){
      edges {
        node {
          id
          address1
          address2
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

  it('should have a query to get the addresses', async done => {
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...addressesTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: addressesTable[0].id,
          address1: addressesTable[0].address1,
          address2: addressesTable[0].address2
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
        rows: [{ ...addressesTable, $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });

  it('should return the correct address after the provided cursor', async done => {
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...addressesTable[0], ...addressesTable[1], $total: 2 }]
      }
    ]);
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...addressesTable[0], ...addressesTable[1], $total: 2 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));

    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.pageInfo');
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

    const addressesCursorQuery = `
      query {
        addresses (first: 1, after: "${cursor.start}"){
          edges {
            node {
              id
              address1
              address2
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

    await getResponse(addressesCursorQuery).then(response => {
      const result = get(response, 'body.data.addresses.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: addressesTable[1].id,
          address1: addressesTable[1].address1,
          address2: addressesTable[1].address2
        })
      );
      done();
    });
  });
});
