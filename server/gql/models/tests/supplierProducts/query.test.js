import get from 'lodash/get';
import { productsTable, suppliersTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('supplier_products graphQL-server-DB query tests', () => {
  const id = 1;
  const supplierProductId = `
  query {
    supplierProduct (id: ${id}) {
      id
      productId
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
  `;

  it('should request for products and suppliers related to the supplierProducts', async done => {
    const { db } = require('@server');
    const findAllProductsSpy = jest.spyOn(db.products, 'findAll').mockImplementation(() => [productsTable[0]]);
    const findAllSuppliersSpy = jest.spyOn(db.suppliers, 'findAll').mockImplementation(() => [suppliersTable[0]]);

    await getResponse(supplierProductId).then(response => {
      expect(get(response, 'body.data.supplierProduct')).toBeTruthy();

      expect(findAllProductsSpy.mock.calls.length).toBe(1);
      expect(findAllProductsSpy.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(findAllProductsSpy.mock.calls[0][0].include[0].model.name).toEqual('supplier_products');

      expect(findAllSuppliersSpy.mock.calls.length).toBe(1);
      expect(findAllSuppliersSpy.mock.calls[0][0].include[0].where).toEqual({ supplierId: id });
      expect(findAllSuppliersSpy.mock.calls[0][0].include[0].model.name).toEqual('supplier_products');
      done();
    });
  });
});
