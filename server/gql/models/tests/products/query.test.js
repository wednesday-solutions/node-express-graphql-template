import get from 'lodash/get';
import { productsTable, storesTable, suppliersTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...productsTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
});

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
  it('should request for suppliers and stores related to the address', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    // since we are requesting for a list of suppliers check if all suppliers are being requested
    jest.spyOn(dbClient.models.suppliers, 'findAll').mockImplementation(() => [suppliersTable[0]]);

    // since we are requesting for a list of stores check if all stores are being requested
    jest.spyOn(dbClient.models.stores, 'findAll').mockImplementation(() => [storesTable[0]]);

    await getResponse(productQuery).then(response => {
      expect(get(response, 'body.data.product')).toBeTruthy();
      // check if suppliers.findAll is being called once
      expect(dbClient.models.suppliers.findAll.mock.calls.length).toBe(1);
      // check if suppliers.findAll is being called with the correct whereclause
      expect(dbClient.models.suppliers.findAll.mock.calls[0][0].include[0].where).toEqual({ productId: id });
      // check if the included model has name: addresses
      expect(dbClient.models.suppliers.findAll.mock.calls[0][0].include[0].model.name).toEqual('supplier_products');

      expect(dbClient.models.stores.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.stores.findAll.mock.calls[0][0].include[0].where).toEqual({ productId: id });
      expect(dbClient.models.stores.findAll.mock.calls[0][0].include[0].model.name).toEqual('store_products');
      done();
    });
  });
});
