import { getAllCategories } from '@server/daos/products';
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
import moment from 'moment';

export const aggregateCheck = async () => {
  let startDate;
  const previousDate = moment()
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
  const endDate = REDIS_IMPLEMENTATION_DATE || previousDate;
  const lastSyncFor = await redis.get('lastSyncFor');
  if (!lastSyncFor) {
    startDate = await getEarliestCreatedDate();
  } else if (lastSyncFor !== endDate) {
    startDate = lastSyncFor;
  } else {
    startDate = moment(endDate)
      .add(1, 'day')
      .format('YYYY-MM-DD');
    logger().info(`Redis is updated with aggregate values untill ${endDate}`);
  }
  const categories = await getAllCategories();
  while (startDate <= endDate) {
    const totalForDate = await getTotalByDate(startDate);
    const countForDate = await getCountByDate(startDate);
    redis.set(
      `${startDate}_total`,
      JSON.stringify({
        total: totalForDate || 0,
        count: countForDate || 0
      })
    );
    categories.forEach(async category => {
      const categoryTotal = await getTotalByDateForCategory(startDate, category);
      const categoryCount = await getCountByDateForCategory(startDate, category);
      redis.set(
        `${startDate}_${category}`,
        JSON.stringify({
          total: categoryTotal || 0,
          count: categoryCount || 0
        })
      );
    });
    await redis.set('lastSyncFor', startDate);
    startDate = moment(startDate)
      .add(1, 'day')
      .format('YYYY-MM-DD');
  }
};
