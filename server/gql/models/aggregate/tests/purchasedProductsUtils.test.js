import { QueryTypes } from 'sequelize';
import moment from 'moment';
import { handleAggregateQueries, queryOptions } from '@gql/models/aggregate/purchasedProductsUtils';
import { TIMESTAMP } from '@utils/constants';

describe('handleAggregateQueries', () => {
  it('should the appropriate rawSQL queries based on the args', async () => {
    const tableName = 'table_name';
    const startDateAggregationQuery = handleAggregateQueries({ startDate: 1 }, 'table_name');
    expect(startDateAggregationQuery.where).toContain(`WHERE ( ${tableName}.created_at > :startDate )`);

    const endDateAggregationQuery = handleAggregateQueries({ endDate: 1 });
    expect(endDateAggregationQuery.where).toContain('WHERE ( created_at < :endDate )');

    const categoryAggregationQuery = handleAggregateQueries({ category: 'general' });
    expect(categoryAggregationQuery.where).toContain('WHERE ( products.category = :category )');

    const multiWhereAggregation = handleAggregateQueries({ category: 'general', endDate: 1, startDate: 1 });
    expect(multiWhereAggregation.where).toContain('( products.category = :category )');
    expect(multiWhereAggregation.where).toContain('( created_at < :endDate )');
    expect(multiWhereAggregation.where).toContain('( created_at > :startDate )');
  });
});
describe('queryOptions', () => {
  it('should return object with the correct key value pairs', async () => {
    const category = 'general';
    const res = await queryOptions({ startDate: 0, endDate: 0, category });
    expect(res.replacements).toBeTruthy();
    expect(res.type).toEqual(QueryTypes.SELECT);
    expect(res.replacements.startDate).toBe(moment(0).format(TIMESTAMP));
    expect(res.replacements.endDate).toBe(moment(0).format(TIMESTAMP));
    expect(res.replacements.category).toBe(category);
    expect(res.replacements.type).toEqual(QueryTypes.SELECT);
  });
});
