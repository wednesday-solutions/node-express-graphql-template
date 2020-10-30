import moment from 'moment';
import { QueryTypes } from 'sequelize';
import { addWhereClause } from '@utils';
import { TIMESTAMP } from '@utils/constants';

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
