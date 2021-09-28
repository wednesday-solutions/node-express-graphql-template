import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { productsTable } from '@utils/testUtils/mockData';

describe('purchased_product graphQL-server-DB query tests', () => {
  const id = 1;
  const purchasedProductPrice = `
  query {
    purchasedProduct (id: ${id}) {
      id
      price
      products {
        edges {
          node {
            id
          }
        }
      }
    }
  }
  `;

  it('should request for products related to the purchasedProducts', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.products, 'findAll').mockImplementation(() => [productsTable[0]]);

    await getResponse(purchasedProductPrice).then(response => {
      expect(get(response, 'body.data.purchasedProduct')).toBeTruthy();

      // check if products.findAll is being called once
      expect(dbClient.models.products.findAll.mock.calls.length).toBe(1);
      // check if products.findAll is being called with the correct whereclause
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].where).toEqual({ id });
      // check if the included model has name: purchased_products
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].model.name).toEqual('purchased_products');
    });
  });
});
