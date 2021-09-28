import get from 'lodash/get';
import { supplierProductsTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Supplier Products graphQL-server-DB pagination tests', () => {
  const supplierProductsQuery = `
  query {
    supplierProducts (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          productId
          supplierId
          suppliers {
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
    await getResponse(supplierProductsQuery).then(response => {
      const result = get(response, 'body.data.supplierProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: supplierProductsTable[0].id,
          productId: supplierProductsTable[0].productId,
          supplierId: supplierProductsTable[0].supplierId
        })
      );
    });
  });

  it('should have the correct pageInfo', async () => {
    await getResponse(supplierProductsQuery).then(response => {
      const result = get(response, 'body.data.supplierProducts.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
