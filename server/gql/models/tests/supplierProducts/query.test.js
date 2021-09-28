import get from 'lodash/get';
import { productsTable, suppliersTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

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

  it('should request for products and suppliers related to the supplierProducts', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.products, 'findAll').mockImplementation(() => [productsTable[0]]);
    jest.spyOn(dbClient.models.suppliers, 'findAll').mockImplementation(() => [suppliersTable[0]]);

    await getResponse(supplierProductId).then(response => {
      expect(get(response, 'body.data.supplierProduct')).toBeTruthy();

      expect(dbClient.models.products.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].model.name).toEqual('supplier_products');

      expect(dbClient.models.suppliers.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.suppliers.findAll.mock.calls[0][0].include[0].where).toEqual({ supplierId: id });
      expect(dbClient.models.suppliers.findAll.mock.calls[0][0].include[0].model.name).toEqual('supplier_products');
    });
  });
});
