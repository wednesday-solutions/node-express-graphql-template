import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
import { storesTable, suppliersTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB query tests', () => {
  const id = 1;
  const addressOne = `
  query {
    address (id: ${id}) {
      id
      address1
      stores {
        edges {
          node {
            id 
          }
        }
      }
      suppliers {
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
    const { db } = require('@server');
    const findSuppliersSpy = jest.spyOn(db.suppliers, 'findAll').mockImplementation(() => [suppliersTable[0]]);
    const findAllStoresSpy = jest.spyOn(db.stores, 'findAll').mockImplementation(() => [storesTable[0]]);

    await getResponse(addressOne).then(response => {
      expect(get(response, 'body.data.address')).toBeTruthy();
      // check if suppliers.findAll is being called once
      expect(findSuppliersSpy.mock.calls.length).toBe(1);
      // check if suppliers.findAll is being called with the correct whereclause
      expect(findSuppliersSpy.mock.calls[0][0].include[0].where).toEqual({ id });
      // check if the included model has name: addresses
      expect(findSuppliersSpy.mock.calls[0][0].include[0].model.name).toEqual('addresses');

      expect(findAllStoresSpy.mock.calls.length).toBe(1);
      expect(findAllStoresSpy.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(findAllStoresSpy.mock.calls[0][0].include[0].model.name).toEqual('addresses');
      done();
    });
  });
});
