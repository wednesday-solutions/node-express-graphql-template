import get from 'lodash/get';
import { addressesTable, productsTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

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
  it('should request for products and addresses related to the suppliers', async done => {
    const { db } = require('@server');
    const findAllProductsSpy = jest.spyOn(db.products, 'findAll').mockImplementation(() => [productsTable[0]]);
    const findAllAddressesSpy = jest.spyOn(db.addresses, 'findAll').mockImplementation(() => [addressesTable[0]]);

    await getResponse(supplierName).then(response => {
      expect(get(response, 'body.data.supplier')).toBeTruthy();

      expect(findAllProductsSpy.mock.calls.length).toBe(1);
      expect(findAllProductsSpy.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(findAllProductsSpy.mock.calls[0][0].include[0].model.name).toEqual('suppliers');

      expect(findAllAddressesSpy.mock.calls.length).toBe(1);
      expect(findAllAddressesSpy.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(findAllAddressesSpy.mock.calls[0][0].include[0].model.name).toEqual('suppliers');
      done();
    });
  });
});
