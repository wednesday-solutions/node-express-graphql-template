import moment from 'moment';
import { QueryTypes } from 'sequelize';
import { addWhereClause } from '@utils';
import { TIMESTAMP } from '@utils/constants';
import { getEarliestCreatedDate } from '@server/daos/purchasedProducts';
import { redis } from '@server/services/redis';
import { sendMessage } from '@server/services/slack';
import { logger } from '@server/utils';

export const handleAggregateQueries = (args, tableName) => {
  let where = ``;
  let join = ``;
  const addQuery = suffix => (tableName ? `${tableName}.` : '') + suffix;
  if (args?.startDate) {
    where = addWhereClause(where, `${addQuery(`created_at`)} > :startDate`);
  }
  if (args?.endDate) {
    where = addWhereClause(where, `${addQuery(`created_at`)} < :endDate`);
  }
  if (args?.category) {
    join = `LEFT JOIN products on products.id=purchased_products.product_id`;
    where = addWhereClause(where, `products.category = :category`);
  }
  return { where, join };
};
export const queryOptions = args => ({
  replacements: {
    type: QueryTypes.SELECT,
    startDate: moment(args?.startDate).format(TIMESTAMP),
    endDate: moment(args?.endDate).format(TIMESTAMP),
    category: args?.category
  },
  type: QueryTypes.SELECT
});

export const queryRedis = async (type, args) => {
  let startDate;
  let endDate;
  let count = 0;
  if (!args?.startDate) {
    const createdAtDates = await getEarliestCreatedDate();
    startDate = createdAtDates;
  } else {
    startDate = args.startDate.toISOString().split('T')[0];
  }
  if (!args?.endDate) {
    endDate = moment().format('YYYY-MM-DD');
  } else {
    endDate = args.endDate.toISOString().split('T')[0];
  }
  const key = args?.category ? `${startDate}_${args.category}` : `${startDate}_total`;
  while (startDate <= endDate) {
    let aggregateData;
    const totalForDate = await redis.get(key);
    if (totalForDate) {
      try {
        aggregateData = JSON.parse(totalForDate);
        count += Number(aggregateData[type]);
      } catch (err) {
        sendMessage(`Error while parsing data for ${key} as got value ${totalForDate}`);
        logger().info(`Error while parsing data for ${key} as got value ${totalForDate}`);
      }
    }
    startDate = moment(startDate)
      .add(1, 'day')
      .format('YYYY-MM-DD');
  }
  return count;
};
