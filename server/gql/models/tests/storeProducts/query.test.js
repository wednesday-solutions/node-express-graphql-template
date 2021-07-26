import get from 'lodash/get';
import { productsTable, storesTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('store_product graphQL-server-DB query tests', () => {
  const id = 1;
  const storeProductStoreId = `
  query {
    storeProduct (id: ${id}) {
      id
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
  `;

  it('should request for stores and products related to the storeProducts', async done => {
    const { db } = require('@server');
    const findAllProductsSpy = jest.spyOn(db.products, 'findAll').mockImplementation(() => [productsTable[0]]);
    const findAllStoresSpy = jest.spyOn(db.stores, 'findAll').mockImplementation(() => [storesTable[0]]);

    await getResponse(storeProductStoreId).then(response => {
      expect(get(response, 'body.data.storeProduct')).toBeTruthy();

      // check if stores.findAll is being called once
      expect(findAllStoresSpy.mock.calls.length).toBe(1);
      // check if stores.findAll is being called with the correct whereclause
      expect(findAllStoresSpy.mock.calls[0][0].include[0].where).toEqual({ storeId: id });
      // check if the included model has name: store_products
      expect(findAllStoresSpy.mock.calls[0][0].include[0].model.name).toEqual('store_products');

      expect(findAllProductsSpy.mock.calls.length).toBe(1);
      expect(findAllProductsSpy.mock.calls[0][0].include[0].where).toEqual({ productId: id });
      expect(findAllProductsSpy.mock.calls[0][0].include[0].model.name).toEqual('store_products');
      done();
    });
  });
});
