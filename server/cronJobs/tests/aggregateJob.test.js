import { redis } from '@server/services/redis';
import * as utils from '@server/utils';
import * as purchasedProductsQueries from '@daos/purchasedProducts';
import { REDIS_IMPLEMENTATION_DATE } from '@server/utils/constants';
import { aggregateCheck } from '../aggregateJob';
import db from '@database/models';

describe('Aggregate job tests', () => {
  it('should log that everything is jup to date if lastSyncFor is equal to end date', async () => {
    jest.spyOn(redis, 'get').mockReturnValueOnce(REDIS_IMPLEMENTATION_DATE);
    const spy = jest.spyOn(utils, 'logger');
    await aggregateCheck();
    expect(spy).toBeCalledTimes(1);
  });
  it('should calculate and set values in redis if the lastSyncFor date is not present', async () => {
    jest.spyOn(redis, 'get').mockReturnValueOnce();
    const spy = jest.spyOn(purchasedProductsQueries, 'getEarliestCreatedDate');
    await aggregateCheck();
    expect(spy).toBeCalledTimes(1);
  });
  it('should set the startDate to lastSyncFor if the date is less than endDate', async () => {
    const categories = ['Tools', 'Electronics', 'Sports', 'Books', 'Clothing', 'Kids', 'Music'];
    db.purchasedProducts.count = jest.fn().mockImplementation(() => [{ count: 1 }]);
    jest
      .spyOn(redis, 'get')
      .mockReturnValueOnce('2022-03-15')
      .mockReturnValueOnce(JSON.stringify(categories));
    const spy = jest.spyOn(redis, 'set');
    await aggregateCheck();
    expect(spy).toBeCalledTimes(4 + categories.length);
  });
});
