import * as graphql from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';

import { nodeInterface } from 'server/node';
import { StoreItemConnection } from './storeItems';
import { SupplierItemConnection } from './supplierItems';
import { timestamps } from './timestamps';

const Item = new graphql.GraphQLObjectType({
    name: 'Item',
    description: 'items on sale',
    sqlTable: 'items',
    uniqueKey: 'id',
    interface: [nodeInterface],
    sqlPaginate: true,
    orderBy: 'id',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
        category: { type: graphql.GraphQLString },
        amount: { type: graphql.GraphQLInt },
        ...timestamps,
        supplierItems: {
            description: 'A list of suppliers that have this item',
            type: SupplierItemConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlBatch: {
                thisKey: 'item_id',
                parentKey: 'id'
            }
        },
        storeItems: {
            type: StoreItemConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlJoin: (itemTable, storeItemsTable, args) =>
                `${itemTable}.id = ${storeItemsTable}.item_id`
        }
    })
});

Item._typeConfig = {
    sqlTable: 'items',
    uniqueKey: 'id'
};

const { connectionType: ItemConnection } = connectionDefinitions({
    nodeType: Item,
    name: 'item',
    connectionFields: {
        total: {
            type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
    }
});

export { Item, ItemConnection };
