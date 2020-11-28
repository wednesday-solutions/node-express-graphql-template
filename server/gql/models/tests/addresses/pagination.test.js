import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@server/utils/testUtils';
import { addressesTable } from '@server/utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  const addressesQuery = `
  query {
    addresses (first: 1){
      edges {
        node {
          id
          address1
          address2
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }
`;

  it('should have a query to get the addresses', async done => {
    const dbClient = mockDBClient();

    // since we are requesting for a list of suppliers check if all suppliers are being requested
    jest.spyOn(dbClient.models.suppliers, 'findAll');

    // since we are requesting for a list of stores check if all stores are being requested
    jest.spyOn(dbClient.models.stores, 'findAll');

    resetAndMockDB(null, {}, dbClient);
    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: addressesTable[0].id,
          address1: addressesTable[0].address1,
          address2: addressesTable[0].address2
        })
      );
    });

    // check if suppliers.findAll is being called once
    expect(dbClient.models.suppliers.findAll.mock.calls.length).toBe(1);
    // check if suppliers.findAll is being called with the correct whereclause
    expect(dbClient.models.suppliers.findAll.mock.calls[0][0].include[0].where).toEqual({ id: '1' });
    // check if the included model has name: addresses
    expect(dbClient.models.suppliers.findAll.mock.calls[0][0].include[0].model.name).toEqual('addresses');

    expect(dbClient.models.stores.findAll.mock.calls.length).toBe(1);
    expect(dbClient.models.stores.findAll.mock.calls[0][0].include[0].where).toEqual({ id: '1' });
    expect(dbClient.models.stores.findAll.mock.calls[0][0].include[0].model.name).toEqual('addresses');
    done();
  });

  it('should have the correct pageInfo', async done => {
    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });
});
