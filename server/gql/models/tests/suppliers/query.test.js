import get from 'lodash/get';
import { addressesTable, productsTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('supplier graphQL-server-DB query tests', () => {
  const id = 1;
  const supplierName = `
  query {
    supplier (id: ${id}) {
      id
      name
      addresses {
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
  it('should request for products and addresses related to the suppliers', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.products, 'findAll').mockImplementation(() => [productsTable[0]]);
    jest.spyOn(dbClient.models.addresses, 'findAll').mockImplementation(() => [addressesTable[0]]);

    await getResponse(supplierName).then(response => {
      expect(get(response, 'body.data.supplier')).toBeTruthy();

      expect(dbClient.models.products.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].model.name).toEqual('suppliers');

      expect(dbClient.models.addresses.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.addresses.findAll.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(dbClient.models.addresses.findAll.mock.calls[0][0].include[0].model.name).toEqual('suppliers');
    });
  });
});
