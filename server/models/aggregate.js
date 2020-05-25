import { GraphQLObjectType, GraphQLInt, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { client } from 'database';
import escape from 'pg-escape';

const Aggregate = new GraphQLObjectType({
    name: 'Aggregate',
    fields: () => ({
        max: {
            type: new GraphQLObjectType({
                name: 'MaxPriceOfPurchasedItems',
                fields: () => ({
                    purchasedItems: {
                        type: GraphQLInt,
                        resolve: args => {
                            const query = `SELECT MAX(price) from purchased_items`;
                            let where = ``;
                            const deps = [];
                            if (args?.startDate) {
                                if (isEmpty(where)) {
                                    where += ' WHERE ';
                                } else {
                                    where += ' AND ';
                                }
                                where += ` created_at > $${deps.length + 1} `;
                                deps.push(
                                    moment(args.startDate).format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                );
                            }
                            if (args?.endDate) {
                                if (isEmpty(where)) {
                                    where += ' WHERE ';
                                } else {
                                    where += ' AND ';
                                }
                                where += ` created_at < $${deps.length + 1}`;
                                deps.push(
                                    moment(args.endDate).format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                );
                            }
                            return client
                                .query(escape(`${query} ${where};`), deps)
                                .then(item => item.rows[0].max);
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
                        resolve: args => {
                            const query = `SELECT SUM(price) from purchased_items`;
                            let where = ``;
                            const deps = [];
                            if (args.startDate) {
                                if (isEmpty(where)) {
                                    where += ' WHERE ';
                                } else {
                                    where += ' AND ';
                                }
                                where += ` created_at > $${deps.length + 1} `;
                                deps.push(
                                    moment(args.startDate).format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                );
                            }
                            if (args.endDate) {
                                if (isEmpty(where)) {
                                    where += ' WHERE ';
                                } else {
                                    where += ' AND ';
                                }
                                where += ` created_at < $${deps.length + 1}`;
                                deps.push(
                                    moment(args.endDate).format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                );
                            }
                            return client
                                .query(escape(`${query} ${where};`), deps)
                                .then(item => item.rows[0].sum);
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
