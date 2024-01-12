const { setRedisData, getRedisData, closeRedisConnection } = require('@server/services/redis');
const { getMockDBEnv, getResponse } = require('@server/utils/testUtils');
const { get } = require('lodash');

const getProductsQueryWhere = `
query products{
  products(limit: 10, offset: 1){
    edges{
      node{
        id
        name
      }
    }
  }
}
`;

describe('Integration test for products', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.unmock('@database');
    jest.unmock('@database/models');
    jest.unmock('ioredis');
    process.env = { ...OLD_ENV };
    process.env = { ...process.env, ...getMockDBEnv(), REDIS_PORT: 6380 };
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    await closeRedisConnection(); // avoid jest open handle error
  });

  it('should check and get products', async () => {
    const response = await getResponse(getProductsQueryWhere);
    const productResult = get(response, 'body.data.products.edges');
    expect(productResult?.length).toBeGreaterThan(0);
    expect(productResult[0].node).toMatchObject({
      id: expect.anything(),
      name: expect.any(String)
    });
  });

  it('should set and get data from redis', async () => {
    const testKey = 'product';
    const testValue = 'test';
    await setRedisData(testKey, testValue);
    const result = await getRedisData(testKey);
    expect(result).toBe(testValue);
  });
});
