import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('aggregations', () => {
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
      queryOptions: jest.fn(() => ({}))
    };
    jest.doMock('../purchasedProductsUtils', () => ({
      ...mocks
    }));
    jest.spyOn(dbClient.client, 'query');
  });

  it('should be able to get the total purchasedProducts', async () => {
    dbClient.client.$queueResult([{ sum: result.sum }]);
    const res = await getResponse(`query Aggregate {
      aggregate (${input}){
        total {
          purchasedProductsPrice  
        }
      }
    }`);
    expect(res.body.data.aggregate.total.purchasedProductsPrice).toEqual(result.sum);

    expect(dbClient.client.query.mock.calls.length).toEqual(1);
    expect(dbClient.client.query.mock.calls[0][0]).toContain('SELECT SUM(price) from purchased_products');

    expect(mocks.handleAggregateQueries.mock.calls.length).toEqual(1);
    expect(mocks.queryOptions.mock.calls.length).toEqual(1);
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

  it('should be able to get the count purchasedProducts', async () => {
    dbClient.client.$queueResult([{ count: result.count }]);
    const res = await getResponse(`query Aggregate {
      aggregate(${input}) {
        count {
          purchasedProducts  
        }
      }
    }`);

    expect(res.body.data.aggregate.count.purchasedProducts).toEqual(result.count);
    expect(dbClient.client.query.mock.calls.length).toEqual(1);
    expect(dbClient.client.query.mock.calls[0][0]).toContain('SELECT COUNT(*) from purchased_products');

    expect(mocks.handleAggregateQueries.mock.calls.length).toEqual(1);
    expect(mocks.queryOptions.mock.calls.length).toEqual(1);
  });

  it('should  return 0 if it fails to get a value from the query', async () => {
    dbClient.client.$queueResult([{}]);
    dbClient.client.$queueResult([{}]);
    dbClient.client.$queueResult([{}]);
    const res = await getResponse(`query Aggregate {
      aggregate(${input}) {
        count {
          purchasedProducts  
        }
        max {
          purchasedProductsPrice  
        }
        total {
          purchasedProductsPrice
        }
      }
    }`);

    expect(res.body.data.aggregate.count.purchasedProducts).toEqual(0);
    expect(res.body.data.aggregate.total.purchasedProductsPrice).toEqual(0);
    expect(res.body.data.aggregate.max.purchasedProductsPrice).toEqual(0);
    expect(dbClient.client.query.mock.calls.length).toEqual(3);
  });
});
