import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import moment from 'moment';
import { QueryTypes } from 'sequelize';
import escape from 'pg-escape';
import { client } from 'database';
import { handleAggregateQueries } from './purchasedItemsUtils';

const Aggregate = new GraphQLObjectType({
  name: 'Aggregate',
  fields: () => ({
    max: {
      type: new GraphQLObjectType({
        name: 'MaxPriceOfPurchasedItems',
        fields: () => ({
          purchasedItems: {
            type: GraphQLInt,
            resolve: async args => {
              const query = `SELECT MAX(price) from purchased_items`;
              const { where, join } = handleAggregateQueries(args);
              return (
                (await client.query(escape(`${query} ${join} ${where};`), {
                  replacements: {
                    type: QueryTypes.SELECT,
                    startDate: moment(args.startDate).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: moment(args.endDate).format('YYYY-MM-DD HH:mm:ss')
                  },
                  type: QueryTypes.SELECT
                }))[0].max || 0
              );
            }
          }
        }),
        resolve: args => args
      })
    },
    total: {
      type: new GraphQLObjectType({
        name: 'TotalPriceOfPurchasedItems',
        fields: () => ({
          purchasedItems: {
            type: GraphQLFloat,
            resolve: async args => {
              const query = `SELECT SUM(price) from purchased_items`;
              const { where, join } = handleAggregateQueries(args);
              return (
                (await client.query(escape(`${query} ${join} ${where};`), {
                  replacements: {
                    type: QueryTypes.SELECT,
                    startDate: moment(args.startDate).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: moment(args.endDate).format('YYYY-MM-DD HH:mm:ss'),
                    category: args?.category
                  },
                  type: QueryTypes.SELECT
                }))[0].sum || 0
              );
            }
          }
        })
      }),
      resolve: args => args
    }
  })
});

const AggregateType = {
  type: Aggregate,
  args: {
    startDate: { type: GraphQLDateTime },
    endDate: { type: GraphQLDateTime },
    category: { type: GraphQLString }
  },
  resolve: (_, args) => args
};
export { AggregateType as Aggregate };
