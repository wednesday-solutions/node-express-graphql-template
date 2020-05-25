import { GraphQLObjectType, GraphQLInt, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import moment from 'moment';
import { QueryTypes } from 'sequelize';
import escape from 'pg-escape';
import { client } from 'database';
import { addWhereClause } from 'utils';

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
              let where = ``;
              if (args?.startDate) {
                where = addWhereClause(where, `created_at > :startDate`);
              }
              if (args?.endDate) {
                where = addWhereClause(where, `created_at < :endDate`);
              }
              return (await client.query(escape(`${query} ${where};`), {
                replacements: {
                  type: QueryTypes.SELECT,
                  startDate: moment(args.startDate).format('YYYY-MM-DD HH:mm:ss'),
                  endDate: moment(args.endDate).format('YYYY-MM-DD HH:mm:ss')
                },
                type: QueryTypes.SELECT
              }))[0].max;
            }
          }
        })
      }),
      resolve: args => args
    },
    total: {
      type: new GraphQLObjectType({
        name: 'TotalPriceOfPurchasedItems',
        fields: () => ({
          purchasedItems: {
            type: GraphQLFloat,
            resolve: async args => {
              const query = `SELECT SUM(price) from purchased_items`;
              let where = ``;
              if (args?.startDate) {
                where = addWhereClause(where, `created_at > :startDate`);
              }
              if (args?.endDate) {
                where = addWhereClause(where, `created_at < :endDate`);
              }
              return (await client.query(escape(`${query} ${where};`), {
                replacements: {
                  type: QueryTypes.SELECT,
                  startDate: moment(args.startDate).format('YYYY-MM-DD HH:mm:ss'),
                  endDate: moment(args.endDate).format('YYYY-MM-DD HH:mm:ss')
                },
                type: QueryTypes.SELECT
              }))[0].sum;
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
    endDate: { type: GraphQLDateTime }
  },
  resolve: (_, args) => args
};
export { AggregateType as Aggregate };
