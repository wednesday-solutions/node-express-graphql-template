import get from 'lodash/get';
import { suppliersTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

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
});
