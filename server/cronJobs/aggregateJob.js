import { redis } from '@server/services/redis';
import { sendMessage } from '@server/services/slack';
import { logger } from '@server/utils';
import moment from 'moment';

export const aggregateCheck = async (job, done) => {
  const previousDate = moment()
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
  const redisTotalAggregate = await redis.get(`${previousDate}_total`);
  if (!redisTotalAggregate) {
    sendMessage(
      `No aggregateValue for total found in redis for date ${previousDate} as got value ${redisTotalAggregate}`
    );
    logger().info(
      `No aggregateValue for total found in redis for date ${previousDate} as got value ${redisTotalAggregate}`
    );
  } else {
    redis.set('lastSyncAt', previousDate);
  }
};
