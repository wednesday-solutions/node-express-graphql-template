import { getResponse, mockDBClient, resetAndMockDB } from '@server/utils/testUtils';

describe('Aggregate query tests', () => {
  let type;
  let category;
  const input = `startDate: "0001-12-03T10:15:30Z", endDate: "3020-12-03T10:15:30Z", category:"general"`;
  let mocks;
  const result = {
    sum: 3499714200,
    count: 1000,
    max: 9999
  };
  let dbClient;
  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    mocks = {
      handleAggregateQueries: jest.fn(() => ({ where: '', join: '' })),
      queryOptions: jest.fn(() => ({})),
      queryRedis: jest.fn(() => ({}))
    };
    jest.doMock('../purchasedProductsUtils', () => ({
      ...mocks
    }));
    jest.spyOn(dbClient.client, 'query');
  });

  it('should call query redis with the given type as total and args for sum query', async () => {
    type = 'total';
    category = 'Sports';
    const query = `query Query {
      aggregate(category: "${category}") {
        ${type} {
          purchasedProductsPrice
        }
      }
    }`;

    await getResponse(query);
    expect(mocks.queryRedis.mock.calls.length).toBe(1);
    expect(mocks.queryRedis.mock.calls[0]).toEqual([`${type}`, { category: `${category}` }]);
  });
  it('should call query redis with the given type as count and args for count query', async () => {
    type = 'count';
    const query = `query Query {
      aggregate {
        ${type} {
          purchasedProducts
        }
      }
    }`;

    await getResponse(query);
    expect(mocks.queryRedis.mock.calls.length).toBe(1);
    expect(mocks.queryRedis.mock.calls[0]).toEqual([`${type}`, {}]);
  });
  it('should be able to get the max purchasedProducts', async () => {
    dbClient.client.$queueResult([{ max: result.max }]);
    const res = await getResponse(`query Aggregate {
      aggregate (${input}){
        max {
          purchasedProductsPrice
        }
      }
    }`);
    expect(res.body.data.aggregate.max.purchasedProductsPrice).toEqual(result.max);

    expect(dbClient.client.query.mock.calls.length).toEqual(1);
    expect(dbClient.client.query.mock.calls[0][0]).toContain('SELECT MAX(price) from purchased_products');

    expect(mocks.handleAggregateQueries.mock.calls.length).toEqual(1);
    expect(mocks.queryOptions.mock.calls.length).toEqual(1);
  });
  it('should  return 0 if it fails to get a value from the query', async () => {
    dbClient.client.$queueResult([{ max: 0 }]);
    const res = await getResponse(`query Aggregate {
      aggregate (${input}){
        max {
          purchasedProductsPrice
        }
      }
    }`);
    expect(res.body.data.aggregate.max.purchasedProductsPrice).toEqual(0);
    expect(dbClient.client.query.mock.calls.length).toEqual(1);
  });
});
