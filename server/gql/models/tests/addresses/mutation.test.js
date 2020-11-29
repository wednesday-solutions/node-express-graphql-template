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
      lat: ${addressesTable[0].lat}
      long: ${addressesTable[0].long}
    ) {
      id
      address1
      address2
      city
      country
      lat
      long
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

  it('should have a mutation to create a new address', async () => {
    jest.spyOn(dbClient.models.addresses, 'create');
    const response = await getResponse(createAddressMut);
    const result = get(response, 'body.data.createAddress');
    expect(result).toBeTruthy();
    const { id, ...address } = addressesTable[0];
    expect(dbClient.models.addresses.create.mock.calls.length).toBe(1);
    expect(dbClient.models.addresses.create.mock.calls[0][0]).toEqual({
      ...address,
      lat: parseFloat(address.lat),
      long: parseFloat(address.long)
    });
  });
});
