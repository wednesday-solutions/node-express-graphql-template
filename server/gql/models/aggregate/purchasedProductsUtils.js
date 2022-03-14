import moment from 'moment';
import { QueryTypes } from 'sequelize';
import { addWhereClause } from '@utils';
import { TIMESTAMP } from '@utils/constants';
import { getEarliestCreatedDate } from '@server/daos/purchasedProducts';
import { redis } from '@server/services/redis';

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
    startDate = createdAtDates.toISOString().split('T')[0];
  } else {
    startDate = args.startDate.toISOString().split('T')[0];
  }
  if (!args?.endDate) {
    endDate = moment().format('YYYY-MM-DD');
  } else {
    endDate = args.endDate.toISOString().split('T')[0];
  }
  if (args?.category) {
    do {
      const totalForCategory = await redis.get(`${startDate}_${args.category}`);
      if (totalForCategory) {
        const parsedTotalForCategory = JSON.parse(totalForCategory);
        count += Number(parsedTotalForCategory[type]);
      }
      startDate = moment(startDate)
        .add(1, 'day')
        .format('YYYY-MM-DD');
    } while (startDate <= endDate);
    return count;
  } else {
    while (startDate <= endDate) {
      let jsonTotalForDate;
      const totalForDate = await redis.get(`${startDate}_total`);
      if (totalForDate) {
        jsonTotalForDate = JSON.parse(totalForDate);
        count += Number(jsonTotalForDate[type]);
      }
      startDate = moment(startDate)
        .add(1, 'day')
        .format('YYYY-MM-DD');
    }
    return count;
  }
};
