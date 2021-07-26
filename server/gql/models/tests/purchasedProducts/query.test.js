import get from 'lodash/get';
import { getResponse } from '@utils/testUtils/index';

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

  it('should request for products related to the purchasedProducts', async done => {
    const { db } = require('@server');
    const findOnePurchasedProductsSpy = jest.spyOn(db.purchasedProducts, 'findOne');
    const findAllProductsSpy = jest.spyOn(db.products, 'findAll');

    await getResponse(purchasedProductPrice).then(response => {
      expect(get(response, 'body.data.purchasedProduct')).toBeTruthy();

      expect(findOnePurchasedProductsSpy.mock.calls.length).toBe(1);
      // check if products.findAll is being called once
      expect(findAllProductsSpy.mock.calls.length).toBe(1);
      // check if products.findAll is being called with the correct whereclause
      expect(findAllProductsSpy.mock.calls[0][0].include[0].where).toEqual({ id });
      // check if the included model has name: purchased_products
      expect(findAllProductsSpy.mock.calls[0][0].include[0].model.name).toEqual('purchased_products');
      done();
    });
  });
});
