import moment from 'moment';
import { redis } from '@services/redis';
import { aggregateCheck } from '../aggregateJob';
import * as slack from '@server/services/slack';

describe('Aggregate job tests', () => {
  const previousDate = moment()
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
  it('should update the lastSyncAt key in redis if aggregate data is present for previous date', async () => {
    const redisValue = {
      total: '22300',
      count: '10'
    };
    jest.spyOn(redis, 'get').mockImplementation(() => redisValue);
    const setSpy = jest.spyOn(redis, 'set');
    await aggregateCheck();
    expect(setSpy).toBeCalledWith('lastSyncAt', previousDate);
  });
  it('should send out a slack alert and log error if there is no total for aggregate for previous date', async () => {
    jest.spyOn(redis, 'get').mockImplementation(() => null);
    const spy = jest.spyOn(slack, 'sendMessage');
    await aggregateCheck();
    expect(spy).toBeCalledWith(`No aggregateValue for total found in redis for date ${previousDate} as got value null`);
  });
});
