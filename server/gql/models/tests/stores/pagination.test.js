import get from 'lodash/get';
import { storesTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Stores graphQL-server-DB pagination tests', () => {
  const storesQuery = `
  query {
    stores (first: 1){
      edges {
        node {
          id
          name
          addressId
          addresses {
            edges {
              node {
                id
              }
            }
          }
          products {
            edges {
              node {
                id
              }
            }
          }
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
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storesTable[0], $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
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
    const mockDBClient = require('@database');
    const client = mockDBClient.client;
    client.$queueQueryResult([
      {},
      {
        rows: [{ ...storesTable, $total: 10 }]
      }
    ]);
    jest.doMock('@database', () => ({ client, getClient: () => client }));
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
});
