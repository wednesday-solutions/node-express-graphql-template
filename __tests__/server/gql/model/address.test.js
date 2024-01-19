const { closeRedisConnection } = require('@server/services/redis');
const { getMockDBEnv, getResponse } = require('@server/utils/testUtils');
const { get } = require('lodash');

const createAddressMutation = `
  mutation {
    createAddress(
      latitude: 123.456,
      longitude: -78.90,
      address1: "123 Main St",
      address2: "France",
      city: "Sample City",
      country: "Sample Country"
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
    }
  }
`;

describe('Integration test for createAddress mutation', () => {
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

  it('should create an address', async () => {
    const response = await getResponse(createAddressMutation);

    // Assuming your mutation returns the created address
    const createdAddress = get(response, 'body.data.createAddress');

    // Perform assertions based on the response
    expect(createdAddress).toBeTruthy();
    expect(createdAddress.id).toBeTruthy();
    expect(createdAddress.address1).toBe('123 Main St');
    expect(createdAddress.address2).toBe('France');
    expect(createdAddress.city).toBe('Sample City');
    expect(createdAddress.country).toBe('Sample Country');
    expect(createdAddress.latitude).toBe(123.456);
    expect(createdAddress.longitude).toBe(-78.9);
    expect(createdAddress.createdAt).toBeTruthy();
    expect(createdAddress.updatedAt).toBeTruthy();
    expect(createdAddress.deletedAt).toBeNull();
  });
});
