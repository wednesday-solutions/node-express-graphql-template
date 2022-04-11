import { getAllCategories } from '@server/daos/products';
import moment from 'moment';
import {
  getCountByDate,
  getCountByDateForCategory,
  getEarliestCreatedDate,
  getTotalByDate,
  getTotalByDateForCategory
} from '@server/daos/purchasedProducts';
import { redis } from '@server/services/redis';
import { logger } from '@server/utils';
import { REDIS_IMPLEMENTATION_DATE } from '@server/utils/constants';

export const aggregateCheck = async () => {
  let startDate;
  let lastSyncFor;
  const endDate = moment(REDIS_IMPLEMENTATION_DATE);
  const redisValueForLastSync = await redis.get('lastSyncFor');
  if (redisValueForLastSync) {
    lastSyncFor = moment(redisValueForLastSync);
  }
  if (!lastSyncFor) {
    startDate = moment(await getEarliestCreatedDate());
  } else if (moment(lastSyncFor).isSameOrAfter(endDate)) {
    logger().info(`Redis is updated with aggregate values until ${endDate}`);
    return;
  } else {
    startDate = lastSyncFor;
  }
  const categories = await getAllCategories();

  while (moment(startDate).isBefore(endDate)) {
    const totalForDate = await getTotalByDate(startDate);
    const countForDate = await getCountByDate(startDate);
    const formattedDate = startDate.format('YYYY-MM-DD');
    redis.set(
      `${formattedDate}_total`,
      JSON.stringify({
        total: totalForDate,
        count: countForDate
      })
    );
    categories.forEach(async category => {
      const categoryTotal = await getTotalByDateForCategory(startDate, category);
      const categoryCount = await getCountByDateForCategory(startDate, category);
      redis.set(
        `${formattedDate}_${category}`,
        JSON.stringify({
          total: categoryTotal,
          count: categoryCount
        })
      );
      await redis.set('lastSyncFor', formattedDate);
    });
    startDate = startDate.add(1, 'day');
  }
};
