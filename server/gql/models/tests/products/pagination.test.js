import get from 'lodash/get';
import { productsTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Products graphQL-server-DB pagination tests', () => {
  const productsQuery = `
  query {
    products (first: 1, limit: 1, offset: 0){
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

  it('should have a query to get the products', async () => {
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
    });
  });

  it('should have the correct pageInfo', async () => {
    await getResponse(productsQuery).then(response => {
      const result = get(response, 'body.data.products.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
