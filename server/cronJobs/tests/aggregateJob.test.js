import { redis } from '@server/services/redis';
import * as utils from '@server/utils';
import * as purchasedProductsQueries from '@daos/purchasedProducts';
import { REDIS_IMPLEMENTATION_DATE } from '@server/utils/constants';
import { aggregateCheck } from '../aggregateJob';
import moment from 'moment';
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
  it('should calculate and set values from the lastSyncFor date to the end date if lastSyncFor date is less than endDate', async () => {
    db.purchasedProducts.count = () => [{ count: 1 }];
    require('@daos/purchasedProducts');
    jest
      .spyOn(redis, 'get')
      .mockReturnValueOnce(
        moment('16-03-2022', 'DD-MM-YYYY')
          .subtract(2, 'day')
          .format('YYYY-MM-DD')
      )
      .mockReturnValueOnce(JSON.stringify(['Shoes', 'Health']));
    const spy = jest.spyOn(redis, 'set');
    await aggregateCheck();
    expect(spy).toBeCalledTimes(6);
  });
});
