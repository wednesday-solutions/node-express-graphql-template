import get from 'lodash/get';
import { storeProductsTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('StoresProducts graphQL-server-DB pagination tests', () => {
  const storeProductsQuery = `
  query {
    storeProducts (first: 1){
      edges {
        node {
          id
          productId
          storeId
          stores {
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

  it('should have a query to get the storeProducts', async done => {
    await getResponse(storeProductsQuery).then(response => {
      const result = get(response, 'body.data.storeProducts.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: storeProductsTable[0].id,
          productId: storeProductsTable[0].productId,
          storeId: storeProductsTable[0].storeId
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async done => {
    await getResponse(storeProductsQuery).then(response => {
      const result = get(response, 'body.data.storeProducts.pageInfo');
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
