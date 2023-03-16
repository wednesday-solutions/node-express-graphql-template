import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { addressesTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  let dbClient;
  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
  });
  const createAddressMut = `
  mutation {
    createAddress (
      address1: "${addressesTable[0].address1}"
      address2: "${addressesTable[0].address2}"
      city: "${addressesTable[0].city}"
      country: "${addressesTable[0].country}"
      latitude: ${addressesTable[0].latitude}
      longitude: ${addressesTable[0].longitude}
    ) {
      id
      address1
      address2
      city
      country
      latitude
      longitude
      createdAt
      updatedAt
      deletedAt
      suppliers {
        edges {
          node {
            name
          }
        }
      }
      stores {
        edges {
          node {
            name
          }
        }
      }
    }
  }
`;

  const updateAddressMutation = `
  mutation {
    updateAddress (
      id: ${addressesTable[0].id}
      address1: "${addressesTable[0].address1}"
      address2: "${addressesTable[0].address2}",
      latitude: ${addressesTable[0].latitude}
      longitude: ${addressesTable[0].longitude}
    ) {
      id
    }
  }
`;

  const deleteAddressMutation = `mutation DeleteAddress {
    deleteAddress(id: ${addressesTable[0].id}) {
      id
    }
    
  }`;
  it('should have a mutation to create a new address', async () => {
    jest.spyOn(dbClient.models.addresses, 'create');
    const response = await getResponse(createAddressMut);
    const result = get(response, 'body.data.createAddress');
    expect(result).toBeTruthy();
    const { id, ...address } = addressesTable[0];
    expect(dbClient.models.addresses.create.mock.calls.length).toBe(1);
    expect(dbClient.models.addresses.create.mock.calls[0][0]).toEqual({
      ...address,
      latitude: parseFloat(address.latitude),
      longitude: parseFloat(address.longitude)
    });
  });

  it('should have a mutation to delete an address', async () => {
    jest.spyOn(dbClient.models.addresses, 'destroy');
    const response = await getResponse(deleteAddressMutation);
    const result = get(response, 'body.data.deleteAddress');
    expect(result).toBeTruthy();
    expect(dbClient.models.addresses.destroy.mock.calls.length).toBe(1);
    expect(dbClient.models.addresses.destroy.mock.calls[0][0]).toEqual({
      where: {
        deletedAt: null,
        id: parseInt(addressesTable[0].id)
      }
    });
  });

  it('should have a mutation to update a new address', async () => {
    jest.spyOn(dbClient.models.addresses, 'update');
    const response = await getResponse(updateAddressMutation);
    const result = get(response, 'body.data.updateAddress');
    expect(result).toBeTruthy();
    expect(dbClient.models.addresses.update.mock.calls.length).toBe(1);
    console.log(dbClient.models.addresses.update.mock.calls[0][0]);
    expect(dbClient.models.addresses.update.mock.calls[0][0]).toEqual({
      id: addressesTable[0].id.toString(),
      address1: addressesTable[0].address1,
      address2: addressesTable[0].address2,
      latitude: parseFloat(addressesTable[0].latitude),
      longitude: parseFloat(addressesTable[0].longitude)
    });
    expect(dbClient.models.addresses.update.mock.calls[0][1]).toEqual({
      where: {
        id: addressesTable[0].id.toString(),
        deletedAt: null
      }
    });
  });
});
