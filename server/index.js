import express from 'express';
import graphqlHTTP from 'express-graphql';
import * as graphql from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import dotenv from 'dotenv';
import joinMonster from 'join-monster';
import { client, connect } from 'database';
import { Item, ItemConnection } from 'models/items';
import { PurchasedItem, PurchasedItemConnection } from 'models/purchasedItems';
import { Address, AddressConnection } from 'models/addresses';
import { StoreItem, StoreItemConnection } from 'models/storeItems';
import { Store, StoreConnection } from 'models/stores';
import { Supplier, SupplierConnection } from 'models/suppliers';
import { SupplierItem, SupplierItemConnection } from 'models/supplierItems';
import { nodeField } from './node';

const DB_TABLES = {
    Item,
    PurchasedItem,
    Address,
    StoreItem,
    Store,
    Supplier,
    SupplierItem
};

const CONNECTIONS = {
    Item: ItemConnection,
    PurchasedItem: PurchasedItemConnection,
    Address: AddressConnection,
    StoreItem: StoreItemConnection,
    Store: StoreConnection,
    Supplier: SupplierConnection,
    SupplierItem: SupplierItemConnection
};

const dotEnvFile = `.env.${process.env.ENVIRONMENT}`;

dotenv.config({ path: dotEnvFile });

connect();
const options = { dialect: 'pg' };
const addQueries = () => {
    const query = {};
    Object.keys(DB_TABLES).forEach(table => {
        query[camelCase(table)] = {
            type: DB_TABLES[table],
            args: {
                id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
            },
            where: (t, args, context) => `${t}.id = ${args.id}`,
            resolve: (parent, args, context, resolveInfo) =>
                joinMonster(resolveInfo, {}, sql => client.query(sql))
        };
        query[pluralize(camelCase(table))] = {
            type: CONNECTIONS[table],
            args: {
                first: {
                    type: graphql.GraphQLInt
                },
                after: {
                    type: graphql.GraphQLString
                },
                before: {
                    type: graphql.GraphQLString
                }
            },
            sqlPaginate: true,
            orderBy: 'id',
            resolve: (parent, args, context, resolveInfo) =>
                joinMonster(resolveInfo, {}, sql => client.query(sql), options)
        };
    });
    return query;
};

const QueryRoot = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        ...addQueries()
    })
});

const schema = new graphql.GraphQLSchema({ query: QueryRoot });

const app = express();
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true
    })
);
app.listen(9000);

export { app };
