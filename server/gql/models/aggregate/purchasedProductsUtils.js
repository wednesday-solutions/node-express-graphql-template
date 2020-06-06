import moment from 'moment';
import { QueryTypes } from 'sequelize';
import { addWhereClause, TIMESTAMP } from 'utils';

export const handleAggregateQueries = args => {
  let where = ``;
  let join = ``;
  if (args?.startDate) {
    where = addWhereClause(where, `created_at > :startDate`);
  }
  if (args?.endDate) {
    where = addWhereClause(where, `created_at < :endDate`);
  }
  if (args?.category) {
    join = `LEFT JOIN products on products.id=purchased_products.product_id`;
    where = addWhereClause(where, `category = :category`);
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
