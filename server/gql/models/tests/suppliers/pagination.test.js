import get from 'lodash/get';
import { suppliersTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Suppliers graphQL-server-DB pagination tests', () => {
  const suppliersQuery = `
  query {
    suppliers (first: 1, limit: 1, offset: 0){
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

  it('should have a query to get the storeProducts', async () => {
    await getResponse(suppliersQuery).then(response => {
      const result = get(response, 'body.data.suppliers.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: suppliersTable[0].id,
          name: suppliersTable[0].name,
          addressId: suppliersTable[0].addressId
        })
      );
    });
  });

  it('should have the correct pageInfo', async () => {
    await getResponse(suppliersQuery).then(response => {
      const result = get(response, 'body.data.suppliers.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
