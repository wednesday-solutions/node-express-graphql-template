import { QueryTypes } from 'sequelize';
import moment from 'moment';
import { redis } from '@services/redis';
import { handleAggregateQueries, queryOptions, queryRedis } from '@gql/models/aggregate/purchasedProductsUtils';
import { TIMESTAMP } from '@utils/constants';
import * as utils from '@utils';

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

  describe('query redis tests', () => {
    const args = {
      category: 'Sports'
    };
    const type = 'total';
    it('should calculate the total from earliest created date to todays day-1 if no start and end date is provided', async () => {
      const spy = jest.spyOn(redis, 'get');
      await queryRedis(type);
      expect(spy).toBeCalledWith(`${moment().format('YYYY-MM-DD')}_total`);
    });
    it('should add values from the given start and end dates in args ', async () => {
      const args = {
        startDate: new Date(2022, 2, 1),
        endDate: new Date(2022, 2, 4)
      };
      const spy = jest.spyOn(redis, 'get');
      await queryRedis(type, args);
      expect(spy).toBeCalledTimes(4);
    });
    it('should call the date with category if the category is provided in args', async () => {
      await queryRedis(type, args);
      const spy = jest.spyOn(redis, 'get');
      await queryRedis(type, args);
      expect(spy).toBeCalledWith(`${moment().format('YYYY-MM-DD')}_${args.category}`);
    });
    it('should add the value after getting from Redis and return the total', async () => {
      jest.spyOn(redis, 'get').mockReturnValue(
        JSON.stringify({
          total: 15,
          count: 2
        })
      );
      const res = await queryRedis(type, args);
      expect(res).toBe(15);
    });
    it('should throw  error and also send slack message if there is problem in parsing JSON', async () => {
      jest.spyOn(redis, 'get').mockReturnValue('test');
      const spy = jest.spyOn(utils, 'logger').mockImplementation(() => {
        const obj = {
          info: msg => msg,
          error: err => err
        };
        return obj;
      });
      await queryRedis(type, args);
      expect(spy).toBeCalledTimes(2);
    });
  });
});
