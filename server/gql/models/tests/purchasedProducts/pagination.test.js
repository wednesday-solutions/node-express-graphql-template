import get from 'lodash/get';
import { purchasedProductsTable } from '@server/utils/testUtils/mockData';
import { getResponse, resetAndMockDB } from '@utils/testUtils';

describe('PurchasedProducts graphQL-server-DB pagination tests', () => {
  const purchasedProductsQuery = `
  query {
    purchasedProducts (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          price
          discount
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

  it('should have a query to get the products', async () => {
    resetAndMockDB();
    await getResponse(purchasedProductsQuery).then(response => {
      const result = get(response, 'body.data.purchasedProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: purchasedProductsTable[0].id,
          price: Math.floor(purchasedProductsTable[0].price),
          discount: Math.floor(purchasedProductsTable[0].discount)
        })
      );
    });
  });

  it('should have the correct pageInfo', async () => {
    resetAndMockDB();
    await getResponse(purchasedProductsQuery).then(response => {
      const result = get(response, 'body.data.purchasedProducts.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
