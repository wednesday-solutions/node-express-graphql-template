const { closeRedisConnection } = require('@server/services/redis');
const { getMockDBEnv, getResponse } = require('@server/utils/testUtils');
const { get } = require('lodash');

function getAddressWithSuppliers(
  limit,
  offset,
  fields = ['id', 'address1', 'address2', 'city', 'country', 'latitude', 'longitude']
) {
  return `
  query Query {
    addresses(limit: ${limit}, offset: ${offset}) {
      edges {
        node {
          ${fields.map(field => field)} 
          createdAt
          updatedAt
          deletedAt
          suppliers {
            edges {
              node {
                id
                name
                addressId
                createdAt
                updatedAt
                deletedAt
              }
            }
          }
        }
      }
    }
  }
  `;
}

function getOneAddressWithSuppliers(
  fields = ['id', 'address1', 'address2', 'city', 'country', 'latitude', 'longitude']
) {
  return `
  query Address {
    address {
      ${fields.map(field => field)}
      createdAt
      updatedAt
      deletedAt
      suppliers {
        edges {
          node {
            id
            name
            addressId
            createdAt
            updatedAt
            deletedAt
          }
        }
      }
    }
  }  `;
}

function getAddressWithStoresList(
  limit,
  offset,
  fields = ['id', 'address1', 'address2', 'city', 'country', 'latitude', 'longitude']
) {
  return `
  query Query {
    addresses(limit: ${limit}, offset: ${offset}) {
      edges {
        node {
          ${fields.map(field => field)} 
          createdAt
          updatedAt
          deletedAt
          stores {
            edges {
              node {
                id
                name
                addressId
                createdAt
                updatedAt
                deletedAt
              }
            }
          }
        }
      }
    }
  }
  `;
}

describe('Integration test to get address and suppliers for the address query', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.unmock('@database');
    jest.unmock('@database/models');
    jest.unmock('ioredis');
    process.env = { ...OLD_ENV };
    process.env = { ...process.env, ...getMockDBEnv() };
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    await closeRedisConnection(); // avoid jest open handle error
  });

  it('Should fetch addresses with supplier details for given limit and offset', async () => {
    const limit = 10;
    const offset = 0;
    const response = await getResponse(getAddressWithSuppliers(limit, offset));

    const addressAndSuppliers = get(response, 'body.data.addresses.edges');
    // Perform assertions based on the response
    expect(addressAndSuppliers).toBeTruthy();
    expect(addressAndSuppliers.length).toBeGreaterThan(0);
    expect(addressAndSuppliers.length).toBe(limit);

    const firstAddress = addressAndSuppliers[0].node;

    // Address details
    expect(firstAddress).toHaveProperty('id');
    expect(firstAddress).toHaveProperty('address1');
    expect(firstAddress).toHaveProperty('address2');
    expect(firstAddress).toHaveProperty('city');
    expect(firstAddress).toHaveProperty('country');
    expect(firstAddress).toHaveProperty('latitude');
    expect(firstAddress).toHaveProperty('longitude');
    expect(firstAddress).toHaveProperty('createdAt');
    expect(firstAddress).toHaveProperty('updatedAt');
    expect(firstAddress).toHaveProperty('deletedAt');
    expect(firstAddress.address1).toBe('Pacocha Corner');
    expect(firstAddress.address2).toBe('5165 Molly Isle');
    expect(firstAddress.city).toBe('East Annefort');
    expect(firstAddress.country).toBe('Monaco');
    expect(firstAddress.latitude).toBe(-52.7322);
    expect(firstAddress.longitude).toBe(-10.0744);

    // First supplier details
    const supplierDetails = get(firstAddress, 'suppliers.edges');
    const firstSupplierDetails = supplierDetails[0].node;
    expect(firstSupplierDetails).toHaveProperty('id');
    expect(firstSupplierDetails.addressId).toBe(1);
    expect(firstSupplierDetails.name).toBe('testSupplier');
  });

  it('Should fetch addresses with store list for given limit and offset', async () => {
    const limit = 10;
    const offset = 0;
    const response = await getResponse(getAddressWithStoresList(limit, offset));

    const addressAndSuppliers = get(response, 'body.data.addresses.edges');
    // Perform assertions based on the response
    expect(addressAndSuppliers).toBeTruthy();
    expect(addressAndSuppliers.length).toBeGreaterThan(0);
    expect(addressAndSuppliers.length).toBe(limit);

    const firstAddress = addressAndSuppliers[0].node;

    // Address details
    expect(firstAddress).toHaveProperty('id');
    expect(firstAddress).toHaveProperty('address1');
    expect(firstAddress).toHaveProperty('address2');
    expect(firstAddress).toHaveProperty('city');
    expect(firstAddress).toHaveProperty('country');
    expect(firstAddress).toHaveProperty('latitude');
    expect(firstAddress).toHaveProperty('longitude');
    expect(firstAddress).toHaveProperty('createdAt');
    expect(firstAddress).toHaveProperty('updatedAt');
    expect(firstAddress).toHaveProperty('deletedAt');
    expect(firstAddress.address1).toBe('Pacocha Corner');
    expect(firstAddress.address2).toBe('5165 Molly Isle');
    expect(firstAddress.city).toBe('East Annefort');
    expect(firstAddress.country).toBe('Monaco');
    expect(firstAddress.latitude).toBe(-52.7322);
    expect(firstAddress.longitude).toBe(-10.0744);

    // First store details
    const storeList = get(firstAddress, 'stores.edges');
    const firstStoreDetails = storeList[0].node;
    expect(firstStoreDetails).toHaveProperty('id');
    expect(firstStoreDetails.addressId).toBe(1);
    expect(firstStoreDetails.name).toBe('testStore');
  });

  it('Should fetch single address with store list', async () => {
    const response = await getResponse(getOneAddressWithSuppliers());

    const firstAddress = get(response, 'body.data.address');
    // Perform assertions based on the response
    expect(firstAddress).toBeTruthy();

    // Address details
    expect(firstAddress).toHaveProperty('id');
    expect(firstAddress).toHaveProperty('address1');
    expect(firstAddress).toHaveProperty('address2');
    expect(firstAddress).toHaveProperty('city');
    expect(firstAddress).toHaveProperty('country');
    expect(firstAddress).toHaveProperty('latitude');
    expect(firstAddress).toHaveProperty('longitude');
    expect(firstAddress).toHaveProperty('createdAt');
    expect(firstAddress).toHaveProperty('updatedAt');
    expect(firstAddress).toHaveProperty('deletedAt');
    expect(firstAddress.address1).toBe('Pacocha Corner');
    expect(firstAddress.address2).toBe('5165 Molly Isle');
    expect(firstAddress.city).toBe('East Annefort');
    expect(firstAddress.country).toBe('Monaco');
    expect(firstAddress.latitude).toBe(-52.7322);
    expect(firstAddress.longitude).toBe(-10.0744);

    // First store details
    const storeList = get(firstAddress, 'suppliers.edges');
    const firstStoreDetails = storeList[0].node;
    expect(firstStoreDetails).toHaveProperty('id');
    expect(firstStoreDetails.addressId).toBe(1);
    expect(firstStoreDetails.name).toBe('testSupplier');
  });
});
