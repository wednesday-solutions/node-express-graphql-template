import get from 'lodash/get';
import { storesTable, suppliersTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Product graphQL-server-DB query tests', () => {
  const id = 1;
  const productQuery = `
  query {
    product (id: ${id}) {
      id
      name
        suppliers {
          edges {
            node {
              id
            }  
          }
        }
        stores {
          edges {
            node {
              id
            }  
          }
        }
    }
  }
  `;
  it('should request for suppliers and stores related to the product', async done => {
    const { db } = require('@server');
    const findAllSuppliersSpy = jest.spyOn(db.suppliers, 'findAll').mockImplementation(() => [suppliersTable[0]]);
    const findAllStoresSpy = jest.spyOn(db.stores, 'findAll').mockImplementation(() => [storesTable[0]]);

    await getResponse(productQuery).then(response => {
      expect(get(response, 'body.data.product')).toBeTruthy();
      // check if suppliers.findAll is being called once
      expect(findAllSuppliersSpy.mock.calls.length).toBe(1);
      // check if suppliers.findAll is being called with the correct whereclause
      expect(findAllSuppliersSpy.mock.calls[0][0].include[0].where).toEqual({ productId: id });
      // check if the included model has name: supplier_products
      expect(findAllSuppliersSpy.mock.calls[0][0].include[0].model.name).toEqual('supplier_products');

      expect(findAllStoresSpy.mock.calls.length).toBe(1);
      expect(findAllStoresSpy.mock.calls[0][0].include[0].where).toEqual({ productId: id });
      expect(findAllStoresSpy.mock.calls[0][0].include[0].model.name).toEqual('store_products');
      done();
    });
  });
});
